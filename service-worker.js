const CACHE_NAME = 'englishpl-v21';
const urlToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/package-lock.json",
  "/js/pages/standings.js",
  "/js/pages/saved.js",
  "/js/pages/schedule.js",
  "/js/api.js",
  "/js/db.js",
  "/js/idb.js",
  "/js/jquery-3.5.1.min.js",
  "/js/materialize.min.js",
  "/js/nav.js",
  "/js/push-notification.js",
  "/js/service-worker-register.js",
  "/css/materialize.min.css",
  "/css/style.css",
  "/image/icon/icon-128.png",
  "/image/icon/icon-192.png",
  "/image/icon/icon-256.png",
  "/image/icon/icon-384.png",
  "/image/icon/icon-512.png",
  "/image/header.png",
  "/pages/standings.html",
  "/pages/saved.html",
  "/pages/schedule.html",
  "/pages/nav.html"
];


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlToCache);
    })
  );
});


self.addEventListener("fetch", function(event) {
  const base_url = "https://api.football-data.org/";
  if (event.request.url.indexOf(base_url) > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return fetch(event.request).then((response) => {
          cache.put(event.request.url, response.clone());
          return response;
        })
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch (event.request);
      })
    )
  }
});


self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName != CACHE_NAME) {
            console.log('SW: cache ' + cacheName + ' deleted');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


self.addEventListener('push', (event) => {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  const options = {
    body: body,
    icon: '/image/icon/icon-256.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});