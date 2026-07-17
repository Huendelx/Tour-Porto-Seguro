import { redirect } from "next/navigation";
import TourForm, { type TourFormInitial } from "@/components/operador/TourForm";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getMyOperator, updateTour } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditarPasseioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const operator = await getMyOperator();
  if (!operator) redirect("/operador");

  const { data: tour } = await supabaseAdmin
    .from("tours")
    .select("*")
    .eq("id", id)
    .eq("operator_id", operator.id)
    .maybeSingle();

  if (!tour) redirect("/operador");

  const schedule = (tour.schedule ?? {}) as Record<string, string>;

  const initial: Partial<TourFormInitial> = {
    title: tour.title ?? "",
    subtitle: tour.subtitle ?? "",
    summary: tour.summary ?? "",
    description: tour.description ?? "",
    tips: tour.tips ?? "",
    important_info: tour.important_info ?? "",
    category: tour.category,
    destinos: tour.destinos ?? [],
    transport_type: tour.transport_type ?? "",
    duration: tour.duration ?? "",
    duration_minutes: tour.duration_minutes,
    group_size: tour.group_size ?? "",
    price: tour.price ?? 0,
    price_max: tour.price_max,
    includes: tour.includes ?? [],
    excludes: tour.excludes ?? [],
    image: tour.image ?? "",
    images: tour.images ?? [],
    meeting_point: tour.meeting_point ?? "",
    cancellation_policy: tour.cancellation_policy ?? "",
    is_active: tour.is_active ?? false,
    frequency: schedule.frequency ?? "daily",
    days: schedule.days ?? "",
    departureStart: schedule.departureStart ?? "",
    departureEnd: schedule.departureEnd ?? "",
    returnTime: schedule.returnTime ?? "",
    itinerary: tour.itinerary ?? [],
  };

  const boundUpdateTour = updateTour.bind(null, tour.id);

  return (
    <div>
      <h1 className="text-[24px] font-bold text-[#111] mb-8">Editar passeio</h1>
      <TourForm action={boundUpdateTour} initial={initial} submitLabel="Salvar alterações" />
    </div>
  );
}
