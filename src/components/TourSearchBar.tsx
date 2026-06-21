"use client";

import { useState, useRef, useEffect } from "react";

const CATEGORIES = [
  { id: "nautico", label: "Náutico", icon: "⛵" },
  { id: "aventura", label: "Aventura", icon: "🧗" },
  { id: "cultural", label: "Cultural", icon: "🏛" },
  { id: "praias", label: "Praias", icon: "🏖" },
];

const MONTHS_PT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const DAYS_PT = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

function MiniCalendar({ selected, onSelect }: { selected: Date | null; onSelect: (d: Date) => void }) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const canGoPrev = viewYear > today.getFullYear() || (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const isSameDay = (d: number | null) => {
    if (!selected || !d) return false;
    return selected.getDate() === d && selected.getMonth() === viewMonth && selected.getFullYear() === viewYear;
  };

  const isBeforeToday = (d: number | null) => {
    if (!d) return true;
    const check = new Date(viewYear, viewMonth, d);
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return check < t;
  };

  return (
    <div style={{ padding: "16px 20px", minWidth: 280 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <button
          onClick={() => {
            if (!canGoPrev) return;
            if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
            else setViewMonth(viewMonth - 1);
          }}
          style={{ background: "none", border: "none", fontSize: 18, cursor: canGoPrev ? "pointer" : "default", opacity: canGoPrev ? 1 : 0.25, color: "#1a1a1a", padding: "4px 8px" }}
        >‹</button>
        <span style={{ fontWeight: 600, fontSize: 14, color: "#1a1a1a" }}>{MONTHS_PT[viewMonth]} {viewYear}</span>
        <button
          onClick={() => {
            if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
            else setViewMonth(viewMonth + 1);
          }}
          style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#1a1a1a", padding: "4px 8px" }}
        >›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, textAlign: "center" }}>
        {DAYS_PT.map(d => (
          <div key={d} style={{ fontSize: 11, color: "#999", fontWeight: 500, padding: "4px 0" }}>{d}</div>
        ))}
        {cells.map((d, i) => {
          const disabled = isBeforeToday(d);
          const sel = isSameDay(d);
          return (
            <div
              key={i}
              onClick={() => { if (d && !disabled) onSelect(new Date(viewYear, viewMonth, d)); }}
              style={{
                fontSize: 13,
                fontWeight: sel ? 700 : 400,
                padding: "7px 0",
                borderRadius: 20,
                cursor: d && !disabled ? "pointer" : "default",
                background: sel ? "#0c3b5e" : "transparent",
                color: sel ? "#fff" : disabled ? "#ccc" : "#1a1a1a",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { if (d && !disabled && !sel) e.currentTarget.style.background = "#f0f0f0"; }}
              onMouseLeave={(e) => { if (!sel) e.currentTarget.style.background = "transparent"; }}
            >
              {d || ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GuestPicker({ adults, children, onChangeAdults, onChangeChildren }: {
  adults: number; children: number;
  onChangeAdults: (n: number) => void; onChangeChildren: (n: number) => void;
}) {
  const Stepper = ({ label, sub, value, onChange, min = 0 }: {
    label: string; sub: string; value: number; onChange: (n: number) => void; min?: number;
  }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px" }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{label}</div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 1 }}>{sub}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          style={{
            width: 32, height: 32, borderRadius: 16, border: "1.5px solid #ccc",
            background: "none", fontSize: 18, lineHeight: 1, cursor: value > min ? "pointer" : "default",
            color: value > min ? "#1a1a1a" : "#ddd", display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >−</button>
        <span style={{ fontSize: 15, fontWeight: 600, width: 20, textAlign: "center", color: "#1a1a1a" }}>{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          style={{
            width: 32, height: 32, borderRadius: 16, border: "1.5px solid #ccc",
            background: "none", fontSize: 18, lineHeight: 1, cursor: "pointer",
            color: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >+</button>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "4px 0" }}>
      <Stepper label="Adultos" sub="13 anos ou mais" value={adults} onChange={onChangeAdults} min={1} />
      <div style={{ height: 1, background: "#eee", margin: "0 20px" }} />
      <Stepper label="Crianças" sub="2–12 anos" value={children} onChange={onChangeChildren} min={0} />
    </div>
  );
}

export default function TourSearchBar() {
  const [activeField, setActiveField] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setActiveField(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const formatDate = (d: Date | null) => {
    if (!d) return "";
    return `${d.getDate()} ${MONTHS_PT[d.getMonth()]}`;
  };

  const totalGuests = adults + children;

  const fields = [
    {
      id: "what",
      label: "Passeio",
      value: category ? CATEGORIES.find(c => c.id === category)?.label : "",
      placeholder: "Que tipo?",
    },
    {
      id: "when",
      label: "Quando",
      value: formatDate(date),
      placeholder: "Quando?",
    },
    {
      id: "who",
      label: "Quem",
      value: totalGuests > 0 ? `${adults} adulto${adults > 1 ? "s" : ""}${children > 0 ? `, ${children} criança${children > 1 ? "s" : ""}` : ""}` : "",
      placeholder: "Quantos?",
    },
  ];

  return (
    <div ref={ref} style={{ position: "relative", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", maxWidth: 640, width: "100%" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        background: "#ffffff",
        borderRadius: 60,
        boxShadow: activeField
          ? "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)"
          : "0 2px 12px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.25s ease",
        overflow: "visible",
        position: "relative",
      }}>
        {fields.map((field, i) => (
          <div key={field.id} style={{ position: "relative", display: "flex", alignItems: "center", flex: field.id === "what" ? 1.2 : 1 }}>
            <button
              onClick={() => setActiveField(activeField === field.id ? null : field.id)}
              style={{
                flex: 1,
                padding: "14px 20px",
                background: activeField === field.id ? "#f0f0f0" : "transparent",
                border: "none",
                borderRadius: 60,
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.15s",
                outline: "none",
              }}
              onMouseEnter={(e) => { if (activeField !== field.id) e.currentTarget.style.background = "#f7f7f7"; }}
              onMouseLeave={(e) => { if (activeField !== field.id) e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: "#1a1a1a", letterSpacing: "0.01em" }}>
                {field.label}
              </div>
              <div style={{ fontSize: 14, color: field.value ? "#1a1a1a" : "#999", fontWeight: field.value ? 500 : 400, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {field.value || field.placeholder}
              </div>
            </button>
            {i < fields.length - 1 && (
              <div style={{ width: 1, height: 28, background: "#e0e0e0", flexShrink: 0 }} />
            )}
          </div>
        ))}

        <button
          onClick={() => setActiveField(null)}
          style={{
            width: 48, height: 48, borderRadius: 24,
            background: "#1a1a1a", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginRight: 6, flexShrink: 0, transition: "background 0.15s, transform 0.1s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#333"; e.currentTarget.style.transform = "scale(1.04)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#1a1a1a"; e.currentTarget.style.transform = "scale(1)"; }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>

      {activeField === "what" && (
        <div style={{
          position: "absolute", top: "calc(100% + 10px)", left: 0,
          background: "#fff", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
          padding: "8px", zIndex: 10, minWidth: 220,
        }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setCategory(cat.id); setActiveField("when"); }}
              style={{
                display: "flex", alignItems: "center", gap: 12, width: "100%",
                padding: "12px 14px", border: "none", borderRadius: 10,
                background: category === cat.id ? "#f0f4f8" : "transparent",
                cursor: "pointer", fontSize: 14, fontWeight: category === cat.id ? 600 : 400,
                color: "#1a1a1a", textAlign: "left", transition: "background 0.12s",
              }}
              onMouseEnter={(e) => { if (category !== cat.id) e.currentTarget.style.background = "#f7f7f7"; }}
              onMouseLeave={(e) => { if (category !== cat.id) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: 20 }}>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      )}

      {activeField === "when" && (
        <div style={{
          position: "absolute", top: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)",
          background: "#fff", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
          zIndex: 10,
        }}>
          <MiniCalendar selected={date} onSelect={(d) => { setDate(d); setActiveField("who"); }} />
        </div>
      )}

      {activeField === "who" && (
        <div style={{
          position: "absolute", top: "calc(100% + 10px)", right: 0,
          background: "#fff", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
          zIndex: 10, minWidth: 260,
        }}>
          <GuestPicker adults={adults} children={children} onChangeAdults={setAdults} onChangeChildren={setChildren} />
        </div>
      )}
    </div>
  );
}
