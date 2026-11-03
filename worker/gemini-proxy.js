// Cloudflare Worker: private gateway between Tiflan and Gemini. Your API key never reaches the browser.
// Variables to set in Cloudflare (Settings > Variables and Secrets):
//   GEMINI_API_KEY  (Secret, required)
//   ALLOWED_ORIGIN  (your site exactly, e.g. https://tiflan-screeningvercelapp.vercel.app  with no trailing slash)
//   MODEL           (optional; default gemini-3.8-flash. If Google retires a model, put the new name Google suggests in the error message here)
//   THINKING_LEVEL  (optional: low | medium | high | off. Default "low" for gemini-3.x models = fast replies)
//   THINKING_BUDGET (optional number, ONLY for old gemini-2.5 models; ignored otherwise)
//   TEMPERATURE     (optional; leave unset to use the model default)
const MAX_BODY = 30000;
export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "", allowed = env.ALLOWED_ORIGIN || "*";
    const cors = { "Access-Control-Allow-Origin": allowed, "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "POST,GET,OPTIONS", "Vary": "Origin" };
    const send = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { ...cors, "Content-Type": "application/json" } });
    const model = (env.MODEL || "gemini-3.8-flash").replace(/^models\//, "");
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (req.method === "GET") return send({ ok: true, model, tools: true, keySet: !!env.GEMINI_API_KEY });      // open the Worker address in a browser to check it is alive
    if (req.method !== "POST") return send({ error: "POST only" }, 405);
    if (allowed !== "*" && origin !== allowed) return send({ error: "origin not allowed" }, 403);
    if (!env.GEMINI_API_KEY) return send({ error: "GEMINI_API_KEY is not set" }, 500);
    const raw = await req.text(); if (raw.length > MAX_BODY) return send({ error: "request too large" }, 413);
    let b; try { b = JSON.parse(raw); } catch (e) { return send({ error: "bad json" }, 400); }
    const system = String(b.system || "").slice(0, 8000);
    let contents = b.contents;
    if (!Array.isArray(contents)) {                                           // simple mode: { system, prompt } -> { text }
      if (!b.prompt || String(b.prompt).length > 2000) return send({ error: "bad request" }, 400);
      contents = [{ role: "user", parts: [{ text: String(b.prompt) }] }];
    }
    if (contents.length > 60) return send({ error: "conversation too long" }, 400);
    const payload = { systemInstruction: { parts: [{ text: system }] }, contents, generationConfig: { maxOutputTokens: 1500 } };
    if (env.TEMPERATURE) payload.generationConfig.temperature = Number(env.TEMPERATURE);
    if (Array.isArray(b.tools) && b.tools.length) { payload.tools = [{ functionDeclarations: b.tools.slice(0, 8) }]; if (b.toolConfig) payload.toolConfig = b.toolConfig; }
    const level = env.THINKING_LEVEL === "off" ? "" : env.THINKING_LEVEL || (/^gemini-3/.test(model) ? "low" : "");
    if (level) payload.generationConfig.thinkingConfig = { thinkingLevel: level };                       // Gemini 3.x uses levels
    else if (env.THINKING_BUDGET !== undefined && env.THINKING_BUDGET !== "" && /2\.5/.test(model)) payload.generationConfig.thinkingConfig = { thinkingBudget: Number(env.THINKING_BUDGET) };   // old 2.5 models only
    let r, j;
    try {
      r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY }, body: JSON.stringify(payload) });
      j = await r.json();
    } catch (e) { return send({ error: "upstream unreachable" }, 502); }
    if (!r.ok) return send({ error: (j && j.error && j.error.message) || "upstream error" }, 502);
    const cand = j.candidates && j.candidates[0], content = (cand && cand.content) || { parts: [] };
    const text = (content.parts || []).filter((p) => p.text).map((p) => p.text).join("");
    return send({ text, content, finishReason: cand && cand.finishReason });          // "content" keeps function calls exactly as Gemini sent them
  }
};
