import { ShieldCheck, UsersThree, Heart, Clock } from "@phosphor-icons/react/dist/ssr";

const items = [
  {
    icon: <ShieldCheck size={32} weight="fill" />,
    title: "Segurança em primeiro lugar",
    desc: "Guias certificados CADASTUR, equipamentos homologados e seguro de viagem incluído.",
  },
  {
    icon: <UsersThree size={32} weight="fill" />,
    title: "Grupos pequenos",
    desc: "Máximo de 20 pessoas por passeio para garantir atenção e experiência personalizada.",
  },
  {
    icon: <Heart size={32} weight="fill" />,
    title: "+12 anos de paixão",
    desc: "Nascemos em Porto Seguro e conhecemos cada trilha, praia e vila da região.",
  },
  {
    icon: <Clock size={32} weight="fill" />,
    title: "Pontualidade garantida",
    desc: "Respeitamos seu tempo de férias. Saídas no horário com transporte confortável.",
  },
];

export default function WhyUs() {
  return (
    <section id="sobre" className="py-24 px-5" style={{ backgroundColor: "var(--tps-sand)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "var(--tps-ocean)" }}>
            Por que nos escolher
          </p>
          <h2 className="text-4xl md:text-5xl font-black" style={{ color: "var(--tps-dark)" }}>
            Sua experiência é nossa missão
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl flex flex-col gap-4"
              style={{ backgroundColor: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
            >
              <div style={{ color: "var(--tps-ocean)" }}>{item.icon}</div>
              <h3 className="font-bold text-lg leading-tight" style={{ color: "var(--tps-dark)" }}>
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--tps-gray)" }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
