"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { slugify } from "@/lib/slugify";

async function requireOperadorProfile() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/entrar");
  if (profile.role !== "operador") redirect("/minha-conta");
  return profile;
}

/** Empresa do operador logado — null se ainda não cadastrou. */
export async function getMyOperator() {
  const profile = await requireOperadorProfile();
  const { data } = await supabaseAdmin
    .from("operators")
    .select("*")
    .eq("owner_id", profile.id)
    .maybeSingle();
  return data;
}

export async function createOperatorCompany(formData: FormData) {
  const profile = await requireOperadorProfile();

  const name = String(formData.get("name") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").replace(/\D/g, "");
  const bio = String(formData.get("bio") ?? "").trim();
  const yearsExperience = Number(formData.get("years_experience") ?? 0) || 0;

  if (!name || !whatsapp) throw new Error("Nome e WhatsApp são obrigatórios");

  const { error } = await supabaseAdmin.from("operators").insert({
    owner_id: profile.id,
    name,
    whatsapp,
    bio: bio || null,
    years_experience: yearsExperience,
    verified: false, // curadoria manual por enquanto (Huendel aprova)
  });

  if (error) throw new Error(error.message);
  revalidatePath("/operador");
}

async function getOwnedOperatorId(profileId: string): Promise<string> {
  const { data } = await supabaseAdmin
    .from("operators")
    .select("id")
    .eq("owner_id", profileId)
    .single();
  if (!data) throw new Error("Empresa não encontrada");
  return data.id;
}

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || "passeio";
  let candidate = root;
  let n = 2;
  for (;;) {
    let query = supabaseAdmin.from("tours").select("id").eq("slug", candidate);
    if (ignoreId) query = query.neq("id", ignoreId);
    const { data } = await query.maybeSingle();
    if (!data) return candidate;
    candidate = `${root}-${n++}`;
  }
}

function linesToArray(raw: FormDataEntryValue | null): string[] {
  return String(raw ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

type ItineraryStepInput = { time?: string; title: string; description: string };

function buildTourRow(formData: FormData, operatorId: string, slug: string) {
  const price = Number(formData.get("price") ?? 0);
  const priceMaxRaw = formData.get("price_max");
  const priceMax = priceMaxRaw ? Number(priceMaxRaw) : null;

  const itinerary: ItineraryStepInput[] = JSON.parse(String(formData.get("itinerary_json") ?? "[]"));

  const frequency = String(formData.get("frequency") ?? "daily");
  const schedule: Record<string, string> = { frequency };
  const days = String(formData.get("days") ?? "").trim();
  const departureStart = String(formData.get("departureStart") ?? "").trim();
  const departureEnd = String(formData.get("departureEnd") ?? "").trim();
  const returnTime = String(formData.get("returnTime") ?? "").trim();
  if (days) schedule.days = days;
  if (departureStart) schedule.departureStart = departureStart;
  if (departureEnd) schedule.departureEnd = departureEnd;
  if (returnTime) schedule.returnTime = returnTime;

  return {
    operator_id: operatorId,
    slug,
    title: String(formData.get("title") ?? "").trim(),
    subtitle: String(formData.get("subtitle") ?? "").trim() || null,
    summary: String(formData.get("summary") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim(),
    tips: String(formData.get("tips") ?? "").trim() || null,
    important_info: String(formData.get("important_info") ?? "").trim() || null,
    category: String(formData.get("category") ?? "terrestre"),
    transport_type: String(formData.get("transport_type") ?? "").trim(),
    duration: String(formData.get("duration") ?? "").trim(),
    duration_minutes: Number(formData.get("duration_minutes") ?? 0) || null,
    group_size: String(formData.get("group_size") ?? "").trim(),
    price,
    price_max: priceMax,
    price_unit: "por pessoa",
    prices: [{ label: "Adulto", category: "adult", priceMin: price, priceMax: priceMax ?? price }],
    includes: linesToArray(formData.get("includes")),
    excludes: linesToArray(formData.get("excludes")),
    image: String(formData.get("image") ?? "").trim(),
    images: linesToArray(formData.get("images")),
    meeting_point: String(formData.get("meeting_point") ?? "").trim() || null,
    cancellation_policy: String(formData.get("cancellation_policy") ?? "").trim(),
    schedule,
    itinerary,
    is_active: formData.get("is_active") === "on",
  };
}

export async function createTour(formData: FormData) {
  const profile = await requireOperadorProfile();
  const operatorId = await getOwnedOperatorId(profile.id);
  const slug = await uniqueSlug(String(formData.get("title") ?? ""));

  const row = buildTourRow(formData, operatorId, slug);
  const { error } = await supabaseAdmin.from("tours").insert(row);
  if (error) throw new Error(error.message);

  revalidatePath("/operador");
  redirect("/operador");
}

export async function updateTour(tourId: string, formData: FormData) {
  const profile = await requireOperadorProfile();
  const operatorId = await getOwnedOperatorId(profile.id);

  // dono de verdade — nunca confia em tourId vindo do form sem checar posse
  const { data: existing } = await supabaseAdmin
    .from("tours")
    .select("id, operator_id, slug, title")
    .eq("id", tourId)
    .single();
  if (!existing || existing.operator_id !== operatorId) throw new Error("Passeio não encontrado");

  const newTitle = String(formData.get("title") ?? "").trim();
  const slug = newTitle !== existing.title ? await uniqueSlug(newTitle, tourId) : existing.slug;

  const row = buildTourRow(formData, operatorId, slug);
  const { error } = await supabaseAdmin
    .from("tours")
    .update({ ...row, updated_at: new Date().toISOString() })
    .eq("id", tourId);
  if (error) throw new Error(error.message);

  revalidatePath("/operador");
  redirect("/operador");
}

export async function toggleTourActive(tourId: string, isActive: boolean) {
  const profile = await requireOperadorProfile();
  const operatorId = await getOwnedOperatorId(profile.id);

  const { data: existing } = await supabaseAdmin
    .from("tours")
    .select("operator_id")
    .eq("id", tourId)
    .single();
  if (!existing || existing.operator_id !== operatorId) throw new Error("Passeio não encontrado");

  const { error } = await supabaseAdmin
    .from("tours")
    .update({ is_active: isActive })
    .eq("id", tourId);
  if (error) throw new Error(error.message);

  revalidatePath("/operador");
}
