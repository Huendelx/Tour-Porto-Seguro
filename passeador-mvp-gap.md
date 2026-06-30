# Passeador — MVP Gap Analysis (atualizado)

> Atualizado em 2026-06-28. Alinhado com o Product Spec e o escopo de validação.
> Auditoria do repo realizada em 2026-06-28 pelo Claude Code.
> Documento original gerado em 2026-06-26.

---

## Contexto

O objetivo atual NÃO é construir a plataforma inteira. É construir o **mínimo que permite uma reserva real acontecer de ponta a ponta** — pra validar, com tráfego pago (R$3–4k, 30 dias), se o turista compra pela plataforma em vez do WhatsApp.

Tudo que não serve a esse objetivo fica congelado. O schema completo (11 tabelas), o painel do operador, o tracking real, o split de pagamento, a auth de turista — tudo isso foi documentado e está pronto pra construir **depois** que a validação der sinal positivo.

---

## Resumo da auditoria (2026-06-28)

| Item | Status |
|---|---|
| `/passeios/[slug]` | ✅ Existe (trocar botão WhatsApp pelo fluxo de reserva) |
| `/buscar` + filtros | ✅ Existe |
| `TourSearchBar` → `/buscar` | ✅ Já conecta |
| `tours.ts` — 15 passeios reais | ✅ Completo (migrar pra Supabase) |
| WhatsApp real do operador | ✅ Correto (5573991579960) |
| `sitemap.ts` + `robots.ts` | ✅ Existem |
| Supabase | ❌ Nenhuma tabela, nenhum client, nenhum `.env` |
| Fluxo de reserva | ❌ Não existe |
| Mercado Pago | ❌ Nenhuma API route, nenhum SDK |
| Página de confirmação | ❌ Não existe |
| Resend (e-mail) | ❌ Nenhuma integração |
| UI tracking mockada | ❌ Não existe |
| Tela admin reservas | ❌ Não existe |
| Analytics | ❌ Nenhum |

**Delta real:** a vitrine (páginas de passeio + busca + catálogo) já tá pronta. O trabalho é o miolo transacional: Supabase → reserva → pagamento → confirmação → tracking mockado → admin → analytics.

---

## 1. O que já existe

### Páginas
| Rota | Arquivo | Status |
|---|---|---|
| `/` | `src/app/page.tsx` | ✅ Completa — 8 seções renderizadas |
| `/passeios/[slug]` | `src/app/passeios/[slug]/page.tsx` | ✅ Existe — galeria, preços, highlights, relacionados. Botão ainda aponta pro WhatsApp (trocar pro fluxo de reserva) |
| `/buscar` | `src/app/buscar/page.tsx` | ✅ Existe — filtros por categoria, preço, ordenação |
| Demais rotas | — | ❌ Não existem (reserva, confirmação, admin) |

### Componentes (`src/components/`)
| Componente | Função | Status |
|---|---|---|
| `Header.tsx` | Nav sticky, mega-menu Passeios, seletor de idioma, menu hamburger | ✅ |
| `Hero.tsx` | Hero fullscreen com imagens mobile/desktop | ✅ |
| `TourSearchBar.tsx` | Barra de busca desktop + modal mobile (Onde/Quando/Quem) | ✅ Conecta ao `/buscar` via router.push |
| `TrustBar.tsx` | Marquee com selos de confiança | ✅ |
| `DestinosSection.tsx` | Grid de 5 destinos com imagens | ✅ |
| `ExperienciasSection.tsx` | 4 cards de experiências em destaque | ✅ |
| `ComoFunciona.tsx` | 3 passos (escolha → reserve → viva) | ✅ |
| `CategoriasSection.tsx` | 6 categorias de passeio | ✅ |
| `ProvaSocial.tsx` | 7 reviews — carousel desktop + 3 cards mobile | ✅ Hardcoded (fica assim por enquanto) |
| `CtaOperadores.tsx` | Seção de recrutamento de operadores | ✅ |
| `ToursSection.tsx` | Grid filtrado por categoria (usa `TourCard`) | ✅ |
| `TourCard.tsx` | Card de passeio com link pra `/passeios/[slug]` | ✅ Botão "Reservar" na página de detalhe ainda aponta pro WhatsApp — trocar pro fluxo de reserva |
| `WhyUs.tsx` | 4 diferenciais | ✅ |
| `ContactSection.tsx` | CTA final com WhatsApp + Instagram | ✅ |
| `Footer.tsx` | Footer com 5 colunas | ✅ |
| `MobileMenu.tsx` | Drawer mobile via portal | ✅ |

### Dados (`src/data/`)
| Arquivo | Conteúdo | Status |
|---|---|---|
| `tours.ts` | 15 passeios reais do catálogo Porto Brasil Turismo, WhatsApp correto (5573991579960) | ✅ Completo — migrar pra Supabase |

### Backend / Infraestrutura
| Item | Status |
|---|---|
| API Routes | ❌ Nenhuma |
| Banco de dados | ❌ Nenhum |
| Pagamento | ❌ Apenas link WhatsApp |
| Analytics | ❌ Nenhum |
| `.env` / variáveis de ambiente | ❌ Nenhum |
| Deploy (Coolify) | ✅ Pronto |
| SEO (sitemap.ts, robots.ts) | ✅ Já existem |

