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
    document.dispatchEvent(new Event("tiflan:lang"));
  }
  $("#langBtn").addEventListener("click", () => setLang(lang === "ar" ? "en" : "ar"));

  /* ---------- toast ---------- */
  const toast = $("#toast"); let tt;
  window.tiflanToast = (key) => { toast.textContent = I18N[lang][key]; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 3200); };
  document.querySelectorAll("[data-start]").forEach((b) => b.addEventListener("click", () => (window.openOnboarding ? window.openOnboarding() : window.tiflanToast("toast"))));

  /* ---------- the two babies look at the pointer (4 poses each: up, down, left, right) ---------- */
  const babiesEl = $("#babies");
  const babies = [...document.querySelectorAll(".baby")].map((el) => ({ el, wrap: el.querySelector(".wrap"), imgs: Object.fromEntries([...el.querySelectorAll("img")].map((i) => [i.dataset.d, i])), dir: "" }));
  const dialDot = $("#dialDot"), bars = [...document.querySelectorAll("#bars i")];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  let px = innerWidth / 2, py = innerHeight * 0.5, spx = px, spy = py, tx = 0, ty = 0;
  let lastMove = performance.now(), speed = 0, last = null, wander = false, wanderT = 0;

  function point(e) {
    const p = e.touches ? e.touches[0] : e; px = p.clientX; py = p.clientY;
    const now = performance.now();
    if (last) speed = clamp(Math.hypot(px - last.x, py - last.y) / 40, 0, 1);
    last = { x: px, y: py }; lastMove = now; wander = false; $("#wanderBtn").classList.remove("active");
  }
  ["pointermove", "pointerdown", "touchmove"].forEach((ev) => addEventListener(ev, point, { passive: true }));
  $("#wanderBtn").addEventListener("click", (e) => { wander = !wander; e.currentTarget.classList.toggle("active", wander); wanderT = 0; });
  babies.forEach((b) => b.el.addEventListener("pointerdown", () => { b.el.classList.add("cheer"); setTimeout(() => b.el.classList.remove("cheer"), 650); }));

  // pick the pose by the dominant direction; keep the old pose while the pointer is on a diagonal so it does not flicker
  function choose(prev, dx, dy) {
    const ax = Math.abs(dx), ay = Math.abs(dy);
    if (!prev) return ax > ay ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
    if (ax + ay < 30) return prev;
    if (ax > ay * 1.15) return dx > 0 ? "right" : "left";
    if (ay > ax * 1.15) return dy > 0 ? "down" : "up";
    return prev;
  }
  function dirOf(x, y) {
    if (Math.hypot(x, y) < 0.25) return "c";
    const h = x > 0.35 ? "r" : x < -0.35 ? "l" : "";
    const v = y > 0.35 ? "d" : y < -0.35 ? "u" : "";
    return v + h || (Math.abs(x) > Math.abs(y) ? (x > 0 ? "r" : "l") : (y > 0 ? "d" : "u"));
  }
  function renderReadings() { const D = I18N[lang]; $("#dirTxt").textContent = D.dir[dirKey]; $("#moodTxt").textContent = D.mood[moodKey]; }

  function frame(now) {
    const hr = babiesEl.getBoundingClientRect(), hx = hr.left + hr.width / 2, hy = hr.top + hr.height * 0.4;
    if (wander || now - lastMove > 4000) {                       // gentle auto look-around when nobody is moving the pointer
      wanderT += 0.012; px = hx + Math.sin(wanderT * 1.3) * innerWidth * 0.32; py = hy + Math.cos(wanderT * 0.9) * innerHeight * 0.25;
    }
    spx += (px - spx) * 0.18; spy += (py - spy) * 0.18;
    tx = clamp((spx - hx) / (innerWidth * 0.35), -1, 1); ty = clamp((spy - hy) / (innerHeight * 0.35), -1, 1);
    babies.forEach((b) => {
      const r = b.el.getBoundingClientRect(), dx = spx - (r.left + r.width / 2), dy = spy - (r.top + r.height * 0.32), d = choose(b.dir, dx, dy);
      if (d !== b.dir) { if (b.dir) b.imgs[b.dir].classList.remove("on"); b.imgs[d].classList.add("on"); b.dir = d; }
      b.wrap.style.transform = `translate(${clamp(dx / 90, -1, 1) * 5}px, ${clamp(dy / 90, -1, 1) * 3}px) rotate(${clamp(dx / 700, -1, 1) * 2}deg)`;
    });
    dialDot.style.transform = `translate(${tx * 34}px, ${ty * 34}px)`;

    // engagement is based on real pointer activity, not emotion
    const idle = now - lastMove, m = idle < 3000 ? "f" : idle < 10000 ? "w" : "s", d = dirOf(tx, ty);
    if (m !== moodKey || d !== dirKey) { moodKey = m; dirKey = d; renderReadings(); }
    babiesEl.dataset.mood = m;
    speed *= 0.95;
    const level = m === "s" ? 0 : m === "w" ? 1 : 1 + Math.round(speed * 3);
    bars.forEach((b, i) => b.classList.toggle("on", i < level));
    requestAnimationFrame(frame);
  }
  setLang(lang);
  requestAnimationFrame(frame);
})();
