/* v6.0.0 build:2026-07-31-client-room-final7 */
const CACHE_NAME = 'digital-agency-chandan-v600';
const CORE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/slide-free-offer-main.webp',
  '/slide-client-room.webp',
  '/slide-beginner-help.webp',
  '/slide-free-tools.webp'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(names => Promise.all(
    names.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
  )));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Client Room must always come from the network so old layouts/images never persist.
  if (url.pathname === '/client-room.html' ||
      url.pathname === '/client-room-photo-exact-v5.png' ||
      url.pathname === '/sw.js') {
    event.respondWith(fetch(request, { cache: 'no-store' }));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        return response;
      }).catch(() => caches.match(request).then(r => r || caches.match('/index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response && response.status === 200) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
      }
      return response;
    }))
  );
});
