// Step 5: game engine + Game 1 (Follow the Falcon) + Game 2 (Rhyme Nest). Records raw telemetry per trial.
(() => {
  const $ = (s) => document.querySelector(s), html = document.documentElement, L = () => html.lang;
  const S = {
    ar: { t1:"تابع الصقر", i1:"شوف الصقر وين يطالع، ولمس النجمة اللي يطالعها بسرعة!", t2:"عش القوافي", i2:"اسمع الكلمة، واختر الصورة اللي آخرها يشبه آخر الكلمة.",
      start:"يلا نلعب!", well:"أحسنت يا بطل!", next:"اللعبة التالية", cont:"متابعة", count:"اللعبة {i} من {n}", replay:"أعد الكلمة", fin:"انتهينا من ألعاب اليوم!",
      note:"ملخص اللعب لولي الأمر (وليس تشخيصاً):", s1:"{c} من {n} صحيحة · زمن الاستجابة المعتاد {m} ث · لمسات مبكرة {p}",
      s2:"{c} من {n} صحيحة · زمن الاستجابة المعتاد {m} ث · إعادة السماع {r}", saved:"حُفظت النتائج على هذا الجهاز فقط." },
    en: { t1:"Follow the Falcon", i1:"Watch where the falcon looks, then touch that star quickly!", t2:"Rhyme Nest", i2:"Listen to the word, then pick the picture that ends with the same sound.",
      start:"Let's play!", well:"Well done, champ!", next:"Next game", cont:"Continue", count:"Game {i} of {n}", replay:"Hear it again", fin:"Today's games are done!",
      note:"Play summary for the parent (not a diagnosis):", s1:"{c} of {n} correct · typical response {m}s · early taps {p}",
      s2:"{c} of {n} correct · typical response {m}s · replays {r}", saved:"Results are saved on this device only." }
  };
  Object.assign(I18N.ar, { step7:"ألعاب الحروف والمقاطع (5 و6) تأتي في الخطوة 7.", step8:"نتائج المؤشر وخطة التمارين تأتي في الخطوة 8." });
  Object.assign(I18N.en, { step7:"The letter and syllable games (5 and 6) arrive in Step 7.", step8:"The indicator results and exercise plan arrive in Step 8." });
  Object.assign(S.ar, { t3:"صدى الكلمات الغريبة", i3:"اسمع الكلمة الغريبة، وقلها بعدي بالضبط!", n3:"يحتاج الميكروفون. قد يعالج المتصفح الصوت عبر خدمة سحابية، ولا نحفظ أي تسجيل.",
    t4:"سباق التسمية", i4:"قل اسم كل صورة بسرعة وبصوت عالي!", n4:"يحتاج الميكروفون لقياس بدء الكلام فقط. يُحلَّل الصوت على جهازك ولا يُسجَّل.",
    listen:"اسمع...", nowyou:"الحين دورك!", ask:"هل قالها الطفل بشكل صحيح؟", heard:"سمعنا:", yes:"✓ صحيحة", no:"✗ غير صحيحة", again:"🔁 حاولي مرة ثانية",
    named:"سمّاها ✓", errq:"كم صورة أخطأ فيها أو لم يعرفها؟",
    s3:"{c} من {n} صحيحة · أكّدتِ {k} منها بنفسك", s4:"زمن التسمية المعتاد {m} ث · صور بطيئة {s} · أخطاء {e}" });
  Object.assign(S.en, { t3:"Silly Word Echo", i3:"Listen to the silly word, then say it exactly like me!", n3:"Needs the microphone. Your browser may process speech in the cloud. We store no recordings.",
    t4:"Quick Naming Race", i4:"Say the name of each picture, as fast as you can and out loud!", n4:"Needs the microphone only to time when speech starts. Audio is analysed on your device and never recorded.",
    listen:"Listen...", nowyou:"Your turn!", ask:"Did your child say it correctly?", heard:"Heard:", yes:"✓ Correct", no:"✗ Not quite", again:"🔁 Try once more",
    named:"Named it ✓", errq:"How many pictures did they get wrong or not know?",
    s3:"{c} of {n} correct · you confirmed {k} yourself", s4:"typical naming time {m}s · slow items {s} · mistakes {e}" });
  Object.assign(S.ar, { t5:"توأم الحروف", i5:"شوف الحرف الكبير، واختر الحرف اللي نفسه بالضبط! بعدين ارسم الحروف بإصبعك.", t6:"صفّق للمقاطع", i6:"اسمع الكلمة، وصفّق مرة لكل جزء منها!",
    same:"أي حرف هو نفسه بالضبط؟", tr:"ارسم الحرف بإصبعك", clear:"امسح", done:"تم ✓", clapdone:"انتهيت",
    s5:"{c} من {n} حروف صحيحة · زمن الاستجابة {m} ث · دقة التتبع التقريبية {q}%", s6:"{c} من {n} كلمات بعدد المقاطع الصحيح · متوسط خطأ العدّ {a}" });
  Object.assign(S.en, { t5:"Letter Twins", i5:"Look at the big letter and tap the one that is exactly the same! Then trace letters with your finger.", t6:"Clap the Syllables", i6:"Listen to the word and clap once for each part!",
    same:"Which one is exactly the same?", tr:"Trace the letter with your finger", clear:"Clear", done:"Done ✓", clapdone:"I'm done",
    s5:"{c} of {n} letters correct · response {m}s · rough tracing accuracy {q}%", s6:"{c} of {n} words with the right syllable count · average counting error {a}" });
  const T = (k) => S[L()][k];
  const STT = { gulf:"ar-AE", egy:"ar-EG", lev:"ar-JO", mag:"ar-MA", msa:"ar-SA", en:"en-US" };

  const AR = [["قطة","🐱",["بطة","🦆"],[["شمس","☀️"],["كلب","🐶"],["موز","🍌"]]],["جمل","🐪",["بصل","🧅"],[["قمر","🌙"],["بيت","🏠"],["سمك","🐟"]]],
    ["قمر","🌙",["شجر","🌳"],[["سمك","🐟"],["كتاب","📖"],["باب","🚪"]]],["باب","🚪",["كتاب","📖"],[["قلم","✏️"],["شمس","☀️"],["موز","🍌"]]],
    ["كلب","🐶",["قلب","❤️"],[["تفاح","🍎"],["فيل","🐘"],["بطة","🦆"]]],["تفاح","🍎",["مفتاح","🔑"],[["جمل","🐪"],["قمر","🌙"],["كلب","🐶"]]],
    ["كرة","⚽",["ذرة","🌽"],[["قطة","🐱"],["موز","🍌"],["باب","🚪"]]],["فيل","🐘",["نخيل","🌴"],[["ورد","🌹"],["بطة","🦆"],["كلب","🐶"]]],
    ["ورد","🌹",["برد","🧊"],[["نجمة","⭐"],["شمس","☀️"],["فيل","🐘"]]],["سمك","🐟",["ملك","👑"],[["قلب","❤️"],["تفاح","🍎"],["باب","🚪"]]]];
  const EN = [["cat","🐱",["hat","🎩"],[["dog","🐶"],["sun","☀️"],["cup","☕"]]],["star","⭐",["car","🚗"],[["bed","🛏️"],["tree","🌳"],["fish","🐟"]]],
    ["bee","🐝",["tree","🌳"],[["cat","🐱"],["ball","⚽"],["book","📖"]]],["moon","🌙",["spoon","🥄"],[["sun","☀️"],["cake","🎂"],["bear","🐻"]]],
    ["fish","🐟",["dish","🍽️"],[["bed","🛏️"],["car","🚗"],["hat","🎩"]]],["bear","🐻",["chair","🪑"],[["star","⭐"],["cup","☕"],["dog","🐶"]]],
    ["cake","🎂",["snake","🐍"],[["bee","🐝"],["moon","🌙"],["ball","⚽"]]],["boat","⛵",["coat","🧥"],[["sun","☀️"],["tree","🌳"],["fish","🐟"]]]];

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const rand = (n) => Math.floor(Math.random() * n);
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const med = (a) => { if (!a.length) return null; a = a.slice().sort((x, y) => x - y); const m = a.length >> 1; return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2; };
  const sd = (a) => { if (a.length < 2) return null; const m = a.reduce((s, x) => s + x, 0) / a.length; return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };
  const sec = (ms) => (ms == null ? "–" : (ms / 1000).toFixed(1));
  const rnd = (x) => (x == null ? null : Math.round(x));

  let tok = 0;
  const check = (my) => { if (my !== tok) throw new Error("cancel"); };
  function speak(text) {
    return new Promise((res) => {
      if (!window.speechSynthesis) return setTimeout(res, 1500);
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text), p = window.Tiflan.profile();
      const l = L() === "en" ? "en-US" : STT[(p && p.child.dialect)] || "ar-AE"; u.lang = l; u.rate = 0.9;
      const vs = speechSynthesis.getVoices();
      u.voice = vs.find((v) => v.lang.replace("_", "-") === l) || vs.find((v) => v.lang.slice(0, 2) === l.slice(0, 2)) || null;
      let done = false; const fin = () => { if (!done) { done = true; res(); } };
      u.onend = u.onerror = fin; setTimeout(fin, 4500); speechSynthesis.speak(u);
    });
  }

  window.TiflanSpeak = speak;
  const FACE = `<svg class="fl" viewBox="0 0 200 200" aria-hidden="true"><g class="hd"><path d="M82 34c-4-14 4-24 9-28 1 8 5 12 9 14 4-2 8-6 9-14 5 4 13 14 9 28z" fill="#C98D4B"/>
    <circle cx="100" cy="100" r="82" fill="#E9B872"/><ellipse cx="100" cy="112" rx="66" ry="54" fill="#FFF1D6"/>
    <circle cx="52" cy="126" r="11" fill="#FF8A6B" opacity=".45"/><circle cx="148" cy="126" r="11" fill="#FF8A6B" opacity=".45"/>
    <path d="M60 108c-4 10-3 22 4 29-1-10 1-18 6-24zM140 108c4 10 3 22-4 29 1-10-1-18-6-24z" fill="#6B4423"/>
    <circle cx="72" cy="92" r="24" fill="#fff"/><circle cx="128" cy="92" r="24" fill="#fff"/>
    <g class="pup"><circle cx="72" cy="92" r="12" fill="#2B1B5E"/><circle cx="68" cy="88" r="4" fill="#fff"/></g>
    <g class="pup"><circle cx="128" cy="92" r="12" fill="#2B1B5E"/><circle cx="124" cy="88" r="4" fill="#fff"/></g>
    <path d="M84 120c0-6 32-6 32 0 0 10-7 22-16 28-9-6-16-18-16-28z" fill="#FFC94D"/></g></svg>`;

  async function game1(c) {
    const N = c.age <= 5 ? 8 : 12, K = c.age <= 5 ? 2 : 3;
    c.body.innerHTML = `<div class="arena" id="ar">${FACE}</div>`;
    const ar = $("#ar"), pup = [...ar.querySelectorAll(".pup")], hd = ar.querySelector(".hd");
    const gaze = (dx, dy) => { pup.forEach((p) => (p.style.transform = `translate(${dx * 9}px,${dy * 7}px)`)); hd.style.transform = `translate(${dx * 6}px,${dy * 4}px) rotate(${dx * 7}deg)`; };
    const trials = []; let premature = 0, armed = false, resolve = null;
    for (let t = 0; t < N; t++) {
      c.prog(t, N); c.check();
      const W = ar.clientWidth, H = ar.clientHeight, rx = W * 0.36, ry = H * 0.36;
      const target = rand(K);
      const stars = shuffle([0, 1, 2, 3, 4, 5, 6, 7]).slice(0, K).map((s, k) => {
        const a = (s * Math.PI) / 4, b = document.createElement("button");
        b.className = "st c" + k; b.textContent = "⭐"; b.setAttribute("aria-label", "star");
        b.style.left = W / 2 + rx * Math.cos(a) - 38 + "px"; b.style.top = H / 2 + ry * Math.sin(a) - 38 + "px";
        b.onclick = () => { if (!armed) premature++; else if (resolve) resolve(k); };
        ar.appendChild(b); return { b, a };
      });
      gaze(0, 0); await wait(700 + rand(900)); c.check();
      gaze(Math.cos(stars[target].a), Math.sin(stars[target].a));
      armed = true; const onset = performance.now();
      const k = await new Promise((r) => { resolve = r; setTimeout(() => r(-1), 6000); });
      const rt = performance.now() - onset; armed = false; resolve = null;
      trials.push({ t, target, chosen: k, correct: k === target, omitted: k < 0, rt: k < 0 ? null : Math.round(rt) });
      stars[target].b.classList.add(k === target ? "ok" : "hint"); if (k >= 0 && k !== target) stars[k].b.classList.add("no");
      if (k === target) { ar.classList.add("cheer"); setTimeout(() => ar.classList.remove("cheer"), 500); }
      await wait(850); stars.forEach((s) => s.b.remove());
    }
    c.prog(N, N);
    const good = trials.filter((x) => x.correct).map((x) => x.rt), m = med(good), s = sd(good);
    return { trials, metrics: { n: N, correct: trials.filter((x) => x.correct).length, omissions: trials.filter((x) => x.omitted).length, premature,
      medianRT: rnd(m), rtCV: m && s != null ? +(s / (good.reduce((a, b) => a + b, 0) / good.length)).toFixed(2) : null } };
  }

  async function game2(c) {
    const N = c.age <= 5 ? 6 : 8, K = c.age <= 5 ? 1 : 2, bank = shuffle(L() === "en" ? EN : AR).slice(0, N);
    const trials = []; let replays = 0;
    for (let t = 0; t < N; t++) {
      c.prog(t, N); c.check();
      const [w, we, right, wrong] = bank[t];
      const opts = shuffle([{ t: right[0], e: right[1], ok: true }].concat(shuffle(wrong).slice(0, K).map((x) => ({ t: x[0], e: x[1], ok: false }))));
      c.body.innerHTML = `<div class="rhyme"><div class="word"><span class="em">${we}</span><b>${w}</b>
        <button class="chip" id="rp" type="button">🔊 ${T("replay")}</button></div><div class="choices" id="ch" style="visibility:hidden"></div></div>`;
      const ch = $("#ch"); let resolve = null, onset = 0, shown = false;
      opts.forEach((o, i) => { const b = document.createElement("button"); b.className = "opt"; b.type = "button";
        b.innerHTML = `<span>${o.e}</span><small>${o.t}</small>`; b.onclick = () => shown && resolve && resolve(i); ch.appendChild(b); });
      $("#rp").onclick = () => { if (shown) replays++; speak(w); };
      await speak(w); c.check(); ch.style.visibility = "visible"; shown = true; onset = performance.now();
      const k = await new Promise((r) => { resolve = r; setTimeout(() => r(-1), 12000); });
      const rt = Math.round(performance.now() - onset); shown = false; c.check();
      const bs = ch.children; opts.forEach((o, i) => { if (o.ok) bs[i].classList.add(k === i ? "ok" : "hint"); else if (i === k) bs[i].classList.add("no"); });
      trials.push({ t, word: w, chosen: k < 0 ? null : opts[k].t, correct: k >= 0 && opts[k].ok, omitted: k < 0, rt: k < 0 ? null : rt });
      await wait(1000);
    }
    c.prog(N, N);
    const good = trials.filter((x) => x.correct).map((x) => x.rt);
    return { trials, metrics: { n: N, correct: trials.filter((x) => x.correct).length, omissions: trials.filter((x) => x.omitted).length, replays, medianRT: rnd(med(good)) } };
  }

  /* ===== Game 3: Silly Word Echo ===== */
  const NW = {
    ar: { 2:["تَلِيم","فَشُوب","رَتِيف","دُمبِي"], 3:["بَطُوفا","هَمُوتا","جَفِيدا","شَرمُولا"], 4:["بَلتَقِيف","مُنطَرِيفا","تَكسَمِيلا","فَرطَمُوشا"] },
    en: { 2:["tupa","nalo","pidu","mogi"], 3:["gribelo","pomido","tabuli","fanimo"], 4:["kumbaleto","stobelina","dozamuli","velitano"] }
  };
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition; let micOK = true;
  const sttLang = () => { const p = window.Tiflan.profile(); return L() === "en" ? "en-US" : STT[(p && p.child.dialect)] || "ar-AE"; };
  const nz = (s) => (s || "").toLowerCase().replace(/[\u064B-\u0652\u0640]/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/[^\u0600-\u06FFa-z]/g, "");
  function sim(a, b) {
    a = nz(a); b = nz(b); if (!a || !b) return 0;
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]); for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return 1 - d[a.length][b.length] / Math.max(a.length, b.length);
  }
  function listenOnce(ms) {
    return new Promise((res) => {
      if (!SR || !micOK) return res({ text: "", latency: null, none: true });
      const rec = new SR(), t0 = performance.now(); let text = "", first = null, ended = false;
      rec.lang = sttLang(); rec.interimResults = true;
      const end = () => { if (ended) return; ended = true; try { rec.stop(); } catch (e) {} res({ text, latency: first }); };
      rec.onresult = (e) => { if (first == null) first = Math.round(performance.now() - t0); text = [...e.results].map((r) => r[0].transcript).join(" ");
        if (e.results[e.results.length - 1].isFinal) end(); };
      rec.onerror = (e) => { if (e.error === "not-allowed" || e.error === "service-not-allowed") micOK = false; end(); };
      rec.onend = end; setTimeout(end, ms);
      try { rec.start(); } catch (e) { end(); }
    });
  }
  async function game3(c) {
    const pool = NW[L() === "en" ? "en" : "ar"], lens = c.age <= 5 ? [2, 2, 2, 3, 3, 3] : [2, 2, 3, 3, 3, 4, 4, 4], used = {};
    const items = lens.map((s) => { const w = shuffle(pool[s].filter((x) => !used[x]))[0]; used[w] = 1; return { w, s }; });
    const N = items.length, trials = [];
    for (let t = 0; t < N; t++) {
      c.prog(t, N); c.check(); const { w, s } = items[t]; let repeats = 0;
      for (;;) {
        c.body.innerHTML = `<div class="echo"><div class="big">🦜</div><h2>${T("listen")}</h2></div>`;
        await speak(w); c.check();
        c.body.innerHTML = `<div class="echo"><div class="big mic">🎤</div><h2>${T("nowyou")}</h2></div>`;
        const res = await listenOnce(6500); c.check();
        const sm = sim(res.text, w);
        c.body.innerHTML = `<div class="mpanel"><p class="sub">${T("ask")}</p><div class="wbig">${w}</div>
          <small class="sub">${T("heard")} ${res.text || "–"}</small>
          <div class="mrow"><button class="pill" id="my" type="button"><span>${T("yes")}</span></button><button class="pill alt" id="mn" type="button"><span>${T("no")}</span></button></div>
          ${repeats < 1 ? `<button class="ghost" id="ma" type="button">${T("again")}</button>` : ""}</div>`;
        const j = await new Promise((r) => { $("#my").onclick = () => r("y"); $("#mn").onclick = () => r("n"); if ($("#ma")) $("#ma").onclick = () => r("a"); setTimeout(() => r("t"), 30000); });
        c.check();
        if (j === "a") { repeats++; continue; }
        trials.push({ t, word: w, syl: s, heard: res.text, sim: +sm.toFixed(2), latency: res.latency, mother: j === "y" ? true : j === "n" ? false : null,
          correct: j === "y" ? true : j === "n" ? false : sm >= 0.6, source: j === "t" ? "asr" : "mother", repeats });
        break;
      }
    }
    c.prog(N, N);
    const byLen = {}; trials.forEach((x) => { const b = (byLen[x.syl] = byLen[x.syl] || { c: 0, n: 0 }); b.n++; if (x.correct) b.c++; });
    return { trials, metrics: { n: N, correct: trials.filter((x) => x.correct).length, confirmed: trials.filter((x) => x.mother !== null).length,
      medianLatency: rnd(med(trials.filter((x) => x.latency != null).map((x) => x.latency))), byLen } };
  }

  /* ===== Game 4: Quick Naming Race (voice onset measured on-device, no recording) ===== */
  const COL = [["🔴","أحمر","red"],["🔵","أزرق","blue"],["🟢","أخضر","green"],["🟡","أصفر","yellow"]];
  const OBJ = [["🐱","قطة","cat"],["🏠","بيت","house"],["🍎","تفاح","apple"],["🚗","سيارة","car"],["⭐","نجمة","star"]];
  const cyc = (a, n) => { let o = []; while (o.length < n) o = o.concat(shuffle(a)); return o.slice(0, n); };
  async function game4(c) {
    const items = (c.age <= 5 ? cyc(COL, 8).map((x) => ({ x, cat: "color" })) : cyc(COL, 6).map((x) => ({ x, cat: "color" })).concat(cyc(OBJ, 6).map((x) => ({ x, cat: "object" }))));
    let stream = null, actx = null, an = null, buf = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true } });
      actx = new (window.AudioContext || window.webkitAudioContext)(); if (actx.resume) await actx.resume();
      an = actx.createAnalyser(); an.fftSize = 1024; actx.createMediaStreamSource(stream).connect(an); buf = new Uint8Array(an.fftSize);
    } catch (e) { an = null; }
    const level = () => { an.getByteTimeDomainData(buf); let s = 0; for (let i = 0; i < buf.length; i++) { const v = (buf[i] - 128) / 128; s += v * v; } return Math.sqrt(s / buf.length); };
    const trials = []; const N = items.length; let errors = null;
    try {
      for (let t = 0; t < N; t++) {
        c.prog(t, N); c.check(); const { x, cat } = items[t];
        c.body.innerHTML = `<div class="ran"><div class="ritem" id="ri"></div><small class="sub" id="rl"></small><button class="pill" id="rn" type="button"><span>${T("named")}</span></button></div>`;
        let floor = 0; const bt = performance.now();
        while (performance.now() - bt < 600) { if (an) floor = Math.max(floor, level()); await wait(30); }
        c.check(); const thr = Math.max(0.035, floor * 2.5 + 0.015);
        $("#ri").textContent = x[0]; $("#rl").textContent = L() === "en" ? x[2] : x[1];
        const t0 = performance.now();
        const r = await new Promise((res) => {
          let onset = null, above = 0, lastLoud = 0, done = false, iv = null;
          const fin = (o) => { if (!done) { done = true; clearInterval(iv); res(o); } };
          $("#rn").onclick = () => fin(onset != null ? { rt: onset, src: "voice" } : { rt: Math.round(performance.now() - t0), src: "tap" });
          iv = setInterval(() => {
            const now = performance.now();
            if (now - t0 > 6500) return fin({ rt: onset, src: onset != null ? "voice" : "none" });
            if (!an) return;
            if (level() > thr) { if (!above) above = now; lastLoud = now; if (onset == null && now - above >= 90) { if (above - t0 < 150) above = 0; else onset = Math.round(above - t0); } }
            else above = 0;
            if (onset != null && now - lastLoud > 500) fin({ rt: onset, src: "voice" });
          }, 30);
        });
        trials.push({ t, cat, item: x[2], rt: r.rt, src: r.src, omitted: r.rt == null });
        $("#ri").classList.add("done"); await wait(350);
      }
      c.prog(N, N);
      c.body.innerHTML = `<div class="gm-intro"><h2>${T("errq")}</h2><div class="chips ages">${[0, 1, 2, 3, 4].map((k) => `<button class="chip" type="button" data-e="${k}">${k === 4 ? "4+" : k}</button>`).join("")}</div></div>`;
      errors = await new Promise((r) => document.querySelectorAll("[data-e]").forEach((b) => (b.onclick = () => r(+b.dataset.e)))); c.check();
    } finally {
      if (stream) stream.getTracks().forEach((k) => k.stop()); if (actx && actx.close) actx.close();
    }
    const rts = trials.filter((x) => x.rt != null).map((x) => x.rt), m = med(rts), mean = rts.length ? rts.reduce((a, b) => a + b, 0) / rts.length : null, s = sd(rts);
    const cats = {}; ["color", "object"].forEach((k) => { const v = trials.filter((x) => x.cat === k && x.rt != null).map((x) => x.rt); if (v.length) cats[k] = rnd(med(v)); });
    return { trials, metrics: { n: N, omissions: trials.filter((x) => x.omitted).length, slow: rts.filter((v) => v > 3000).length, errors, medianRT: rnd(m),
      meanRT: rnd(mean), rtCV: mean && s != null ? +(s / mean).toFixed(2) : null, byCat: cats, voiceTrials: trials.filter((x) => x.src === "voice").length } };
  }

  /* ===== Game 5: Letter Twins (match look-alike letters + trace) ===== */
  const GRP = {
    ar: [["ب","ت","ث","ن"],["ج","ح","خ"],["ع","غ"],["ف","ق"],["س","ش"],["د","ذ"],["ر","ز"],["ص","ض"]],
    en: [["b","d","p","q"],["m","w"],["n","u"],["h","n"],["a","e"],["f","t"],["i","j"],["s","z"]]
  };
  const TRC = { ar: ["ب","ت","ج","خ","ع","ف","ن","ش"], en: ["b","d","p","q","m","w"] };
  async function trace(c, letter) {
    c.body.innerHTML = `<div class="tr"><h2>${T("tr")}</h2><canvas id="cv"></canvas><div class="mrow"><button class="ghost" id="cl" type="button">${T("clear")}</button>
      <button class="pill" id="dn" type="button"><span>${T("done")}</span></button></div></div>`;
    const cv = $("#cv"), W = Math.max(200, Math.min(300, c.body.clientWidth - 24)); cv.width = cv.height = W; const x = cv.getContext("2d");
    let strokes = [], cur = null, t0 = null;
    const guide = (g, z) => { g.textAlign = "center"; g.textBaseline = "middle"; g.font = `700 ${z * 0.7}px "Readex Pro",system-ui,sans-serif`; g.fillText(letter, z / 2, z / 2); };
    const redraw = () => {
      x.clearRect(0, 0, W, W); x.fillStyle = "rgba(255,255,255,.22)"; guide(x, W);
      x.strokeStyle = "#FFC94D"; x.lineWidth = W * 0.05; x.lineCap = x.lineJoin = "round";
      strokes.forEach((s) => { x.beginPath(); s.forEach((p, i) => (i ? x.lineTo(p[0] * W, p[1] * W) : x.moveTo(p[0] * W, p[1] * W))); if (s.length === 1) x.lineTo(s[0][0] * W + 0.1, s[0][1] * W); x.stroke(); });
    };
    const pt = (e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; };
    cv.onpointerdown = (e) => { cv.setPointerCapture(e.pointerId); if (t0 == null) t0 = performance.now(); cur = [pt(e)]; strokes.push(cur); redraw(); };
    cv.onpointermove = (e) => { if (cur) { cur.push(pt(e)); redraw(); } };
    cv.onpointerup = cv.onpointercancel = () => { cur = null; };
    $("#cl").onclick = () => { strokes = []; t0 = null; redraw(); }; redraw();
    await new Promise((r) => ($("#dn").onclick = r)); c.check();
    const Z = 64, g = document.createElement("canvas"), k = document.createElement("canvas"); g.width = g.height = k.width = k.height = Z;
    const gx = g.getContext("2d"), kx = k.getContext("2d"); gx.fillStyle = "#fff"; guide(gx, Z);
    kx.strokeStyle = "#fff"; kx.lineWidth = Z * 0.06; kx.lineCap = kx.lineJoin = "round";
    strokes.forEach((s) => { kx.beginPath(); s.forEach((p, i) => (i ? kx.lineTo(p[0] * Z, p[1] * Z) : kx.moveTo(p[0] * Z, p[1] * Z))); if (s.length === 1) kx.lineTo(s[0][0] * Z + 0.1, s[0][1] * Z); kx.stroke(); });
    const gd = gx.getImageData(0, 0, Z, Z).data, kd = kx.getImageData(0, 0, Z, Z).data, gm = new Uint8Array(Z * Z), im = new Uint8Array(Z * Z), G = [], I = [];
    for (let i = 0; i < Z * Z; i++) { if (gd[i * 4 + 3] > 60) { gm[i] = 1; G.push(i); } if (kd[i * 4 + 3] > 60) { im[i] = 1; I.push(i); } }
    const near = (m, i, r) => { const x0 = i % Z, y0 = (i / Z) | 0; for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { const xx = x0 + dx, yy = y0 + dy; if (xx >= 0 && yy >= 0 && xx < Z && yy < Z && m[yy * Z + xx]) return true; } return false; };
    const precision = I.length ? I.filter((i) => near(gm, i, 3)).length / I.length : 0, recall = G.length ? G.filter((i) => near(im, i, 3)).length / G.length : 0;
    return { letter, strokes: strokes.length, ms: t0 ? Math.round(performance.now() - t0) : null, precision: +precision.toFixed(2), recall: +recall.toFixed(2) };
  }
  async function game5(c) {
    const sc = L() === "en" ? "en" : "ar", trials = [], N = GRP[sc].length;
    for (let t = 0; t < N; t++) {
      c.prog(t, N + 3); c.check();
      const G = shuffle(GRP[sc])[t % N], target = G[rand(G.length)], opts = shuffle(G);
      c.body.innerHTML = `<div class="rhyme"><div class="word"><small class="sub">${T("same")}</small><span class="tl">${target}</span></div><div class="choices" id="ch"></div></div>`;
      let resolve = null; const ch = $("#ch");
      opts.forEach((l, i) => { const b = document.createElement("button"); b.className = "opt letter"; b.type = "button"; b.innerHTML = `<span>${l}</span>`; b.onclick = () => resolve && resolve(i); ch.appendChild(b); });
      const onset = performance.now();
      const k = await new Promise((r) => { resolve = r; setTimeout(() => r(-1), 12000); });
      const rt = Math.round(performance.now() - onset); c.check();
      const bs = ch.children; opts.forEach((l, i) => { if (l === target) bs[i].classList.add(k === i ? "ok" : "hint"); else if (i === k) bs[i].classList.add("no"); });
      trials.push({ t, target, chosen: k < 0 ? null : opts[k], correct: k >= 0 && opts[k] === target, omitted: k < 0, rt: k < 0 ? null : rt, options: opts.length });
      await wait(900);
    }
    const traces = [];
    for (const l of shuffle(TRC[sc]).slice(0, 3)) { c.prog(N + traces.length, N + 3); traces.push(await trace(c, l)); c.check(); }
    c.prog(N + 3, N + 3);
    const good = trials.filter((x) => x.correct).map((x) => x.rt), avg = (k) => +(traces.reduce((s, x) => s + x[k], 0) / traces.length).toFixed(2);
    return { trials: trials.concat(), traces, metrics: { n: N, correct: trials.filter((x) => x.correct).length, medianRT: rnd(med(good)), script: sc,
      confusions: trials.filter((x) => x.chosen && !x.correct).map((x) => x.target + ">" + x.chosen), tracePrecision: avg("precision"), traceRecall: avg("recall"), traceStrokes: avg("strokes") } };
  }

  /* ===== Game 6: Clap the Syllables ===== */
  const SYL = {
    ar: [["شمس","☀️",1],["بيت","🏠",1],["فيل","🐘",1],["باب","🚪",1],["قطة","🐱",2],["جمل","🐪",2],["قمر","🌙",2],["كتاب","📖",2],["وردة","🌹",2],["نجمة","⭐",2],
      ["سمكة","🐟",3],["تفاحة","🍎",3],["سيارة","🚗",3],["فراشة","🦋",3],["شجرة","🌳",3],["طائرة","✈️",3],["برتقالة","🍊",4],["سلحفاة","🐢",4]],
    en: [["sun","☀️",1],["cat","🐱",1],["fish","🐟",1],["house","🏠",1],["apple","🍎",2],["tiger","🐯",2],["flower","🌸",2],["rabbit","🐰",2],
      ["banana","🍌",3],["elephant","🐘",3],["butterfly","🦋",3],["tomato","🍅",3],["watermelon","🍉",4],["alligator","🐊",4],["caterpillar","🐛",4]]
  };
  async function game6(c) {
    const bank = SYL[L() === "en" ? "en" : "ar"], used = {}, trials = [];
    const items = [1, 1, 2, 2, 3, 3, 4, 4].map((s) => { const it = shuffle(bank.filter((x) => x[2] === s && !used[x[0]]))[0]; used[it[0]] = 1; return it; });
    const N = items.length;
    for (let t = 0; t < N; t++) {
      c.prog(t, N); c.check(); const [w, e, syl] = items[t]; let replays = 0;
      c.body.innerHTML = `<div class="clap"><div class="big">${e}</div><small class="sub">${w}</small><button class="chip" id="hr" type="button">🔊 ${T("replay")}</button>
        <button class="clapbtn" id="cb" type="button" disabled>👏</button><button class="ghost" id="cd" type="button">${T("clapdone")}</button></div>`;
      $("#hr").onclick = () => { replays++; speak(w); };
      await speak(w); c.check(); const cb = $("#cb"); cb.disabled = false; const tEnd = performance.now(), taps = [];
      await new Promise((res) => {
        let tm = null; const fin = () => { clearTimeout(tm); res(); };
        cb.onpointerdown = () => { taps.push(Math.round(performance.now() - tEnd)); cb.classList.add("hit"); setTimeout(() => cb.classList.remove("hit"), 120); clearTimeout(tm); tm = setTimeout(fin, 2300); };
        $("#cd").onclick = fin; setTimeout(fin, 20000);
      });
      c.check();
      const itis = taps.slice(1).map((v, i) => v - taps[i]), m = itis.length ? itis.reduce((a, b) => a + b, 0) / itis.length : null, s = sd(itis);
      trials.push({ t, word: w, syl, taps: taps.length, error: taps.length - syl, exact: taps.length === syl, latency: taps.length ? taps[0] : null, iti: itis, itiCV: m && s != null ? +(s / m).toFixed(2) : null, replays });
      await wait(400);
    }
    c.prog(N, N);
    const bySyl = {}; trials.forEach((x) => { const b = (bySyl[x.syl] = bySyl[x.syl] || { c: 0, n: 0 }); b.n++; if (x.exact) b.c++; });
    return { trials, metrics: { n: N, correct: trials.filter((x) => x.exact).length, meanAbsError: +(trials.reduce((a, x) => a + Math.abs(x.error), 0) / N).toFixed(2),
      over: trials.filter((x) => x.error > 0).length, under: trials.filter((x) => x.error < 0).length, rhythmCV: med(trials.filter((x) => x.itiCV != null).map((x) => x.itiCV)), bySyl } };
  }

  const GAMES = [{ id:"g1", icon:"⭐", t:"t1", i:"i1", run:game1, line:"s1" }, { id:"g2", icon:"🐣", t:"t2", i:"i2", run:game2, line:"s2" },
    { id:"g3", icon:"🦜", t:"t3", i:"i3", note:"n3", run:game3, line:"s3" }, { id:"g4", icon:"🏁", t:"t4", i:"i4", note:"n4", run:game4, line:"s4" },
    { id:"g5", icon:"🔤", t:"t5", i:"i5", run:game5, line:"s5" }, { id:"g6", icon:"👏", t:"t6", i:"i6", run:game6, line:"s6" }];
  const fmt = (s, m) => s.replace(/\{(\w)\}/g, (_, k) => m[k]);

  async function play(i, results, my) {
    const g = GAMES.slice(0, window.Tiflan.plan())[i], p = window.Tiflan.profile(), age = p ? p.child.age : 6, body = $("#gmBody"), plan = window.Tiflan.plan();
    $("#gmTitle").textContent = T(g.t); $("#gmCount").textContent = fmt(T("count"), { i: i + 1, n: plan });
    $("#gmProg").innerHTML = ""; 
    body.innerHTML = `<div class="gm-intro"><div class="big">${g.icon}</div><h2>${T(g.t)}</h2><p>${T(g.i)}</p>${g.note ? `<p class="micnote">${T(g.note)}</p>` : ""}
      <button class="pill" id="gmGo" type="button"><span>${T("start")}</span><b>▶</b></button></div>`;
    speak(T(g.i));
    await new Promise((r) => ($("#gmGo").onclick = r)); check(my);
    if (window.speechSynthesis) speechSynthesis.cancel();
    const ctx = { body, age, check: () => check(my), prog: (k, n) => { $("#gmProg").innerHTML = Array.from({ length: n }, (_, j) => `<i class="${j < k ? "on" : ""}"></i>`).join(""); } };
    const res = await g.run(ctx); check(my);
    results.push({ g, res });
    window.Tiflan.update((q) => { q.games = q.games || {}; q.games[g.id] = { ts: Date.now(), age, metrics: res.metrics, trials: res.trials }; });
    (window.Tiflan._log = window.Tiflan._log || []).push({ t: Date.now(), agent: "Game Master", msg: g.id + " " + JSON.stringify(res.metrics) });
    const last = i === Math.min(GAMES.length, plan) - 1;
    body.innerHTML = `<div class="gm-intro"><div class="big">🌟🌟🌟</div><h2>${T("well")}</h2>
      <button class="pill" id="gmNext" type="button"><span>${T(last ? "cont" : "next")}</span><b>↗</b></button></div>`;
    speak(T("well")); await new Promise((r) => ($("#gmNext").onclick = r)); check(my);
    if (!last) return play(i + 1, results, my);
    summary(results);
  }
  function summary(results) {
    if (window.speechSynthesis) speechSynthesis.cancel();
    $("#gmProg").innerHTML = ""; $("#gmCount").textContent = "";
    const rows = results.map(({ g, res }) => { const m = res.metrics;
      return `<li><b>${T(g.t)}</b><br>${fmt(T(g.line), { c: m.correct, n: m.n, m: sec(m.medianRT), p: m.premature, r: m.replays, k: m.confirmed, s: m.slow, e: m.errors, q: Math.round(((m.tracePrecision || 0) + (m.traceRecall || 0)) * 50), a: m.meanAbsError })}</li>`; }).join("");
    $("#gmBody").innerHTML = `<div class="gm-sum"><h2>${T("fin")}</h2><p class="sub">${T("note")}</p><ul class="promises sum">${rows}</ul>
      <p class="priv">${T("saved")}</p><button class="pill" id="gmDone" type="button"><span>${T("cont")}</span><b>↗</b></button></div>`;
    $("#gmDone").onclick = () => { const p = window.Tiflan.profile(); close(); window.tiflanToast("step8"); };
  }
  function close() { tok++; $("#game").hidden = true; document.body.style.overflow = ""; if (window.speechSynthesis) speechSynthesis.cancel(); }
  window.openGames = () => {
    const my = ++tok; $("#game").hidden = false; document.body.style.overflow = "hidden";
    play(0, [], my).catch((e) => { if (e.message !== "cancel") console.error(e); });
  };
  $("#gmClose").onclick = close;
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#game").hidden) close(); });
})();
