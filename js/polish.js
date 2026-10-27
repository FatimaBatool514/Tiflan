// Step 10: Demo mode, Behind-the-scenes agent view, Privacy centre, PWA registration.
(() => {
  const $ = (s) => document.querySelector(s), html = document.documentElement, LG = () => html.lang;
  const X = (ar, en) => ({ ar, en });
  Object.assign(I18N.ar, { nav2:"خلف الكواليس", nav3:"الخصوصية", m_demo:"عرض تجريبي", m_agents:"خلف الكواليس", m_priv:"الخصوصية" });
  Object.assign(I18N.en, { nav2:"Behind the scenes", nav3:"Privacy", m_demo:"Demo mode", m_agents:"Behind the scenes", m_priv:"Privacy" });
  const S = {
    ar: { demo:"🎬 وضع العرض التجريبي: طفل افتراضي (لا يُحفظ شيء)", exit:"خروج", ag_t:"خلف الكواليس: وكلاء طفلان", ag_s:"كل وكيل وحدة مستقلة لها مدخلات ومخرجات. هذا ما فعله كل واحد في هذه الجلسة.",
      done:"تم", wait:"بانتظار البيانات", log:"سجل الأحداث", nolog:"لا أحداث بعد. العبي جلسة أولاً أو جرّبي العرض التجريبي.", flow:"مسار البيانات",
      pr_t:"مركز الخصوصية", pr_s:"ما نحفظه، وما قد يخرج من جهازك، بصراحة.", st:"محفوظ على هذا الجهاز الآن", nost:"لا نحفظ أبداً", cloud:"ما قد يصل إلى جهات خارجية", none:"لا توجد بيانات محفوظة على هذا الجهاز.",
      dl:"⬇ نزّلي بياناتي (JSON)", wipe:"🗑 احذفي كل البيانات", wiped:"تم حذف كل البيانات.", legal:"قبل أي استخدام حقيقي: راجعوا قانون حماية البيانات الشخصية في الإمارات وسياسات هيئة الصحة بدبي للبيانات الصحية، واحصلوا على مراجعة سريرية وأخلاقية.", on:"مفعّل", off:"غير مفعّل" },
    en: { demo:"🎬 Demo mode: sample child (nothing is saved)", exit:"Exit", ag_t:"Behind the scenes: Tiflan's agents", ag_s:"Each agent is a separate module with defined inputs and outputs. Here is what each did in this session.",
      done:"Done", wait:"Waiting for data", log:"Event log", nolog:"No events yet. Play a session first or try the demo.", flow:"Data flow",
      pr_t:"Privacy centre", pr_s:"What we store, and what may leave your device, honestly.", st:"Stored on this device right now", nost:"We never store", cloud:"What may reach third parties", none:"No data is stored on this device.",
      dl:"⬇ Download my data (JSON)", wipe:"🗑 Delete all data", wiped:"All data deleted.", legal:"Before any real use: review the UAE Personal Data Protection Law and Dubai Health Authority health-data policies, and get clinical and ethics review.", on:"On", off:"Off" }
  };
  const T = (k) => S[LG()][k];
  const prof = () => window.Tiflan.profile(), cfgAI = () => !!(window.TIFLAN_CONFIG && window.TIFLAN_CONFIG.aiEndpoint);
  const pad = (n) => String(n).padStart(2, "0"), hm = (t) => { const d = new Date(t); return pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()); };

  /* ---------- demo ---------- */
  function demoProfile() {
    const Q = window.TiflanMatch.Q, l = LG(), now = Date.now();
    const pick = { words:"late", family:"yes", senses:"no", letters:"some", clarity:"partly", attention:"some", other:"none" }, answers = {}; let flags = 0;
    Q.forEach((q) => { const o = q.opts.find((x) => x.v === pick[q.id]); if (o) { answers[q.id] = { v: o.v, f: o.f, label: o[l], note: "" }; flags += o.f; } });
    const g = (m) => ({ ts: now, age: 7, metrics: m, trials: [] });
    return { sid: "demo0000-sample-child", createdAt: now, demo: true, consent: { play: true, mic: true, camera: false, ts: now }, child: { age: 7, gender: null, dialect: "gulf", homeLang: "ar" },
      intake: { answers, flags, done: now },
      games: { g1: g({ n:12, correct:11, omissions:0, premature:1, medianRT:980, rtCV:0.28 }), g2: g({ n:8, correct:5, omissions:0, replays:2, medianRT:2400 }),
        g3: g({ n:8, correct:4, confirmed:8, medianLatency:900, byLen:{ 2:{c:2,n:2}, 3:{c:2,n:3}, 4:{c:0,n:3} } }),
        g4: g({ n:12, omissions:0, slow:4, errors:2, medianRT:2100, meanRT:2300, rtCV:0.35, byCat:{ color:1800, object:2400 }, voiceTrials:12 }),
        g5: g({ n:8, correct:3, medianRT:3100, script:"ar", confusions:["ب>ت","ب>ن","ج>خ","ع>غ","ب>ت"], tracePrecision:0.62, traceRecall:0.55, traceStrokes:3 }),
        g6: g({ n:8, correct:4, meanAbsError:0.9, over:1, under:3, rhythmCV:0.45, bySyl:{} }) } };
  }
  function startDemo() {
    const p = demoProfile(), t0 = Date.now() - 420000, L = [["Guardian Agent","consent recorded; data kept on device only"],["Orchestrator","planned 6 games for age 7"],["Intake Agent","7 answers captured, 5 follow-up points"],
      ["Game Master","g1 attention: 11/12 correct"],["Game Master","g2 rhyme: 5/8 correct"],["Speech Analysis","g3 echo: 4/8; mother confirmed 8/8"],["Speech Analysis","g4 naming: median 2.1s (12 voice trials)"],
      ["Game Master","g5 letters: 3/8, confusions ب↔ت"],["Game Master","g6 syllables: 4/8"]];
    window.Tiflan.loadDemo(p); window.Tiflan._log = L.map((x, i) => ({ t: t0 + i * 45000, agent: x[0], msg: x[1] }));
    showBar(); window.openResults && window.openResults();
  }
  function showBar() {
    let b = $("#demoBar"); if (!b) { b = document.createElement("div"); b.id = "demoBar"; document.body.appendChild(b); }
    b.innerHTML = `<span>${T("demo")}</span><button type="button" id="demoExit">${T("exit")}</button>`; $("#demoExit").onclick = () => (location.href = location.pathname);
  }

  /* ---------- agents view ---------- */
  function agents(p) {
    const g = (p && p.games) || {}, R = p && p.results, A = (p && p.intake && p.intake.answers) || {}, age = p ? p.child.age : "–", n = p ? window.Tiflan.plan() : 0, played = Object.keys(g);
    const m = (id) => (g[id] && g[id].metrics) || null, L = [];
    return [
      { i:"🧭", n:X("المنسّق","Orchestrator"), r:X("يخطط الجلسة ويوجّه المهام","Plans the session, routes tasks"), ok:!!p, l:p ? [X(`خطّط ${n} ألعاب لعمر ${age} سنوات`,`Planned ${n} games for age ${age}`), X("الأعمار 4-5: 4 ألعاب · 6-8: 6 ألعاب","Ages 4-5: 4 games · 6-8: 6 games")] : [] },
      { i:"💬", n:X("وكيل الاستقبال","Intake Agent"), r:X("يحاور الأم بلهجتها","Talks with the mother in her dialect"), ok:!!(p && p.intake), l:p && p.intake ? [X(`${Object.keys(A).length} إجابات · ${p.intake.flags} نقاط متابعة`,`${Object.keys(A).length} answers · ${p.intake.flags} follow-up points`), cfgAI() ? X("بمساعدة الذكاء الاصطناعي (اختياري)","AI-assisted (optional)") : X("بقواعد على الجهاز، بلا ذكاء سحابي","Rule-based on the device, no cloud AI")] : [] },
      { i:"🎮", n:X("وكيل الألعاب","Game Master Agent"), r:X("يشغّل الألعاب ويضبط الصعوبة حسب العمر","Runs games, adapts difficulty by age"), ok:played.length > 0, l:played.length ? [X(`لُعبت ${played.length} ألعاب: ${played.join("، ")}`,`${played.length} games played: ${played.join(", ")}`)] : [] },
      { i:"🎙️", n:X("وكيل تحليل الكلام","Speech Analysis Agent"), r:X("يقيس التكرار وسرعة التسمية","Measures repetition and naming speed"), ok:!!(m("g3") || m("g4")), l:[ m("g3") && X(`تكرار الكلمات: ${m("g3").correct}/${m("g3").n} (بتأكيد الأم)`,`Word echo: ${m("g3").correct}/${m("g3").n} (mother-confirmed)`), m("g4") && X(`زمن التسمية المعتاد ${(m("g4").medianRT / 1000).toFixed(1)} ث، يُحلَّل على الجهاز`,`Typical naming time ${(m("g4").medianRT / 1000).toFixed(1)}s, analysed on the device`) ].filter(Boolean) },
      { i:"✍️", n:X("وكيل الحروف واللمس","Letter & Touch Agent"), r:X("يقارن الحروف ويفحص التتبع","Letter matching and tracing check"), ok:!!(m("g5") || m("g6")), l:[ m("g5") && X(`دقة/تغطية التتبع ${Math.round(m("g5").tracePrecision * 100)}%/${Math.round(m("g5").traceRecall * 100)}% (مقارنة أشكال بسيطة، ليست ذكاءً اصطناعياً)`,`Tracing precision/coverage ${Math.round(m("g5").tracePrecision * 100)}%/${Math.round(m("g5").traceRecall * 100)}% (simple shape overlap, not AI)`), m("g6") && X(`عدّ المقاطع الصحيح ${m("g6").correct}/${m("g6").n}`,`Syllable counts right: ${m("g6").correct}/${m("g6").n}`) ].filter(Boolean) },
      { i:"📊", n:X("وكيل التقييم","Risk Scoring Agent"), r:X("قواعد شفافة ومعدّلة حسب العمر","Transparent, age-adjusted rules"), ok:!!R, l:R ? [X(`${R.trace.length} قاعدة طُبّقت · نقاط ${R.points}`,`${R.trace.length} rules applied · ${R.points} points`), X(`النتيجة: ${window.Tiflan.OV[R.overall !== null ? R.overall : 0].ar}`,`Outcome: ${R.overall !== null ? window.Tiflan.OV[R.overall].en : "not enough data"}`)] : [] },
      { i:"🛡️", n:X("وكيل الحماية","Guardian Agent"), r:X("الموافقة والخصوصية وسلامة الصياغة","Consent, privacy, safe wording"), ok:!!(p && p.consent), l:p ? [X("موافقة مسجّلة، بلا أسماء ولا صور ولا تسجيلات","Consent recorded; no names, photos or recordings"), X("لا تشخيص أبداً، فقط «مؤشر مبكر»","Never says “diagnosis”, only “early indicator”"), X(`حذف تلقائي بعد 30 يوماً (${new Date(p.createdAt + 30 * 864e5).toLocaleDateString()})`,`Auto-delete after 30 days (${new Date(p.createdAt + 30 * 864e5).toLocaleDateString()})`)] : [] },
      { i:"🧩", n:X("وكيل الدعم","Support Agent"), r:X("التمارين والمراكز والتقرير","Exercises, centers, report"), ok:!!(p && p.plan), l:p && p.plan ? [X("خطة 5 أيام جاهزة","5-day plan generated"), X("قائمة المراكز وتقرير الطبيب جاهزان","Center finder and doctor report ready")] : [] }
    ];
  }
  function renderAgents() {
    const p = prof(), l = LG(), t = (o) => o[l], A = agents(p);
    $("#agBody").innerHTML = `<h2>${T("ag_t")}</h2><p class="sub">${T("ag_s")}</p>
      <h3>${T("flow")}</h3><div class="pipe">${["👩‍👧", "🧭", "💬 🎮 🎙️ ✍️", "📊", "🛡️", "🧩"].map((x) => `<span>${x}</span>`).join("<em>→</em>")}</div>
      <div class="skgrid">${A.map((a) => `<div class="sk ${a.ok ? "" : "off"}"><div class="skh"><b>${a.i} ${t(a.n)}</b><span class="lv" style="background:${a.ok ? "#4FD1A5" : "rgba(255,255,255,.2)"}">${a.ok ? T("done") : T("wait")}</span></div>
        <small class="sub">${t(a.r)}</small><ul>${a.l.map((x) => `<li>${t(x)}</li>`).join("")}</ul></div>`).join("")}</div>
      <h3>${T("log")}</h3>${(window.Tiflan._log || []).length ? `<ul class="logbox">${window.Tiflan._log.slice(-40).map((e) => `<li><b>${hm(e.t)}</b> ${e.agent}: ${String(e.msg).slice(0, 150)}</li>`).join("")}</ul>` : `<p class="sub">${T("nolog")}</p>`}`;
  }

  /* ---------- privacy centre ---------- */
  function renderPriv() {
    const p = prof(), l = LG(), t = (o) => o[l];
    const stored = p ? [ X(`رمز مجهول: ${p.sid.slice(0, 8)}`,`Anonymous ID: ${p.sid.slice(0, 8)}`), X(`العمر: ${p.child.age}، اللهجة: ${p.child.dialect}`,`Age: ${p.child.age}, dialect: ${p.child.dialect}`), X(`موافقة بتاريخ ${new Date((p.consent && p.consent.ts) || p.createdAt).toLocaleDateString()}`,`Consent given on ${new Date((p.consent && p.consent.ts) || p.createdAt).toLocaleDateString()}`),
      X(`إجابات الأم: ${p.intake ? Object.keys(p.intake.answers).length : 0}`,`Mother's answers: ${p.intake ? Object.keys(p.intake.answers).length : 0}`), X(`ألعاب محفوظة: ${Object.keys(p.games || {}).length}`,`Games saved: ${Object.keys(p.games || {}).length}`),
      X(`الحجم: ${(JSON.stringify(p).length / 1024).toFixed(1)} كيلوبايت`,`Size: ${(JSON.stringify(p).length / 1024).toFixed(1)} KB`), X(`يُحذف تلقائياً في ${new Date(p.createdAt + 30 * 864e5).toLocaleDateString()}`,`Auto-deletes on ${new Date(p.createdAt + 30 * 864e5).toLocaleDateString()}`) ] : [];
    const never = [X("الاسم أو تاريخ الميلاد","Name or date of birth"), X("الصور أو الفيديو","Photos or video"), X("تسجيلات الصوت","Audio recordings"), X("موقعك الجغرافي","Your location")];
    const cloud = [ [X("التعرف على الكلام (الميكروفون في المحادثة واللعبة 3)","Speech recognition (microphone in the chat and Game 3)"), X("قد يعالجه المتصفح عبر خدمة سحابية. لا نحفظ التسجيل.","The browser may process it via a cloud service. We keep no recording."), null],
      [X("ردود الذكاء الاصطناعي","AI replies"), X("يُرسل نص الإجابة فقط، بلا اسم أو رمز.","Only the answer text is sent, no name or ID."), cfgAI()],
      [X("خريطة المراكز","Center map"), X("خرائط OpenStreetMap ترى المنطقة المعروضة وعنوان IP في تبويب المراكز فقط.","OpenStreetMap sees the visible area and your IP, on the Centers tab only."), null],
      [X("الخطوط والمكتبات","Fonts and libraries"), X("تُحمَّل من خوادم Google وcdnjs ثم تُخزَّن للعمل دون إنترنت.","Loaded from Google and cdnjs servers, then cached for offline use."), null],
      [X("قياس سرعة التسمية (اللعبة 4)","Naming-speed timing (Game 4)"), X("يُحلَّل على جهازك ولا يغادره.","Analysed on your device and never leaves it."), null] ];
    $("#prBody").innerHTML = `<h2>${T("pr_t")}</h2><p class="sub">${T("pr_s")}</p>
      <h3>${T("st")}</h3>${p ? `<ul class="promises sum">${stored.map((x) => `<li>${t(x)}</li>`).join("")}</ul>` : `<p class="sub">${T("none")}</p>`}
      <h3>${T("nost")}</h3><ul class="promises">${never.map((x) => `<li>${t(x)}</li>`).join("")}</ul>
      <h3>${T("cloud")}</h3><ul class="promises sum">${cloud.map((c) => `<li><b>${t(c[0])}</b>${c[2] === null ? "" : ` · ${c[2] ? T("on") : T("off")}`}<br>${t(c[1])}</li>`).join("")}</ul>
      <p class="note2">${T("legal")}</p>
      <div class="mrow"><button class="pill" id="prDl" type="button"><span>${T("dl")}</span></button><button class="pill alt" id="prWipe" type="button"><span>${T("wipe")}</span></button></div>`;
    $("#prDl").onclick = () => { if (!prof()) return; const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(prof(), null, 2)], { type: "application/json" })); a.download = "tiflan-data.json"; a.click(); };
    $("#prWipe").onclick = () => { window.Tiflan.wipe(); window.Tiflan._log = []; renderPriv(); window.tiflanToast("wiped"); };
  }
  Object.assign(I18N.ar, { wiped:S.ar.wiped }); Object.assign(I18N.en, { wiped:S.en.wiped });

  const open = (id, fn) => { $(id).hidden = false; document.body.style.overflow = "hidden"; fn(); };
  const closeAll = () => { ["#agentsSheet", "#privSheet"].forEach((s) => ($(s).hidden = true)); document.body.style.overflow = ""; };
  document.querySelectorAll("[data-open]").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); const k = b.dataset.open;
    if (k === "demo") startDemo(); else if (k === "agents") open("#agentsSheet", renderAgents); else open("#privSheet", renderPriv); }));
  $("#agClose").onclick = $("#prClose").onclick = closeAll;
  addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });
  document.addEventListener("tiflan:lang", () => { if (!$("#agentsSheet").hidden) renderAgents(); if (!$("#privSheet").hidden) renderPriv(); if ($("#demoBar")) showBar(); });
  if (/[?&]demo=1/.test(location.search)) setTimeout(startDemo, 300);
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register("sw.js").catch(() => {});
})();
