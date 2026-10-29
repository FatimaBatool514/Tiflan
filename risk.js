// Step 8: Risk Scoring Agent (transparent, age-adjusted rules) + Guardian-approved results dashboard.
// ALL THRESHOLDS ARE PROTOTYPE VALUES and need review by a speech-language pathologist before real use.
(() => {
  const $ = (s) => document.querySelector(s), html = document.documentElement, L = () => html.lang;
  const COL = ["#4FD1A5", "#5BC0EB", "#FF8A6B"], pc = (x) => Math.round(x * 100);
  const TH = {
    rhyme: { young: { low: 0.40, watch: 0.15 }, older: { low: 0.50, watch: 0.25 } },   // chance-adjusted accuracy, higher is better
    echo: { young: { low: 0.67, watch: 0.40 }, older: { low: 0.75, watch: 0.50 } },    // accuracy
    naming: { young: { low: 2.0, watch: 3.0 }, older: { low: 1.6, watch: 2.4 } },     // median seconds per item, lower is better
    letters: { older: { low: 0.75, watch: 0.50 } }, firstsound: { older: { low: 0.50, watch: 0.25 } },
    attention: { acc: { low: 0.80, watch: 0.50 }, omissionsWatch: 2, omissionsFollow: 3, earlyWatchYoung: 6, earlyWatchOlder: 4 }
  };
  const hi = (v, t) => (v >= t.low ? 0 : v >= t.watch ? 1 : 2), lo = (v, t) => (v <= t.low ? 0 : v <= t.watch ? 1 : 2);
  const E = (ar, en) => ({ ar, en });
  const SK = { rhyme:E("الوعي بالأصوات","Sound awareness"), echo:E("الذاكرة الصوتية والنطق","Sound memory & speech"), naming:E("سرعة التسمية","Naming speed"),
    attention:E("الانتباه","Attention"), letters:E("تمييز الحروف","Letter recognition"), firstsound:E("الصوت الأول","First sound") };
  const SL = [E("جيد","Good"), E("نراقب","Watch"), E("يحتاج دعم","Needs support")];
  const OV = [E("مطمئن","Reassuring"), E("نراقب معاً","Keep watching"), E("يُنصح بمتابعة","Follow-up suggested")], ICON = ["🌟", "👀", "🧭"];
  const MSG = [
    E("الحمدلله، اللعب كان مطمئن. كمّلي القراءة واللعب مع طفلج كل يوم، وكرّري الفحص بعد 6 شهور.","Good news: the play session was reassuring. Keep reading and playing together every day, and repeat the check in 6 months."),
    E("في كم إشارة تستاهل نراقبها. جرّبي التمارين المجانية 4 أسابيع، وبعدها كرّري الفحص. هذا مو تشخيص.","There are a few signs worth watching. Try the free exercises for 4 weeks, then repeat the check. This is not a diagnosis."),
    E("في إشارات تقول إن مراجعة مختص ممكن تفيد طفلج. هذا مو تشخيص، بس مؤشر مبكر، وكل ما بدأتي بدري كان أحسن.","Some signs suggest that a specialist visit could help your child. This is not a diagnosis, only an early indicator, and starting early helps.")];
  Object.assign(I18N.ar, { in_res:"📊 عرض آخر نتائج", step9:"الخطة والمراكز وتقرير PDF تأتي في الخطوة 9." });
  Object.assign(I18N.en, { in_res:"📊 View last results", step9:"The exercise plan, centers and PDF report arrive in Step 9." });

  function score(p) {
    const age = p.child.age, band = age <= 5 ? "young" : "older", g = p.games || {}, ia = (p.intake && p.intake.answers) || {}, T = [], S = [];
    const tr = (rule, val, lv) => T.push({ rule, val, lv });
    const none = (id) => S.push({ id, level: null, ev: [] });
    // 1. Sound awareness (Rhyme Nest)
    if (g.g2) { const m = g.g2.metrics, acc = m.correct / m.n, ch = band === "young" ? 0.5 : 1 / 3, adj = Math.max(-1, (acc - ch) / (1 - ch)), lv = hi(adj, TH.rhyme[band]);
      S.push({ id:"rhyme", level:lv, ev:[E(`أجاب ${m.correct} من ${m.n} بشكل صحيح`,`${m.correct} of ${m.n} correct`), E(`بعد استبعاد التخمين: ${pc(Math.max(0, adj))}%`,`After removing lucky guesses: ${pc(Math.max(0, adj))}%`)] });
      tr("rhyme", `adjusted accuracy ${adj.toFixed(2)}`, lv); } else none("rhyme");
    // 2. Sound memory & speech (Silly Word Echo)
    if (g.g3 && g.g3.metrics.scored !== 0) { const m = g.g3.metrics, acc = m.correct / (m.scored != null ? m.scored : m.n), lv = hi(acc, TH.echo[band]), ls = Object.keys(m.byLen).map(Number).sort(), a = m.byLen[ls[0]], z = m.byLen[ls[ls.length - 1]];
      const ev = [E(`كرّر ${m.correct} من ${m.scored != null ? m.scored : m.n} كلمات غريبة بشكل صحيح`,`Repeated ${m.correct} of ${m.scored != null ? m.scored : m.n} made-up words correctly`)];
      if (ls.length > 1) ev.push(E(`كلمات من ${ls[0]} مقاطع: ${a.c}/${a.n} · من ${ls[ls.length - 1]} مقاطع: ${z.c}/${z.n}`,`${ls[0]}-syllable words: ${a.c}/${a.n} · ${ls[ls.length - 1]}-syllable words: ${z.c}/${z.n}`));
      if (ia.clarity && ia.clarity.f > 0) ev.push(E("ذكرتِ أن وضوح كلامه أحياناً صعب","You mentioned his or her speech is sometimes hard to understand"));
      S.push({ id:"echo", level:lv, ev }); tr("echo", `accuracy ${acc.toFixed(2)}`, lv); } else none("echo");
    // 3. Naming speed (Quick Naming Race)
    if (g.g4 && g.g4.metrics.medianRT != null) { const m = g.g4.metrics, sec = m.medianRT / 1000; let lv = lo(sec, TH.naming[band]); const ev = [E(`الزمن المعتاد لتسمية الصورة: ${sec.toFixed(1)} ثانية`,`Typical time to name a picture: ${sec.toFixed(1)} s`)];
      if (m.slow) ev.push(E(`${m.slow} صور احتاجت أكثر من 3 ثوانٍ`,`${m.slow} pictures took over 3 seconds`));
      if (m.errors >= 3) { lv = Math.max(lv, 1); ev.push(E(`أخطاء رصدها التطبيق: ${m.errors === 4 ? "4+" : m.errors}`,`Mistakes detected by the app: ${m.errors === 4 ? "4+" : m.errors}`)); }
      const low = (m.scored != null ? m.scored : m.voiceTrials || 0) < m.n / 2; if (low) ev.push(E("تعذّر فحص عدد من الإجابات بالتعرف على الكلام، فالدقة أقل","Many answers could not be checked by speech recognition, so accuracy is lower"));
      S.push({ id:"naming", level:lv, ev, lowConf:low }); tr("naming", `median ${sec.toFixed(2)} s`, lv); } else none("naming");
    // 4. Attention (Follow the Eyes + parent report)
    if (g.g1) { const m = g.g1.metrics, acc = m.correct / m.n, th = TH.attention; let lv = hi(acc, th.acc);
      if (m.omissions >= th.omissionsFollow) lv = 2; else if (m.omissions >= th.omissionsWatch) lv = Math.max(lv, 1);
      if (m.premature >= (band === "young" ? th.earlyWatchYoung : th.earlyWatchOlder)) lv = Math.max(lv, 1);
      const ev = [E(`${m.correct} من ${m.n} لمسات صحيحة`,`${m.correct} of ${m.n} touches correct`), E(`${m.omissions} بلا استجابة · ${m.premature} لمسات مبكرة`,`${m.omissions} no response · ${m.premature} early touches`)];
      if (ia.attention && ia.attention.f === 2 && lv === 0) { lv = 1; ev.push(E("ذكرتِ أنه يتشتت كثيراً","You reported frequent distraction")); }
      S.push({ id:"attention", level:lv, ev }); tr("attention", `acc ${acc.toFixed(2)}, omissions ${m.omissions}, early ${m.premature}`, lv); } else none("attention");
    // 5-6. Older children only
    if (band === "older") {
      if (g.g5) { const m = g.g5.metrics, acc = m.correct / m.n, lv = hi(acc, TH.letters.older), F = m.tracePrecision + m.traceRecall ? (2 * m.tracePrecision * m.traceRecall) / (m.tracePrecision + m.traceRecall) : 0;
        const cnt = {}; (m.confusions || []).forEach((x) => (cnt[x] = (cnt[x] || 0) + 1)); const top = Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 2).map((x) => x[0].replace(">", "↔"));
        const ev = [E(`${m.correct} من ${m.n} حروف متطابقة بشكل صحيح`,`${m.correct} of ${m.n} look-alike letters matched correctly`)];
        if (top.length) ev.push(E(`حروف اختلطت: ${top.join("، ")}`,`Letters mixed up: ${top.join(", ")}`));
        ev.push(E(`دقة التتبع التقريبية: ${pc(F)}%`,`Rough tracing accuracy: ${pc(F)}%`));
        S.push({ id:"letters", level:lv, ev }); tr("letters", `accuracy ${acc.toFixed(2)}`, lv); } else none("letters");
      if (g.g6) { const m = g.g6.metrics, acc = m.correct / m.n, adj = Math.max(-1, (acc - 1 / 3) / (2 / 3)), lv = hi(adj, TH.firstsound.older);
        S.push({ id:"firstsound", level:lv, ev:[E(`${m.correct} من ${m.n} أصوات أولى صحيحة`,`${m.correct} of ${m.n} first sounds matched correctly`), E(`بعد استبعاد التخمين: ${pc(Math.max(0, adj))}%`,`After removing lucky guesses: ${pc(Math.max(0, adj))}%`)] });
        tr("firstsound", `adjusted accuracy ${adj.toFixed(2)}`, lv); } else none("firstsound");
    }
    const done = S.filter((s) => s.level !== null), fam = ia.family && ia.family.v === "yes", ctx = (p.intake && p.intake.flags) || 0;
    const points = done.reduce((a, s) => a + s.level, 0) + (ctx >= 3 ? 1 : 0) + (fam ? 1 : 0);
    const overall = done.length < 2 ? null : points >= 4 ? 2 : points >= 2 ? 1 : 0;
    tr("overall", `points ${points} (skills + context ${ctx >= 3 ? 1 : 0} + family ${fam ? 1 : 0})`, overall);
    const notes = [];
    if (ia.senses && ia.senses.v === "yes") notes.push(E("ذكرتِ التهابات أذن أو حاجة لنظارة. الأفضل فحص السمع والبصر أولاً لأنهما يؤثران على النتائج.","You mentioned ear infections or glasses. Please check hearing and vision first, as they can affect these results."));
    if (done.length < S.length) notes.push(E("بعض الألعاب لم تُلعب بعد، لذلك النتيجة أقل اكتمالاً.","Some games were not played, so this result is less complete."));
    if (S.some((s) => s.lowConf)) notes.push(E("قياس السرعة اعتمد جزئياً على الضغط اليدوي.","Speed was partly measured from manual taps."));
    if ((g.g3 && g.g3.metrics.scored) || (g.g4 && g.g4.metrics.scored)) notes.push(E("نطق طفلك فُحص بالتعرف التلقائي على الكلام وقد يخطئ مع الأطفال، فاعتبري هذه النتائج إشارة تقريبية.","Your child's speech was checked by automatic speech recognition, which can mishear children. Treat those results as a rough signal."));
    return { ts: Date.now(), band, overall, points, skills: S, notes, trace: T, fam, ctx };
  }

  const ruleText = (id, band) => { const t = TH[id] && (TH[id][band] || TH[id].older); if (!t) return null;
    if (id === "naming") return E(`جيد ≤ ${t.low} ث · نراقب ≤ ${t.watch} ث (زمن وسيط)`,`Good ≤ ${t.low}s · Watch ≤ ${t.watch}s (median time)`);
    return E(`جيد ≥ ${pc(t.low)}% · نراقب ≥ ${pc(t.watch)}%`,`Good ≥ ${pc(t.low)}% · Watch ≥ ${pc(t.watch)}%`); };

  function spoken(R) {
    const l = L(), nm = (lv) => R.skills.filter((s) => s.level === lv).map((s) => SK[s.id][l]), sep = l === "ar" ? " و" : " and ", a = nm(2), b = nm(1);
    let t = MSG[R.overall][l];
    if (a.length) t += (l === "ar" ? " نحتاج ندعم: " : " Areas to support: ") + a.join(sep) + ".";
    if (b.length) t += (l === "ar" ? " ونراقب: " : " Areas to watch: ") + b.join(sep) + ".";
    return t;
  }
  function render() {
    const p = window.Tiflan.profile(); if (!p || !p.results) return; const R = p.results, l = L(), ar = l === "ar", t = (o) => o[l];
    const lab = ar ? { ov:"المؤشر المبكر", listen:"🔊 اسمعي الشرح", skills:"المهارات", ctx:"من إجاباتك", why:"كيف حُسبت النتيجة؟", rules:"القواعد المستخدمة (قيم تجريبية)", log:"سجل وكيل التقييم",
      go:"التمارين والمراكز", again:"إعادة اللعب", ns:"لم تُلعب", proto:"قيم أولية تجريبية مأخوذة من أفكار فحص منشورة، وتحتاج مراجعة مختص قبل أي استخدام حقيقي. هذه أداة فحص وليست تشخيصاً.",
      fam:"تاريخ عائلي لصعوبات القراءة أو التعلم", ctxn:"نقاط المتابعة من الأسئلة", insuff:"لا توجد بيانات كافية بعد. العبي ألعاب أكثر." }
      : { ov:"Early indicator", listen:"🔊 Listen to the explanation", skills:"Skills", ctx:"From your answers", why:"How was this calculated?", rules:"Rules used (prototype values)", log:"Scoring agent log",
      go:"Exercises & centers", again:"Play again", ns:"Not played", proto:"Prototype thresholds based on published screening ideas. They need specialist review before real use. This is a screening aid, not a diagnosis.",
      fam:"Family history of reading or learning difficulty", ctxn:"Follow-up points from the questions", insuff:"Not enough data yet. Please play more games." };
    $("#rsProto").textContent = lab.proto;
    const ov = R.overall, skillsHtml = R.skills.map((s) => {
      if (s.level === null) return `<div class="sk off"><div class="skh"><b>${t(SK[s.id])}</b><span class="lv" style="background:rgba(255,255,255,.15)">${lab.ns}</span></div></div>`;
      return `<div class="sk"><div class="skh"><b>${t(SK[s.id])}</b><span class="lv" style="background:${COL[s.level]}">${t(SL[s.level])}</span></div>
        <div class="meter"><i style="background:${COL[0]}"></i><i style="background:${COL[1]}"></i><i style="background:${COL[2]}"></i><b class="mk" style="inset-inline-start:${16.6 + s.level * 33.3}%"></b></div>
        <ul>${s.ev.map((e) => `<li>${t(e)}</li>`).join("")}</ul></div>`; }).join("");
    const ctxItems = []; if (R.fam) ctxItems.push(lab.fam); if (R.ctx) ctxItems.push(`${lab.ctxn}: ${R.ctx}`);
    const rules = R.skills.filter((s) => s.level !== null).map((s) => { const r = ruleText(s.id, R.band); return r ? `<li><b>${t(SK[s.id])}:</b> ${t(r)}</li>` : ""; }).join("");
    $("#rsBody").innerHTML = `
      <div class="ov" style="--c:${ov === null ? "#999" : COL[ov]}"><div class="ovi">${ov === null ? "…" : ICON[ov]}</div>
        <div><small>${lab.ov}</small><h2>${ov === null ? lab.insuff : t(OV[ov])}</h2>${ov === null ? "" : `<p>${t(MSG[ov])}</p><button class="pill" id="rsSay" type="button"><span>${lab.listen}</span></button>`}</div></div>
      ${R.notes.map((n) => `<p class="note2">⚠️ ${t(n)}</p>`).join("")}
      <h3>${lab.skills}</h3><div class="skgrid">${skillsHtml}</div>
      ${ctxItems.length ? `<h3>${lab.ctx}</h3><ul class="promises sum">${ctxItems.map((x) => `<li>${x}</li>`).join("")}</ul>` : ""}
      <details class="why"><summary>${lab.why}</summary><h4>${lab.rules}</h4><ul>${rules}</ul>
        <h4>${lab.log}</h4><ul class="mono">${R.trace.map((x) => `<li>${x.rule}: ${x.val} → ${x.lv === null ? "–" : x.lv}</li>`).join("")}</ul></details>
      <div class="foot"><button class="ghost" id="rsAgain" type="button">${lab.again}</button><button class="pill" id="rsGo" type="button"><span>${lab.go}</span><b>↗</b></button></div>`;
    const say = $("#rsSay"); if (say) say.onclick = () => window.TiflanSpeak && window.TiflanSpeak(spoken(R));
    $("#rsAgain").onclick = () => { close(); window.openGames && window.openGames(); };
    $("#rsGo").onclick = () => { close(); window.openSupport ? window.openSupport("plan") : window.tiflanToast("step9"); };
  }
  function close() { $("#results").hidden = true; document.body.style.overflow = ""; if (window.speechSynthesis) speechSynthesis.cancel(); }
  window.openResults = () => {
    const p = window.Tiflan.profile(); if (!p) return;
    const R = score(p); window.Tiflan.update((q) => { q.results = R; });
    (window.Tiflan._log = window.Tiflan._log || []).push({ t: Date.now(), agent: "Risk Scoring Agent", msg: "overall " + R.overall + " " + JSON.stringify(R.trace) });
    $("#results").hidden = false; document.body.style.overflow = "hidden"; render();
    if (R.overall !== null && window.TiflanSpeak) setTimeout(() => window.TiflanSpeak(spoken(R)), 500);
  };
  $("#rsClose").onclick = close;
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#results").hidden) close(); });
  document.addEventListener("tiflan:lang", () => { if (!$("#results").hidden) render(); });
  window.Tiflan.score = score; Object.assign(window.Tiflan, { SK, SL, OV, MSG });
})();
