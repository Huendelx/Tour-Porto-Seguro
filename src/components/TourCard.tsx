import { Clock, Users, Check, Anchor, Bus, Compass, TreePalm } from "@phosphor-icons/react/dist/ssr";
import { Tour, categoryLabel } from "@/data/tours";

const categoryIcon: Record<Tour["category"], React.ReactNode> = {
  nautico: <Anchor size={14} weight="fill" />,
  terrestre: <Bus size={14} weight="fill" />,
  aventura: <Compass size={14} weight="fill" />,
  cultural: <TreePalm size={14} weight="fill" />,
};

const categoryColor: Record<Tour["category"], string> = {
  nautico: "var(--tps-ocean)",
  terrestre: "var(--tps-green)",
  aventura: "var(--tps-coral)",
  cultural: "#9333ea",
};

interface Props {
  tour: Tour;
}

export default function TourCard({ tour }: Props) {
  const waMsg = encodeURIComponent(`Olá! Quero saber mais sobre o passeio "${tour.title}".`);
  const waUrl = `https://wa.me/5573999999999?text=${waMsg}`;

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ backgroundColor: "white", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.06)" }}
    >
      {/* image */}
      <div className="relative h-48 flex items-center justify-center bg-[#e5e5e5] overflow-hidden group">
        <img src={tour.image} alt={tour.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

        {tour.badge && (
          <div
            className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: "var(--tps-coral)" }}
          >
            {tour.badge}
          </div>
        )}

        <div
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: categoryColor[tour.category] }}
        >
          {categoryIcon[tour.category]}
          {categoryLabel[tour.category]}
        </div>
      </div>

      {/* content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-bold text-lg leading-tight" style={{ color: "var(--tps-dark)" }}>
            {tour.title}
          </h3>
          <p className="text-sm mt-0.5" style={{ color: "var(--tps-gray)" }}>
            {tour.subtitle}
          </p>
        </div>

        <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--tps-dark)", opacity: 0.75 }}>
          {tour.description}
        </p>

        <div className="flex items-center gap-4 text-xs" style={{ color: "var(--tps-gray)" }}>
          <span className="flex items-center gap-1">
            <Clock size={13} weight="fill" />
            {tour.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users size={13} weight="fill" />
            {tour.groupSize}
          </span>
        </div>

        {tour.includes.length > 0 && (
          <ul className="flex flex-col gap-1">
            {tour.includes.slice(0, 3).map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs" style={{ color: "var(--tps-gray)" }}>
                <Check size={12} weight="bold" style={{ color: "var(--tps-green)", flexShrink: 0 }} />
                {item}
              </li>
            ))}
          </ul>
        )}

        <div className="pt-2 flex items-center justify-between border-t" style={{ borderColor: "var(--tps-sand)" }}>
          <div>
            <span className="text-2xl font-black" style={{ color: "var(--tps-ocean)" }}>
              R$ {tour.price}
            </span>
            <span className="text-xs ml-1" style={{ color: "var(--tps-gray)" }}>
              {tour.priceUnit}
            </span>
          </div>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--tps-coral)" }}
          >
            Reservar
          </a>
        </div>
      </div>
    </div>
  );
}
