// Cache version — bump this string whenever you deploy new files
// to force all users to get the latest version.
// Example: change 'v2' to 'v3' on your next deploy.
const CACHE = 'glaze-studio-v2';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // Delete old cache versions when a new service worker activates
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first strategy: try the network, fall back to cache.
// This means you always get fresh content when online,
// and cached content when offline.
self.addEventListener('fetch', e => {
  // Only cache same-origin requests (skip third-party like Pinterest)
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Save a copy in the cache for offline use
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, copy));
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
