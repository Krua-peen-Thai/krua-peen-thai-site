self.addEventListener("push", function(event) {
  const data = event.data ? event.data.json() : {
    title: "Nouvelle commande KRUA",
    body: "Une nouvelle commande est arrivée"
  };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png"
    })
  );
});
