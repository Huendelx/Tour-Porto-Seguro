import { LocateFixed, BadgeCheck, Wind } from "lucide-react";

// Cards coloridos estilo ClickBus — cada um numa cor da paleta (roxo do
// banner, preto, amarelo do acento). Copy é rascunho a refinar; a ideia é
// depois cada card poder receber uma imagem/ilustração também.
const cards = [
  {
    icon: LocateFixed,
    statement: "Você sabe onde seu passeio está.",
    apoio: "Confirmação na hora e acompanhamento da sua saída no dia do passeio. Nada de pagar e ficar rezando pra van aparecer.",
    bg: "#a528fd",
    text: "#fff",
    subText: "rgba(255,255,255,0.82)",
    chipBg: "#fff",
    chipText: "#a528fd",
  },
  {
    icon: BadgeCheck,
    statement: "Quem te leva tem nome, rosto e histórico.",
    apoio: "Todo operador passa por verificação: registro CADASTUR, anos de operação e contato direto. Você sabe com quem está fechando.",
    bg: "#111111",
    text: "#fff",
    subText: "rgba(255,255,255,0.72)",
    chipBg: "#fff",
    chipText: "#111",
  },
  {
    icon: Wind,
    statement: "Se o vento virar, você não perde o dinheiro.",
    apoio: "Passeio de mar depende do tempo. Quando o clima cancela a saída, seu dinheiro volta — política clara antes de reservar.",
    bg: "#ffc629",
    text: "#111",
    subText: "rgba(17,17,17,0.72)",
    chipBg: "#111",
    chipText: "#ffc629",
  },
];

export default function PorQuePasseador() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="text-[12px] font-semibold tracking-widest uppercase text-gray-400 mb-8 md:mb-10">
          Por que o Passeador
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {cards.map((c) => (
            <div
              key={c.statement}
              className="rounded-3xl p-7 md:p-8 flex flex-col min-h-[280px] md:min-h-[320px]"
              style={{ background: c.bg }}
            >
              <span
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: c.chipBg, color: c.chipText }}
              >
                <c.icon size={22} strokeWidth={2} />
              </span>

              <h3
                className="text-[24px] md:text-[27px] font-bold leading-[1.12] tracking-tight text-balance mt-auto pt-8"
                style={{ color: c.text }}
              >
                {c.statement}
              </h3>
              <p className="text-[14px] leading-relaxed mt-3" style={{ color: c.subText }}>
                {c.apoio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
