"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createBooking(input: {
  tourId: string;
  tourDate: string;
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

  if (error) console.error("createBooking:", error.message);
}
