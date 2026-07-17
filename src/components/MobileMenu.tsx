"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Boat, Fish, CarProfile, AirplaneInFlight, TreeEvergreen, Building, SunHorizon } from "@phosphor-icons/react";
import type { CurrentProfile } from "@/lib/auth";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CurrentProfile | null;
  onLogout: () => void;
}

const ChevronDown = ({ className }: { className?: string }) => (
  <svg className={className} width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const passeiosItems = [
  { title: "Passeio de Lancha", desc: "Ilhas, recifes e praias paradisíacas", icon: Boat },
  { title: "Mergulho", desc: "Snorkel e mergulho nos recifes de corais", icon: Fish },
  { title: "Passeio de Buggy", desc: "Aventura pelas dunas e praias", icon: CarProfile },
  { title: "Passeio de Helicóptero", desc: "Vista panorâmica do litoral de cima", icon: AirplaneInFlight },
  { title: "Trilha na Mata", desc: "Natureza e Mata Atlântica preservada", icon: TreeEvergreen },
  { title: "Passeio Cultural", desc: "Centro Histórico e cultura local", icon: Building },
  { title: "Pôr do Sol", desc: "Passeio ao entardecer pelo litoral", icon: SunHorizon },
];

export default function MobileMenu({ isOpen, onClose, profile, onLogout }: MobileMenuProps) {
  const [passeiosOpen, setPasseiosOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-40 bg-white transition-opacity duration-300 ease-in-out ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {isOpen && (
        <div className="flex flex-col h-full pt-20 px-6 pb-8 overflow-y-auto">
          <nav className="flex-1 space-y-6 animate-slide-in-1">
            {/* Passeios com submenu */}
            <div className="border-b border-[#041610]/10 pb-4">
              <button
                className="w-full flex items-center justify-between py-2 text-[#041610]"
                onClick={() => setPasseiosOpen(!passeiosOpen)}
              >
                <span className="text-2xl font-light tracking-tight">Passeios</span>
                <ChevronDown
                  className={`text-[#041610]/50 transition-transform duration-300 ${
                    passeiosOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  passeiosOpen ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"
                }`}
              >
                <div className="space-y-4 pl-1">
                  {passeiosItems.map((item, i) => (
                    <a key={i} href="#passeios" onClick={onClose} className="block group/item">
                      <span className="flex items-center gap-2 text-[#041610]/70 text-lg group-hover/item:text-[#041610] transition-colors">
                        <item.icon size={18} weight="duotone" className="flex-shrink-0" />
                        {item.title}
                      </span>
                      <span className="text-[#041610]/50 text-sm block mt-0.5 ml-[26px]">{item.desc}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <a href="#sobre" onClick={onClose} className="block py-2 text-[#041610] border-b border-[#041610]/10 pb-4">
              <span className="text-2xl font-light tracking-tight">Sobre</span>
            </a>
            <a href="#contato" onClick={onClose} className="block py-2 text-[#041610] border-b border-[#041610]/10 pb-4">
              <span className="text-2xl font-light tracking-tight">Contato</span>
            </a>
          </nav>

          <div className="mt-8 animate-slide-in-2">
            {profile ? (
              <>
                <a
                  href={profile.role === "operador" ? "/operador" : "/minha-conta"}
                  onClick={onClose}
                  className="flex items-center justify-center w-full py-4 bg-[#1a1a1a] text-white rounded-lg text-lg font-medium hover:bg-black/80 transition-colors"
                >
                  {profile.fullName || profile.email}
                </a>
                <button
                  onClick={() => { onClose(); onLogout(); }}
                  className="w-full text-center py-3 text-[#041610]/70 text-sm mt-2 underline"
                >
                  Sair
                </button>
              </>
            ) : (
              <a
                href="/entrar"
                onClick={onClose}
                className="flex items-center justify-center w-full py-4 bg-[#1a1a1a] text-white rounded-lg text-lg font-medium hover:bg-black/80 transition-colors"
              >
                Entrar
              </a>
            )}
            <p className="text-center text-[#041610]/60 text-xs mt-6">
              &copy; 2026 Passeador
            </p>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
