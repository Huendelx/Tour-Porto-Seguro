import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { getAllTours } from "@/lib/tours-data";
import TourResultCard from "@/components/TourResultCard";

const DESTINOS: Record<string, { name: string; description: string; image: string }> = {
  "porto-seguro": {
    name: "Porto Seguro",
    description:
      "A Costa do Descobrimento — berço do Brasil, praias paradisíacas, cultura indígena Pataxó e uma das costas mais bonitas do mundo. Porto Seguro concentra os melhores passeios da Bahia com guias credenciados CADASTUR.",
    image: "/hero-bg.webp",
  },
  "arraial-da-ajuda": {
    name: "Arraial d'Ajuda",
    description:
      "Vila histórica com charme único, praias incríveis e a famosa rua Mucugê. Arraial d'Ajuda fica a uma curta travessia de balsa de Porto Seguro e é um dos destinos mais charmosos da Bahia.",
    image: "/images/arraial.webp",
  },
  "trancoso": {
    name: "Trancoso",
    description:
      "O famoso Quadrado de Trancoso e a Praia dos Coqueiros — um destino sofisticado e histórico que encanta turistas do mundo inteiro.",
    image: "/images/arraial.webp",
  },
  "caraiva": {
    name: "Caraíva",
    description:
      "A aldeia mágica sem carros do litoral sul da Bahia. Ruas de areia, simplicidade absoluta e natureza preservada.",
    image: "/images/caraiva.webp",
  },
  "praia-do-espelho": {
    name: "Praia do Espelho",
    description:
      "Considerada uma das praias mais bonitas do Brasil, com piscinas naturais, falésias coloridas e água espelhada na maré baixa.",
    image: "/images/espelho.webp",
  },
};

export async function generateStaticParams() {
  return Object.keys(DESTINOS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const destino = DESTINOS[slug];
  if (!destino) return { title: "Destino não encontrado" };
  return {
    title: `Passeios em ${destino.name} — Passeador`,
    description: destino.description,
    openGraph: { title: `Passeios em ${destino.name}`, description: destino.description, images: [destino.image] },
  };
}

export default async function DestinoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destino = DESTINOS[slug];
  if (!destino) notFound();

  const destinoTours = await getAllTours();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative w-full h-[45vw] max-h-[420px] min-h-[220px] bg-gray-100">
        <Image src={destino.image} alt={destino.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            <p className="text-white/60 text-sm mb-1">Destino</p>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">{destino.name}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-10">
        <p className="text-[#555] leading-relaxed text-[15px] max-w-2xl mb-10">{destino.description}</p>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#111]">
            {destinoTours.length} passeio{destinoTours.length !== 1 ? "s" : ""} disponíveis
          </h2>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-x-5 gap-y-9">
          {destinoTours.map((tour) => (
            <TourResultCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </main>
  );
}
