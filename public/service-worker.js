const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/api.js",
  "/exercise.html",
  "/stats.html",
  "/exercise.js",
  "/stats.js",
  "/workout.js",
  "/style.css",
  "/workout-style.css",
  "/service-worker.js",
  "/assets/css/style.css",
  "/assets/js/loadImages.js",
  "https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css",
  "https://fonts.gstatic.com/s/lato/v16/S6u9w4BMUTPHh6UVSwiPGQ3q5d0.woff2",
  "https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic&subset=latin"
];

const CACHE_NAME = "static-cache-v12";
const DATA_CACHE_NAME = "data-cache-v12";
// install
self.addEventListener("install", function (evt) {
evt.waitUntil(
  caches.open(CACHE_NAME).then(cache => {
    console.log("Your files were pre-cached successfully!");
    return cache.addAll(FILES_TO_CACHE);
  })
);
self.skipWaiting();
});
// activate
self.addEventListener("activate", function (evt) {
evt.waitUntil(
  caches.keys().then(keyList => {
    return Promise.all(
      keyList.map(key => {
        if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
          console.log("Removing old cache data", key);
          return caches.delete(key);
        }
      })
    );
  })
);
self.clients.claim();
});
// fetch
self.addEventListener("fetch", function (evt) {
if (evt.request.url.includes("/api/")) {
  evt.respondWith(
    caches.open(DATA_CACHE_NAME).then(cache => {
      return fetch(evt.request)
        .then(response => {
          // If the response was good, clone it and store it in the cache.
          if (response.status === 200) {
            console.log("storing response from " + evt.request.url)
            cache.put(evt.request.url, response.clone());
          }
          return response;
        })
        .catch(err => {
          // Network request failed, try to get it from the cache.
          return cache.match(evt.request);
        });
    }).catch(err => console.log(err))
  );
  return;
}
evt.respondWith(
  caches.open(CACHE_NAME).then(cache => {
    return cache.match(evt.request).then(response => {
      return response || fetch(evt.request);
    });
  })
);
});