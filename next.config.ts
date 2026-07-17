import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Fotos de passeio vêm de URL livre digitada pelo operador (sem upload
    // de verdade ainda) — sem isso, qualquer domínio fora da lista derruba
    // a página inteira com 500 (next/image rejeita hostname desconhecido).
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
