import { supabasePublic } from "@/lib/supabase/public";
import type { Tour, TourOperator, TourPrice, TourSchedule, TourItineraryStep } from "@/data/tours";

export { categoryLabel, categoryColor } from "@/data/tours";
export type { Tour, TourOperator, TourPrice, TourSchedule, TourItineraryStep } from "@/data/tours";

const TOUR_COLUMNS = "*, operator:operators(name, whatsapp, years_experience, cadastur, bio)";

type TourRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  summary: string | null;
  description: string;
  tips: string | null;
  important_info: string | null;
  duration: string;
  duration_minutes: number | null;
  distance_km: number | null;
  group_size: string;
  price: number;
  price_max: number | null;
  price_unit: string;
  prices: TourPrice[];
  category: Tour["category"];
  transport_type: string;
  itinerary: TourItineraryStep[] | null;
  includes: string[];
  excludes: string[];
  image: string;
  images: string[] | null;
  featured: boolean;
  badge: string | null;
  schedule: TourSchedule;
  meeting_point: string | null;
  languages: string[] | null;
  accessibility: string[] | null;
  cancellation_policy: string;
  has_transfer: boolean;
  trackable: boolean;
  destinos: string[];
  operator: {
    name: string;
    whatsapp: string;
    years_experience: number | null;
    cadastur: string | null;
    bio: string | null;
  } | null;
};

function mapRow(row: TourRow): Tour {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle ?? "",
    summary: row.summary ?? undefined,
    description: row.description,
    tips: row.tips ?? undefined,
    importantInfo: row.important_info ?? undefined,
    duration: row.duration,
    durationMinutes: row.duration_minutes ?? undefined,
    distanceKm: row.distance_km ?? undefined,
    groupSize: row.group_size,
    price: Number(row.price),
    priceMax: row.price_max != null ? Number(row.price_max) : undefined,
    priceUnit: row.price_unit,
    prices: row.prices ?? [],
    category: row.category,
    transportType: row.transport_type,
    itinerary: row.itinerary ?? undefined,
    highlights: [],
    includes: row.includes ?? [],
    excludes: row.excludes ?? [],
    image: row.image,
    images: row.images ?? undefined,
    featured: row.featured,
    badge: row.badge ?? undefined,
    operator: {
      name: row.operator?.name ?? "Operador Passeador",
      whatsapp: row.operator?.whatsapp ?? "",
      years: row.operator?.years_experience ?? 0,
      cadastur: row.operator?.cadastur ?? undefined,
      bio: row.operator?.bio ?? undefined,
    },
    schedule: row.schedule,
    meetingPoint: row.meeting_point ?? undefined,
    languages: row.languages ?? undefined,
    accessibility: row.accessibility ?? undefined,
    cancellationPolicy: row.cancellation_policy,
    hasTransfer: row.has_transfer,
    trackable: row.trackable,
    destinos: row.destinos ?? [],
  };
}

export async function getAllTours(): Promise<Tour[]> {
  const { data, error } = await supabasePublic
    .from("tours")
    .select(TOUR_COLUMNS)
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getAllTours:", error.message);
    return [];
  }
  return (data as unknown as TourRow[]).map(mapRow);
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  const { data, error } = await supabasePublic
    .from("tours")
    .select(TOUR_COLUMNS)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) return null;
  return mapRow(data as unknown as TourRow);
}
