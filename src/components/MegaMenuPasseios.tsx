"use client";

/**
 * Megamenu "Passeios" — desativado no Header (jul/2026).
 * Componente mantido aqui caso o formato volte a fazer sentido no futuro.
 * Para reativar: importar em Header.tsx, controlar visibilidade com o
 * mesmo estado `passeiosOpen` que hoje é usado só pelo link "Passeios".
 */

import { Boat, Fish, CarProfile, AirplaneInFlight, TreeEvergreen, Building, SunHorizon } from "@phosphor-icons/react";

const passeiosItems = {
  left: [
    { title: "Passeio de Lancha", desc: "Ilhas, recifes e praias paradisíacas", icon: Boat },
    { title: "Mergulho", desc: "Snorkel e mergulho nos recifes de corais", icon: Fish },
    { title: "Passeio de Buggy", desc: "Aventura pelas dunas e praias", icon: CarProfile },
    { title: "Passeio de Helicóptero", desc: "Vista panorâmica do litoral de cima", icon: AirplaneInFlight },
  ],
  right: [
    { title: "Trilha na Mata", desc: "Natureza e Mata Atlântica preservada", icon: TreeEvergreen },
    { title: "Passeio Cultural", desc: "Centro Histórico e cultura local", icon: Building },
    { title: "Pôr do Sol", desc: "Passeio ao entardecer pelo litoral", icon: SunHorizon },
  ],
  preview: {
    title: "Passeios em Porto Seguro",
    desc: "Experiências únicas na Costa do Descobrimento",
  },
};

export default function MegaMenuPasseios({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      className={`hidden md:block absolute top-14 left-0 right-0 bg-white transition-opacity duration-200 ${
        open ? "opacity-100 visible shadow-xl" : "opacity-0 invisible pointer-events-none"
      }`}
      onMouseLeave={onClose}
    >
      <div className="w-full pl-[38px] pr-8 lg:pr-10 py-8">
        <div className="flex gap-24 lg:gap-32">
          <div className="flex gap-20 lg:gap-24 flex-shrink-0">
            <div className="space-y-8 animate-slide-in-1">
              {passeiosItems.left.map((item, i) => (
                <a key={i} href="#passeios" className="block group">
                  <h3 className="flex items-center gap-1.5 text-sm text-[#1a1a1a] font-medium">
                    <item.icon size={15} weight="duotone" className="opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#1a1a1a]/60 mt-1 ml-[21px] group-hover:text-[#1a1a1a] transition-colors">{item.desc}</p>
                </a>
              ))}
            </div>
            <div className="space-y-8 animate-slide-in-2">
              {passeiosItems.right.map((item, i) => (
                <a key={i} href="#passeios" className="block group">
                  <h3 className="flex items-center gap-1.5 text-sm text-[#1a1a1a] font-medium">
                    <item.icon size={15} weight="duotone" className="opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#1a1a1a]/60 mt-1 ml-[21px] group-hover:text-[#1a1a1a] transition-colors">{item.desc}</p>
                </a>
              ))}
            </div>
          </div>

          <div className="w-[360px] ml-auto flex-shrink-0 animate-slide-in-3">
            <div className="bg-black/5 border border-black/8 rounded-xl overflow-hidden h-[270px] flex flex-col hover:bg-black/8 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
              <div className="flex-1 flex items-center justify-center">
                <div className="w-20 h-20 bg-black/8 rounded-lg flex items-center justify-center border border-black/8">
                  <svg className="w-10 h-10 text-black/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0M3 12h18M12 3a15.3 15.3 0 0 1 4 9 15.3 15.3 0 0 1-4 9 15.3 15.3 0 0 1-4-9 15.3 15.3 0 0 1 4-9z" />
                  </svg>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between border-t border-black/8">
                <div>
                  <h4 className="text-[#1a1a1a] text-sm font-medium">{passeiosItems.preview.title}</h4>
                  <p className="text-[#1a1a1a]/60 text-xs mt-1">{passeiosItems.preview.desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
