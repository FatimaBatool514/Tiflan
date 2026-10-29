// Step 4: Intake Agent. Voice or tap conversation with the mother. Works with or without cloud AI.
(() => {
  const $ = (s) => document.querySelector(s), html = document.documentElement;
  const L = () => html.lang, T = (k) => I18N[L()][k];
  Object.assign(I18N.ar, { in_agent:"طفلان · وكيل الاستقبال", in_ph:"اكتبي إجابتك هنا...", in_done:"شكراً لك!", in_cont:"متابعة إلى الألعاب", in_redo:"إعادة الأسئلة",
    in_note:"هذه المعلومات تساعدنا على فهم الصورة، وهي ليست تشخيصاً.", in_listen:"أسمعك...", in_idle:"جاهز", in_speak:"يتحدث",
    in_ai_on:"الذكاء الاصطناعي السحابي مفعّل: يُرسل نص الإجابة فقط، بلا اسم ولا رمز.", in_ai_off:"الأسئلة تعمل بقواعد على جهازك، بلا ذكاء سحابي.",
    in_stt:"قد يعالج المتصفح الصوت عبر خدمة سحابية. لا نحفظ أي تسجيل.", in_nomic:"المتصفح لا يدعم التعرف على الصوت. اكتبي أو اختاري من الأزرار.",
    in_deny:"لم يُسمح بالميكروفون. اكتبي أو اختاري من الأزرار.", in_nomatch:"ما فهمت تماماً، اختاري أقرب إجابة من الأزرار.", in_flags:"نقاط للمتابعة", step5:"الألعاب تأتي في الخطوة 5." });
  Object.assign(I18N.en, { in_agent:"Tiflan · Intake Agent", in_ph:"Type your answer here...", in_done:"Thank you!", in_cont:"Continue to the games", in_redo:"Redo the questions",
    in_note:"This information helps us see the full picture. It is not a diagnosis.", in_listen:"Listening...", in_idle:"Ready", in_speak:"Speaking",
    in_ai_on:"Cloud AI is on: only the answer text is sent, with no name or ID.", in_ai_off:"Questions run on rules in your browser, with no cloud AI.",
    in_stt:"Your browser may process speech through a cloud service. We store no recordings.", in_nomic:"This browser has no speech recognition. Type or tap a button.",
    in_deny:"Microphone access was denied. Type or tap a button.", in_nomatch:"I didn't quite get that. Please tap the closest answer.", in_flags:"Follow-up points", step5:"The games arrive in Step 5." });
  I18N.ar.go = "ابدئي المحادثة مع طفلان";

  const o = (v, ar, en, f, kw) => ({ v, ar, en, f, kw });
  const NO = ["لا", "لأ", "no", "nope"], YES = ["اي", "ايه", "ايوه", "نعم", "في", "yes", "yeah"], UNS = ["مدري", "ما ادري", "ما اذكر", "not sure", "remember", "dont know"];
  const Q = [
    { id:"words", ar:"متى بدا طفلج ينطق أول كلماته؟", en:"When did your child say their first words?", opts:[
      o("late","تأخر شوي","A bit late",1,["تاخر","متاخر","بطي","late","delay","slow"]), o("unsure","ما أذكر","I don't remember",0,UNS),
      o("ontime","بوقتها","On time",0,["بوقت","طبيع","عادي","normal","on time","early"])]},
    { id:"family", ar:"في أحد من العائلة عنده صعوبة في القراءة أو التعلم؟", en:"Does anyone in the family have reading or learning difficulties?", opts:[
      o("unsure","مدري","Not sure",0,UNS), o("no","لا","No",0,NO), o("yes","إي، في","Yes",1,YES.concat(["اخوه","ابوه","father","brother","dyslexia"]))]},
    { id:"senses", ar:"طفلج يعاني من التهابات أذن متكررة أو يحتاج نظارة؟", en:"Does your child have frequent ear infections or need glasses?", opts:[
      o("no","لا","No",0,NO), o("yes","إي","Yes",1,YES.concat(["التهاب","نظار","ear","glasses"]))]},
    { id:"letters", ar:"يخلط بين الحروف المتشابهة مثل ب وت وث، أو يتجنب القراءة؟", en:"Does your child mix up look-alike letters, or avoid reading?", opts:[
      o("notyet","لسا ما يقرا","Not reading yet",0,["لسا","صغير","not yet"]), o("often","كثير","Often",2,["كثير","دايم","دائم","always","often"]),
      o("some","أحياناً","Sometimes",1,["احيان","شوي","sometimes","little"]), o("never","ما أشوف هالشي","Never",0,["ابد","never"].concat(NO))]},
    { id:"clarity", ar:"الناس برا العائلة يفهمون كلام طفلج؟", en:"Can people outside the family understand your child's speech?", opts:[
      o("no","صعب","Hard to understand",2,["مو واضح","ما يفهم","صعب","hard","difficult"]), o("partly","شوي","Partly",1,["احيان","شوي","بعض","partly","sometimes"]),
      o("yes","إي، واضح","Yes, clearly",0,["واضح","ايه","اي","نعم","yes","clear"])]},
    { id:"attention", ar:"يتشتت بسرعة أو يتعب وهو يلعب أو يسوي واجباته؟", en:"Does your child get distracted or tired quickly while playing or doing homework?", opts:[
      o("often","كثير","Often",2,["كثير","دايم","دائم","always","often"]), o("some","أحياناً","Sometimes",1,["احيان","شوي","sometimes"]), o("rare","نادراً","Rarely",0,["نادر","قليل","rarely","never","ابد"])]},
    { id:"other", open:true, ar:"في شي ثاني يقلقج؟ قولي لي بكلماتج.", en:"Is there anything else that worries you? Tell me in your own words.", opts:[
      o("none","ما في شي","Nothing else",0,["ما في","ما عندي","nothing","no"])]}
  ];
  const GREET = { ar:"هلا والله! أنا طفلان. بسألج كم سؤال بسيط عن طفلج، وتقدرين تجاوبين بصوتج أو تضغطين على الزر.", en:"Hello! I'm Tiflan. I'll ask a few simple questions about your child. You can answer by voice or tap a button." };
  const ACKS = { ar:["تمام، سجّلت.","شكراً لج، هذا يساعدنا.","حلو، نكمل."], en:["Got it, noted.","Thank you, that helps.","Great, let's continue."] };
  const CLOSE = { ar:"شكراً لج على وقتج. الحين نبدأ الألعاب مع طفلج، وهي بسيطة وممتعة.", en:"Thank you for your time. Now let's start the games with your child. They are simple and fun." };
  const STT = { gulf:"ar-AE", egy:"ar-EG", lev:"ar-JO", mag:"ar-MA", msa:"ar-SA", en:"en-US" };

  const norm = (s) => s.toLowerCase().replace(/[\u064B-\u0652\u0640]/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/[^\u0600-\u06FFa-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  function match(q, text) {
    const t = norm(text), toks = t.split(" ");
    for (const op of q.opts) for (const k of op.kw) {
      const nk = norm(k);
      if (nk.includes(" ") ? t.includes(nk) : toks.some((w) => (nk.length < 3 ? w === nk : w.startsWith(nk)))) return op;
    }
    return null;
  }
  window.TiflanMatch = { match, norm, Q };

  const cfg = () => (window.TIFLAN_CONFIG && window.TIFLAN_CONFIG.aiEndpoint) || "";
  async function ai(system, prompt) {
    if (!cfg()) return null;
    try {
      const c = new AbortController(); const t = setTimeout(() => c.abort(), 6000);
      const r = await fetch(cfg(), { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ system, prompt }), signal: c.signal });
      clearTimeout(t); const j = await r.json(); return (j.text || "").trim() || null;
    } catch (e) { return null; }
  }
  const log = (a, m) => { (window.Tiflan._log = window.Tiflan._log || []).push({ t: Date.now(), agent: a, msg: m }); };

  let idx = 0, ans = {}, busy = false, voiceOn = true, listening = false, rec = null;
  const sttLang = () => (L() === "en" ? "en-US" : STT[(window.Tiflan.profile() || { child: {} }).child.dialect] || "ar-AE");
  const setStatus = (k) => { $("#inStatus").textContent = T(k); $("#avatar").classList.toggle("speaking", k === "in_speak"); };

  function speak(text) {
    if (!voiceOn || !window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text), l = sttLang(); u.lang = l; u.rate = 0.9; u.pitch = 1.1; u.volume = 1;
    const vs = speechSynthesis.getVoices();
    const sv = (() => { try { return (JSON.parse(localStorage.getItem("tiflan-voice")) || {})[l.slice(0, 2) === "en" ? "en" : "ar"] || ""; } catch (e) { return ""; } })(); u.voice = vs.find((v) => sv && v.name === sv) || vs.find((v) => v.lang.replace("_", "-") === l) || vs.find((v) => v.lang.slice(0, 2) === l.slice(0, 2)) || null;
    u.onstart = () => setStatus("in_speak"); u.onend = u.onerror = () => setStatus("in_idle");
    speechSynthesis.speak(u);
  }
  function bubble(text, who) {
    const d = document.createElement("div"); d.className = "bub " + who; d.textContent = text;
    $("#chat").appendChild(d); $("#chat").scrollTop = $("#chat").scrollHeight;
  }
  const agent = (t, say = true) => { bubble(t, "ag"); if (say) speak(t); };

  function chips() {
    const q = Q[idx], box = $("#qChips"); box.innerHTML = "";
    if (!q) return;
    q.opts.forEach((op) => { const b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.textContent = op[L()]; b.onclick = () => submit("", op); box.appendChild(b); });
    $("#inProg").querySelectorAll("i").forEach((i, k) => i.classList.toggle("on", k <= idx));
  }
  function nextQ() {
    if (idx >= Q.length) return finish(true);
    agent(Q[idx][L()]); chips();
  }
  async function submit(text, chosen) {
    text = (text || "").trim();
    if (busy || (!text && !chosen) || idx >= Q.length) return;
    busy = true; const q = Q[idx]; $("#inText").value = "";
    bubble(text || chosen[L()], "me");
    let op = chosen || match(q, text);
    if (!op && text && !q.open) {
      const id = await ai("Return only the id of the best matching option, or NONE.", `Question: ${q.en}\nMother said: "${text}"\nOptions: ${q.opts.map((x) => x.v + "=" + x.en).join("; ")}`);
      op = q.opts.find((x) => id && id.indexOf(x.v) === 0) || null;
    }
    if (!op && q.open && text) op = o("note", text, text, 0, []);
    if (!op) { agent(T("in_nomatch"), false); busy = false; return; }
    ans[q.id] = { v: op.v, f: op.f, label: op[L()], note: text || "" };
    log("Intake Agent", `${q.id} -> ${op.v} (${op.f})`);
    const p = window.Tiflan.profile(); const age = p ? p.child.age : "";
    const reply = await ai(`You are Tiflan, a warm assistant talking to the mother of a ${age}-year-old. Reply in ${L() === "ar" ? "Gulf Emirati Arabic, addressing a woman" : "English"} with ONE short supportive sentence (max 14 words). Never diagnose, never give medical advice, never mention risk.`,
      `Question: ${q.en}\nMother's answer: ${text || op.en}`);
    agent(reply || ACKS[L()][idx % 3]);
    idx++; setTimeout(() => { busy = false; nextQ(); }, 900);
  }
  function finish(save) {
    const flags = Object.values(ans).reduce((s, a) => s + a.f, 0);
    if (save) window.Tiflan.update((p) => { p.intake = { answers: ans, flags, done: Date.now() }; });
    $("#qChips").hidden = $("#inRow").hidden = true; $("#inFin").hidden = false;
    const ul = $("#inSum"); ul.innerHTML = "";
    Q.forEach((q) => { const a = ans[q.id]; if (!a) return; const li = document.createElement("li"); li.textContent = (a.note && a.v === "note" ? a.note : a.label) + " · " + q[L()].replace(/[؟?].*$/, ""); ul.appendChild(li); });
    $("#inRes").hidden = !(window.Tiflan.profile() && window.Tiflan.profile().results);
    $("#inFlags").textContent = T("in_flags") + ": " + flags;
    if (save) agent(CLOSE[L()]);
    $("#inProg").querySelectorAll("i").forEach((i) => i.classList.add("on"));
    log("Intake Agent", "finished, follow-up points " + flags);
  }
  function start(fresh) {
    const p = window.Tiflan.profile();
    $("#avatar").src = "assets/" + window.Tiflan.mascot() + "-face.webp"; $("#intake").hidden = false; document.body.style.overflow = "hidden";
    $("#aiBadge").textContent = cfg() ? T("in_ai_on") : T("in_ai_off");
    $("#inProg").innerHTML = Q.map(() => "<i></i>").join("");
    $("#chat").innerHTML = ""; $("#inFin").hidden = true; $("#qChips").hidden = $("#inRow").hidden = false;
    $("#inText").placeholder = T("in_ph"); setStatus("in_idle");
    if (!SR) bubble(T("in_nomic"), "sys");
    if (p && p.intake && !fresh) { ans = p.intake.answers; idx = Q.length; return finish(false); }
    ans = {}; idx = 0; busy = false; agent(GREET[L()]); setTimeout(nextQ, 400);
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  async function listen() {
    if (!SR || !window.TiflanListen) return bubble(T("in_nomic"), "sys");
    if (listening) { if (window.TiflanStopListening) window.TiflanStopListening(); return; }
    if (window.TiflanMicReset) window.TiflanMicReset();
    if (window.speechSynthesis) speechSynthesis.cancel();
    listening = true; $("#mic").classList.add("on"); setStatus("in_listen");
    const res = await window.TiflanListen(L() === "en" ? "en" : "ar", 14000, null, 1500, (x) => { $("#inText").value = x; });
    listening = false; $("#mic").classList.remove("on"); setStatus("in_idle");
    if (res.alts && res.alts.length) { $("#inText").value = res.alts[0]; submit(res.alts[0]); }
    else bubble((window.TiflanMicMsg ? window.TiflanMicMsg(res.err || "silent") : T("in_deny")), "sys");
  }
  const close = () => { $("#intake").hidden = true; document.body.style.overflow = ""; if (window.speechSynthesis) speechSynthesis.cancel(); if (listening && window.TiflanStopListening) window.TiflanStopListening(); };
  $("#mic").onclick = listen;
  $("#send").onclick = () => submit($("#inText").value);
  $("#inText").onkeydown = (e) => { if (e.key === "Enter") submit($("#inText").value); };
  $("#vToggle").onclick = (e) => { voiceOn = !voiceOn; e.currentTarget.textContent = voiceOn ? "🔊" : "🔇"; if (!voiceOn && window.speechSynthesis) speechSynthesis.cancel(); };
  $("#inClose").onclick = close;
  $("#inRedo").onclick = () => start(true);
  $("#inRes").onclick = () => { close(); window.openResults && window.openResults(); };
  $("#inCont").onclick = () => { close(); window.openGames ? window.openGames() : window.tiflanToast("step5"); };
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#intake").hidden) close(); });
  document.addEventListener("tiflan:lang", () => { if ($("#intake").hidden) return; $("#inText").placeholder = T("in_ph"); $("#aiBadge").textContent = cfg() ? T("in_ai_on") : T("in_ai_off"); if (idx < Q.length) chips(); else finish(false); });
  window.openIntake = () => start(false);
})();
