"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Anchor, Car, Mountain, Landmark, Moon, LayoutGrid, Star, ArrowDownNarrowWide, ArrowUpNarrowWide, SlidersHorizontal, X } from "lucide-react";
import { tours, categoryLabel, categoryColor, Tour } from "@/data/tours";

const CATEGORIES = ["nautico", "terrestre", "aventura", "cultural", "noturno"] as const;

const categoryIcon: Record<string, React.ReactNode> = {
  nautico:   <Anchor    size={14} strokeWidth={1.75} />,
  terrestre: <Car       size={14} strokeWidth={1.75} />,
  aventura:  <Mountain  size={14} strokeWidth={1.75} />,
  cultural:  <Landmark  size={14} strokeWidth={1.75} />,
  noturno:   <Moon      size={14} strokeWidth={1.75} />,
};

const DESTINO_LABELS: Record<string, string> = {
  "porto-seguro":  "Porto Seguro",
  "arraial":       "Arraial d'Ajuda",
  "trancoso":      "Trancoso",
  "caraiva":       "Caraíva",
  "praia-espelho": "Praia do Espelho",
  "perto":         "Perto de você",
};

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const destino  = searchParams.get("destino") ?? "";
  const adultos  = Number(searchParams.get("adultos")  ?? 1);
  const criancas = Number(searchParams.get("criancas") ?? 0);

  const [catFilter, setCatFilter] = useState<string>("todos");
  const [maxPrice, setMaxPrice]   = useState<number>(500);
  const [sortBy, setSortBy]       = useState<"relevance" | "price_asc" | "price_desc">("relevance");
  const [filterOpen, setFilterOpen] = useState(false);

  // temp state inside drawer so user can cancel
  const [draftPrice, setDraftPrice]   = useState(maxPrice);
  const [draftSort,  setDraftSort]    = useState(sortBy);

  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filterOpen) return;
    setDraftPrice(maxPrice);
    setDraftSort(sortBy);
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [filterOpen, maxPrice, sortBy]);

  const filtered = useMemo(() => {
    let result = [...tours];
    if (destino && destino !== "perto") result = result.filter((t) => t.destinos.includes(destino));
    if (catFilter !== "todos") result = result.filter((t) => t.category === catFilter);
    result = result.filter((t) => t.price <= maxPrice);
    if (sortBy === "price_asc")  result.sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") result.sort((a, b) => b.price - a.price);
    if (sortBy === "relevance")  result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return result;
  }, [destino, catFilter, maxPrice, sortBy]);

  const destinoLabel = DESTINO_LABELS[destino] ?? "";
  const hasActiveFilters = maxPrice < 500 || sortBy !== "relevance";
  const activeFilterCount = (maxPrice < 500 ? 1 : 0) + (sortBy !== "relevance" ? 1 : 0);

  const applyFilters = () => {
    setMaxPrice(draftPrice);
    setSortBy(draftSort);
    setFilterOpen(false);
  };

  const clearFilters = () => {
    setMaxPrice(500);
    setSortBy("relevance");
    setDraftPrice(500);
    setDraftSort("relevance");
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ── Barra de filtros ── */}
      <div className="sticky top-14 z-30 bg-white border-b border-gray-100">
        <div className="px-4 md:px-6 py-3 flex items-center justify-center gap-2 overflow-x-auto scrollbar-hide">

          {/* Pills de categoria */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Pill active={catFilter === "todos"} onClick={() => setCatFilter("todos")} icon={<LayoutGrid size={14} strokeWidth={1.75} />}>
              Todos
            </Pill>
            {CATEGORIES.map((c) => (
              <Pill key={c} active={catFilter === c} onClick={() => setCatFilter(c)} icon={categoryIcon[c]}>
                {categoryLabel[c]}
              </Pill>
            ))}
          </div>

          {/* Separador */}
          <div className="w-px h-6 bg-gray-200 flex-shrink-0" />

          {/* Botão Filtros */}
          <button
            onClick={() => setFilterOpen(true)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors whitespace-nowrap ${
              hasActiveFilters
                ? "bg-[#111] text-white border-[#111]"
                : "text-[#444] border-gray-200 hover:border-gray-400 bg-white"
            }`}
          >
            <SlidersHorizontal size={14} strokeWidth={2} />
            Filtros
            {activeFilterCount > 0 && (
              <span className={`text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center ${hasActiveFilters ? "bg-white text-[#111]" : "bg-[#111] text-white"}`}>
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Linha de contexto */}
        {(destinoLabel || adultos > 1 || criancas > 0) && (
          <div className="px-4 md:px-6 pb-2 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400">
              <span className="font-semibold text-[#111]">{filtered.length} passeios</span>
              {destinoLabel && ` em ${destinoLabel}`}
              {adultos > 1 && ` · ${adultos} adultos`}
              {criancas > 0 && ` · ${criancas} criança${criancas > 1 ? "s" : ""}`}
            </span>
          </div>
        )}
      </div>

      {/* ── Grid ── */}
      <div className="px-4 md:px-6 pt-6 pb-12">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-xl font-semibold text-[#111] mb-2">Nenhum passeio encontrado</p>
            <p className="text-gray-400 mb-6">Tente ampliar os filtros ou outra categoria</p>
            <button
              onClick={() => { setCatFilter("todos"); clearFilters(); }}
              className="text-sm font-semibold underline text-[#111]"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((tour) => (
              <TourResultCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
      </div>

      {/* ── Drawer de filtros ── */}
      {filterOpen && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" onClick={() => setFilterOpen(false)} />

          {/* Drawer */}
          <div
            ref={drawerRef}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col"
            style={{ animation: "slideInRight 0.22s ease" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-[#111]">Filtros</h2>
              <button onClick={() => setFilterOpen(false)} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                <X size={18} color="#666" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

              {/* Ordenar por */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Ordenar por</p>
                <div className="space-y-2">
                  {[
                    { value: "relevance" as const,  label: "Mais relevantes", icon: <Star size={15} strokeWidth={1.75} /> },
                    { value: "price_asc" as const,  label: "Menor preço",     icon: <ArrowDownNarrowWide size={15} strokeWidth={1.75} /> },
                    { value: "price_desc" as const, label: "Maior preço",     icon: <ArrowUpNarrowWide size={15} strokeWidth={1.75} /> },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setDraftSort(opt.value)}
                      className={`w-full text-left text-sm px-4 py-3 rounded-xl transition-colors flex items-center gap-3 border ${
                        draftSort === opt.value
                          ? "bg-[#111] text-white border-[#111] font-semibold"
                          : "text-[#444] border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="opacity-70">{opt.icon}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preço máximo */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Preço máximo</p>
                  <span className="text-sm font-semibold text-[#111]">R${draftPrice}</span>
                </div>
                <input
                  type="range" min={50} max={500} step={10} value={draftPrice}
                  onChange={(e) => setDraftPrice(Number(e.target.value))}
                  className="w-full"
                  style={{ accentColor: "#111", cursor: "pointer" }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>R$50</span>
                  <span>R$500+</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-gray-100 flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-[#444] hover:border-gray-400 transition-colors"
              >
                Limpar
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 px-4 py-3 rounded-xl bg-[#111] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Aplicar
              </button>
            </div>
          </div>

          <style>{`@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
        </>
      )}
    </div>
  );
}

function Pill({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-colors whitespace-nowrap ${
        active ? "bg-[#111] text-white border-[#111]" : "text-[#444] border-gray-200 hover:border-gray-400 bg-white"
      }`}
    >
      {icon && <span className="opacity-80">{icon}</span>}
      {children}
    </button>
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
        <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: catColor }}>
          {catLabel}
        </span>
      </div>
      <div className="p-4">
        <p className="font-semibold text-[#111] leading-snug mb-1">{tour.title}</p>
        <p className="text-xs text-gray-400 mb-3">{tour.subtitle}</p>
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span>⏱ {tour.duration}</span>
          {tour.schedule.frequency === "daily" && <span>📅 Todos os dias</span>}
          {tour.schedule.frequency === "specific_days" && tour.schedule.days && <span>📅 {tour.schedule.days}</span>}
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
