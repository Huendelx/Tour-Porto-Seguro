@AGENTS.md

# Passeador — Conceito & Modelo de Negócio

## O que é

Marketplace de turismo local. A plataforma que centraliza todos os passeios, experiências, restaurantes e serviços turísticos de um destino em um só lugar.

O turista entra, escolhe o destino, busca, compara, reserva e paga online.
Os operadores locais se cadastram de graça e só pagam quando vendem.

**Modelo de referência:** iFood (restaurantes), Clickbus (passagens), GetYourGuide (experiências).

**Posicionamento:** Passeios e experiências com quem conhece de verdade.

---

## Como ganhamos dinheiro

### Receita principal

Taxa de serviço de 15–20% sobre cada reserva realizada na plataforma.

Exemplo: passeio de R$120 → operador recebe R$96–102, plataforma fica com R$18–24.

### Receitas secundárias (fase 2+)

- **Destaque pago** — operador paga pra aparecer no topo dos resultados (R$200–500/mês)
- **Publicidade** — restaurantes e hotéis compram espaço na plataforma (R$300–1.000/mês)
- **Ingressos e eventos** — taxa de 10–15% sobre venda de tickets (festas, luaus, shows)
- **Transfers e serviços** — comissão sobre aluguel de buggy, transfer, fotógrafo, guia

---

## Projeção de receita

Baseado em Porto Seguro como primeira praça (~2 milhões de turistas/ano, ticket médio R$120).

| Fase | Reservas/mês | Receita comissão/mês |
|---|---|---|
| Meses 1–3 (validação) | 50 | ~R$1.000 |
| Meses 4–6 (tração) | 200 | ~R$4.200 |
| Meses 7–12 (crescimento) | 500 | ~R$11.000 |
| Ano 2 (consolidado) | 1.500 | ~R$36.000 |
| Ano 2 alta temporada | 3.000 | ~R$78.000 |

Com receitas secundárias no Ano 2 (publicidade + destaques): +R$5.500/mês.

**Meta Ano 2 consolidado: ~R$42.000/mês**

### Pré-requisitos

- 15–30 operadores parceiros cadastrados
- Tráfego pago gerando 5.000–10.000 visitantes/mês
- Taxa de conversão de 3–5%
- Sistema de avaliações rodando

---

## Como escala

Porto Seguro é a primeira praça — o piloto. Validou o modelo, replica pra outros destinos com o mesmo sistema. Cada novo destino tem um parceiro operacional local que faz onboarding de operadores e toca o atendimento.

Destinos potenciais: Chapada Diamantina, Jericoacoara, Morro de São Paulo, Lençóis Maranhenses, Fernando de Noronha, Bonito, Arraial do Cabo, Paraty.

Modelo de franquia leve: a plataforma e estratégia ficam centralizadas, a operação local é descentralizada.

---

## Divisão de responsabilidades

### Sócio 1 — Huendel (MAXED)

- Marca, design, identidade visual
- Desenvolvimento da plataforma
- Estratégia digital (SEO, tráfego pago, growth)
- Infraestrutura técnica e manutenção
- Produto e roadmap

### Sócio 2

- Produção de conteúdo (vídeo, foto, redes sociais)
- Relacionamento comercial com operadores e parceiros locais
- Onboarding de novos parceiros
- Atendimento e suporte ao cliente
- Operação local em Porto Seguro

### Divisão: 50/50

- Primeiros 6–12 meses: receita reinvestida, sem pró-labore
- Pró-labore a partir de receita líquida consistente acima de R$10.000/mês
- Lucro distribuído 50/50 após custos e pró-labores

---

## Stack técnica

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Estilo:** Tailwind CSS v4, CSS Modules
- **Ícones:** Phosphor Icons
- **Deploy:** Coolify (auto-deploy a cada git push na main)
- **Repo:** github.com/Huendelx/Tour-Porto-Seguro

## Estrutura do projeto

```
src/
  app/          — layout, page, globals.css
  components/   — Header, Hero, TourSearchBar, TrustBar, ToursSection, WhyUs, ContactSection, Footer, MobileMenu
  data/         — tours.ts
public/         — hero-bg.webp, logo-passeador.svg, logo-pts.svg
```

---

*MAXED® | Brand & Product Development*
*passeador.com.br*
