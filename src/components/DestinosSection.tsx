const destinos = [
  { name: "Porto Seguro", count: 24 },
  { name: "Arraial d'Ajuda", count: 18 },
  { name: "Trancoso", count: 12 },
  { name: "Caraíva", count: 8 },
  { name: "Praia do Espelho", count: 6 },
];

export default function DestinosSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-[32px] font-bold text-[#111] leading-tight">Destinos populares</h2>
          <p className="text-base text-[#666] mt-3 max-w-lg leading-relaxed">
            Escolha seu destino e descubra as melhores experiências com quem conhece de verdade.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {destinos.map((d, i) => (
            <div key={i} className="cursor-pointer group">
              <div className="relative h-[280px] bg-[#e5e5e5] rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-4 left-4 text-white font-semibold text-lg z-10">
                  {d.name}
                </span>
              </div>
              <p className="text-[13px] text-[#888] mt-2">{d.count} experiências</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
