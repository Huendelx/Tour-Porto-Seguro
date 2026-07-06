import Image from "next/image";
import { MapPin } from "lucide-react";
import { TourItineraryStep } from "@/data/tours";

export default function TourItinerary({ steps }: { steps: TourItineraryStep[] }) {
  if (steps.length === 0) return null;

  return (
    <section className="pb-10 mb-10 border-b border-gray-100">
      <h2 className="text-[22px] font-bold text-[#111] mb-6">Roteiro do passeio</h2>

      <div>
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <div key={i} className="relative flex gap-5">
              {/* Trilho com foto */}
              <div className="flex flex-col items-center flex-shrink-0">
                {step.image ? (
                  <div className="relative w-[88px] h-[88px] rounded-2xl overflow-hidden bg-gray-100">
                    <Image src={step.image} alt={step.title} fill sizes="88px" className="object-cover" />
                  </div>
                ) : (
                  <div className="w-[88px] h-[88px] rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                    {isLast ? (
                      <MapPin size={22} strokeWidth={1.5} className="text-gray-400" />
                    ) : (
                      <span className="text-lg font-bold text-gray-300">{i + 1}</span>
                    )}
                  </div>
                )}
                {!isLast && <div className="w-px flex-1 bg-gray-200 my-2" />}
              </div>

              {/* Conteúdo da etapa */}
              <div className={`flex-1 min-w-0 pt-1 ${isLast ? "" : "pb-10"}`}>
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  {step.time && (
                    <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full tabular-nums">
                      {step.time}
                    </span>
                  )}
                  <p className="font-semibold text-[#111] text-[15px] leading-snug">{step.title}</p>
                </div>
                <p className="text-[#666] text-[14px] leading-relaxed mt-1 max-w-lg">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
