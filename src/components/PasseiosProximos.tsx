"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { tours, categoryLabel } from "@/data/tours";

const CARDS = [
  { tour: tours[0], departure: "Saída em 5 min" },
  { tour: tours[1], departure: null },
  { tour: tours[2], departure: null },
  { tour: tours[3], departure: null },
];

export default function PasseiosProximos() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.offsetWidth * CARDS.length);
      setActive(Math.min(idx, CARDS.length - 1));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: (el.offsetWidth / CARDS.length) * i, behavior: "smooth" });
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-[32px] font-bold text-[#111] leading-tight">Passeios próximos</h2>
            <p className="text-base text-[#666] mt-3 max-w-lg leading-relaxed">
              Passeios saindo hoje — garanta sua vaga agora.
            </p>
          </div>
          <Link href="/buscar" className="text-[14px] font-semibold text-[#111] underline whitespace-nowrap mb-2">
            Ver todas →
          </Link>
        </div>

        {/* Cards — scroll mobile, grid desktop */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide lg:grid lg:grid-cols-4 lg:overflow-visible"
          style={{ scrollPaddingLeft: "1.5rem" }}
        >
          {CARDS.map(({ tour, departure }, i) => (
            <div
              key={tour.id}
              className="snap-start flex-shrink-0 w-[78vw] sm:w-[44vw] lg:w-auto bg-white rounded-2xl overflow-hidden border border-[#eee] flex flex-col"
              style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
            >
              {/* Imagem */}
              <div className="relative h-[200px] overflow-hidden bg-[#e0e0e0]">
                <Image
                  src={tour.image}
                  alt={tour.title}
                  fill
                  sizes="(max-width: 768px) 80vw, 25vw"
                  className="object-cover"
                />
                {tour.badge && (
                  <span className="absolute top-3 left-3 bg-[#111] text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                    {tour.badge}
                  </span>
                )}
                <span className="absolute top-3 right-3 bg-white text-[#555] text-[11px] font-medium px-3 py-1 rounded-full">
                  {categoryLabel[tour.category] ?? tour.category}
                </span>
              </div>

              {/* Conteúdo */}
              <div className="p-4 flex flex-col flex-1">
                <p className="text-[12px] text-[#999]">{tour.operator.name}</p>

                <div className="flex items-center justify-between mt-1 mb-2">
                  <h3 className="text-[16px] font-semibold text-[#111] leading-snug">{tour.title}</h3>
                  {departure && (
                    <span className="flex-shrink-0 ml-2 text-[11px] font-bold bg-[#111] text-white px-2.5 py-1 rounded-full whitespace-nowrap">
                      {departure}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-[12px] text-[#888] mb-4">
                  <span className="flex items-center gap-1">
                    <span className="text-[#111] font-semibold">★ 4.9</span>
                    <span className="text-[#bbb]">(avaliações verificadas)</span>
                  </span>
                  <span className="text-[#ddd]">·</span>
                  <span>{tour.duration}</span>
                </div>

                {/* Botão */}
                <Link
                  href={`/passeios/${tour.slug}`}
                  className="mt-auto block w-full text-center bg-[#111] text-white font-semibold text-[14px] py-3 rounded-full hover:bg-[#333] transition-colors"
                >
                  Participar
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline dots */}
        <div className="relative flex items-center justify-between mt-8 lg:mt-6">
          {/* linha de fundo */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-[#ddd]" />
          {/* linha de progresso */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-px bg-[#111] transition-all duration-300"
            style={{ width: `${(active / (CARDS.length - 1)) * 100}%` }}
          />
          {CARDS.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className="relative z-10 transition-all duration-200"
              style={{
                width: active === i ? 14 : 10,
                height: active === i ? 14 : 10,
                borderRadius: "50%",
                background: active === i ? "#111" : "#fff",
                border: `2px solid ${active === i ? "#111" : "#bbb"}`,
                cursor: "pointer",
                padding: 0,
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
