import { supabaseAdmin } from "@/lib/supabase/admin";
import { getMyOperator } from "../actions";

export const dynamic = "force-dynamic";

export default async function ReservasPage() {
  const operator = await getMyOperator();
  if (!operator) return null;

  const { data: tours } = await supabaseAdmin
    .from("tours")
    .select("id")
    .eq("operator_id", operator.id);

  const tourIds = (tours ?? []).map((t) => t.id);

  const { data: bookings } =
    tourIds.length > 0
      ? await supabaseAdmin
          .from("bookings")
          .select("*, tour:tours(title)")
          .in("tour_id", tourIds)
          .order("created_at", { ascending: false })
      : { data: [] };

  return (
    <div>
      <h1 className="text-[24px] font-bold text-[#111] mb-1">Reservas</h1>
      <p className="text-[14px] text-gray-500 mb-8">
        Reservas feitas pelos turistas nos seus passeios.
      </p>

      {!bookings || bookings.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-300 rounded-2xl">
          <p className="text-[15px] text-gray-500">Nenhuma reserva ainda.</p>
          <p className="text-[13px] text-gray-400 mt-1">
            As reservas feitas pelo site vão aparecer aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="p-4 rounded-2xl border border-gray-200 bg-white">
              <p className="font-semibold text-[15px] text-[#111]">{b.tour?.title}</p>
              <p className="text-[13px] text-gray-500 mt-1">{b.tourist_name} · {b.tourist_whatsapp}</p>
              <p className="text-[13px] text-gray-500">
                {new Date(b.tour_date).toLocaleDateString("pt-BR")} · {b.adults} adulto(s)
                {b.children > 0 ? ` · ${b.children} criança(s)` : ""} · R$ {b.total_price}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
