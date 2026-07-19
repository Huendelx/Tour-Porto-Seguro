import "server-only";

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("sendEmail: RESEND_API_KEY não configurada");
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Passeador <contato@passeador.com>",
      to,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    console.error("sendEmail:", res.status, await res.text());
  }
}
