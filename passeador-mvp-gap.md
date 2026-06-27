# Passeador — MVP Gap Analysis

> Gerado em 2026-06-26 com base na leitura completa do repositório e no catálogo real do operador Porto Brasil Turismo.

---

## 3.1 O que já existe

### Páginas
| Rota | Arquivo | Status |
|---|---|---|
| `/` | `src/app/page.tsx` | ✅ Completa — 8 seções renderizadas |
| Qualquer outra rota | — | ❌ Não existe |

### Componentes (`src/components/`)
| Componente | Função | Status |
|---|---|---|
| `Header.tsx` | Nav sticky, mega-menu Passeios, seletor de idioma, menu hamburger | ✅ |
| `Hero.tsx` | Hero fullscreen com imagens mobile/desktop | ✅ |
| `TourSearchBar.tsx` | Barra de busca desktop + modal mobile (Onde/Quando/Quem) | ✅ |
| `TrustBar.tsx` | Marquee com selos de confiança | ✅ |
| `DestinosSection.tsx` | Grid de 5 destinos com imagens | ✅ |
| `ExperienciasSection.tsx` | 4 cards de experiências em destaque | ✅ |
| `ComoFunciona.tsx` | 3 passos (escolha → reserve → viva) | ✅ |
| `CategoriasSection.tsx` | 6 categorias de passeio | ✅ |
| `ProvaSocial.tsx` | 7 reviews — carousel desktop + 3 cards mobile | ✅ |
| `CtaOperadores.tsx` | Seção de recrutamento de operadores | ✅ |
| `ToursSection.tsx` | Grid filtrado por categoria (usa `TourCard`) | ✅ |
| `TourCard.tsx` | Card de passeio com botão WhatsApp | ✅ |
| `WhyUs.tsx` | 4 diferenciais (segurança, grupos, experiência, pontualidade) | ✅ |
| `ContactSection.tsx` | CTA final com WhatsApp + Instagram | ✅ |
| `Footer.tsx` | Footer com 5 colunas, redes sociais, seletor de idioma | ✅ |
| `MobileMenu.tsx` | Drawer mobile via portal | ✅ |

### Dados (`src/data/`)
| Arquivo | Conteúdo | Status |
|---|---|---|
| `tours.ts` | 6 passeios hardcoded, interface `Tour` | 🔨 Incompleto — faltam 9 dos 15 passeios reais; sem campos de operador, galeria, horários, preço infantil, política de cancelamento |

### Configurações
| Arquivo | Status |
|---|---|
| `next.config.ts` | ✅ Standalone output para Docker/Coolify |
| `tsconfig.json` | ✅ Strict TypeScript, alias `@/*` |
| `postcss.config.mjs` | ✅ Tailwind v4 |
| `eslint.config.mjs` | ✅ Next.js + TypeScript rules |
| `Dockerfile` + `nixpacks.toml` | ✅ Pronto para Coolify |

### Assets (`public/`)
| Asset | Status |
|---|---|
| `hero-bg.webp` / `hero-bg-desktop.webp` | ✅ WebP, ~677KB |
| `images/*.webp` (arraial, caraiva, coroa, espelho, morro, recife) | ✅ WebP, ~230KB avg |
| `logo-passeador.svg` | ✅ |
| `logo-pts.svg`, `logo-greenchain.svg` | ✅ Logos de parceiros |

### Backend / Infraestrutura
| Item | Status |
|---|---|
| API Routes | ❌ Nenhuma |
| Banco de dados | ❌ Nenhum (sem Supabase, Prisma, etc.) |
| Autenticação | ❌ Nenhuma |
| Pagamento | ❌ Apenas link WhatsApp hardcoded |
| Analytics | ❌ Nenhum |
| `.env` / variáveis de ambiente | ❌ Nenhum arquivo configurado |

---

## 3.2 O que o MVP precisa ter

### A. Páginas do turista (frontend)
- [ ] Home com hero, barra de busca, categorias → **existe, mas search bar não conecta a rota nenhuma**
- [ ] Página de resultados de busca (`/buscar`)
- [ ] Página do passeio (`/passeios/[slug]`) com descrição completa, fotos, preço, calendário, seletor adulto/criança
- [ ] Fluxo de reserva (data → participantes → dados pessoais → pagamento)
- [ ] Página de confirmação de reserva (`/reserva/[id]/confirmacao`)
- [ ] Área do turista — minhas reservas (`/minha-conta`)
- [ ] Página do destino/cidade (`/destinos/porto-seguro`)

