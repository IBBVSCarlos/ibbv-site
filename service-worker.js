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
  self.skipWaiting();
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
        keys.filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Intercepta requisições e usa cache com atualização em background
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => cachedResponse || caches.match("/offline.html"));

      return cachedResponse || fetchPromise;
    })
  );
});

// 🔁 Sync background (ex: nova coluna do pastor)
self.addEventListener("sync", (event) => {
  if (event.tag === "nova-coluna-pastor") {
    event.waitUntil(
      self.registration.showNotification("Novo texto no site!", {
        body: "Confira o novo texto publicado!",
        icon: "/assets/icon-192.png",
        vibrate: [100, 50, 100],
        tag: "pastor-texto",
        requireInteraction: true
      })
    );
  }
});

// 🔔 Push Notification
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {
    title: "🔔 Novo aviso!",
    body: "Entre no app e veja os avisos atualizados.",
    icon: "/assets/icon-192.png",
    url: "/"
  };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      tag: "aviso-destaque",
      vibrate: [150, 50, 150],
      data: { url: data.url || "/" }
    })
  );
});

// 🪟 Foco ou abre página ao clicar na notificação
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
      const client = clientList.find(c => c.url === urlToOpen && "focus" in c);
      if (client) {
        return client.focus();
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
