"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sailboat, TreePalm, Mountain, Landmark, Moon, Wind, Clock, Flame, ChevronRight, ChevronLeft,
  Bus, UserRound, Utensils, LifeBuoy, Mail, CreditCard, BadgeCheck, Crown, ArrowRight,
  Ticket, Camera, CupSoda, Umbrella, ShieldCheck, Music,
} from "lucide-react";
import type { Tour } from "@/lib/tours-data";
import RoteiroModal from "./RoteiroModal";
import {
  runsOn,
  departureMinutes,
  nextValidDate,
  toISODate,
  WEEKDAYS_SHORT,
} from "@/lib/schedule";

/* ────────────────────────────────────────────────────────────────
   MOCK visual — vagas, "verdade local", clima e prazo de reserva ainda
   não existem no banco (sem controle de disponibilidade). Fica fixo aqui
   até a Fase 2 ter vaga/disponibilidade de verdade. Trocar por dado real
   nesse mesmo lugar. Seats são determinísticos (mesmo no server e client).
   ──────────────────────────────────────────────────────────────── */

const HIDE_SLUGS = new Set(["trancoso-fora-do-ar"]); // passeio de teste — some só nesta seção

const SEATS: Record<string, number> = {
  caraiva: 2,
  "recife-de-fora": 3,
  "fluvial-coroa-alta": 3,
  arraial: 0, // lotado
  "arraial-da-ajuda": 0, // lotado
  trancoso: 9,
  "praia-do-espelho": 14,
};

const LOCAL_TRUTH: Record<string, string> = {
  trancoso: "1h10 de estrada",
  "arraial-da-ajuda": "travessia de balsa inclusa",
  "praia-do-espelho": "maré baixa às 11h20",
  "coroa-vermelha": "aldeia Pataxó a 15 min",
  caraiva: "atravessa o rio de canoa",
  "trancoso-espelho": "dois destinos no mesmo dia",
  "caraiva-espelho": "estrada de terra até Caraíva",
  "rota-da-redescoberta": "onde o Brasil começou",
  mergulho: "visibilidade de até 30 m",
  "recife-de-fora": "só sai na maré certa",
  "recife-de-fora-com-transfer": "busca no hotel inclusa",
  "fluvial-coroa-alta": "escuna pela foz do rio",
  "quadriciclo-acai": "trilha de terra e mata",
  "quadriciclo-aldeia": "cachoeira no meio da mata",
  "by-night-arraial": "a Mucugê à noite",
};

const DESTINO_LABEL: Record<string, string> = {
  "porto-seguro": "Porto Seguro",
  arraial: "Arraial d'Ajuda",
  trancoso: "Trancoso",
  caraiva: "Caraíva",
  "praia-espelho": "Praia do Espelho",
};

const CATEGORY_ICON = {
  nautico: Sailboat,
  terrestre: TreePalm,
  aventura: Mountain,
  cultural: Landmark,
  noturno: Moon,
} as const;