### B. Painel do operador (PWA)
- [ ] Login/cadastro do operador (`/operador/login`)
- [ ] Dashboard com reservas do dia/semana (`/operador/dashboard`)
- [ ] Gestão de passeios — cadastrar, editar, pausar, definir disponibilidade (`/operador/passeios`)
- [ ] Aceitar/recusar reservas
- [ ] Botão "Estou a caminho" + compartilhamento de geolocation
- [ ] Histórico e faturamento (`/operador/financeiro`)

### C. Tracking em tempo real
- [ ] Para serviços com deslocamento: operador aperta "A caminho" → browser pede geolocation → posição vai pro Supabase Realtime
- [ ] Turista vê pin no mapa se movendo
- [ ] Status: Confirmado → A caminho → Chegando → Chegou
- [ ] Para passeios de grupo agendado: apenas status + pin fixo do ponto de encontro

### D. Banco de dados (Supabase)
- [ ] Tabela `cities` — destinos
- [ ] Tabela `operators` — operadores cadastrados
- [ ] Tabela `tours` — passeios com todos os campos do catálogo
- [ ] Tabela `tour_prices` — adulto/criança com faixas etárias por passeio
- [ ] Tabela `tour_schedules` — frequência, horários de saída/retorno
- [ ] Tabela `tour_availability` — datas bloqueadas, capacidade por data
- [ ] Tabela `bookings` — reservas com status e pagamento
- [ ] Tabela `booking_participants` — adultos e crianças por reserva
- [ ] Tabela `tracking_sessions` — posição GPS em tempo real (Supabase Realtime)
- [ ] Tabela `reviews` — avaliações dos turistas
- [ ] Auth Supabase para turistas e operadores
- [ ] RLS (Row Level Security) em todas as tabelas

### E. Pagamento
- [ ] Integração Mercado Pago com split payment (comissão Passeador + repasse operador)
- [ ] Checkout transparente no fluxo de reserva
- [ ] Webhook `/api/webhooks/mercadopago` → atualiza status da reserva

### F. Infraestrutura e legal
- [ ] Política de privacidade LGPD (`/privacidade`)
- [ ] Termos de uso turista (`/termos`)
- [ ] Termos de uso operador (`/termos-operador`)
- [ ] Política de cancelamento (`/cancelamento`)
- [ ] SEO: `sitemap.ts`, `robots.ts`, `generateMetadata()` em cada rota
- [ ] PWA manifest (`/operador` precisa ser instalável)
- [ ] Analytics (GA4 ou Plausible)

### G. Comunicação
- [ ] E-mails transacionais: confirmação de reserva, lembrete véspera, cancelamento (Resend)
- [ ] API route `/api/email/send`
- [ ] WhatsApp notification via Twilio ou Z-API (schema pronto, integração fase 2)

---

## 3.3 Gap — o que falta

### A. Páginas do turista

| Item | Status | Detalhe |
|---|---|---|
| Home completa | ✅ | Existe — search bar não conecta a `/buscar` |
| `/buscar` — resultados | ❌ | Não existe |
| `/passeios/[slug]` — detalhe | ❌ | Não existe |
| Fluxo de reserva | ❌ | Não existe |
| `/reserva/[id]/confirmacao` | ❌ | Não existe |
| `/minha-conta` | ❌ | Não existe |
| `/destinos/[slug]` | ❌ | Não existe |
| TourSearchBar → conectar `/buscar` | 🔨 | Barra existe mas botão de busca não faz nada |

### B. Painel do operador

| Item | Status | Detalhe |
|---|---|---|
| `/operador/login` | ❌ | Não existe |
| `/operador/dashboard` | ❌ | Não existe |
| `/operador/passeios` (CRUD) | ❌ | Não existe |
| Aceitar/recusar reservas | ❌ | Não existe |
| Botão "A caminho" + GPS | ❌ | Não existe |
| `/operador/financeiro` | ❌ | Não existe |

### C. Tracking

| Item | Status | Detalhe |
|---|---|---|
| GPS do operador → Supabase Realtime | ❌ | Não existe |
| Mapa com pin ao vivo | ❌ | Não existe |
| Status de reserva em tempo real | ❌ | Não existe |

### D. Banco de dados

| Item | Status | Detalhe |
|---|---|---|
| Supabase configurado | ❌ | Nenhuma conexão |
| Tabela `cities` | ❌ | — |
| Tabela `operators` | ❌ | — |
| Tabela `tours` | ❌ | Existe apenas `tours.ts` estático com 6 items e schema incompleto |
| Tabela `tour_prices` | ❌ | Nenhum campo de preço infantil, faixa etária |
| Tabela `tour_schedules` | ❌ | Nenhum campo de frequência/horários |
| Tabela `tour_availability` | ❌ | Calendário de disponibilidade inexistente |
| Tabela `bookings` | ❌ | — |
| Tabela `booking_participants` | ❌ | — |
| Tabela `tracking_sessions` | ❌ | — |
| Tabela `reviews` | ❌ | Reviews são hardcoded em `ProvaSocial.tsx` |
| Auth Supabase | ❌ | — |
| RLS | ❌ | — |

