"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { Clock, Heart, Star, MapPin, X } from "lucide-react";
import { Tour } from "@/data/tours";

function frequencyLabel(tour: Tour): string {
  if (tour.schedule.frequency === "daily") return "Todos os dias";
  if (tour.schedule.frequency === "specific_days" && tour.schedule.days) return tour.schedule.days;
  return "Conforme a maré";
}

/** Popup com a timeline do roteiro — inspirado no "Ver itinerário" do ClickBus. */
function RoteiroModal({ tour, onClose }: { tour: Tour; onClose: () => void }) {
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

export default function TourResultCard({ tour }: { tour: Tour }) {
  const [roteiroOpen, setRoteiroOpen] = useState(false);
  const hasRoteiro = (tour.itinerary?.length ?? 0) > 0;

  return (
    <>
      <Link href={`/passeios/${tour.slug}`} className="group block">
        {/* Foto com pills */}
        <div className="relative aspect-square rounded-[24px] overflow-hidden bg-gray-100">
          <Image
            src={tour.image}
            alt={tour.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {tour.badge && (
            <span className="absolute top-3 left-3 text-[12px] font-semibold px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[#111] shadow-sm">
              {tour.badge}
            </span>
          )}
          <span className="absolute top-3 right-3 text-[#111]">
            <span className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center">
              <Heart size={15} strokeWidth={1.75} />
            </span>
          </span>
          <span className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[#111] shadow-sm">
            <Clock size={12} strokeWidth={2} />
            {tour.duration}
          </span>
        </div>

        {/* Texto */}
        <div className="mt-3">
          <p className="font-semibold text-[15px] text-[#111] leading-snug line-clamp-2">{tour.title}</p>
          <p className="text-[13px] text-gray-500 mt-1">
            {frequencyLabel(tour)} · {tour.groupSize}
            {hasRoteiro && (
              <>
                {" · "}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setRoteiroOpen(true);
                  }}
                  className="underline underline-offset-2 decoration-gray-300 hover:decoration-[#111] hover:text-[#111] transition-colors"
                >
                  Ver roteiro
                </button>
              </>
            )}
          </p>
          <p className="text-[13px] text-gray-500 mt-1 flex items-center gap-1 flex-wrap">
            <span>
              A partir de <span className="font-semibold text-[#111]">R$ {tour.price}</span> /pessoa
            </span>
            <span className="text-gray-300">·</span>
            <span className="flex items-center gap-0.5">
              <Star size={11} className="fill-[#111] text-[#111]" />
              4,9
            </span>
          </p>
        </div>
      </Link>

      {roteiroOpen && <RoteiroModal tour={tour} onClose={() => setRoteiroOpen(false)} />}
    </>
  );
}
