import { Anchor } from "@phosphor-icons/react/dist/ssr";

export default function Footer() {
  return (
    <footer className="py-8 px-5 border-t" style={{ borderColor: "var(--tps-sand-dark)", backgroundColor: "var(--tps-white)" }}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold" style={{ color: "var(--tps-ocean)" }}>
          <Anchor size={20} weight="fill" />
          Passeador
        </div>
        <p className="text-xs" style={{ color: "var(--tps-gray)" }}>
          © {new Date().getFullYear()} Passeador · CADASTUR registrado · Porto Seguro, BA
        </p>
      </div>
    </footer>
  );
}
