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

    const from = process.env.RESEND_FROM_EMAIL || "KRUA PEÈN THAÏ <onboarding@resend.dev>";
    const replyTo = process.env.RESEND_REPLY_TO || "kan-siam@laposte.net";

    const itemLinesText = items
      .map((item) => `- ${item.qty} x ${item.name} : ${item.lineTotal}`)
      .join("\n");

    const itemLinesHtml = items
      .map((item) => `<li>${item.qty} × ${item.name} : <strong>${item.lineTotal}</strong></li>`)
      .join("");

    const subject = `Confirmation commande ${orderCode} - KRUA PEÈN THAÏ`;

    const text = `Bonjour,

Votre commande ${orderCode} est bien confirmée pour ${locationCity} le ${serviceDate}.

Retrait pendant le service directement au food truck${serviceHours ? ` (${serviceHours})` : ""}.
Paiement sur place.

Récapitulatif :
${itemLinesText}

Total : ${total}

Merci et à très bientôt 🙏🌶️
KRUA PEÈN THAÏ`;

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111">
        <h2>Commande confirmée 🌶️</h2>
        <p>Bonjour,</p>
        <p>Votre commande <strong>${orderCode}</strong> est bien confirmée pour <strong>${locationCity}</strong> le <strong>${serviceDate}</strong>.</p>
        <p>Vous pourrez la récupérer pendant le service directement au food truck${serviceHours ? ` <strong>(${serviceHours})</strong>` : ""}.</p>
        <p>Paiement sur place.</p>
        <h3>Récapitulatif</h3>
        <ul>${itemLinesHtml}</ul>
        <p><strong>Total : ${total}</strong></p>
        <p>Merci et à très bientôt 🙏🌶️<br/>KRUA PEÈN THAÏ</p>
      </div>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: replyTo,
        subject,
        text,
        html
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || data.error || "Erreur Resend" });
    }

    return res.status(200).json({ success: true, id: data.id });
  } catch (error) {
    return res.status(500).json({ error: error.message || String(error) });
  }
}
