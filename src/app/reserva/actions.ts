"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/resend";

export async function createBooking(input: {
  tourId: string;
  tourTitle: string;
  tourDate: string;
  formattedDate: string;
  adults: number;
  children: number;
  totalPrice: number;
  touristName: string;
  touristEmail: string;
  touristWhatsapp: string;
  notes?: string;
}) {
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .insert({
      tour_id: input.tourId,
      tour_date: input.tourDate,
      adults: input.adults,
      children: input.children,
      total_price: input.totalPrice,
      tourist_name: input.touristName,
      tourist_email: input.touristEmail,
      tourist_whatsapp: input.touristWhatsapp,
      notes: input.notes ?? null,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("createBooking:", error?.message);
    return null;
  }

  const peopleLine =
    input.children > 0
      ? `${input.adults} adulto${input.adults > 1 ? "s" : ""} e ${input.children} criança${input.children > 1 ? "s" : ""}`
      : `${input.adults} adulto${input.adults > 1 ? "s" : ""}`;

  await sendEmail({
    to: input.touristEmail,
    subject: `Reserva recebida — ${input.tourTitle}`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
        <h2 style="margin-bottom: 4px;">Recebemos sua reserva</h2>
        <p style="color: #666; margin-top: 0;">${input.tourTitle}</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 6px 0; color: #666;">Data</td><td style="padding: 6px 0; text-align: right; font-weight: 600;">${input.formattedDate}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Pessoas</td><td style="padding: 6px 0; text-align: right; font-weight: 600;">${peopleLine}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Total estimado</td><td style="padding: 6px 0; text-align: right; font-weight: 600;">R$ ${input.totalPrice}</td></tr>
        </table>
        <p style="color: #444; line-height: 1.5;">
          Recebemos os detalhes da sua reserva. Assim que ela for confirmada — pelo
          pagamento ou pela resposta do operador — você recebe um novo aviso por aqui.
        </p>
        <p style="color: #999; font-size: 13px; margin-top: 32px;">Passeador · passeador.com</p>
      </div>
    `,
  }).catch((e) => console.error("Falha ao enviar e-mail de confirmação:", e));

  return data.id as string;
}

const SITE_URL = "https://passeador.com";

/**
 * Cria a preferência de pagamento (Checkout Pro) e devolve a URL pra redirecionar.
 * Usa sandbox_init_point enquanto as credenciais forem de teste — trocar pra
 * init_point quando o access token virar de produção.
 */
export async function createPaymentPreference(input: {
  bookingId: string;
  tourSlug: string;
  tourTitle: string;
  totalPrice: number;
}): Promise<{ url: string | null }> {
  const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        {
          title: input.tourTitle,
          quantity: 1,
          unit_price: input.totalPrice,
          currency_id: "BRL",
        },
      ],
      external_reference: input.bookingId,
      back_urls: {
        success: `${SITE_URL}/reserva/${input.tourSlug}/sucesso`,
        failure: `${SITE_URL}/reserva/${input.tourSlug}`,
        pending: `${SITE_URL}/reserva/${input.tourSlug}`,
      },
      auto_return: "approved",
      notification_url: `${SITE_URL}/api/mercadopago/webhook`,
    }),
  });

  if (!res.ok) {
    console.error("createPaymentPreference:", res.status, await res.text());
    return { url: null };
  }

  const data = await res.json();
  return { url: (data.sandbox_init_point ?? data.init_point) as string | null };
}
