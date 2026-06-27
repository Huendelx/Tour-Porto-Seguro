"use client";

import { useState } from "react";
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
    `👤 Adultos: ${adults}${childPrice && children > 0 ? `\n👶 Crianças: ${children}` : ""}\n\n` +
    `Pode me confirmar disponibilidade e formas de pagamento?`
  );

  return (
    <div className="rounded-3xl border border-gray-200 shadow-lg bg-white p-6">
      <div className="mb-5">
        <p className="text-xs text-gray-400 mb-1">A partir de</p>
        <p className="text-3xl font-bold text-[#111]">
          R${tour.price}
          <span className="text-base font-normal text-gray-400"> /pessoa</span>
        </p>
        {tour.priceMax && tour.priceMax > tour.price && (
          <p className="text-xs text-gray-400 mt-0.5">até R${tour.priceMax} por pessoa</p>
        )}
      </div>

      {/* Participantes */}
      <div className="mb-5 space-y-3">
        <Counter
          label="Adultos"
          sub={adultPrice ? `R$${adultPrice.priceMin}` : undefined}
          value={adults}
          min={1}
          onChange={setAdults}
        />
        {childPrice && (
          <Counter
            label="Crianças"
            sub={childPrice.label.split(" ").slice(1).join(" ")}
            value={children}
            min={0}
            onChange={setChildren}
          />
        )}
      </div>

      {/* Total */}
      {total > 0 && (
        <div className="flex items-center justify-between py-3 border-t border-gray-100 mb-5">
          <span className="text-sm text-gray-500">Total estimado</span>
          <span className="font-bold text-[#111]">R${total}</span>
        </div>
      )}

      {/* Frequência */}
      <div className="mb-5 text-sm text-gray-500 bg-gray-50 rounded-xl px-4 py-3">
        {tour.schedule.frequency === "daily" && (
          <p>📅 Todos os dias • {tour.schedule.departureStart && `Saída: ${tour.schedule.departureStart}`}</p>
        )}
        {tour.schedule.frequency === "specific_days" && (
          <p>📅 {tour.schedule.days} {tour.schedule.departureStart && `• Saída: ${tour.schedule.departureStart}`}</p>
        )}
        {tour.schedule.frequency === "tide_based" && (
          <p>🌊 {tour.schedule.notes ?? "Horário conforme tábua de marés"}</p>
        )}
        {tour.schedule.returnTime && (
          <p className="mt-0.5">🏁 Retorno: {tour.schedule.returnTime}</p>
        )}
      </div>

      {/* CTA */}
      <a
        href={`https://wa.me/${tour.operator.whatsapp}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold py-4 rounded-2xl transition-colors text-[15px]"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.556 4.116 1.523 5.85L.057 23.888l6.198-1.481A11.951 11.951 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.654-.507-5.178-1.389l-.371-.22-3.678.878.927-3.593-.241-.379A9.932 9.932 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
        Reservar pelo WhatsApp
      </a>

      <p className="text-center text-xs text-gray-400 mt-3">
        Resposta em até 30 minutos • Sem cartão necessário
      </p>
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
        <p className="text-sm font-medium text-[#111]">{label}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-8 h-8 rounded-full border border-gray-200 text-[#111] flex items-center justify-center hover:bg-gray-50 transition-colors text-lg font-light disabled:opacity-30"
          disabled={value <= min}
        >
          −
        </button>
        <span className="w-4 text-center font-semibold text-[#111] text-[15px]">{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          className="w-8 h-8 rounded-full border border-gray-200 text-[#111] flex items-center justify-center hover:bg-gray-50 transition-colors text-lg font-light"
        >
          +
        </button>
      </div>
    </div>
  );
}
