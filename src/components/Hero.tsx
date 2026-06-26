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
        <h1 className="text-4xl md:text-6xl font-semibold text-white text-center leading-tight tracking-tight drop-shadow-lg whitespace-nowrap">
          Passeie pelo Brasil
        </h1>
        <p className="text-sm text-white/75 text-center max-w-[17rem] md:max-w-md -mt-4">
          Passeios e experiências exclusivas com guias locais certificados.
        </p>
        <TourSearchBar />
      </div>
    </section>
  );
}