### E. Pagamento

| Item | Status | Detalhe |
|---|---|---|
| Mercado Pago | ❌ | Apenas link WhatsApp como "reserva" |
| Checkout transparente | ❌ | — |
| Webhook de confirmação | ❌ | Sem API routes |

### F. Infraestrutura e legal

| Item | Status | Detalhe |
|---|---|---|
| Política de privacidade LGPD | ❌ | — |
| Termos de uso turista | ❌ | — |
| Termos de uso operador | ❌ | — |
| Política de cancelamento | ❌ | — |
| `sitemap.ts` | ❌ | — |
| `robots.ts` | ❌ | — |
| `generateMetadata()` nas rotas | 🔨 | Só no `layout.tsx` root — sem por rota |
| PWA manifest | ❌ | — |
| Analytics | ❌ | — |

### G. Comunicação

| Item | Status | Detalhe |
|---|---|---|
| E-mails transacionais (Resend) | ❌ | — |
| `/api/email/send` | ❌ | — |
| WhatsApp notification | ❌ | Apenas botão manual no TourCard |

---

## 3.4 Priorização sugerida

### Fase 1 — Core (sem isso não lança)

> Um turista consegue encontrar, reservar e pagar. O operador recebe e confirma.

1. **Expandir `tours.ts`** → adicionar todos os 15 passeios reais, campos de operador, horários, preços adulto/criança, políticas
2. **Supabase**: criar projeto, configurar `.env.local`, criar todas as tabelas, seed dos 15 passeios + 1 operador
3. **`/passeios/[slug]`** — página de detalhe do passeio
4. **Conectar TourSearchBar** ao `/buscar` via `router.push`
5. **`/buscar`** — resultados filtráveis por categoria, preço, duração
6. **Fluxo de reserva** — seletor data/participantes → dados pessoais → Mercado Pago checkout
7. **`/reserva/[id]/confirmacao`** — página de confirmação com detalhes da reserva
8. **Auth Supabase** — cadastro/login turista (email ou Google)
9. **`/operador/login`** + **`/operador/dashboard`** — login do operador, ver reservas do dia
10. **Aceitar/recusar reservas** no dashboard do operador
11. **Webhook Mercado Pago** — `/api/webhooks/mercadopago` → atualizar status
12. **E-mail transacional** de confirmação (Resend)

### Fase 2 — Experiência (lança sem, mas precisa logo)

13. **Tracking GPS** — botão "A caminho" no app do operador → Supabase Realtime → mapa no turista
14. **`/minha-conta`** — área do turista com histórico de reservas
15. **Reviews dinâmicos** — substituir `ProvaSocial.tsx` hardcoded por dados do Supabase
16. **E-mails**: lembrete véspera, cancelamento, notificação de pagamento ao operador
17. **`/destinos/[slug]`** — listagem por cidade
18. **SEO completo**: `sitemap.ts`, `robots.ts`, `generateMetadata()` por rota
19. **PWA manifest** para `/operador`
20. **Analytics** (GA4)

### Fase 3 — Escala (depois do piloto validado)

21. **`/operador/passeios`** — CRUD self-service de passeios pelo operador
22. **`/operador/financeiro`** — histórico de faturamento e repasses
23. **Multi-praça** — onboarding de Porto Seguro 2, Chapada, etc.
24. **Destaque pago** — operadores pagam para aparecer no topo
25. **SEO avançado** — blog, guias de destino, schema.org
26. **WhatsApp notifications** via Z-API ou Twilio
27. **`/para-operadores`** — landing de recrutamento B2B (o CTA da home aponta para aqui)

---

## 3.5 Schema sugerido do banco (Supabase)

### Tabelas

