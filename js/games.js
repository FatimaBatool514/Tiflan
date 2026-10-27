// Games engine v2: fresh items every play, age tiers, Arabic/English content, automatic speech checking (no parent input).
(() => {
  const $ = (s) => document.querySelector(s), html = document.documentElement, L = () => html.lang;
  const S = {
    ar: { t1:"تابع الصقر", i1:"شوف الصقر وين يطالع، ولمس الشي اللي يطالعه بسرعة!", t2:"عش القوافي", i2:"اسمع الكلمة، واختر الصورة اللي آخرها يشبه آخر الكلمة.",
      t3:"صدى الكلمات الغريبة", i3:"اسمع الكلمة الغريبة، وقلها بعدي بالضبط!", n3:"يحتاج الميكروفون. قد يعالج المتصفح الصوت عبر خدمة سحابية، ولا نحفظ أي تسجيل.",
      t4:"سباق التسمية", i4:"قل اسم كل صورة بسرعة وبصوت عالي!", n4:"يحتاج الميكروفون. قد يعالج المتصفح الصوت عبر خدمة سحابية، ولا نحفظ أي تسجيل.",
      t5:"توأم الحروف", i5:"شوف الحرف الكبير، واختر الحرف اللي نفسه بالضبط! بعدين ارسم الحروف بإصبعك.",
      t6:"محقق الأصوات", i6:"اسمع الكلمة، وشوف أي صورة يبدأ اسمها بنفس الصوت الأول!", ex6:"مثال: «قطة» و«قمر» يبدآن بنفس الصوت: ق", exw:["قطة","قمر"],
      lc:"لغة الكلمات", lar:"العربية", len:"English", lmix:"الاثنتان", start:"يلا نلعب!", well:"أحسنت يا بطل!", next:"اللعبة التالية", cont:"متابعة", count:"اللعبة {i} من {n}",
      replay:"أعد الكلمة", fin:"انتهينا من ألعاب اليوم!", note:"ملخص اللعب لولي الأمر (وليس تشخيصاً):", saved:"حُفظت النتائج على هذا الجهاز فقط.",
      listen:"اسمع...", nowyou:"الحين دورك!", good:"ممتاز! 👏", again:"ما سمعتك، نحاول مرة ثانية!", same:"أي حرف هو نفسه بالضبط؟", tr:"ارسم الحرف بإصبعك", clear:"امسح", done:"تم ✓",
      nospeech:"ما قدرنا نسمع الصوت على هذا الجهاز، لذلك نتخطى هذه اللعبة.", noscore:"لم يتم فحص النطق على هذا الجهاز",
      s1:"{c} من {n} صحيحة · زمن الاستجابة المعتاد {m} ث · لمسات مبكرة {p}", s2:"{c} من {n} صحيحة · زمن الاستجابة المعتاد {m} ث · إعادة السماع {r}",
      s3:"{c} من {s} كلمات صحيحة (فحص تلقائي)", s4:"زمن التسمية المعتاد {m} ث · أخطاء رصدها التطبيق {e} من {s}", s5:"{c} من {n} حروف صحيحة · زمن الاستجابة {m} ث · دقة التتبع التقريبية {q}%", s6:"{c} من {n} أصوات أولى صحيحة · زمن الاستجابة {m} ث" },
    en: { t1:"Follow the Falcon", i1:"Watch where the falcon looks, then touch what it is looking at, quickly!", t2:"Rhyme Nest", i2:"Listen to the word, then pick the picture that ends with the same sound.",
      t3:"Silly Word Echo", i3:"Listen to the silly word, then say it exactly like me!", n3:"Needs the microphone. Your browser may process speech in the cloud. We store no recordings.",
      t4:"Quick Naming Race", i4:"Say the name of each picture, as fast as you can and out loud!", n4:"Needs the microphone. Your browser may process speech in the cloud. We store no recordings.",
      t5:"Letter Twins", i5:"Look at the big letter and tap the one that is exactly the same! Then trace letters with your finger.",
      t6:"Sound Detective", i6:"Listen to the word, then find the picture whose name starts with the same first sound!", ex6:"Example: “cat” and “key” start with the same sound: k", exw:["cat","key"],
      lc:"Word language", lar:"العربية", len:"English", lmix:"Both", start:"Let's play!", well:"Well done, champ!", next:"Next game", cont:"Continue", count:"Game {i} of {n}",
      replay:"Hear it again", fin:"Today's games are done!", note:"Play summary for the parent (not a diagnosis):", saved:"Results are saved on this device only.",
      listen:"Listen...", nowyou:"Your turn!", good:"Great! 👏", again:"I didn't hear you, let's try again!", same:"Which one is exactly the same?", tr:"Trace the letter with your finger", clear:"Clear", done:"Done ✓",
      nospeech:"We can't listen to speech on this device, so we skip this game.", noscore:"Speech could not be checked on this device",
      s1:"{c} of {n} correct · typical response {m}s · early taps {p}", s2:"{c} of {n} correct · typical response {m}s · replays {r}",
      s3:"{c} of {s} words correct (automatic check)", s4:"typical naming time {m}s · mistakes detected {e} of {s}", s5:"{c} of {n} letters correct · response {m}s · rough tracing accuracy {q}%", s6:"{c} of {n} first sounds correct · response {m}s" }
  };
  Object.assign(S.ar, { tapmic:"اضغط الميكروفون وقل الكلمة", retry:"حاولي مرة ثانية", skipg:"تخطي اللعبة", skipitem:"ولا يهمك، ننتقل للتالي!", novoice:"ما عندنا صوت لهذه اللغة على الجهاز، الكلمة مكتوبة هنا.",
    mictest:"اختبار الميكروفون", micsay:"قولي أي كلمة...", micgo:"تكلمي الحين 🎤", micheard:"سمعنا:", voicetest:"اختبار الصوت", voiceok:"✓ سمعتِ الكلمة؟ الصوت يعمل.", voicebad:"لا يوجد صوت لهذه اللغة على هذا الجهاز، ستظهر الكلمات مكتوبة.",
    e_denied:"الميكروفون غير مسموح. فعّليه من إعدادات المتصفح (رمز القفل بجانب العنوان) ثم حاولي مرة ثانية.", e_net:"التعرف على الكلام يحتاج اتصالاً بالإنترنت. تأكدي من الاتصال ثم حاولي.",
    e_cap:"الميكروفون مشغول أو غير متوفر. أغلقي التطبيقات الأخرى التي تستخدمه.", e_unsup:"هذا المتصفح لا يدعم التعرف على الكلام. استخدمي Chrome على أندرويد أو على الكمبيوتر.",
    e_lang:"هذه اللغة غير مدعومة للتعرف على الكلام في هذا الجهاز.", e_silent:"ما وصلنا صوت. تأكدي أن الميكروفون يعمل، وأن الغرفة هادئة، وخلي الطفل يتكلم بصوت أعلى وقريب من الجهاز." });
  Object.assign(S.en, { tapmic:"Tap the microphone and say the word", retry:"Try again", skipg:"Skip this game", skipitem:"No worries, let's go to the next one!", novoice:"This device has no voice for this language, so the word is shown here.",
    mictest:"Test microphone", micsay:"Say anything...", micgo:"Speak now 🎤", micheard:"Heard:", voicetest:"Test voice", voiceok:"✓ Did you hear the word? The voice works.", voicebad:"No voice for this language on this device. Words will be shown in writing.",
    e_denied:"Microphone access is blocked. Allow it in the browser settings (lock icon next to the address), then try again.", e_net:"Speech recognition needs an internet connection. Please check it and try again.",
    e_cap:"The microphone is busy or missing. Close other apps that use it.", e_unsup:"This browser does not support speech recognition. Please use Chrome on Android or desktop.",
    e_lang:"This language is not supported for speech recognition on this device.", e_silent:"We didn't receive any sound. Check that the microphone works, the room is quiet, and ask your child to speak louder and closer to the device." });
  const T = (k) => S[L()][k];
  const STT = { gulf:"ar-AE", egy:"ar-EG", lev:"ar-JO", mag:"ar-MA", msa:"ar-SA", en:"en-US" };

  /* ---------- helpers ---------- */
  const wait = (ms) => new Promise((r) => setTimeout(r, ms)), rand = (n) => Math.floor(Math.random() * n);
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const med = (a) => { if (!a.length) return null; a = a.slice().sort((x, y) => x - y); const m = a.length >> 1; return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2; };
  const sd = (a) => { if (a.length < 2) return null; const m = a.reduce((s, x) => s + x, 0) / a.length; return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };
  const sec = (ms) => (ms == null ? "–" : (ms / 1000).toFixed(1)), rnd = (x) => (x == null ? null : Math.round(x));
  const nz = (s) => (s || "").toLowerCase().replace(/[\u064B-\u0652\u0640]/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/[^\u0600-\u06FFa-z]/g, "");
  const nm = (s) => (s || "").toLowerCase().replace(/[\u064B-\u0652\u0640]/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/[^\u0600-\u06FFa-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  const prof = () => window.Tiflan.profile();
  const sttFor = (lang) => (lang === "en" ? "en-US" : STT[(prof() && prof().child.dialect)] || "ar-AE");
  let tok = 0, CL = "ar";

  // Remembers which items were already played (item names only) so the next session shows different ones first.
  function pickFresh(key, bank, n, idf = (x) => x[0]) {
    let seen = {}; try { seen = JSON.parse(localStorage.getItem("tiflan-seen")) || {}; } catch (e) {}
    const s = new Set(seen[key] || []), un = shuffle(bank.filter((x) => !s.has(idf(x)))), re = shuffle(bank.filter((x) => s.has(idf(x))));
    const out = un.length >= n ? un.slice(0, n) : un.concat(re).slice(0, n);
    seen[key] = un.length >= n ? [...s, ...out.map(idf)] : out.map(idf);
    try { localStorage.setItem("tiflan-seen", JSON.stringify(seen)); } catch (e) {}
    return out;
  }
  const langPlan = (n) => (CL === "mix" ? shuffle(Array.from({ length: n }, (_, i) => (i % 2 ? "en" : "ar"))) : Array(n).fill(CL));
  const gather = (n, fn) => { const pl = langPlan(n), out = []; ["ar", "en"].forEach((l) => { const c = pl.filter((x) => x === l).length; if (c) fn(l, c).forEach((it) => out.push({ l, it })); }); return shuffle(out); };

  const voicesReady = () => new Promise((res) => {
    const v = speechSynthesis.getVoices(); if (v.length) return res(v);
    const t = setTimeout(() => res(speechSynthesis.getVoices()), 1200);
    speechSynthesis.addEventListener("voiceschanged", () => { clearTimeout(t); res(speechSynthesis.getVoices()); }, { once: true });
  });
  // Speaks one utterance; resolves {ok:true} only if the device really started speaking.
  const say = (text, code, voice) => new Promise((res) => {
    const ss = window.speechSynthesis; let started = false, done = false, tm = null, st = null; const t0 = performance.now();
    const fin = (ok) => { if (!done) { done = true; clearTimeout(tm); clearTimeout(st); res({ ok }); } };
    const u = new SpeechSynthesisUtterance(text); u.lang = code; u.rate = 0.85; if (voice) u.voice = voice;
    u.onstart = () => { started = true; };
    u.onend = () => fin(started && performance.now() - t0 > 150);
    u.onerror = (e) => { if (e.error === "interrupted" || e.error === "canceled") return; fin(false); };
    st = setTimeout(() => { if (!started) { try { ss.cancel(); } catch (e) {} fin(false); } }, 2500);   // browser accepted it but stayed silent
    tm = setTimeout(() => fin(started), 7000);
    ss.speak(u);
  });
  // Order: voice for the language -> (if none) an English voice reading a phonetic spelling (alt) -> ok:false so the screen shows the written word.
  async function speak(text, lang, alt) {
    const ss = window.speechSynthesis; if (!ss) { await wait(800); return { ok: false, voice: false }; }
    const vs = await voicesReady(), l = sttFor(lang);
    const pick = (code) => vs.find((v) => v.lang.replace("_", "-") === code) || vs.find((v) => v.lang.slice(0, 2) === code.slice(0, 2)) || null;
    if (ss.speaking || ss.pending) { ss.cancel(); await wait(180); } if (ss.paused) ss.resume();
    const v1 = pick(l);
    if (v1 || !vs.length) { const r = await say(text, l, v1); if (r.ok) return { ok: true, voice: !!v1 }; if (v1) { ss.cancel(); await wait(150); } }
    if (alt) { const r = await say(alt, "en-US", pick("en-US")); if (r.ok) return { ok: true, voice: false, alt: true }; }
    return { ok: false, voice: !!v1 };
  }
  window.TiflanSpeak = (t) => speak(t, L() === "en" ? "en" : "ar");
  const check = (my) => { if (my !== tok) throw new Error("cancel"); };

  /* ---------- automatic speech checking ---------- */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition; let micOK = true;
  const esc = (x) => String(x == null ? "" : x).replace(/[&<>]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[ch]));
  // Continuous recognition that ends itself after a short silence, starts only when the mic is really capturing, and reports why it failed.
  function listen(lang, ms, onReady, endGap = 1400) {
    return new Promise((res) => {
      if (!SR || !micOK) return res({ alts: [], latency: null, none: true, err: !SR ? "unsupported" : "denied" });
      // Browsers often end a recognition session early (or refuse a dialect code), so we restart it until time runs out.
      const langs = [sttFor(lang)].concat(lang === "en" ? [] : ["ar-SA", "ar-EG"]).filter((x, i, a) => a.indexOf(x) === i);
      let rec = null, alts = [], first = null, sp = null, t0 = null, ended = false, last = 0, ready = false, err = "", restarts = 0, li = 0, iv = null, to = null;
      const endAt = performance.now() + ms;
      const finish = () => { if (ended) return; ended = true; clearInterval(iv); clearTimeout(to); try { rec && rec.stop(); } catch (e) {}
        if (!ready && !err) err = "ended-early"; setTimeout(() => res({ alts, latency: sp != null ? sp : first, none: false, err, restarts }), 350); };
      const mark = () => { if (!ready) { ready = true; t0 = performance.now(); if (onReady) onReady(); } };
      const go = () => {
        if (ended) return;
        rec = new SR(); rec.lang = langs[li]; rec.interimResults = true; rec.continuous = true; rec.maxAlternatives = 5;
        rec.onaudiostart = mark; rec.onstart = () => setTimeout(mark, 450);
        rec.onspeechstart = () => { if (sp == null && t0 != null) sp = Math.round(performance.now() - t0); };
        rec.onresult = (e) => {
          if (first == null && t0 != null) first = Math.round(performance.now() - t0); last = performance.now();
          const segs = [...e.results], joined = segs.map((r) => r[0].transcript).join(" "), lastR = segs[segs.length - 1]; alts = [joined];
          for (let k = 1; k < lastR.length; k++) alts.push(segs.slice(0, -1).map((r) => r[0].transcript).concat(lastR[k].transcript).join(" "));
        };
        rec.onerror = (e) => { err = e.error;
          if (e.error === "not-allowed" || e.error === "service-not-allowed") { micOK = false; finish(); }
          else if (e.error === "language-not-supported" && li < langs.length - 1) { li++; err = ""; setTimeout(go, 100); }
          else if (e.error !== "no-speech" && e.error !== "aborted") finish(); };
        rec.onend = () => { if (ended) return; if (!alts.length && performance.now() < endAt - 1200 && restarts < 4 && !/language-not-supported/.test(err)) { restarts++; setTimeout(go, 150); } else finish(); };
        try { rec.start(); } catch (e) { err = "start-failed"; finish(); }
      };
      iv = setInterval(() => { if (alts.length && performance.now() - last > endGap) finish(); }, 100); to = setTimeout(finish, ms);
      go();
    });
  }
  const errMsg = (e) => T(e === "not-allowed" || e === "service-not-allowed" || e === "denied" ? "e_denied" : e === "network" ? "e_net" : e === "audio-capture" ? "e_cap" : e === "unsupported" ? "e_unsup" : e === "language-not-supported" ? "e_lang" : "e_silent");
  async function micHelp(c, err) {
    c.body.innerHTML = `<div class="gm-intro"><div class="big">🎤</div><p>${errMsg(err)}</p><div class="mrow"><button class="pill" id="mhR" type="button"><span>${T("retry")}</span></button><button class="ghost" id="mhS" type="button">${T("skipg")}</button></div></div>`;
    return new Promise((r) => { $("#mhR").onclick = () => r("retry"); $("#mhS").onclick = () => r("skip"); });
  }
  const lev = (a, b) => { const d = Array.from({ length: a.length + 1 }, (_, i) => [i]); for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[a.length][b.length]; };
  const ratio = (a, b) => (!a && !b ? 1 : !a || !b ? 0 : 1 - lev(a, b) / Math.max(a.length, b.length));
  const skel = (s, l) => (l === "en" ? s.toLowerCase().replace(/[^a-z]/g, "").replace(/[aeiouy]/g, "") : nz(s).replace(/[اويىءئؤ]/g, ""));
  const full = (s, l) => (l === "en" ? s.toLowerCase().replace(/[^a-z]/g, "") : nz(s));
  // Pseudo-words are often misheard as real words, so we compare consonant skeletons plus the full spelling, and take the best of the recogniser's alternatives.
  const wordScore = (alts, target, l) => alts.reduce((b, h) => Math.max(b, 0.6 * ratio(skel(h, l), skel(target, l)) + 0.4 * ratio(full(h, l), full(target, l))), 0);
  const PASS = 0.6;

  /* ---------- pseudo-word generator (new words every time) ---------- */
  const AR_C1 = ["ب","ت","د","ك","م","ن","ف","س","ل","ر","ز","ج","ح","ش"], AR_C2 = ["خ","غ","ط","ص","ق","ع","ث"], MARK = { a:"\u064E", i:"\u0650", u:"\u064F" }, LONG = { a:"ا", i:"ي", u:"و" };
  const AR_BLOCK = new Set(["سما","دبي","بابا","ماما","عمو","خالو","جدو","كتب","نمل","لبن","تمر","ملك","فتح","نوم","روح","ريم","دانه","ندي","ليلي","ليلا","سلمي","نور","نورا","ماجد","ساره","سميره","جميله","سلمان","رنا","دينا","منا","سنا"]);
  const EN_C1 = ["b","d","f","g","k","l","m","n","p","r","s","t"], EN_C2 = ["v","z","sh","ch"], EN_V = ["a","e","i","o","u"];
  const EN_BLOCK = new Set(["mama","papa","dada","nana","pita","soda","lama","tuna","kilo","polo","gala","data","sofa","pasta","tofu","nina","dina","lola","lisa","mona","taco","metro","mimi","lulu","koko","fifi","gogo","bobo","momo","tutu","tuba","salsa","vega","gina","dino","rino","tina","sara","lena","mila","nora","rita","tito","vita","zena","gigi","kiki","lili","nono","pepe","sasa"]);
  function genWord(l, syl, tier) {
    let w = "";
    for (let t = 0; t < 60; t++) {
      w = ""; let prev = "";
      for (let k = 0; k < syl; k++) {
        const C = l === "ar" ? (tier === 1 ? AR_C1 : AR_C1.concat(AR_C2)) : (tier === 1 ? EN_C1 : EN_C1.concat(EN_C2)); let c; do { c = C[rand(C.length)]; } while (c === prev); prev = c;
        if (l === "ar") { const v = "aiu"[rand(3)]; w += c + MARK[v]; if (k === syl - 1 && Math.random() < 0.6) w += LONG[v]; } else w += c + EN_V[rand(5)];
      }
      if (!(l === "ar" ? AR_BLOCK : EN_BLOCK).has(l === "ar" ? nz(w) : w)) return w;
    }
    return w;
  }

  const TL = { "ب":"b","ت":"t","د":"d","ك":"k","م":"m","ن":"n","ف":"f","س":"s","ل":"l","ر":"r","ز":"z","ج":"j","ح":"h","ش":"sh","خ":"kh","غ":"gh","ط":"t","ص":"s","ق":"k","ع":"a","ث":"th" };
  const translit = (w) => { const ch = [...w], LV = { "\u064E":["ا","ah"], "\u0650":["ي","ee"], "\u064F":["و","oo"] }, SV = { "\u064E":"a", "\u0650":"i", "\u064F":"u" }; let o = "";
    for (let i = 0; i < ch.length; i++) { const c = ch[i]; if (TL[c]) o += TL[c]; else if (LV[c]) { if (ch[i + 1] === LV[c][0]) { o += LV[c][1]; i++; } else o += SV[c]; } } return o; };

  /* ---------- age tiers ---------- */
  const A = (age) => Math.max(4, Math.min(8, age || 6));
  const G1 = { 4:[6,2], 5:[8,2], 6:[10,3], 7:[12,3], 8:[12,4] };                 // trials, stars on screen
  const G2 = { 4:[5,1], 5:[6,1], 6:[8,2], 7:[8,2], 8:[8,3] };                    // trials, distractors
  const LENS = { 4:[2,2,2,2,3,3], 5:[2,2,2,3,3,3], 6:[2,2,3,3,3,4,4,4], 7:[3,3,3,4,4,4,5,5], 8:[3,3,4,4,4,5,5,5] };
  const G4 = { 4:[["color",4],["obj1",4]], 5:[["color",3],["obj1",5]], 6:[["color",4],["obj2",4],["digit",4]], 7:[["color",3],["obj2",5],["digit",4]], 8:[["color",3],["obj2",5],["digit",4]] };
  const G5 = { 6:[6,3], 7:[8,3], 8:[8,4] }, G6 = { 6:[6,3], 7:[8,3], 8:[8,4] };  // trials, total options

  /* ---------- Game 1 ---------- */
  const OBJ1 = ["⭐","🎈","🍎","🐟","🦋","🌸","🍊","🚗","🐥","🍓","🧸","🪁"];
  async function game1(c) {
    const [N, K] = G1[A(c.age)];
    c.body.innerHTML = `<div class="arena" id="ar">${FACE}</div>`;
    const ar = $("#ar"), pup = [...ar.querySelectorAll(".pup")], hd = ar.querySelector(".hd");
    const gaze = (dx, dy) => { pup.forEach((p) => (p.style.transform = `translate(${dx * 9}px,${dy * 7}px)`)); hd.style.transform = `translate(${dx * 6}px,${dy * 4}px) rotate(${dx * 7}deg)`; };
    const trials = []; let premature = 0, armed = false, resolve = null;
    for (let t = 0; t < N; t++) {
      c.prog(t, N); c.check();
      const W = ar.clientWidth, H = ar.clientHeight, rx = W * 0.36, ry = H * 0.36, target = rand(K), faces = shuffle(OBJ1).slice(0, K);
      const stars = shuffle([0, 1, 2, 3, 4, 5, 6, 7]).slice(0, K).map((s, k) => {
        const a = (s * Math.PI) / 4, b = document.createElement("button");
        b.className = "st c" + k; b.textContent = faces[k]; b.setAttribute("aria-label", "item");
        b.style.left = W / 2 + rx * Math.cos(a) - 38 + "px"; b.style.top = H / 2 + ry * Math.sin(a) - 38 + "px";
        b.onclick = () => { if (!armed) premature++; else if (resolve) resolve(k); };
        ar.appendChild(b); return { b, a };
      });
      gaze(0, 0); await wait(700 + rand(900)); c.check();
      gaze(Math.cos(stars[target].a), Math.sin(stars[target].a)); armed = true; const onset = performance.now();
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

  /* ---------- Game 2: rhymes (difficulty d = 1 easy .. 3 hard) ---------- */
  const R = (w, we, a, ae, d) => [w, we, [a, ae], d];
  const RH = {
    ar: [R("قطة","🐱","بطة","🦆",1),R("كلب","🐶","قلب","❤️",1),R("جمل","🐪","بصل","🧅",1),R("كرة","⚽","ذرة","🌽",1),R("ورد","🌹","برد","🧊",1),R("سمك","🐟","ملك","👑",1),R("نار","🔥","قطار","🚆",1),R("جرس","🔔","فرس","🐴",1),R("حوت","🐳","صوت","🔊",1),R("باب","🚪","كتاب","📖",1),
      R("فيل","🐘","نخيل","🌴",2),R("قمر","🌙","شجر","🌳",2),R("تفاح","🍎","مفتاح","🔑",2),R("قلم","✏️","علم","🚩",2),R("ولد","👦","أسد","🦁",2),R("مطر","🌧️","سفر","🧳",2),R("دجاجة","🐔","زجاجة","🍼",2),
      R("سيف","⚔️","صيف","🏖️",3),R("جبل","⛰️","عسل","🍯",3),R("بحر","🌊","صقر","🦅",3),R("خروف","🐑","حروف","🔤",3),R("طيارة","✈️","سيارة","🚗",3),R("شجرة","🌳","ثمرة","🍒",3)],
    en: [R("cat","🐱","hat","🎩",1),R("dog","🐶","log","🪵",1),R("bee","🐝","tree","🌳",1),R("fish","🐟","dish","🍽️",1),R("cake","🎂","snake","🐍",1),R("boat","⛵","goat","🐐",1),R("star","⭐","car","🚗",1),R("bed","🛏️","red","🔴",1),R("hen","🐔","pen","🖊️",1),R("bug","🐛","mug","☕",1),
      R("moon","🌙","spoon","🥄",2),R("bear","🐻","chair","🪑",2),R("pear","🍐","hair","💇",2),R("sock","🧦","clock","⏰",2),R("ring","💍","king","🤴",2),R("train","🚂","rain","🌧️",2),R("nose","👃","rose","🌹",2),R("mouse","🐭","house","🏠",2),
      R("hand","✋","sand","🏖️",3),R("shell","🐚","bell","🔔",3),R("pie","🥧","tie","👔",3),R("kite","🪁","light","💡",3),R("ship","🚢","lip","👄",3),R("whale","🐳","snail","🐌",3),R("clown","🤡","crown","👑",3)]
  };
  const DIS = { ar:[["شمس","☀️"],["موز","🍌"],["بيت","🏠"],["زهرة","🌸"],["دب","🐻"],["حصان","🐴"],["نحلة","🐝"],["ساعة","⏰"],["كرسي","🪑"],["قارب","⛵"],["ثلج","❄️"],["عنب","🍇"],["بقرة","🐄"],["ضفدع","🐸"],["فراشة","🦋"],["نجمة","⭐"]],
    en: [["apple","🍎"],["book","📖"],["cup","☕"],["ball","⚽"],["duck","🦆"],["egg","🥚"],["milk","🥛"],["drum","🥁"],["shoe","👟"],["lion","🦁"],["pizza","🍕"],["bus","🚌"],["fork","🍴"],["leaf","🍃"],["cow","🐄"]] };
  const WIN = { 4:[1], 5:[1,2], 6:[1,2], 7:[2,3], 8:[2,3] };
  const ek = (w) => nz(w).slice(-2);
  function rhymeTrial(age, l, it) {
    const [w, we, ans] = it, K = G2[A(age)][1];
    const dis = shuffle(DIS[l].filter((d) => d[0] !== w && d[0] !== ans[0] && ek(d[0]) !== ek(w) && ek(d[0]) !== ek(ans[0]))).slice(0, K);
    return { w, we, opts: shuffle([{ t: ans[0], e: ans[1], ok: true }].concat(dis.map((d) => ({ t: d[0], e: d[1], ok: false })))) };
  }
  async function game2(c) {
    const age = A(c.age), N = G2[age][0], items = gather(N, (l, k) => pickFresh("rh-" + l, RH[l].filter((x) => WIN[age].includes(x[3])), k)), trials = []; let replays = 0;
    for (let t = 0; t < items.length; t++) {
      c.prog(t, items.length); c.check(); const { l, it } = items[t], { w, we, opts } = rhymeTrial(age, l, it);
      c.body.innerHTML = `<div class="rhyme"><div class="word"><span class="em">${we}</span><b dir="auto">${w}</b><button class="chip" id="rp" type="button">🔊 ${T("replay")}</button></div><div class="choices" id="ch" style="visibility:hidden"></div></div>`;
      const ch = $("#ch"); let resolve = null, shown = false;
      opts.forEach((o, i) => { const b = document.createElement("button"); b.className = "opt"; b.type = "button"; b.innerHTML = `<span>${o.e}</span><small dir="auto">${o.t}</small>`; b.onclick = () => shown && resolve && resolve(i); ch.appendChild(b); });
      $("#rp").onclick = () => { if (shown) replays++; speak(w, l); };
      await speak(w, l); c.check(); ch.style.visibility = "visible"; shown = true; const onset = performance.now();
      const k = await new Promise((r) => { resolve = r; setTimeout(() => r(-1), 12000); });
      const rt = Math.round(performance.now() - onset); shown = false; c.check();
      const bs = ch.children; opts.forEach((o, i) => { if (o.ok) bs[i].classList.add(k === i ? "ok" : "hint"); else if (i === k) bs[i].classList.add("no"); });
      trials.push({ t, lang: l, word: w, chosen: k < 0 ? null : opts[k].t, correct: k >= 0 && opts[k].ok, omitted: k < 0, rt: k < 0 ? null : rt });
      await wait(1000);
    }
    c.prog(items.length, items.length);
    const good = trials.filter((x) => x.correct).map((x) => x.rt);
    return { trials, metrics: { n: trials.length, correct: trials.filter((x) => x.correct).length, omissions: trials.filter((x) => x.omitted).length, replays, medianRT: rnd(med(good)), choices: G2[age][1] + 1 } };
  }

  /* ---------- Game 3: Silly Word Echo (checked automatically) ---------- */
  async function game3(c) {
    const age = A(c.age), lens = LENS[age], tier = age <= 5 ? 1 : 2, pl = langPlan(lens.length), used = new Set(), trials = [];
    const items = lens.map((n, i) => { let w; do { w = genWord(pl[i], n, tier); } while (used.has(w)); used.add(w); return { w, s: n, l: pl[i], alt: pl[i] === "ar" ? translit(w) : null }; });
    const N = items.length; let unavailable = !SR, fails = 0, viaAlt = 0, silent = 0;
    if (!SR) await micHelp(c, "unsupported");
    for (let t = 0; t < N && !unavailable; t++) {
      c.prog(t, N); c.check(); const { w, s, l, alt } = items[t]; let tries = 0, res = null;
      c.body.innerHTML = `<div class="echo"><div class="big">🦜</div><h2>${T("listen")}</h2></div>`;
      let sp = await speak(w, l, alt); c.check(); if (sp.alt) viaAlt++; if (!sp.ok) silent++;
      for (;;) {
        c.body.innerHTML = `<div class="echo"><div class="big">🦜</div><h2>${T("tapmic")}</h2>${sp.ok ? "" : `<div class="wbig" dir="auto">${esc(w)}</div><p class="micnote">${T("novoice")}</p>`}<div class="mrow"><button class="chip" id="hw" type="button">🔊 ${T("replay")}</button><button class="clapbtn" id="mk" type="button">🎤</button></div></div>`;
        const act = await new Promise((r) => { $("#hw").onclick = () => r("hear"); $("#mk").onclick = () => r("say"); }); c.check();
        if (act === "hear") { sp = await speak(w, l, alt); c.check(); if (sp.alt) viaAlt++; continue; }
        c.body.innerHTML = `<div class="echo"><div class="big mic">🎤</div><h2>${T("nowyou")}</h2></div>`;
        res = await listen(l, 7500, null); c.check();
        if (res.none && !micOK) { const m = await micHelp(c, res.err || "denied"); if (m === "skip") { unavailable = true; break; } micOK = true; continue; }
        if (res.alts.length) break;
        if (++tries < 2) { c.body.innerHTML = `<div class="echo"><div class="big">🦜</div><h2>${T("again")}</h2></div>`; await wait(1200); continue; }
        break;
      }
      if (unavailable) break;
      if (!res.alts.length) {
        trials.push({ t, lang: l, word: w, syl: s, heard: "", score: null, correct: null, omitted: true, latency: res.latency, tries, err: res.err });
        c.body.innerHTML = `<div class="echo"><div class="big">🦜</div><h2>${T("skipitem")}</h2></div>`; await wait(900);
        if (++fails >= 2) { const m = await micHelp(c, res.err || "silent"); if (m === "skip") { unavailable = true; break; } micOK = true; fails = 0; }
        continue;
      }
      fails = 0; const sc = wordScore(res.alts, w, l);
      trials.push({ t, lang: l, word: w, syl: s, heard: res.alts[0], score: +sc.toFixed(2), correct: sc >= PASS, omitted: false, latency: res.latency, tries });
      c.body.innerHTML = `<div class="echo"><div class="big">🌟</div><h2>${T("good")}</h2><small class="heard" dir="auto">${esc(res.alts[0])}</small></div>`; await wait(900);
    }
    c.prog(N, N);
    const sc = trials.filter((x) => x.correct !== null), byLen = {}; sc.forEach((x) => { const b = (byLen[x.syl] = byLen[x.syl] || { c: 0, n: 0 }); b.n++; if (x.correct) b.c++; });
    return { trials, metrics: { n: N, scored: sc.length, correct: sc.filter((x) => x.correct).length, omissions: trials.filter((x) => x.omitted).length,
      medianLatency: rnd(med(trials.filter((x) => x.latency != null).map((x) => x.latency))), byLen, unavailable, viaAlt, silent } };
  }

  /* ---------- Game 4: Quick Naming Race (checked automatically) ---------- */
  const C = (e, ar, en) => ({ e, ar, en });
  const BANK = {
    color: [C("🔴",["احمر","حمرا"],["red"]),C("🔵",["ازرق","زرقا"],["blue"]),C("🟢",["اخضر","خضرا"],["green"]),C("🟡",["اصفر","صفرا"],["yellow"]),C("🟠",["برتقالي","برتقال"],["orange"]),C("🟣",["بنفسجي","موف"],["purple","violet"]),C("⚫",["اسود","سودا"],["black"]),C("⚪",["ابيض","بيضا"],["white"])],
    obj1: [C("🐱",["قطه","قطو","بسه","بزونه"],["cat","kitty"]),C("🏠",["بيت","منزل"],["house","home"]),C("🍎",["تفاح","تفاحه"],["apple"]),C("🚗",["سياره","عربيه"],["car"]),C("⭐",["نجمه"],["star"]),C("⚽",["كره","طابه"],["ball"]),
      C("🐟",["سمكه","سمك"],["fish"]),C("☀️",["شمس"],["sun"]),C("🌙",["قمر","هلال"],["moon"]),C("🌳",["شجره","شجر"],["tree"]),C("🌸",["زهره","ورده","وره"],["flower"]),C("🐶",["كلب"],["dog","puppy"]),C("🦆",["بطه"],["duck"]),C("🍌",["موز","موزه"],["banana"]),C("📖",["كتاب"],["book"]),C("☕",["كوب","فنجان","كاسه"],["cup"])],
    obj2: [C("🐪",["جمل","ناقه"],["camel"]),C("🔑",["مفتاح"],["key"]),C("⏰",["ساعه","منبه"],["clock"]),C("🚲",["دراجه","سيكل","عجله"],["bicycle","bike"]),C("☂️",["مظله","شمسيه"],["umbrella"]),C("✈️",["طياره","طائره"],["airplane","plane"]),
      C("🐘",["فيل"],["elephant"]),C("🦋",["فراشه"],["butterfly"]),C("🍉",["بطيخ","بطيخه","رقي"],["watermelon"]),C("🍇",["عنب"],["grapes"]),C("🪑",["كرسي"],["chair"]),C("📱",["جوال","هاتف","تلفون","موبايل"],["phone"]),
      C("🚀",["صاروخ"],["rocket"]),C("🦁",["اسد","سبع"],["lion"]),C("🐢",["سلحفاه"],["turtle"])],
    digit: [["واحد"],["اثنين","اثنان"],["ثلاثه","ثلاث"],["اربعه","اربع"],["خمسه","خمس"],["سته","ست"],["سبعه","سبع"],["ثمانيه","ثمان"],["تسعه","تسع"]].map((a, i) => C(String(i + 1), a, [["one"],["two"],["three"],["four"],["five"],["six"],["seven"],["eight"],["nine"]][i].concat(String(i + 1))))
  };
  const nameMatch = (alts, it) => { const keys = it.ar.concat(it.en).map(nm); return alts.some((a) => { const p = " " + nm(a) + " "; return keys.some((k) => p.includes(" " + k + " ") || (k.length >= 3 && p.includes(k))); }); };
  async function game4(c) {
    const age = A(c.age); let items = [];
    G4[age].forEach(([k, n]) => pickFresh("nm-" + k, BANK[k], n, (x) => x.e).forEach((it) => items.push({ it, cat: k })));
    const N = items.length, pl = langPlan(N), trials = []; let unavailable = false, fails = 0;
    if (!SR) { try { const st = await navigator.mediaDevices.getUserMedia({ audio: true }); st.getTracks().forEach((k) => k.stop()); } catch (e) { await micHelp(c, "denied"); unavailable = true; } }
    for (let t = 0; t < N && !unavailable; t++) {
      c.prog(t, N); c.check(); const { it, cat: ct } = items[t]; let res = null;
      for (let a = 0; a < 2; a++) {
        c.body.innerHTML = `<div class="ran"><div class="ritem" id="ri"></div></div>`; await wait(500); c.check();
        if (SR) {
          res = await listen(pl[t], 6000, () => { const r = $("#ri"); if (r) r.textContent = it.e; }, 900); c.check();
          if (res.none && !micOK) { const m = await micHelp(c, res.err || "denied"); if (m === "skip") { unavailable = true; break; } micOK = true; a--; continue; }
        } else { $("#ri").textContent = it.e; res = await vadOnce(5000); c.check(); }
        if ((res.alts && res.alts.length) || res.latency != null) break;
      }
      if (unavailable) break;
      if (!(res && ((res.alts && res.alts.length) || res.latency != null))) {
        trials.push({ t, cat: ct, item: it.en[0], rt: null, correct: null, omitted: true, err: res && res.err });
        if (++fails >= 2) { const m = await micHelp(c, (res && res.err) || "silent"); if (m === "skip") { unavailable = true; break; } micOK = true; fails = 0; }
        continue;
      }
      fails = 0; const ok = res.alts && res.alts.length ? nameMatch(res.alts, it) : null;
      trials.push({ t, cat: ct, item: it.en[0], heard: (res.alts && res.alts[0]) || "", rt: res.latency, correct: ok, omitted: false });
      const box = c.body.querySelector ? c.body.querySelector(".ran") : null; if ($("#ri")) $("#ri").classList.add("done"); if (box) box.insertAdjacentHTML("beforeend", `<small class="heard" dir="auto">${esc((res.alts && res.alts[0]) || "")}</small>`);
      await wait(600);
    }
    c.prog(N, N);
    const rts = trials.filter((x) => x.rt != null).map((x) => x.rt), m = med(rts), mean = rts.length ? rts.reduce((a, b) => a + b, 0) / rts.length : null, s = sd(rts), sc = trials.filter((x) => x.correct !== null);
    const byCat = {}; ["color", "obj1", "obj2", "digit"].forEach((k) => { const v = trials.filter((x) => x.cat === k && x.rt != null).map((x) => x.rt); if (v.length) byCat[k] = rnd(med(v)); });
    return { trials, metrics: { n: N, scored: sc.length, errors: sc.filter((x) => !x.correct).length, omissions: trials.filter((x) => x.omitted).length, slow: rts.filter((v) => v > 3000).length,
      medianRT: rnd(m), meanRT: rnd(mean), rtCV: mean && s != null ? +(s / mean).toFixed(2) : null, byCat, voiceTrials: rts.length, mode: SR ? "asr" : "vad", unavailable } };
  }
  // Fallback for browsers without speech recognition: only times when speech starts (on-device volume check, nothing recorded).
  async function vadOnce(ms) {
    let st; try { st = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (e) { return { alts: [], latency: null }; }
    const ac = new (window.AudioContext || window.webkitAudioContext)(), an = ac.createAnalyser(); an.fftSize = 1024; ac.createMediaStreamSource(st).connect(an); const buf = new Uint8Array(an.fftSize);
    const lvl = () => { an.getByteTimeDomainData(buf); let s = 0; for (let i = 0; i < buf.length; i++) { const v = (buf[i] - 128) / 128; s += v * v; } return Math.sqrt(s / buf.length); };
    let floor = 0; const t0 = performance.now(); let lat = null;
    while (performance.now() - t0 < ms && lat == null) { const l = lvl(), t = performance.now() - t0; if (t < 300) floor = Math.max(floor, l); else if (l > Math.max(0.04, floor * 2.5 + 0.015)) lat = Math.round(t); await wait(30); }
    st.getTracks().forEach((k) => k.stop()); ac.close(); return { alts: [], latency: lat };
  }

  /* ---------- Game 5: Letter Twins (ages 6-8) ---------- */
  const GRP = {
    ar: [["ب","ت","ث","ن"],["ج","ح","خ"],["ع","غ"],["ف","ق"],["س","ش"],["د","ذ"],["ر","ز"],["ص","ض"],["ط","ظ"],["ك","ل"],["ص","ض","ط"],["ي","ن","ت"]],
    en: [["b","d","p","q"],["m","w"],["n","u"],["h","n"],["a","e"],["f","t"],["i","j"],["s","z"],["g","q"],["l","i"]]
  };
  const TRC = { ar: ["ب","ت","ج","خ","ع","ف","ن","ش","ق","س"], en: ["b","d","p","q","m","w","g","s"] };
  async function trace(c, letter) {
    c.body.innerHTML = `<div class="tr"><h2>${T("tr")}</h2><canvas id="cv"></canvas><div class="mrow"><button class="ghost" id="cl" type="button">${T("clear")}</button><button class="pill" id="dn" type="button"><span>${T("done")}</span></button></div></div>`;
    const cv = $("#cv"), W = Math.max(200, Math.min(300, c.body.clientWidth - 24)); cv.width = cv.height = W; const x = cv.getContext("2d");
    let strokes = [], cur = null, t0 = null;
    const guide = (g, z) => { g.textAlign = "center"; g.textBaseline = "middle"; g.font = `700 ${z * 0.7}px "Readex Pro",system-ui,sans-serif`; g.fillText(letter, z / 2, z / 2); };
    const redraw = () => { x.clearRect(0, 0, W, W); x.fillStyle = "rgba(255,255,255,.22)"; guide(x, W); x.strokeStyle = "#FFC94D"; x.lineWidth = W * 0.05; x.lineCap = x.lineJoin = "round";
      strokes.forEach((s) => { x.beginPath(); s.forEach((p, i) => (i ? x.lineTo(p[0] * W, p[1] * W) : x.moveTo(p[0] * W, p[1] * W))); if (s.length === 1) x.lineTo(s[0][0] * W + 0.1, s[0][1] * W); x.stroke(); }); };
    const pt = (e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; };
    cv.onpointerdown = (e) => { cv.setPointerCapture(e.pointerId); if (t0 == null) t0 = performance.now(); cur = [pt(e)]; strokes.push(cur); redraw(); };
    cv.onpointermove = (e) => { if (cur) { cur.push(pt(e)); redraw(); } }; cv.onpointerup = cv.onpointercancel = () => { cur = null; };
    $("#cl").onclick = () => { strokes = []; t0 = null; redraw(); }; redraw();
    await new Promise((r) => ($("#dn").onclick = r)); c.check();
    const Z = 64, g = document.createElement("canvas"), k = document.createElement("canvas"); g.width = g.height = k.width = k.height = Z;
    const gx = g.getContext("2d"), kx = k.getContext("2d"); gx.fillStyle = "#fff"; guide(gx, Z); kx.strokeStyle = "#fff"; kx.lineWidth = Z * 0.06; kx.lineCap = kx.lineJoin = "round";
    strokes.forEach((s) => { kx.beginPath(); s.forEach((p, i) => (i ? kx.lineTo(p[0] * Z, p[1] * Z) : kx.moveTo(p[0] * Z, p[1] * Z))); if (s.length === 1) kx.lineTo(s[0][0] * Z + 0.1, s[0][1] * Z); kx.stroke(); });
    const gd = gx.getImageData(0, 0, Z, Z).data, kd = kx.getImageData(0, 0, Z, Z).data, gm = new Uint8Array(Z * Z), im = new Uint8Array(Z * Z), Gp = [], Ip = [];
    for (let i = 0; i < Z * Z; i++) { if (gd[i * 4 + 3] > 60) { gm[i] = 1; Gp.push(i); } if (kd[i * 4 + 3] > 60) { im[i] = 1; Ip.push(i); } }
    const near = (m, i, r) => { const x0 = i % Z, y0 = (i / Z) | 0; for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { const xx = x0 + dx, yy = y0 + dy; if (xx >= 0 && yy >= 0 && xx < Z && yy < Z && m[yy * Z + xx]) return true; } return false; };
    const precision = Ip.length ? Ip.filter((i) => near(gm, i, 3)).length / Ip.length : 0, recall = Gp.length ? Gp.filter((i) => near(im, i, 3)).length / Gp.length : 0;
    return { letter, strokes: strokes.length, ms: t0 ? Math.round(performance.now() - t0) : null, precision: +precision.toFixed(2), recall: +recall.toFixed(2) };
  }
  async function game5(c) {
    const age = A(c.age), [N, maxOpt] = G5[Math.max(6, age)], trials = [];
    const items = gather(N, (l, k) => pickFresh("gr-" + l, GRP[l], k, (g) => g.join("")));
    for (let t = 0; t < items.length; t++) {
      c.prog(t, items.length + 3); c.check(); const { l, it: G } = items[t], target = G[rand(G.length)], opts = shuffle([target].concat(shuffle(G.filter((x) => x !== target)).slice(0, maxOpt - 1)));
      c.body.innerHTML = `<div class="rhyme"><div class="word"><small class="sub">${T("same")}</small><span class="tl">${target}</span></div><div class="choices" id="ch"></div></div>`;
      let resolve = null; const ch = $("#ch");
      opts.forEach((x, i) => { const b = document.createElement("button"); b.className = "opt letter"; b.type = "button"; b.innerHTML = `<span>${x}</span>`; b.onclick = () => resolve && resolve(i); ch.appendChild(b); });
      const onset = performance.now(), k = await new Promise((r) => { resolve = r; setTimeout(() => r(-1), 12000); }), rt = Math.round(performance.now() - onset); c.check();
      const bs = ch.children; opts.forEach((x, i) => { if (x === target) bs[i].classList.add(k === i ? "ok" : "hint"); else if (i === k) bs[i].classList.add("no"); });
      trials.push({ t, lang: l, target, chosen: k < 0 ? null : opts[k], correct: k >= 0 && opts[k] === target, omitted: k < 0, rt: k < 0 ? null : rt, options: opts.length }); await wait(900);
    }
    const tl = gather(3, (l, k) => pickFresh("tr-" + l, TRC[l], k, (x) => x)), traces = [];
    for (const { it } of tl) { c.prog(items.length + traces.length, items.length + 3); traces.push(await trace(c, it)); c.check(); }
    c.prog(items.length + 3, items.length + 3);
    const good = trials.filter((x) => x.correct).map((x) => x.rt), avg = (k) => +(traces.reduce((s, x) => s + x[k], 0) / traces.length).toFixed(2);
    return { trials, traces, metrics: { n: trials.length, correct: trials.filter((x) => x.correct).length, medianRT: rnd(med(good)), script: CL,
      confusions: trials.filter((x) => x.chosen && !x.correct).map((x) => x.target + ">" + x.chosen), tracePrecision: avg("precision"), traceRecall: avg("recall"), traceStrokes: avg("strokes") } };
  }

  /* ---------- Game 6: Sound Detective (first sound), ages 6-8 ---------- */
  const W2 = (a) => a.map((x) => x.split("|"));
  const ST = {
    ar: { "ب":W2(["بطة|🦆","بقرة|🐄","بيت|🏠","بالون|🎈"]), "ج":W2(["جمل|🐪","جبل|⛰️","جزر|🥕","جرس|🔔"]), "ق":W2(["قطة|🐱","قمر|🌙","قلم|✏️","قرد|🐒","قطار|🚆"]), "ف":W2(["فيل|🐘","فراشة|🦋","فار|🐭","فرس|🐴"]),
      "س":W2(["سمك|🐟","سيارة|🚗","ساعة|⏰","سلحفاة|🐢","سفينة|🚢"]), "ش":W2(["شمس|☀️","شجرة|🌳","شمعة|🕯️"]), "ن":W2(["نجمة|⭐","نمر|🐅","نحلة|🐝","نار|🔥"]), "م":W2(["موز|🍌","مفتاح|🔑","مطر|🌧️","مدرسة|🏫"]),
      "ك":W2(["كلب|🐶","كتاب|📖","كرة|⚽","كرسي|🪑"]), "ت":W2(["تفاح|🍎","تاج|👑","تلفاز|📺","تمساح|🐊"]), "د":W2(["دب|🐻","دجاجة|🐔","دراجة|🚲","دلفين|🐬"]), "ح":W2(["حصان|🐴","حوت|🐳","حليب|🥛","حمامة|🕊️"]),
      "ع":W2(["عنب|🍇","عين|👁️","عسل|🍯","علم|🚩"]), "ص":W2(["صقر|🦅","صندوق|📦","صابون|🧼","صاروخ|🚀"]), "خ":W2(["خروف|🐑","خيمة|⛺","خبز|🍞","خيار|🥒"]) },
    en: { b:W2(["ball|⚽","bee|🐝","bus|🚌","book|📖","boat|⛵"]), k:W2(["cat|🐱","cow|🐄","cup|☕","key|🔑","kite|🪁"]), d:W2(["dog|🐶","duck|🦆","drum|🥁","door|🚪"]), f:W2(["fish|🐟","frog|🐸","fork|🍴","flower|🌸"]),
      m:W2(["moon|🌙","mouse|🐭","milk|🥛","monkey|🐒"]), s:W2(["sun|☀️","snake|🐍","sock|🧦","star|⭐"]), t:W2(["tree|🌳","tiger|🐯","train|🚂","tooth|🦷"]), p:W2(["pig|🐷","pizza|🍕","pear|🍐","panda|🐼"]),
      h:W2(["hat|🎩","house|🏠","horse|🐴","hand|✋"]), l:W2(["lion|🦁","leaf|🍃","lemon|🍋","ladder|🪜"]), r:W2(["rabbit|🐰","rain|🌧️","rose|🌹","robot|🤖"]), g:W2(["goat|🐐","grapes|🍇","gift|🎁","guitar|🎸"]), w:W2(["whale|🐳","watch|⌚","water|💧","wolf|🐺"]) }
  };
  const CONF = [["ت","ط"],["س","ص"],["ك","ق"],["ح","خ"],["ج","ش"],["د","ض"],["p","b"],["t","d"],["k","g"]];
  const conf = (a, b) => CONF.some((s) => s.includes(a) && s.includes(b));
  function soundTrial(age, l, key) {
    const K = G6[Math.max(6, age)][1], grp = shuffle(ST[l][key]), target = grp[0], answer = grp[1];
    const others = shuffle(Object.keys(ST[l]).filter((k) => k !== key && !conf(k, key))).slice(0, K - 1).map((k) => shuffle(ST[l][k])[0]);
    return { target, opts: shuffle([{ t: answer[0], e: answer[1], ok: true }].concat(others.map((o) => ({ t: o[0], e: o[1], ok: false })))) };
  }
  async function game6(c) {
    const age = A(c.age), N = G6[Math.max(6, age)][0], trials = [], items = gather(N, (l, k) => pickFresh("sd-" + l, Object.keys(ST[l]), k, (x) => x));
    for (let t = 0; t < items.length; t++) {
      c.prog(t, items.length); c.check(); const { l, it: key } = items[t], { target, opts } = soundTrial(age, l, key);
      c.body.innerHTML = `<div class="rhyme"><div class="word"><span class="em">${target[1]}</span><b dir="auto">${target[0]}</b><button class="chip" id="rp" type="button">🔊 ${T("replay")}</button></div><div class="choices" id="ch" style="visibility:hidden"></div></div>`;
      const ch = $("#ch"); let resolve = null, shown = false;
      opts.forEach((o, i) => { const b = document.createElement("button"); b.className = "opt"; b.type = "button"; b.innerHTML = `<span>${o.e}</span><small dir="auto">${o.t}</small>`; b.onclick = () => shown && resolve && resolve(i); ch.appendChild(b); });
      $("#rp").onclick = () => speak(target[0], l);
      await speak(target[0], l); c.check(); ch.style.visibility = "visible"; shown = true; const onset = performance.now();
      const k = await new Promise((r) => { resolve = r; setTimeout(() => r(-1), 12000); }), rt = Math.round(performance.now() - onset); shown = false; c.check();
      const bs = ch.children; opts.forEach((o, i) => { if (o.ok) bs[i].classList.add(k === i ? "ok" : "hint"); else if (i === k) bs[i].classList.add("no"); });
      trials.push({ t, lang: l, sound: key, word: target[0], chosen: k < 0 ? null : opts[k].t, correct: k >= 0 && opts[k].ok, omitted: k < 0, rt: k < 0 ? null : rt }); await wait(1000);
    }
    c.prog(items.length, items.length);
    return { trials, metrics: { n: trials.length, correct: trials.filter((x) => x.correct).length, omissions: trials.filter((x) => x.omitted).length, medianRT: rnd(med(trials.filter((x) => x.correct).map((x) => x.rt))), choices: G6[Math.max(6, age)][1] } };
  }

  /* ---------- engine ---------- */
  const FACE = `<svg class="fl" viewBox="0 0 200 200" aria-hidden="true"><g class="hd"><path d="M82 34c-4-14 4-24 9-28 1 8 5 12 9 14 4-2 8-6 9-14 5 4 13 14 9 28z" fill="#C98D4B"/>
    <circle cx="100" cy="100" r="82" fill="#E9B872"/><ellipse cx="100" cy="112" rx="66" ry="54" fill="#FFF1D6"/><circle cx="52" cy="126" r="11" fill="#FF8A6B" opacity=".45"/><circle cx="148" cy="126" r="11" fill="#FF8A6B" opacity=".45"/>
    <path d="M60 108c-4 10-3 22 4 29-1-10 1-18 6-24zM140 108c4 10 3 22-4 29 1-10-1-18-6-24z" fill="#6B4423"/><circle cx="72" cy="92" r="24" fill="#fff"/><circle cx="128" cy="92" r="24" fill="#fff"/>
    <g class="pup"><circle cx="72" cy="92" r="12" fill="#2B1B5E"/><circle cx="68" cy="88" r="4" fill="#fff"/></g><g class="pup"><circle cx="128" cy="92" r="12" fill="#2B1B5E"/><circle cx="124" cy="88" r="4" fill="#fff"/></g>
    <path d="M84 120c0-6 32-6 32 0 0 10-7 22-16 28-9-6-16-18-16-28z" fill="#FFC94D"/></g></svg>`;
  const GAMES = [{ id:"g1", icon:"⭐", t:"t1", i:"i1", run:game1, line:"s1" }, { id:"g2", icon:"🐣", t:"t2", i:"i2", run:game2, line:"s2", lang:1 },
    { id:"g3", icon:"🦜", t:"t3", i:"i3", note:"n3", run:game3, line:"s3", lang:1 }, { id:"g4", icon:"🏁", t:"t4", i:"i4", note:"n4", run:game4, line:"s4", lang:1 },
    { id:"g5", icon:"🔤", t:"t5", i:"i5", run:game5, line:"s5", lang:1 }, { id:"g6", icon:"🔎", t:"t6", i:"i6", ex:1, run:game6, line:"s6", lang:1 }];
  const fmt = (s, m) => s.replace(/\{(\w)\}/g, (_, k) => m[k]);
  const defCL = () => { const p = prof(), h = p && p.child.homeLang; return h === "en" ? "en" : h === "both" ? "mix" : "ar"; };

  async function play(i, results, my) {
    const plan = window.Tiflan.plan(), g = GAMES.slice(0, plan)[i], p = prof(), age = p ? p.child.age : 6, body = $("#gmBody");
    $("#gmTitle").textContent = T(g.t); $("#gmCount").textContent = fmt(T("count"), { i: i + 1, n: plan }); $("#gmProg").innerHTML = "";
    const chips = g.lang ? `<div class="lcs"><small class="sub">${T("lc")}</small><div class="chips">${[["ar","lar"],["en","len"],["mix","lmix"]].map(([k, n]) => `<button type="button" class="chip" data-cl="${k}" aria-pressed="${CL === k}">${T(n)}</button>`).join("")}</div></div>` : "";
    const ex = g.ex ? `<div class="exs"><span>${L() === "en" ? "🐱" : "🐱"}<br>${T("exw")[0]}</span><span>${L() === "en" ? "🔑" : "🌙"}<br>${T("exw")[1]}</span></div><p class="micnote">${T("ex6")}</p>` : "";
    const tests = g.note ? `<div class="lcs"><div class="chips"><button type="button" class="chip" id="gmMic">🎤 ${T("mictest")}</button><button type="button" class="chip" id="gmVoice">🔊 ${T("voicetest")}</button></div><small class="sub" id="gmTestOut"></small></div>` : "";
    body.innerHTML = `<div class="gm-intro"><div class="big">${g.icon}</div><h2>${T(g.t)}</h2><p>${T(g.i)}</p>${ex}${g.note ? `<p class="micnote">${T(g.note)}</p>` : ""}${chips}${tests}
      <button class="pill" id="gmGo" type="button"><span>${T("start")}</span><b>▶</b></button></div>`;
    body.querySelectorAll("[data-cl]").forEach((b) => (b.onclick = () => { CL = b.dataset.cl; body.querySelectorAll("[data-cl]").forEach((x) => x.setAttribute("aria-pressed", x === b)); }));
    if ($("#gmMic")) {
      const out = $("#gmTestOut"), tl = () => (CL === "en" ? "en" : "ar");
      $("#gmMic").onclick = async () => { micOK = true; out.textContent = T("micsay"); const r = await listen(tl(), 7000, () => (out.textContent = T("micgo")), 1200); out.textContent = r.alts.length ? T("micheard") + " " + r.alts[0] : errMsg(r.err || "silent"); };
      $("#gmVoice").onclick = async () => { out.textContent = "…"; const w = tl() === "en" ? "hello" : "مرحبا", r = await speak(w, tl()); out.textContent = r.ok ? T("voiceok") : T("voicebad"); };
    }
    speak(T(g.i), L() === "en" ? "en" : "ar");
    await new Promise((r) => ($("#gmGo").onclick = r)); check(my); if (window.speechSynthesis) speechSynthesis.cancel();
    const ctx = { body, age, check: () => check(my), prog: (k, n) => { $("#gmProg").innerHTML = Array.from({ length: n }, (_, j) => `<i class="${j < k ? "on" : ""}"></i>`).join(""); } };
    const res = await g.run(ctx); check(my); results.push({ g, res });
    window.Tiflan.update((q) => { q.games = q.games || {}; q.games[g.id] = { ts: Date.now(), age, lang: CL, metrics: res.metrics, trials: res.trials, traces: res.traces }; });
    window.Tiflan.log("Game Master", g.id + " " + JSON.stringify(res.metrics));
    const last = i === Math.min(GAMES.length, plan) - 1;
    body.innerHTML = `<div class="gm-intro"><div class="big">🌟🌟🌟</div><h2>${T("well")}</h2><button class="pill" id="gmNext" type="button"><span>${T(last ? "cont" : "next")}</span><b>↗</b></button></div>`;
    speak(T("well"), L() === "en" ? "en" : "ar"); await new Promise((r) => ($("#gmNext").onclick = r)); check(my);
    if (!last) return play(i + 1, results, my);
    summary(results);
  }
  function summary(results) {
    if (window.speechSynthesis) speechSynthesis.cancel(); $("#gmProg").innerHTML = ""; $("#gmCount").textContent = "";
    const rows = results.map(({ g, res }) => { const m = res.metrics, none = m.scored === 0;
      return `<li><b>${T(g.t)}</b><br>${none ? T("noscore") : fmt(T(g.line), { c: m.correct, n: m.n, m: sec(m.medianRT), p: m.premature, r: m.replays, s: m.scored, e: m.errors, q: Math.round(((m.tracePrecision || 0) + (m.traceRecall || 0)) * 50) })}</li>`; }).join("");
    $("#gmBody").innerHTML = `<div class="gm-sum"><h2>${T("fin")}</h2><p class="sub">${T("note")}</p><ul class="promises sum">${rows}</ul><p class="priv">${T("saved")}</p><button class="pill" id="gmDone" type="button"><span>${T("cont")}</span><b>↗</b></button></div>`;
    $("#gmDone").onclick = () => { close(); if (window.openResults) window.openResults(); };
  }
  function close() { tok++; $("#game").hidden = true; document.body.style.overflow = ""; if (window.speechSynthesis) speechSynthesis.cancel(); }
  window.openGames = () => {
    const my = ++tok; CL = defCL(); window.Tiflan.log("Orchestrator", "planned " + window.Tiflan.plan() + " games"); $("#game").hidden = false; document.body.style.overflow = "hidden";
    play(0, [], my).catch((e) => { if (e.message !== "cancel") console.error(e); });
  };
  if ($("#gmClose")) $("#gmClose").onclick = close;
  addEventListener("keydown", (e) => { if (e.key === "Escape" && $("#game") && !$("#game").hidden) close(); });
  window.TiflanGamesTest = { translit, game3, speak, listen, listen, speak, game3, game4, pickFresh, genWord, wordScore, nameMatch, rhymeTrial, soundTrial, RH, DIS, ST, BANK, LENS, G4, WIN, A, GRP };
})();
