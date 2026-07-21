import Link from "next/link";
import Image from "next/image";

const destinos = [
  { name: "Porto Seguro", slug: "porto-seguro", count: 15, image: "/images/porto-seguro-illust.png" },
  { name: "Arraial d'Ajuda", slug: "arraial-da-ajuda", count: 3, image: "/images/arraial-illust.png" },
  { name: "Trancoso", slug: "trancoso", count: 4, image: "/images/trancoso-illust.png" },
  { name: "Caraíva", slug: "caraiva", count: 2, image: "/images/caraiva-illust.png" },
  { name: "Praia do Espelho", slug: "praia-do-espelho", count: 3, image: "/images/espelho-illust.png" },
];

// Recuo esquerdo idêntico ao do conteúdo (1200px centrado) — o trilho começa
// alinhado com o título e sangra até a borda direita do viewport, deixando o
// "cantinho" do próximo card aparecer como convite pra rolar.
const EDGE = "max(24px, calc((100vw - 1200px) / 2))";

export default function DestinosSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6 mb-8 md:mb-10">
        <h2 className="text-[26px] md:text-[32px] font-bold text-[#111] leading-tight">Destinos populares</h2>
        <p className="text-[14px] md:text-base text-[#666] mt-2 md:mt-3 max-w-lg leading-relaxed">
          Escolha seu destino e descubra as melhores experiências com quem conhece de verdade.
        </p>
      </div>

      <div
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ paddingLeft: EDGE, paddingRight: "24px", scrollPaddingLeft: EDGE }}
      >
        {destinos.map((d, i) => (
          <Link
            key={d.slug}
            href={`/destinos/${d.slug}`}
            className={`snap-start flex-shrink-0 group block w-[82vw] md:w-auto ${
              i === 0 ? "md:flex-[0_0_460px]" : "md:flex-[0_0_300px]"
            }`}
          >
            <div className="relative aspect-video md:aspect-auto md:h-[340px] bg-[#e5e5e5] rounded-xl overflow-hidden">
              <Image
                src={d.image}
                alt={d.name}
                fill
                sizes={i === 0 ? "(max-width: 768px) 82vw, 460px" : "(max-width: 768px) 82vw, 300px"}
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <span className="absolute bottom-4 left-4 text-xl md:text-lg text-white font-semibold z-10">
                {d.name}
              </span>
            </div>
            <p className="text-[13px] text-[#888] mt-2">{d.count} experiências</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
