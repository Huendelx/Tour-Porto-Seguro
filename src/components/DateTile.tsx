import { WEEKDAYS_SHORT, MONTHS_SHORT } from "@/lib/schedule";

/**
 * Folhinha de calendário — faixa amarela com o dia da semana, número grande
 * e mês. Par visual do TimeRail nos pontos-chave (checkout, cards).
 */
export default function DateTile({ date }: { date: Date }) {
  const wd = WEEKDAYS_SHORT[date.getDay()].slice(0, 3);
  return (
    <div className="w-[62px] rounded-xl border border-gray-200 overflow-hidden text-center flex-shrink-0 bg-white">
      <div className="bg-[var(--tps-accent)] text-[10px] font-bold uppercase tracking-widest text-[#111] py-1">
        {wd}
      </div>
      <div className="py-1.5">
        <div className="text-[22px] font-bold text-[#111] leading-none tabular-nums">{date.getDate()}</div>
        <div className="text-[11px] text-gray-400 mt-0.5">{MONTHS_SHORT[date.getMonth()]}</div>
      </div>
    </div>
  );
}
