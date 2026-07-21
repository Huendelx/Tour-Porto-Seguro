// Seção tipográfica — a marca falando de si, sem foto. Copy é rascunho
// (segunda pessoa, benefício em vez de atributo) a refinar com o Huendel.
const blocos = [
  {
    statement: "Você sabe onde seu passeio está.",
    apoio:
      "Confirmação na hora e acompanhamento da sua saída no dia do passeio. Nada de pagar e ficar rezando pra van aparecer.",
  },
  {
    statement: "Quem te leva tem nome, rosto e histórico.",
    apoio:
      "Todo operador passa por verificação: registro CADASTUR, anos de operação e contato direto. Você sabe com quem está fechando.",
  },
  {
    statement: "Se o vento virar, você não perde o dinheiro.",
    apoio:
      "Passeio de mar depende do tempo. Quando o clima cancela a saída, seu dinheiro volta — política clara antes de reservar.",
  },
];

export default function PorQuePasseador() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="text-[12px] font-semibold tracking-widest uppercase text-gray-400 mb-10 md:mb-14">
          Por que o Passeador
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {blocos.map((b) => (
            <div key={b.statement} className="border-t border-gray-200 pt-6 md:pt-8">
              <h3 className="text-[24px] md:text-[28px] font-bold text-[#111] leading-[1.15] tracking-tight text-balance">
                {b.statement}
              </h3>
              <p className="text-[14px] md:text-[15px] text-gray-500 leading-relaxed mt-3 md:mt-4">
                {b.apoio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
