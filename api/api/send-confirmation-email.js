import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { to, orderCode } = req.body;

    const data = await resend.emails.send({
      from: "KRUA PEÈN THAÏ <onboarding@resend.dev>",
      to,
      subject: `Commande confirmée ${orderCode}`,
      html: `
        <h2>Commande confirmée ✅</h2>
        <p>Votre commande <b>${orderCode}</b> est confirmée.</p>
        <p>Merci pour votre confiance 🍜</p>
      `
    });

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
