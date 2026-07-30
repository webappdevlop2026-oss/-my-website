/* v4.6.0 build:2026-07-31-photo-fix-cache-bust */
const CACHE_NAME = 'digital-agency-chandan-v460';
const CORE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/client-room.html',
  '/slide-free-offer-main.webp',
  '/slide-client-room.webp',
  '/slide-beginner-help.webp',
  '/slide-free-tools.webp',
  '/client-room-real-office.webp'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => Promise.all(
      names.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
    ))
  );
  self.clients.claim();
});

function isHtmlRequest(request){
  return request.mode === 'navigate' ||
         request.destination === 'document' ||
         new URL(request.url).pathname.endsWith('.html');
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  // HTML pages: ALWAYS network-first, no matter how the page was requested
  // (full navigation, fetch(), iframe, etc). This guarantees a freshly
  // uploaded client-room.html is never blocked by a stale cache again.
  if (isHtmlRequest(request)) {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then(r => r || caches.match('/index.html')))
    );
    return;
  }

  // Images/CSS/JS: stale-while-revalidate — serve the cached copy instantly
  // for speed, but always fetch a fresh copy in the background and update
  // the cache, so the NEXT load automatically picks up any replaced file
  // (like client-room-real-office.webp) without needing a new SW version.
  event.respondWith(
    caches.match(request).then(cached => {
      const network = fetch(request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
