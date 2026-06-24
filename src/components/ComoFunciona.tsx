const steps = [
  { num: "1", title: "Escolha o destino", desc: "Navegue por destinos ou busque diretamente o tipo de experiência que você procura." },
  { num: "2", title: "Reserve online", desc: "Escolha a data, selecione o número de pessoas e pague com segurança direto na plataforma." },
  { num: "3", title: "Viva a experiência", desc: "No dia, é só aparecer. Seu guia local já está esperando pra te mostrar o melhor do destino." },
];

export default function ComoFunciona() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-[32px] font-bold text-[#111] leading-tight">Como funciona</h2>
          <p className="text-base text-[#666] mt-3 leading-relaxed">
            Reservar sua próxima aventura leva menos de 2 minutos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((s, i) => (
            <div key={i}>
              <div className="w-12 h-12 rounded-full bg-[#111] text-white flex items-center justify-center text-lg font-bold mb-5">
                {s.num}
              </div>
              <h3 className="text-[18px] font-semibold text-[#111] mb-2">{s.title}</h3>
              <p className="text-[14px] text-[#666] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
