import { WhatsappLogo, MapPin, InstagramLogo } from "@phosphor-icons/react/dist/ssr";

export default function ContactSection() {
  return (
    <section id="contato" className="py-24 px-5" style={{ backgroundColor: "var(--tps-ocean)" }}>
      <div className="max-w-4xl mx-auto text-center text-white">
        <p className="text-sm font-bold uppercase tracking-widest mb-3 opacity-70">Fale conosco</p>
        <h2 className="text-4xl md:text-5xl font-black mb-4">Pronto para sua aventura?</h2>
        <p className="text-xl opacity-80 mb-10 max-w-xl mx-auto">
          Tire dúvidas, monte seu roteiro e garanta sua reserva agora mesmo.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <a
            href="https://wa.me/5573999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105"
            style={{ backgroundColor: "#25d366", color: "white" }}
          >
            <WhatsappLogo size={24} weight="fill" />
            Chamar no WhatsApp
          </a>
          <a
            href="https://instagram.com/tourportoseguro"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg border-2 border-white/50 hover:border-white transition-colors"
            style={{ color: "white" }}
          >
            <InstagramLogo size={24} weight="fill" />
            Instagram
          </a>
        </div>

        <div
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm opacity-70"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        >
          <MapPin size={16} weight="fill" />
          Porto Seguro, Bahia — Atendemos toda a Costa do Descobrimento
        </div>
      </div>
    </section>
  );
}
