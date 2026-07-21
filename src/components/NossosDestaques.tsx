"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const SLIDES = [
  { id: "buggy",       title: "Aventura nas Dunas",            label: "Passeio de Buggy",      img: "/images/buggy.webp",       operator: "Porto Brasil Turismo", color: "#6366f1", slug: "quadriciclo-acai",   rating: "4,9", desc: "Dunas, trilhas de areia e vento no rosto — o litoral do jeito mais divertido de conhecer." },
  { id: "helicoptero", title: "Voe sobre o paraíso.",           label: "Voo Panorâmico",         img: "/images/helicopter.webp",  operator: "Hélio Sul",            color: "#f43f5e", slug: "trancoso",           rating: "5,0", desc: "A Costa do Descobrimento vista de cima: falésias, recifes e quilômetros de praia deserta." },
  { id: "barco",       title: "Navegue em águas cristalinas.",  label: "Passeio de Lancha",      img: "/images/boat.webp",        operator: "Porto Brasil Turismo", color: "#0ea5e9", slug: "recife-de-fora",     rating: "4,9", desc: "Piscinas naturais, paradas para banho e mar transparente a poucos minutos do pier." },
  { id: "mergulho",    title: "O oceano de outro mundo.",       label: "Mergulho de Cilindro",   img: "/images/mergulho.webp",    operator: "Dive Porto Seguro",    color: "#10b981", slug: "mergulho",           rating: "4,8", desc: "Batismo com instrutor exclusivo por dupla e visibilidade de até 30 metros." },
  { id: "quadriciclo", title: "Adrenalina com vista pro mar.",  label: "Trilha de Quadriciclo",  img: "/images/quadriciclo.webp", operator: "Porto Brasil Turismo", color: "#f97316", slug: "quadriciclo-aldeia", rating: "4,9", desc: "15km de Mata Atlântica, cascatas e uma aldeia Pataxó no fim da trilha." },
  { id: "escuna",      title: "Festa e alegria no mar.",        label: "Passeio de Escuna",      img: "/images/escuna.webp",      operator: "Escuna Sol Mar",       color: "#a855f7", slug: "caraiva",            rating: "4,8", desc: "Música a bordo, paradas para banho e o pôr do sol mais bonito da costa." },
];

type Slide = typeof SLIDES[0];

/**
 * Composição editorial única: um overlay, um padding, tudo ancorado
 * embaixo-esquerda (eyebrow + nota em cima, título → descrição →
 * operador/CTA embaixo). Gradiente cuida da legibilidade.
 */
function SlideCard({ item }: { item: Slide }) {
  return (
    <div className="hl-card-body">
      <img src={item.img} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />

      {/* Gradiente de legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/25 pointer-events-none" />

      {/* Overlay único — mesma escala de padding pra tudo */}
      <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-9">
        {/* Topo: eyebrow + nota */}
        <div className="flex items-start justify-between">
          <span className="text-[11px] md:text-[12px] font-semibold tracking-[0.12em] uppercase text-white/85">
            {item.label}
          </span>
          <span className="flex items-center gap-1 text-[12px] md:text-[13px] font-semibold text-white">
            <Star size={12} className="fill-white" />
            {item.rating}
          </span>
        </div>

        {/* Base: título → descrição → operador/CTA */}
        <div>
          <h3 className="text-white text-[24px] md:text-[40px] font-bold leading-[1.1] tracking-tight max-w-[600px]">
            {item.title}
          </h3>
          <p className="text-white/85 text-[13px] md:text-[15px] leading-relaxed mt-2 md:mt-3 max-w-[480px]">
            {item.desc}
          </p>
          <div className="flex items-center justify-between mt-5 md:mt-7">
            <div className="flex items-center gap-2.5">
              <span
                className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-white border-2 border-white/30 flex-shrink-0"
                style={{ background: item.color }}
              >
                {item.operator.charAt(0)}
              </span>
              <span className="text-[13px] font-medium text-white/90">{item.operator}</span>
            </div>
            <Link
              href={`/passeios/${item.slug}`}
              className="bg-white text-[#111] text-[13px] md:text-[14px] font-semibold px-4 md:px-5 py-2 md:py-2.5 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Ver passeio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Um card por vez, troca seca (sem animação de carrossel). Todos os slides
 * ficam montados e empilhados (invisíveis) pra imagem já estar carregada
 * quando trocar. Setas dentro do card, swipe no touch, navegação em loop.
 */
export default function NossosDestaques() {
  const [active, setActive] = useState(0);
  const total = SLIDES.length;
  const touchX = useRef<number | null>(null);

  const prev = () => setActive((a) => (a - 1 + total) % total);
  const next = () => setActive((a) => (a + 1) % total);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 50) return;
    if (dx < 0) next();
    else prev();
  };

  return (
    <section className="hl-section">
      <div className="hl-head">
        <h2>Nossos destaques</h2>
        <p className="hl-sub">Os passeios mais amados pelos viajantes que passaram por aqui.</p>
      </div>

      <div style={{ padding: "0 max(24px, calc((100vw - 1200px) / 2)) 0" }}>
        <div className="relative" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {SLIDES.map((item, i) => (
            <div key={item.id} className={i === active ? "relative" : "absolute inset-0 invisible pointer-events-none"}>
              <SlideCard item={item} />
            </div>
          ))}

          {/* Setas dentro do card */}
          <button
            type="button"
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow-[0_2px_12px_rgba(0,0,0,0.18)] flex items-center justify-center text-[#111] transition-transform hover:scale-105"
          >
            <ChevronLeft size={20} strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Próximo"
            className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow-[0_2px_12px_rgba(0,0,0,0.18)] flex items-center justify-center text-[#111] transition-transform hover:scale-105"
          >
            <ChevronRight size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Pontinhos — orientação mínima, sem barra de progresso */}
        <div className="flex justify-center gap-2 mt-4">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Slide ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-colors ${i === active ? "bg-[#111]" : "bg-gray-300 hover:bg-gray-400"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
