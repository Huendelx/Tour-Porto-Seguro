<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Passeador — Product Spec & Contexto do Projeto

## O que é

Marketplace curado de turismo local. O lugar onde o turista brasileiro compra passeio — catálogo real, preço transparente, pagamento seguro, confirmação na hora, acompanhamento do serviço.

Hoje não existe um lugar assim. É WhatsApp, quiosque, agência de rua, site feio de operador. O dinheiro já rola — estimados R$550M/ano só em Porto Seguro. Rola mal. O Passeador é a camada boa em cima de um mercado que já transaciona muito por canais ruins.

**Posicionamento:** Passeios e experiências com quem conhece de verdade.

## Pra quem

**Turista:** quer achar, comparar, pagar com segurança e saber que vai acontecer. Hoje paga um desconhecido e fica rezando pra aparecer.

**Operador:** quer vender direto, sem perder 30–50% pra agência, sem depender de WhatsApp. Com o Passeador recebe +70% por reserva comparado com a agência de rua.

## Marketplace curado, não aberto

Operador se cadastra, passa por verificação, e só então vai pro ar. "Todos os operadores são verificados" é argumento de venda pros dois lados. A confiança é o produto — se qualquer um entrar sem verificação, morre o diferencial.

Sem APIs de integração por enquanto. Operador brasileiro pequeno/médio não tem sistema de reserva. A "integração" é o painel: tela, botão, notificação.

---

## As 3 camadas de valor

### 1. Centraliza e vende (o core)
Catálogo de operadores verificados. Página do passeio com fotos, descrição, preço, o que inclui. Checkout seguro em reais. Confirmação instantânea por e-mail. É o básico que não existe hoje — e já é o suficiente pra justificar a plataforma.

### 2. Transfer como add-on
Na compra do passeio, o turista pode adicionar busca no hotel. "Adicionar transfer — +R$25." Resolve o problema do turista (não sabe como chegar), gera receita adicional pro operador e pro Passeador, e é a porta de entrada natural pro tracking — porque transfer é deslocamento, e deslocamento é onde o GPS brilha.

### 3. Acompanhamento (o diferencial)
Dois modos, mesma tela, mesmo objetivo — o turista saber que vai acontecer:

| Modo | Quando | O que o turista vê | O que o operador faz |
|---|---|---|---|
| **GPS em tempo real** | Serviço com deslocamento até o turista (transfer, buggy, lancha, quadriciclo) | Pin se movendo no mapa + ETA | Liga a localização |
| **Status ao vivo** | Serviço sem deslocamento até o turista (barco no pier, trilha, aula, city tour) | Status atualizado ("confirmado" → "aguardando no local" → "embarque aberto" → "iniciando") | Aperta um botão |

Se tem GPS, mostra o mapa com o pin + os status. Se não tem, mostra só os status. O turista não precisa saber qual modo é.

---

## Fluxo do turista

```
Busca destino ("Porto Seguro")
    ↓
Catálogo de passeios (filtro por categoria, preço, tipo)
    ↓
Página do passeio (fotos, descrição, preço, o que inclui)
    ↓
Reserva (data, participantes, dados do turista — sem cadastro)
    ↓
[Opcional] Adicionar transfer do hotel (+R$)
    ↓
Pagamento (Mercado Pago Checkout Pro — Pix ou cartão)
    ↓
Confirmação instantânea (e-mail + tela)
    ↓
Dia do passeio → Acompanhamento
    Se tem transfer/deslocamento: GPS no mapa ("sua van chega em 8 min")
    Se não tem: status do operador ("guia confirmado, aguardando no pier 3")
```

## Fluxo do operador

```
Cadastra empresa no painel (CNPJ, fotos, contato)
    ↓
Cadastra passeios (fotos, preço, horários, o que inclui)
    ↓
Verificação do Passeador → aprovado → vai pro ar
    ↓
Recebe reserva (notificação)
    ↓
Confirma ou recusa
    ↓
Dia do passeio:
    Se transfer/deslocamento: liga localização → turista vê no mapa
    Se ponto fixo: atualiza status ("aguardando" → "embarque" → "iniciando")
    ↓
Serviço realizado → recebe o dinheiro (repasse)
```

