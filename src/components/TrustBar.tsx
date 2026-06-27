import { Star } from "@phosphor-icons/react/dist/ssr";

const items = [
  { text: "4.9 (800+ avaliações)", icon: true },
  { text: "+12 anos de experiência" },
  { text: "Guias licenciados CADASTUR" },
  { text: "4.9 (800+ avaliações)", icon: true },
  { text: "+12 anos de experiência" },
  { text: "Guias licenciados CADASTUR" },
  { text: "4.9 (800+ avaliações)", icon: true },
  { text: "+12 anos de experiência" },
  { text: "Guias licenciados CADASTUR" },
];

export default function TrustBar() {
  return (
    <div className="w-full overflow-hidden py-3 border-y border-black/6 bg-white">
      <div className="flex gap-10 animate-marquee whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-sm text-[#041610]/60 flex-shrink-0">
            {item.icon && (
              <span className="flex items-center gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={11} weight="fill" style={{ color: "var(--tps-coral)" }} />
                ))}
              </span>
            )}
            {!item.icon && <span className="text-[#041610]/20">·</span>}
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}