const AVATAR_COLORS = ["#1d4ed8", "#7c3aed", "#0891b2", "#c2410c", "#15803d"];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function seatsFor(t: Tour): number {
  if (t.slug in SEATS) return SEATS[t.slug];
  return 5 + (hashStr(t.slug) % 11); // 5–15, faixa "saudável"
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function hasHorario(t: Tour): boolean {
  return Boolean(t.schedule.departureStart) || t.schedule.frequency === "tide_based";
}

function metaLine(t: Tour): string {
  const destino = DESTINO_LABEL[t.destinos[0]] ?? "";
  const truth = LOCAL_TRUTH[t.slug] ?? t.duration;
  return [destino, truth].filter(Boolean).join(" · ");
}

/** Horário em destaque próprio — trilho DEITADO (● saída ─── ● retorno),
 *  versão horizontal do TimeRail do checkout. Aqui o espaço é horizontal,
 *  então os horários ficam em cima e o trilho corre por baixo deles. */
function HorarioBadge({ tour }: { tour: Tour }) {
  const { departureStart, returnTime, frequency } = tour.schedule;

  // Ícone é SEMPRE o relógio — o slot de horário precisa de âncora visual
  // constante, mesmo quando o valor é "conforme a maré".
  if (frequency === "tide_based" && !departureStart) {
    return (
      <span className="inline-flex items-center gap-1.5 font-semibold text-[#111]">
        <Clock size={13} strokeWidth={2} className="text-gray-400" />
        conforme a maré
      </span>
    );
  }
  if (!departureStart) return null;

  // Sem horário de retorno não tem trilho — fica só o relógio + hora.
  if (!returnTime) {
    return (
      <span className="inline-flex items-center gap-1.5 font-semibold text-[#111] tabular-nums">
        <Clock size={13} strokeWidth={2} className="text-gray-400" />
        {departureStart}
      </span>
    );
  }

  // Cartão de embarque em miniatura: horários nas pontas, trilho no meio com
  // o ícone da categoria "viajando" na linha, labels miúdos embaixo.
  const Icon = CATEGORY_ICON[tour.category] ?? Sailboat;
  return (
    <span className="inline-flex items-start gap-1.5">
      <Clock size={13} strokeWidth={2} className="text-gray-400 mt-[3px]" />
      <span className="inline-flex flex-col gap-[3px]">
        <span className="flex items-center gap-2 font-semibold text-[#111] tabular-nums leading-tight">
          <span>{departureStart}</span>
          <span className="relative flex items-center w-14 md:w-20" aria-hidden="true">
            <span className="w-[6px] h-[6px] rounded-full bg-[#111] flex-shrink-0" />
            <span className="flex-1 h-[2px] bg-[#111] mx-[-1px]" />
            <span className="w-[6px] h-[6px] rounded-full bg-[#111] flex-shrink-0" />
            <span className="absolute left-1/2 -translate-x-1/2 w-[19px] h-[19px] rounded-full bg-white ring-1 ring-gray-200 flex items-center justify-center">
              <Icon size={11} strokeWidth={2.2} className="text-[#111]" />
            </span>
          </span>
          <span>{returnTime}</span>
        </span>
        <span className="flex justify-between text-[10px] font-medium text-gray-400 leading-none">
          <span>saída</span>
          <span>retorno</span>
        </span>
      </span>
    </span>
  );
}

/* ── Sub-blocos ── */

/** Urgência de vagas — chip na faixa de oferta (estilo "Últimos 5 assentos" do ClickBus). */
function SeatsChip({ seats }: { seats: number }) {
  if (seats === 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 text-[12px] font-semibold text-gray-400 whitespace-nowrap">
        lotado
      </span>
    );
  }
  if (seats <= 3) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-[12px] font-semibold text-amber-700 whitespace-nowrap tabular-nums">
        <Flame size={12} strokeWidth={2} />
        Últimas {seats} vagas
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 text-[12px] font-semibold text-[#111] whitespace-nowrap tabular-nums">
      {seats} vagas
    </span>
  );
}

// Clube Passeador — MOCK visual (programa não existe ainda): preço de membro
// ~5% menor, estilo "No clube" do ClickBus. Trocar por regra real quando houver.
function clubPrice(price: number): number {
  return Math.round(price * 0.95);
}

/** Preço com a linha do clube embaixo (coroa + sublinhado no amarelo da marca). */
function PriceBlock({ price }: { price: number }) {
  return (
    <span className="text-right leading-tight">
      <span className="block text-[17px] font-bold text-[#111] tabular-nums">R$ {price}</span>
      <span className="flex items-center justify-end gap-1 text-[12px] font-semibold text-[#111] whitespace-nowrap mt-0.5">
        <Crown size={12} strokeWidth={2} />
        <span className="underline decoration-[var(--tps-accent)] decoration-2 underline-offset-[3px]">
          No clube R$ {clubPrice(price)}
        </span>
      </span>
    </span>
  );
}

/** Foto do passeio com badge do tipo — preenche o wrapper (definir tamanho fora). */
function Photo({ tour, lotado, sizes }: { tour: Tour; lotado: boolean; sizes: string }) {
  const Icon = CATEGORY_ICON[tour.category] ?? Sailboat;
  return (
    <>
      <Image
        src={tour.image}
        alt=""
        fill
        sizes={sizes}
        className={`object-cover ${lotado ? "grayscale opacity-60" : ""}`}
      />
      <span className="absolute bottom-1.5 left-1.5 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
        <Icon size={13} strokeWidth={2} className="text-[#111]" />
      </span>
    </>
  );
}

