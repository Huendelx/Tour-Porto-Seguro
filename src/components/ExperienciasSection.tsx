import Link from "next/link";
import { tours } from "@/data/tours";
import TourResultCard from "@/components/TourResultCard";

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-9">
          {featured.map((tour) => (
            <TourResultCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
}
