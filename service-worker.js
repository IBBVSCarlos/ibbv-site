/* Service Worker.js */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("ibbv-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/assets/styles.css",
        "/assets/script.js",
        "/data/avisosibbv.json",
        "/data/versiculos.json",
        "/data/escalamin.json",
        "/data/aniversariantes.json",
        "/assets/logibbv.png"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("sync", (event) => {
  if (event.tag === "nova-coluna-pastor") {
    event.waitUntil(
      self.registration.showNotification("Nova mensagem na Coluna do Pastor!", {
        body: "Confira o novo texto publicado!",
        icon: "/assets/icon-192.png"
      })
    );
  }
});