```sql
-- ─────────────────────────────────────────
-- CITIES
-- ─────────────────────────────────────────
create table cities (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,           -- 'porto-seguro'
  name        text not null,                  -- 'Porto Seguro'
  state       text not null,                  -- 'BA'
  description text,
  image_url   text,
  created_at  timestamptz default now()
);

-- ─────────────────────────────────────────
-- OPERATORS
-- ─────────────────────────────────────────
create table operators (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id),
  city_id       uuid references cities(id),
  name          text not null,                -- 'Porto Brasil Turismo'
  slug          text unique not null,
  whatsapp      text not null,                -- '5573999999999'
  instagram     text,
  cadastur      text,                         -- número CADASTUR
  years_active  int,
  description   text,
  logo_url      text,
  is_active     boolean default true,
  created_at    timestamptz default now()
);

-- ─────────────────────────────────────────
-- TOURS
-- ─────────────────────────────────────────
create type tour_category as enum ('nautico', 'terrestre', 'aventura', 'cultural', 'noturno');
create type tour_transport as enum ('terrestre', 'escuna', 'embarcacao', 'quadriciclo', 'canoa', 'misto');

create table tours (
  id                   uuid primary key default gen_random_uuid(),
  operator_id          uuid references operators(id) not null,
  city_id              uuid references cities(id) not null,
  slug                 text unique not null,
  title                text not null,
  subtitle             text,
  description          text,
  tips                 text,                  -- dicas para o turista
  important_info       text,                  -- informações importantes
  category             tour_category not null,
  transport_type       tour_transport not null,
  duration_minutes     int,                   -- duração em minutos
  distance_km          int,                   -- distância percorrida
  max_capacity         int,                   -- capacidade máxima do grupo
  meeting_point        text,                  -- ponto de encontro
  meeting_point_lat    float,
  meeting_point_lng    float,
  includes             text[],               -- ['Transporte', 'Guia CADASTUR']
  excludes             text[],               -- ['Alimentação', 'Bebidas']
  cancellation_policy  text,
  is_active            boolean default true,
  featured             boolean default false,
  badge                text,                  -- 'Mais vendido', 'Imperdível'
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

-- ─────────────────────────────────────────
-- TOUR IMAGES
-- ─────────────────────────────────────────
create table tour_images (
  id        uuid primary key default gen_random_uuid(),
  tour_id   uuid references tours(id) on delete cascade,
  url       text not null,
  alt       text,
  position  int default 0,                   -- 0 = capa
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────
-- TOUR PRICES
-- ─────────────────────────────────────────
create type price_category as enum ('adult', 'child', 'infant', 'companion');  -- companion = garupa quadriciclo

create table tour_prices (
  id              uuid primary key default gen_random_uuid(),
  tour_id         uuid references tours(id) on delete cascade,
  category        price_category not null,
  label           text,                      -- 'Adulto', 'Criança 6-8 anos', 'Colo (0-3 anos)'
  age_min         int,                       -- null = sem restrição
  age_max         int,
  price_cost      numeric(10,2) not null,    -- custo interno do operador
  price_sell_min  numeric(10,2) not null,    -- preço mínimo de venda
  price_sell_max  numeric(10,2) not null,    -- preço máximo de venda
  is_free         boolean default false,     -- crianças de colo grátis
  notes           text,                      -- regras especiais (ex: 'Com autorização dos pais')
  created_at      timestamptz default now()
);

-- ─────────────────────────────────────────
-- TOUR SCHEDULES (frequência e horários)
-- ─────────────────────────────────────────
create type frequency_type as enum ('daily', 'specific_days', 'tide_based', 'on_request');

create table tour_schedules (
  id              uuid primary key default gen_random_uuid(),
  tour_id         uuid references tours(id) on delete cascade,
  frequency       frequency_type not null,
  days_of_week    int[],                     -- [1,2,3,4,5,6,0] domingo=0, seg=1...
  departure_start time,                      -- '07:40'
  departure_end   time,                      -- '08:40' (janela de coleta)
  return_time     time,                      -- '17:00'
  notes           text,                      -- 'Tábua de marés' para passeios náuticos
  created_at      timestamptz default now()
);

-- ─────────────────────────────────────────
-- TOUR AVAILABILITY (datas e capacidade)
-- ─────────────────────────────────────────
create table tour_availability (
  id          uuid primary key default gen_random_uuid(),
  tour_id     uuid references tours(id) on delete cascade,
  date        date not null,
  capacity    int not null,                  -- vagas disponíveis naquela data
  is_blocked  boolean default false,         -- bloqueio manual pelo operador
  notes       text,
  unique(tour_id, date)
);

-- ─────────────────────────────────────────
-- BOOKINGS
-- ─────────────────────────────────────────
create type booking_status as enum (
  'pending',       -- aguardando confirmação do operador
  'confirmed',     -- operador confirmou
  'paid',          -- pagamento aprovado
  'cancelled',     -- cancelado
  'completed',     -- passeio realizado
  'no_show'        -- turista não apareceu
);

create type payment_status as enum ('pending', 'partial', 'paid', 'refunded', 'failed');
create type payment_method as enum ('pix', 'credit_card', 'debit_card', 'cash', 'whatsapp');

create table bookings (
  id                    uuid primary key default gen_random_uuid(),
  tour_id               uuid references tours(id) not null,
  operator_id           uuid references operators(id) not null,
  user_id               uuid references auth.users(id),          -- null se não logado
  date                  date not null,
  status                booking_status default 'pending',
  payment_status        payment_status default 'pending',
  payment_method        payment_method,
  total_price           numeric(10,2) not null,
  platform_fee          numeric(10,2),                           -- comissão Passeador (15-20%)
  operator_payout       numeric(10,2),                           -- repasse ao operador
  mercadopago_id        text,                                    -- ID da transação MP
  deposit_paid          numeric(10,2) default 0,                 -- sinal PIX
  deposit_paid_at       timestamptz,
  confirmed_at          timestamptz,
  cancelled_at          timestamptz,
  cancellation_reason   text,
  tourist_name          text not null,
  tourist_email         text not null,
  tourist_phone         text not null,
  tourist_hotel         text,                                    -- hotel para coleta
  notes                 text,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- ─────────────────────────────────────────
-- BOOKING PARTICIPANTS
-- ─────────────────────────────────────────
create table booking_participants (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid references bookings(id) on delete cascade,
  price_id    uuid references tour_prices(id),
  label       text not null,                 -- 'Adulto', 'Criança 6-8 anos'
  quantity    int not null,
  unit_price  numeric(10,2) not null,
  subtotal    numeric(10,2) not null
);

-- ─────────────────────────────────────────
-- TRACKING SESSIONS (GPS em tempo real)
-- ─────────────────────────────────────────
create type tracking_status as enum ('idle', 'en_route', 'arriving', 'arrived', 'completed');

create table tracking_sessions (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid references bookings(id) on delete cascade,
  operator_id uuid references operators(id),
  status      tracking_status default 'idle',
  lat         float,
  lng         float,
  updated_at  timestamptz default now()
);

-- ─────────────────────────────────────────
-- REVIEWS
-- ─────────────────────────────────────────
create table reviews (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid references bookings(id) on delete cascade unique,
  tour_id     uuid references tours(id),
  user_id     uuid references auth.users(id),
  rating      int check (rating between 1 and 5),
  text        text,
  is_visible  boolean default false,         -- aprovação manual antes de publicar
  created_at  timestamptz default now()
);
```

