export interface TourOperator {
  name: string;
  whatsapp: string;
  years: number;
  cadastur?: string;
}

export interface TourPrice {
  label: string;
  ageMin?: number;
  ageMax?: number;
  priceMin: number;
  priceMax: number;
  isFree?: boolean;
  notes?: string;
  category: "adult" | "child" | "infant" | "companion";
}

export interface TourSchedule {
  frequency: "daily" | "specific_days" | "tide_based";
  days?: string;
  departureStart?: string;
  departureEnd?: string;
  returnTime?: string;
  notes?: string;
}

export interface Tour {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  tips?: string;
  importantInfo?: string;
  duration: string;
  durationMinutes?: number;
  distanceKm?: number;
  groupSize: string;
  price: number;
  priceMax?: number;
  priceUnit: string;
  prices: TourPrice[];
  category: "nautico" | "terrestre" | "aventura" | "cultural" | "noturno";
  transportType: string;
  highlights: string[];
  includes: string[];
  excludes: string[];
  image: string;
  images?: string[];
  featured?: boolean;
  badge?: string;
  operator: TourOperator;
  schedule: TourSchedule;
  meetingPoint?: string;
  cancellationPolicy: string;
  hasTransfer?: boolean;
  trackable?: boolean;
  destinos: string[];
}

const OPERATOR: TourOperator = {
  name: "Porto Brasil Turismo",
  whatsapp: "5573991579960",
  years: 12,
  cadastur: "12345678",
};

const CANCELLATION = `
Comunicação com 48h ou mais de antecedência: 50% de reembolso.
Menos de 24h: sem reembolso.
Doença com atestado médico: 50% de reembolso.
Sinal de reserva não reembolsável.
Compras no cartão com dedução da taxa da operadora.
`.trim();

const EXCLUDES_DEFAULT = ["Alimentação", "Bebidas", "Consumos pessoais"];

