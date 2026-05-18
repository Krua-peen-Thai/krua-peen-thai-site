import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

webpush.setVapidDetails(
  "mailto:kan-siam@laposte.net",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

function euro(value) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR"
  }).format(Number(value || 0));
}

export default async function handler(req, res) {
  try {
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { orderCode, location } = req.body || {};

    let totalText = "0,00 €";

    if (orderCode) {
      const { data: order } = await supabase
        .from("orders")
        .select("total")
        .eq("code", orderCode)
        .single();

      if (order?.total !== undefined && order?.total !== null) {
        totalText = euro(order.total);
      }
    }

    const { data, error } = await supabase
      .from("push_subscriptions")
      .select("*");

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const payload = JSON.stringify({
      title: "Nouvelle commande KRUA",
      body: `${orderCode || "Nouvelle commande"} • ${totalText} • ${location || ""}`,
      url: "/admin"
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

    return res.status(200).json({ success: true });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
