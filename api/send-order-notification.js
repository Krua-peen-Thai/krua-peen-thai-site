import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

webpush.setVapidDetails(
  "mailto:kan-siam@laposte.net",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const payload = JSON.stringify({
    title: "Nouvelle commande KRUA",
    body: "Une nouvelle commande vient d’arriver."
  });

  await Promise.all(
    data.map(sub =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth
          }
        },
        payload
      ).catch(() => null)
    )
  );

  res.status(200).json({ success: true });
}
