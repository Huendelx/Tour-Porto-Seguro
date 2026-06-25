"use client";

import { useState, useRef, useEffect, ReactNode } from "react";

// ─── ICONS ───
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const NavIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
);
const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

// ─── DATA ───
interface Destino {
  id: string;
  name: string;
  sub: string;
  icon?: ReactNode;
  emoji?: string;
}

const DESTINOS: Destino[] = [
  { id: "perto", name: "Perto de você", sub: "Descubra experiências na sua região", icon: <NavIcon /> },
  { id: "porto-seguro", name: "Porto Seguro, Bahia", sub: "Costa do Descobrimento", emoji: "🏖" },
  { id: "arraial", name: "Arraial d'Ajuda, Bahia", sub: "Vilas e praias paradisíacas", emoji: "🌴" },
  { id: "trancoso", name: "Trancoso, Bahia", sub: "Charme e sofisticação", emoji: "🌺" },
  { id: "caraiva", name: "Caraíva, Bahia", sub: "A aldeia mágica sem carros", emoji: "🛶" },
  { id: "praia-espelho", name: "Praia do Espelho, Bahia", sub: "Uma das mais bonitas do Brasil", emoji: "💎" },
];

const MONTHS_PT = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
const MONTHS_SHORT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const DAYS_PT = ["D","S","T","Q","Q","S","S"];

// ─── HOOKS ───
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

