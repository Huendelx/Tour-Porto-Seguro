import Image from "next/image";

export default function ComoFunciona() {
  return (
    <section className="pt-20 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center">
          <h2 className="text-[32px] font-bold text-[#111] leading-tight">Como funciona</h2>
          <p className="text-base text-[#666] mt-3 leading-relaxed">
            Reservar sua próxima aventura leva menos de 2 minutos.
          </p>
        </div>

        {/* Personagem central + passos flutuantes */}
        <div className="relative mx-auto max-w-[820px] h-[460px] sm:h-[540px] md:h-[620px] mt-[110px]">
          {/* Personagem */}
          <div className="absolute inset-0">
            <Image
              src="/images/como-funciona-personagem.webp"
              alt="Turista pronto pra explorar"
              fill
              sizes="(max-width: 768px) 90vw, 500px"
              className="object-contain object-bottom"
              priority={false}
            />
          </div>

          {/* Passo 1 */}
          <div
            className="absolute flex flex-col items-center text-center w-[110px] md:w-[130px] -translate-x-1/2"
            style={{ top: "calc(6% - 70px)", left: "calc(27% - 40px)" }}
          >
            <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-[#111] text-white flex items-center justify-center text-[15px] md:text-[17px] font-bold flex-shrink-0">1</div>
            <p className="mt-2.5 text-[13px] md:text-[15px] font-medium text-[#111] leading-snug">Escolha o destino</p>
          </div>

          {/* Passo 2 — no mobile entra 20px pra dentro */}
          <div
            className="absolute flex flex-col items-center text-center w-[110px] md:w-[130px] -translate-x-1/2 left-[calc(4%+20px)] md:left-[4%]"
            style={{ top: "calc(50% - 20px)" }}
          >
            <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-[#111] text-white flex items-center justify-center text-[15px] md:text-[17px] font-bold flex-shrink-0">2</div>
            <p className="mt-2.5 text-[13px] md:text-[15px] font-medium text-[#111] leading-snug">Reserve online</p>
          </div>

          {/* Passo 3 */}
          <div
            className="absolute flex flex-col items-center text-center w-[110px] md:w-[130px] -translate-x-1/2"
            style={{ top: "calc(34% - 20px)", left: "86%" }}
          >
            <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-[#111] text-white flex items-center justify-center text-[15px] md:text-[17px] font-bold flex-shrink-0">3</div>
            <p className="mt-2.5 text-[13px] md:text-[15px] font-medium text-[#111] leading-snug">Viva a experiência</p>
          </div>
        </div>
      </div>
    </section>
  );
}