/** Ícones de benefício derivados do que o passeio inclui de verdade (máx. 4).
 *  `short` é o nome que aparece no chip; `label` (tooltip) leva o texto real. */
const INCLUDE_ICONS: { match: RegExp; icon: typeof Bus; short: string }[] = [
  { match: /transporte|transfer|busca|van|balsa|4x4/i, icon: Bus, short: "transporte" },
  { match: /guia|instrutor|condutor/i, icon: UserRound, short: "guia" },
  { match: /almoço|refeição|alimenta|lanche|petisco|degusta/i, icon: Utensils, short: "refeição" },
  { match: /snorkel|equipamento|colete|máscara|cilindro/i, icon: LifeBuoy, short: "equipamento" },
  { match: /ingresso|entrada|taxa/i, icon: Ticket, short: "ingressos" },
  { match: /foto|filmagem/i, icon: Camera, short: "fotos" },
  { match: /água|bebida|café/i, icon: CupSoda, short: "bebidas" },
  { match: /cabana|estrutura de praia|guarda-sol|cadeira/i, icon: Umbrella, short: "cabana" },
  { match: /seguro/i, icon: ShieldCheck, short: "seguro" },
  { match: /música|show|forró/i, icon: Music, short: "música" },
];

// MOCK visual até a revisão do catálogo da Porto Brasil: passeios de dia
// inteiro que na prática param pra almoçar, mas cujo "o que inclui" ainda não
// registra. Remover quando o catálogo real trouxer isso no campo includes.
const MOCK_EXTRA_INCLUDES: Record<string, string[]> = {
  trancoso: ["Parada pra almoço"],
  caraiva: ["Parada pra almoço"],
  "arraial-da-ajuda": ["Parada pra almoço"],
  "caraiva-espelho": ["Parada pra almoço"],
};

function includeIcons(tour: Tour) {
  const incs = [...tour.includes, ...(MOCK_EXTRA_INCLUDES[tour.slug] ?? [])];
  const found: { icon: typeof Bus; short: string; label: string }[] = [];
  for (const rule of INCLUDE_ICONS) {
    const hit = incs.find((inc) => rule.match.test(inc));
    if (hit) found.push({ icon: rule.icon, short: rule.short, label: hit });
    if (found.length === 4) break;
  }
  return found;
}

/** Operador — mora na faixa de oferta (o slot "Executivo" do ClickBus). */
function OperatorTag({ tour }: { tour: Tour }) {
  const op = tour.operator;
  const color = AVATAR_COLORS[hashStr(op.name) % AVATAR_COLORS.length];
  return (
    <span className="flex items-center gap-2 min-w-0">
      <span
        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
        style={{ background: color }}
      >
        {initials(op.name)}
      </span>
      <span className="text-[13px] text-gray-600 truncate">
        {op.name} · {op.years} anos{op.cadastur ? " · CADASTUR" : ""}
      </span>
    </span>
  );
}

