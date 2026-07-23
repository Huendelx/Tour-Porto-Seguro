"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { runsOn, fromISODate, toISODate, WEEKDAYS_SHORT } from "@/lib/schedule";
import {
  Anchor, Car, Mountain, Landmark, Moon, X, ChevronDown,
  Check, SlidersHorizontal, Star,
  ArrowDownNarrowWide, ArrowUpNarrowWide,
  Baby, UsersRound, User, Wine,
} from "lucide-react";
import { categoryLabel } from "@/data/tours";
import type { Tour } from "@/lib/tours-data";
import TourResultCard from "@/components/TourResultCard";

const CATEGORIES = ["nautico", "terrestre", "aventura", "cultural", "noturno"] as const;

const categoryIcon: Record<string, React.ReactNode> = {
  nautico:   <Anchor    size={15} strokeWidth={1.75} />,
  terrestre: <Car       size={15} strokeWidth={1.75} />,
  aventura:  <Mountain  size={15} strokeWidth={1.75} />,
  cultural:  <Landmark  size={15} strokeWidth={1.75} />,
  noturno:   <Moon      size={15} strokeWidth={1.75} />,
};

const DESTINO_LABELS: Record<string, string> = {
  "porto-seguro":  "Porto Seguro",
  "arraial":       "Arraial d'Ajuda",
  "trancoso":      "Trancoso",
  "caraiva":       "Caraíva",
  "praia-espelho": "Praia do Espelho",
  "perto":         "Perto de você",
};

type Horario = "manha" | "tarde" | "noite";

const HORARIO_OPTIONS: { value: Horario; label: string; sub: string }[] = [
  { value: "manha", label: "Manhã",           sub: "Antes das 12:00" },
  { value: "tarde", label: "Tarde",           sub: "Entre 12:00 e 17:00" },
  { value: "noite", label: "Início da noite", sub: "Depois das 17:00" },
];

// Preço — domínio do slider
const PRICE_MIN = 50;
const PRICE_MAX = 500; // 500 = "R$500+"
const PRICE_STEP = 10;

// Duração — paradas da régua (durações reais do catálogo: 2h15 a 9h30)
const DUR_STOPS = [
  { v: 120, label: "2h" },
  { v: 180, label: "3h" },
  { v: 240, label: "4h" },
  { v: 300, label: "5h" },
  { v: 360, label: "6h" },
  { v: 480, label: "8h" },
  { v: 600, label: "9h+" },
];

// Tipo de viajante — derivado de dados reais do catálogo
type Viajante = "criancas" | "grupos" | "solo" | "noite";

const VIAJANTE_OPTIONS: { value: Viajante; label: string; icon: React.ReactNode; match: (t: Tour) => boolean }[] = [
  { value: "criancas", label: "Crianças",                  icon: <Baby size={15} strokeWidth={1.75} />,       match: (t) => t.prices.some((p) => p.category === "child" || p.category === "infant") },
  { value: "grupos",   label: "Grupos grandes",            icon: <UsersRound size={15} strokeWidth={1.75} />, match: (t) => Number(t.groupSize.match(/\d+/)?.[0] ?? 0) >= 20 },
  { value: "solo",     label: "Viajantes desacompanhados", icon: <User size={15} strokeWidth={1.75} />,       match: () => true },
  { value: "noite",    label: "Noite de encontro",         icon: <Wine size={15} strokeWidth={1.75} />,       match: (t) => t.category === "noturno" },
];

// Idiomas — todo o catálogo atual é em Português; os demais entram via cadastro do operador
const LANGS_MAIN = ["Português", "Inglês", "Espanhol", "Francês"];
const LANGS_MORE = ["Alemão", "Italiano", "Japonês", "Mandarim"];

const ACCESS_GROUPS: { title: string; items: string[] }[] = [
  { title: "Mobilidade",                    items: ["Acesso sem degraus"] },
  { title: "Recursos auditivos e visuais",  items: ["Opções de língua de sinais", "Guia visual designado"] },
  { title: "Sensorial",                     items: ["Adaptado a sensibilidades sensoriais"] },
];

