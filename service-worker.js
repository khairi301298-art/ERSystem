const CACHE_NAME = "event-pwa-v2";

// Only cache static files (NOT Streamlit app)
const STATIC_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.png"
];

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_FILES);
    })
  );
});

// Activate (clean old cache)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// Fetch strategy
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // ❗ VERY IMPORTANT: Do NOT cache Streamlit app
  if (url.hostname.includes("streamlit.app")) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Network first, fallback to cache
  event.respondWith(
    fetch(event.request)
      .then((response) => response)
      .catch(() => caches.match(event.request))
  );
});
