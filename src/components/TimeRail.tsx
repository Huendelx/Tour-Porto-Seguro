/**
 * Trilho vertical de horários (● saída — linha — ● retorno).
 * Elemento de organização visual pra pontos-chave (checkout, cards).
 */
export default function TimeRail({
  departure,
  returnTime,
  departureLabel = "saída",
  returnLabel = "retorno",
}: {
  departure: string;
  returnTime?: string;
  departureLabel?: string;
  returnLabel?: string;
}) {
  return (
    <div className="flex gap-3.5">
      {/* Trilho */}
      <div className="flex flex-col items-center py-[5px]">
        <span className="w-3 h-3 rounded-full bg-[#111] flex-shrink-0" />
        {returnTime && <span className="w-[2px] flex-1 bg-[#111] my-1 min-h-[28px]" />}
        {returnTime && <span className="w-3 h-3 rounded-full bg-[#111] flex-shrink-0" />}
      </div>

      {/* Horários */}
      <div className="flex flex-col justify-between">
        <p className="leading-tight">
          <span className="text-[17px] font-bold text-[#111] tabular-nums">{departure}</span>
          <span className="text-[12px] text-gray-400 ml-2">{departureLabel}</span>
        </p>
        {returnTime && (
          <p className="leading-tight">
            <span className="text-[17px] font-bold text-[#111] tabular-nums">{returnTime}</span>
            <span className="text-[12px] text-gray-400 ml-2">{returnLabel}</span>
          </p>
        )}
      </div>
    </div>
  );
}
