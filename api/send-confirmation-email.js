export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "RESEND_API_KEY manquante dans Vercel" });
    }

    const {
      to,
      orderCode,
      locationCity,
      serviceDate,
      serviceHours,
      total,
      items = []
    } = req.body || {};

    if (!to) {
      return res.status(400).json({ error: "Adresse email client manquante" });
    }

    const safeItems = items.map((item) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee;">${item.qty} × ${item.name}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;font-weight:bold;">${item.lineTotal}</td>
      </tr>
    `).join("");

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;padding:24px;background:#fff;color:#111;">
        <h1 style="margin:0 0 12px;color:#111;">KRUA PEÈN THAÏ</h1>
        <h2 style="margin:0 0 20px;color:#d97706;">Commande confirmée</h2>
        <p>Bonjour,</p>
        <p>Votre commande <strong>${orderCode}</strong> est bien confirmée.</p>
        <div style="background:#f8f4ed;border-radius:12px;padding:16px;margin:18px 0;">
          <p style="margin:0 0 8px;"><strong>Retrait :</strong></p>
          <p style="margin:0;">${locationCity}</p>
          <p style="margin:0;">${serviceDate}</p>
          <p style="margin:0;">${serviceHours}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-top:16px;">
          ${safeItems}
        </table>
        <h3 style="text-align:right;margin-top:18px;">Total : ${total}</h3>
        <p>Paiement sur place au food truck.</p>
        <p>Merci et à très bientôt 🙏🌶️<br><strong>KRUA PEÈN THAÏ</strong></p>
      </div>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "KRUA PEÈN THAÏ <onboarding@resend.dev>",
        to,
        subject: `Confirmation commande ${orderCode}`,
        html
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || data.error || "Erreur Resend", details: data });
    }

    return res.status(200).json({ ok: true, data });
  } catch (error) {
    return res.status(500).json({ error: error.message || String(error) });
  }
}
