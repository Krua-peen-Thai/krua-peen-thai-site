import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { endpoint, keys } = req.body;

  const { error } = await supabase
    .from("push_subscriptions")
    .upsert({
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth
    });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ success: true });
}