---

## 2. O que a validação precisa — e só isso

### A. Supabase mínimo (2 tabelas)

**`tours`** — catálogo real. Campos: slug, título, subtítulo, descrição, categoria, tipo de transporte, duração, o que inclui (array), o que não inclui (array), preço adulto, preço criança, ponto de encontro, horário/frequência (texto simplificado), imagens, badge, is_active.

**`bookings`** — onde a reserva cai. Campos: id, tour_id, nome do turista, e-mail, telefone, hotel (opcional, pensando no transfer futuro), data do passeio, qtd adultos, qtd crianças, valor total, status do pagamento (pending/paid/cancelled), id do Mercado Pago, created_at.

Sem auth. Sem RLS complexa (service role ou policies abertas pro piloto). Sem tabelas de operador, cidade, preço separado, schedule, availability, tracking, reviews.

### B. Páginas do turista

| Página | O que faz | Status |
|---|---|---|
| `/passeios/[slug]` | Página de detalhe do passeio — a vitrine que vende. | ✅ **Existe.** Trocar botão WhatsApp pelo fluxo de reserva. Migrar de `tours.ts` pra Supabase. |
| `/buscar` | Listagem filtrada por categoria, preço, ordenação. | ✅ **Existe.** Migrar de `tours.ts` pra Supabase. |
| Fluxo de reserva | Seletor de data + participantes + formulário (nome, e-mail, telefone) + resumo + "Ir para pagamento". Sem cadastro. | ❌ **Não existe.** |
| `/reserva/[id]/confirmacao` | Confirmação pós-pagamento. Detalhes da reserva + UI do tracking mockada. | ❌ **Não existe.** |
| `TourSearchBar` → `/buscar` | Conectar barra de busca ao `/buscar`. | ✅ **Já conecta.** |

**NÃO entra agora:**
- `/minha-conta` (sem auth de turista)
- `/destinos/[slug]` (Fase 2)

### C. Pagamento — Mercado Pago Checkout Pro

- **Checkout Pro** (redireciona pro ambiente do MP). NÃO transparente.
- API route cria preferência de pagamento com o valor da reserva.
- Antes de redirecionar, salva booking no Supabase com status `pending`.
- `back_urls` configuradas pra voltar à página de confirmação.
- Webhook `/api/webhooks/mercadopago` recebe notificação e atualiza status pra `paid`.
- Dinheiro cai na conta única do Passeador. **Sem split automático.** Repasse pro operador é manual (Pix na mão).

### D. E-mail de confirmação

- Integração com Resend.
- API route `/api/email/send`.
- Dispara quando pagamento confirma (status vira `paid`).
- Conteúdo: confirmação da reserva, dados do passeio, data, contato do operador.

**NÃO entra agora:** lembrete véspera, e-mail de cancelamento, WhatsApp notification.

### E. UI do tracking — MOCKADA

Na página de confirmação, mostrar a interface de acompanhamento como preview. **NÃO conectar a GPS real.**

Opção 1: mapa estático com pin do ponto de encontro + status mockados + selo "Acompanhamento em tempo real — em breve".

Opção 2: demo visual com pin animado num caminho pré-gravado (mais impactante pra captação).

O objetivo é duplo: validar se o turista se interessa pela feature, e ter a interface pronta pra mostrar em captação de investimento.

A tela deve suportar os dois modos futuros (GPS e status), mesmo que mockados:
- **Modo GPS:** mapa com pin + ETA (pra transfer, buggy, lancha)
- **Modo status:** status do operador ("confirmado" → "aguardando" → "embarque" → "iniciando") (pra ponto fixo, trilha, aula)

### F. Tela de reservas (admin)

Página protegida por path secreto ou senha em env var. Sem auth completa. Lista de bookings: passeio, turista, contato, hotel, data, valor, status. Só leitura.

Pro Huendel e pro operador acompanharem o que tá caindo. Sem aceitar/recusar, sem CRUD.

### G. Analytics e tagueamento

- GA4 ou Plausible.
- Evento de clique no botão "Reservar" (mede intenção).
- Evento de booking criada (mede início de checkout).
- Evento de pagamento confirmado (mede conversão).
- **Essencial** — sem isso o teste de validação roda às cegas.

---

## 3. Conflitos a corrigir ANTES do teste

Auditoria de 2026-06-28 — status atualizado:

| Conflito | Status | Correção |
|---|---|---|
| Preço do Recife de Fora | 🔨 **Verificar** | Deve ser R$155–175 sem transfer / R$185–205 com transfer (NÃO R$95). Confirmar no `tours.ts` atual. |
| Morro de São Paulo não é do operador | 🔨 **Verificar** | Se ainda existe no `tours.ts`, remover — não consta no catálogo do Porto Brasil Turismo. |
| 15 passeios reais | ✅ **Resolvido** | `tours.ts` já tem os 15 passeios do catálogo. |
| WhatsApp placeholder | ✅ **Resolvido** | Número real já está: 5573991579960. |
| TourSearchBar não redireciona | ✅ **Resolvido** | Já faz `router.push` pro `/buscar`. |
| TourCard leva pro WhatsApp | 🔨 **Pendente** | Trocar link do WhatsApp por link pra `/passeios/[slug]` e depois pro fluxo de reserva. |

