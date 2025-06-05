/* Service Worker.js */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("site-cache").then((cache) => {
      return cache.addAll([
        "/", 
        "/assets/styles.css", 
        "/assets/script.js", 
        "/assets/favicon.png",
        "/offline.html" // Página offline alternativa
      ]);
    }).catch((error) => {
      console.error("Erro ao adicionar arquivos ao cache:", error);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => caches.match("/offline.html"));
    })
  );
});

self.addEventListener("sync", (event) => {
  if (event.tag === "nova-coluna-pastor") {
    event.waitUntil(
      self.registration.showNotification("Nova mensagem na Coluna do Pastor!", {
        body: "Confira o novo texto publicado!",
        icon: "/assets/icon-192.png",
        requireInteraction: true
      })
    );
  }
});