### Row Level Security (RLS)

```sql
-- Turistas só veem suas próprias reservas
alter table bookings enable row level security;
create policy "turista vê próprias reservas"
  on bookings for select
  using (auth.uid() = user_id);

-- Operador vê reservas do seu operador
create policy "operador vê reservas do seu operador"
  on bookings for select
  using (
    operator_id in (
      select id from operators where user_id = auth.uid()
    )
  );

-- Operador atualiza status de reservas suas
create policy "operador atualiza status"
  on bookings for update
  using (
    operator_id in (
      select id from operators where user_id = auth.uid()
    )
  );

-- Operador só edita seus próprios passeios
alter table tours enable row level security;
create policy "operador edita próprios passeios"
  on tours for all
  using (
    operator_id in (
      select id from operators where user_id = auth.uid()
    )
  );

-- Passeios ativos são públicos
create policy "passeios ativos são públicos"
  on tours for select
  using (is_active = true);

-- Tracking: operador atualiza própria sessão
alter table tracking_sessions enable row level security;
create policy "operador atualiza tracking"
  on tracking_sessions for all
  using (
    operator_id in (
      select id from operators where user_id = auth.uid()
    )
  );

-- Tracking: turista vê tracking da sua reserva
create policy "turista vê tracking"
  on tracking_sessions for select
  using (
    booking_id in (
      select id from bookings where user_id = auth.uid()
    )
  );
```

### Seed SQL — 1 destino + 1 operador + 15 passeios

