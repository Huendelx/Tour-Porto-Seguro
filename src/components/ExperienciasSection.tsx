import Link from "next/link";
import { getAllTours } from "@/lib/tours-data";
import TourResultCard from "@/components/TourResultCard";

export default async function ExperienciasSection() {
  const tours = await getAllTours();
  // Mesma ordenação do BentoDestaques (featured primeiro): o bento mostra os
  // 3 primeiros, a grid pega os 4 SEGUINTES — sem repetir passeio na home.
  const ordered = [...tours.filter((t) => t.featured), ...tours.filter((t) => !t.featured)];
  const featured = ordered.slice(3, 7);

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-9">
          {featured.map((tour) => (
            <TourResultCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
}
