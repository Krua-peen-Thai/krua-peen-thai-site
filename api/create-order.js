import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
});

function cleanText(value, max = 300) {
  return String(value || "").trim().slice(0, max);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: "Configuration serveur incomplète" });
  }

  try {
    const body = req.body || {};
    const items = Array.isArray(body.items) ? body.items : [];

    const code = cleanText(body.code, 30);
    const firstName = cleanText(body.firstName, 80);
    const lastName = cleanText(body.lastName, 80);
    const phone = cleanText(body.phone, 40);
    const email = cleanText(body.email, 160) || null;
    const note = cleanText(body.note, 1000);
    const locationId = cleanText(body.locationId, 30);
    const total = Number(body.total || 0);

    if (!code || !firstName || !phone || !locationId || !items.length) {
      return res.status(400).json({ error: "Commande incomplète" });
    }

    if (!Number.isFinite(total) || total <= 0 || total > 500) {
      return res.status(400).json({ error: "Total commande invalide" });
    }

    const safeItems = items.map((item) => ({
      product_id: cleanText(item.id, 120),
      name: cleanText(item.name, 200),
      qty: Number(item.qty || 0),
      price: Number(item.price || 0)
    })).filter((item) => item.product_id && item.name && item.qty > 0 && item.qty < 100 && item.price >= 0 && item.price < 200);

    if (!safeItems.length) {
      return res.status(400).json({ error: "Lignes commande invalides" });
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        code,
        status: cleanText(body.status, 40) || "À confirmer",
        first_name: firstName,
        last_name: lastName,
        phone,
        email,
        note,
        location_id: locationId,
        total
      })
      .select("id, created_at")
      .single();

    if (orderError) {
      return res.status(500).json({ error: orderError.message });
    }

    const lines = safeItems.map((item) => ({ ...item, order_id: order.id }));
    const { error: linesError } = await supabaseAdmin.from("order_items").insert(lines);

    if (linesError) {
      await supabaseAdmin.from("orders").delete().eq("id", order.id);
      return res.status(500).json({ error: linesError.message });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Erreur serveur" });
  }
}
