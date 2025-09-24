const CACHE_NAME = "interlecto-v1";
const BASE = "/interLecto_app/";
const ASSETS = [
  `${BASE}`,
  `${BASE}index.html`,
  `${BASE}assets/css/app.css`,
  `${BASE}js/main.js`,
  `${BASE}js/deck.js`,
  `${BASE}js/utils.js`
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  e.respondWith(
    fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE_NAME).then(c => c.put(req, copy));
      return res;
    }).catch(() => caches.match(req))
  );
});