function tourBuckets(t: Tour): Horario[] {
  const dep = t.schedule.departureStart;
  if (dep) {
    const match = dep.match(/(\d+)h/);
    if (match) {
      const hour = Number(match[1]);
      if (hour < 12) return ["manha"];
      if (hour < 17) return ["tarde"];
      return ["noite"];
    }
  }
  const notes = t.schedule.notes ?? "";
  if (/manh/i.test(notes) && /tarde/i.test(notes)) return ["manha", "tarde"];
  return [];
}

/* ─── Slider de dois cursores (estilo Airbnb) ─── */
function DualSlider({
  domainMin, domainMax, step, value, onChange, segments = 0,
}: {
  domainMin: number;
  domainMax: number;
  step: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
  segments?: number; // > 0 desenha o trilho segmentado (régua de duração)
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<"min" | "max" | null>(null);

  const pct = (v: number) => ((v - domainMin) / (domainMax - domainMin)) * 100;

  const valueAt = useCallback((clientX: number) => {
    const rect = trackRef.current!.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return Math.round((domainMin + p * (domainMax - domainMin)) / step) * step;
  }, [domainMin, domainMax, step]);

  useEffect(() => {
    if (!drag) return;
    const move = (e: PointerEvent) => {
      const v = valueAt(e.clientX);
      if (drag === "min") onChange([Math.min(v, value[1]), value[1]]);
      else onChange([value[0], Math.max(v, value[0])]);
    };
    const up = () => setDrag(null);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [drag, value, onChange, valueAt]);

  const grabNearest = (e: React.PointerEvent) => {
    const v = valueAt(e.clientX);
    if (Math.abs(v - value[0]) <= Math.abs(v - value[1])) {
      onChange([Math.min(v, value[1]), value[1]]);
      setDrag("min");
    } else {
      onChange([value[0], Math.max(v, value[0])]);
      setDrag("max");
    }
  };

  return (
    <div
      ref={trackRef}
      onPointerDown={grabNearest}
      className="relative h-9 flex items-center select-none touch-none cursor-pointer"
    >
      {segments > 0 ? (
        <div className="absolute inset-x-0 flex items-center gap-2.5">
          {Array.from({ length: segments }).map((_, i) => (
            <div key={i} className="flex-1 h-[3px] rounded-full bg-[#222]" />
          ))}
        </div>
      ) : (
        <>
          <div className="absolute inset-x-0 h-[2px] rounded-full bg-gray-200" />
          <div
            className="absolute h-[2px] rounded-full bg-[#111]"
            style={{ left: `${pct(value[0])}%`, right: `${100 - pct(value[1])}%` }}
          />
        </>
      )}
      {([0, 1] as const).map((idx) => (
        <button
          key={idx}
          onPointerDown={(e) => { e.stopPropagation(); setDrag(idx === 0 ? "min" : "max"); }}
          className="absolute w-8 h-8 -ml-4 rounded-full bg-white cursor-grab active:cursor-grabbing z-10"
          style={{
            left: `${pct(value[idx])}%`,
            boxShadow: "0 1px 6px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.04)",
          }}
          aria-label={idx === 0 ? "Mínimo" : "Máximo"}
        />
      ))}
    </div>
  );
}

/* ─── Histograma de preços ─── */
function PriceHistogram({ range, tours }: { range: [number, number]; tours: Tour[] }) {
  const buckets = useMemo(() => {
    const N = 24;
    const arr = new Array(N).fill(0);
    tours.forEach((t) => {
      const i = Math.min(N - 1, Math.max(0, Math.floor(((t.price - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * N)));
      arr[i]++;
    });
    return arr;
  }, [tours]);
  const maxCount = Math.max(...buckets, 1);

  return (
    <div className="flex items-end gap-[3px] h-14 px-0.5">
      {buckets.map((c, i) => {
        const center = PRICE_MIN + ((i + 0.5) / buckets.length) * (PRICE_MAX - PRICE_MIN);
        const inRange = center >= range[0] && (range[1] >= PRICE_MAX || center <= range[1]);
        return (
          <div
            key={i}
            className="flex-1 rounded-t-[3px] transition-colors"
            style={{
              height: c > 0 ? `${Math.max(14, (c / maxCount) * 100)}%` : "2px",
              background: c > 0 ? (inRange ? "#111" : "#dddddd") : "#e8e8e8",
            }}
          />
        );
      })}
    </div>
  );
}

/* ─── Checkboxes de horário (estilo Airbnb) ─── */
function HorarioChecks({ horario, onToggle }: { horario: Horario[]; onToggle: (v: Horario) => void }) {
  return (
    <div className="space-y-5">
      {HORARIO_OPTIONS.map((opt) => {
        const checked = horario.includes(opt.value);
        return (
          <button key={opt.value} onClick={() => onToggle(opt.value)} className="w-full flex items-start gap-4 text-left group">
            <span
              className={`w-6 h-6 rounded-[7px] border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                checked ? "bg-[#111] border-[#111]" : "border-gray-300 group-hover:border-gray-500 bg-white"
              }`}
            >
              {checked && <Check size={15} strokeWidth={3} className="text-white" />}
            </span>
            <span>
              <span className="block text-[16px] text-[#111]">{opt.label}</span>
              <span className="block text-[14px] text-gray-500 mt-0.5">{opt.sub}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function BuscarClient({ tours }: { tours: Tour[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const destino = searchParams.get("destino") ?? "";

  // ── Abas de dia (estilo ClickBus) — montadas no cliente pra evitar
  //    mismatch de hidratação com a data do servidor.
  const [days, setDays] = useState<Date[] | null>(null);
  const [dayISO, setDayISO] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const list: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      list.push(d);
    }
    setDays(list);

    const param = searchParams.get("data");
    if (param && fromISODate(param)) setDayISO(param);
    else setDayISO(null);
  }, [searchParams]);

  const selectDay = (iso: string | null) => {
    setDayISO(iso);
    const p = new URLSearchParams(searchParams.toString());
    if (iso) p.set("data", iso);
    else p.delete("data");
    router.replace(`/buscar?${p.toString()}`, { scroll: false });
  };

  const dayLabel = (d: Date, i: number) => {
    if (i === 0) return "Hoje";
    if (i === 1) return "Amanhã";
    const wd = WEEKDAYS_SHORT[d.getDay()].slice(0, 3);
    return `${wd.charAt(0).toUpperCase()}${wd.slice(1)} ${d.getDate()}`;
  };

  const [cats, setCats]           = useState<string[]>([]);
  const [horario, setHorario]     = useState<Horario[]>([]);
  const [price, setPrice]         = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [durIdx, setDurIdx]       = useState<[number, number]>([0, DUR_STOPS.length - 1]);
  const [viajante, setViajante]   = useState<Viajante[]>([]);
  const [idiomas, setIdiomas]     = useState<string[]>([]);
  const [acess, setAcess]         = useState<string[]>([]);
  const [sortBy, setSortBy]       = useState<"relevance" | "price_asc" | "price_desc">("relevance");
  const [moreLangs, setMoreLangs] = useState(false);
  const [acessOpen, setAcessOpen] = useState(false);

  const [tipoOpen, setTipoOpen]       = useState(false);
  const [horarioOpen, setHorarioOpen] = useState(false);
  const [filterOpen, setFilterOpen]   = useState(false);

  const tipoRef = useRef<HTMLDivElement>(null);
  const horarioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setFilterOpen(true);
    window.addEventListener("passeador:open-filter", handler);
    return () => window.removeEventListener("passeador:open-filter", handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (tipoRef.current && !tipoRef.current.contains(e.target as Node)) setTipoOpen(false);
      if (horarioRef.current && !horarioRef.current.contains(e.target as Node)) setHorarioOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // trava o scroll do body com o modal aberto
  useEffect(() => {
    if (!filterOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [filterOpen]);

  const toggleCat = (c: string) =>
    setCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  const toggleHorario = (v: Horario) =>
    setHorario((prev) => (prev.includes(v) ? prev.filter((h) => h !== v) : [...prev, v]));
  const toggleViajante = (v: Viajante) =>
    setViajante((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  const toggleIdioma = (l: string) =>
    setIdiomas((prev) => (prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]));
  const toggleAcess = (a: string) =>
    setAcess((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const filtered = useMemo(() => {
    let result = [...tours];
    if (destino && destino !== "perto") result = result.filter((t) => t.destinos.includes(destino));
    if (dayISO) {
      const d = fromISODate(dayISO);
      if (d) result = result.filter((t) => runsOn(d.getDay(), t));
    }
    if (cats.length > 0) result = result.filter((t) => cats.includes(t.category));
    if (horario.length > 0) result = result.filter((t) => tourBuckets(t).some((b) => horario.includes(b)));
    result = result.filter((t) => {
      if (t.durationMinutes == null) return true; // duração desconhecida — não exclui da busca
      const d = t.durationMinutes;
      const lo = DUR_STOPS[durIdx[0]].v;
      const hi = durIdx[1] === DUR_STOPS.length - 1 ? Infinity : DUR_STOPS[durIdx[1]].v;
      return d >= lo && d <= hi;
    });
    result = result.filter((t) => t.price >= price[0] && (price[1] >= PRICE_MAX || t.price <= price[1]));
    if (viajante.length > 0) {
      result = result.filter((t) =>
        viajante.every((v) => VIAJANTE_OPTIONS.find((o) => o.value === v)!.match(t))
      );
    }
    if (idiomas.length > 0) {
      result = result.filter((t) => {
        const langs = t.languages ?? ["Português"];
        return idiomas.every((l) => langs.includes(l));
      });
    }
    if (acess.length > 0) {
      result = result.filter((t) => acess.every((a) => (t.accessibility ?? []).includes(a)));
    }
    if (sortBy === "price_asc")  result.sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") result.sort((a, b) => b.price - a.price);
    if (sortBy === "relevance")  result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return result;
  }, [tours, destino, dayISO, cats, horario, price, durIdx, viajante, idiomas, acess, sortBy]);

  const destinoLabel = DESTINO_LABELS[destino] ?? "";

  const modalCount =
    (cats.length > 0 ? 1 : 0) +
    (horario.length > 0 ? 1 : 0) +
    (price[0] > PRICE_MIN || price[1] < PRICE_MAX ? 1 : 0) +
    (durIdx[0] > 0 || durIdx[1] < DUR_STOPS.length - 1 ? 1 : 0) +
    (viajante.length > 0 ? 1 : 0) +
    (idiomas.length > 0 ? 1 : 0) +
    (acess.length > 0 ? 1 : 0) +
    (sortBy !== "relevance" ? 1 : 0);

  const clearAll = () => {
    setCats([]);
    setHorario([]);
    setPrice([PRICE_MIN, PRICE_MAX]);
    setDurIdx([0, DUR_STOPS.length - 1]);
    setViajante([]);
    setIdiomas([]);
    setAcess([]);
    setSortBy("relevance");
  };

  const barBtn = (active: boolean) =>
    `flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm transition-colors whitespace-nowrap bg-white ${
      active ? "border-[#111] text-[#111] font-medium shadow-[inset_0_0_0_1px_#111]" : "border-gray-300 text-[#222] hover:border-[#111]"
    }`;

  return (
    <div className="min-h-screen bg-white">

      {/* ── Barra de filtros ── */}
      <div className="sticky top-14 z-30 bg-white border-b border-gray-100">
        {/* Abas de dia — os passeios têm dias fixos da semana, então cada aba
            mostra só o que sai naquele dia (runsOn). */}
        {days && (
          <div className="flex gap-2 px-4 md:px-6 pt-3 overflow-x-auto justify-start md:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              onClick={() => selectDay(null)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${
                dayISO === null ? "bg-[#111] text-white" : "text-[#444] hover:bg-gray-100"
              }`}
            >
              Todos os dias
            </button>
            {days.map((d, i) => {
              const iso = toISODate(d);
              const sel = dayISO === iso;
              return (
                <button
                  key={iso}
                  onClick={() => selectDay(iso)}
                  className={`px-4 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${
                    sel ? "bg-[#111] text-white" : "text-[#444] hover:bg-gray-100"
                  }`}
                >
                  {dayLabel(d, i)}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-center gap-2.5 px-4 md:px-6 py-3">

          {/* Tipo */}
          <div className="relative" ref={tipoRef}>
            <button onClick={() => { setTipoOpen((v) => !v); setHorarioOpen(false); }} className={barBtn(cats.length > 0)}>
              Tipo{cats.length > 0 && ` · ${cats.length}`}
              <ChevronDown size={14} strokeWidth={2} className={`transition-transform ${tipoOpen ? "rotate-180" : ""}`} />
            </button>
            {tipoOpen && (
              <div className="absolute top-[calc(100%+10px)] left-0 w-64 bg-white rounded-2xl shadow-xl border border-black/8 z-40 py-2">
                {CATEGORIES.map((c) => {
                  const sel = cats.includes(c);
                  return (
                    <button
                      key={c}
                      onClick={() => toggleCat(c)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#222] hover:bg-gray-50 transition-colors"
                    >
                      <span className="opacity-70">{categoryIcon[c]}</span>
                      <span className={sel ? "font-semibold" : ""}>{categoryLabel[c]}</span>
                      {sel && <Check size={15} strokeWidth={2.5} className="ml-auto text-[#111]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Horário */}
          <div className="relative" ref={horarioRef}>
            <button onClick={() => { setHorarioOpen((v) => !v); setTipoOpen(false); }} className={barBtn(horario.length > 0)}>
              Horário{horario.length > 0 && ` · ${horario.length}`}
              <ChevronDown size={14} strokeWidth={2} className={`transition-transform ${horarioOpen ? "rotate-180" : ""}`} />
            </button>
            {horarioOpen && (
              <div className="absolute top-[calc(100%+10px)] left-0 w-80 bg-white rounded-2xl shadow-xl border border-black/8 z-40 p-6">
                <HorarioChecks horario={horario} onToggle={toggleHorario} />
              </div>
            )}
          </div>

          <div className="w-px h-7 bg-gray-200 flex-shrink-0 mx-1" />

          {/* Filtros */}
          <div className="relative">
            <button onClick={() => setFilterOpen(true)} className={barBtn(modalCount > 0)}>
              <SlidersHorizontal size={14} strokeWidth={2} />
              Filtros
            </button>
            {modalCount > 0 && (
              <span className="absolute -top-1.5 -right-1 w-[18px] h-[18px] rounded-full bg-[#111] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white pointer-events-none">
                {modalCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="px-4 md:px-6 pt-20 pb-12">
        {filtered.length > 0 && (
          <div className="flex items-baseline justify-between gap-4 flex-wrap mb-6">
            <h1 className="text-[26px] font-bold text-[#111] leading-tight">
              {filtered.length} passeio{filtered.length !== 1 ? "s" : ""}
              {destinoLabel && ` em ${destinoLabel}`}
            </h1>
            <div className="flex items-center gap-3 text-[13px]">
              <span className="text-gray-400">Ordenar por</span>
              {([
                { v: "relevance" as const, label: "Relevância" },
                { v: "price_asc" as const, label: "Menor preço" },
                { v: "price_desc" as const, label: "Maior preço" },
              ]).map((o) => (
                <button
                  key={o.v}
                  onClick={() => setSortBy(o.v)}
                  className={
                    sortBy === o.v
                      ? "font-semibold text-[#111] underline underline-offset-4"
                      : "text-gray-500 hover:text-[#111] transition-colors"
                  }
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-xl font-semibold text-[#111] mb-2">Nenhum passeio encontrado</p>
            <p className="text-gray-400 mb-6">Tente ampliar os filtros ou outra categoria</p>
            <button onClick={clearAll} className="text-sm font-semibold underline text-[#111]">
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-x-5 gap-y-9">
            {filtered.map((tour) => (
              <TourResultCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
      </div>

      {/* ── Modal de filtros ── */}
      {filterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-6 bg-black/50"
          onClick={() => setFilterOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-[640px] max-h-[92vh] md:max-h-[85vh] rounded-t-[28px] md:rounded-[28px] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="relative flex items-center justify-center px-6 py-5 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-[17px] font-bold text-[#111]">Filtros</h2>
              <button
                onClick={() => setFilterOpen(false)}
                className="absolute right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Fechar"
              >
                <X size={20} strokeWidth={2} className="text-[#111]" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-7 py-8">

              {/* Tipo de experiência */}
              <section className="pb-9 mb-9 border-b border-gray-200">
                <h3 className="text-[20px] font-semibold text-[#111] mb-5">Tipo de experiência</h3>
                <div className="flex flex-wrap gap-2.5">
                  {CATEGORIES.map((c) => {
                    const sel = cats.includes(c);
                    return (
                      <button
                        key={c}
                        onClick={() => toggleCat(c)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-[14px] transition-all bg-white ${
                          sel
                            ? "border-[#111] text-[#111] font-medium shadow-[inset_0_0_0_1px_#111]"
                            : "border-gray-300 text-[#333] hover:border-[#111]"
                        }`}
                      >
                        {categoryIcon[c]}
                        {categoryLabel[c]}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Tipo de viajante */}
              <section className="pb-9 mb-9 border-b border-gray-200">
                <h3 className="text-[20px] font-semibold text-[#111] mb-5">Tipo de viajante</h3>
                <div className="flex flex-wrap gap-2.5">
                  {VIAJANTE_OPTIONS.map((opt) => {
                    const sel = viajante.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        onClick={() => toggleViajante(opt.value)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-[14px] transition-all bg-white ${
                          sel
                            ? "border-[#111] text-[#111] font-medium shadow-[inset_0_0_0_1px_#111]"
                            : "border-gray-300 text-[#333] hover:border-[#111]"
                        }`}
                      >
                        {opt.icon}
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Preço por participante */}
              <section className="pb-9 mb-9 border-b border-gray-200">
                <h3 className="text-[20px] font-semibold text-[#111] mb-1">Preço por participante</h3>
                <p className="text-[14px] text-gray-500 mb-6">Preço "a partir de", em reais</p>
                <div className="px-1">
                  <PriceHistogram range={price} tours={tours} />
                  <div className="-mt-[18px]">
                    <DualSlider
                      domainMin={PRICE_MIN}
                      domainMax={PRICE_MAX}
                      step={PRICE_STEP}
                      value={price}
                      onChange={setPrice}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-5">
                  <div>
                    <p className="text-[13px] text-gray-500 mb-1.5">Mínimo</p>
                    <span className="inline-block px-5 py-2.5 rounded-full border border-gray-300 text-[15px] text-[#111]">
                      R${price[0]}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] text-gray-500 mb-1.5">Máximo</p>
                    <span className="inline-block px-5 py-2.5 rounded-full border border-gray-300 text-[15px] text-[#111]">
                      R${price[1]}{price[1] >= PRICE_MAX ? "+" : ""}
                    </span>
                  </div>
                </div>
              </section>

              {/* Duração */}
              <section className="pb-9 mb-9 border-b border-gray-200">
                <h3 className="text-[20px] font-semibold text-[#111] mb-7">Duração</h3>
                <div className="px-1">
                  <DualSlider
                    domainMin={0}
                    domainMax={DUR_STOPS.length - 1}
                    step={1}
                    value={durIdx}
                    onChange={(v) => setDurIdx([v[0], v[1]])}
                    segments={DUR_STOPS.length - 1}
                  />
                  <div className="flex justify-between mt-3">
                    {DUR_STOPS.map((s, i) => (
                      <span
                        key={s.v}
                        className={`text-[13px] ${i >= durIdx[0] && i <= durIdx[1] ? "text-[#111]" : "text-gray-400"}`}
                      >
                        {s.label}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* Horário */}
              <section className="pb-9 mb-9 border-b border-gray-200">
                <h3 className="text-[20px] font-semibold text-[#111] mb-6">Horário</h3>
                <HorarioChecks horario={horario} onToggle={toggleHorario} />
              </section>

              {/* Idioma oferecido */}
              <section className="pb-9 mb-9 border-b border-gray-200">
                <h3 className="text-[20px] font-semibold text-[#111] mb-6">Idioma oferecido</h3>
                <div className="grid grid-cols-2 gap-y-5 gap-x-6">
                  {[...LANGS_MAIN, ...(moreLangs ? LANGS_MORE : [])].map((lang) => {
                    const checked = idiomas.includes(lang);
                    return (
                      <button key={lang} onClick={() => toggleIdioma(lang)} className="flex items-center gap-4 text-left group">
                        <span
                          className={`w-6 h-6 rounded-[7px] border flex items-center justify-center flex-shrink-0 transition-colors ${
                            checked ? "bg-[#111] border-[#111]" : "border-gray-300 group-hover:border-gray-500 bg-white"
                          }`}
                        >
                          {checked && <Check size={15} strokeWidth={3} className="text-white" />}
                        </span>
                        <span className="text-[16px] text-[#111]">{lang.toLowerCase()}</span>
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setMoreLangs((v) => !v)}
                  className="flex items-center gap-1.5 mt-6 text-[15px] font-semibold text-[#111] underline underline-offset-2"
                >
                  {moreLangs ? "Mostrar menos" : "Mostrar mais"}
                  <ChevronDown size={16} strokeWidth={2} className={`transition-transform ${moreLangs ? "rotate-180" : ""}`} />
                </button>
              </section>

              {/* Recursos de acessibilidade */}
              <section className="pb-9 mb-9 border-b border-gray-200">
                <button
                  onClick={() => setAcessOpen((v) => !v)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="text-[20px] font-semibold text-[#111]">Recursos de acessibilidade</h3>
                  <ChevronDown size={20} strokeWidth={2} className={`text-[#111] transition-transform ${acessOpen ? "rotate-180" : ""}`} />
                </button>
                {acessOpen && (
                  <div className="mt-6 space-y-7">
                    {ACCESS_GROUPS.map((group) => (
                      <div key={group.title}>
                        <p className="text-[16px] font-semibold text-[#111] mb-4">{group.title}</p>
                        <div className="space-y-4">
                          {group.items.map((item) => {
                            const checked = acess.includes(item);
                            return (
                              <button key={item} onClick={() => toggleAcess(item)} className="flex items-center gap-4 text-left group">
                                <span
                                  className={`w-6 h-6 rounded-[7px] border flex items-center justify-center flex-shrink-0 transition-colors ${
                                    checked ? "bg-[#111] border-[#111]" : "border-gray-300 group-hover:border-gray-500 bg-white"
                                  }`}
                                >
                                  {checked && <Check size={15} strokeWidth={3} className="text-white" />}
                                </span>
                                <span className="text-[16px] text-[#111]">{item}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Ordenar por */}
              <section>
                <h3 className="text-[20px] font-semibold text-[#111] mb-5">Ordenar por</h3>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { value: "relevance" as const,  label: "Mais relevantes", icon: <Star size={15} strokeWidth={1.75} /> },
                    { value: "price_asc" as const,  label: "Menor preço",     icon: <ArrowDownNarrowWide size={15} strokeWidth={1.75} /> },
                    { value: "price_desc" as const, label: "Maior preço",     icon: <ArrowUpNarrowWide size={15} strokeWidth={1.75} /> },
                  ].map((opt) => {
                    const sel = sortBy === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setSortBy(opt.value)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-[14px] transition-all bg-white ${
                          sel
                            ? "border-[#111] text-[#111] font-medium shadow-[inset_0_0_0_1px_#111]"
                            : "border-gray-300 text-[#333] hover:border-[#111]"
                        }`}
                      >
                        {opt.icon}
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between flex-shrink-0 bg-white">
              <button
                onClick={clearAll}
                className="text-[15px] font-semibold text-[#111] underline underline-offset-2 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Remover filtros
              </button>
              <button
                onClick={() => setFilterOpen(false)}
                className="px-7 py-3.5 rounded-2xl bg-[#111] text-white text-[15px] font-semibold hover:bg-[#333] transition-colors"
              >
                Mostrar {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
