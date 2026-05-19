import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
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
      return res.status(400).json({ error: "Adresse email manquante" });
    }

    const htmlItems = items
      .map(
        (item) => `
          <tr>
            <td style="padding:8px;border-bottom:1px solid #ddd;">${item.qty} x ${item.name}</td>
            <td style="padding:8px;border-bottom:1px solid #ddd;text-align:right;">${item.lineTotal}</td>
          </tr>
        `
      )
      .join("");

    const result = await resend.emails.send({
      from: "KRUA PEÈN THAÏ <onboarding@resend.dev>",
      to,
      subject: `Confirmation commande ${orderCode}`,
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px;color:#111;">
          <h2>Commande confirmée 🍜</h2>
          <p>Bonjour,</p>
          <p>Votre commande <b>${orderCode}</b> est confirmée.</p>

          <p>
            <b>Retrait :</b><br>
            ${locationCity}<br>
            ${serviceDate}<br>
            ${serviceHours}
          </p>

          <table style="width:100%;border-collapse:collapse;margin-top:16px;">
            ${htmlItems}
          </table>

          <h3>Total : ${total}</h3>

          <p>Paiement sur place.</p>
          <p>Merci 🙏<br>KRUA PEÈN THAÏ</p>
        </div>
      `
    });

    return res.status(200).json({ success: true, result });
  } catch (error) {
    return res.status(500).json({ error: error.message || String(error) });
  }
}
