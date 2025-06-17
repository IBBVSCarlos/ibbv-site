// service-worker.js

const CACHE_NAME = "site-cache-v2"; 

const PRECACHE_URLS = [
  './', 
  './assets/styles.css', 
  './assets/script.js', 
  './icons/favicon.png',
  './offline.html'
];

// Instala o SW e pré-carrega os arquivos
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Assume o controle imediatamente
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch((err) => console.error("Erro ao adicionar arquivos ao cache:", err))
  );
});

// Ativa o SW e limpa caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // Garante controle imediato das páginas
});

// Intercepta requisições e usa cache com atualização em background
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // Atualiza o cache com a nova versão
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          // Se falhar na rede e não tiver no cache, tenta offline.html
          if (cachedResponse) return cachedResponse;
          return caches.match("/offline.html");
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// Dispara notificação quando receber evento de sync
self.addEventListener("sync", (event) => {
  if (event.tag === "nova-coluna-pastor") {
    event.waitUntil(
      self.registration.showNotification("Nova mensagem do Pastor!", {
        body: "Confira o novo texto publicado!",
        icon: "/assets/icon-192.png",
        requireInteraction: true
      })
    );
  }
});
            
