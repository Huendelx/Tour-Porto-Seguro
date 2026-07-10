import { Tour } from "@/data/tours";

export interface Review {
  name: string;
  from: string;
  date: string;
  rating: number;
  text: string;
  /** Slugs de passeios que a review menciona diretamente */
  slugs?: string[];
  /** Categoria a que a review se aplica */
  category?: Tour["category"];
}

// Reviews de demonstração até termos avaliações reais (Fase 3 da spec).
export const reviews: Review[] = [
  // ── Terrestre ──
  {
    name: "Camila", from: "Campinas, Brasil", date: "3 dias atrás", rating: 5,
    category: "terrestre", slugs: ["trancoso"],
    text: "O dia inteiro super bem organizado. A cabana na Praia dos Coqueiros era ótima e o guia contou histórias do Quadrado que a gente nunca ia descobrir sozinho. As paradas do retorno — cachaça artesanal e chocolate de cacau — fecharam o dia com chave de ouro. Van confortável e saída pontual.",
  },
  {
    name: "Fernando", from: "Goiânia, Brasil", date: "1 semana atrás", rating: 5,
    category: "terrestre", slugs: ["praia-do-espelho", "trancoso-espelho"],
    text: "O caminho de 4x4 já vale o passeio — fazenda de búfalos, mata, estrada de terra. E a Praia do Espelho é surreal, as piscinas naturais estavam perfeitas na maré baixa.",
  },
  {
    name: "Laura", from: "Buenos Aires, Argentina", date: "junho de 2026", rating: 5,
    category: "terrestre",
    text: "Hermoso paseo, la playa es increíble y el guía muy atento con todo el grupo. Recomiendo llevar efectivo para las paradas del regreso.",
  },
  {
    name: "Ricardo", from: "São José dos Campos, Brasil", date: "junho de 2026", rating: 5,
    category: "terrestre", slugs: ["arraial-da-ajuda"],
    text: "Van confortável, saída pontual às 7h40 e retorno no horário combinado. A travessia de balsa é rapidinha e a vila histórica no fim da tarde foi o ponto alto.",
  },

  // ── Náutico ──
  {
    name: "Juliana", from: "Belo Horizonte, Brasil", date: "2 semanas atrás", rating: 5,
    category: "nautico", slugs: ["recife-de-fora", "recife-de-fora-com-transfer"],
    text: "Snorkel no Recife de Fora foi o ponto alto da viagem. A aula sobre vida marinha antes de entrar na água fez toda a diferença — a gente sabia exatamente o que estava vendo nas piscinas. Equipamento novo e tripulação atenciosa.",
  },
  {
    name: "Mark", from: "Austin, Estados Unidos", date: "maio de 2026", rating: 5,
    category: "nautico",
    text: "Crystal clear water and a very professional crew. The natural pools are stunning at low tide — book the early departure if you can.",
  },
  {
    name: "Renata", from: "Porto Alegre, Brasil", date: "junho de 2026", rating: 5,
    category: "nautico", slugs: ["mergulho"],
    text: "Primeira vez mergulhando e me senti segura o tempo todo. Instrutor exclusivo pra nossa dupla, roupa e equipamento novinhos. As fotos submersas ficaram incríveis — vale cada centavo.",
  },
  {
    name: "Otávio", from: "Salvador, Brasil", date: "maio de 2026", rating: 5,
    category: "nautico", slugs: ["fluvial-coroa-alta"],
    text: "A escuna é tranquila e a parada na Ilha do Sol com os licores é imperdível. O banho de lama no manguezal foi divertidíssimo.",
  },

  // ── Aventura ──
  {
    name: "Bianca", from: "Vitória, Brasil", date: "5 dias atrás", rating: 5,
    category: "aventura", slugs: ["caraiva", "caraiva-espelho"],
    text: "Caraíva é outro mundo. A travessia de canoa, as ruas de areia, o pastel famoso… o guia deixou a gente no ritmo da vila, sem pressa. Uma das experiências mais marcantes que já tive viajando pelo Brasil. Voltaria amanhã.",
  },
  {
    name: "Diego", from: "Montevideo, Uruguai", date: "junho de 2026", rating: 5,
    category: "aventura", slugs: ["quadriciclo-acai"],
    text: "El cuatriciclo por la Mata Atlántica fue pura adrenalina. La cascada al final es hermosa y la degustación de açaí, un golazo.",
  },
  {
    name: "Paulo", from: "Uberlândia, Brasil", date: "maio de 2026", rating: 5,
    category: "aventura", slugs: ["quadriciclo-aldeia"],
    text: "Trilha bem sinalizada, capacete e instruções direitinho antes de sair. Minha esposa foi de garupa e curtiu tanto quanto eu pilotando.",
  },

  // ── Cultural ──
  {
    name: "Estela", from: "Fortaleza, Brasil", date: "1 semana atrás", rating: 5,
    category: "cultural", slugs: ["coroa-vermelha"],
    text: "A recepção dos Pataxós foi emocionante — dança, história e um artesanato lindo na passarela. E a praia de Coroa Vermelha tem água quentinha, ótima pra ir com crianças.",
  },
  {
    name: "Henrique", from: "Recife, Brasil", date: "junho de 2026", rating: 5,
    category: "cultural", slugs: ["rota-da-redescoberta"],
    text: "Roteiro que mistura história e praia na medida certa. O city tour pela cidade histórica no final deu contexto pra tudo que a gente viu na viagem.",
  },

  // ── Noturno ──
  {
    name: "Vanessa", from: "Florianópolis, Brasil", date: "3 semanas atrás", rating: 5,
    category: "noturno", slugs: ["by-night-arraial"],
    text: "A Rua Mucugê à noite é um charme só — jantamos ouvindo música ao vivo e ainda deu tempo de ver a praça da igreja iluminada. Voltamos no horário certinho.",
  },

  // ── Gerais (plataforma/operador) ──
  {
    name: "Rafael", from: "Belo Horizonte, Brasil", date: "junho de 2026", rating: 5,
    text: "A praticidade de reservar online e saber que está tudo confirmado faz muita diferença. Sem surpresa, sem perrengue. Recomendo demais.",
  },
  {
    name: "Sophie", from: "Paris, França", date: "maio de 2026", rating: 5,
    text: "We came to Bahia with no idea where to go. Booking through Passeador made everything easy — verified operators and great local guides.",
  },
];

/** Reviews mais relevantes para um passeio: primeiro as que citam o slug, depois a categoria, depois as gerais. */
export function reviewsForTour(tour: Tour, limit = 6): Review[] {
  const bySlug = reviews.filter((r) => r.slugs?.includes(tour.slug));
  const byCategory = reviews.filter((r) => !r.slugs?.includes(tour.slug) && r.category === tour.category);
  const general = reviews.filter((r) => !r.category);
  return [...bySlug, ...byCategory, ...general].slice(0, limit);
}
