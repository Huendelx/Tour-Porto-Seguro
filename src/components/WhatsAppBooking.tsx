"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sunrise, Waves, ChevronLeft, ChevronRight } from "lucide-react";
import { Tour } from "@/data/tours";
import { runsOn, nextValidDate, toISODate, formatDatePt } from "@/lib/schedule";

const MONTHS_PT = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];
const DAYS_HEADER = ["D", "S", "T", "Q", "Q", "S", "S"];

/* ─── Calendário do card: só dias em que o passeio sai são clicáveis ─── */
function TourCalendar({ tour, selected, onSelect }: { tour: Tour; selected: Date; onSelect: (d: Date) => void }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [month, setMonth] = useState(selected.getMonth());
  const [year, setYear] = useState(selected.getFullYear());

  const canPrev = year > today.getFullYear() || (year === today.getFullYear() && month > today.getMonth());
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isEnabled = (d: number | null) => {
    if (!d) return false;
    const date = new Date(year, month, d);
    return date >= today && runsOn(date.getDay(), tour);
  };
  const isSel = (d: number | null) =>
    !!d && selected.getDate() === d && selected.getMonth() === month && selected.getFullYear() === year;

  const prev = () => { if (!canPrev) return; if (month === 0) { setMonth(11); setYear((y) => y - 1); } else setMonth((m) => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear((y) => y + 1); } else setMonth((m) => m + 1); };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={prev} disabled={!canPrev} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-20 text-[#111]" aria-label="Mês anterior">
          <ChevronLeft size={16} strokeWidth={2} />
        </button>
        <span className="text-[14px] font-semibold text-[#111] capitalize">{MONTHS_PT[month]} {year}</span>
        <button onClick={next} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-[#111]" aria-label="Próximo mês">
          <ChevronRight size={16} strokeWidth={2} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {DAYS_HEADER.map((d, i) => (
          <div key={i} className="text-[11px] text-gray-400 font-medium py-1">{d}</div>
        ))}
        {cells.map((d, i) => {
          const enabled = isEnabled(d);
          const sel = isSel(d);
          return (
            <button
              key={i}
              disabled={!enabled}
              onClick={() => d && onSelect(new Date(year, month, d))}
              className={`text-[13px] w-9 h-9 mx-auto rounded-full transition-colors tabular-nums ${
                sel
                  ? "bg-[#111] text-white font-bold"
                  : enabled
                    ? "text-[#111] hover:bg-gray-100 cursor-pointer"
                    : "text-gray-300 cursor-default"
              }`}
            >
              {d ?? ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function WhatsAppBooking({ tour }: { tour: Tour }) {
  const router = useRouter();
  const [tab, setTab] = useState<"data" | "pessoas">("data");
  const [date, setDate] = useState<Date>(() => nextValidDate(tour));
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const adultPrice = tour.prices.find((p) => p.category === "adult");
  const childPrice = tour.prices.find((p) => p.category === "child");

  const total =
    adults * (adultPrice?.priceMin ?? tour.price) +
    children * (childPrice?.priceMin ?? 0);

  const reservaUrl = `/reserva/${tour.slug}?data=${toISODate(date)}&adultos=${adults}${children > 0 ? `&criancas=${children}` : ""}`;

  const waMsg = encodeURIComponent(
    `Olá! Quero reservar o passeio *${tour.title}*.\n\n` +
    `Data: ${formatDatePt(date)}\nAdultos: ${adults}${children > 0 ? `\nCrianças: ${children}` : ""}\n\n` +
    `Pode me confirmar disponibilidade?`
  );

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6" style={{ boxShadow: "0 6px 24px rgba(0,0,0,0.07)" }}>
      {/* Preço */}
      <div className="flex items-baseline gap-1.5 flex-wrap">
        <span className="text-sm text-gray-500">A partir de</span>
        <span className="text-[26px] font-bold text-[#111] leading-none">R$ {tour.price}</span>
        <span className="text-sm text-gray-500">/pessoa</span>
      </div>
      {/cancelamento gratuito/i.test(tour.cancellationPolicy) && (
        <p className="text-[13px] font-semibold text-[#2d7d46] mt-1">Cancelamento gratuito</p>
      )}

      {/* Abas */}
      <div className="mt-5 flex rounded-full bg-gray-100 p-1">
        {([
          { id: "data" as const, label: "Data" },
          { id: "pessoas" as const, label: "Pessoas" },
        ]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded-full text-[13px] font-semibold transition-colors ${
              tab === t.id ? "bg-[#111] text-white" : "text-[#444] hover:text-[#111]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Conteúdo da aba */}
      <div className="mt-5 min-h-[280px]">
        {tab === "data" ? (
          <div>
            <TourCalendar tour={tour} selected={date} onSelect={setDate} />
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 text-[13px] text-gray-500">
              {tour.schedule.frequency === "tide_based" ? (
                <>
                  <Waves size={15} strokeWidth={1.75} className="text-gray-400 flex-shrink-0" />
                  Horário conforme a maré — confirmado na reserva
                </>
              ) : (
                <>
                  <Sunrise size={15} strokeWidth={1.75} className="text-gray-400 flex-shrink-0" />
                  Saída {tour.schedule.departureStart ?? "a combinar"}
                  {tour.schedule.departureEnd && `–${tour.schedule.departureEnd}`}
                  {tour.schedule.returnTime && ` · Retorno ${tour.schedule.returnTime}`}
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-5 pt-2">
            <Counter
              label="Adultos"
              sub={adultPrice ? `R$ ${adultPrice.priceMin} cada` : undefined}
              value={adults}
              min={1}
              onChange={setAdults}
            />
            {childPrice && (
              <Counter
                label="Crianças"
                sub={childPrice.label.replace("Criança ", "")}
                value={children}
                min={0}
                onChange={setChildren}
              />
            )}
            {!childPrice && (
              <p className="text-[13px] text-gray-400">Este passeio não possui tarifa infantil.</p>
            )}
          </div>
        )}
      </div>

      {/* Resumo da seleção */}
      <div className="mt-5 pt-4 border-t border-gray-100 space-y-1.5">
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-gray-500">Data</span>
          <span className="font-medium text-[#111] capitalize">{formatDatePt(date)}</span>
        </div>
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-gray-500">Pessoas</span>
          <span className="font-medium text-[#111]">
            {adults} adulto{adults > 1 ? "s" : ""}{children > 0 ? ` · ${children} criança${children > 1 ? "s" : ""}` : ""}
          </span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="text-[14px] text-gray-500">Total estimado</span>
          <span className="text-[17px] font-bold text-[#111]">R$ {total}</span>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => router.push(reservaUrl)}
        className="mt-5 flex items-center justify-center gap-2 w-full bg-[var(--tps-accent)] hover:bg-[var(--tps-accent-hover)] text-[#111] font-semibold py-4 rounded-full transition-colors text-[15px]"
      >
        Reservar agora
      </button>

      <a
        href={`https://wa.me/${tour.operator.whatsapp}?text=${waMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center mt-3.5 text-[13px] text-gray-500 underline underline-offset-2 hover:text-[#111] transition-colors"
      >
        ou reserve pelo WhatsApp
      </a>
    </div>
  );
}

function Counter({
  label, sub, value, min, onChange,
}: {
  label: string; sub?: string; value: number; min: number; onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[14px] font-medium text-[#111]">{label}</p>
        {sub && <p className="text-[12px] text-gray-400">{sub}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-8 h-8 rounded-full border border-gray-300 text-[#111] flex items-center justify-center hover:border-[#111] transition-colors text-lg font-light disabled:opacity-25 disabled:hover:border-gray-300"
          disabled={value <= min}
          aria-label={`Diminuir ${label}`}
        >
          −
        </button>
        <span className="w-5 text-center font-semibold text-[#111] text-[15px] tabular-nums">{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          className="w-8 h-8 rounded-full border border-gray-300 text-[#111] flex items-center justify-center hover:border-[#111] transition-colors text-lg font-light"
          aria-label={`Aumentar ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
