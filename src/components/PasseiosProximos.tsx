"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sailboat, TreePalm, Mountain, Landmark, Moon, Wind, Clock, Waves, MoveRight } from "lucide-react";
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

  if (frequency === "tide_based" && !departureStart) {
    return (
      <span className="inline-flex items-center gap-1.5 font-semibold text-[#111]">
        <Waves size={13} strokeWidth={2} className="text-gray-400" />
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

/* ── Sub-blocos reusados entre mobile e desktop ── */

function VagasBox({ seats }: { seats: number }) {
  if (seats === 0) {
    return (
      <div className="w-[68px] md:w-[72px] flex-shrink-0 h-[68px] md:h-[72px] rounded-xl bg-gray-50 flex flex-col items-center justify-center">
        <span className="text-[13px] font-semibold text-gray-400">lotado</span>
      </div>
    );
  }
  const alert = seats <= 3;
  return (
    <div
      className={`w-[68px] md:w-[72px] flex-shrink-0 h-[68px] md:h-[72px] rounded-xl flex flex-col items-center justify-center ${
        alert ? "bg-amber-50" : "bg-gray-100"
      }`}
    >
      <span className={`text-[26px] font-bold leading-none tabular-nums ${alert ? "text-amber-700" : "text-[#111]"}`}>
        {seats}
      </span>
      <span className={`text-[11px] mt-1 ${alert ? "text-amber-700/80" : "text-gray-400"}`}>vagas</span>
    </div>
  );
}

/** Versão compacta das vagas pro mobile — pílula em vez do quadrado. */
function SeatsChip({ seats }: { seats: number }) {
  if (seats === 0) {
    return (
      <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 text-[13px] font-semibold text-gray-400">
        lotado
      </span>
    );
  }
  const alert = seats <= 3;
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[13px] font-semibold tabular-nums ${
        alert ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-[#111]"
      }`}
    >
      {seats} vagas
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
      <span className="absolute bottom-2 left-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center">
        <Icon size={14} strokeWidth={2} className="text-[#111]" />
      </span>
    </>
  );
}

function Content({ tour, lotado }: { tour: Tour; lotado: boolean }) {
  const op = tour.operator;
  const color = AVATAR_COLORS[hashStr(op.name) % AVATAR_COLORS.length];
  const [roteiroOpen, setRoteiroOpen] = useState(false);
  const hasRoteiro = (tour.itinerary?.length ?? 0) > 0;
  return (
    <div className={`min-w-0 ${lotado ? "opacity-55" : ""}`}>
      <Link
        href={`/passeios/${tour.slug}`}
        className="block font-semibold text-[15px] md:text-[16px] text-[#111] leading-snug hover:underline underline-offset-2 decoration-gray-300"
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
            <span className="text-gray-300">·</span>
            <button
              onClick={() => setRoteiroOpen(true)}
              className="underline underline-offset-2 decoration-gray-300 hover:decoration-[#111] hover:text-[#111] transition-colors"
            >
              Ver roteiro
            </button>
          </>
        )}
      </p>
      {roteiroOpen && <RoteiroModal tour={tour} onClose={() => setRoteiroOpen(false)} />}
      <div className="flex items-center gap-2 mt-2">
        <span
          className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
          style={{ background: color }}
        >
          {initials(op.name)}
        </span>
        <span className="text-[13px] text-gray-500 truncate">
          {op.name} · {op.years} anos{op.cadastur ? " · CADASTUR" : ""}
        </span>
      </div>
    </div>
  );
}

export default function PasseiosProximos({ tours }: { tours: Tour[] }) {
  const catalog = useMemo(() => tours.filter((t) => !HIDE_SLUGS.has(t.slug)), [tours]);

  // Data-alvo: hoje até 9h, depois disso as saídas já partiram → mostra amanhã.
  // null até montar no cliente (evita mismatch de hidratação com o horário do server).
  const [target, setTarget] = useState<Date | null>(null);
  const [isTomorrow, setIsTomorrow] = useState(false);

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
    <section className="py-16 md:py-20 bg-white">
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

        {/* Cards — no mobile só os 4 primeiros aparecem (seção ficava um paredão) */}
        <div className="mt-8 flex flex-col gap-3">
          {list.map(({ tour, seats }, i) => {
            const lotado = seats === 0;
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
                className={`rounded-xl border border-gray-200 overflow-hidden transition-all hover:border-gray-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] ${lotado ? "bg-gray-50/60" : "bg-white"} ${i >= 4 ? "hidden md:block" : ""}`}
              >
                {/* MOBILE — foto banner no topo, sangrada nas bordas */}
                <div className="md:hidden">
                  <Link href={`/passeios/${tour.slug}`} className="relative block w-full h-[150px]">
                    <Photo tour={tour} lotado={lotado} sizes="100vw" />
                  </Link>
                  <div className="px-4 py-4">
                    <Content tour={tour} lotado={lotado} />
                    <div className="mt-3 flex items-center justify-between">
                      <SeatsChip seats={seats} />
                      <p className="text-[15px] text-[#111]">
                        <span className="text-[11px] text-gray-400 mr-1.5">por pessoa</span>
                        <span className="font-bold text-[16px]">R$ {tour.price}</span>
                      </p>
                    </div>
                    {lotado ? (
                      <Link
                        href={`/passeios/${tour.slug}`}
                        className="mt-3 block w-full text-center py-2.5 rounded-full border border-gray-300 text-[14px] font-semibold text-gray-500"
                      >
                        {verLabel}
                      </Link>
                    ) : (
                      <Link
                        href={reservaHref}
                        className="mt-3 block w-full text-center py-2.5 rounded-full bg-[var(--tps-accent)] hover:bg-[var(--tps-accent-hover)] text-[#111] text-[14px] font-semibold transition-colors"
                      >
                        Reservar
                      </Link>
                    )}
                  </div>
                </div>

                {/* DESKTOP — foto coluna inteira à esquerda, sangrada nas bordas */}
                <div className="hidden md:flex items-stretch">
                  <Link href={`/passeios/${tour.slug}`} className="relative block w-[150px] flex-shrink-0 self-stretch">
                    <Photo tour={tour} lotado={lotado} sizes="150px" />
                  </Link>
                  <div className="flex items-center gap-5 flex-1 min-w-0 px-5 py-4">
                  <VagasBox seats={seats} />
                  <div className="flex-1 min-w-0">
                    <Content tour={tour} lotado={lotado} />
                  </div>
                  <div className="w-[112px] flex-shrink-0 text-right">
                    <p className="text-[11px] text-gray-400">por pessoa</p>
                    <p className="font-bold text-[16px] text-[#111] mb-2">R$ {tour.price}</p>
                    {lotado ? (
                      <Link
                        href={`/passeios/${tour.slug}`}
                        className="block w-full text-center py-2 rounded-full border border-gray-300 text-[13px] font-semibold text-gray-500 hover:border-gray-400 transition-colors"
                      >
                        {verLabel}
                      </Link>
                    ) : (
                      <Link
                        href={reservaHref}
                        className="block w-full text-center py-2 rounded-full bg-[var(--tps-accent)] hover:bg-[var(--tps-accent-hover)] text-[#111] text-[13px] font-semibold transition-colors"
                      >
                        Reservar
                      </Link>
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
      </div>
    </section>
  );
}
