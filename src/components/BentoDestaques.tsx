import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { getAllTours } from "@/lib/tours-data";
import { categoryLabel } from "@/data/tours";
import type { Tour } from "@/lib/tours-data";

/**
 * Bento de escolhas — 1 capa grande à esquerda + 2 cards empilhados à
 * direita. Conteúdo real: passeios featured do catálogo (fallback:
 * primeiros do catálogo). A voz da seção é curadoria da casa.
 */

function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function Card({ tour, big = false, sizes }: { tour: Tour; big?: boolean; sizes: string }) {
  return (
    <Link
      href={`/passeios/${tour.slug}`}
      className="group relative block w-full h-full rounded-3xl overflow-hidden bg-gray-900"
    >
      <Image
        src={tour.image}
        alt={tour.title}
        fill
        sizes={sizes}
        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 pointer-events-none" />

      {/* Topo: duração real em pill */}
      <span className="absolute top-4 left-4 flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[#111]">
        <Clock size={12} strokeWidth={2} />
        {tour.duration}
      </span>

      {/* Base: eyebrow → título → (resumo) → preço/operador/CTA */}
      <div className={`absolute inset-x-0 bottom-0 ${big ? "p-6 md:p-8" : "p-5 md:p-6"}`}>
        <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-white/80">
          {categoryLabel[tour.category]}
        </span>
        <h3
          className={`text-white font-bold leading-[1.12] tracking-tight text-balance mt-1.5 ${
            big ? "text-[24px] md:text-[32px] max-w-[500px]" : "text-[17px] md:text-[20px] max-w-[400px]"
          }`}
        >
          {tour.title}
        </h3>

        {big && (tour.summary || tour.subtitle) && (
          <p className="text-[14px] text-white/85 leading-relaxed mt-3 max-w-[440px] line-clamp-2">
            {tour.summary ?? tour.subtitle}
          </p>
        )}

        <div className={`flex items-center justify-between gap-4 ${big ? "mt-5 md:mt-6" : "mt-3"}`}>
          <div className="flex items-center gap-2.5 min-w-0">
            {big && (
              <span className="w-7 h-7 rounded-full bg-white/20 border border-white/40 backdrop-blur-sm flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                {initials(tour.operator.name)}
              </span>
            )}
            <p className="text-[13px] text-white/85 truncate">
              {big && <span className="mr-2">{tour.operator.name} ·</span>}
              A partir de <span className="font-semibold text-white">R$ {tour.price}</span> /pessoa
            </p>
          </div>
          {big && (
            <span className="hidden md:inline-block bg-white text-[#111] text-[13px] font-semibold px-5 py-2.5 rounded-full group-hover:opacity-90 transition-opacity whitespace-nowrap">
              Ver passeio
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default async function BentoDestaques() {
  const tours = await getAllTours();
  const featured = tours.filter((t) => t.featured);
  const picks = [...featured, ...tours.filter((t) => !t.featured)].slice(0, 3);
  if (picks.length < 3) return null;

  const [big, topRight, bottomRight] = picks;

  return (
    <section className="bg-white pt-10 md:pt-14 pb-16 md:pb-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-8 md:mb-10">
          <h2 className="text-[26px] md:text-[32px] font-bold text-[#111] leading-tight">
            Escolhas do Passeador
          </h2>
          <p className="text-[14px] md:text-base text-[#666] mt-2 md:mt-3 max-w-lg leading-relaxed">
            As experiências que a gente indicaria pra um amigo que só tem poucos dias na região.
          </p>
        </div>

        {/* Desktop: bento 2x2 (capa ocupa a coluna inteira) */}
        <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-4 h-[640px]">
          <div className="row-span-2">
            <Card tour={big} big sizes="600px" />
          </div>
          <Card tour={topRight} sizes="600px" />
          <Card tour={bottomRight} sizes="600px" />
        </div>

        {/* Mobile: empilhado — capa maior, dois menores */}
        <div className="md:hidden flex flex-col gap-3">
          <div className="h-[340px]">
            <Card tour={big} big sizes="100vw" />
          </div>
          <div className="h-[200px]">
            <Card tour={topRight} sizes="100vw" />
          </div>
          <div className="h-[200px]">
            <Card tour={bottomRight} sizes="100vw" />
          </div>
        </div>
      </div>
    </section>
  );
}
