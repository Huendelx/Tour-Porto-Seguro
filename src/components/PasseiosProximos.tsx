"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sailboat, TreePalm, Mountain, Landmark, Moon, Wind, Clock, MoveRight, Flame, ChevronRight,
  Bus, UserRound, Utensils, LifeBuoy, Mail, CreditCard, BadgeCheck, Crown,
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

/** Horário em destaque próprio — escuro, com ícone (a hora tava enterrada na linha cinza). */
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

  return (
    <span className="inline-flex items-center gap-1.5 font-semibold text-[#111] tabular-nums">
      <Clock size={13} strokeWidth={2} className="text-gray-400" />
      {departureStart}
      {returnTime && (
        <>
          <MoveRight size={12} strokeWidth={2} className="text-gray-400" />
          {returnTime}
        </>
      )}
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

/** Ícones de benefício derivados do que o passeio inclui de verdade (máx. 3). */
const INCLUDE_ICONS: { match: RegExp; icon: typeof Bus; label: string }[] = [
  { match: /transporte|transfer|busca|van|balsa/i, icon: Bus, label: "Transporte incluso" },
  { match: /guia/i, icon: UserRound, label: "Guia credenciado" },
  { match: /almoço|refeição|alimenta|lanche|petisco/i, icon: Utensils, label: "Alimentação inclusa" },
  { match: /snorkel|equipamento|colete|máscara/i, icon: LifeBuoy, label: "Equipamento incluso" },
];

function includeIcons(tour: Tour) {
  const found: { icon: typeof Bus; label: string }[] = [];
  for (const rule of INCLUDE_ICONS) {
    const hit = tour.includes.find((inc) => rule.match.test(inc));
    if (hit) found.push({ icon: rule.icon, label: hit });
    if (found.length === 3) break;
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

  // Data-alvo: hoje até 9h, depois disso as saídas já partiram → mostra amanhã.
  // null até montar no cliente (evita mismatch de hidratação com o horário do server).
  const [target, setTarget] = useState<Date | null>(null);
  const [isTomorrow, setIsTomorrow] = useState(false);
  const [roteiroTour, setRoteiroTour] = useState<Tour | null>(null);

  useEffect(() => {
    const tomorrow = new Date().getHours() >= 9;
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    if (tomorrow) d.setDate(d.getDate() + 1);
    setTarget(d);
    setIsTomorrow(tomorrow);
  }, []);

  // Antes de montar: lista neutra (só diários), sem rótulo de dia.
  const targetDay = target ? target.getDay() : null;
  const running = catalog.filter((t) =>
    targetDay === null ? t.schedule.frequency === "daily" : runsOn(targetDay, t)
  );

  const list = running
    .map((t) => ({ tour: t, seats: seatsFor(t) }))
    .sort((a, b) => {
      const ka = a.seats === 0 ? Infinity : a.seats;
      const kb = b.seats === 0 ? Infinity : b.seats;
      return ka - kb || departureMinutes(a.tour) - departureMinutes(b.tour);
    })
    .slice(0, 8);

  const poucas = list.filter((x) => x.seats > 0 && x.seats <= 3).length;

  // Cabeçalho: "Amanhã, quarta 22" / "Hoje, terça 21"
  let heading = "Próximas saídas";
  let deadline = "";
  if (target) {
    const label = isTomorrow ? "Amanhã" : "Hoje";
    heading = `${label}, ${WEEKDAYS_SHORT[target.getDay()]} ${target.getDate()}`;
    deadline = isTomorrow ? "reserva até 21h de hoje" : "reserva até 1h antes da saída";
  }

  return (
    // Fundo cinza-claro pros cards sem borda (só sombra) se destacarem — como no ClickBus
    <section className="py-16 md:py-20 bg-[#f7f7f8]">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Cabeçalho */}
        <div className="flex justify-between items-baseline gap-4">
          <h2 className="text-[26px] md:text-[32px] font-bold text-[#111] leading-tight capitalize">{heading}</h2>
          {deadline && <span className="text-[13px] md:text-[14px] text-gray-400 whitespace-nowrap flex-shrink-0">{deadline}</span>}
        </div>
        <p className="text-[14px] md:text-base text-gray-500 mt-2">
          {list.length} saída{list.length !== 1 ? "s" : ""} confirmada{list.length !== 1 ? "s" : ""}
          {poucas > 0 ? ` · ${poucas} já com poucas vagas` : ""}
        </p>

        {/* Cards — duas zonas (viagem em cima, faixa de oferta embaixo), estilo ClickBus.
            No mobile só os 4 primeiros aparecem (seção ficava um paredão). */}
        <div className="mt-8 flex flex-col gap-3">
          {list.map(({ tour, seats }, i) => {
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
                className={`rounded-3xl bg-white overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] transition-shadow ${i >= 4 ? "hidden md:block" : ""}`}
              >
                {/* Mobile: foto banner sangrada no topo (formato que funcionou melhor lá) */}
                <Link href={`/passeios/${tour.slug}`} className="relative block md:hidden w-full h-[160px]">
                  <Photo tour={tour} lotado={lotado} sizes="100vw" />
                </Link>

                <div className="p-4 md:p-5 md:flex md:gap-5">
                  {/* Desktop: foto grande em coluna, altura total do conteúdo */}
                  <Link
                    href={`/passeios/${tour.slug}`}
                    className="relative hidden md:block w-[180px] min-h-[188px] rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 self-stretch"
                  >
                    <Photo tour={tour} lotado={lotado} sizes="180px" />
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col">
                    {/* ── Zona 1: a viagem ── */}
                    <div className={`flex items-start gap-4 ${lotado ? "opacity-55" : ""}`}>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/passeios/${tour.slug}`}
                          className="block font-semibold text-[16px] md:text-[19px] text-[#111] leading-snug hover:underline underline-offset-2 decoration-gray-300"
                        >
                          {tour.title}
                        </Link>
                        <p className="text-[13px] text-gray-500 mt-1.5 flex items-center gap-x-2 gap-y-1 flex-wrap">
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
                        {/* Operador no mobile — linha do conteúdo (no desktop mora na faixa de oferta) */}
                        <div className="md:hidden mt-2">
                          <OperatorTag tour={tour} />
                        </div>
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

                    {/* Respiro proposital entre a viagem e a oferta (mt-auto) — e espaço
                        livre pra uma futura linha de ícones se fizer sentido */}
                    <div className="mt-auto pt-4 md:pt-5">

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
                      <span className="flex items-center gap-4 flex-1 min-w-0 px-4 py-3">
                        <OperatorTag tour={tour} />
                        {includeIcons(tour).length > 0 && (
                          <>
                            <span className="w-px h-5 bg-gray-200 flex-shrink-0" />
                            <span className="flex items-center gap-2.5 flex-shrink-0">
                              {includeIcons(tour).map(({ icon: Inc, label }) => (
                                <Inc key={label} size={15} strokeWidth={1.75} className="text-gray-400" aria-label={label} />
                              ))}
                            </span>
                          </>
                        )}
                        <span className="ml-auto flex items-center gap-4">
                          <SeatsChip seats={seats} />
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
                        <span className="flex items-center gap-1.5 px-6 rounded-r-[11px] bg-[var(--tps-accent)] group-hover:bg-[var(--tps-accent-hover)] text-[#111] text-[14px] font-semibold transition-colors whitespace-nowrap">
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
                        <SeatsChip seats={seats} />
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
                </div>
              </article>
            );
          })}
        </div>

        {/* Leva a data junto — a busca abre já com a aba do mesmo dia selecionada */}
        <Link
          href={target ? `/buscar?data=${toISODate(target)}` : "/buscar"}
          className="mt-5 inline-block text-[14px] font-semibold text-[#111] underline underline-offset-2 decoration-gray-300 hover:decoration-[#111] transition-colors"
        >
          Ver todas as saídas →
        </Link>

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
