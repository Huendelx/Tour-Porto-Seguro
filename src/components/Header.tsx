"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Boat, Fish, CarProfile, AirplaneInFlight, TreeEvergreen, Building, SunHorizon } from "@phosphor-icons/react";
import MobileMenu from "./MobileMenu";

const Logo = ({ isScrolled, isMobileMenuOpen, isMenuOpen }: { isScrolled: boolean; isMobileMenuOpen: boolean; isMenuOpen: boolean }) => (
  <div className="flex items-center gap-2 ml-[4px] md:ml-0 lg:ml-[-8px] cursor-pointer z-50">
    <div
      className="relative w-[28px] h-[28px] flex-shrink-0 transition-all"
      style={{
        filter: isMenuOpen
          ? "brightness(0) saturate(100%) invert(44%) sepia(86%) saturate(575%) hue-rotate(348deg) brightness(106%)"
          : isScrolled || isMobileMenuOpen
            ? "none"
            : "brightness(0) invert(1)"
      }}
    >
      <Image
        src="/logo-greenchain.svg"
        alt="Tour Porto Seguro"
        fill
        className="object-contain"
        priority
      />
    </div>
    <span className={`text-[14px] font-medium transition-colors ${
      isScrolled || isMenuOpen || isMobileMenuOpen ? "text-[#041610]" : "text-[#fafafa]"
    }`}>
      Tour Porto Seguro
    </span>
  </div>
);

const ChevronDown = ({ className }: { className?: string }) => (
  <svg className={className} width="10" height="10" viewBox="0 0 12 12" fill="none">
    <path
      d="M3 4.5L6 7.5L9 4.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const GlobeIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#globe-clip)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="globe-clip">
        <path fill="white" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
);

const HamburgerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

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

