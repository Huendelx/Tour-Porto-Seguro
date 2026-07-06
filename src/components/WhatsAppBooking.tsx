"use client";

import { useState } from "react";
import { CalendarDays, Waves, Flag, ShieldCheck } from "lucide-react";
import { Tour } from "@/data/tours";

export default function WhatsAppBooking({ tour }: { tour: Tour }) {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const adultPrice = tour.prices.find((p) => p.category === "adult");
  const childPrice = tour.prices.find((p) => p.category === "child");

  const total =
    adults * (adultPrice?.priceMin ?? tour.price) +
    children * (childPrice?.priceMin ?? 0);

  const message = encodeURIComponent(
    `Olá! Quero reservar o passeio *${tour.title}*.\n\n` +
    `Adultos: ${adults}${childPrice && children > 0 ? `\nCrianças: ${children}` : ""}\n\n` +
    `Pode me confirmar disponibilidade e formas de pagamento?`
  );

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6" style={{ boxShadow: "0 6px 24px rgba(0,0,0,0.07)" }}>
      {/* Preço */}
      <div className="flex items-baseline gap-1.5 flex-wrap">
        <span className="text-sm text-gray-500">A partir de</span>
        <span className="text-[26px] font-bold text-[#111] leading-none">R$ {tour.price}</span>
        <span className="text-sm text-gray-500">/pessoa</span>
      </div>
      {tour.priceMax && tour.priceMax > tour.price && (
        <p className="text-[12px] text-gray-400 mt-1">Alta temporada: até R$ {tour.priceMax} por pessoa</p>
      )}

      {/* Disponibilidade */}
      <div className="mt-5 rounded-2xl border border-gray-100 px-4 py-3.5 space-y-2">
        <div className="flex items-center gap-2.5 text-[13px] text-[#111]">
          {tour.schedule.frequency === "tide_based" ? (
            <Waves size={15} strokeWidth={1.75} className="text-gray-400 flex-shrink-0" />
          ) : (
            <CalendarDays size={15} strokeWidth={1.75} className="text-gray-400 flex-shrink-0" />
          )}
          <span className="font-medium">
            {tour.schedule.frequency === "daily" && "Todos os dias"}
            {tour.schedule.frequency === "specific_days" && tour.schedule.days}
            {tour.schedule.frequency === "tide_based" && "Conforme a tábua de marés"}
          </span>
          {tour.schedule.departureStart && (
            <span className="text-gray-500 ml-auto">Saída {tour.schedule.departureStart}</span>
          )}
        </div>
        {tour.schedule.returnTime && (
          <div className="flex items-center gap-2.5 text-[13px]">
            <Flag size={15} strokeWidth={1.75} className="text-gray-400 flex-shrink-0" />
            <span className="text-gray-500">Retorno {tour.schedule.returnTime}</span>
          </div>
        )}
      </div>

      {/* Participantes */}
      <div className="mt-5 space-y-4">
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
      </div>

      {/* Total */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
        <span className="text-[14px] text-gray-500">Total estimado</span>
        <span className="text-[17px] font-bold text-[#111]">R$ {total}</span>
      </div>

      {/* CTA */}
      <a
        href={`https://wa.me/${tour.operator.whatsapp}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex items-center justify-center gap-2 w-full bg-[#111] hover:bg-[#333] text-white font-semibold py-4 rounded-full transition-colors text-[15px]"
      >
        Reservar pelo WhatsApp
      </a>

      <div className="flex items-center justify-center gap-1.5 mt-3.5 text-[12px] text-gray-400">
        <ShieldCheck size={13} strokeWidth={1.75} />
        Sem cartão · Resposta em até 30 minutos
      </div>
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
