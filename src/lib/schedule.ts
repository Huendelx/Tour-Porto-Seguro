import { Tour } from "@/data/tours";

const ABBR = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const MONTHS_PT = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

const WEEKDAYS_PT = [
  "domingo", "segunda-feira", "terça-feira", "quarta-feira",
  "quinta-feira", "sexta-feira", "sábado",
];

/** Nome curto do dia da semana, sem "-feira" ("quarta", "sábado"). */
export const WEEKDAYS_SHORT = [
  "domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado",
];

/** Mês abreviado ("jan", "fev", ...). */
export const MONTHS_SHORT = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

/** O passeio sai neste dia da semana? (0 = domingo … 6 = sábado) */
export function runsOn(weekday: number, t: Tour): boolean {
  const f = t.schedule.frequency;
  if (f === "daily") return true;
  const d = t.schedule.days ?? "";
  if (f === "tide_based") {
    if (!d) return weekday >= 1; // sem dias definidos: seg a sáb
    return d.includes("Seg a Sáb") ? weekday >= 1 : d.includes(ABBR[weekday]);
  }
  if (d.includes("Seg a Sáb")) return weekday >= 1;
  return d.includes(ABBR[weekday]);
}

/** Próxima data (a partir de `from`, inclusive) em que o passeio sai. */
export function nextValidDate(t: Tour, from?: Date): Date {
  const d = from ? new Date(from) : new Date();
  d.setHours(0, 0, 0, 0);
  for (let i = 0; i < 14; i++) {
    if (runsOn(d.getDay(), t)) return d;
    d.setDate(d.getDate() + 1);
  }
  return d;
}

/** Horário de saída em minutos desde 0h ("7h40" → 460); sem horário → fim do dia. */
export function departureMinutes(t: Tour): number {
  const s = t.schedule.departureStart;
  if (!s) return 24 * 60;
  const m = s.match(/(\d+)h(\d+)?/);
  return m ? Number(m[1]) * 60 + Number(m[2] ?? 0) : 24 * 60;
}

/** "sexta-feira, 10 de julho" */
export function formatDatePt(date: Date): string {
  return `${WEEKDAYS_PT[date.getDay()]}, ${date.getDate()} de ${MONTHS_PT[date.getMonth()]}`;
}

/** "2026-07-10" (para URL) */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parse de "2026-07-10" como data local (evita o shift de fuso do new Date(iso)). */
export function fromISODate(iso: string): Date | null {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return isNaN(d.getTime()) ? null : d;
}

/** Descrição curta da frequência ("todos os dias", "seg / qua / sex", "conforme a maré"). */
export function frequencyShort(t: Tour): string {
  if (t.schedule.frequency === "daily") return "todos os dias";
  if (t.schedule.frequency === "tide_based") return "conforme a maré";
  return t.schedule.days?.toLowerCase() ?? "";
}
