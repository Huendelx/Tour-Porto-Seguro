-- ─────────────────────────────────────────────────────────
-- Passeador — Schema Fase 1 (validação)
-- Rodar uma vez no Supabase Dashboard → SQL Editor → Run
-- ─────────────────────────────────────────────────────────

-- ─── PROFILES ───
-- Estende auth.users. Toda conta (turista ou operador) ganha uma linha aqui.
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        text not null default 'turista' check (role in ('turista', 'operador', 'admin')),
  full_name   text,
  whatsapp    text,
  created_at  timestamptz not null default now()
);

-- ─── OPERATORS ───
-- Empresa que oferece passeios. Um operador (usuário logado) administra uma empresa.
create table operators (
  id                uuid primary key default gen_random_uuid(),
  owner_id          uuid unique references profiles(id) on delete cascade,
  name              text not null,
  whatsapp          text not null,
  cadastur          text,
  bio               text,
  years_experience  int,
  verified          boolean not null default false,
  created_at        timestamptz not null default now()
);

-- ─── TOURS ───
-- Catálogo. schedule/prices/itinerary ficam em jsonb pra espelhar 1:1 o formato
-- que já existe em tours.ts — evita 4 tabelas de junção agora; normaliza depois se precisar.
create table tours (
  id                  uuid primary key default gen_random_uuid(),
  operator_id         uuid not null references operators(id) on delete cascade,
  slug                text unique not null,
  title               text not null,
  subtitle            text,
  summary             text,
  description         text not null,
  tips                text,
  important_info      text,
  category            text not null check (category in ('nautico', 'terrestre', 'aventura', 'cultural', 'noturno')),
  transport_type      text not null,
  duration            text not null,
  duration_minutes    int,
  distance_km         int,
  group_size          text not null,
  price               numeric(10,2) not null,
  price_max           numeric(10,2),
  price_unit          text not null default 'por pessoa',
  includes            text[] not null default '{}',
  excludes            text[] not null default '{}',
  image               text not null,
  images              text[] not null default '{}',
  badge               text,
  featured            boolean not null default false,
  meeting_point       text,
  cancellation_policy text not null,
  has_transfer        boolean not null default false,
  trackable           boolean not null default false,
  destinos            text[] not null default '{}',
  schedule            jsonb not null default '{}',   -- {frequency, days, departureStart, departureEnd, returnTime, notes}
  prices              jsonb not null default '[]',   -- [{label, ageMin, ageMax, priceMin, priceMax, isFree, notes, category}]
  itinerary           jsonb not null default '[]',    -- [{time, title, description, image}]
  languages           text[] not null default '{}',
  accessibility       text[] not null default '{}',
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index tours_operator_id_idx on tours(operator_id);
create index tours_category_idx on tours(category);
create index tours_is_active_idx on tours(is_active);

-- ─── BOOKINGS ───
-- Reserva sem cadastro obrigatório do turista (turista_profile_id fica nulo no fluxo guest).
create table bookings (
  id                  uuid primary key default gen_random_uuid(),
  tour_id             uuid not null references tours(id) on delete restrict,
  turista_profile_id  uuid references profiles(id) on delete set null,
  tour_date           date not null,
  adults              int not null default 1,
  children            int not null default 0,
  total_price         numeric(10,2) not null,
  tourist_name        text not null,
  tourist_email       text not null,
  tourist_whatsapp    text not null,
  payment_status      text not null default 'pending' check (payment_status in ('pending', 'paid', 'cancelled')),
  mercadopago_id      text,
  notes               text,
  created_at          timestamptz not null default now()
);

create index bookings_tour_id_idx on bookings(tour_id);
create index bookings_payment_status_idx on bookings(payment_status);

-- ─────────────────────────────────────────────────────────
-- RLS — Row Level Security
-- Automatic RLS já deixa tudo travado por padrão. Só abrimos o
-- estritamente necessário pro catálogo público funcionar no navegador
-- com a anon key. Toda escrita (criar passeio, criar reserva, editar
-- operador) passa por rota de servidor com service_role — não direto
-- do navegador — então não precisamos de policy de INSERT/UPDATE aqui.
-- ─────────────────────────────────────────────────────────

alter table profiles  enable row level security;
alter table operators enable row level security;
alter table tours     enable row level security;
alter table bookings  enable row level security;

-- profiles: cada um vê e edita só o próprio perfil
create policy "profiles: usuário vê o próprio perfil"
  on profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "profiles: usuário edita o próprio perfil"
  on profiles for update
  to authenticated
  using (auth.uid() = id);

-- operators: dados públicos (nome, bio, whatsapp aparecem na página do passeio)
create policy "operators: leitura pública"
  on operators for select
  to anon, authenticated
  using (true);

-- tours: só passeios ativos ficam visíveis pro catálogo público
create policy "tours: leitura pública dos ativos"
  on tours for select
  to anon, authenticated
  using (is_active = true);

-- bookings: sem policy de leitura pública — só service_role (rotas de servidor) acessa.
-- Isso é intencional: dado de reserva (nome, e-mail, whatsapp do turista) nunca
-- deve ser lido direto do navegador, nem pelo próprio operador sem passar pela rota.
