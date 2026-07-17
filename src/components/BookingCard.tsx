"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import WhatsAppBooking from "./WhatsAppBooking";
import type { Tour } from "@/data/tours";

/**
 * Card completo (sticky no desktop) + versão compacta com preço e "Reservar"
 * pra quando o card completo sai da tela.
 *
 * Mobile: o card completo fica lá embaixo, no fim da coluna única — a barra
 * compacta é fixa, full-width, sempre visível.
 *
 * Desktop: o card completo começa abaixo do hero (galeria/título), então ao
 * carregar a página ele ainda não apareceu — a versão compacta cobre esse
 * intervalo. Ela é `fixed` (funciona mesmo antes do card entrar na tela),
 * mas com a MESMA largura/posição da coluna do card (390px), não a tela
 * inteira — daí o wrapper com o mesmo max-width do layout da página.
 */
export default function BookingCard({ tour }: { tour: Tour }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardInView, setCardInView] = useState(true);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCardInView(entry.isIntersecting),
      { rootMargin: "-64px 0px -40% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isFreeCancellation = /cancelamento gratuito/i.test(tour.cancellationPolicy);

  const priceBlock = (
    <div>
      <p className="text-xs text-gray-400">A partir de</p>
      <p className="text-[20px] font-bold text-[#111] leading-tight">
        R${tour.price}
        <span className="text-sm font-normal text-gray-400"> /pessoa</span>
      </p>
      {isFreeCancellation && (
        <p className="text-xs font-semibold text-[#2d7d46]">Cancelamento gratuito</p>
      )}
    </div>
  );

  return (
    <>
      <div ref={cardRef} className="lg:sticky lg:top-20">
        <WhatsAppBooking tour={tour} />
      </div>

      {/* ── Mobile: barra fixa full-width, sempre visível ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between gap-4">
        {priceBlock}
        <Link
          href={`/reserva/${tour.slug}`}
          className="flex-1 max-w-[200px] bg-[var(--tps-accent)] hover:bg-[var(--tps-accent-hover)] text-[#111] font-semibold text-sm rounded-full py-3 text-center transition-colors"
        >
          Reservar
        </Link>
      </div>
      <div className="lg:hidden h-20" />

      {/* ── Desktop: versão compacta na largura do card, só antes dele entrar em vista ── */}
      {!cardInView && (
        <div className="hidden lg:block fixed top-20 inset-x-0 z-40 pointer-events-none">
          <div className="max-w-[1280px] mx-auto px-6 flex justify-end">
            <div
              className="w-[390px] pointer-events-auto rounded-3xl border border-gray-100 bg-white p-5 flex items-center justify-between gap-4"
              style={{ boxShadow: "0 6px 24px rgba(0,0,0,0.12)" }}
            >
              {priceBlock}
              <Link
                href={`/reserva/${tour.slug}`}
                className="px-6 py-3 rounded-full bg-[var(--tps-accent)] hover:bg-[var(--tps-accent-hover)] text-[#111] font-semibold text-sm text-center transition-colors flex-shrink-0"
              >
                Reservar
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
