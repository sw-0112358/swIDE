
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());

self.addEventListener("fetch", event => {
  const url = event.request.url;

  // Interceptar peticiones a /nc-proxy?url=...
  if (url.includes('/nc-proxy?')) {
    const target = new URL(url).searchParams.get('url');
    if (target) {
      event.respondWith(
        fetch(target, {
          credentials: 'include',
          mode: 'no-cors',
          headers: {
            'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'es-ES,es;q=0.9',
          }
        }).then(resp => {
          // no-cors devuelve opaque response — intentar leer igual
          return new Response(resp.body, {
            status: resp.status || 200,
            headers: {
              'Content-Type':                'text/html; charset=utf-8',
              'Access-Control-Allow-Origin': '*',
            }
          });
        }).catch(err => new Response('Error SW: ' + err.message, { status: 500 }))
      );
      return;
    }
  }

  // Todo lo demás — pasar directo sin caché
  event.respondWith(fetch(event.request));
});