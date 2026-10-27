// Tiflan service worker: app works offline after the first visit. Network-first so updates always arrive when online.
const V = "tiflan-v11", SHELL = ["./", "index.html", "css/style.css", "data/centers.js","js/app.js","js/config.js","js/games.js","js/i18n-onboard.js","js/i18n.js","js/intake.js","js/onboarding.js","js/polish.js","js/risk.js","js/support.js", "manifest.webmanifest", "icons/icon-192.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(V).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== V).map((x) => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const r = e.request; if (r.method !== "GET") return; const u = new URL(r.url);
  if (u.hostname.endsWith("openstreetmap.org")) return;               // never cache map tiles
  const put = (res) => { const cp = res.clone(); caches.open(V).then((c) => c.put(r, cp)); return res; };
  if (u.origin === location.origin) e.respondWith(fetch(r).then(put).catch(() => caches.match(r).then((m) => m || caches.match("index.html"))));
  else if (/fonts\.(googleapis|gstatic)\.com|cdnjs\.cloudflare\.com/.test(u.hostname)) e.respondWith(caches.match(r).then((m) => m || fetch(r).then(put)));
});
