import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ToursSection from "@/components/ToursSection";
import WhyUs from "@/components/WhyUs";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustBar />
      <ToursSection />
      <WhyUs />
      <ContactSection />
    </main>
  );
}
