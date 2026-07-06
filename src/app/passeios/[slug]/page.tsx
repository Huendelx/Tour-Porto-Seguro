import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Star, Lightbulb, AlertCircle, CalendarX, BadgeCheck, Clock, Users, CalendarDays, Waves, MapPin, Share, Heart } from "lucide-react";
import { tours, categoryLabel } from "@/data/tours";
import WhatsAppBooking from "@/components/WhatsAppBooking";
import SetHeaderTitle from "@/components/SetHeaderTitle";
import TourItinerary from "@/components/TourItinerary";

const DESTINO_LABELS: Record<string, string> = {
  "porto-seguro": "Porto Seguro",
  "arraial": "Arraial d'Ajuda",
  "trancoso": "Trancoso",
  "caraiva": "Caraíva",
  "praia-espelho": "Praia do Espelho",
};

export async function generateStaticParams() {
  return tours.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tour = tours.find((t) => t.slug === slug);
  if (!tour) return { title: "Passeio não encontrado" };
  return {
    title: `${tour.title} — Passeador`,
    description: tour.summary ?? tour.subtitle + " — " + tour.description.slice(0, 120) + "...",
    openGraph: {
      title: tour.title,
      description: tour.summary ?? tour.subtitle,
      images: [tour.image],
    },
  };
}

