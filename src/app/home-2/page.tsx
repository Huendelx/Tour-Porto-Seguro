import HeroClassic from "@/components/HeroClassic";
import NossosDestaques from "@/components/NossosDestaques";
import TrustBar from "@/components/TrustBar";
import DestinosSection from "@/components/DestinosSection";
import ExperienciasSection from "@/components/ExperienciasSection";
import PasseiosProximos from "@/components/PasseiosProximos";
import ComoFunciona from "@/components/ComoFunciona";
import CategoriasSection from "@/components/CategoriasSection";
import ProvaSocial from "@/components/ProvaSocial";
import CtaOperadores from "@/components/CtaOperadores";
import { getAllTours } from "@/lib/tours-data";

// Cópia de segurança da home antiga (hero clássico 100vh) — pra comparar com a nova versão.
export const dynamic = "force-dynamic";

export default async function Home2() {
  const tours = await getAllTours();

  return (
    <main>
      <HeroClassic />
      <TrustBar />
      <NossosDestaques />
      <DestinosSection />
      <ExperienciasSection />
      <PasseiosProximos tours={tours} />
      <ComoFunciona />
      <CategoriasSection />
      <ProvaSocial />
      <CtaOperadores />
    </main>
  );
}
