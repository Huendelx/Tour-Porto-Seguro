import Image from "next/image";
import TourSearchBar from "./TourSearchBar";

export default function Hero() {
  return (
    <section className="relative min-h-screen md:min-h-[110vh] flex flex-col items-center overflow-hidden pt-14">
      {/* Mobile */}
      <div
        className="absolute inset-0 bg-cover bg-top md:hidden"
        style={{ backgroundImage: "url('/hero-bg.webp')" }}
      />
      {/* Desktop */}
      <div
        className="absolute inset-0 bg-cover bg-top hidden md:block"
        style={{ backgroundImage: "url('/hero-bg-desktop.webp')" }}
      />

      <div className="relative z-10 w-full max-w-3xl mx-auto px-5 flex flex-col items-center gap-8 mt-8 md:mt-24 mb-auto">
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/logo-passeador.svg"
            alt="Passeador"
            width={48}
            height={48}
            className="opacity-90"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <h1 className="text-4xl md:text-7xl font-semibold text-white text-center leading-tight tracking-tight drop-shadow-lg whitespace-nowrap lowercase">
            passeie pelo brasil
          </h1>
        </div>
        <p className="text-sm text-white/75 text-center max-w-[17rem] md:max-w-md -mt-4">
          Passeios e experiências exclusivas com guias locais certificados.
        </p>
        <TourSearchBar />
      </div>
    </section>
  );
}
