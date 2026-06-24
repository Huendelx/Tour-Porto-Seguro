const cats = [
  { name: "Náutico", desc: "Barcos, mergulho, snorkeling", icon: "⛵" },
  { name: "Aventura", desc: "Trilhas, 4x4, rapel", icon: "🧗" },
  { name: "Cultural", desc: "História, vilas, comunidades", icon: "🏛" },
  { name: "Praias", desc: "As mais bonitas do Brasil", icon: "🏖" },
  { name: "Gastronomia", desc: "Restaurantes e experiências", icon: "🍽" },
  { name: "Festas & Eventos", desc: "Luaus, shows, nightlife", icon: "🎶" },
];

export default function CategoriasSection() {
  return (
    <section className="py-20 bg-[#fafafa]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-[32px] font-bold text-[#111] leading-tight">Explore por categoria</h2>
          <p className="text-base text-[#666] mt-3 leading-relaxed">
            Não sabe por onde começar? Navegue pelo tipo de experiência.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {cats.map((c, i) => (
            <div key={i} className="bg-white rounded-xl px-5 py-7 text-center cursor-pointer border border-[#eee] hover:border-[#ccc] transition-colors">
              <div className="text-[32px] mb-3">{c.icon}</div>
              <h3 className="text-[15px] font-semibold text-[#111] mb-1">{c.name}</h3>
              <p className="text-[12px] text-[#999] m-0">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
