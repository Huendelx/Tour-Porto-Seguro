const columns = [
  {
    title: "Destinos",
    links: ["Porto Seguro", "Arraial d'Ajuda", "Trancoso", "Caraíva", "Praia do Espelho"].map((label) => ({ label, href: "#" })),
  },
  {
    title: "Categorias",
    links: ["Náutico", "Aventura", "Cultural", "Praias", "Gastronomia"].map((label) => ({ label, href: "#" })),
  },
  {
    title: "Passeador",
    links: ["Sobre nós", "Como funciona", "Para operadores", "Blog", "Contato"].map((label) => ({ label, href: "#" })),
  },
  {
    title: "Suporte",
    links: [
      { label: "Central de ajuda", href: "#" },
      { label: "Termos de uso", href: "/termos" },
      { label: "Política de privacidade", href: "/privacidade" },
      { label: "Cancelamento", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#fafafa] border-t border-[#eee] pt-16 pb-8">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-[1.5fr_repeat(4,1fr)] gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="text-[20px] font-bold text-[#111] mb-3">Passeador</div>
            <p className="text-[13px] text-[#888] leading-relaxed max-w-[240px]">
              Passeios e experiências com quem conhece de verdade.
            </p>
            <div className="flex gap-3 mt-4">
              {["Instagram", "TikTok", "YouTube"].map((s, i) => (
                <a key={i} href="#" className="text-[11px] text-[#999] bg-[#eee] px-3 py-1.5 rounded-full hover:bg-[#e0e0e0] transition-colors">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {columns.map((col, i) => (
            <div key={i}>
              <h4 className="text-[13px] font-semibold text-[#111] mb-4 uppercase tracking-wider">
                {col.title}
              </h4>
              {col.links.map((link, j) => (
                <a key={j} href={link.href} className="block text-[13px] text-[#888] mb-2.5 hover:text-[#111] transition-colors no-underline">
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="border-t border-[#eee] pt-6 flex justify-between items-center">
          <p className="text-[12px] text-[#bbb] m-0">
            © 2026 Passeador · CNPJ 00.000.000/0001-00
          </p>
          <div className="flex gap-4 items-center">
            <span className="text-[11px] text-[#999] font-semibold cursor-pointer">PT</span>
            <span className="text-[11px] text-[#ccc] cursor-pointer">EN</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