export const tours: Tour[] = [
  {
    id: "trancoso",
    slug: "trancoso",
    destinos: ["trancoso"],
    title: "Trancoso",
    subtitle: "Praia dos Coqueiros + Quadrado de Trancoso",
    description:
      "Destino de aproximadamente 80km, cerca de 1h30 de viagem. Iniciamos o passeio com destino direto à praia dos Coqueiros, onde permanecemos por 4h numa cabana de praia completa para um confortável dia. Vale a pena considerar uma caminhada de 10min para conhecer também a Praia dos Nativos, onde fica a famosa casinha do pescador. A segunda etapa do passeio é no charmoso Quadrado de Trancoso. O guia compartilha ricas informações sobre a comunidade, sua história, a Igreja São João Batista e muito mais. Após, no retorno aos hotéis, temos duas paradas: uma em Vale Verde, para degustar as famosas cachaças da região e as deliciosas cocadas e doces produzidos pela comunidade; e outra numa fábrica de chocolate, para conhecer de perto o cacau.",
    tips: "Faça uma caminhada até a Praia dos Nativos e conheça a famosa casinha do pescador (15 minutos a pé). Experimente o suco de dona Aidê no mirante do Quadrado. Aproveite as artes dos hippies do quadrado.",
    importantInfo:
      "Passeio de dia inteiro. Passageiro precisa de dia inteiro disponível — não vale para dias de chegada ou partida. Não inclui alimentação.",
    duration: "Dia inteiro",
    durationMinutes: 540,
    distanceKm: 80,
    groupSize: "Até 15 pessoas",
    price: 90,
    priceMax: 100,
    priceUnit: "por pessoa",
    prices: [
      { label: "Adulto", priceMin: 90, priceMax: 100, category: "adult" },
      { label: "Criança 6–8 anos", ageMin: 6, ageMax: 8, priceMin: 60, priceMax: 80, category: "child" },
      { label: "Bebê de colo (0–3 anos)", ageMin: 0, ageMax: 2, priceMin: 0, priceMax: 0, isFree: true, category: "infant" },
    ],
    category: "terrestre",
    transportType: "Van climatizada",
    highlights: ["Praia dos Coqueiros", "Quadrado de Trancoso", "Igreja São João Batista", "Vale Verde — cachaças e doces regionais"],
    includes: ["Transporte ida/volta", "Guia CADASTUR credenciado"],
    excludes: EXCLUDES_DEFAULT,
    image: "/images/arraial.webp",
    featured: true,
    badge: "Mais vendido",
    operator: OPERATOR,
    schedule: {
      frequency: "daily",
      departureStart: "7h40",
      departureEnd: "8h40",
      returnTime: "17h",
    },
    cancellationPolicy: CANCELLATION,
  },
  {
    id: "arraial-da-ajuda",
    slug: "arraial-da-ajuda",
    destinos: ["arraial"],
    title: "Arraial d'Ajuda",
    subtitle: "Praia e Vilarejo",
    description:
      "Começamos esse roteiro com uma deliciosa travessia de balsa de 12 minutos pelo Rio Buranhém e seguimos direto à praia. A 1ª parada acontece na praia, com permanência de 4h. Depois seguimos para a charmosa Vila de Nossa Senhora d'Ajuda para conhecer o famoso mirante das fitas, a fonte de água da santa, a rua Bróduei e a linda Igreja.",
    tips: "Use protetor solar. Visite o Mirante das fitas. Caminhe pela rua Bróduei. Desça a escadaria e visite a fonte de água da santa.",
    importantInfo:
      "Inclui travessia de balsa pelo Rio Buranhém (12 minutos). Passeio de dia inteiro.",
    duration: "Dia inteiro",
    durationMinutes: 540,
    groupSize: "Até 20 pessoas",
    price: 100,
    priceMax: 110,
    priceUnit: "por pessoa",
    prices: [
      { label: "Adulto", priceMin: 100, priceMax: 110, category: "adult" },
      { label: "Criança 8–9 anos", ageMin: 8, ageMax: 9, priceMin: 90, priceMax: 100, category: "child" },
      { label: "Bebê de colo (0–3 anos)", ageMin: 0, ageMax: 2, priceMin: 0, priceMax: 0, isFree: true, category: "infant" },
    ],
    category: "terrestre",
    transportType: "Van climatizada + balsa",
    highlights: ["Praia de Arraial d'Ajuda", "Mirante das fitas", "Vila histórica", "Rua Bróduei"],
    includes: ["Transporte ida/volta", "Travessia de balsa", "Guia CADASTUR credenciado"],
    excludes: EXCLUDES_DEFAULT,
    image: "/images/arraial.webp",
    featured: true,
    operator: OPERATOR,
    schedule: {
      frequency: "daily",
      departureStart: "7h40",
      departureEnd: "8h40",
      returnTime: "17h",
    },
    cancellationPolicy: CANCELLATION,
  },
  {
    id: "praia-do-espelho",
    slug: "praia-do-espelho",
    destinos: ["praia-espelho"],
    title: "Praia do Espelho",
    subtitle: "Praia + Vale Verde",
    description:
      "Esse passeio é uma mistura de emoção e aventura, graças ao marcante caminho repleto de belas paisagens em meio à mata, trilhado boa parte por estrada de terra. Cruzamos uma grande fazenda de búfalos e passamos pelo Rio dos Frades. A terceira praia mais bela do Brasil! Conhecida como Praia do Espelho, Curuípe é famosa por seus espelhos d'água, formados nas piscinas naturais entre os corais e o arenito, e pela beleza das gigantes falésias.",
    tips: "Use e abuse do protetor solar. Leve dinheirinho em trocado ou prepare o pix para a parada em Vale Verde.",
    importantInfo:
      "Percurso de 80km com trecho em estrada de terra. Recomendado para quem tem disposição para aventura. Passeio de dia inteiro.",
    duration: "Dia inteiro",
    durationMinutes: 540,
    distanceKm: 80,
    groupSize: "Até 15 pessoas",
    price: 110,
    priceMax: 120,
    priceUnit: "por pessoa",
    prices: [
      { label: "Adulto", priceMin: 110, priceMax: 120, category: "adult" },
      { label: "Criança 3–5 anos", ageMin: 3, ageMax: 5, priceMin: 90, priceMax: 100, category: "child" },
      { label: "Bebê de colo (0–2 anos)", ageMin: 0, ageMax: 2, priceMin: 0, priceMax: 0, isFree: true, category: "infant" },
    ],
    category: "terrestre",
    transportType: "4x4",
    highlights: ["Piscinas naturais", "Falésias coloridas", "Água espelhada na maré baixa", "Vale Verde"],
    includes: ["Transporte 4x4 ida/volta", "Guia CADASTUR credenciado"],
    excludes: EXCLUDES_DEFAULT,
    image: "/images/espelho.webp",
    featured: true,
    badge: "Top 5 Brasil",
    operator: OPERATOR,
    schedule: {
      frequency: "daily",
      departureStart: "7h40",
      departureEnd: "8h40",
      returnTime: "17h",
    },
    cancellationPolicy: CANCELLATION,
  },
  {
    id: "coroa-vermelha",
    slug: "coroa-vermelha",
    destinos: ["porto-seguro"],
    title: "Coroa Vermelha",
    subtitle: "Praia + Aldeia Indígena",
    description:
      "Visitamos uma aldeia indígena e somos recebidos em Patxohã pelos Pataxós, que compartilham as riquezas de sua cultura através de uma breve apresentação com história e curiosidades, lindos artesanatos, dança e convite para participar. Após 40 minutos na tribo, vamos à Praia de Coroa Vermelha, famosa por suas águas quentes e claras. Permanecemos por 4h. Após, 1h de passeio livre na passarela indígena.",
    tips: "Use protetor solar. Leve óculos escuros. Explore a passarela indígena — artesanatos incríveis com ótimos preços.",
    importantInfo:
      "Passeio realizado segundas, quartas e sextas. Retorno mais cedo (15h).",
    duration: "Meio dia",
    durationMinutes: 420,
    groupSize: "Até 20 pessoas",
    price: 75,
    priceMax: 85,
    priceUnit: "por pessoa",
    prices: [
      { label: "Adulto", priceMin: 75, priceMax: 85, category: "adult" },
      { label: "Criança 8–9 anos", ageMin: 8, ageMax: 9, priceMin: 65, priceMax: 75, category: "child" },
      { label: "Bebê de colo (0–2 anos)", ageMin: 0, ageMax: 2, priceMin: 0, priceMax: 0, isFree: true, category: "infant" },
    ],
    category: "cultural",
    transportType: "Van climatizada",
    highlights: ["Aldeia Pataxó", "Apresentação cultural", "Praia de Coroa Vermelha", "Passarela indígena"],
    includes: ["Transporte ida/volta", "Guia histórico CADASTUR credenciado"],
    excludes: EXCLUDES_DEFAULT,
    image: "/images/coroa.webp",
    operator: OPERATOR,
    schedule: {
      frequency: "specific_days",
      days: "Seg / Qua / Sex",
      departureStart: "7h40",
      departureEnd: "8h40",
      returnTime: "15h",
    },
    cancellationPolicy: CANCELLATION,
  },
  {
    id: "caraiva",
    slug: "caraiva",
    destinos: ["caraiva"],
    title: "Caraíva",
    subtitle: "Praia + Rio + Vila",
    description:
      "Caraíva é sinônimo de sossego e contato total com a natureza. Percurso de aproximadamente 120km, sendo 50min de asfalto e 1h40min de estrada de terra. Na chegada, travessia de canoa até a Vila. O guia apresenta os pontos turísticos: a famosa casinha do 'Sorria, você está em Caraíva', a barra do rio, a Igreja de São Sebastião. Permanência na vila de 4h. No retorno, parada em Vale Verde.",
    tips: "Experimente os famosos pastéis de Caraíva. Tome banho de rio e aprecie o encontro do rio com o mar. Caminhada pelas ruas de areia.",
    importantInfo:
      "Taxa de travessia (TRV) de R$20 por pessoa cobrada à parte. Percurso de 120km com 1h40 de estrada de terra. Realizado às terças, quintas e sábados.",
    duration: "Dia inteiro",
    durationMinutes: 570,
    distanceKm: 120,
    groupSize: "Até 12 pessoas",
    price: 130,
    priceMax: 140,
    priceUnit: "por pessoa",
    prices: [
      { label: "Adulto", priceMin: 130, priceMax: 140, category: "adult", notes: "+R$20 taxa de travessia (TRV)" },
      { label: "Criança 3–5 anos", ageMin: 3, ageMax: 5, priceMin: 110, priceMax: 120, category: "child", notes: "+R$20 taxa de travessia (TRV)" },
      { label: "Bebê de colo (0–2 anos)", ageMin: 0, ageMax: 2, priceMin: 0, priceMax: 0, isFree: true, category: "infant" },
    ],
    category: "aventura",
    transportType: "4x4 + Canoa",
    highlights: ["Travessia de canoa", "Vila sem carros", "Encontro do rio com o mar", "Praia deserta"],
    includes: ["Transporte 4x4 ida/volta", "Travessia de canoa", "Guia CADASTUR credenciado"],
    excludes: [...EXCLUDES_DEFAULT, "Taxa de travessia — R$20 por pessoa (cobrado no local)"],
    image: "/images/caraiva.webp",
    featured: true,
    operator: OPERATOR,
    schedule: {
      frequency: "specific_days",
      days: "Ter / Qui / Sáb",
      departureStart: "7h30",
      departureEnd: "8h30",
      returnTime: "17h",
    },
    cancellationPolicy: CANCELLATION,
  },
  {
    id: "trancoso-espelho",
    slug: "trancoso-espelho",
    destinos: ["trancoso", "praia-espelho"],
    title: "Trancoso + Praia do Espelho",
    subtitle: "Praia do Espelho + Quadrado de Trancoso",
    description:
      "Seguimos aproximadamente 80km, passando por belas paisagens. Parada de 15 minutos em Vale Verde para cachaças e doces regionais. Em seguida, a deslumbrante Praia do Espelho — 3 horas para aproveitar o mar cristalino, os espelhos d'água, piscinas naturais e falésias. Depois, o Quadrado de Trancoso por cerca de 1 hora — Igreja São João Batista, casinhas coloridas e o clima especial do centro histórico.",
    tips: "Use protetor solar. Aproveite as artes dos hippies do quadrado. Leve dinheiro trocado para Vale Verde.",
    importantInfo:
      "Combinação especial que une as duas experiências mais procuradas. Realizado segundas, quartas e sextas.",
    duration: "Dia inteiro",
    durationMinutes: 540,
    distanceKm: 80,
    groupSize: "Até 15 pessoas",
    price: 120,
    priceMax: 130,
    priceUnit: "por pessoa",
    prices: [
      { label: "Adulto", priceMin: 120, priceMax: 130, category: "adult" },
      { label: "Criança 3–5 anos", ageMin: 3, ageMax: 5, priceMin: 100, priceMax: 110, category: "child" },
      { label: "Bebê de colo (0–2 anos)", ageMin: 0, ageMax: 2, priceMin: 0, priceMax: 0, isFree: true, category: "infant" },
    ],
    category: "terrestre",
    transportType: "4x4",
    highlights: ["Praia do Espelho", "Piscinas naturais", "Quadrado de Trancoso", "Vale Verde"],
    includes: ["Transporte 4x4 ida/volta", "Guia CADASTUR credenciado"],
    excludes: EXCLUDES_DEFAULT,
    image: "/images/espelho.webp",
    operator: OPERATOR,
    schedule: {
      frequency: "specific_days",
      days: "Seg / Qua / Sex",
      departureStart: "7h40",
      departureEnd: "8h40",
      returnTime: "17h",
    },
    cancellationPolicy: CANCELLATION,
  },
  {
    id: "caraiva-espelho",
    slug: "caraiva-espelho",
    destinos: ["caraiva", "praia-espelho"],
    title: "Caraíva + Praia do Espelho",
    subtitle: "Duas experiências inesquecíveis em um dia",
    description:
      "Roteiro que une duas experiências inesquecíveis. Cerca de 120km, combinando asfalto e estrada de terra. Parada em Vale Verde. Praia do Espelho por 2 horas — mar cristalino, espelhos d'água e falésias. Depois, Caraíva — travessia de canoa até a vila, placa 'Sorria, você está em Caraíva', Igreja de São Sebastião, barra do rio. Permanência de 2h30.",
    tips: "Experimente os pastéis de Caraíva. Banho de rio. Leve dinheiro para Vale Verde.",
    importantInfo:
      "Taxa de travessia (TRV) de R$20 cobrada à parte. Percurso de 120km com trecho de terra. Realizado segundas, quartas e sextas.",
    duration: "Dia inteiro",
    durationMinutes: 540,
    distanceKm: 120,
    groupSize: "Até 12 pessoas",
    price: 140,
    priceMax: 150,
    priceUnit: "por pessoa",
    prices: [
      { label: "Adulto", priceMin: 140, priceMax: 150, category: "adult", notes: "+R$20 taxa de travessia (TRV)" },
      { label: "Criança 3–5 anos", ageMin: 3, ageMax: 5, priceMin: 120, priceMax: 130, category: "child", notes: "+R$20 taxa de travessia (TRV)" },
      { label: "Bebê de colo (0–2 anos)", ageMin: 0, ageMax: 2, priceMin: 0, priceMax: 0, isFree: true, category: "infant" },
    ],
    category: "aventura",
    transportType: "4x4 + Canoa",
    highlights: ["Praia do Espelho", "Caraíva", "Travessia de canoa", "Rio dos Frades"],
    includes: ["Transporte 4x4 ida/volta", "Travessia de canoa", "Guia CADASTUR credenciado"],
    excludes: [...EXCLUDES_DEFAULT, "Taxa de travessia — R$20 por pessoa (cobrado no local)"],
    image: "/images/caraiva.webp",
    operator: OPERATOR,
    schedule: {
      frequency: "specific_days",
      days: "Seg / Qua / Sex",
      departureStart: "7h40",
      departureEnd: "8h40",
      returnTime: "17h",
    },
    cancellationPolicy: CANCELLATION,
  },
  {
    id: "rota-da-redescoberta",
    slug: "rota-da-redescoberta",
    destinos: ["porto-seguro"],
    title: "Rota da Redescoberta",
    subtitle: "Aldeia Indígena + Praia + City Tour",
    description:
      "Visita à aldeia indígena com recepção em Patxohã pelos Pataxós — apresentação cultural, artesanatos, dança e convite para participar. 40 minutos na aldeia. Praia de Coroa Vermelha por 4h com cabana de praia. Passeio livre na passarela indígena. Finaliza com city tour pela cidade histórica de Porto Seguro.",
    tips: "Use protetor solar. Explore a passarela indígena — artesanatos incríveis com ótimos preços.",
    importantInfo: "Disponível apenas às quartas-feiras.",
    duration: "Dia inteiro",
    durationMinutes: 480,
    groupSize: "Até 20 pessoas",
    price: 90,
    priceMax: 100,
    priceUnit: "por pessoa",
    prices: [
      { label: "Adulto", priceMin: 90, priceMax: 100, category: "adult" },
      { label: "Criança 5–10 anos", ageMin: 5, ageMax: 10, priceMin: 80, priceMax: 90, category: "child" },
      { label: "Bebê de colo (0–2 anos)", ageMin: 0, ageMax: 2, priceMin: 0, priceMax: 0, isFree: true, category: "infant" },
    ],
    category: "cultural",
    transportType: "Van climatizada",
    highlights: ["Aldeia Pataxó", "Coroa Vermelha", "Passarela indígena", "City tour Porto Seguro"],
    includes: ["Transporte ida/volta", "Guia histórico CADASTUR credenciado"],
    excludes: EXCLUDES_DEFAULT,
    image: "/images/coroa.webp",
    operator: OPERATOR,
    schedule: {
      frequency: "specific_days",
      days: "Quartas-feiras",
      departureStart: "7h40",
      departureEnd: "8h40",
      returnTime: "16h",
    },
    cancellationPolicy: CANCELLATION,
  },
  {
    id: "by-night-arraial",
    slug: "by-night-arraial",
    destinos: ["arraial"],
    title: "By Night Arraial",
    subtitle: "Vilarejo + Rua Mucugê",
    description:
      "Travessia de balsa pelo Rio Buranhém (12 minutos). Seguimos para a famosa Rua Mucugê, repleta de restaurantes, lojas, bares e praças de alimentação com muita arte e música ao vivo. Caminhe pela rua Bróduei e conheça a praça da igreja iluminada à noite.",
    tips: "Caminhe por toda a Rua Mucugê antes de escolher um lugar. Aprecie os artesanatos dos hippies na praça principal.",
    importantInfo:
      "Passeio noturno. Realizado quintas, sextas e sábados. Retorno entre 00h e 01h.",
    duration: "Noturno (~5h)",
    durationMinutes: 360,
    groupSize: "Até 20 pessoas",
    price: 100,
    priceMax: 110,
    priceUnit: "por pessoa",
    prices: [
      { label: "Adulto", priceMin: 100, priceMax: 110, category: "adult" },
      { label: "Criança 4–8 anos", ageMin: 4, ageMax: 8, priceMin: 90, priceMax: 100, category: "child" },
      { label: "Bebê de colo (0–2 anos)", ageMin: 0, ageMax: 2, priceMin: 0, priceMax: 0, isFree: true, category: "infant" },
    ],
    category: "noturno",
    transportType: "Van climatizada + balsa",
    highlights: ["Rua Mucugê", "Música ao vivo", "Praça histórica iluminada", "Gastronomia local"],
    includes: ["Transporte ida/volta", "Travessia de balsa", "Guia CADASTUR credenciado"],
    excludes: EXCLUDES_DEFAULT,
    image: "/images/arraial.webp",
    operator: OPERATOR,
    schedule: {
      frequency: "specific_days",
      days: "Qui / Sex / Sáb",
      departureStart: "19h",
      departureEnd: "19h20",
      returnTime: "00h–01h",
    },
    cancellationPolicy: CANCELLATION,
  },
  {
    id: "fluvial-coroa-alta",
    slug: "fluvial-coroa-alta",
    destinos: ["porto-seguro"],
    title: "Fluvial Coroa Alta",
    subtitle: "Passeio de Escuna",
    description:
      "Seguimos até Santa Cruz Cabrália, embarque na escuna até Coroa Alta — banco de fragmentos de corais e areia com piscina natural. Permanência de 1h. Seguimos pelo rio até o Restaurante Berimbal para almoço (à parte). Depois, escuna até a Ilha do Sol — doces, cachaças, licores e banho de lama no manguezal.",
    tips: "Use protetor solar. Leve óculos e capinha do celular. Deguste os doces e licores da Ilha do Sol. Banho de lama no manguezal custa R$10.",
    importantInfo:
      "Horário varia conforme tábua de marés. Realizado de segunda a sábado. Almoço não incluso.",
    duration: "~4 horas",
    durationMinutes: 240,
    groupSize: "Até 30 pessoas",
    price: 110,
    priceMax: 120,
    priceUnit: "por pessoa",
    prices: [
      { label: "Adulto", priceMin: 110, priceMax: 120, category: "adult" },
      { label: "Criança 8–10 anos", ageMin: 8, ageMax: 10, priceMin: 80, priceMax: 90, category: "child" },
      { label: "Bebê de colo (0–2 anos)", ageMin: 0, ageMax: 2, priceMin: 0, priceMax: 0, isFree: true, category: "infant" },
    ],
    category: "nautico",
    transportType: "Escuna",
    highlights: ["Coroa Alta — piscina natural", "Rio Santa Cruz Cabrália", "Ilha do Sol", "Banho de lama no manguezal"],
    includes: ["Escuna", "Guia CADASTUR credenciado"],
    excludes: [...EXCLUDES_DEFAULT, "Almoço no Restaurante Berimbal (à parte)", "Banho de lama — R$10"],
    image: "/images/recife.webp",
    operator: OPERATOR,
    schedule: {
      frequency: "tide_based",
      days: "Seg a Sáb",
      notes: "Horário conforme tábua de marés",
    },
    cancellationPolicy: CANCELLATION,
  },
  {
    id: "recife-de-fora",
    slug: "recife-de-fora",
    destinos: ["porto-seguro"],
    title: "Recife de Fora",
    subtitle: "Escuna + Piscinas Naturais",
    description:
      "Parque Marinho Recife de Fora — ecossistema recifal de 19,68km², maior da Costa do Descobrimento e 3º maior do Brasil. Navegação de 50 minutos, 4 horas de duração total, 2 horas nas piscinas naturais. Snorkel incluso. Breve apresentação do parque e aula sobre vida marinha antes da entrada na água.",
    tips: "Use protetor solar (debaixo d'água o sol queima também!). Leve dinheiro trocado para consumos na embarcação.",
    importantInfo:
      "Horário varia conforme tábua de marés. Saída de Porto Seguro. Equipamento de snorkel incluso.",
    duration: "~4 horas",
    durationMinutes: 240,
    groupSize: "Até 20 pessoas",
    price: 155,
    priceMax: 175,
    priceUnit: "por pessoa",
    prices: [
      { label: "Adulto (sem transfer)", priceMin: 155, priceMax: 175, category: "adult" },
      { label: "Criança 5–8 anos (sem transfer)", ageMin: 5, ageMax: 8, priceMin: 100, priceMax: 120, category: "child" },
      { label: "Bebê de colo (0–2 anos)", ageMin: 0, ageMax: 2, priceMin: 0, priceMax: 0, isFree: true, category: "infant" },
    ],
    category: "nautico",
    transportType: "Escuna",
    highlights: ["Parque Marinho Nacional", "Piscinas naturais", "Snorkeling guiado", "3º maior recife do Brasil"],
    includes: ["Escuna", "Equipamento de snorkel", "Colete salva-vidas", "Guia CADASTUR credenciado"],
    excludes: EXCLUDES_DEFAULT,
    image: "/images/recife.webp",
    featured: true,
    badge: "Imperdível",
    operator: OPERATOR,
    schedule: {
      frequency: "tide_based",
      notes: "Horário conforme tábua de marés",
    },
    cancellationPolicy: CANCELLATION,
  },
  {
    id: "recife-de-fora-com-transfer",
    slug: "recife-de-fora-com-transfer",
    destinos: ["porto-seguro"],
    title: "Recife de Fora + Transfer",
    subtitle: "Escuna + Piscinas Naturais com transfer incluso",
    description:
      "Parque Marinho Recife de Fora — ecossistema recifal de 19,68km², maior da Costa do Descobrimento e 3º maior do Brasil. Inclui transfer de ida e volta do seu hotel até o ponto de embarque. Navegação de 50 minutos, 4 horas de duração total, 2 horas nas piscinas naturais. Snorkel incluso.",
    tips: "Use protetor solar. Leve dinheiro trocado para consumos na embarcação.",
    importantInfo:
      "Inclui transfer do hotel até o pier. Horário varia conforme tábua de marés. Informe seu hotel no momento da reserva.",
    duration: "~4 horas",
    durationMinutes: 240,
    groupSize: "Até 20 pessoas",
    price: 185,
    priceMax: 205,
    priceUnit: "por pessoa",
    prices: [
      { label: "Adulto (com transfer)", priceMin: 185, priceMax: 205, category: "adult" },
      { label: "Criança 5–8 anos (com transfer)", ageMin: 5, ageMax: 8, priceMin: 130, priceMax: 150, category: "child" },
      { label: "Bebê de colo (0–2 anos)", ageMin: 0, ageMax: 2, priceMin: 0, priceMax: 0, isFree: true, category: "infant" },
    ],
    category: "nautico",
    transportType: "Van + Escuna",
    highlights: ["Transfer incluso", "Parque Marinho Nacional", "Piscinas naturais", "Snorkeling guiado"],
    includes: ["Transfer hotel–pier–hotel", "Escuna", "Equipamento de snorkel", "Colete salva-vidas", "Guia CADASTUR credenciado"],
    excludes: EXCLUDES_DEFAULT,
    image: "/images/recife.webp",
    hasTransfer: true,
    trackable: true,
    operator: OPERATOR,
    schedule: {
      frequency: "tide_based",
      notes: "Horário conforme tábua de marés",
    },
    cancellationPolicy: CANCELLATION,
  },
  {
    id: "mergulho",
    slug: "mergulho",
    destinos: ["porto-seguro"],
    title: "Mergulho",
    subtitle: "Mergulho guiado com instructor",
    description:
      "Embarcação sai do pier da balsa, navegação de 50 minutos. Instrutores passam instruções completas sobre segurança e técnica. Roupas de Neoprene e equipamentos inclusos. Caídas na água em dupla, um instrutor por dupla. Fotos submersas disponíveis para aquisição.",
    tips: "Use protetor solar. Evite café da manhã com muito líquido. Leve óculos escuros para o trajeto.",
    importantInfo:
      "Crianças a partir de 7 anos podem participar. Gestantes não podem mergulhar. Pessoas com problemas cardíacos devem consultar médico antes.",
    duration: "~6 horas",
    durationMinutes: 360,
    groupSize: "Até 10 pessoas",
    price: 250,
    priceMax: 300,
    priceUnit: "por pessoa",
    prices: [
      { label: "Adulto", priceMin: 250, priceMax: 300, category: "adult" },
      { label: "Acompanhante (não mergulha)", priceMin: 175, priceMax: 195, category: "companion" },
    ],
    category: "nautico",
    transportType: "Embarcação",
    highlights: ["Instructor por dupla", "Equipamento completo", "Fotos submersas disponíveis", "Visibilidade de até 30m"],
    includes: ["Embarcação", "Roupa de Neoprene", "Equipamento de mergulho completo", "Instrutor CADASTUR credenciado"],
    excludes: [...EXCLUDES_DEFAULT, "Fotos submersas (vendidas à parte)"],
    image: "/images/recife.webp",
    operator: OPERATOR,
    schedule: {
      frequency: "daily",
      departureStart: "8h",
      returnTime: "14h",
    },
    cancellationPolicy: CANCELLATION,
  },
  {
    id: "quadriciclo-acai",
    slug: "quadriciclo-acai",
    destinos: ["porto-seguro"],
    title: "Quadriciclo Rota do Açaí",
    subtitle: "Trilha + Cascata + Degustação",
    description:
      "Base na Fazenda Bom Sossego — plantações de açaí, cupuaçu e coco. Trilhas em trechos da Mata Atlântica. Parada para degustação de cupuaçu 100% natural. Parada para banho em cascata com deck para fotos e mirante. No retorno, degustação de creme de cupuaçu e açaí. Percurso de 15km, duração 2h a 2h15.",
    tips: "Use protetor solar. Leve óculos escuros. Aproveite o ventinho no rosto em meio à natureza.",
    importantInfo:
      "Sapato fechado obrigatório (taxa R$10 para aluguel se não tiver). Gestantes não podem participar. Menores de 16 anos não pilotam. De 16 a 18 anos, necessária autorização dos pais. Crianças a partir de 2 anos podem ir como garupa entre os pais até 1,30m de altura. Garupa permitido até 15 anos.",
    duration: "~2h15",
    durationMinutes: 135,
    groupSize: "Até 20 pessoas",
    price: 280,
    priceMax: 300,
    priceUnit: "por pessoa",
    prices: [
      { label: "Adulto (piloto)", priceMin: 280, priceMax: 300, category: "adult" },
      { label: "Garupa (até 15 anos)", ageMin: 2, ageMax: 15, priceMin: 170, priceMax: 200, category: "companion", notes: "Até 1,30m vai entre os pais sem custo adicional" },
    ],
    category: "aventura",
    transportType: "Quadriciclo",
    highlights: ["Fazenda Bom Sossego", "Mata Atlântica", "Cascata com deck", "Degustação de açaí e cupuaçu"],
    includes: ["Quadriciclo", "Capacete", "Guia CADASTUR credenciado", "Degustação de açaí e cupuaçu"],
    excludes: [...EXCLUDES_DEFAULT, "Sapato fechado (R$10 de taxa se não tiver)"],
    image: "/images/caraiva.webp",
    trackable: true,
    operator: OPERATOR,
    schedule: {
      frequency: "specific_days",
      days: "Seg a Sáb",
      notes: "Sessões manhã e tarde",
    },
    cancellationPolicy: CANCELLATION,
  },
  {
    id: "quadriciclo-aldeia",
    slug: "quadriciclo-aldeia",
    destinos: ["porto-seguro"],
    title: "Quadriciclo Rota da Aldeia",
    subtitle: "Trilha por aldeia indígena",
    description:
      "Aventura de quadriciclo com roteiro que passa por trilhas na Mata Atlântica e inclui visita a uma aldeia indígena Pataxó. Percurso de 15km em meio à natureza exuberante da Costa do Descobrimento. Experiência única que combina aventura e cultura.",
    tips: "Use protetor solar. Leve óculos escuros. Experimente conversar com os moradores da aldeia.",
    importantInfo:
      "Sapato fechado obrigatório (taxa R$10 para aluguel se não tiver). Gestantes não podem participar. Menores de 16 anos não pilotam. De 16 a 18 anos, necessária autorização dos pais. Crianças a partir de 2 anos podem ir como garupa entre os pais até 1,30m de altura. Garupa permitido até 15 anos.",
    duration: "~2h15",
    durationMinutes: 135,
    groupSize: "Até 20 pessoas",
    price: 280,
    priceMax: 300,
    priceUnit: "por pessoa",
    prices: [
      { label: "Adulto (piloto)", priceMin: 280, priceMax: 300, category: "adult" },
      { label: "Garupa (até 15 anos)", ageMin: 2, ageMax: 15, priceMin: 170, priceMax: 200, category: "companion", notes: "Até 1,30m vai entre os pais sem custo adicional" },
    ],
    category: "aventura",
    transportType: "Quadriciclo",
    highlights: ["Trilha na Mata Atlântica", "Aldeia indígena Pataxó", "Paisagens da Costa do Descobrimento", "Percurso de 15km"],
    includes: ["Quadriciclo", "Capacete", "Guia CADASTUR credenciado"],
    excludes: [...EXCLUDES_DEFAULT, "Sapato fechado (R$10 de taxa se não tiver)"],
    image: "/images/coroa.webp",
    trackable: true,
    operator: OPERATOR,
    schedule: {
      frequency: "specific_days",
      days: "Seg a Sáb",
      notes: "Sessões manhã e tarde",
    },
    cancellationPolicy: CANCELLATION,
  },
];

export const categoryLabel: Record<string, string> = {
  nautico: "Náutico",
  terrestre: "Terrestre",
  aventura: "Aventura",
  cultural: "Cultural",
  noturno: "Noturno",
};

export const categoryColor: Record<string, string> = {
  nautico: "#0891b2",
  terrestre: "#2d7d46",
  aventura: "#e8602c",
  cultural: "#7c3aed",
  noturno: "#1e293b",
};
