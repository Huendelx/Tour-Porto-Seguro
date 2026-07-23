import Link from "next/link";
import {
  Boat, Fish, CarProfile, AirplaneInFlight, TreeEvergreen, Building, SunHorizon, MagnifyingGlass,
} from "@phosphor-icons/react/dist/ssr";

// Ícones duotone bolados na primeira versão (viviam no menu mobile) — cada
// card leva pra busca já filtrada na categoria correspondente do catálogo.
const cats = [
  { name: "Passeio de Lancha", desc: "Ilhas, recifes e praias paradisíacas", icon: Boat, categoria: "nautico" },
  { name: "Mergulho", desc: "Snorkel e mergulho nos recifes de corais", icon: Fish, categoria: "nautico" },
  { name: "Passeio de Buggy", desc: "Aventura pelas dunas e praias", icon: CarProfile, categoria: "aventura" },
  { name: "Voo Panorâmico", desc: "O litoral visto de cima", icon: AirplaneInFlight, categoria: "aventura" },
  { name: "Trilha na Mata", desc: "Natureza e Mata Atlântica preservada", icon: TreeEvergreen, categoria: "aventura" },
  { name: "Passeio Cultural", desc: "Centro Histórico e cultura local", icon: Building, categoria: "cultural" },
  { name: "Pôr do Sol", desc: "Passeio ao entardecer pelo litoral", icon: SunHorizon, categoria: "noturno" },
  { name: "Ver todos", desc: "O catálogo completo de experiências", icon: MagnifyingGlass, categoria: null },
];

export default function CategoriasSection() {
  return (
    <section className="py-20 bg-[#fafafa]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-[26px] md:text-[32px] font-bold text-[#111] leading-tight">Explore por categoria</h2>
          <p className="text-[14px] md:text-base text-[#666] mt-2 md:mt-3 leading-relaxed">
            Não sabe por onde começar? Navegue pelo tipo de experiência.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {cats.map((c) => (
            <Link
              key={c.name}
              href={c.categoria ? `/buscar?categoria=${c.categoria}` : "/buscar"}
              className="group bg-white rounded-xl px-5 py-6 border border-[#eee] hover:border-[#ccc] hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all"
            >
              <c.icon size={28} weight="duotone" className="text-[#111] mb-3" />
              <h3 className="text-[15px] font-semibold text-[#111] mb-1">{c.name}</h3>
              <p className="text-[12px] text-[#999] m-0 leading-relaxed">{c.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