export default function PasseiosProximos({ tours }: { tours: Tour[] }) {
  const catalog = useMemo(() => tours.filter((t) => !HIDE_SLUGS.has(t.slug)), [tours]);

  // Data-alvo: hoje até 9h, depois disso as saídas já partiram → default amanhã.
  // null até montar no cliente (evita mismatch de hidratação com o horário do server).
  // As abas de dia deixam navegar pelos próximos 7 dias.
  const [days, setDays] = useState<Date[] | null>(null);
  const [target, setTarget] = useState<Date | null>(null);
  const [roteiroTour, setRoteiroTour] = useState<Tour | null>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    const list: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      list.push(d);
    }
    setDays(list);

    const def = new Date(base);
    if (new Date().getHours() >= 9) def.setDate(def.getDate() + 1);
    setTarget(def);
  }, []);

  // Antes de montar: lista neutra (só diários), sem rótulo de dia.
  const targetDay = target ? target.getDay() : null;
  const running = catalog.filter((t) =>
    targetDay === null ? t.schedule.frequency === "daily" : runsOn(targetDay, t)
  );

  const all = running
    .map((t) => ({ tour: t, seats: seatsFor(t) }))
    .sort((a, b) => {
      const ka = a.seats === 0 ? Infinity : a.seats;
      const kb = b.seats === 0 ? Infinity : b.seats;
      return ka - kb || departureMinutes(a.tour) - departureMinutes(b.tour);
    });

  // Paginação — 4 saídas por página, setinhas + números no rodapé da lista
  const PAGE_SIZE = 4;
  const totalPages = Math.ceil(all.length / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(0, totalPages - 1));
  const list = all.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const poucas = all.filter((x) => x.seats > 0 && x.seats <= 3).length;

  // Cabeçalho: "Hoje, terça 21" / "Amanhã, quarta 22" / "Sexta, 25"
  let heading = "Próximas saídas";
  let deadline = "";
  if (target) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const iso = toISODate(target);
    const wd = WEEKDAYS_SHORT[target.getDay()];

    if (iso === toISODate(today)) {
      heading = `Hoje, ${wd} ${target.getDate()}`;
      deadline = "reserva até 1h antes da saída";
    } else if (iso === toISODate(tomorrow)) {
      heading = `Amanhã, ${wd} ${target.getDate()}`;
      deadline = "reserva até 21h de hoje";
    } else {
      heading = `${wd.charAt(0).toUpperCase()}${wd.slice(1)}, ${target.getDate()}`;
      deadline = "reserva até 21h da véspera";
    }
  }

  return (
    // Fundo cinza-claro pros cards sem borda (só sombra) se destacarem — como no ClickBus
    <section className="py-16 md:py-20 bg-[#f7f7f8]">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Cabeçalho — o eyebrow situa a praça (no multi-praça ele vira seletor de cidade) */}
        <p className="text-[11px] md:text-[12px] font-semibold tracking-[0.12em] text-gray-400 uppercase mb-2">
          Saindo de Porto Seguro
        </p>
        <div className="flex justify-between items-baseline gap-4">
          <h2 className="text-[26px] md:text-[32px] font-bold text-[#111] leading-tight capitalize">{heading}</h2>
          {deadline && <span className="text-[13px] md:text-[14px] text-gray-400 whitespace-nowrap flex-shrink-0">{deadline}</span>}
        </div>
        <p className="text-[14px] md:text-base text-gray-500 mt-2">
          {all.length} saída{all.length !== 1 ? "s" : ""} confirmada{all.length !== 1 ? "s" : ""}
          {poucas > 0 ? ` · ${poucas} já com poucas vagas` : ""}
        </p>

        {/* Abas de dia — navega os próximos 7 dias, título acompanha */}
        {days && target && (
          <div className="flex gap-2 mt-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {days.map((d, i) => {
              const sel = toISODate(d) === toISODate(target);
              const wd = WEEKDAYS_SHORT[d.getDay()].slice(0, 3);
              const label =
                i === 0 ? "Hoje" : i === 1 ? "Amanhã" : `${wd.charAt(0).toUpperCase()}${wd.slice(1)} ${d.getDate()}`;
              return (
                <button
                  key={toISODate(d)}
                  onClick={() => {
                    setTarget(d);
                    setPage(0);
                  }}
                  className={`px-4 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                    sel ? "bg-[#111] text-white" : "bg-white text-[#444] shadow-sm hover:text-[#111]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* Lista + trilho de publicidade: os cards abrem mão de ~300px pro slot
            vertical à direita (meia-página 300×600, formato padrão de mídia).
            Abaixo de lg o trilho some e a lista volta a ocupar tudo. */}
        <div className="lg:flex lg:gap-8 lg:items-start">
        <div className="flex-1 min-w-0">
        {/* Cards — duas zonas (viagem em cima, faixa de oferta embaixo), estilo ClickBus.
            4 por página (a paginação evita o paredão que a seção virava). */}
        <div className="mt-8 flex flex-col gap-5">
          {list.map(({ tour, seats }) => {
            const lotado = seats === 0;
            const hasRoteiro = (tour.itinerary?.length ?? 0) > 0;
            const reservaDate = target ? nextValidDate(tour, target) : nextValidDate(tour);
            const reservaHref = `/reserva/${tour.slug}?data=${toISODate(reservaDate)}&adultos=1`;

            // Lotado: próxima saída depois da data-alvo
            let verLabel = "Ver passeio";
            if (lotado && target) {
              const after = new Date(target);
              after.setDate(after.getDate() + 1);
              const prox = nextValidDate(tour, after);
              verLabel = `Ver ${WEEKDAYS_SHORT[prox.getDay()]}`;
            }

            return (
              <article
                key={tour.id}
                className="rounded-3xl bg-white overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] transition-shadow"
              >
                {/* Mobile: foto banner sangrada no topo (formato que funcionou melhor lá) */}
                <Link href={`/passeios/${tour.slug}`} className="relative block md:hidden w-full h-[160px]">
                  <Photo tour={tour} lotado={lotado} sizes="100vw" />
                </Link>

                <div className="p-4 md:p-5">
                  {/* Linha de cima: foto quadrada + infos da viagem. A faixa de
                      oferta fica FORA dela, correndo a largura toda do card. */}
                  <div className="md:flex md:gap-5 md:items-center">
                  {/* Desktop: foto quadrada */}
                  <Link
                    href={`/passeios/${tour.slug}`}
                    className="relative hidden md:block w-[160px] h-[160px] rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0"
                  >
                    <Photo tour={tour} lotado={lotado} sizes="180px" />
                  </Link>

                  <div className="flex-1 min-w-0">
                    {/* ── Zona 1: a viagem ── */}
                    <div className={`flex items-start gap-4 ${lotado ? "opacity-55" : ""}`}>
                      {/* Desktop: coluna com a altura da foto (160px) — título ancora no
                          topo, linha do relógio desce pro pé, alinhada à base da foto */}
                      <div className="flex-1 min-w-0 md:h-[160px] md:flex md:flex-col">
                        <Link
                          href={`/passeios/${tour.slug}`}
                          className="block font-semibold text-[16px] md:text-[18px] text-[#111] leading-snug line-clamp-2 hover:underline underline-offset-2 decoration-gray-300"
                        >
                          {tour.title}
                        </Link>
                        {/* Operador logo abaixo do título — a linha de confiança
                            vem antes até do horário */}
                        <div className="mt-2 md:mt-4">
                          <OperatorTag tour={tour} />
                        </div>
                        {/* items-start: o trilho do horário torna o badge mais alto que a linha —
                            os vizinhos alinham pelo topo (mesma altura da linha dos horários) */}
                        <p className="text-[13px] text-gray-500 mt-3 md:mt-auto md:mb-6 flex items-start gap-x-2 gap-y-1 flex-wrap">
                          {hasHorario(tour) && (
                            <>
                              <HorarioBadge tour={tour} />
                              <span className="text-gray-300">·</span>
                            </>
                          )}
                          <span>{metaLine(tour)}</span>
                          {hasRoteiro && (
                            <>
                              <span className="text-gray-300 md:hidden">·</span>
                              <button
                                onClick={() => setRoteiroTour(tour)}
                                className="md:hidden font-semibold text-[#111] underline underline-offset-2 decoration-gray-300"
                              >
                                Ver roteiro
                              </button>
                            </>
                          )}
                        </p>
                      </div>

                      {/* Duração + Ver roteiro — canto superior direito, como no ClickBus */}
                      <p className="hidden md:flex items-center gap-2 text-[13px] text-gray-500 flex-shrink-0 pt-0.5">
                        <span>{tour.duration}</span>
                        {hasRoteiro && (
                          <>
                            <span className="text-gray-300">·</span>
                            <button
                              onClick={() => setRoteiroTour(tour)}
                              className="font-semibold text-[#111] underline underline-offset-2 decoration-gray-300 hover:decoration-[#111] transition-colors"
                            >
                              Ver roteiro
                            </button>
                          </>
                        )}
                      </p>
                    </div>

                  </div>
                  </div>

                    {/* Oferta em largura total, embaixo da foto + infos */}
                    <div className="pt-4 md:pt-5">

                    {/* ── Zona 2 desktop: faixa de oferta — a faixa INTEIRA é o botão,
                        borda engrossa no hover (ring, sem pulo de layout) ── */}
                    <Link
                      href={lotado ? `/passeios/${tour.slug}` : reservaHref}
                      className={`relative group hidden md:flex rounded-xl border items-stretch transition-shadow ${
                        lotado
                          ? "border-gray-200 hover:ring-1 hover:ring-gray-300"
                          : "border-[var(--tps-accent)] hover:ring-1 hover:ring-[var(--tps-accent)]"
                      }`}
                    >
                      <span className="flex items-center gap-3 flex-1 min-w-0 px-4 py-3">
                        <SeatsChip seats={seats} />
                        {/* Benefícios em chips (ícone + nome curto) — derivados do
                            "o que inclui" real do passeio; tooltip leva o texto completo */}
                        {includeIcons(tour).length > 0 && (
                          <span className="flex items-center gap-1.5 flex-shrink min-w-0 overflow-hidden">
                            {includeIcons(tour).map(({ icon: Inc, short, label }) => (
                              <span
                                key={label}
                                title={label}
                                className="inline-flex items-center gap-1.5 h-8 pl-2.5 pr-3 rounded-full bg-gray-50 text-[12px] font-medium text-gray-600 whitespace-nowrap"
                              >
                                <Inc size={14} strokeWidth={1.75} className="text-gray-400 flex-shrink-0" />
                                {short}
                              </span>
                            ))}
                          </span>
                        )}
                        <span className="ml-auto flex items-center">
                          {lotado ? (
                            <span className="text-right leading-tight">
                              <span className="block text-[17px] font-bold text-[#111] tabular-nums">R$ {tour.price}</span>
                            </span>
                          ) : (
                            <PriceBlock price={tour.price} />
                          )}
                        </span>
                      </span>
                      {lotado ? (
                        <span className="flex items-center gap-1 px-5 rounded-r-[11px] bg-gray-100 text-gray-500 text-[13px] font-semibold group-hover:bg-gray-200 transition-colors whitespace-nowrap">
                          {verLabel}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 px-5 rounded-r-[11px] bg-[var(--tps-accent)] group-hover:bg-[var(--tps-accent-hover)] text-[#111] text-[14px] font-semibold transition-colors whitespace-nowrap">
                          Reservar
                          <ChevronRight size={16} strokeWidth={2.5} />
                        </span>
                      )}
                    </Link>

                    {/* ── Zona 2 mobile: a faixa É o botão (como a divzinha roxa do ClickBus) ── */}
                    <Link
                      href={lotado ? `/passeios/${tour.slug}` : reservaHref}
                      className={`relative md:hidden flex items-stretch rounded-xl border transition-shadow ${
                        lotado
                          ? "border-gray-200 hover:ring-1 hover:ring-gray-300"
                          : "border-[var(--tps-accent)] hover:ring-1 hover:ring-[var(--tps-accent)]"
                      }`}
                    >
                      <span className="flex items-center justify-between gap-2 flex-1 min-w-0 px-3.5 py-3">
                        <span className="flex items-center gap-1.5 min-w-0">
                          <SeatsChip seats={seats} />
                          {/* Benefícios só com ícone (sem texto — espaço curto no mobile) */}
                          {includeIcons(tour).slice(0, 3).map(({ icon: Inc, short, label }) => (
                            <span
                              key={short}
                              title={label}
                              className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0"
                            >
                              <Inc size={14} strokeWidth={1.75} className="text-gray-400" aria-label={label} />
                            </span>
                          ))}
                        </span>
                        {lotado ? (
                          <span className="text-right leading-tight">
                            <span className="block text-[17px] font-bold text-[#111] tabular-nums">R$ {tour.price}</span>
                          </span>
                        ) : (
                          <PriceBlock price={tour.price} />
                        )}
                      </span>
                      {lotado ? (
                        <span className="flex items-center px-4 rounded-r-[11px] bg-gray-100 text-gray-500 text-[13px] font-semibold whitespace-nowrap">
                          {verLabel}
                        </span>
                      ) : (
                        <span className="flex items-center px-4 rounded-r-[11px] bg-[var(--tps-accent)] text-[#111]" aria-label="Reservar">
                          <ChevronRight size={20} strokeWidth={2.5} />
                        </span>
                      )}
                    </Link>

                    {/* Mini-provas — o que acalma antes de clicar (padrão dos chips do ClickBus) */}
                    {!lotado && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {[
                          { icon: Mail, label: "Confirmação por e-mail" },
                          { icon: CreditCard, label: "Pix ou cartão" },
                          { icon: BadgeCheck, label: "Operador verificado" },
                        ].map(({ icon: Chip, label }) => (
                          <span
                            key={label}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50 text-[12px] text-gray-600"
                          >
                            <Chip size={13} strokeWidth={1.75} className="text-gray-400" />
                            {label}
                          </span>
                        ))}
                      </div>
                    )}
                    </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Paginação — mesma linguagem das abas de dia (branco/sombra, ativo preto) */}
        {totalPages > 1 && (
          <div className="mt-7 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(Math.max(0, safePage - 1))}
              disabled={safePage === 0}
              aria-label="Página anterior"
              className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-[#444] hover:text-[#111] transition-colors disabled:opacity-35 disabled:pointer-events-none"
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </button>
            {Array.from({ length: totalPages }, (_, p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                aria-label={`Página ${p + 1}`}
                className={`w-9 h-9 rounded-full text-[13px] font-medium tabular-nums transition-colors ${
                  p === safePage ? "bg-[#111] text-white" : "bg-white text-[#444] shadow-sm hover:text-[#111]"
                }`}
              >
                {p + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages - 1, safePage + 1))}
              disabled={safePage === totalPages - 1}
              aria-label="Próxima página"
              className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-[#444] hover:text-[#111] transition-colors disabled:opacity-35 disabled:pointer-events-none"
            >
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          </div>
        )}

        {/* Leva a data junto — a busca abre já com a aba do mesmo dia selecionada */}
        <Link
          href={target ? `/buscar?data=${toISODate(target)}` : "/buscar"}
          className="mt-5 inline-block text-[14px] font-semibold text-[#111] underline underline-offset-2 decoration-gray-300 hover:decoration-[#111] transition-colors"
        >
          Ver todas as saídas →
        </Link>
        </div>

        {/* ── Trilho de publicidade (meia-página 300×600) — rola junto com a
            página (sem sticky: perseguindo o scroll chamava atenção demais).
            Por enquanto publicidade da casa; quando tiver mídia de parceiro
            de verdade, a arte entra aqui no lugar. ── */}
        <aside className="hidden lg:block w-[300px] flex-shrink-0 mt-8 lg:order-first">
          <a
            href="#guia"
            className="group relative flex flex-col justify-between h-[600px] rounded-3xl overflow-hidden bg-[#a528fd] p-8 text-white"
          >
            <div>
              <div className="relative w-8 h-8 mb-6">
                <Image src="/logo-passeador-color-white.svg" alt="" fill className="object-contain" />
              </div>
              <p className="text-[26px] font-bold leading-tight">
                Tem uma empresa de passeios?
              </p>
              <p className="text-[15px] text-white/80 mt-3 leading-relaxed">
                Seus passeios aqui, vendendo online — a gente cadastra tudo pra você.
              </p>
            </div>

            <div>
              <div className="space-y-2.5 mb-7">
                {["0% pra entrar", "15% só quando vende", "Cadastro feito pra você"].map((f) => (
                  <p key={f} className="flex items-center gap-2.5 text-[14px] font-medium">
                    <BadgeCheck size={16} strokeWidth={2} className="text-white/70 flex-shrink-0" />
                    {f}
                  </p>
                ))}
              </div>
              <span className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-[#111] text-[14px] font-semibold group-hover:bg-[var(--tps-accent)] transition-colors">
                Quero anunciar
                <ArrowRight size={15} strokeWidth={2.5} />
              </span>
            </div>
          </a>
        </aside>
        </div>

        {/* Rodapé — clima + cancelamento (mock) */}
        <p className="flex items-start gap-2 mt-6 text-[13px] text-gray-400 leading-relaxed">
          <Wind size={16} strokeWidth={1.75} className="flex-shrink-0 mt-0.5" />
          Vento sul previsto para os próximos dias — saídas de barco podem mudar. Cancelou, dinheiro de volta.
        </p>

        {roteiroTour && <RoteiroModal tour={roteiroTour} onClose={() => setRoteiroTour(null)} />}
      </div>
    </section>
  );
}
