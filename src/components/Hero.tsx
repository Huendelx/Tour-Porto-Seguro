import { MapPin, Star } from "@phosphor-icons/react/dist/ssr";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg.webp')" }}
      />
      {/* Dark overlay so o texto fica legível */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 max-w-4xl mx-auto px-5 text-center text-white">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
          style={{ backgroundColor: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}
        >
          <MapPin size={16} weight="fill" />
          Porto Seguro, Bahia — Sul da Bahia
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
          O paraíso que você
          <br />
          <span style={{ color: "var(--tps-sand)" }}>sempre quis conhecer</span>
        </h1>

        <p className="text-xl md:text-2xl mb-10 opacity-85 max-w-2xl mx-auto leading-relaxed">
          Passeios exclusivos em Porto Seguro e região. Do recife de corais às vilas históricas, cada experiência é inesquecível.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#passeios"
            className="px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105"
            style={{ backgroundColor: "var(--tps-coral)", color: "white" }}
          >
            Ver passeios
          </a>
          <a
            href="https://wa.me/5573999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-full font-bold text-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.6)", color: "white" }}
          >
            Falar no WhatsApp
          </a>
        </div>

        <div className="mt-14 flex items-center justify-center gap-6 flex-wrap">
          <div className="flex items-center gap-1 opacity-80">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} weight="fill" style={{ color: "var(--tps-sand)" }} />
            ))}
            <span className="ml-2 text-sm">4.9 (800+ avaliações)</span>
          </div>
          <span className="opacity-40">·</span>
          <span className="opacity-80 text-sm">+12 anos de experiência</span>
          <span className="opacity-40">·</span>
          <span className="opacity-80 text-sm">Guias licenciados CADASTUR</span>
        </div>
      </div>
    </section>
  );
}
