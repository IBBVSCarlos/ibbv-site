/* Service Worker.js */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("site-cache").then((cache) => {
      const urlsToCache = [
        "/",
        "/assets/styles.css",
        "/assets/script.js",
        "/assets/favicon.png"
      ];

      return Promise.all(
        urlsToCache.map((url) => fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Erro ao buscar ${url}: ${response.statusText}`);
            }
            return cache.put(url, response);
          })
        )
      );
    }).catch((error) => {
      console.error("Erro ao adicionar arquivos ao cache:", error);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }).catch((error) => {
      console.error("Erro na busca de recurso:", error);
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
