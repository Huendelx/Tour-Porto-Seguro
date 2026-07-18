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
  const { error } = await supabaseAdmin.from("bookings").insert({
    tour_id: input.tourId,
    tour_date: input.tourDate,
    adults: input.adults,
    children: input.children,
    total_price: input.totalPrice,
    tourist_name: input.touristName,
    tourist_email: input.touristEmail,
    tourist_whatsapp: input.touristWhatsapp,
    notes: input.notes ?? null,
  });

  if (error) {
    console.error("createBooking:", error.message);
    return;
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
          Sua solicitação foi enviada direto pro operador no WhatsApp — a vaga é garantida
          assim que ele confirmar por lá. Nenhum valor foi cobrado ainda.
        </p>
        <p style="color: #999; font-size: 13px; margin-top: 32px;">Passeador · passeador.com</p>
      </div>
    `,
  }).catch((e) => console.error("Falha ao enviar e-mail de confirmação:", e));
}
