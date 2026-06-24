const experiences = [
  { name: "Recife de Fora — Snorkeling", operator: "Mar Aberto Turismo", cat: "Náutico", rating: 4.9, reviews: 128, price: 95, duration: "4h", badge: "Mais reservado" },
  { name: "Arraial d'Ajuda e Trancoso", operator: "Costa Sul Passeios", cat: "Terrestre", rating: 4.8, reviews: 94, price: 120, duration: "Dia inteiro", badge: null },
  { name: "Coroa Vermelha — História e Praia", operator: "Raízes do Descobrimento", cat: "Cultural", rating: 4.7, reviews: 67, price: 65, duration: "Meio dia", badge: null },
  { name: "Caraíva — Aldeia Mágica", operator: "Caraíva Explorer", cat: "Aventura", rating: 4.9, reviews: 156, price: 150, duration: "Dia inteiro", badge: "Imperdível" },
];

export default function ExperienciasSection() {
  return (
    <section className="py-20 bg-[#fafafa]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-[32px] font-bold text-[#111] leading-tight">Experiências em destaque</h2>
            <p className="text-base text-[#666] mt-3 max-w-lg leading-relaxed">
              As mais reservadas e bem avaliadas pelos viajantes.
            </p>
          </div>
          <a href="#" className="text-[14px] font-semibold text-[#111] underline whitespace-nowrap mb-2">
            Ver todas →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {experiences.map((exp, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden border border-[#eee] cursor-pointer hover:shadow-md transition-shadow">
              <div className="h-[200px] bg-[#e0e0e0] relative">
                {exp.badge && (
                  <span className="absolute top-3 left-3 bg-[#111] text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                    {exp.badge}
                  </span>
                )}
                <span className="absolute top-3 right-3 bg-white text-[#555] text-[11px] font-medium px-3 py-1 rounded-full">
                  {exp.cat}
                </span>
              </div>
              <div className="p-4 pb-5">
                <p className="text-[12px] text-[#999] m-0">{exp.operator}</p>
                <h3 className="text-[16px] font-semibold text-[#111] mt-1 mb-2 leading-snug">{exp.name}</h3>
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-[13px] font-semibold text-[#111]">★ {exp.rating}</span>
                  <span className="text-[12px] text-[#999]">({exp.reviews} avaliações)</span>
                  <span className="text-[#bbb] mx-1">·</span>
                  <span className="text-[12px] text-[#888]">{exp.duration}</span>
                </div>
                <div className="border-t border-[#f0f0f0] pt-3 flex justify-between items-center">
                  <div>
                    <span className="text-[20px] font-bold text-[#111]">R$ {exp.price}</span>
                    <span className="text-[13px] text-[#888] ml-1">/ pessoa</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
