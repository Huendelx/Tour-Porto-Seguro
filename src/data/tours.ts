export interface Tour {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  groupSize: string;
  price: number;
  priceUnit: string;
  category: "nautico" | "terrestre" | "aventura" | "cultural";
  highlights: string[];
  includes: string[];
  image: string;
  featured?: boolean;
  badge?: string;
}

export const tours: Tour[] = [
  {
    id: "arraial-da-ajuda",
    title: "Arraial d'Ajuda e Trancoso",
    subtitle: "Vilas históricas e praias paradisíacas",
    description:
      "Conheça o charme colonial de Arraial d'Ajuda e a sofisticação rústica de Trancoso, passando por praias desertas com água cristalina.",
    duration: "Dia inteiro",
    groupSize: "Até 15 pessoas",
    price: 120,
    priceUnit: "por pessoa",
    category: "terrestre",
    highlights: ["Quadrado de Trancoso", "Praia dos Coqueiros", "Igreja de Arraial"],
    includes: ["Transporte", "Guia local", "Água mineral"],
    image: "/images/arraial.webp",
    featured: true,
    badge: "Mais vendido",
  },
  {
    id: "recife-de-fora",
    title: "Recife de Fora",
    subtitle: "Snorkeling entre peixe-palhaço e tartarugas",
    description:
      "Navegue até o maior parque marinho nacional e mergulhe entre corais vivos, peixes coloridos e águas de até 30m de visibilidade.",
    duration: "4 horas",
    groupSize: "Até 20 pessoas",
    price: 95,
    priceUnit: "por pessoa",
    category: "nautico",
    highlights: ["Parque Marinho Nacional", "Snorkeling guiado", "Piscinas naturais"],
    includes: ["Barco", "Equipamento de snorkel", "Colete salva-vidas", "Guia"],
    image: "/images/recife.webp",
    featured: true,
    badge: "Imperdível",
  },
  {
    id: "coroa-vermelha",
    title: "Coroa Vermelha e Taperapuã",
    subtitle: "Praias urbanas e cultura indígena",
    description:
      "Visite o local histórico onde o Brasil foi descoberto, explore o mercado indígena e aproveite as praias com estrutura completa.",
    duration: "Meio dia",
    groupSize: "Até 20 pessoas",
    price: 65,
    priceUnit: "por pessoa",
    category: "cultural",
    highlights: ["Marco do Descobrimento", "Mercado Pataxó", "Taperapuã Beach"],
    includes: ["Transporte", "Guia histórico"],
    image: "/images/coroa.webp",
  },
  {
    id: "caraiva",
    title: "Caraíva — Aldeia Mágica",
    subtitle: "O vilarejo sem carros mais bonito da Bahia",
    description:
      "Travessia de canoa, ruas de areia branca e simplicidade absoluta. Caraíva é a joia escondida do litoral sul da Bahia.",
    duration: "Dia inteiro",
    groupSize: "Até 12 pessoas",
    price: 150,
    priceUnit: "por pessoa",
    category: "aventura",
    highlights: ["Travessia de canoa", "Praia sem estrutura", "Aldeia histórica"],
    includes: ["Transporte 4x4", "Travessia de barco", "Almoço típico"],
    image: "/images/caraiva.webp",
    featured: true,
  },
  {
    id: "morro-de-sao-paulo",
    title: "Morro de São Paulo",
    subtitle: "Ilha sem carros, praias sem igual",
    description:
      "Passeio de catamarã até Morro de São Paulo, a ilha proibida de carros com praias enfileiradas de tirar o fôlego.",
    duration: "Dia inteiro",
    groupSize: "Até 30 pessoas",
    price: 180,
    priceUnit: "por pessoa",
    category: "nautico",
    highlights: ["Catamarã", "Quatro praias numeradas", "Fortaleza histórica"],
    includes: ["Passeio de barco", "Guia", "Almoço a bordo"],
    image: "/images/morro.webp",
  },
  {
    id: "praia-do-espelho",
    title: "Praia do Espelho",
    subtitle: "A praia mais linda do Brasil",
    description:
      "Considerada uma das praias mais bonitas do mundo, com piscinas naturais, falésias coloridas e água espelhada na maré baixa.",
    duration: "Dia inteiro",
    groupSize: "Até 15 pessoas",
    price: 130,
    priceUnit: "por pessoa",
    category: "terrestre",
    highlights: ["Piscinas naturais", "Falésias coloridas", "Água cristalina"],
    includes: ["Transporte 4x4", "Guia local"],
    image: "/images/espelho.webp",
    badge: "Top 5 Brasil",
  },
];

export const categoryLabel: Record<Tour["category"], string> = {
  nautico: "Náutico",
  terrestre: "Terrestre",
  aventura: "Aventura",
  cultural: "Cultural",
};
