import Image from "next/image";
import TourSearchBar from "./TourSearchBar";

const BANNER_ALT = "Passeador — passeios e experiências com quem conhece de verdade";

// Dimensões reais da arte atual — trocar se re-exportar noutra proporção.
const BANNER_W = 2312;
const BANNER_H = 495;

export default function Hero() {
  return (
    <>
      <section className="relative bg-[#a528fd]">
        {/* H1 real escondido: o texto da arte é imagem (Google não lê), então mantém o heading pra SEO */}
        <h1 className="sr-only">Passeie pelo Brasil — passeios e experiências em Porto Seguro</h1>

        {/* pt-14: a arte fica ABAIXO do header, que flutua sobre a faixa roxa do topo.
            pb no mobile: a busca flutuante morde a borda de baixo da section — sem esse
            respiro ela cobria a base da arte (que no mobile é baixinha). */}
        <div className="pt-14 pb-10 md:pb-0">
          {/* Banner contido na largura do conteúdo (1200px). Nas telas largas o roxo
              da section vaza nas laterais (costura invisível, mesma cor da arte).
              Largura total + altura natural = nada corta, no desktop nem no mobile. */}
          <div className="mx-auto w-full max-w-[1200px]">
            <Image
              src="/hero-banner-desktop.webp"
              alt={BANNER_ALT}
              width={BANNER_W}
              height={BANNER_H}
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Search bar — o meio dela fica exatamente na borda de baixo da faixa */}
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
