import TourSearchBar from "./TourSearchBar";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg.webp')" }}
      />

      <div className="relative z-10 w-full max-w-3xl mx-auto px-5 flex flex-col items-center gap-8">
        <h1 className="text-3xl md:text-5xl font-semibold text-white text-center leading-tight tracking-tight drop-shadow-lg whitespace-nowrap">
          Explore Porto Seguro
        </h1>
        <TourSearchBar />
        <p className="text-sm text-white/75 text-center max-w-md">
          Passeios exclusivos em Porto Seguro e região. Do recife de corais às vilas históricas, cada experiência é inesquecível.
        </p>
      </div>
    </section>
  );
}
