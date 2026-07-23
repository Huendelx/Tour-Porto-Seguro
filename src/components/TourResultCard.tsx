"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Heart, Star } from "lucide-react";
import { Tour } from "@/data/tours";
import RoteiroModal from "./RoteiroModal";

function frequencyLabel(tour: Tour): string {
  if (tour.schedule.frequency === "daily") return "Todos os dias";
  if (tour.schedule.frequency === "specific_days" && tour.schedule.days) return tour.schedule.days;
  return "Conforme a maré";
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
