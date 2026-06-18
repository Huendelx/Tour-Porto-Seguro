"use client";

import Link from "next/link";
import { useState } from "react";
import { List, X, Anchor, Phone } from "@phosphor-icons/react";

const links = [
  { href: "#passeios", label: "Passeios" },
  { href: "#sobre", label: "Sobre" },
  { href: "#contato", label: "Contato" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{ backgroundColor: "rgba(253,250,245,0.92)" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-[var(--tps-sand-dark)]/30"
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg" style={{ color: "var(--tps-ocean)" }}>
          <Anchor size={24} weight="fill" />
          <span>Tour Porto Seguro</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium transition-colors"
              style={{ color: "var(--tps-gray)" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--tps-ocean)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--tps-gray)")}
            >
              {l.label}
            </a>
          ))}
          <a
            href="https://wa.me/5573999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--tps-coral)" }}
          >
            <Phone size={16} weight="fill" />
            Reservar agora
          </a>
        </nav>

        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          style={{ color: "var(--tps-ocean)" }}
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <List size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-[var(--tps-sand-dark)]/30 px-5 py-4 flex flex-col gap-4 bg-[var(--tps-white)]">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium" style={{ color: "var(--tps-dark)" }} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a
            href="https://wa.me/5573999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: "var(--tps-coral)" }}
          >
            <Phone size={16} weight="fill" />
            Reservar agora
          </a>
        </div>
      )}
    </header>
  );
}
