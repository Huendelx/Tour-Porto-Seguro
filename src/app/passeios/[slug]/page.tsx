import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { tours, categoryLabel, categoryColor } from "@/data/tours";
import WhatsAppBooking from "@/components/WhatsAppBooking";

export async function generateStaticParams() {
  return tours.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tour = tours.find((t) => t.slug === slug);
  if (!tour) return { title: "Passeio não encontrado" };
  return {
    title: `${tour.title} — Passeador`,
    description: tour.subtitle + " — " + tour.description.slice(0, 120) + "...",
    openGraph: {
      title: tour.title,
      description: tour.subtitle,
      images: [tour.image],
    },
  };
}

export default async function PasSeioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = tours.find((t) => t.slug === slug);
  if (!tour) notFound();

  const related = tours.filter((t) => t.slug !== slug && t.category === tour.category).slice(0, 3);
  const catColor = categoryColor[tour.category] ?? "#111";
  const catLabel = categoryLabel[tour.category] ?? tour.category;

  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero image ── */}
      <div className="relative w-full h-[55vw] max-h-[520px] min-h-[260px] bg-gray-100">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            {tour.badge && (
              <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-white text-[#111] mb-3">
                {tour.badge}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              {tour.title}
            </h1>
            <p className="text-white/80 mt-2 text-base md:text-lg">{tour.subtitle}</p>
          </div>
        </div>
      </div>

      {/* ── Content + Sidebar ── */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 flex flex-col lg:flex-row gap-12">

        {/* ── Left — content ── */}
        <div className="flex-1 min-w-0">

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span
              className="text-xs font-semibold px-3 py-1.5 rounded-full text-white"
              style={{ backgroundColor: catColor }}
            >
              {catLabel}
            </span>
            <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-600">
              {tour.duration}
            </span>
            <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-600">
              {tour.groupSize}
            </span>
            {tour.schedule.frequency === "specific_days" && tour.schedule.days && (
              <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                {tour.schedule.days}
              </span>
            )}
            {tour.schedule.frequency === "daily" && (
              <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                Todos os dias
              </span>
            )}
          </div>

          {/* Horário */}
          {(tour.schedule.departureStart || tour.schedule.notes) && (
            <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-100">
              <p className="text-sm font-semibold text-blue-900 mb-1">Horários</p>
              {tour.schedule.departureStart && (
                <p className="text-sm text-blue-800">
                  Saída: <strong>{tour.schedule.departureStart}
                  {tour.schedule.departureEnd && ` – ${tour.schedule.departureEnd}`}</strong>
                  {tour.schedule.returnTime && <> • Retorno: <strong>{tour.schedule.returnTime}</strong></>}
                </p>
              )}
              {tour.schedule.notes && (
                <p className="text-sm text-blue-700 mt-1">{tour.schedule.notes}</p>
              )}
            </div>
          )}

          {/* Descrição */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#111] mb-3">Sobre o passeio</h2>
            <p className="text-[#444] leading-relaxed text-[15px]">{tour.description}</p>
          </section>

          {/* Destaques */}
          {tour.highlights.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#111] mb-3">Destaques</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {tour.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-[15px] text-[#444]">
                    <span className="mt-0.5 text-green-600 flex-shrink-0">✓</span>
                    {h}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* O que inclui */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#111] mb-3">O que está incluso</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {tour.includes.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[15px] text-[#333]">
                  <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs flex-shrink-0">✓</span>
                  {item}
                </div>
              ))}
              {tour.excludes.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[15px] text-[#999]">
                  <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs flex-shrink-0">✕</span>
                  {item}
                </div>
              ))}
            </div>
          </section>

          {/* Dicas */}
          {tour.tips && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#111] mb-3">Dicas para o passeio</h2>
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100">
                <p className="text-[#666] leading-relaxed text-[15px]">{tour.tips}</p>
              </div>
            </section>
          )}

          {/* Informações importantes */}
          {tour.importantInfo && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#111] mb-3">Informações importantes</h2>
              <p className="text-[#666] leading-relaxed text-[15px]">{tour.importantInfo}</p>
            </section>
          )}

          {/* Preços detalhados */}
          {tour.prices.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#111] mb-3">Tarifas</h2>
              <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
                {tour.prices.map((p, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="text-[15px] font-medium text-[#111]">{p.label}</p>
                      {p.notes && <p className="text-xs text-amber-600 mt-0.5">{p.notes}</p>}
                    </div>
                    <div className="text-right">
                      {p.isFree ? (
                        <span className="text-green-600 font-semibold text-[15px]">Grátis</span>
                      ) : (
                        <span className="text-[15px] font-semibold text-[#111]">
                          R${p.priceMin}
                          {p.priceMax > p.priceMin && <span className="text-gray-400 font-normal"> – R${p.priceMax}</span>}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Tarifário vigente a partir de 04/05/2026. Preços em R$ por pessoa.
              </p>
            </section>
          )}

          {/* Política de cancelamento */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#111] mb-3">Política de cancelamento</h2>
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
              {tour.cancellationPolicy.split("\n").map((line, i) => (
                <p key={i} className="text-[#666] text-[14px] leading-relaxed">{line}</p>
              ))}
            </div>
          </section>

          {/* Operador */}
          <section className="mb-8 p-5 rounded-2xl border border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Operador responsável</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#006994] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {tour.operator.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-[#111] text-[15px]">{tour.operator.name}</p>
                <p className="text-sm text-gray-500">{tour.operator.years} anos de experiência</p>
                {tour.operator.cadastur && (
                  <p className="text-xs text-gray-400 mt-0.5">CADASTUR #{tour.operator.cadastur}</p>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* ── Right — sticky booking card ── */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="lg:sticky lg:top-20">
            <WhatsAppBooking tour={tour} />
          </div>
        </div>
      </div>

      {/* ── Mobile booking bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-gray-400">A partir de</p>
          <p className="text-xl font-bold text-[#111]">R${tour.price}<span className="text-sm font-normal text-gray-400"> /pessoa</span></p>
        </div>
        <a
          href={`https://wa.me/${tour.operator.whatsapp}?text=${encodeURIComponent(`Olá! Tenho interesse no passeio "${tour.title}". Pode me passar mais informações?`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 max-w-[200px] bg-[#25D366] text-white font-semibold text-sm rounded-full py-3 text-center"
        >
          Reservar pelo WhatsApp
        </a>
      </div>
      <div className="lg:hidden h-20" />

      {/* ── Passeios relacionados ── */}
      {related.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
          <h2 className="text-xl font-bold text-[#111] mb-6">Você também pode gostar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((t) => (
              <Link key={t.id} href={`/passeios/${t.slug}`} className="group block rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                <div className="relative h-44">
                  <Image src={t.image} alt={t.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <p className="font-semibold text-[#111] text-[15px] leading-snug">{t.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{t.subtitle}</p>
                  <p className="text-sm font-bold text-[#111] mt-2">A partir de R${t.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
