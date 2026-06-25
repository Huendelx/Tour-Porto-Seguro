const reviews = [
  {
    name: "Mariana S.", from: "São Paulo, SP", rating: 5,
    passeio: "Recife de Fora",
    text: "Reservei o passeio pro Recife de Fora pelo Passeador e foi tudo perfeito. O guia conhecia cada canto, a água era cristalina. Melhor experiência da viagem.",
  },
  {
    name: "James W.", from: "London, UK", rating: 5,
    passeio: "Caraíva",
    text: "Found this platform while researching Porto Seguro. Booked two tours, both were incredible. The local guides make all the difference — they know hidden spots no tourist usually sees.",
  },
  {
    name: "Rafael M.", from: "Belo Horizonte, MG", rating: 5,
    passeio: "Arraial d'Ajuda e Trancoso",
    text: "A praticidade de reservar online e saber que tá tudo confirmado faz muita diferença. Sem surpresa, sem perrengue. Recomendo demais.",
  },
  {
    name: "Ana L.", from: "Rio de Janeiro, RJ", rating: 5,
    passeio: "Trancoso",
    text: "Trancoso é mágico, mas o que fez a diferença foi o guia local que conhecia cada viela do Quadrado. Nenhum roteiro de agência convencional chega perto disso.",
  },
  {
    name: "Sophie T.", from: "Paris, France", rating: 5,
    passeio: "Praia do Espelho",
    text: "We came to Bahia with no idea where to go. The Passeador platform made everything so easy — we ended up at Praia do Espelho and it was absolutely breathtaking.",
  },
  {
    name: "Pedro C.", from: "Curitiba, PR", rating: 5,
    passeio: "Passeio de Barco",
    text: "Fiz o passeio de barco com minha família e as crianças adoraram o snorkeling. O operador foi super atencioso e a estrutura impecável. Voltaremos com certeza.",
  },
  {
    name: "Thiago F.", from: "Brasília, DF", rating: 5,
    passeio: "Caraíva",
    text: "Caraíva sem carro parecia assustador, mas o Passeador me conectou com um guia experiente que tornou tudo fluido. Uma das viagens mais marcantes da minha vida.",
  },
];

function ReviewCard({ r }: { r: typeof reviews[0] }) {
  return (
    <div style={{
      background: "#fafafa", borderRadius: 16, padding: "28px 24px",
      border: "1px solid #f0f0f0", width: 340, flexShrink: 0,
      display: "flex", flexDirection: "column", justifyContent: "space-between",
    }}>
      <div>
        <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
          {[...Array(r.rating)].map((_, j) => (
            <span key={j} style={{ fontSize: 13, color: "#111" }}>★</span>
          ))}
        </div>
        <p style={{ fontSize: 14, color: "#333", lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>
          &ldquo;{r.text}&rdquo;
        </p>
      </div>
      <div style={{ borderTop: "1px solid #eee", paddingTop: 16, marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%", background: "#e5e5e5",
            flexShrink: 0, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 14, fontWeight: 600, color: "#999",
          }}>
            {r.name.charAt(0)}
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#111", margin: 0 }}>{r.name}</p>
            <p style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{r.from}</p>
          </div>
        </div>
        <span style={{ fontSize: 11, color: "#999", background: "#f0f0f0", padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>
          {r.passeio}
        </span>
      </div>
    </div>
  );
}

export default function ProvaSocial() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6 mb-12">
        <h2 className="text-[32px] font-bold text-[#111] leading-tight">O que dizem os viajantes</h2>
        <p className="text-base text-[#666] mt-3 leading-relaxed">
          Mais de 500 experiências realizadas com avaliação acima de 4.8.
        </p>
      </div>

      {/* Desktop — carousel autoplay */}
      <div className="reviews-carousel-wrap">
        <div className="reviews-track">
          {[...reviews, ...reviews].map((r, i) => (
            <ReviewCard key={i} r={r} />
          ))}
        </div>
      </div>

      {/* Mobile — 3 cards estáticos */}
      <div className="reviews-mobile max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col gap-4">
          {reviews.slice(0, 3).map((r, i) => (
            <ReviewCard key={i} r={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
