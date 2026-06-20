// ð§ ConfiguraciÃ³n: cambia solo estas dos constantes
const PROJECT_NAME = "swIDE"; // nombre del proyecto
const VERSION = "v45";                 // versiÃ³n actual

const CACHE_NAME = `${PROJECT_NAME}-cache-${VERSION}`;
const FILES_TO_CACHE = [
  `/${PROJECT_NAME}/`,          // index
  `/${PROJECT_NAME}/icono.jpg`, // Ã­cono
  `/${PROJECT_NAME}/manifest.json`
];

// InstalaciÃ³n: guarda archivos
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting(); // activa inmediatamente
});

// ActivaciÃ³n: limpia cachÃ©s viejas
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim(); // toma control de las pÃ¡ginas abiertas
});

// Fetch: responde desde cachÃ© o red
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});