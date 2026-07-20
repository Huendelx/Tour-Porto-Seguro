"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useHeaderContext } from "@/context/HeaderContext";
import EntrarForm from "./EntrarForm";

export default function LoginModal() {
  const { loginModalOpen, loginModalRole, closeLoginModal } = useHeaderContext();

  useEffect(() => {
    if (!loginModalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [loginModalOpen]);

  if (!loginModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex md:items-center md:justify-center">
      {/* Fundo — placeholder de cor por enquanto, ilustração entra depois */}
      <div className="hidden md:block absolute inset-0 bg-[#a528fd]" onClick={closeLoginModal} />

      {/* Card — no mobile ocupa a tela inteira, no desktop fica centralizado */}
      <div className="relative w-full h-full md:h-auto md:max-h-[85vh] md:w-[440px] bg-white md:rounded-3xl overflow-y-auto">
        <button
          onClick={closeLoginModal}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors z-10"
          aria-label="Fechar"
        >
          <X size={18} strokeWidth={2} className="text-[#111]" />
        </button>

        <div className="px-6 md:px-8 pt-16 md:pt-14 pb-10">
          <EntrarForm defaultRole={loginModalRole} />
        </div>
      </div>
    </div>
  );
}
