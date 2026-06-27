import Link from "next/link";
import Image from "next/image";
import { tours } from "@/data/tours";

const featured = tours.filter((t) => t.featured).slice(0, 4);

export default function ExperienciasSection() {
  return (
    <section className="py-20 bg-[#fafafa]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-[32px] font-bold text-[#111] leading-tight">Experiências em destaque</h2>
            <p className="text-base text-[#666] mt-3 max-w-lg leading-relaxed">
              As mais reservadas e bem avaliadas pelos viajantes.
            </p>
          </div>
          <Link href="/buscar" className="text-[14px] font-semibold text-[#111] underline whitespace-nowrap mb-2">
            Ver todas →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((tour) => (
            <Link
              key={tour.id}
              href={`/passeios/${tour.slug}`}
              className="group bg-white rounded-xl overflow-hidden border border-[#eee] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 block"
            >
              <div className="h-[200px] bg-[#e0e0e0] relative overflow-hidden">
                <Image
                  src={tour.image}
                  alt={tour.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {tour.badge && (
                  <span className="absolute top-3 left-3 bg-[#111] text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                    {tour.badge}
                  </span>
                )}
                <span className="absolute top-3 right-3 bg-white text-[#555] text-[11px] font-medium px-3 py-1 rounded-full capitalize">
                  {tour.category}
                </span>
              </div>
              <div className="p-4 pb-5">
                <p className="text-[12px] text-[#999] m-0">{tour.operator.name}</p>
                <h3 className="text-[16px] font-semibold text-[#111] mt-1 mb-2 leading-snug">{tour.title}</h3>
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-[13px] font-semibold text-[#111]">★ 4.9</span>
                  <span className="text-[12px] text-[#999]">(avaliações verificadas)</span>
                  <span className="text-[#bbb] mx-1">·</span>
                  <span className="text-[12px] text-[#888]">{tour.duration}</span>
                </div>
                <div className="border-t border-[#f0f0f0] pt-3 flex justify-between items-center">
                  <div>
                    <span className="text-[20px] font-bold text-[#111]">R$ {tour.price}</span>
                    <span className="text-[13px] text-[#888] ml-1">/ pessoa</span>
                  </div>
                  <span className="text-xs font-semibold text-[#111] bg-gray-100 px-3 py-1.5 rounded-full group-hover:bg-[#111] group-hover:text-white transition-colors">
                    Ver →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
