import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import DestinosSection from "@/components/DestinosSection";
import ExperienciasSection from "@/components/ExperienciasSection";
import ComoFunciona from "@/components/ComoFunciona";
import CategoriasSection from "@/components/CategoriasSection";
import ProvaSocial from "@/components/ProvaSocial";
import CtaOperadores from "@/components/CtaOperadores";

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustBar />
      <DestinosSection />
      <ExperienciasSection />
      <ComoFunciona />
      <CategoriasSection />
      <ProvaSocial />
      <CtaOperadores />
    </main>
  );
}
