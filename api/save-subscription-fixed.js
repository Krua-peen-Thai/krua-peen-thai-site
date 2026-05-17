import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: "Missing Supabase environment variables" });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const body = req.body || {};
  const subscription = body.subscription || body;
  const endpoint = subscription.endpoint;
  const keys = subscription.keys;

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return res.status(400).json({ error: "Invalid push subscription" });
  }

  const { error } = await supabase
    .from("push_subscriptions")
    .upsert({
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
}
