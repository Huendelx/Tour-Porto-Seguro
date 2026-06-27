import Link from "next/link";
import Image from "next/image";
import { Clock, Users, Check, Anchor, Bus, Compass, TreePalm, Moon } from "@phosphor-icons/react/dist/ssr";
import { Tour, categoryLabel } from "@/data/tours";

const categoryIcon: Record<string, React.ReactNode> = {
  nautico: <Anchor size={14} weight="fill" />,
  terrestre: <Bus size={14} weight="fill" />,
  aventura: <Compass size={14} weight="fill" />,
  cultural: <TreePalm size={14} weight="fill" />,
  noturno: <Moon size={14} weight="fill" />,
};

const categoryColor: Record<string, string> = {
  nautico: "#0891b2",
  terrestre: "#2d7d46",
  aventura: "#e8602c",
  cultural: "#9333ea",
  noturno: "#1e293b",
};

export default function TourCard({ tour }: { tour: Tour }) {
  const waMsg = encodeURIComponent(`Olá! Quero saber mais sobre o passeio "${tour.title}".`);
  const waUrl = `https://wa.me/${tour.operator.whatsapp}?text=${waMsg}`;

  return (
    <Link
      href={`/passeios/${tour.slug}`}
      className="group rounded-2xl overflow-hidden flex flex-col bg-white hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
      style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.06)" }}
    >
      {/* image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {tour.badge && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-[#e8602c]">
            {tour.badge}
          </span>
        )}
        <span
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: categoryColor[tour.category] }}
        >
          {categoryIcon[tour.category]}
          {categoryLabel[tour.category]}
        </span>
      </div>

      {/* content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-bold text-lg leading-tight text-[#1a1a1a]">{tour.title}</h3>
          <p className="text-sm mt-0.5 text-[#6b7280]">{tour.subtitle}</p>
        </div>

        <p className="text-sm leading-relaxed flex-1 text-[#1a1a1a]/70 line-clamp-2">
          {tour.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-[#6b7280]">
          <span className="flex items-center gap-1">
            <Clock size={13} weight="fill" />
            {tour.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users size={13} weight="fill" />
            {tour.groupSize}
          </span>
          {tour.schedule.frequency === "specific_days" && tour.schedule.days && (
            <span className="text-amber-600 font-medium">{tour.schedule.days}</span>
          )}
        </div>

        {tour.includes.length > 0 && (
          <ul className="flex flex-col gap-1">
            {tour.includes.slice(0, 3).map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs text-[#6b7280]">
                <Check size={12} weight="bold" className="text-green-600 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        )}

        <div className="pt-2 flex items-center justify-between border-t border-[#f5e6c8]">
          <div>
            <span className="text-2xl font-black text-[#006994]">R$ {tour.price}</span>
            <span className="text-xs ml-1 text-[#6b7280]">{tour.priceUnit}</span>
          </div>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="px-4 py-2 rounded-full text-sm font-bold text-white bg-[#e8602c] hover:opacity-90 transition-opacity"
          >
            Reservar
          </a>
        </div>
      </div>
    </Link>
  );
}