---

## O que NÃO é

- **Não é um app de tracking.** O tracking serve ao core, não é o core.
- **Não é Airbnb Experiences.** Airbnb vende experiência premium pra gringo. Passeador vende passeio local pra brasileiro, em reais, com operador da região.
- **Não é agregador de link.** A transação inteira acontece dentro da plataforma.
- **Não é plataforma aberta.** Operadores são verificados.

---

## Modelo de receita

- **15% de comissão** por transação (número travado — usar 15% em todo lugar).
- **Transfer como add-on** gera comissão adicional na mesma reserva.
- **Destaque pago** (posicionamento no catálogo) como receita secundária.
- 17,5% é meta de praça madura, citado apenas como upside. Nunca usar 17,5% ou 20% como base.

### Unit economics
- Ticket médio: **R$110**
- Comissão bruta (15%): R$16,50
- Gateway (~4%): -R$4,40
- **Receita líquida por reserva: R$12,10**
- CAC alvo: R$8–15
- Payback: 1–2 reservas

---

## Hierarquia de construção

### Fase atual — Validação (Porto Seguro)
Camada 1: catálogo real + checkout Mercado Pago Checkout Pro (redireciona, dinheiro cai na conta do Passeador) + confirmação por e-mail via Resend + tela admin de reservas. UI do tracking mockada com "em breve". Transfer como conceito no design, sem implementar ainda. Sem cadastro/auth de turista. Sem painel CRUD do operador. Dados do piloto cadastrados na mão. Repasse pro operador manual (sem split automático).

**Supabase mínimo — só 2 tabelas:** `tours` (catálogo real) e `bookings` (reservas).

### Fase 2 — Com validação positiva
Camada 2: transfer add-on funcional. Camada 3 modo status. Painel do operador com cadastro self-service + verificação. Checkout transparente.

### Fase 3 — Com tração
Camada 3 modo GPS (precisa de operador real testando em campo). Split de pagamento automático. Multi-praça. Reviews. Destaque pago.

---

## Dados da praça piloto — Porto Seguro

- Catálogo real: Porto Brasil Turismo (15 passeios documentados)
- Representante comercial local (5% equity, NÃO é co-founder — é operação de campo, remuneração por performance)
- 2,5M turistas/ano, 760 hospedagens, 70 mil leitos, +13% crescimento 2024, +68% turismo internacional
- Maiores operadores: 500–600k seguidores no Instagram, 0 plataformas de reserva, 100% WhatsApp

---

## Estrutura societária

- **80%** Huendel Goelzer (Founder & CEO / MAXED®) — marca, produto, código, estratégia, growth
- **5%** Operador Porto Seguro — representante comercial local
- **15%** Pool reservado (investidores, time futuro)
- Pós-investimento seed (10%): 72% / 4,5% / 10% investidor / 13,5% pool

---

## Stack técnica

- **Framework:** Next.js (App Router), React, TypeScript
- **Estilo:** Tailwind CSS v4
- **Banco:** Supabase (PostgreSQL)
- **Pagamento:** Mercado Pago Checkout Pro
- **E-mail:** Resend
- **Deploy:** Coolify (auto-deploy a cada git push na main)
- **Repo:** github.com/Huendelx/Tour-Porto-Seguro

---

## Estrutura do projeto

```
src/
  app/          — layout, page, globals.css, /passeios/[slug], /reserva, /api
  components/   — Header, Hero, TourSearchBar, TrustBar, ToursSection, WhyUs, ContactSection, Footer, MobileMenu
  data/         — tours.ts (migrar pra Supabase)
  lib/          — supabase client, mercadopago
public/         — hero-bg.webp, logo-passeador.svg, logo-pts.svg
```

---

*MAXED® | Brand & Product Development*
*passeador.com.br*
