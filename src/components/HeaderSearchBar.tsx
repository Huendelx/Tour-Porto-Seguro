"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navigation, CalendarDays, Users } from "lucide-react";

// ─── SHARED DATA ───
interface Destino { id: string; name: string; sub: string; icon?: ReactNode; emoji?: string; }

const DESTINOS: Destino[] = [
  { id: "perto",         name: "Perto de você",             sub: "Descubra experiências na sua região",  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg> },
  { id: "porto-seguro",  name: "Porto Seguro, Bahia",        sub: "Costa do Descobrimento",               emoji: "🏖" },
  { id: "arraial",       name: "Arraial d'Ajuda, Bahia",     sub: "Vilas e praias paradisíacas",          emoji: "🌴" },
  { id: "trancoso",      name: "Trancoso, Bahia",            sub: "Charme e sofisticação",                emoji: "🌺" },
  { id: "caraiva",       name: "Caraíva, Bahia",             sub: "A aldeia mágica sem carros",           emoji: "🛶" },
  { id: "praia-espelho", name: "Praia do Espelho, Bahia",    sub: "Uma das mais bonitas do Brasil",       emoji: "💎" },
];

const MONTHS_PT    = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
const MONTHS_SHORT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const DAYS_PT      = ["D","S","T","Q","Q","S","S"];

function formatDate(d: Date | null) {
  if (!d) return "";
  return `${d.getDate()} de ${MONTHS_SHORT[d.getMonth()].toLowerCase()}.`;
}
function formatGuests(adults: number, kids: number) {
  if (adults === 0 && kids === 0) return "";
  let s = `${adults} adulto${adults > 1 ? "s" : ""}`;
  if (kids > 0) s += `, ${kids} criança${kids > 1 ? "s" : ""}`;
  return s;
}

