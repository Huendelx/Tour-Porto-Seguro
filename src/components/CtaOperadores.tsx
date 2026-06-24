const stats = [
  { num: "0%", label: "taxa de cadastro" },
  { num: "24h", label: "para ativar" },
  { num: "1000+", label: "turistas/mês" },
];

export default function CtaOperadores() {
  return (
    <section className="py-20 bg-[#111]">
      <div className="max-w-[600px] mx-auto px-6 text-center">
        <p className="text-[12px] font-semibold tracking-widest uppercase text-[#666] mb-2">
          Para operadores e guias
        </p>
        <h2 className="text-[32px] font-bold text-white leading-tight mb-4">
          Você oferece passeios?<br />Faça parte do Passeador.
        </h2>
        <p className="text-base text-[#888] leading-relaxed mb-8">
          Cadastre-se gratuitamente, ganhe uma vitrine digital profissional e receba reservas de milhares de turistas. Você só paga quando vende.
        </p>
        <button className="bg-white text-[#111] font-semibold text-[15px] px-9 py-3.5 rounded-full hover:opacity-90 transition-opacity cursor-pointer border-none">
          Cadastrar minha empresa
        </button>

        <div className="flex justify-center gap-10 mt-10">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-[24px] font-bold text-white">{s.num}</div>
              <div className="text-[12px] text-[#666] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
