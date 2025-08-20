// Simple PWA + runtime tile cache (mobile friendly)
const CACHE_NAME = 'route-aid-v2';
const APP_ASSETS = [
  './',
  './index.html',
  './leaflet.js',
  './leaflet.css',
  './jszip.min.js',
  './togeojson.umd.js',
  './manifest.webmanifest'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(APP_ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);

  const isAppAsset =
    url.origin === location.origin &&
    (APP_ASSETS.includes(`.${url.pathname}`) || url.pathname.endsWith('/'));

  const isOsmTile = url.hostname === 'tile.openstreetmap.org';

  if (!isAppAsset && !isOsmTile) return;

  e.respondWith((async () => {
    const cached = await caches.match(req, { ignoreSearch: true });
    if (cached) {
      fetch(req)
        .then((resp) => {
          if (resp && (resp.ok || resp.type === 'opaque')) {
            caches.open(CACHE_NAME).then((c) => c.put(req, resp.clone()));
          }
        })
        .catch(() => {});
      return cached;
    }

    try {
      const resp = await fetch(req);
      if (resp && (resp.ok || resp.type === 'opaque')) {
        const c = await caches.open(CACHE_NAME);
        c.put(req, resp.clone());
      }
      return resp;
    } catch (err) {
      if (isAppAsset) return caches.match('./index.html');
      throw err;
    }
  })());
});
