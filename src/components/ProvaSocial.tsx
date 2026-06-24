const reviews = [
  {
    name: "Mariana S.", from: "São Paulo, SP", rating: 5,
    passeio: "Recife de Fora",
    text: "Reservei o passeio pro Recife de Fora pelo Passeador e foi tudo perfeito. O guia conhecia cada canto, a água era cristalina. Melhor experiência da viagem.",
  },
  {
    name: "James W.", from: "London, UK", rating: 5,
    passeio: "Caraíva",
    text: "Found this platform while researching Porto Seguro. Booked two tours, both were incredible. The local guides make all the difference — they know hidden spots no tourist usually sees.",
  },
  {
    name: "Rafael M.", from: "Belo Horizonte, MG", rating: 5,
    passeio: "Arraial d'Ajuda e Trancoso",
    text: "A praticidade de reservar online e saber que tá tudo confirmado faz muita diferença. Sem surpresa, sem perrengue. Recomendo demais.",
  },
];

export default function ProvaSocial() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-[32px] font-bold text-[#111] leading-tight">O que dizem os viajantes</h2>
          <p className="text-base text-[#666] mt-3 leading-relaxed">
            Mais de 500 experiências realizadas com avaliação acima de 4.8.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="bg-[#fafafa] rounded-xl p-7 border border-[#f0f0f0]">
              <div className="flex gap-1 mb-4">
                {[...Array(r.rating)].map((_, j) => (
                  <span key={j} className="text-[14px] text-[#111]">★</span>
                ))}
              </div>
              <p className="text-[14px] text-[#333] leading-relaxed mb-5 italic">
                &ldquo;{r.text}&rdquo;
              </p>
              <div className="border-t border-[#eee] pt-4 flex justify-between items-center">
                <div>
                  <p className="text-[14px] font-semibold text-[#111] m-0">{r.name}</p>
                  <p className="text-[12px] text-[#999] mt-0.5">{r.from}</p>
                </div>
                <span className="text-[11px] text-[#999] bg-[#f0f0f0] px-3 py-1 rounded-full">
                  {r.passeio}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
