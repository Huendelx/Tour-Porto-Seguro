import Link from "next/link";
import Image from "next/image";

const destinos = [
  { name: "Porto Seguro", slug: "porto-seguro", count: 15, image: "/images/recife.webp" },
  { name: "Arraial d'Ajuda", slug: "arraial-da-ajuda", count: 3, image: "/images/arraial.webp" },
  { name: "Trancoso", slug: "trancoso", count: 4, image: "/images/espelho.webp" },
  { name: "Caraíva", slug: "caraiva", count: 2, image: "/images/caraiva.webp" },
  { name: "Praia do Espelho", slug: "praia-do-espelho", count: 3, image: "/images/espelho.webp" },
];

export default function DestinosSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-[32px] font-bold text-[#111] leading-tight">Destinos populares</h2>
          <p className="text-base text-[#666] mt-3 max-w-lg leading-relaxed">
            Escolha seu destino e descubra as melhores experiências com quem conhece de verdade.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {destinos.map((d) => (
            <Link key={d.slug} href={`/destinos/${d.slug}`} className="cursor-pointer group block">
              <div className="relative h-[280px] bg-[#e5e5e5] rounded-xl overflow-hidden">
                <Image
                  src={d.image}
                  alt={d.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <span className="absolute bottom-4 left-4 text-white font-semibold text-lg z-10">
                  {d.name}
                </span>
              </div>
              <p className="text-[13px] text-[#888] mt-2">{d.count} experiências</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