```sql
-- DESTINO
insert into cities (id, slug, name, state, description)
values (
  'a1b2c3d4-0000-0000-0000-000000000001',
  'porto-seguro',
  'Porto Seguro',
  'BA',
  'A Costa do Descobrimento — berço do Brasil, praias paradisíacas e cultura indígena viva.'
);

-- OPERADOR
insert into operators (id, city_id, name, slug, whatsapp, cadastur, years_active, description)
values (
  'b2c3d4e5-0000-0000-0000-000000000001',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Porto Brasil Turismo',
  'porto-brasil-turismo',
  '5573999999999',
  '12345678',
  12,
  'Operador local especializado em passeios pela Costa do Descobrimento. Guias credenciados CADASTUR, transporte confortável e atendimento personalizado.'
);

-- PASSEIOS (15 reais do catálogo)
insert into tours (id, operator_id, city_id, slug, title, subtitle, category, transport_type, duration_minutes, includes, is_active, featured)
values
  ('c1000000-0000-0000-0000-000000000001', 'b2c3d4e5-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001',
   'trancoso', 'Trancoso', 'Praia dos Coqueiros + Quadrado de Trancoso', 'terrestre', 'terrestre', 540,
   ARRAY['Transporte', 'Guia CADASTUR'], true, true),

  ('c1000000-0000-0000-0000-000000000002', 'b2c3d4e5-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001',
   'arraial-da-ajuda', 'Arraial d''Ajuda', 'Praia e Vilarejo', 'terrestre', 'misto', 540,
   ARRAY['Transporte', 'Travessia de balsa', 'Guia CADASTUR'], true, true),

  ('c1000000-0000-0000-0000-000000000003', 'b2c3d4e5-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001',
   'praia-do-espelho', 'Praia do Espelho', 'Praia + Vale Verde', 'terrestre', 'terrestre', 540,
   ARRAY['Transporte 4x4', 'Guia CADASTUR'], true, true),

  ('c1000000-0000-0000-0000-000000000004', 'b2c3d4e5-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001',
   'coroa-vermelha', 'Coroa Vermelha', 'Praia + Aldeia Indígena', 'cultural', 'terrestre', 420,
   ARRAY['Transporte', 'Guia CADASTUR'], true, false),

  ('c1000000-0000-0000-0000-000000000005', 'b2c3d4e5-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001',
   'caraiva', 'Caraíva', 'Praia + Rio + Vila', 'aventura', 'misto', 570,
   ARRAY['Transporte 4x4', 'Travessia de canoa', 'Guia CADASTUR'], true, true),

  ('c1000000-0000-0000-0000-000000000006', 'b2c3d4e5-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001',
   'trancoso-espelho', 'Trancoso + Praia do Espelho', 'Praia do Espelho + Quadrado de Trancoso', 'terrestre', 'terrestre', 540,
   ARRAY['Transporte 4x4', 'Guia CADASTUR'], true, false),

  ('c1000000-0000-0000-0000-000000000007', 'b2c3d4e5-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001',
   'caraiva-espelho', 'Caraíva + Praia do Espelho', 'Caraíva + Praia do Espelho', 'aventura', 'misto', 540,
   ARRAY['Transporte 4x4', 'Travessia de canoa', 'Guia CADASTUR'], true, false),

  ('c1000000-0000-0000-0000-000000000008', 'b2c3d4e5-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001',
   'rota-redescoberta', 'Rota da Redescoberta', 'Aldeia Indígena + Praia + City Tour', 'cultural', 'terrestre', 480,
   ARRAY['Transporte', 'Guia histórico CADASTUR'], true, false),

  ('c1000000-0000-0000-0000-000000000009', 'b2c3d4e5-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001',
   'by-night-arraial', 'By Night Arraial', 'Vilarejo + Rua Mucugê', 'noturno', 'misto', 360,
   ARRAY['Transporte', 'Travessia de balsa', 'Guia CADASTUR'], true, false),

  ('c1000000-0000-0000-0000-000000000010', 'b2c3d4e5-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001',
   'fluvial-coroa-alta', 'Fluvial Coroa Alta', 'Passeio de Escuna', 'nautico', 'escuna', 240,
   ARRAY['Escuna', 'Guia CADASTUR'], true, false),

  ('c1000000-0000-0000-0000-000000000011', 'b2c3d4e5-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001',
   'recife-de-fora-sem-transfer', 'Recife de Fora', 'Escuna + Piscinas Naturais (sem transfer)', 'nautico', 'escuna', 240,
   ARRAY['Escuna', 'Equipamento de snorkel', 'Guia CADASTUR'], true, true),

  ('c1000000-0000-0000-0000-000000000012', 'b2c3d4e5-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001',
   'recife-de-fora-com-transfer', 'Recife de Fora + Transfer', 'Escuna + Piscinas Naturais (com transfer)', 'nautico', 'escuna', 240,
   ARRAY['Transfer', 'Escuna', 'Equipamento de snorkel', 'Guia CADASTUR'], true, false),

  ('c1000000-0000-0000-0000-000000000013', 'b2c3d4e5-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001',
   'mergulho', 'Mergulho', 'Mergulho guiado', 'nautico', 'embarcacao', 360,
   ARRAY['Embarcação', 'Equipamento de mergulho', 'Instrutor CADASTUR'], true, false),

  ('c1000000-0000-0000-0000-000000000014', 'b2c3d4e5-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001',
   'quadriciclo-acai', 'Quadriciclo Rota do Açaí', 'Trilha + Cascata + Degustação', 'aventura', 'quadriciclo', 135,
   ARRAY['Quadriciclo', 'Capacete', 'Guia CADASTUR', 'Degustação de açaí'], true, false),

  ('c1000000-0000-0000-0000-000000000015', 'b2c3d4e5-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001',
   'quadriciclo-aldeia', 'Quadriciclo Rota da Aldeia', 'Trilha', 'aventura', 'quadriciclo', 135,
   ARRAY['Quadriciclo', 'Capacete', 'Guia CADASTUR'], true, false);

-- PREÇOS (adulto) — exemplo para os 3 primeiros; padrão se repete
insert into tour_prices (tour_id, category, label, price_cost, price_sell_min, price_sell_max)
values
  ('c1000000-0000-0000-0000-000000000001', 'adult', 'Adulto', 50, 90, 100),
  ('c1000000-0000-0000-0000-000000000002', 'adult', 'Adulto', 60, 100, 110),
  ('c1000000-0000-0000-0000-000000000003', 'adult', 'Adulto', 80, 110, 120),
  ('c1000000-0000-0000-0000-000000000004', 'adult', 'Adulto', 45, 75, 85),
  ('c1000000-0000-0000-0000-000000000005', 'adult', 'Adulto', 100, 130, 140),
  ('c1000000-0000-0000-0000-000000000006', 'adult', 'Adulto', 90, 120, 130),
  ('c1000000-0000-0000-0000-000000000007', 'adult', 'Adulto', 110, 140, 150),
  ('c1000000-0000-0000-0000-000000000008', 'adult', 'Adulto', 60, 90, 100),
  ('c1000000-0000-0000-0000-000000000009', 'adult', 'Adulto', 70, 100, 110),
  ('c1000000-0000-0000-0000-000000000010', 'adult', 'Adulto', 80, 110, 120),
  ('c1000000-0000-0000-0000-000000000011', 'adult', 'Adulto', 135, 155, 175),
  ('c1000000-0000-0000-0000-000000000012', 'adult', 'Adulto', 165, 185, 205),
  ('c1000000-0000-0000-0000-000000000013', 'adult', 'Adulto', 200, 250, 300),
  ('c1000000-0000-0000-0000-000000000014', 'adult', 'Adulto', 230, 280, 300),
  ('c1000000-0000-0000-0000-000000000015', 'adult', 'Adulto', 230, 280, 300);

-- PREÇOS infantis
insert into tour_prices (tour_id, category, label, age_min, age_max, price_cost, price_sell_min, price_sell_max)
values
  ('c1000000-0000-0000-0000-000000000001', 'child', 'Criança 6-8 anos', 6, 8, 40, 60, 80),
  ('c1000000-0000-0000-0000-000000000002', 'child', 'Criança 8-9 anos', 8, 9, 60, 90, 100),
  ('c1000000-0000-0000-0000-000000000003', 'child', 'Criança 3-5 anos', 3, 5, 60, 90, 100),
  ('c1000000-0000-0000-0000-000000000004', 'child', 'Criança 8-9 anos', 8, 9, 35, 65, 75),
  ('c1000000-0000-0000-0000-000000000005', 'child', 'Criança 3-5 anos', 3, 5, 80, 110, 120),
  ('c1000000-0000-0000-0000-000000000006', 'child', 'Criança 3-5 anos', 3, 5, 70, 100, 110),
  ('c1000000-0000-0000-0000-000000000007', 'child', 'Criança 3-5 anos', 3, 5, 90, 120, 130),
  ('c1000000-0000-0000-0000-000000000008', 'child', 'Criança 5-10 anos', 5, 10, 50, 80, 90),
  ('c1000000-0000-0000-0000-000000000009', 'child', 'Criança 4-8 anos', 4, 8, 60, 90, 100),
  ('c1000000-0000-0000-0000-000000000010', 'child', 'Criança 8-10 anos', 8, 10, 50, 80, 90),
  ('c1000000-0000-0000-0000-000000000011', 'child', 'Criança 5-8 anos', 5, 8, 90, 100, 120),
  ('c1000000-0000-0000-0000-000000000012', 'child', 'Criança 5-8 anos', 5, 8, 110, 130, 150),
  ('c1000000-0000-0000-0000-000000000013', 'companion', 'Acompanhante', null, null, 155, 175, 195),
  ('c1000000-0000-0000-0000-000000000014', 'companion', 'Garupa', null, 15, 150, 170, 200),
  ('c1000000-0000-0000-0000-000000000015', 'companion', 'Garupa', null, 15, 150, 170, 200);

-- CRIANÇAS DE COLO GRÁTIS (regra geral — todos os passeios)
insert into tour_prices (tour_id, category, label, age_min, age_max, price_cost, price_sell_min, price_sell_max, is_free)
select id, 'infant', 'Bebê de colo (0-3 anos)', 0, 2, 0, 0, 0, true
from tours;

-- FREQUÊNCIAS
insert into tour_schedules (tour_id, frequency, days_of_week, departure_start, departure_end, return_time)
values
  -- Diários
  ('c1000000-0000-0000-0000-000000000001', 'daily', ARRAY[1,2,3,4,5,6,0], '07:40', '08:40', '17:00'),
  ('c1000000-0000-0000-0000-000000000002', 'daily', ARRAY[1,2,3,4,5,6,0], '07:40', '08:40', '17:00'),
  ('c1000000-0000-0000-0000-000000000003', 'daily', ARRAY[1,2,3,4,5,6,0], '07:40', '08:40', '17:00'),
  -- Seg/Qua/Sex
  ('c1000000-0000-0000-0000-000000000004', 'specific_days', ARRAY[1,3,5], '07:40', '08:40', '15:00'),
  -- Ter/Qui/Sáb
  ('c1000000-0000-0000-0000-000000000005', 'specific_days', ARRAY[2,4,6], '07:30', '08:30', '17:00'),
  -- Seg/Qua/Sex
  ('c1000000-0000-0000-0000-000000000006', 'specific_days', ARRAY[1,3,5], '07:40', '08:40', '17:00'),
  ('c1000000-0000-0000-0000-000000000007', 'specific_days', ARRAY[1,3,5], '07:40', '08:40', '17:00'),
  -- Quartas apenas
  ('c1000000-0000-0000-0000-000000000008', 'specific_days', ARRAY[3], '07:40', '08:40', '16:00'),
  -- Qui/Sex/Sáb noturno
  ('c1000000-0000-0000-0000-000000000009', 'specific_days', ARRAY[4,5,6], '19:00', '19:20', '01:00'),
  -- Seg a Sáb (tábua de marés)
  ('c1000000-0000-0000-0000-000000000010', 'tide_based', ARRAY[1,2,3,4,5,6], null, null, null),
  ('c1000000-0000-0000-0000-000000000011', 'tide_based', ARRAY[1,2,3,4,5,6,0], null, null, null),
  ('c1000000-0000-0000-0000-000000000012', 'tide_based', ARRAY[1,2,3,4,5,6,0], null, null, null),
  -- Diário
  ('c1000000-0000-0000-0000-000000000013', 'daily', ARRAY[1,2,3,4,5,6,0], '08:00', '08:00', '14:00'),
  -- Seg a Sáb (manhã ou tarde)
  ('c1000000-0000-0000-0000-000000000014', 'specific_days', ARRAY[1,2,3,4,5,6], null, null, null),
  ('c1000000-0000-0000-0000-000000000015', 'specific_days', ARRAY[1,2,3,4,5,6], null, null, null);
```

