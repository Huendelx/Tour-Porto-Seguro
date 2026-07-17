"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import WhatsAppBooking from "./WhatsAppBooking";
import type { Tour } from "@/data/tours";

/**
 * Card completo (sticky no desktop) + barra fixa compacta com preço e "Reservar".
 * No mobile a barra fixa sempre aparece (o card completo fica lá embaixo, no
 * fim da coluna única). No desktop o card já é visível de cara — a barra só
 * aparece quando o usuário rola e o card sai da tela, igual o Airbnb.
 */
export default function BookingCard({ tour }: { tour: Tour }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardInView, setCardInView] = useState(true);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCardInView(entry.isIntersecting),
      { rootMargin: "-64px 0px 0px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isFreeCancellation = /cancelamento gratuito/i.test(tour.cancellationPolicy);

  return (
    <>
      <div ref={cardRef} className="lg:sticky lg:top-20">
        <WhatsAppBooking tour={tour} />
      </div>

      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 px-4 py-3 items-center justify-between gap-4 ${
          cardInView ? "flex lg:hidden" : "flex"
        }`}
      >
        <div>
          <p className="text-xs text-gray-400">A partir de</p>
          <p className="text-[22px] font-bold text-[#111] leading-tight">
            R${tour.price}
            <span className="text-sm font-normal text-gray-400"> /pessoa</span>
          </p>
          {isFreeCancellation && (
            <p className="text-xs font-semibold text-[#2d7d46]">Cancelamento gratuito</p>
          )}
        </div>
        <Link
          href={`/reserva/${tour.slug}`}
          className="flex-1 max-w-[200px] bg-[var(--tps-accent)] hover:bg-[var(--tps-accent-hover)] text-[#111] font-semibold text-sm rounded-full py-3 text-center transition-colors"
        >
          Reservar
        </Link>
      </div>
      <div className="h-20" />
    </>
  );
}
