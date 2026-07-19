"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CircleHelp, LogOut, User, Building2 } from "lucide-react";
import MobileMenu from "./MobileMenu";
import HeaderSearchBar from "./HeaderSearchBar";
import { useHeaderContext } from "@/context/HeaderContext";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { CurrentProfile } from "@/lib/auth";

const GlobeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#globe-clip)">
      <path fillRule="evenodd" clipRule="evenodd" d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1" fill="currentColor" />
    </g>
    <defs><clipPath id="globe-clip"><path fill="white" d="M0 0h16v16H0z" /></clipPath></defs>
  </svg>
);

const HamburgerIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

const CloseIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 6l12 12M6 18L18 6" />
  </svg>
);

export default function Header({ profile }: { profile: CurrentProfile | null }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };
  const { mobileTitle } = useHeaderContext();
  const isHomePage = pathname === "/";
  const isDetalhes = pathname.startsWith("/passeios/");
  const isReserva = pathname.startsWith("/reserva/");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(e.target as Node)) {
        setDesktopMenuOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const dark = !isHomePage || isScrolled || mobileMenuOpen;

  const linkCls = `text-[14px] font-[450] transition-colors ${
    dark ? "text-[#1a1a1a] hover:text-[#1a1a1a]/60" : "text-white hover:text-white/70"
  }`;

  const pillCls = `w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
    dark
      ? "bg-white border border-black/10 text-[#1a1a1a] hover:bg-black/5"
      : "bg-white/20 text-white hover:bg-white/30"
  }`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-colors duration-200 ${
          !isHomePage || mobileMenuOpen || isScrolled
            ? "bg-white"
            : "bg-transparent"
        }`}
      >
        <nav className="relative w-full px-4 md:px-6 h-14 flex items-center justify-between">

          {/* MOBILE NON-HOME overlay */}
          {!isHomePage && (
            <div className="md:hidden absolute inset-0 flex items-center px-3 gap-2 bg-white z-10">
              {/* Back button — always */}
              <button
                onClick={() => router.back()}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 text-[#111]"
                aria-label="Voltar"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                </svg>
              </button>

              {/* DETALHE: título centrado + share + heart */}
              {isDetalhes ? (
                <>
                  <p className="flex-1 text-center text-[13px] font-semibold text-[#111] truncate px-1">
                    {mobileTitle}
                  </p>
                  <button
                    onClick={() => { if (navigator.share) navigator.share({ url: window.location.href }); }}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 text-[#111]"
                    aria-label="Compartilhar"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
                    </svg>
                  </button>
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 text-[#111]"
                    aria-label="Favoritar"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </>
              ) : isReserva ? (
                /* RESERVA: só título */
                <p className="flex-1 text-center text-[13px] font-semibold text-[#111] truncate px-1 mr-9">
                  Confirmar e pagar
                </p>
              ) : (
                /* BUSCAR: search bar (filtros já ficam na barra abaixo) */
                <div className="flex-1 min-w-0">
                  <Suspense fallback={null}>
                    <HeaderSearchBar />
                  </Suspense>
                </div>
              )}
            </div>
          )}

          {/* LEFT — logo + nome */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 cursor-pointer">
            <div className="relative w-7 h-7 flex-shrink-0">
              <Image
                src={dark ? "/logo-passeador-color-yellow.svg" : "/logo-passeador-color-white.svg"}
                alt="Passeador"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className={`text-[14px] font-medium transition-colors ${dark ? "text-[#1a1a1a]" : "text-white"}`}>
              Passeador
            </span>
          </Link>

          {/* CENTER — search bar compacta (some no topo da home e no checkout) */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {!isReserva && (!isHomePage || isScrolled) && (
              <Suspense fallback={null}>
                <HeaderSearchBar />
              </Suspense>
            )}
          </div>

          {/* RIGHT — Torne-se um guia + globe pill + hamburger pill */}
          <div className="flex items-center gap-2">
            <a href="#guia" className={`${linkCls} hidden md:block mr-1 whitespace-nowrap`}>
              Torne-se um guia
            </a>
            <div className="relative" ref={langMenuRef}>
              <button
                className={pillCls}
                aria-label="Idioma"
                onClick={() => setLangOpen(!langOpen)}
              >
                <GlobeIcon />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-[calc(100%+10px)] w-48 bg-white rounded-2xl shadow-xl border border-black/8 overflow-hidden z-50 py-1">
                  {[
                    { code: "pt-BR", label: "Português", flag: "🇧🇷" },
                    { code: "en",    label: "English",    flag: "🇺🇸" },
                    { code: "es",    label: "Español",    flag: "🇪🇸" },
                    { code: "fr",    label: "Français",   flag: "🇫🇷" },
                    { code: "de",    label: "Deutsch",    flag: "🇩🇪" },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#1a1a1a] hover:bg-black/5 transition-colors"
                      onClick={() => setLangOpen(false)}
                    >
                      <span className="text-base">{lang.flag}</span>
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Desktop: abre balão | Mobile: abre MobileMenu */}
            <div className="relative" ref={desktopMenuRef}>
              <button
                className={`${pillCls} hidden md:flex`}
                aria-label="Menu"
                onClick={() => setDesktopMenuOpen(!desktopMenuOpen)}
              >
                {desktopMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
              </button>
              <button
                className={`${pillCls} md:hidden`}
                aria-label="Menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
              </button>

              {/* Dropdown desktop */}
              {desktopMenuOpen && (
                <div className="absolute right-0 top-[calc(100%+10px)] w-64 bg-white rounded-2xl shadow-xl border border-black/8 overflow-hidden z-50 py-1">
                  <a href="#ajuda" className="flex items-center gap-3 px-4 py-3 text-sm text-[#1a1a1a] hover:bg-black/5 transition-colors">
                    <CircleHelp size={16} strokeWidth={1.5} className="text-[#1a1a1a]" />
                    Central de Ajuda
                  </a>

                  <div className="h-px bg-black/8 mx-1 my-1" />

                  <a href="#torne-se-guia" className="block px-4 py-3 hover:bg-black/5 transition-colors">
                    <span className="block text-sm font-semibold text-[#1a1a1a]">Torne-se um guia</span>
                    <span className="block text-xs text-[#1a1a1a]/60 mt-0.5 leading-relaxed">
                      É fácil começar a guiar turistas, oferecer passeios e experiências e ganhar uma renda extra.
                    </span>
                  </a>

                  <div className="h-px bg-black/8 mx-1 my-1" />

                  <a href="#encontre-guia" className="block px-4 py-3 text-sm text-[#1a1a1a] hover:bg-black/5 transition-colors">
                    Encontre um guia
                  </a>
                  <a href="#cartoes" className="block px-4 py-3 text-sm text-[#1a1a1a] hover:bg-black/5 transition-colors">
                    Cartões de presente
                  </a>

                  <div className="h-px bg-black/8 mx-1 my-1" />

                  {profile ? (
                    <>
                      <Link href={profile.role === "operador" ? "/operador" : "/minha-conta"} className="flex items-center gap-3 px-4 py-3 hover:bg-black/5 transition-colors">
                        <span className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0">
                          {profile.role === "operador"
                            ? <Building2 size={15} strokeWidth={1.75} className="text-[#1a1a1a]" />
                            : <User size={15} strokeWidth={1.75} className="text-[#1a1a1a]" />}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-[#1a1a1a] truncate">
                            {profile.fullName || profile.email}
                          </span>
                          <span className="block text-xs text-[#1a1a1a]/60">
                            {profile.role === "operador" ? "Conta de operador" : "Conta de turista"}
                          </span>
                        </span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#1a1a1a] hover:bg-black/5 transition-colors"
                      >
                        <LogOut size={16} strokeWidth={1.5} className="text-[#1a1a1a]" />
                        Sair
                      </button>
                    </>
                  ) : (
                    <Link href="/entrar" className="block px-4 py-3 text-sm font-semibold text-[#1a1a1a] hover:bg-black/5 transition-colors">
                      Entrar ou cadastrar-se
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} profile={profile} onLogout={handleLogout} />
    </>
  );
}