// ─── CALENDAR ───
function MiniCalendar({ selected, onSelect }: { selected: Date | null; onSelect: (d: Date) => void }) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const canPrev = year > today.getFullYear() || (year === today.getFullYear() && month > today.getMonth());
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isDisabled = (d: number | null) => {
    if (!d) return true;
    return new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };
  const isSel = (d: number | null) =>
    !!selected && !!d && selected.getDate() === d && selected.getMonth() === month && selected.getFullYear() === year;

  const prev = () => { if (!canPrev) return; if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  return (
    <div style={{ minWidth: 280 }}>
      {/* Quick pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {[
          { label: "Hoje",   date: today },
          { label: "Amanhã", date: (() => { const d = new Date(today); d.setDate(d.getDate() + 1); return d; })() },
        ].map((p) => (
          <button key={p.label} onClick={() => onSelect(p.date)}
            style={{ background: "none", border: "1px solid #ddd", borderRadius: 20, padding: "6px 14px", cursor: "pointer", fontSize: 13, color: "#111" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#111")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#ddd")}
          >{p.label}</button>
        ))}
      </div>
      {/* Month header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <button onClick={prev} style={{ background: "none", border: "none", fontSize: 20, cursor: canPrev ? "pointer" : "default", opacity: canPrev ? 1 : 0.2, color: "#111", padding: "0 6px" }}>‹</button>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{MONTHS_PT[month]} {year}</span>
        <button onClick={next} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#111", padding: "0 6px" }}>›</button>
      </div>
      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, textAlign: "center" }}>
        {DAYS_PT.map((d, i) => <div key={i} style={{ fontSize: 11, color: "#999", fontWeight: 500, padding: "4px 0" }}>{d}</div>)}
        {cells.map((d, i) => {
          const dis = isDisabled(d);
          const sel = isSel(d);
          return (
            <div key={i}
              onClick={() => { if (d && !dis) onSelect(new Date(year, month, d)); }}
              style={{
                fontSize: 13, padding: "8px 0", borderRadius: 20,
                cursor: d && !dis ? "pointer" : "default",
                background: sel ? "#111" : "transparent",
                color: sel ? "#fff" : dis ? "#ddd" : "#111",
                fontWeight: sel ? 700 : 400, transition: "background 0.12s",
              }}
              onMouseEnter={(e) => { if (d && !dis && !sel) e.currentTarget.style.background = "#f5f5f5"; }}
              onMouseLeave={(e) => { if (!sel) e.currentTarget.style.background = "transparent"; }}
            >{d || ""}</div>
          );
        })}
      </div>
    </div>
  );
}

// ─── GUEST PICKER ───
function MiniGuestPicker({ adults, kids, onA, onK }: { adults: number; kids: number; onA: (n: number) => void; onK: (n: number) => void; }) {
  const Row = ({ label, sub, val, onChange, min = 0 }: { label: string; sub: string; val: number; onChange: (n: number) => void; min?: number }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #f0f0f0" }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{label}</div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{sub}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => onChange(Math.max(min, val - 1))} disabled={val <= min}
          style={{ width: 32, height: 32, borderRadius: 16, border: "1px solid #ccc", background: "none", fontSize: 18, cursor: val > min ? "pointer" : "default", color: val > min ? "#111" : "#ddd", display: "flex", alignItems: "center", justifyContent: "center" }}
        >−</button>
        <span style={{ fontSize: 15, fontWeight: 600, width: 18, textAlign: "center", color: "#111" }}>{val}</span>
        <button onClick={() => onChange(val + 1)}
          style={{ width: 32, height: 32, borderRadius: 16, border: "1px solid #ccc", background: "none", fontSize: 18, cursor: "pointer", color: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}
        >+</button>
      </div>
    </div>
  );
  return (
    <div style={{ minWidth: 260 }}>
      <Row label="Adultos" sub="13 anos ou mais" val={adults} onChange={onA} min={1} />
      <Row label="Crianças" sub="De 2 a 12 anos" val={kids} onChange={onK} min={0} />
    </div>
  );
}

// ─── DESTINOS LIST ───
function MiniDestinosList({ onSelect }: { onSelect: (d: Destino) => void }) {
  return (
    <div style={{ minWidth: 300 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>Destinos</div>
      {DESTINOS.map((d) => (
        <div key={d.id} onClick={() => onSelect(d)}
          style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 8px", borderRadius: 10, cursor: "pointer" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f7f7f7")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: d.emoji ? 20 : 16, color: "#666", flexShrink: 0 }}>
            {d.emoji || d.icon}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>{d.name}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 1 }}>{d.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ───
export default function HeaderSearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Pre-populate from URL
  const initDestino = DESTINOS.find((d) => d.id === searchParams.get("destino")) ?? null;
  const initDate = searchParams.get("data") ? new Date(searchParams.get("data")!) : null;
  const initAdults = Number(searchParams.get("adultos") ?? 1);
  const initKids = Number(searchParams.get("criancas") ?? 0);

  const [destino, setDestino] = useState<Destino | null>(initDestino);
  const [date, setDate] = useState<Date | null>(initDate);
  const [adults, setAdults] = useState(initAdults);
  const [kids, setKids] = useState(initKids);
  const [active, setActive] = useState<"onde" | "quando" | "quem" | null>(null);

  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setActive(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const onSearch = () => {
    setActive(null);
    const p = new URLSearchParams();
    if (destino) p.set("destino", destino.id);
    if (date) p.set("data", date.toISOString().split("T")[0]);
    if (adults !== 1) p.set("adultos", String(adults));
    if (kids > 0) p.set("criancas", String(kids));
    router.push(`/buscar?${p.toString()}`);
  };

  const fields = [
    { id: "onde",   label: "Onde",   value: destino?.name?.split(",")[0] || "", placeholder: "Destino", icon: <Navigation size={13} strokeWidth={2} /> },
    { id: "quando", label: "Quando", value: formatDate(date),                   placeholder: "Data",     icon: <CalendarDays size={13} strokeWidth={2} /> },
    { id: "quem",   label: "Quem",   value: formatGuests(adults, kids),         placeholder: "Pessoas",  icon: <Users size={13} strokeWidth={2} /> },
  ] as const;

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      {/* ── Compact pill ── */}
      <div style={{
        display: "flex", alignItems: "center",
        background: "#fff", borderRadius: 40,
        border: active ? "1.5px solid #111" : "1.5px solid #e5e5e5",
        boxShadow: active ? "0 4px 20px rgba(0,0,0,0.13)" : "0 1px 6px rgba(0,0,0,0.07)",
        transition: "all 0.2s", overflow: "hidden",
        height: 42,
      }}>
        {fields.map((f, i) => (
          <div key={f.id} style={{ display: "flex", alignItems: "center", flex: f.id === "onde" ? 1.3 : 1 }}>
            <button
              onClick={() => setActive(active === f.id ? null : f.id)}
              style={{
                flex: 1, height: 42, padding: "0 16px",
                background: active === f.id ? "#f5f5f5" : "transparent",
                border: "none", cursor: "pointer", textAlign: "left",
                transition: "background 0.15s", outline: "none",
                display: "flex", alignItems: "center", gap: 6,
              }}
              onMouseEnter={(e) => { if (active !== f.id) e.currentTarget.style.background = "#fafafa"; }}
              onMouseLeave={(e) => { if (active !== f.id) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ color: f.value ? "#111" : "#ccc", flexShrink: 0, lineHeight: 1 }}>{f.icon}</span>
              <span style={{ fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: f.value ? "#111" : "#aaa", fontWeight: f.value ? 500 : 400, maxWidth: 110, lineHeight: 1 }}>
                {f.value || f.placeholder}
              </span>
            </button>
            {i < fields.length - 1 && (
              <div style={{ width: 1, height: 20, background: "#e8e8e8", flexShrink: 0 }} />
            )}
          </div>
        ))}
        {/* Search button */}
        <button onClick={onSearch}
          style={{
            width: 36, height: 36, borderRadius: 20, background: "#111", border: "none",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            marginRight: 3, flexShrink: 0, color: "#fff", transition: "transform 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.07)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>

      {/* ── Dropdowns ── */}
      {active && (
        <div style={{
          position: "absolute", top: "calc(100% + 10px)",
          left: active === "quem" ? "auto" : active === "quando" ? "-20px" : 0,
          right: active === "quem" ? 0 : "auto",
          background: "#fff", borderRadius: 20,
          boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
          border: "1px solid #efefef",
          padding: "20px", zIndex: 100,
        }}>
          {active === "onde" && (
            <MiniDestinosList onSelect={(d) => { setDestino(d); setActive("quando"); }} />
          )}
          {active === "quando" && (
            <MiniCalendar selected={date} onSelect={(d) => { setDate(d); setActive("quem"); }} />
          )}
          {active === "quem" && (
            <div>
              <MiniGuestPicker adults={adults} kids={kids} onA={setAdults} onK={setKids} />
              <button onClick={onSearch}
                style={{
                  marginTop: 16, width: "100%", background: "#111", color: "#fff",
                  border: "none", borderRadius: 12, padding: "12px 0",
                  fontSize: 14, fontWeight: 600, cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >Buscar passeios</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