export default function Header() {
  const [passeiosOpen, setPasseiosOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const width = window.innerWidth;
      let heroHeightVh = 0.5;
      if (width >= 1024) heroHeightVh = 0.65;
      else if (width >= 768) heroHeightVh = 0.6;
      setIsScrolled(window.scrollY > window.innerHeight * heroHeightVh);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const textColor = isScrolled || passeiosOpen
    ? "text-[#041610] hover:text-[#041610]/70"
    : "text-[#fafafa] hover:text-[#fafafa]/70";

  const textColorActive = isScrolled || passeiosOpen
    ? "text-[#041610]/70"
    : "text-[#fafafa]/70";

  return (
    <>
      {/* Overlay backdrop */}
      {passeiosOpen && (
        <div
          className="hidden md:block fixed inset-0 bg-[#0a0a0a]/60 z-40 !backdrop-blur-none"
          onClick={() => setPasseiosOpen(false)}
        />
      )}

      <header
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-colors duration-200 ${
          passeiosOpen || mobileMenuOpen
            ? "bg-white"
            : isScrolled
              ? "bg-white/80 backdrop-blur-md"
              : "bg-transparent"
        }`}
        style={isScrolled && !passeiosOpen && !mobileMenuOpen ? { backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" } : {}}
      >
        <nav className="w-full px-3 md:px-4 lg:px-6 h-14 flex items-center justify-between">
          <Logo isScrolled={isScrolled} isMenuOpen={passeiosOpen} isMobileMenuOpen={mobileMenuOpen} />

          {/* Desktop nav */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center">
              {/* Passeios com submenu */}
              <button
                className={`flex items-center gap-1 px-3 py-2 text-[14px] font-[450] transition-colors ${
                  passeiosOpen ? textColorActive : textColor
                }`}
                onMouseEnter={() => setPasseiosOpen(true)}
              >
                Passeios
                <ChevronDown className={`transition-transform ${passeiosOpen ? "rotate-180" : ""}`} />
              </button>

              <a
                href="#sobre"
                className={`px-3 py-2 text-[14px] font-[450] transition-colors ${textColor}`}
                onMouseEnter={() => setPasseiosOpen(false)}
              >
                Sobre
              </a>
              <a
                href="#contato"
                className={`px-3 py-2 text-[14px] font-[450] transition-colors ${textColor}`}
                onMouseEnter={() => setPasseiosOpen(false)}
              >
                Contato
              </a>
            </div>

            <div className="flex items-center gap-3 ml-3 text-[14px]">
              <div className={`w-[1px] h-6 transition-colors ${
                isScrolled || passeiosOpen ? "bg-[#041610]/20" : "bg-[#fafafa]/20"
              }`} />
              <button
                className={`transition-colors p-1 ${
                  isScrolled || passeiosOpen
                    ? "text-[#041610]/50 hover:text-[#041610]"
                    : "text-[#fafafa]/50 hover:text-[#fafafa]"
                }`}
                aria-label="Trocar idioma"
              >
                <GlobeIcon />
              </button>
              <a
                href="#"
                className={`transition-colors font-[450] ${
                  isScrolled || passeiosOpen
                    ? "text-[#041610] hover:text-[#041610]/70"
                    : "text-[#fafafa] hover:text-[#fafafa]/70"
                }`}
              >
                Entrar
              </a>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-2 transition-colors ${
              mobileMenuOpen ? "text-[#041610]" : isScrolled ? "text-[#041610]" : "text-[#fafafa]"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </nav>

        {/* Desktop Mega Menu — Passeios */}
        <div
          className={`hidden md:block absolute top-14 left-0 right-0 bg-white !border-none transition-opacity duration-200 ${
            passeiosOpen ? "opacity-100 visible shadow-xl" : "opacity-0 invisible pointer-events-none"
          }`}
          onMouseLeave={() => setPasseiosOpen(false)}
        >
          <div className="w-full pl-[38px] pr-8 lg:pr-10 py-8">
            <div className="flex gap-24 lg:gap-32">
              <div className="flex gap-20 lg:gap-24 flex-shrink-0">
                <div className="space-y-8 animate-slide-in-1">
                  {passeiosItems.left.map((item, i) => (
                    <a key={i} href="#passeios" className="block group">
                      <h3 className="flex items-center gap-1.5 text-sm text-[#041610] font-medium transition-colors">
                        <item.icon size={15} weight="duotone" className="opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#041610]/70 mt-1 ml-[21px] group-hover:text-[#041610] transition-colors">{item.desc}</p>
                    </a>
                  ))}
                </div>
                <div className="space-y-8 animate-slide-in-2">
                  {passeiosItems.right.map((item, i) => (
                    <a key={i} href="#passeios" className="block group">
                      <h3 className="flex items-center gap-1.5 text-sm text-[#041610] font-medium transition-colors">
                        <item.icon size={15} weight="duotone" className="opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#041610]/70 mt-1 ml-[21px] group-hover:text-[#041610] transition-colors">{item.desc}</p>
                    </a>
                  ))}
                </div>
              </div>

              <div className="w-[360px] ml-auto flex-shrink-0 animate-slide-in-3">
                <div className="bg-white/60 backdrop-blur-sm border border-[#041610]/10 rounded-xl overflow-hidden h-[270px] flex flex-col hover:bg-white/80 hover:border-[#041610]/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                  <div className="flex-1 bg-[#041610]/5 flex items-center justify-center">
                    <div className="w-20 h-20 bg-[#041610]/10 rounded-lg flex items-center justify-center border border-[#041610]/10">
                      <svg className="w-10 h-10 text-[#041610]/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0M3 12h18M12 3a15.3 15.3 0 0 1 4 9 15.3 15.3 0 0 1-4 9 15.3 15.3 0 0 1-4-9 15.3 15.3 0 0 1 4-9z" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between border-t border-[#041610]/10">
                    <div>
                      <h4 className="text-[#041610] text-sm font-medium">{passeiosItems.preview.title}</h4>
                      <p className="text-[#041610]/70 text-xs mt-1">{passeiosItems.preview.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
