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

    const rows = items.map((item) => `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #eee;">
          ${item.qty} × ${item.name}
        </td>
        <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;">
          ${item.lineTotal}
        </td>
      </tr>
    `).join("");

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:620px;margin:auto;padding:24px;color:#171717;">
        <h1 style="margin:0 0 8px;color:#111;">KRUA PEÈN THAÏ</h1>
        <p style="margin:0 0 24px;color:#666;">Thaï • Sushi • Poké • Traiteur</p>

        <h2 style="color:#111;">Commande confirmée ✅</h2>

        <p>Bonjour,</p>

        <p>
          Votre commande <strong>${orderCode}</strong> est bien confirmée.
        </p>

        <div style="background:#fff7e6;border:1px solid #ffd37a;border-radius:14px;padding:16px;margin:18px 0;">
          <p style="margin:0;"><strong>Retrait :</strong></p>
          <p style="margin:6px 0 0;">
            ${locationCity}<br>
            ${serviceDate}<br>
            ${serviceHours}
          </p>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-top:18px;">
          <tbody>
            ${rows}
          </tbody>
        </table>

        <h3 style="text-align:right;margin-top:18px;">Total : ${total}</h3>

        <p>Paiement sur place au food truck.</p>

        <p style="margin-top:26px;">
          Merci et à très bientôt 🙏<br>
          <strong>KRUA PEÈN THAÏ</strong>
        </p>
      </div>
    `;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "KRUA PEÈN THAÏ <onboarding@resend.dev>",
        to: [to],
        subject: `Confirmation commande ${orderCode}`,
        html
      })
    });

    const data = await resendResponse.json().catch(() => ({}));

    if (!resendResponse.ok) {
      return res.status(resendResponse.status).json({
        error: data?.message || data?.error || "Erreur Resend"
      });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: error.message || String(error) });
  }
}
