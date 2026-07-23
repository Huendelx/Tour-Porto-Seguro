"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { MapPin, X } from "lucide-react";
import type { Tour } from "@/data/tours";

/** Popup com a timeline do roteiro — inspirado no "Ver itinerário" do ClickBus. */
export default function RoteiroModal({ tour, onClose }: { tour: Tour; onClose: () => void }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-[200] bg-black/50 flex items-end md:items-center justify-center md:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-[480px] max-h-[88vh] md:max-h-[80vh] rounded-t-[28px] md:rounded-[28px] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <MapPin size={18} strokeWidth={2} className="text-[#111]" />
          <h2 className="text-[16px] font-bold text-[#111] flex-1 truncate">Roteiro do passeio</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Fechar"
          >
            <X size={19} strokeWidth={2} className="text-[#111]" />
          </button>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <p className="font-semibold text-[15px] text-[#111] leading-snug mb-5">{tour.title}</p>

          <div className="space-y-0">
            {(tour.itinerary ?? []).map((step, i, arr) => (
              <div key={i} className="flex gap-4">
                {/* Hora + linha */}
                <div className="flex flex-col items-center flex-shrink-0 w-[52px]">
                  <span className="text-[13px] font-bold text-[#111] tabular-nums leading-none pt-0.5">
                    {step.time ?? "—"}
                  </span>
                  {i < arr.length - 1 && <span className="w-px flex-1 bg-gray-200 my-2" />}
                </div>
                {/* Conteúdo */}
                <div className={i < arr.length - 1 ? "pb-6" : ""}>
                  <p className="text-[14px] font-semibold text-[#111] leading-snug">{step.title}</p>
                  <p className="text-[13px] text-gray-500 leading-relaxed mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {tour.meetingPoint && (
            <p className="text-[13px] text-gray-500 mt-6 pt-5 border-t border-gray-100">
              <span className="font-semibold text-[#111]">Ponto de encontro: </span>
              {tour.meetingPoint}
            </p>
          )}

          <p className="text-[12px] text-gray-400 mt-4">
            Roteiro sujeito a condições de clima e maré — confirmado na reserva.
          </p>
        </div>

        {/* Footer — preço + CTA */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <div>
            <p className="text-[11px] text-gray-400">A partir de</p>
            <p className="text-[18px] font-bold text-[#111] leading-tight">
              R$ {tour.price}
              <span className="text-[12px] font-normal text-gray-400"> /pessoa</span>
            </p>
          </div>
          <Link
            href={`/reserva/${tour.slug}`}
            className="px-7 py-3 rounded-full bg-[var(--tps-accent)] hover:bg-[var(--tps-accent-hover)] text-[#111] text-[14px] font-semibold transition-colors"
          >
            Reservar
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
