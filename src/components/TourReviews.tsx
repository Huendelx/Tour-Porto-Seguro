"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Review } from "@/data/reviews";

const CLAMP_CHARS = 190;

function ReviewItem({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.text.length > CLAMP_CHARS;
  const shown = expanded || !isLong ? review.text : review.text.slice(0, CLAMP_CHARS).trimEnd() + "…";

  return (
    <div>
      {/* Avatar + nome */}
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[16px] font-semibold text-gray-500 flex-shrink-0">
          {review.name.charAt(0)}
        </div>
        <div>
          <p className="text-[15px] font-semibold text-[#111] leading-tight">{review.name}</p>
          <p className="text-[13px] text-gray-500 mt-0.5">{review.from}</p>
        </div>
      </div>

      {/* Estrelas + data */}
      <div className="flex items-center gap-2 mt-3.5">
        <span className="flex gap-[2px]">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} size={11} className="fill-[#111] text-[#111]" />
          ))}
        </span>
        <span className="text-gray-300">·</span>
        <span className="text-[13px] text-gray-500">{review.date}</span>
      </div>

      {/* Texto */}
      <p className="text-[15px] text-[#333] leading-relaxed mt-3">{shown}</p>
      {isLong && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-1.5 text-[15px] font-semibold text-[#111] underline underline-offset-2"
        >
          Mostrar mais
        </button>
      )}
    </div>
  );
}

export default function TourReviews({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  return (
    <section className="pb-10 mb-10 border-b border-gray-100">
      <h2 className="flex items-center gap-2 text-[22px] font-bold text-[#111] mb-8">
        <Star size={19} className="fill-[#111] text-[#111]" />
        4,9 · avaliações de viajantes
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        {reviews.map((r, i) => (
          <ReviewItem key={i} review={r} />
        ))}
      </div>
    </section>
  );
}