---

## 3.6 Conflitos detectados entre o código atual e os dados reais

| Conflito | Arquivo | Problema |
|---|---|---|
| **tours.ts tem preços errados** | `src/data/tours.ts` | Recife de Fora está a R$95 mas o catálogo diz R$155–175 (sem transfer) / R$185–205 (com transfer) |
| **Morro de São Paulo não é operado** | `src/data/tours.ts` | Morro de SP está no data mas não consta no catálogo do Porto Brasil — pode ser de outro operador |
| **6 passeios vs 15 reais** | `src/data/tours.ts` | Faltam 9 passeios do catálogo |
| **Sem campo de horário** | `src/data/tours.ts` | Interface `Tour` não tem `departureTime`, `returnTime`, `frequency` |
| **Sem preço infantil** | `src/data/tours.ts` | Interface `Tour` não tem `childPrice` nem faixas etárias |
| **Sem operador** | `src/data/tours.ts` | Tours não têm referência ao operador — impossível montar página de detalhe completa |
| **WhatsApp hardcoded** | `TourCard.tsx` | Número `5573999999999` é placeholder — substituir pelo real do Porto Brasil Turismo |
| **TourSearchBar não redireciona** | `TourSearchBar.tsx` | Botão de busca não chama `router.push('/buscar?...')` |
| **Política de cancelamento diverge** | — | Plataforma precisa definir política própria (baseada na do operador mas adaptada pro marketplace) — 48h / 24h são do operador, a Passeador precisa ter regra de plataforma |
| **Tarifário vigente** | — | Catálogo informa "a partir de 04/05/2026" — incluir no banco e exibir na UI |
