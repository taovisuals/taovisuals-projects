// TripMind Radio — service worker. Cachea la cáscara de la app para que abra rápido
// y se pueda instalar. El stream y la API de "ahora suena" nunca se cachean.
const VERSION = "tmr-v42";
const SHELL = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
  "assets/icons/maskable-512.png",
  "assets/icons/apple-touch-icon.png",
  "assets/icons/favicon-32.png",
"assets/qr-entrar.svg"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Fuentes, API, stream y audio pasan directo a la red.
  if (url.origin !== self.location.origin) return;
  if (req.destination === "audio" || req.destination === "video") return;
  if (url.pathname.includes("/api/") || url.pathname.includes("/listen/")) return;

  // Páginas: red primero, y si no hay red, la última copia guardada.
  // Solo la portada se guarda como "index.html"; si no, entrar a /panel/ o
  // /locutores/ sobreescribiría la copia offline de la emisora.
  if (req.mode === "navigate") {
    const esPortada = url.pathname === "/" || url.pathname === "/index.html";
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (esPortada && res.ok) {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put("index.html", copy));
          }
          return res;
        })
        .catch(() => caches.match(esPortada ? "index.html" : req).then((hit) => hit || caches.match("index.html")))
    );
    return;
  }

  // Resto de la cáscara: caché primero.
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
});
