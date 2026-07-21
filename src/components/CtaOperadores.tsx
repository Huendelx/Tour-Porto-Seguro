"use client";

import { useHeaderContext } from "@/context/HeaderContext";

// TODO: número do Huendel/representante local (com DDD, ex. "5548999999999").
// Enquanto vazio, o botão cai no modal de cadastro — nada de CTA morto em produção.
const OPERATOR_WHATSAPP = "";

const WHATSAPP_MSG =
  "Olá! Tenho uma empresa de passeios em Porto Seguro e quero fazer parte do Passeador.";

const stats = [
  { num: "0%", label: "taxa de cadastro" },
  { num: "15%", label: "só quando vende" },
  { num: "Feito pra você", label: "a gente cadastra seus passeios" },
];

export default function CtaOperadores() {
  const { openLoginModal } = useHeaderContext();

  const handleClick = () => {
    if (OPERATOR_WHATSAPP) {
      window.open(
        `https://wa.me/${OPERATOR_WHATSAPP}?text=${encodeURIComponent(WHATSAPP_MSG)}`,
        "_blank"
      );
      return;
    }
    openLoginModal("operador");
  };

  return (
    <section id="guia" className="py-20 bg-[#111]">
      <div className="max-w-[600px] mx-auto px-6 text-center">
        <p className="text-[12px] font-semibold tracking-widest uppercase text-[#666] mb-2">
          Para operadores e guias
        </p>
        <h2 className="text-[32px] font-bold text-white leading-tight mb-4">
          Você oferece passeios?<br />Faça parte do Passeador.
        </h2>
        <p className="text-base text-[#888] leading-relaxed mb-8">
          Cadastro gratuito e sem mensalidade — você só paga quando vende. E não precisa
          preencher nada: manda seus passeios pelo WhatsApp que a gente cadastra pra você.
        </p>
        <button
          onClick={handleClick}
          className="bg-white text-[#111] font-semibold text-[15px] px-9 py-3.5 rounded-full hover:opacity-90 transition-opacity cursor-pointer border-none"
        >
          Cadastrar minha empresa
        </button>

        <div className="flex justify-center gap-10 mt-10">
          {stats.map((s, i) => (
            <div key={i} className="text-center max-w-[140px]">
              <div className="text-[24px] font-bold text-white leading-tight">{s.num}</div>
              <div className="text-[12px] text-[#666] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
