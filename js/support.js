// Step 9: exercise plan + progress, DHA center finder (Leaflet map), printable PDF report. All on-device.
(() => {
  const $ = (s) => document.querySelector(s), html = document.documentElement, LG = () => html.lang;
  const S = {
    ar: { plan:"خطة الأسبوع", centers:"المراكز", report:"التقرير", day:"اليوم", read:"قراءة مشتركة", min:"د", prog:"التقدّم", focus:"نركّز على", maint:"النتائج جيدة. خطة خفيفة للحفاظ على المهارات.",
      repeat:"كرّري هذه الخطة 4 أسابيع، ثم العبي طفلان من جديد لتري التغيير.", great:"أحسنتِ! أنجزتم الأسبوع كاملاً. 🌟", free:"كل التمارين مجانية، بلا أدوات خاصة.",
      area:"المنطقة", all:"كل المناطق", near:"📍 الأقرب إليّ", sugg:"المقترح لنتائجك", none:"لا توجد مراكز مطابقة.", call:"اتصال", dist:"كم",
      verify:"تأكدي دائماً أن المنشأة والمختص مرخّصان من هيئة الصحة بدبي (سجل شريان) قبل الحجز.", ph:"⚠️ هذه القائمة تحتوي أمثلة تجريبية فقط. استبدلي data/centers.js بقائمة هيئة الصحة بدبي الرسمية.",
      checked:"آخر تحقق", svc:{ slp:"علاج النطق واللغة", learning:"تقييم صعوبات التعلم", dev:"طب نمو الأطفال / علم النفس", aud:"السمع والبصر" },
      rep_t:"تقرير للطبيب", rep_d:"ملخص من صفحة أو صفحتين يمكنك عرضه على المختص: النتائج والأدلة وإجاباتك. يُنشأ على جهازك ولا يُرسل لأي مكان.",
      rep_ar:"📄 تقرير بالعربية", rep_en:"📄 Report in English", rep_how:"في نافذة الطباعة اختاري «حفظ كملف PDF».", noloc:"تعذّر تحديد موقعك." },
    en: { plan:"Weekly plan", centers:"Centers", report:"Report", day:"Day", read:"Shared reading", min:"min", prog:"Progress", focus:"Focus areas", maint:"Results look good. A light plan to keep skills strong.",
      repeat:"Repeat this plan for 4 weeks, then play Tiflan again to see the change.", great:"Well done! You finished the whole week. 🌟", free:"All exercises are free and need no special equipment.",
      area:"Area", all:"All areas", near:"📍 Nearest to me", sugg:"Suggested for your results", none:"No matching centers.", call:"Call", dist:"km",
      verify:"Always confirm the facility and the specialist are licensed by the Dubai Health Authority (Sheryan registry) before booking.", ph:"⚠️ This list holds sample entries only. Replace data/centers.js with the official Dubai Health Authority list.",
      checked:"Last checked", svc:{ slp:"Speech-language therapy", learning:"Learning assessment", dev:"Developmental pediatrics / psychology", aud:"Hearing & vision" },
      rep_t:"Report for the doctor", rep_d:"A one or two page summary to show a specialist: results, evidence and your answers. It is created on your device and sent nowhere.",
      rep_ar:"📄 Report in Arabic", rep_en:"📄 Report in English", rep_how:"In the print window choose “Save as PDF”.", noloc:"Could not get your location." }
  };
  const T = (k) => S[LG()][k];
  const X = (ar, en) => ({ ar, en });
  const EX = {
    rhyme: [{ t:X("لعبة القافية","Rhyme time"), d:X("قولي كلمة مثل «قطة» وخلي طفلج يقول كلمة تشبهها بالصوت، حتى لو كانت غريبة. تبادلوا الأدوار.","Say a word like “cat” and let your child answer with a word that sounds like it, even a silly one. Take turns."), m:5 },
      { t:X("صيد الأصوات","Sound hunt"), d:X("العبوا «أنا أشوف شي يبدأ بصوت ب». دوّروا في البيت على أشياء تبدأ بنفس الصوت.","Play “I spy something that starts with /b/”. Look around the house for things with the same first sound."), m:5 }],
    echo: [{ t:X("رددي معي","Echo me"), d:X("قولي كلمات غريبة قصيرة ثم أطول وخلي طفلج يعيدها. زيدي مقطعاً كل ما نجح.","Say short silly words, then longer ones, and let your child repeat them. Add one syllable each time they succeed."), m:5 },
      { t:X("أعد القصة","Retell the story"), d:X("احكي قصة من 3 جمل، واطلبي من طفلج يعيدها بكلماته. شجّعيه ولا تصحّحي كل شي.","Tell a 3-sentence story and ask your child to retell it in their own words. Encourage, and don't correct everything."), m:7 }],
    naming: [{ t:X("بطاقات سريعة","Quick cards"), d:X("اعرضي 10 صور أو ألوان وخلي طفلج يسمّيها بسرعة. جرّبوا تسبقون وقت أمس، بدون ضغط.","Show 10 pictures or colours and let your child name them quickly. Try to beat yesterday's time, with no pressure."), m:5 },
      { t:X("سمّي 5 أشياء","Name five things"), d:X("اختاري فئة (فواكه، حيوانات، أشياء حمراء) وخلي طفلج يسمّي 5 أشياء بسرعة.","Pick a category (fruit, animals, red things) and let your child name five things quickly."), m:5 }],
    attention: [{ t:X("الصقر يتجمّد","Falcon freeze"), d:X("شغّلي أغنية، وإذا وقفت يتجمّد طفلج مثل الصقر. بعدين زيدي قاعدة: اتجمّد بس إذا سمعت كلمة معينة.","Play a song; when it stops your child freezes like a falcon. Later add a rule: freeze only on a special word."), m:7 },
      { t:X("ابنِ وقلّد","Build and copy"), d:X("ابني شكل بسيط من المكعبات وخلي طفلج يقلّده. زيدي القطع شوي شوي.","Build a simple shape with blocks and let your child copy it. Add pieces slowly."), m:7 }],
    letters: [{ t:X("الكتابة بالرمل","Sand writing"), d:X("اكتبي حرف بإصبعج على صينية فيها ملح أو رمل وخلي طفلج يقلّد، ويقول اسم الحرف وصوته.","Write a letter with your finger in a tray of salt or sand and let your child copy it, saying its name and sound."), m:7 },
      { t:X("محقق النقاط","Dot detective"), d:X("اكتبي ب ت ث على ورقة، وخلي طفلج يعدّ النقاط ويقول وين مكانها: تحت، فوق، فوقين.","Write ب ت ث on paper and let your child count the dots and say where they are: below, one above, two above."), m:5 }],
    rhythm: [{ t:X("صفّقوا للأسماء","Clap the names"), d:X("صفّقوا لمقاطع أسماء العائلة والأكل. بعدين امشوا خطوة لكل مقطع.","Clap the syllables of family names and foods. Then step once for each syllable."), m:5 },
      { t:X("طبلة المقاطع","Syllable drum"), d:X("اضربوا على الطاولة بعدد مقاطع الكلمة، وخلي طفلج يخمّن الكلمة من الإيقاع.","Drum the syllables of a word on the table and let your child guess the word from the rhythm."), m:5 }]
  };
  const READ = { t:X("قراءة مشتركة","Shared reading"), d:X("10 دقائق كل يوم: اقرأي قصة مصوّرة، أشيري للكلمات، واسألي طفلج أسئلة عنها.","10 minutes every day: read a picture book, point to the words, and ask your child questions about it."), m:10 };
  const SVC = { rhyme:["slp","learning"], echo:["slp"], naming:["slp","learning"], letters:["learning"], rhythm:["slp"], attention:["dev"] };
  const prof = () => window.Tiflan.profile(), SK = () => window.Tiflan.SK;
  let tab = "plan", map = null, markers = [], cf = { svc: new Set(), area: "", near: null };

  /* ---------- plan ---------- */
  function makePlan(R) {
    const pri = R.skills.filter((s) => s.level >= 1).sort((a, b) => b.level - a.level).slice(0, 3).map((s) => s.id);
    const base = pri.length ? pri : R.band === "young" ? ["rhyme", "naming", "echo"] : ["rhyme", "naming", "letters"];
    return { ts: R.ts, maint: !pri.length, focus: pri, done: {}, items: [0, 1, 2, 3, 4].map((d) => ({ skill: base[d % base.length], i: Math.floor(d / base.length) % 2 })) };
  }
  function renderPlan() {
    const p = prof(), l = LG(); if (!p.results) return ($("#spBody").innerHTML = "");
    if (!p.plan || p.plan.ts < p.results.ts) window.Tiflan.update((q) => { q.plan = makePlan(q.results); window.Tiflan.log("Support Agent", "5-day plan generated"); });
    const P = prof().plan, total = 10, done = Object.values(P.done).filter(Boolean).length;
    const row = (key, e, extra) => `<label class="task"><input type="checkbox" data-k="${key}" ${P.done[key] ? "checked" : ""}><span><b>${e.t[l]}</b> <small>${e.m} ${T("min")}${extra || ""}</small><br>${e.d[l]}</span></label>`;
    $("#spBody").innerHTML = `<p class="sub">${P.maint ? T("maint") : T("focus") + ": " + P.focus.map((id) => SK()[id][l]).join(" · ")}</p>
      <div class="pbar"><i style="width:${(done / total) * 100}%"></i></div><small class="sub">${T("prog")}: ${done}/${total}${done === total ? " · " + T("great") : ""}</small>
      ${P.items.map((it, d) => `<div class="day"><h4>${T("day")} ${d + 1}</h4>${row("d" + d + "r", READ)}${row("d" + d + "e", EX[it.skill][it.i], " · " + SK()[it.skill][l])}</div>`).join("")}
      <p class="sub">${T("free")} ${T("repeat")}</p>`;
    $("#spBody").querySelectorAll("input[data-k]").forEach((c) => (c.onchange = () => { window.Tiflan.update((q) => { q.plan.done[c.dataset.k] = c.checked; }); renderPlan(); }));
  }

  /* ---------- centers ---------- */
  const hav = (a, b, c, d) => { const r = Math.PI / 180, x = Math.sin(((c - a) * r) / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin(((d - b) * r) / 2) ** 2; return 12742 * Math.asin(Math.sqrt(x)); };
  function suggested() { const p = prof(), R = p && p.results, set = new Set(); if (!R || !R.overall) return set;
    R.skills.filter((s) => s.level >= 1).forEach((s) => (SVC[s.id] || []).forEach((v) => set.add(v)));
    if (R.notes.some((n) => /ear|أذن/.test(n.en + n.ar))) set.add("aud"); return set; }
  function renderCenters() {
    const D = window.TIFLAN_CENTERS || { items: [] }, l = LG(), ar = l === "ar";
    if (!cf.init) { cf.init = true; suggested().forEach((v) => cf.svc.add(v)); }
    const areas = [...new Set(D.items.map((c) => (ar ? c.areaAr || c.area : c.area)))].filter(Boolean);
    $("#spBody").innerHTML = `${D.placeholder ? `<p class="note2">${T("ph")}</p>` : ""}<p class="note2 soft">${T("verify")}</p>
      <div class="chips">${Object.keys(T("svc")).map((k) => `<button type="button" class="chip" data-s="${k}" aria-pressed="${cf.svc.has(k)}">${T("svc")[k]}</button>`).join("")}</div>
      <div class="frow"><select id="cfArea"><option value="">${T("area")}: ${T("all")}</option>${areas.map((a) => `<option ${cf.area === a ? "selected" : ""}>${a}</option>`).join("")}</select>
      <button type="button" class="chip" id="cfNear" aria-pressed="${!!cf.near}">${T("near")}</button></div>
      <div id="map"></div><div id="clist"></div><small class="priv">${T("sugg")}: ${[...suggested()].map((k) => T("svc")[k]).join(", ") || "–"} · © OpenStreetMap</small>`;
    $("#spBody").querySelectorAll("[data-s]").forEach((b) => (b.onclick = () => { const k = b.dataset.s; cf.svc.has(k) ? cf.svc.delete(k) : cf.svc.add(k); b.setAttribute("aria-pressed", cf.svc.has(k)); drawCenters(); }));
    $("#cfArea").onchange = (e) => { cf.area = e.target.value; drawCenters(); };
    $("#cfNear").onclick = (e) => { if (cf.near) { cf.near = null; e.currentTarget.setAttribute("aria-pressed", false); return drawCenters(); }
      navigator.geolocation ? navigator.geolocation.getCurrentPosition((pos) => { cf.near = [pos.coords.latitude, pos.coords.longitude]; e.currentTarget.setAttribute("aria-pressed", true); drawCenters(); }, () => alert(T("noloc"))) : alert(T("noloc")); };
    if (map) { map.remove(); map = null; }
    if (window.L && window.L.map) { map = window.L.map("map").setView([25.2048, 55.2708], 10); window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "© OpenStreetMap" }).addTo(map); }
    else $("#map").innerHTML = `<p class="sub" style="padding:14px">Map unavailable offline. The list below still works.</p>`;
    drawCenters();
  }
  function drawCenters() {
    const D = window.TIFLAN_CENTERS || { items: [] }, l = LG(), ar = l === "ar";
    let list = D.items.filter((c) => (!cf.svc.size || c.services.some((s) => cf.svc.has(s))) && (!cf.area || (ar ? c.areaAr || c.area : c.area) === cf.area));
    if (cf.near) list = list.map((c) => ({ ...c, km: hav(cf.near[0], cf.near[1], c.lat, c.lng) })).sort((a, b) => a.km - b.km);
    markers.forEach((m) => m.remove()); markers = [];
    if (map) { list.forEach((c) => markers.push(window.L.marker([c.lat, c.lng]).addTo(map).bindPopup(ar ? c.nameAr || c.name : c.name)));
      if (list.length) map.fitBounds(window.L.latLngBounds(list.map((c) => [c.lat, c.lng])).pad(0.3), { maxZoom: 13 }); setTimeout(() => map.invalidateSize(), 50); }
    $("#clist").innerHTML = list.length ? list.map((c, i) => `<div class="ctr" data-i="${i}"><b>${ar ? c.nameAr || c.name : c.name}</b>${c.example ? " <span class='lv' style='background:#FFC94D'>EXAMPLE</span>" : ""}
      <div class="sub">${ar ? c.areaAr || c.area : c.area}${c.km != null ? " · " + c.km.toFixed(1) + " " + T("dist") : ""}${c.address ? " · " + c.address : ""}</div>
      <div class="tags">${c.services.map((s) => `<span>${T("svc")[s]}</span>`).join("")}</div>
      <div class="sub">${c.verifiedOn ? T("checked") + ": " + c.verifiedOn : ""} ${c.phone ? `<a class="tel" href="tel:${c.phone.replace(/\s/g, "")}">📞 ${T("call")} ${c.phone}</a>` : ""}</div></div>`).join("") : `<p class="sub">${T("none")}</p>`;
    $("#clist").querySelectorAll(".ctr").forEach((el) => (el.onclick = () => { const c = list[+el.dataset.i]; if (map) { map.setView([c.lat, c.lng], 14); markers[+el.dataset.i].openPopup(); } }));
  }

  /* ---------- report (browser print to PDF) ---------- */
  const DL = { gulf:X("خليجي / إماراتي","Gulf / Emirati"), egy:X("مصري","Egyptian"), lev:X("شامي","Levantine"), mag:X("مغاربي","Maghrebi"), msa:X("فصحى","Modern Standard"), en:X("إنجليزي","English") };
  const HL = { ar:X("العربية","Arabic"), en:X("الإنجليزية","English"), both:X("الاثنتان","Both") };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  function report(lang) {
    const p = prof(), R = p.results, ar = lang === "ar", t = (o) => o[lang], { SK: K, SL, OV, MSG } = window.Tiflan, Q = window.TiflanMatch.Q, A = (p.intake && p.intake.answers) || {};
    const H = ar ? { t:"ملخص فحص التعلّم المبكر", ch:"الطفل", age:"العمر", hl:"لغة البيت", dia:"لهجة الأم", id:"رمز الجلسة المجهول", ov:"المؤشر المبكر", sk:"المهارات", lv:"المستوى", ev:"الدليل", qa:"إجابات الأم", q:"السؤال", a:"الإجابة",
      raw:"بيانات اللعب (مختصرة)", disc:"هذا التقرير ناتج أداة فحص أولي وليس تشخيصاً طبياً. القيم الحدّية تجريبية وتحتاج مراجعة مختص. أُنشئ على جهاز الأم ولا يحوي اسماً أو صورة أو تسجيلاً صوتياً.", yrs:"سنوات", notes:"ملاحظات" }
      : { t:"Early Learning Screening Summary", ch:"Child", age:"Age", hl:"Home language", dia:"Mother's dialect", id:"Anonymous session ID", ov:"Early indicator", sk:"Skills", lv:"Level", ev:"Evidence", qa:"Mother's answers", q:"Question", a:"Answer",
      raw:"Play data (condensed)", disc:"This report comes from a screening aid, not a medical diagnosis. Thresholds are prototype values needing specialist review. It was created on the mother's device and contains no name, photo or audio recording.", yrs:"years", notes:"Notes" };
    const sk = R.skills.map((s) => `<tr><td>${t(K[s.id])}</td><td>${s.level === null ? "–" : t(SL[s.level])}</td><td>${s.ev.map((e) => esc(t(e))).join("; ")}</td></tr>`).join("");
    const qa = Q.map((q) => { const a = A[q.id]; if (!a) return ""; const o = q.opts.find((x) => x.v === a.v); return `<tr><td>${q[lang]}</td><td>${esc(a.v === "note" ? a.note : o ? o[lang] : a.label)}</td></tr>`; }).join("");
    const raw = Object.entries(p.games || {}).map(([k, g]) => `<li><b>${k}</b>: ${esc(JSON.stringify(g.metrics))}</li>`).join("");
    return `<div dir="${ar ? "rtl" : "ltr"}" lang="${lang}"><h1>Tiflan | طفلان</h1><h2>${H.t}</h2><p>${new Date().toLocaleDateString(ar ? "ar-AE" : "en-GB")}</p>
      <h3>${H.ch}</h3><p>${H.age}: ${p.child.age} ${H.yrs} · ${H.hl}: ${t(HL[p.child.homeLang] || HL.ar)} · ${H.dia}: ${t(DL[p.child.dialect] || DL.gulf)} · ${H.id}: ${p.sid.slice(0, 8)}</p>
      <h3>${H.ov}: ${R.overall === null ? "–" : t(OV[R.overall])}</h3>${R.overall === null ? "" : `<p>${t(MSG[R.overall])}</p>`}
      <h3>${H.sk}</h3><table><tr><th>${H.sk}</th><th>${H.lv}</th><th>${H.ev}</th></tr>${sk}</table>
      ${R.notes.length ? `<h3>${H.notes}</h3><ul>${R.notes.map((n) => `<li>${t(n)}</li>`).join("")}</ul>` : ""}
      <h3>${H.qa}</h3><table><tr><th>${H.q}</th><th>${H.a}</th></tr>${qa}</table>
      <h3>${H.raw}</h3><ul class="raw">${raw}</ul><p class="disc">${H.disc}</p></div>`;
  }
  function printReport(lang) {
    window.Tiflan.log("Support Agent", "doctor report created (" + lang + ")"); $("#printArea").innerHTML = report(lang); document.body.classList.add("printing");
    const off = () => { document.body.classList.remove("printing"); removeEventListener("afterprint", off); }; addEventListener("afterprint", off);
    setTimeout(() => window.print(), 100);
  }
  function renderReport() {
    $("#spBody").innerHTML = `<h2>${T("rep_t")}</h2><p class="sub">${T("rep_d")}</p><div class="mrow"><button class="pill" id="rpAr" type="button"><span>${T("rep_ar")}</span></button>
      <button class="pill" id="rpEn" type="button"><span>${T("rep_en")}</span></button></div><p class="sub">${T("rep_how")}</p>`;
    $("#rpAr").onclick = () => printReport("ar"); $("#rpEn").onclick = () => printReport("en");
  }

  function render() {
    $("#spTabs").innerHTML = ["plan", "centers", "report"].map((k) => `<button type="button" class="tab" data-t="${k}" aria-selected="${tab === k}">${T(k)}</button>`).join("");
    $("#spTabs").querySelectorAll(".tab").forEach((b) => (b.onclick = () => { tab = b.dataset.t; render(); }));
    if (tab === "plan") renderPlan(); else if (tab === "centers") renderCenters(); else renderReport();
  }
  const close = () => { $("#support").hidden = true; document.body.style.overflow = ""; if (map) { map.remove(); map = null; } };
  window.openSupport = (t) => { if (!prof() || !prof().results) return; tab = t || "plan"; $("#support").hidden = false; document.body.style.overflow = "hidden"; render(); };
  $("#spClose").onclick = close;
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#support").hidden) close(); });
  document.addEventListener("tiflan:lang", () => { if (!$("#support").hidden) render(); });
  window.TiflanSupport = { makePlan, hav, report };
})();
