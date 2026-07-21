import Hero from "@/components/Hero";
import NossosDestaques from "@/components/NossosDestaques";
import TrustBar from "@/components/TrustBar";
import DestinosSection from "@/components/DestinosSection";
import ExperienciasSection from "@/components/ExperienciasSection";
import PasseiosProximos from "@/components/PasseiosProximos";
import PorQuePasseador from "@/components/PorQuePasseador";
import ComoFunciona from "@/components/ComoFunciona";
import CategoriasSection from "@/components/CategoriasSection";
import ProvaSocial from "@/components/ProvaSocial";
import CtaOperadores from "@/components/CtaOperadores";
import { getAllTours } from "@/lib/tours-data";

// Sempre por request — o catálogo vem do Supabase.
export const dynamic = "force-dynamic";

export default async function Home() {
  const tours = await getAllTours();

  return (
    <main>
      <Hero />
      <DestinosSection />
      <NossosDestaques />
      <PasseiosProximos tours={tours} />
      <ExperienciasSection />
      <PorQuePasseador />
      <ComoFunciona />
      <CategoriasSection />
      <ProvaSocial />
      <TrustBar />
      <CtaOperadores />
    </main>
  );
}
