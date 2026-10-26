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
  Object.assign(I18N.ar, { step6:"ألعاب الصوت (3 و4) تأتي في الخطوة 6." });
  Object.assign(I18N.en, { step6:"The voice games (3 and 4) arrive in Step 6." });
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

  const GAMES = [{ id:"g1", icon:"⭐", t:"t1", i:"i1", run:game1, line:"s1" }, { id:"g2", icon:"🐣", t:"t2", i:"i2", run:game2, line:"s2" }];
  const fmt = (s, m) => s.replace(/\{(\w)\}/g, (_, k) => m[k]);

  async function play(i, results, my) {
    const g = GAMES[i], p = window.Tiflan.profile(), age = p ? p.child.age : 6, body = $("#gmBody"), plan = window.Tiflan.plan();
    $("#gmTitle").textContent = T(g.t); $("#gmCount").textContent = fmt(T("count"), { i: i + 1, n: plan });
    $("#gmProg").innerHTML = ""; 
    body.innerHTML = `<div class="gm-intro"><div class="big">${g.icon}</div><h2>${T(g.t)}</h2><p>${T(g.i)}</p>
      <button class="pill" id="gmGo" type="button"><span>${T("start")}</span><b>▶</b></button></div>`;
    speak(T(g.i));
    await new Promise((r) => ($("#gmGo").onclick = r)); check(my);
    if (window.speechSynthesis) speechSynthesis.cancel();
    const ctx = { body, age, check: () => check(my), prog: (k, n) => { $("#gmProg").innerHTML = Array.from({ length: n }, (_, j) => `<i class="${j < k ? "on" : ""}"></i>`).join(""); } };
    const res = await g.run(ctx); check(my);
    results.push({ g, res });
    window.Tiflan.update((q) => { q.games = q.games || {}; q.games[g.id] = { ts: Date.now(), age, metrics: res.metrics, trials: res.trials }; });
    (window.Tiflan._log = window.Tiflan._log || []).push({ t: Date.now(), agent: "Game Master", msg: g.id + " " + JSON.stringify(res.metrics) });
    const last = i === GAMES.length - 1;
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
      return `<li><b>${T(g.t)}</b><br>${fmt(T(g.line), { c: m.correct, n: m.n, m: sec(m.medianRT), p: m.premature, r: m.replays })}</li>`; }).join("");
    $("#gmBody").innerHTML = `<div class="gm-sum"><h2>${T("fin")}</h2><p class="sub">${T("note")}</p><ul class="promises sum">${rows}</ul>
      <p class="priv">${T("saved")}</p><button class="pill" id="gmDone" type="button"><span>${T("cont")}</span><b>↗</b></button></div>`;
    $("#gmDone").onclick = () => { close(); window.tiflanToast("step6"); };
  }
  function close() { tok++; $("#game").hidden = true; document.body.style.overflow = ""; if (window.speechSynthesis) speechSynthesis.cancel(); }
  window.openGames = () => {
    const my = ++tok; $("#game").hidden = false; document.body.style.overflow = "hidden";
    play(0, [], my).catch((e) => { if (e.message !== "cancel") console.error(e); });
  };
  $("#gmClose").onclick = close;
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#game").hidden) close(); });
})();
