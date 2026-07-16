-- ─────────────────────────────────────────────────────────
-- Passeador — Fase 2: cria profiles automaticamente no signup
-- Rodar uma vez no Supabase Dashboard → SQL Editor → Run
-- ─────────────────────────────────────────────────────────

-- Lê "intended_role" que o login manda (turista/operador) na hora do
-- magic link e já grava o perfil com o papel certo — sem isso todo
-- mundo nasceria como 'turista' e teríamos que promover manualmente.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'intended_role', 'turista'),
    new.raw_user_meta_data->>'full_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
