self.addEventListener("push", function (event) {
  const data = event.data
    ? event.data.json()
    : {
        title: "Nouvelle commande KRUA",
        body: "Une nouvelle commande est arrivée",
        url: "/admin"
      };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      vibrate: [300, 100, 300],
      data: {
        url: data.url || "/admin",
        orderCode: data.orderCode || null
      }
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/admin";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && "focus" in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