function FactRow({ icon, title, sub }: { icon: React.ReactNode; title: string; sub?: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="text-[#111] mt-0.5 flex-shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="font-semibold text-[#111] text-[15px] leading-snug">{title}</p>
        {sub && <p className="text-gray-500 text-[13px] mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default async function PasSeioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = tours.find((t) => t.slug === slug);
  if (!tour) notFound();

  const related = tours.filter((t) => t.slug !== slug && t.category === tour.category).slice(0, 3);
  const catLabel = categoryLabel[tour.category] ?? tour.category;
  const destinoLabel = DESTINO_LABELS[tour.destinos[0]] ?? "Porto Seguro";

  const gallery = [
    tour.image,
    ...(tour.images ?? []),
    ...(tour.itinerary?.map((s) => s.image).filter((img): img is string => Boolean(img)) ?? []),
  ].filter((img, i, arr) => arr.indexOf(img) === i);

  const waContato = `https://wa.me/${tour.operator.whatsapp}?text=${encodeURIComponent(`Olá! Tenho uma dúvida sobre o passeio "${tour.title}".`)}`;

  return (
    <main className="min-h-screen bg-white pt-14">
      <SetHeaderTitle title={`${tour.title} · ${catLabel}`} />

      {/* ── Hero: galeria à esquerda, título + fatos à direita ── */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 pt-6 md:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_390px] gap-8 lg:gap-[88px] items-start">

          {/* Galeria 2x2 */}
          <div>
            <div className="relative">
              <div className="hidden md:grid grid-cols-2 gap-2 rounded-2xl overflow-hidden">
                {gallery.slice(0, 4).map((img, i) => (
                  <div key={img} className="relative aspect-square bg-gray-100">
                    <Image
                      src={img}
                      alt={i === 0 ? tour.title : `${tour.title} — foto ${i + 1}`}
                      fill
                      priority={i === 0}
                      sizes="330px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="md:hidden relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                <Image src={gallery[0]} alt={tour.title} fill priority sizes="100vw" className="object-cover" />
              </div>

              {/* Pills sobre a galeria */}
              {tour.badge && (
                <span className="absolute top-4 left-4 text-[12px] font-semibold px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[#111] shadow-sm">
                  {tour.badge}
                </span>
              )}
              <span className="absolute top-4 right-4 flex items-center gap-1 text-[12px] font-semibold px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[#111] shadow-sm">
                <Star size={12} className="fill-[#111] text-[#111]" />
                4,9
                <span className="font-normal text-gray-500 hidden sm:inline">· avaliações verificadas</span>
              </span>
              <span className="absolute bottom-4 right-4 text-[12px] font-medium px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[#111] shadow-sm">
                {gallery.length} fotos
              </span>
            </div>

            {/* Legenda */}
            <p className="text-[13px] text-gray-400 mt-3 text-center">{tour.subtitle}</p>
          </div>

          {/* Título + fatos */}
          <div className="lg:pt-2">
            <div className="text-center">
              <h1 className="text-[26px] md:text-[32px] font-bold text-[#111] leading-tight">{tour.title}</h1>
              <p className="text-gray-500 mt-3 text-[15px] leading-relaxed">
                {tour.summary ?? tour.subtitle}
              </p>
              <p className="text-[13px] text-gray-500 mt-4">
                {destinoLabel} <span className="text-gray-300 mx-1">·</span> {catLabel}
              </p>

              <div className="flex items-center justify-center gap-6 mt-4">
                <button className="text-[#111] hover:text-gray-500 transition-colors" aria-label="Compartilhar">
                  <Share size={18} strokeWidth={1.75} />
                </button>
                <button className="text-[#111] hover:text-gray-500 transition-colors" aria-label="Salvar">
                  <Heart size={18} strokeWidth={1.75} />
                </button>
              </div>
            </div>

            <div className="border-t border-gray-100 mt-6 pt-6 flex flex-col gap-5">
              <FactRow
                icon={
                  <span className="w-10 h-10 rounded-full bg-[#111] text-white flex items-center justify-center text-[15px] font-bold">
                    {tour.operator.name.charAt(0)}
                  </span>
                }
                title={`Oferecido por ${tour.operator.name}`}
                sub={`${tour.operator.years} anos de experiência na região`}
              />
              <FactRow
                icon={<MapPin size={24} strokeWidth={1.5} />}
                title={destinoLabel}
                sub="Costa do Descobrimento, Bahia"
              />
              <FactRow
                icon={<Clock size={24} strokeWidth={1.5} />}
                title={tour.duration}
                sub={
                  tour.schedule.departureStart
                    ? `Saída ${tour.schedule.departureStart}${tour.schedule.departureEnd ? `–${tour.schedule.departureEnd}` : ""}${tour.schedule.returnTime ? ` · Retorno ${tour.schedule.returnTime}` : ""}`
                    : undefined
                }
              />
              <FactRow
                icon={
                  tour.schedule.frequency === "tide_based"
                    ? <Waves size={24} strokeWidth={1.5} />
                    : <CalendarDays size={24} strokeWidth={1.5} />
                }
                title={
                  tour.schedule.frequency === "daily"
                    ? "Todos os dias"
                    : tour.schedule.frequency === "specific_days"
                      ? tour.schedule.days ?? ""
                      : "Conforme a tábua de marés"
                }
                sub={
                  tour.schedule.frequency === "tide_based"
                    ? "O horário exato é confirmado na reserva"
                    : `${tour.groupSize} · ${tour.transportType}`
                }
              />
              <FactRow
                icon={<BadgeCheck size={24} strokeWidth={1.5} className="text-[#2d7d46]" />}
                title="Operador verificado"
                sub="Curadoria Passeador — todos os operadores passam por verificação"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Conteúdo em duas colunas + card flutuante ── */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 pt-12 pb-4 flex flex-col lg:flex-row gap-[88px]">

        {/* ── Esquerda ── */}
        <div className="flex-1 min-w-0">

          {/* Sobre */}
          <section className="pb-10 mb-10 border-b border-gray-100">
            <h2 className="text-[22px] font-bold text-[#111] mb-4">Sobre o passeio</h2>
            <p className="text-[#444] leading-relaxed text-[15px]">{tour.description}</p>
          </section>

          {/* Roteiro */}
          {tour.itinerary && <TourItinerary steps={tour.itinerary} />}

          {/* O que inclui */}
          <section className="pb-10 mb-10 border-b border-gray-100">
            <h2 className="text-[22px] font-bold text-[#111] mb-4">O que está incluso</h2>
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

          {/* Onde vamos nos encontrar */}
          <section className="pb-10 mb-10 border-b border-gray-100">
            <h2 className="text-[22px] font-bold text-[#111] mb-4">Onde vamos nos encontrar</h2>
            <p className="text-[15px] font-medium text-[#111]">
              {tour.meetingPoint ?? "Busca no seu hotel ou pousada incluída no passeio"}
            </p>
            <p className="text-[14px] text-gray-500 mt-0.5 mb-4">{destinoLabel}, Bahia, Brasil</p>
            <div className="relative h-[280px] md:h-[320px] rounded-2xl overflow-hidden bg-[#eef0eb]">
              {/* Placeholder do mapa */}
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(#dde2d8 1px, transparent 1px), linear-gradient(90deg, #dde2d8 1px, transparent 1px)",
                  backgroundSize: "48px 48px",
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <span className="w-12 h-12 rounded-full bg-[#111] flex items-center justify-center shadow-lg">
                  <MapPin size={22} strokeWidth={2} className="text-white" />
                </span>
                <p className="text-[14px] font-semibold text-[#111]">Ponto de encontro</p>
                <p className="text-[12px] text-gray-500">Mapa interativo em breve</p>
              </div>
            </div>
          </section>

          {/* Perfil do operador */}
          <section className="mb-4">
            <h2 className="text-[22px] font-bold text-[#111] mb-6">Sobre o operador</h2>
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-start">
              <div>
                <div className="rounded-3xl border border-gray-100 p-8 text-center" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                  <div className="w-20 h-20 rounded-full bg-[#111] text-white flex items-center justify-center text-3xl font-bold mx-auto">
                    {tour.operator.name.charAt(0)}
                  </div>
                  <p className="font-bold text-[#111] text-lg mt-4 leading-snug">{tour.operator.name}</p>
                  <p className="text-[13px] text-gray-500 mt-1">Operador local · {tour.operator.years} anos de experiência</p>
                  <div className="flex items-center justify-center gap-1.5 mt-3 text-[12px] text-[#2d7d46] font-medium">
                    <BadgeCheck size={15} strokeWidth={2} />
                    Verificado pelo Passeador
                  </div>
                  {tour.operator.cadastur && (
                    <p className="text-[11px] text-gray-400 mt-1">CADASTUR #{tour.operator.cadastur}</p>
                  )}
                </div>
                <a
                  href={waContato}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full mt-3 py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors text-center text-[14px] font-semibold text-[#111]"
                >
                  Falar com {tour.operator.name.split(" ")[0]} {tour.operator.name.split(" ")[1] ?? ""}
                </a>
                <p className="text-[12px] text-gray-400 text-center mt-3 leading-relaxed px-2">
                  Para sua segurança, combine os detalhes da reserva sempre pelos canais do Passeador.
                </p>
              </div>
              <p className="text-[#444] leading-relaxed text-[15px]">
                {tour.operator.bio ?? `${tour.operator.name} opera passeios na região há ${tour.operator.years} anos, com guias credenciados CADASTUR.`}
              </p>
            </div>
          </section>
        </div>

        {/* ── Direita — card flutuante ── */}
        <div className="lg:w-[390px] flex-shrink-0">
          <div className="lg:sticky lg:top-20">
            <WhatsAppBooking tour={tour} />
          </div>
        </div>
      </div>

      {/* ── O que você precisa saber — coluna inteira ── */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <section className="border-t border-gray-100 pt-12 pb-4 mb-8">
          <h2 className="text-[22px] font-bold text-[#111] mb-8">O que você precisa saber</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
            {tour.tips && (
              <div>
                <Lightbulb size={24} strokeWidth={1.5} className="text-[#111] mb-3" />
                <p className="font-semibold text-[#111] text-[15px] mb-1.5">Dicas para o passeio</p>
                <p className="text-[#666] text-[14px] leading-relaxed">{tour.tips}</p>
              </div>
            )}
            {tour.importantInfo && (
              <div>
                <AlertCircle size={24} strokeWidth={1.5} className="text-[#111] mb-3" />
                <p className="font-semibold text-[#111] text-[15px] mb-1.5">Informações importantes</p>
                <p className="text-[#666] text-[14px] leading-relaxed">{tour.importantInfo}</p>
              </div>
            )}
            <div>
              <CalendarX size={24} strokeWidth={1.5} className="text-[#111] mb-3" />
              <p className="font-semibold text-[#111] text-[15px] mb-1.5">Política de cancelamento</p>
              {tour.cancellationPolicy.split("\n").map((line, i) => (
                <p key={i} className="text-[#666] text-[14px] leading-relaxed">{line}</p>
              ))}
            </div>
          </div>
        </section>
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
          className="flex-1 max-w-[200px] bg-[#111] text-white font-semibold text-sm rounded-full py-3 text-center"
        >
          Reservar
        </a>
      </div>
      <div className="lg:hidden h-20" />

      {/* ── Passeios relacionados ── */}
      {related.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-4 md:px-6 pb-16">
          <h2 className="text-[22px] font-bold text-[#111] mb-6">Você também pode gostar</h2>
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
