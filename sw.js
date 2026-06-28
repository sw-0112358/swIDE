
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());

self.addEventListener("fetch", event => {
  const url = event.request.url;

  if (url.includes('/nc-proxy?')) {
    const target = new URL(url).searchParams.get('url');
    if (target) {
      event.respondWith(
        fetch(target, {
          credentials: 'omit',
          headers: {
            'User-Agent':      'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.82 Mobile Safari/537.36',
            'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'es-ES,es;q=0.9',
            'Referer':         new URL(target).origin + '/',
          }
        }).then(async resp => {
          const body = await resp.arrayBuffer();
          return new Response(body, {
            status: resp.status,
            headers: {
              'Content-Type':                resp.headers.get('content-type') || 'text/html; charset=utf-8',
              'Access-Control-Allow-Origin': '*',
            }
          });
        }).catch(err => new Response('Error SW: ' + err.message, { status: 500 }))
      );
      return;
    }
  }

  event.respondWith(fetch(event.request));
});