/**
 * Semeia o operador piloto + os 15 passeios reais de src/data/tours.ts no Supabase.
 * Rodar uma vez, depois que schema.sql + grants.sql já rodaram no banco.
 *
 *   npx tsx scripts/seed-supabase.ts
 */
import { createClient } from "@supabase/supabase-js";
import { tours } from "../src/data/tours";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Faltam NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY no ambiente.");
  console.error("Roda com: set -a; source .env.local; set +a; npx tsx scripts/seed-supabase.ts");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function main() {
  const operator = tours[0].operator;

  console.log(`Criando operador: ${operator.name}...`);
  const { data: opRow, error: opError } = await supabase
    .from("operators")
    .insert({
      // owner_id fica nulo por enquanto — ninguém logou como esse operador ainda.
      // Preenchido na Fase 2 quando o operador criar a conta e a gente vincular.
      owner_id: null,
      name: operator.name,
      whatsapp: operator.whatsapp,
      cadastur: operator.cadastur ?? null,
      bio: operator.bio ?? null,
      years_experience: operator.years,
      verified: true,
    })
    .select()
    .single();

  if (opError) {
    console.error("Erro ao criar operador:", opError.message);
    process.exit(1);
  }
  console.log(`Operador criado: ${opRow.id}`);

  console.log(`Inserindo ${tours.length} passeios...`);
  const rows = tours.map((t) => ({
    operator_id: opRow.id,
    slug: t.slug,
    title: t.title,
    subtitle: t.subtitle,
    summary: t.summary ?? null,
    description: t.description,
    tips: t.tips ?? null,
    important_info: t.importantInfo ?? null,
    category: t.category,
    transport_type: t.transportType,
    duration: t.duration,
    duration_minutes: t.durationMinutes ?? null,
    distance_km: t.distanceKm ?? null,
    group_size: t.groupSize,
    price: t.price,
    price_max: t.priceMax ?? null,
    price_unit: t.priceUnit,
    includes: t.includes,
    excludes: t.excludes,
    image: t.image,
    images: t.images ?? [],
    badge: t.badge ?? null,
    featured: t.featured ?? false,
    meeting_point: t.meetingPoint ?? null,
    cancellation_policy: t.cancellationPolicy,
    has_transfer: t.hasTransfer ?? false,
    trackable: t.trackable ?? false,
    destinos: t.destinos,
    schedule: t.schedule,
    prices: t.prices,
    itinerary: t.itinerary ?? [],
    languages: t.languages ?? [],
    accessibility: t.accessibility ?? [],
    is_active: true,
  }));

  const { data: inserted, error: toursError } = await supabase
    .from("tours")
    .insert(rows)
    .select("slug");

  if (toursError) {
    console.error("Erro ao inserir passeios:", toursError.message);
    process.exit(1);
  }

  console.log(`${inserted.length} passeios inseridos:`);
  inserted.forEach((t) => console.log(`  - ${t.slug}`));
  console.log("Seed concluído.");
}

main();