// ─── FORMAT HELPERS ───
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
function Calendar({ selected, onSelect, monthsToShow = 1 }: { selected: Date | null; onSelect: (d: Date) => void; monthsToShow?: number }) {
  const today = new Date();
  const [startMonth, setStartMonth] = useState(today.getMonth());
  const [startYear, setStartYear] = useState(today.getFullYear());

  const canGoPrev = startYear > today.getFullYear() || (startYear === today.getFullYear() && startMonth > today.getMonth());

  const renderMonth = (offset: number) => {
    let m = startMonth + offset;
    let y = startYear;
    if (m > 11) { m -= 12; y += 1; }

    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const firstDay = new Date(y, m, 1).getDay();
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const isDisabled = (d: number | null) => {
      if (!d) return true;
      return new Date(y, m, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    };
    const isSel = (d: number | null) =>
      !!selected && !!d && selected.getDate() === d && selected.getMonth() === m && selected.getFullYear() === y;

    return (
      <div key={`${y}-${m}`} style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#111", marginBottom: 16 }}>
          {MONTHS_PT[m]} {y}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, textAlign: "center" }}>
          {DAYS_PT.map((d, i) => (
            <div key={i} style={{ fontSize: 12, color: "#999", fontWeight: 500, padding: "6px 0" }}>{d}</div>
          ))}
          {cells.map((d, i) => {
            const disabled = isDisabled(d);
            const sel = isSel(d);
            return (
              <div
                key={i}
                onClick={() => { if (d && !disabled) onSelect(new Date(y, m, d)); }}
                style={{
                  fontSize: 14, padding: "10px 0", borderRadius: 24,
                  cursor: d && !disabled ? "pointer" : "default",
                  background: sel ? "#111" : "transparent",
                  color: sel ? "#fff" : disabled ? "#ddd" : "#111",
                  fontWeight: sel ? 700 : 400,
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => { if (d && !disabled && !sel) e.currentTarget.style.background = "#f5f5f5"; }}
                onMouseLeave={(e) => { if (!sel) e.currentTarget.style.background = "transparent"; }}
              >
                {d || ""}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <button
          onClick={() => {
            if (!canGoPrev) return;
            if (startMonth === 0) { setStartMonth(11); setStartYear(startYear - 1); }
            else setStartMonth(startMonth - 1);
          }}
          style={{ background: "none", border: "none", fontSize: 20, cursor: canGoPrev ? "pointer" : "default", opacity: canGoPrev ? 1 : 0.2, color: "#111", padding: "4px 8px" }}
        >‹</button>
        <button
          onClick={() => {
            if (startMonth === 11) { setStartMonth(0); setStartYear(startYear + 1); }
            else setStartMonth(startMonth + 1);
          }}
          style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#111", padding: "4px 8px" }}
        >›</button>
      </div>
      <div style={{ display: "flex", gap: 32 }}>
        {Array.from({ length: monthsToShow }).map((_, i) => renderMonth(i))}
      </div>
    </div>
  );
}

// ─── QUICK DATE PILLS ───
function QuickDates({ onSelect }: { onSelect: (d: Date) => void }) {
  const today = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const weekend = new Date(today);
  const daysToSat = (6 - today.getDay() + 7) % 7 || 7;
  weekend.setDate(today.getDate() + daysToSat);

  const pills = [
    { label: "Hoje", sub: `${today.getDate()} de ${MONTHS_SHORT[today.getMonth()].toLowerCase()}.`, date: today },
    { label: "Amanhã", sub: `${tomorrow.getDate()} de ${MONTHS_SHORT[tomorrow.getMonth()].toLowerCase()}.`, date: tomorrow },
    { label: "Este fim de semana", sub: `${weekend.getDate()} de ${MONTHS_SHORT[weekend.getMonth()].toLowerCase()}.`, date: weekend },
  ];

  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
      {pills.map((p, i) => (
        <button
          key={i}
          onClick={() => onSelect(p.date)}
          style={{
            background: "none", border: "1px solid #ddd", borderRadius: 12,
            padding: "10px 16px", cursor: "pointer", textAlign: "left",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#111")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#ddd")}
        >
          <div style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{p.label}</div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{p.sub}</div>
        </button>
      ))}
    </div>
  );
}

// ─── GUEST PICKER ───
function GuestPicker({ adults, kids, onChangeAdults, onChangeKids }: {
  adults: number; kids: number;
  onChangeAdults: (n: number) => void; onChangeKids: (n: number) => void;
}) {
  const [pets, setPets] = useState(0);

  const Stepper = ({ label, sub, value, onChange, min = 0 }: { label: string; sub: string; value: number; onChange: (n: number) => void; min?: number }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", borderBottom: "1px solid #f0f0f0" }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>{label}</div>
        <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{sub}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          style={{
            width: 36, height: 36, borderRadius: 18, border: "1px solid #ccc",
            background: "none", fontSize: 20, cursor: value > min ? "pointer" : "default",
            color: value > min ? "#111" : "#ddd", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >−</button>
        <span style={{ fontSize: 16, fontWeight: 600, width: 20, textAlign: "center", color: "#111" }}>{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          style={{
            width: 36, height: 36, borderRadius: 18, border: "1px solid #ccc",
            background: "none", fontSize: 20, cursor: "pointer",
            color: "#111", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >+</button>
      </div>
    </div>
  );

  return (
    <div>
      <Stepper label="Adultos" sub="13 anos ou mais" value={adults} onChange={onChangeAdults} min={1} />
      <Stepper label="Crianças" sub="De 2 a 12 anos" value={kids} onChange={onChangeKids} min={0} />
      <Stepper label="Pets" sub="Cães, gatos e outros" value={pets} onChange={setPets} min={0} />
    </div>
  );
}

// ─── DESTINOS LIST ───
function DestinosList({ onSelect }: { onSelect: (d: Destino) => void }) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 500, color: "#888", marginBottom: 12 }}>Destinos sugeridos</div>
      {DESTINOS.map((d) => (
        <div
          key={d.id}
          onClick={() => onSelect(d)}
          style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 8px", borderRadius: 12, cursor: "pointer" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f7f7f7")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <div style={{
            width: 48, height: 48, borderRadius: 12, background: "#f5f5f5",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: d.emoji ? 24 : 18, color: "#666", flexShrink: 0,
          }}>
            {d.emoji || d.icon}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{d.name}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 1 }}>{d.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════
// DESKTOP SEARCH BAR
// ═══════════════════════════════════════════
interface SearchProps {
  destino: Destino | null; setDestino: (d: Destino | null) => void;
  date: Date | null; setDate: (d: Date | null) => void;
  adults: number; setAdults: (n: number) => void;
  kids: number; setKids: (n: number) => void;
}

function DesktopSearch({ destino, setDestino, date, setDate, adults, setAdults, kids, setKids }: SearchProps) {
  const [active, setActive] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setActive(null));

  const fields = [
    { id: "onde", label: "Onde", value: destino?.name?.split(",")[0] || "", placeholder: "Buscar destinos" },
    { id: "quando", label: "Quando", value: formatDate(date), placeholder: "Adicionar data" },
    { id: "quem", label: "Quem", value: formatGuests(adults, kids), placeholder: "Participantes" },
  ];

  return (
    <div ref={ref} style={{ position: "relative", maxWidth: 720, width: "100%", margin: "0 auto" }}>
      <div style={{
        display: "flex", alignItems: "center", background: "#fff",
        borderRadius: 60, position: "relative",
        boxShadow: active ? "0 8px 32px rgba(0,0,0,0.16)" : "0 2px 12px rgba(0,0,0,0.08)",
        transition: "box-shadow 0.25s", border: "1px solid #eee",
      }}>
        {fields.map((f, i) => (
          <div key={f.id} style={{ display: "flex", alignItems: "center", flex: f.id === "onde" ? 1.4 : 1 }}>
            <button
              onClick={() => setActive(active === f.id ? null : f.id)}
              style={{
                flex: 1, padding: "14px 24px",
                background: active === f.id ? "#f0f0f0" : "transparent",
                border: "none", borderRadius: 60, cursor: "pointer", textAlign: "left",
                transition: "background 0.15s", outline: "none",
              }}
              onMouseEnter={(e) => { if (active !== f.id) e.currentTarget.style.background = "#f7f7f7"; }}
              onMouseLeave={(e) => { if (active !== f.id) e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: "#111", letterSpacing: "0.02em", textTransform: "uppercase" }}>
                {f.label}
              </div>
              <div style={{
                fontSize: 14, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                color: f.value ? "#111" : "#999", fontWeight: f.value ? 500 : 400,
              }}>
                {f.value || f.placeholder}
              </div>
            </button>
            {i < fields.length - 1 && <div style={{ width: 1, height: 28, background: "#e5e5e5", flexShrink: 0 }} />}
          </div>
        ))}
        <button
          onClick={() => setActive(null)}
          style={{
            width: 52, height: 52, borderRadius: 26, background: "#111", border: "none",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            marginRight: 6, flexShrink: 0, color: "#fff",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <SearchIcon />
        </button>
      </div>

      {active === "onde" && (
        <div style={{
          position: "absolute", top: "calc(100% + 12px)", left: 0, width: 420,
          background: "#fff", borderRadius: 20, boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
          padding: "20px 16px", zIndex: 50, maxHeight: 420, overflowY: "auto",
        }}>
          <DestinosList onSelect={(d) => { setDestino(d); setActive("quando"); }} />
        </div>
      )}

      {active === "quando" && (
        <div style={{
          position: "absolute", top: "calc(100% + 12px)", left: 0, right: 0,
          background: "#fff", borderRadius: 20, boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
          padding: "24px 28px", zIndex: 50,
        }}>
          <QuickDates onSelect={(d) => { setDate(d); setActive("quem"); }} />
          <Calendar selected={date} onSelect={(d) => { setDate(d); setActive("quem"); }} monthsToShow={2} />
        </div>
      )}

      {active === "quem" && (
        <div style={{
          position: "absolute", top: "calc(100% + 12px)", right: 0,
          background: "#fff", borderRadius: 20, boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
          padding: "20px 24px", zIndex: 50, width: 340,
        }}>
          <GuestPicker adults={adults} kids={kids} onChangeAdults={setAdults} onChangeKids={setKids} />
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// MOBILE SEARCH
// ═══════════════════════════════════════════
function MobileSearch({ destino, setDestino, date, setDate, adults, setAdults, kids, setKids }: SearchProps) {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState("onde");
  const [subPage, setSubPage] = useState<string | null>(null);

  const summaryText = (destino || date)
    ? `${destino?.name?.split(",")[0] || "Destino"} · ${formatDate(date) || "Datas"} · ${formatGuests(adults, kids) || "Participantes"}`
    : null;

  const handleClear = () => {
    setDestino(null); setDate(null); setAdults(1); setKids(0);
    setActiveStep("onde"); setSubPage(null);
  };

  if (!open) {
    return (
      <button
        onClick={() => { setOpen(true); setActiveStep("onde"); }}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          width: "100%", background: "#fff", border: "1px solid #eee", borderRadius: 40,
          padding: "16px 24px", cursor: "pointer",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}
      >
        <span style={{ color: "#111", display: "flex" }}><SearchIcon /></span>
        <span style={{ fontSize: 15, fontWeight: 500, color: "#555" }}>
          {summaryText || "Pesquisar passeios"}
        </span>
      </button>
    );
  }

  if (subPage === "destinos") {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#fff", zIndex: 1000, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, border: "2px solid #111", borderRadius: 12, padding: "12px 16px" }}>
            <button onClick={() => setSubPage(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#111", padding: 0, display: "flex" }}>
              <ArrowLeftIcon />
            </button>
            <input
              autoFocus
              placeholder="Cidade ou ponto de referência"
              style={{ flex: 1, border: "none", outline: "none", fontSize: 16, color: "#111", background: "transparent" }}
            />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          <DestinosList onSelect={(d) => { setDestino(d); setSubPage(null); setActiveStep("quando"); }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "#f7f7f7", zIndex: 1000, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "16px 16px 8px" }}>
        <button
          onClick={() => setOpen(false)}
          style={{
            width: 36, height: 36, borderRadius: 18, border: "1px solid #ddd",
            background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#111",
          }}
        >
          <XIcon />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 120px" }}>
        {/* ONDE */}
        <div style={{
          background: "#fff", borderRadius: 20, marginBottom: 12,
          boxShadow: activeStep === "onde" ? "0 4px 16px rgba(0,0,0,0.08)" : "none",
        }}>
          {activeStep === "onde" ? (
            <div style={{ padding: "24px 20px" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#111", marginBottom: 16 }}>Onde?</div>
              <div
                onClick={() => setSubPage("destinos")}
                style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid #ddd", borderRadius: 12, padding: "14px 16px", cursor: "pointer" }}
              >
                <span style={{ color: "#888", display: "flex" }}><SearchIcon /></span>
                <span style={{ fontSize: 15, color: destino ? "#111" : "#999", fontWeight: destino ? 500 : 400 }}>
                  {destino?.name || "Cidade ou ponto de referência"}
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setActiveStep("onde")}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", background: "none", border: "none", cursor: "pointer" }}
            >
              <span style={{ fontSize: 14, color: "#888" }}>Onde</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{destino?.name?.split(",")[0] || "Qualquer lugar"}</span>
            </button>
          )}
        </div>

        {/* QUANDO */}
        <div style={{
          background: "#fff", borderRadius: 20, marginBottom: 12,
          boxShadow: activeStep === "quando" ? "0 4px 16px rgba(0,0,0,0.08)" : "none",
        }}>
          {activeStep === "quando" ? (
            <div style={{ padding: "24px 20px" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#111", marginBottom: 16 }}>Quando?</div>
              <QuickDates onSelect={(d) => { setDate(d); setActiveStep("quem"); }} />
              <Calendar selected={date} onSelect={(d) => { setDate(d); setActiveStep("quem"); }} monthsToShow={1} />
            </div>
          ) : (
            <button
              onClick={() => setActiveStep("quando")}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", background: "none", border: "none", cursor: "pointer" }}
            >
              <span style={{ fontSize: 14, color: "#888" }}>Quando</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{formatDate(date) || "Adicionar datas"}</span>
            </button>
          )}
        </div>

        {/* QUEM */}
        <div style={{
          background: "#fff", borderRadius: 20, marginBottom: 12,
          boxShadow: activeStep === "quem" ? "0 4px 16px rgba(0,0,0,0.08)" : "none",
        }}>
          {activeStep === "quem" ? (
            <div style={{ padding: "24px 20px" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#111", marginBottom: 8 }}>Quem?</div>
              <GuestPicker adults={adults} kids={kids} onChangeAdults={setAdults} onChangeKids={setKids} />
            </div>
          ) : (
            <button
              onClick={() => setActiveStep("quem")}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", background: "none", border: "none", cursor: "pointer" }}
            >
              <span style={{ fontSize: 14, color: "#888" }}>Quem</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{formatGuests(adults, kids) || "Adicionar participantes"}</span>
            </button>
          )}
        </div>
      </div>

      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 20px", background: "#fff", borderTop: "1px solid #eee",
      }}>
        <button onClick={handleClear} style={{ background: "none", border: "none", fontSize: 15, fontWeight: 600, color: "#111", cursor: "pointer", textDecoration: "underline" }}>
          Limpar tudo
        </button>
        <button
          onClick={() => setOpen(false)}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "#111", color: "#fff", border: "none", borderRadius: 12, padding: "14px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
        >
          <SearchIcon /> Buscar
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════
export default function TourSearchBar() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [destino, setDestino] = useState<Destino | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);

  const props = { destino, setDestino, date, setDate, adults, setAdults, kids, setKids };

  return isMobile ? <MobileSearch {...props} /> : <DesktopSearch {...props} />;
}
