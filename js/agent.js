// AI agent engine: talks to Gemini through your Cloudflare Worker, runs the tool-calling loop, and applies the Guardian.
// Without an aiEndpoint in js/config.js every function here returns null and Tiflan uses its built-in rules.
(() => {
  const VERSION = "27", KEY = "tiflan-ai-endpoint";
  const stored = () => { try { return localStorage.getItem(KEY) || ""; } catch (e) { return ""; } };
  // Address priority: the one saved inside the app on this device (AI sheet) > js/config.js. The value "off" turns AI off on this device.
  const cfg = () => { const s = stored(); if (s === "off") return ""; return s || (window.TIFLAN_CONFIG && window.TIFLAN_CONFIG.aiEndpoint) || ""; };
  const available = () => !!cfg();
  const setEndpoint = (v) => { try { v ? localStorage.setItem(KEY, v) : localStorage.removeItem(KEY); } catch (e) {} applyTrace(); };
  const applyTrace = () => { let p = ""; try { p = localStorage.getItem("tiflan-trace") || ""; } catch (e) {} if (document.body) document.body.classList.toggle("show-trace", p === "1" || (p !== "0" && available())); };
  const log = (agent, msg) => { const T = window.Tiflan || (window.Tiflan = {}); (T._log = T._log || []).push({ t: Date.now(), agent, msg: String(msg).slice(0, 400) }); };
  if (/[?&]trace=1/.test(location.search)) { try { localStorage.setItem("tiflan-trace", "1"); } catch (e) {} }

  async function post(body, ms = 20000) {
    const c = new AbortController(), t = setTimeout(() => c.abort(), ms);
    try { const r = await fetch(cfg(), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: c.signal }); if (!r.ok) { let m = ""; try { m = (await r.json()).error || ""; } catch (e) {} throw new Error(m || "http " + r.status); } return await r.json(); }
    finally { clearTimeout(t); }
  }

  // Guardian Agent: nothing the model writes reaches the mother or child if it sounds like a diagnosis, a disorder name or medical advice.
  const BLOCK = [/dyslex/i, /diagnos/i, /disorder/i, /disabilit/i, /autis/i, /\bADHD\b/i, /your child has\b/i, /suffers? from/i, /medicat/i, /prescri/i,
    /عسر\s*القراءة/, /ديسلكسيا/, /تشخيص/, /اضطراب/, /إعاقة|اعاقة/, /توحد/, /مصاب/, /يعاني\s*من/, /يعانون?\s*من/, /دواء|أدوية/];
  function guard(text) {
    const t = String(text || "").replace(/[*_`#>]/g, "").replace(/\s+/g, " ").trim();
    const hits = BLOCK.filter((r) => r.test(t)).map(String);
    if (hits.length) { log("Guardian Agent", "blocked AI text (" + hits.length + " rule" + (hits.length > 1 ? "s" : "") + ")"); return { text: "", ok: false, hits }; }
    return { text: t.slice(0, 300), ok: true, hits: [] };
  }

  // Tool-calling loop: model -> tool calls -> our handlers run -> results go back -> model continues, until it answers in text.
  async function run({ agent, system, contents, tools, toolConfig, handlers, maxSteps = 5, stopAfterTools = false }) {
    const steps = [];
    for (let i = 0; i < maxSteps; i++) {
      const j = await post({ system, contents, tools, toolConfig });
      const content = j.content && Array.isArray(j.content.parts) ? j.content : { parts: j.text ? [{ text: j.text }] : [] };
      content.role = "model"; contents.push(content);
      const calls = content.parts.filter((p) => p.functionCall), text = content.parts.filter((p) => p.text).map((p) => p.text).join("").trim();
      if (!calls.length) return { text, steps };
      const answers = [];
      for (const p of calls) {
        const { name, args } = p.functionCall; let out;
        try { out = handlers[name] ? await handlers[name](args || {}) : { error: "unknown tool " + name }; } catch (e) { out = { error: String((e && e.message) || e) }; }
        steps.push({ name, args: args || {}, out }); log(agent, "🛠 " + name + "(" + JSON.stringify(args || {}).slice(0, 150) + ") → " + JSON.stringify(out).slice(0, 110));
        answers.push({ functionResponse: Object.assign({ name, response: out }, p.functionCall.id ? { id: p.functionCall.id } : {}) });      // Gemini 3.x: result must carry the call id and name
      }
      contents.push({ role: "user", parts: answers });
      if (stopAfterTools) return { text, steps };
    }
    return { text: "", steps };
  }

  // Orchestrator Agent: decides which game comes next and how hard it should be, from what the child just did.
  const GAME_INFO = { g1: "Follow the Eyes: attention and reaction speed", g2: "Rhyme Nest: sound awareness (which words rhyme)", g3: "Silly Word Echo: repeating made-up words (phonological memory)",
    g4: "Quick Naming Race: naming pictures fast (rapid naming)", g5: "Letter Twins: telling look-alike letters apart, plus tracing", g6: "Sound Detective: matching the first sound of words" };
  async function pickNext({ age, remaining, done, lang }) {
    if (!available()) return null;
    const system = ["You are the Orchestrator of Tiflan, an early-learning screening game for children aged 4-8. Decide the NEXT game and its difficulty, then call start_game exactly once.",
      "Child age: " + age + ". Games still to play: " + remaining.map((id) => id + " = " + GAME_INFO[id]).join("; ") + ".",
      done.length ? "Results so far:\n" + done.join("\n") : "Nothing has been played yet: start with g1 (an easy, fun warm-up) if it is available.",
      "Rules: difficulty_shift is -1 (easier items) if the child struggled (accuracy below about 50%, many missed or very slow answers), +1 (harder) if accuracy is about 90% or more and answers are fast, otherwise 0.",
      "Keep a good mix: do not put two speech games (g3, g4) back to back if another game is available. Give a short, kind reason.",
      "encouragement: one short cheerful sentence for the child (max 10 words) in " + (lang === "ar" ? "Gulf Emirati Arabic" : "simple English") + ". Never mention scores, risk, diagnosis or any disorder."].join("\n");
    const tools = [{ name: "start_game", description: "Start the next game for the child.", parameters: { type: "OBJECT", properties: {
      game_id: { type: "STRING", enum: remaining }, difficulty_shift: { type: "INTEGER", description: "-1 easier, 0 same, 1 harder" }, reason: { type: "STRING" }, encouragement: { type: "STRING" } }, required: ["game_id", "difficulty_shift", "reason"] } }];
    const out = {};
    try { await run({ agent: "Orchestrator", system, contents: [{ role: "user", parts: [{ text: "Choose the next game now." }] }], tools, toolConfig: { functionCallingConfig: { mode: "ANY", allowedFunctionNames: ["start_game"] } }, handlers: { start_game: (a) => { Object.assign(out, a); return { ok: true }; } }, maxSteps: 1, stopAfterTools: true }); }
    catch (e) { log("Orchestrator", "AI unavailable, using the default order (" + ((e && e.message) || e) + ")"); return null; }
    if (!remaining.includes(out.game_id)) { log("Orchestrator", "AI chose an invalid game, using the default order"); return null; }
    const shift = Math.max(-1, Math.min(1, Math.round(Number(out.difficulty_shift) || 0))), say = guard(out.encouragement).text.slice(0, 120);
    return { game_id: out.game_id, shift, reason: String(out.reason || "").slice(0, 200), say };
  }
  // Is the helper alive? Returns { ok, code, model, status }.
  async function check() {
    const url = cfg(); if (!url) return { ok: false, code: "none" };
    try { const r = await fetch(url, { method: "GET" }); if (!r.ok) return { ok: false, code: "http", status: r.status };
      const j = await r.json(); return j.keySet ? { ok: true, code: "ok", model: j.model } : { ok: false, code: "nokey" }; }
    catch (e) { return { ok: false, code: "unreachable" }; }
  }
  // End-to-end test: Browser -> Worker -> Gemini -> back.
  const testChat = async () => { const j = await post({ system: "You are a friendly assistant. Reply with one short sentence in Arabic.", prompt: "Say hello to a mother." }, 20000); return (j.text || "").trim() || "(empty reply)"; };
  applyTrace();
  window.TiflanAgent = { available, endpoint: cfg, setEndpoint, check, testChat, applyTrace, version: VERSION, run, guard, pickNext, log, post };
})();
