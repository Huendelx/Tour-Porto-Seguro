import Link from "next/link";
import Image from "next/image";
import { Clock, CalendarDays, Waves, BadgeCheck, Star } from "lucide-react";
import { Tour, categoryLabel } from "@/data/tours";

function ScheduleInfo({ tour }: { tour: Tour }) {
  if (tour.schedule.frequency === "daily")
    return (
      <span className="flex items-center gap-1">
        <CalendarDays size={12} strokeWidth={1.75} />
        Todos os dias
      </span>
    );
  if (tour.schedule.frequency === "specific_days" && tour.schedule.days)
    return (
      <span className="flex items-center gap-1">
        <CalendarDays size={12} strokeWidth={1.75} />
        {tour.schedule.days}
      </span>
    );
  if (tour.schedule.frequency === "tide_based")
    return (
      <span className="flex items-center gap-1">
        <Waves size={12} strokeWidth={1.75} />
        Conforme a maré
      </span>
    );
  return null;
}

export default function TourResultCard({ tour }: { tour: Tour }) {
  return (
    <Link
      href={`/passeios/${tour.slug}`}
      className="group flex flex-col h-full rounded-2xl overflow-hidden border border-gray-100 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Imagem */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        {tour.badge && (
          <span className="absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white text-[#111] shadow-sm">
            {tour.badge}
          </span>
        )}
        <span className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-black/40 text-white backdrop-blur-sm">
          <Clock size={11} strokeWidth={2} />
          {tour.duration}
        </span>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-1.5">
          <span className="uppercase tracking-wide font-medium">{categoryLabel[tour.category]}</span>
          <span className="text-gray-300">·</span>
          <ScheduleInfo tour={tour} />
        </div>

        <p className="font-semibold text-[15px] text-[#111] leading-snug">{tour.title}</p>
        <p className="text-[13px] text-gray-400 mt-0.5 line-clamp-1">{tour.subtitle}</p>

        <div className="flex items-center gap-1.5 mt-2.5 text-[12px]">
          <Star size={13} className="fill-[#111] text-[#111]" />
          <span className="font-semibold text-[#111]">4.9</span>
          <span className="text-gray-300 mx-0.5">·</span>
          <BadgeCheck size={14} strokeWidth={2} className="text-[#2d7d46]" />
          <span className="text-gray-500">Operador verificado</span>
        </div>

        <div className="mt-auto pt-3 border-t border-gray-100 flex items-end justify-between">
          <div className="leading-none">
            <p className="text-[11px] text-gray-400 mb-1">a partir de</p>
            <p>
              <span className="text-[19px] font-bold text-[#111]">R$ {tour.price}</span>
              <span className="text-[12px] text-gray-400"> /pessoa</span>
            </p>
          </div>
          <span className="text-xs font-semibold text-[#111] bg-gray-100 px-3.5 py-2 rounded-full group-hover:bg-[#111] group-hover:text-white transition-colors">
            Ver →
          </span>
        </div>
      </div>
    </Link>
  );
}
