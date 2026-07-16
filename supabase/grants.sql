-- ─────────────────────────────────────────────────────────
-- Passeador — Grants (rodar depois do schema.sql)
-- Necessário porque "Automatically expose new tables" está desligado —
-- o Postgres nega acesso à tabela antes mesmo de a RLS entrar em ação.
-- ─────────────────────────────────────────────────────────

grant usage on schema public to anon, authenticated, service_role;

-- service_role: acesso completo (rotas de servidor fazem tudo por aqui)
grant select, insert, update, delete on profiles, operators, tours, bookings
  to service_role;

-- anon / authenticated: só o que a RLS já permite (leitura pública do catálogo)
grant select on operators, tours to anon, authenticated;
grant select on profiles to authenticated;
grant update on profiles to authenticated;
