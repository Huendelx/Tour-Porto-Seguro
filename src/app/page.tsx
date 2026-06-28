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

export default function Home() {
  return (
    <main>
      <Hero />
      <NossosDestaques />
      <TrustBar />
      <DestinosSection />
      <ExperienciasSection />
      <PasseiosProximos />
      <ComoFunciona />
      <CategoriasSection />
      <ProvaSocial />
      <CtaOperadores />
    </main>
  );
}
