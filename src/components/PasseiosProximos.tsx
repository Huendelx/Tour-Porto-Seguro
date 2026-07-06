"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { tours, Tour } from "@/data/tours";

const ABBR = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function runsOn(day: number, t: Tour): boolean {
  const f = t.schedule.frequency;
  if (f === "daily") return true;
  const d = t.schedule.days ?? "";
  if (f === "tide_based") return d ? d.includes("Seg a Sáb") ? day >= 1 : d.includes(ABBR[day]) : day >= 1;
  if (d.includes("Seg a Sáb")) return day >= 1;
  return d.includes(ABBR[day]);
}

function departureMinutes(t: Tour): number {
  const s = t.schedule.departureStart;
  if (!s) return 24 * 60;
  const m = s.match(/(\d+)h(\d+)?/);
  return m ? Number(m[1]) * 60 + Number(m[2] ?? 0) : 24 * 60;
}

function freqShort(t: Tour): string {
  if (t.schedule.frequency === "daily") return "todos os dias";
  if (t.schedule.frequency === "tide_based") return "conforme a maré";
  return t.schedule.days?.toLowerCase() ?? "";
}

export default function PasseiosProximos() {
  // antes de montar: lista neutra (diários), sem rótulo de dia — evita mismatch de hidratação
  const [dayLabel, setDayLabel] = useState<string | null>(null);
  const [list, setList] = useState<Tour[]>(
    tours.filter((t) => t.schedule.frequency === "daily").sort((a, b) => departureMinutes(a) - departureMinutes(b)).slice(0, 5)
  );

  useEffect(() => {
    const now = new Date();
    let day = now.getDay();
    let label = "hoje";
    // depois das 9h as saídas do dia já partiram — mostra as de amanhã
    if (now.getHours() >= 9) {
      day = (day + 1) % 7;
      label = "amanhã";
    }
    setList(
      tours.filter((t) => runsOn(day, t)).sort((a, b) => departureMinutes(a) - departureMinutes(b)).slice(0, 5)
    );
    setDayLabel(label);
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-[32px] font-bold text-[#111] leading-tight">Próximas saídas</h2>
            <p className="text-base text-[#666] mt-3 max-w-lg leading-relaxed flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              Saídas confirmadas{dayLabel ? ` para ${dayLabel}` : ""} — garanta sua vaga.
            </p>
          </div>
          <Link href="/buscar" className="text-[14px] font-semibold text-[#111] underline whitespace-nowrap mb-2">
            Ver todas →
          </Link>
        </div>

        {/* Painel de saídas */}
        <div className="rounded-3xl border border-gray-100 divide-y divide-gray-100 overflow-hidden" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>
          {list.map((tour) => (
            <Link
              key={tour.id}
              href={`/passeios/${tour.slug}`}
              className="group flex items-center gap-4 md:gap-6 px-5 md:px-8 py-5 hover:bg-gray-50 transition-colors"
            >
              {/* Horário */}
              <div className="w-[64px] md:w-[76px] flex-shrink-0 text-center">
                <p className="text-[19px] md:text-[22px] font-bold text-[#111] tabular-nums leading-none">
                  {tour.schedule.departureStart ?? "—"}
                </p>
                <p className="text-[10px] md:text-[11px] text-gray-400 mt-1.5 leading-tight">{freqShort(tour)}</p>
              </div>

              {/* Miniatura */}
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 hidden sm:block">
                <Image src={tour.image} alt={tour.title} fill sizes="56px" className="object-cover" />
              </div>

              {/* Título */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[15px] text-[#111] leading-snug line-clamp-1">{tour.title}</p>
                <p className="text-[13px] text-gray-500 mt-0.5 line-clamp-1">
                  {tour.duration} · {tour.groupSize}
                </p>
              </div>

              {/* Preço */}
              <div className="text-right flex-shrink-0">
                <p className="text-[11px] text-gray-400">a partir de</p>
                <p className="font-bold text-[15px] text-[#111]">R$ {tour.price}</p>
              </div>

              <ArrowRight
                size={18}
                strokeWidth={1.75}
                className="flex-shrink-0 text-gray-300 group-hover:text-[#111] group-hover:translate-x-0.5 transition-all hidden sm:block"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