---

## 4. O que fica congelado (Fase 2+)

Tudo abaixo foi documentado e está pronto pra construir quando a validação der sinal positivo. NÃO construir agora.

### Fase 2 — Com validação positiva
- Transfer como add-on funcional (conceito no design agora, implementação depois)
- Tracking modo status (operador atualiza "aguardando" → "embarque")
- Painel do operador com cadastro self-service + verificação/curadoria
- Checkout transparente (pagar sem sair do site)
- Auth de turista + `/minha-conta`
- `/destinos/[slug]`
- Reviews dinâmicos (substituir `ProvaSocial` hardcoded)
- E-mails: lembrete véspera, cancelamento
- Split de pagamento automático (Mercado Pago)
- Schema expandido (tour_prices, tour_schedules, tour_availability, operators, cities, booking_participants)
- RLS por perfil (turista/operador)
- SEO: sitemap, robots, metadata por rota
- LGPD, termos de uso, política de cancelamento

### Fase 3 — Com tração
- Tracking modo GPS em tempo real (precisa de operador testando em campo)
- Multi-praça (onboarding digital, sem sócio em cada cidade)
- Destaque pago (posicionamento no catálogo)
- Painel financeiro do operador
- Blog/SEO avançado
- WhatsApp notifications (Z-API ou Twilio)
- PWA pro operador
- APIs de integração (só quando tiver operadores grandes pedindo)

---

## 5. Schema simplificado (validação)

```sql
-- ─────────────────────────────────────────
-- TOURS (catálogo real — 15 passeios)
-- ─────────────────────────────────────────
create table tours (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  title             text not null,
  subtitle          text,
  description       text,
  category          text not null,               -- 'nautico', 'terrestre', 'aventura', 'cultural', 'noturno'
  transport_type    text not null,               -- 'terrestre', 'escuna', 'embarcacao', 'quadriciclo', 'canoa', 'misto'
  duration_minutes  int,
  meeting_point     text,
  schedule_info     text,                        -- texto livre: "Diário, saída 07:40–08:40, retorno ~17h"
  includes          text[],
  excludes          text[],
  price_adult       numeric(10,2) not null,
  price_child       numeric(10,2),
  child_age_info    text,                        -- "6–8 anos" — texto, sem tabela separada
  image_urls        text[],                      -- array de URLs
  badge             text,                        -- 'Mais vendido', 'Imperdível'
  is_active         boolean default true,
  featured          boolean default false,
  created_at        timestamptz default now()
);

-- ─────────────────────────────────────────
-- BOOKINGS (reservas)
-- ─────────────────────────────────────────
create table bookings (
  id                uuid primary key default gen_random_uuid(),
  tour_id           uuid references tours(id) not null,
  tour_date         date not null,
  adults            int not null default 1,
  children          int not null default 0,
  total_price       numeric(10,2) not null,
  tourist_name      text not null,
  tourist_email     text not null,
  tourist_phone     text not null,
  tourist_hotel     text,                        -- pro transfer futuro
  payment_status    text default 'pending',      -- 'pending', 'paid', 'cancelled'
  mercadopago_id    text,
  notes             text,
  created_at        timestamptz default now()
);
```

O schema completo (11 tabelas, RLS, enums tipados, tour_prices com faixas etárias, tour_schedules, tracking_sessions etc.) está documentado no gap original e entra na Fase 2.

---

## 6. Ordem de execução (atualizado pós-auditoria)

~~0. Auditar o repo~~ ✅ Feito em 2026-06-28
~~5. Conectar `TourSearchBar`~~ ✅ Já conecta ao `/buscar`

### O que falta construir:

1. **Supabase** — criar projeto, `.env.local`, 2 tabelas, seed dos 15 passeios (migrar do `tours.ts`)
2. **Verificar conflitos** — preço Recife de Fora, Morro de São Paulo (corrigir no seed se necessário)
3. **Migrar `/passeios/[slug]` e `/buscar`** pra puxar do Supabase em vez do `tours.ts`
4. **Trocar botão WhatsApp** do `TourCard` e da página de detalhe pelo link pro fluxo de reserva
5. **Fluxo de reserva** — formulário (data, participantes, dados do turista, resumo)
6. **Mercado Pago Checkout Pro** — API route + preferência + webhook
7. **Página de confirmação** `/reserva/[id]/confirmacao` + **e-mail Resend**
8. **UI mockada do tracking** na confirmação
9. **Tela admin de reservas** (path secreto, só leitura)
10. **Analytics** + eventos do funil (clique reservar, booking criada, pagamento confirmado)

---

> **Regra:** se durante a construção surgir vontade de fazer algo que não está neste doc, NÃO faça. Consulte o Product Spec e confirme se é escopo de validação. Se não for, anote e siga.
