import Hero from "@/components/Hero";
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

export default async function Home() {
  const tours = await getAllTours();

  return (
    <main>
      <Hero />
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
