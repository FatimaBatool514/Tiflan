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

  /* ---------- the two babies always look at the pointer ----------
     Each baby has 4 poses (up, down, left, right). The pose follows the direction from that baby to the pointer, and poses are blended
     smoothly over ~0.2 s. A small continuous head shift/tilt follows the pointer between poses. When the pointer is still, nothing moves. */
  const babiesEl = $("#babies"), POSES = ["down", "up", "left", "right"];
  const babies = [...document.querySelectorAll(".baby")].map((el) => {
    const imgs = Object.fromEntries([...el.querySelectorAll("img")].map((i) => [i.dataset.d, i])), w = {}; POSES.forEach((p) => (w[p] = 0));
    return { el, wrap: el.querySelector(".wrap"), imgs, w, dir: "" };
  });
  const dialDot = $("#dialDot"), bars = [...document.querySelectorAll("#bars i")];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  let px = innerWidth / 2, py = innerHeight * 0.5, spx = px, spy = py, tx = 0, ty = 0;
  let lastMove = performance.now(), speed = 0, last = null;

  function point(e) {
    const p = e.touches ? e.touches[0] : e; px = p.clientX; py = p.clientY;
    if (last) speed = clamp(Math.hypot(px - last.x, py - last.y) / 40, 0, 1);
    last = { x: px, y: py }; lastMove = performance.now();
  }
  ["pointermove", "pointerdown", "touchmove"].forEach((ev) => addEventListener(ev, point, { passive: true }));
  babies.forEach((b) => b.el.addEventListener("pointerdown", () => { b.el.classList.add("cheer"); setTimeout(() => b.el.classList.remove("cheer"), 650); }));

  // Pose by angle (right = 0°, down = 90°). Leave the current pose only when the pointer is 12° past its edge, so it never flickers.
  const CENTRE = { right: 0, down: 90, left: 180, up: -90 };
  function choose(prev, dx, dy) {
    if (prev && Math.hypot(dx, dy) < 50) return prev;                      // pointer right on top of the baby: keep looking where it was
    const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
    const s = ang >= -45 && ang < 45 ? "right" : ang >= 45 && ang < 135 ? "down" : ang >= 135 || ang < -135 ? "left" : "up";
    if (!prev || s === prev) return s;
    const diff = Math.abs((((ang - CENTRE[prev]) % 360) + 540) % 360 - 180);
    return diff > 57 ? s : prev;
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
    spx += (px - spx) * 0.16; spy += (py - spy) * 0.16;                   // smooth the pointer itself
    if (Math.abs(px - spx) < 0.05) spx = px; if (Math.abs(py - spy) < 0.05) spy = py;
    tx = clamp((spx - hx) / (innerWidth * 0.35), -1, 1); ty = clamp((spy - hy) / (innerHeight * 0.35), -1, 1);
    babies.forEach((b) => {
      const r = b.el.getBoundingClientRect(), dx = spx - (r.left + r.width / 2), dy = spy - (r.top + r.height * 0.32), first = !b.dir, d = choose(b.dir, dx, dy);
      b.dir = d; if (first) POSES.forEach((p) => (b.w[p] = p === d ? 1 : 0));
      let cum = 0;                                                         // blend weights -> stacked opacities that always sum to a solid baby
      POSES.forEach((p) => { const t = p === d ? 1 : 0; b.w[p] += (t - b.w[p]) * 0.2; if (Math.abs(t - b.w[p]) < 0.004) b.w[p] = t; cum += b.w[p]; b.imgs[p].style.opacity = b.w[p] > 0 ? (b.w[p] / cum).toFixed(3) : "0"; });
      const nx = clamp(dx / 260, -1, 1), ny = clamp(dy / 260, -1, 1);
      b.wrap.style.transform = `translate(${(nx * 8).toFixed(2)}px, ${(ny * 5).toFixed(2)}px) rotate(${(nx * 3).toFixed(2)}deg)`;
    });
    dialDot.style.transform = `translate(${tx * 34}px, ${ty * 34}px)`;
    const idle = now - lastMove, m = idle < 3000 ? "f" : idle < 10000 ? "w" : "s", d = dirOf(tx, ty);
    if (m !== moodKey || d !== dirKey) { moodKey = m; dirKey = d; renderReadings(); }
    speed *= 0.95;
    const level = m === "s" ? 0 : m === "w" ? 1 : 1 + Math.round(speed * 3);
    bars.forEach((b, i) => b.classList.toggle("on", i < level));
    requestAnimationFrame(frame);
  }
  setLang(lang);
  requestAnimationFrame(frame);
})();
