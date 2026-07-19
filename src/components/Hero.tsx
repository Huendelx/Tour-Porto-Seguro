import TourSearchBar from "./TourSearchBar";

export default function Hero() {
  return (
    <>
      <section className="relative">
        {/* Cor de fundo — trocar por uma imagem/faixa promocional depois */}
        <div className="absolute inset-0 bg-[#a528fd]" />

        <div
          className="relative z-10 h-[220px] md:h-[280px] pt-14 flex flex-col items-center md:items-start justify-center gap-3 text-center md:text-left"
          style={{ padding: "56px max(24px, calc((100vw - 1200px) / 2)) 0" }}
        >
          <h1 className="text-3xl md:text-5xl font-semibold text-white leading-tight tracking-tight">
            Passeie pelo Brasil
          </h1>
          <p className="text-sm text-white/80 max-w-[17rem] md:max-w-md">
            Passeios e experiências exclusivas com guias locais certificados.
          </p>
        </div>

        {/* Search bar — o meio dela fica exatamente na borda de baixo da hero */}
        <div
          className="absolute left-0 right-0 z-20 flex justify-center px-4"
          style={{ bottom: 0, transform: "translateY(50%)", filter: "drop-shadow(0 10px 28px rgba(0,0,0,0.22))" }}
        >
          <TourSearchBar />
        </div>
      </section>

      {/* Respiro pra metade de baixo da barra de busca não encostar no conteúdo seguinte */}
      <div className="h-10 md:h-12 bg-white" />
    </>
  );
}
