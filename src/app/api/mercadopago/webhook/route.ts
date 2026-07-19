import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/resend";

function mapStatus(mpStatus: string): "pending" | "paid" | "cancelled" {
  if (mpStatus === "approved") return "paid";
  if (mpStatus === "rejected" || mpStatus === "cancelled") return "cancelled";
  return "pending";
}

export async function POST(req: Request) {
  let paymentId: string | null = null;

  try {
    const body = await req.json();
    paymentId = body?.data?.id ?? null;
  } catch {
    // corpo vazio/inválido — tenta pelo query param (Mercado Pago manda dos dois jeitos)
  }
  if (!paymentId) {
    paymentId = new URL(req.url).searchParams.get("data.id");
  }

  if (!paymentId) return NextResponse.json({ ok: true });

  const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` },
  });
  if (!paymentRes.ok) {
    console.error("mercadopago webhook: falha ao buscar pagamento", paymentRes.status);
    return NextResponse.json({ ok: true });
  }

  const payment = await paymentRes.json();
  const bookingId = payment.external_reference as string | undefined;
  if (!bookingId) return NextResponse.json({ ok: true });

  const status = mapStatus(payment.status);

  const { data: booking, error } = await supabaseAdmin
    .from("bookings")
    .update({ payment_status: status, mercadopago_id: String(paymentId) })
    .eq("id", bookingId)
    .select("*, tour:tours(title)")
    .single();

  if (error) {
    console.error("mercadopago webhook: falha ao atualizar reserva", error.message);
    return NextResponse.json({ ok: true });
  }

  if (status === "paid" && booking?.tourist_email) {
    await sendEmail({
      to: booking.tourist_email,
      subject: `Pagamento confirmado — ${booking.tour?.title ?? "sua reserva"}`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
          <h2 style="margin-bottom: 4px;">Pagamento confirmado ✅</h2>
          <p style="color: #666; margin-top: 0;">${booking.tour?.title ?? ""}</p>
          <p style="color: #444; line-height: 1.5;">
            Sua vaga está garantida. O operador vai entrar em contato pelo WhatsApp com os
            detalhes finais do passeio.
          </p>
          <p style="color: #999; font-size: 13px; margin-top: 32px;">Passeador · passeador.com</p>
        </div>
      `,
    }).catch((e) => console.error("mercadopago webhook: falha ao enviar e-mail", e));
  }

  return NextResponse.json({ ok: true });
}
