"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { tours, categoryLabel, categoryColor, Tour } from "@/data/tours";

const CATEGORIES = ["nautico", "terrestre", "aventura", "cultural", "noturno"] as const;

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const destino = searchParams.get("destino") ?? "";
  const adultos = Number(searchParams.get("adultos") ?? 1);
  const criancas = Number(searchParams.get("criancas") ?? 0);

  const [catFilter, setCatFilter] = useState<string>("todos");
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [sortBy, setSortBy] = useState<"relevance" | "price_asc" | "price_desc">("relevance");

  const filtered = useMemo(() => {
    let result = [...tours];
    if (catFilter !== "todos") result = result.filter((t) => t.category === catFilter);
    result = result.filter((t) => t.price <= maxPrice);
    if (sortBy === "price_asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") result.sort((a, b) => b.price - a.price);
    if (sortBy === "relevance") result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return result;
  }, [catFilter, maxPrice, sortBy]);

  const destinoLabel = destino
    ? tours[0]?.operator?.name ?? "Porto Seguro"
    : "Porto Seguro";

  return (
    <div className="min-h-screen bg-white">
      {/* ── Header barra ── */}
      <div className="sticky top-14 z-30 bg-white border-b border-gray-100 px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#111] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Voltar
          </button>
          <div className="h-4 w-px bg-gray-200" />
          <p className="text-sm text-[#111]">
            <span className="font-semibold">{filtered.length} passeios</span>{" "}
            {destino ? `em ${destinoLabel}` : "disponíveis"}
            {adultos > 0 && ` • ${adultos} adulto${adultos > 1 ? "s" : ""}${criancas > 0 ? `, ${criancas} criança${criancas > 1 ? "s" : ""}` : ""}`}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-16 pb-12 flex flex-col lg:flex-row gap-8">

        {/* ── Filtros sidebar desktop ── */}
        <aside className="hidden lg:block w-60 flex-shrink-0">
          <div className="sticky top-32">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Categoria</p>
            <div className="space-y-1 mb-6">
              <FilterBtn active={catFilter === "todos"} onClick={() => setCatFilter("todos")}>
                Todos os passeios
              </FilterBtn>
              {CATEGORIES.map((c) => (
                <FilterBtn key={c} active={catFilter === c} onClick={() => setCatFilter(c)}>
                  {categoryLabel[c]}
                </FilterBtn>
              ))}
            </div>

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Preço máximo</p>
            <div className="mb-6">
              <input
                type="range" min={50} max={500} step={10} value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#111]"
              />
              <p className="text-sm text-[#111] mt-1 font-medium">Até R${maxPrice}</p>
            </div>

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Ordenar por</p>
            <div className="space-y-1">
              <FilterBtn active={sortBy === "relevance"} onClick={() => setSortBy("relevance")}>Mais relevantes</FilterBtn>
              <FilterBtn active={sortBy === "price_asc"} onClick={() => setSortBy("price_asc")}>Menor preço</FilterBtn>
              <FilterBtn active={sortBy === "price_desc"} onClick={() => setSortBy("price_desc")}>Maior preço</FilterBtn>
            </div>
          </div>
        </aside>

        {/* ── Filtros mobile (horizontal) ── */}
        <div className="lg:hidden w-full mb-6">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <MobileFilterChip active={catFilter === "todos"} onClick={() => setCatFilter("todos")}>Todos</MobileFilterChip>
            {CATEGORIES.map((c) => (
              <MobileFilterChip key={c} active={catFilter === c} onClick={() => setCatFilter(c)}>
                {categoryLabel[c]}
              </MobileFilterChip>
            ))}
          </div>
        </div>

        {/* ── Grid de resultados ── */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-xl font-semibold text-[#111] mb-2">Nenhum passeio encontrado</p>
              <p className="text-gray-400 mb-6">Tente ampliar os filtros ou outra categoria</p>
              <button
                onClick={() => { setCatFilter("todos"); setMaxPrice(500); }}
                className="text-sm font-semibold underline text-[#111]"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 scroll-mt-32">
              {filtered.map((tour) => (
                <TourResultCard key={tour.id} tour={tour} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TourResultCard({ tour }: { tour: Tour }) {
  const catColor = categoryColor[tour.category] ?? "#111";
  const catLabel = categoryLabel[tour.category] ?? tour.category;

  return (
    <Link href={`/passeios/${tour.slug}`} className="group block rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 bg-white">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {tour.badge && (
          <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white text-[#111] shadow-sm">
            {tour.badge}
          </span>
        )}
        <span
          className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full text-white"
          style={{ backgroundColor: catColor }}
        >
          {catLabel}
        </span>
      </div>
      <div className="p-4">
        <p className="font-semibold text-[#111] leading-snug mb-1">{tour.title}</p>
        <p className="text-xs text-gray-400 mb-3">{tour.subtitle}</p>
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span>⏱ {tour.duration}</span>
          {tour.schedule.frequency === "daily" && <span>📅 Todos os dias</span>}
          {tour.schedule.frequency === "specific_days" && tour.schedule.days && (
            <span>📅 {tour.schedule.days}</span>
          )}
          {tour.schedule.frequency === "tide_based" && <span>🌊 Tábua de marés</span>}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400">A partir de </span>
            <span className="text-lg font-bold text-[#111]">R${tour.price}</span>
            <span className="text-xs text-gray-400"> /pessoa</span>
          </div>
          <span className="text-xs font-semibold text-[#111] bg-gray-100 px-3 py-1.5 rounded-full group-hover:bg-[#111] group-hover:text-white transition-colors">
            Ver →
          </span>
        </div>
      </div>
    </Link>
  );
}

function FilterBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${
        active ? "bg-[#111] text-white font-semibold" : "text-[#444] hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

function MobileFilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 text-sm px-4 py-2 rounded-full border transition-colors whitespace-nowrap ${
        active ? "bg-[#111] text-white border-[#111]" : "text-[#444] border-gray-200 hover:border-gray-400"
      }`}
    >
      {children}
    </button>
  );
}

export default function BuscarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Carregando...</div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
