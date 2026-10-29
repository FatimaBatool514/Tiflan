// Step 3: consent, child profile, local storage with auto-delete, one-tap delete.
(() => {
  const KEY = "tiflan-profile", DAYS = 30;
  const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
  const T = (k) => I18N[document.documentElement.lang][k];
  const sheet = $("#sheet"); let step = 0;
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2));
  const fresh = () => ({ sid: uid(), createdAt: Date.now(), consent: { play: false, mic: false, camera: false },
    child: { age: null, gender: null, dialect: "gulf", homeLang: null } });
  let demo = false;
  const store = {
    get() { try { const p = JSON.parse(localStorage.getItem(KEY)); if (p && Date.now() - p.createdAt < DAYS * 864e5) return p; localStorage.removeItem(KEY); } catch (e) {} return null; },
    set(p) { if (demo) return; try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {} },
    clear() { try { localStorage.removeItem(KEY); } catch (e) {} }
  };
  let saved = store.get(), draft = saved || fresh();
  window.Tiflan = { profile: () => saved, plan: () => (saved && saved.child.age <= 5 ? 4 : 6),
    update: (fn) => { if (saved) { fn(saved); store.set(saved); } },
    mascot: () => (saved && saved.child.gender === "boy" ? "boy" : "girl"),
    loadDemo: (p) => { demo = true; saved = p; draft = p; }, isDemo: () => demo,
    wipe: () => { store.clear(); saved = null; draft = fresh(); },
    log: (a, m) => { (window.Tiflan._log = window.Tiflan._log || []).push({ t: Date.now(), agent: a, msg: m }); } };

  const valid = () => step === 0 ? draft.consent.play && draft.consent.mic
    : step === 1 ? !!draft.child.age : step === 2 ? !!draft.child.homeLang && !!draft.child.gender : true;

  function summary() {
    const a = draft.child.age, n = a <= 5 ? 4 : 6, m = a <= 5 ? "4" : "6-7";
    const d = $(`[data-dialect="${draft.child.dialect}"]`).textContent;
    $("#sumBox").innerHTML = "";
    [T("s_age").replace("{n}", a), T("s_plan").replace("{n}", n).replace("{m}", m), T("s_dialect").replace("{d}", d),
      T("s_id").replace("{id}", draft.sid.slice(0, 8)), T("s_store")].forEach((t) => {
      const li = document.createElement("li"); li.textContent = t; $("#sumBox").appendChild(li);
    });
  }
  function render() {
    $$(".pane").forEach((p) => (p.hidden = +p.dataset.pane !== step));
    $$("#prog i").forEach((i, k) => i.classList.toggle("on", k <= step));
    $("#back").hidden = step === 0 || step === 3;
    const nx = $("#next"); nx.disabled = !valid();
    nx.querySelector("span").textContent = T(step === 2 ? "save" : step === 3 ? "go" : "next");
    $$("[data-age]").forEach((b) => b.setAttribute("aria-pressed", draft.child.age == b.dataset.age));
    $$("[data-gender]").forEach((b) => b.setAttribute("aria-pressed", draft.child.gender === b.dataset.gender));
    $$("[data-dialect]").forEach((b) => b.setAttribute("aria-pressed", draft.child.dialect === b.dataset.dialect));
    $$("[data-hl]").forEach((b) => b.setAttribute("aria-pressed", draft.child.homeLang === b.dataset.hl));
    $("#cPlay").checked = draft.consent.play; $("#cMic").checked = draft.consent.mic; $("#cCam").checked = draft.consent.camera;
    if (step === 3) summary();
  }
  const open = () => { saved = demo ? saved : store.get(); if (saved) draft = saved; step = saved ? 3 : 0; sheet.hidden = false; document.body.style.overflow = "hidden"; render(); $("#next").focus(); };
  const close = () => { sheet.hidden = true; document.body.style.overflow = ""; };
  window.openOnboarding = open;

  $("#cPlay").onchange = (e) => { draft.consent.play = e.target.checked; render(); };
  $("#cMic").onchange = (e) => { draft.consent.mic = e.target.checked; render(); };
  $("#cCam").onchange = (e) => { draft.consent.camera = e.target.checked; };
  $$("[data-age]").forEach((b) => (b.onclick = () => { draft.child.age = +b.dataset.age; render(); }));
  $$("[data-gender]").forEach((b) => (b.onclick = () => { draft.child.gender = b.dataset.gender; render(); }));
  $$("[data-dialect]").forEach((b) => (b.onclick = () => { draft.child.dialect = b.dataset.dialect; render(); }));
  $$("[data-hl]").forEach((b) => (b.onclick = () => { draft.child.homeLang = b.dataset.hl; render(); }));
  $("#back").onclick = () => { step = Math.max(0, step - 1); render(); };
  $("#next").onclick = () => {
    if (!valid()) return;
    if (step === 2) { draft.consent.ts = Date.now(); saved = draft; store.set(saved); window.Tiflan.log("Guardian Agent", "consent recorded; data kept on device only"); }
    if (step === 3) { close(); document.dispatchEvent(new CustomEvent("tiflan:profile", { detail: saved })); (window.openIntake ? window.openIntake() : window.tiflanToast("step4")); return; }
    step++; render();
  };
  $("#wipe").onclick = () => { store.clear(); saved = null; draft = fresh(); close(); window.tiflanToast("deleted"); };
  $("#shClose").onclick = close;
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !sheet.hidden) close(); });
  document.addEventListener("tiflan:lang", () => { if (!sheet.hidden) render(); });
})();
