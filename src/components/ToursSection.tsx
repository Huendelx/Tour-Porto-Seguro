"use client";

import { useState } from "react";
import { tours, Tour, categoryLabel } from "@/data/tours";
import TourCard from "./TourCard";

const categories: Array<Tour["category"] | "todos"> = ["todos", "nautico", "terrestre", "aventura", "cultural"];

export default function ToursSection() {
  const [active, setActive] = useState<Tour["category"] | "todos">("todos");

  const filtered = active === "todos" ? tours : tours.filter((t) => t.category === active);

  return (
    <section id="passeios" className="py-24 px-5" style={{ backgroundColor: "var(--tps-white)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "var(--tps-coral)" }}>
            O que oferecemos
          </p>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: "var(--tps-dark)" }}>
            Nossos passeios
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--tps-gray)" }}>
            Cada passeio é conduzido por guias experientes e apaixonados pela região.
          </p>
        </div>

        {/* filter tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
              style={
                active === cat
                  ? { backgroundColor: "var(--tps-ocean)", color: "white" }
                  : { backgroundColor: "var(--tps-sand)", color: "var(--tps-gray)" }
              }
            >
              {cat === "todos" ? "Todos" : categoryLabel[cat]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
}
