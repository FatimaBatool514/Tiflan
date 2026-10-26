(() => {
  const $ = (s) => document.querySelector(s);
  const html = document.documentElement;
  let lang = "ar";
  try { lang = localStorage.getItem("tiflan-lang") || "ar"; } catch (e) {}
  let dirKey = "c", moodKey = "f";

  /* ---------- language ---------- */
  function setLang(l) {
    lang = l;
    html.lang = l; html.dir = l === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = I18N[l][el.dataset.i18n]; });
    $("#langBtn").textContent = I18N[l].langBtn;
    try { localStorage.setItem("tiflan-lang", l); } catch (e) {}
    renderReadings(true);
  }
  $("#langBtn").addEventListener("click", () => setLang(lang === "ar" ? "en" : "ar"));

  /* ---------- toast ---------- */
  const toast = $("#toast"); let tt;
  document.querySelectorAll("[data-start]").forEach((b) => b.addEventListener("click", () => {
    toast.textContent = I18N[lang].toast; toast.classList.add("show");
    clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 3200);
  }));

  /* ---------- falcon tracking ---------- */
  const svg = $("#falcon"), head = $("#head"), pupils = document.querySelectorAll(".pupil");
  const dialDot = $("#dialDot"), bars = [...document.querySelectorAll("#bars i")];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  let tx = 0, ty = 0, cx = 0, cy = 0;           // target / current gaze, range -1..1
  let lastMove = performance.now(), speed = 0, last = null, wander = false, wanderT = 0;

  function point(e) {
    const p = e.touches ? e.touches[0] : e;
    const r = svg.getBoundingClientRect();
    const hx = r.left + r.width / 2, hy = r.top + r.height * 0.4;
    tx = clamp((p.clientX - hx) / (innerWidth * 0.35), -1, 1);
    ty = clamp((p.clientY - hy) / (innerHeight * 0.35), -1, 1);
    const now = performance.now();
    if (last) speed = clamp(Math.hypot(p.clientX - last.x, p.clientY - last.y) / 40, 0, 1);
    last = { x: p.clientX, y: p.clientY };
    lastMove = now; wander = false; $("#wanderBtn").classList.remove("active");
  }
  ["pointermove", "pointerdown", "touchmove"].forEach((ev) => addEventListener(ev, point, { passive: true }));

  $("#wanderBtn").addEventListener("click", (e) => {
    wander = !wander; e.currentTarget.classList.toggle("active", wander); wanderT = 0;
  });
  svg.addEventListener("pointerdown", () => { svg.classList.add("cheer"); setTimeout(() => svg.classList.remove("cheer"), 600); });

  function dirOf(x, y) {
    if (Math.hypot(x, y) < 0.25) return "c";
    const h = x > 0.35 ? "r" : x < -0.35 ? "l" : "";
    const v = y > 0.35 ? "d" : y < -0.35 ? "u" : "";
    return v + h || (Math.abs(x) > Math.abs(y) ? (x > 0 ? "r" : "l") : (y > 0 ? "d" : "u"));
  }
  function renderReadings(force) {
    const D = I18N[lang];
    $("#dirTxt").textContent = D.dir[dirKey];
    $("#moodTxt").textContent = D.mood[moodKey];
  }

  let blinkAt = performance.now() + 2500;
  function frame(now) {
    // gentle auto look-around when the user is idle or wander is on
    if (wander || now - lastMove > 4000) {
      wanderT += 0.012;
      tx = Math.sin(wanderT * 1.3) * 0.9; ty = Math.cos(wanderT * 0.9) * 0.6;
    }
    cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
    pupils.forEach((p) => (p.style.transform = `translate(${cx * 9}px, ${cy * 7}px)`));
    head.style.transform = `translate(${cx * 10}px, ${cy * 6}px) rotate(${cx * 6}deg)`;
    dialDot.style.transform = `translate(${cx * 34}px, ${cy * 34}px)`;

    // engagement is based on real pointer activity, not emotion
    const idle = now - lastMove;
    const m = idle < 3000 ? "f" : idle < 10000 ? "w" : "s";
    const d = dirOf(cx, cy);
    if (m !== moodKey || d !== dirKey) { moodKey = m; dirKey = d; renderReadings(); }
    svg.dataset.mood = m;

    speed *= 0.95;
    const level = m === "s" ? 0 : m === "w" ? 1 : 1 + Math.round(speed * 3);
    bars.forEach((b, i) => b.classList.toggle("on", i < level));

    if (now > blinkAt) { svg.classList.add("blink"); setTimeout(() => svg.classList.remove("blink"), 140); blinkAt = now + 2200 + Math.random() * 2800; }
    requestAnimationFrame(frame);
  }
  setLang(lang);
  requestAnimationFrame(frame);
})();
