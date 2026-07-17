import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Client privilegiado — usa a service_role, ignora RLS.
 * NUNCA importar em código que roda no navegador (o import "server-only" quebra o build se isso acontecer).
 * Reservado pra escrita (reservas, painel do operador) e leituras que exigem ver dado não-público.
 *
 * Criado sob demanda (Proxy) em vez de no topo do módulo: a SUPABASE_SERVICE_ROLE_KEY
 * só existe em runtime no Coolify, não em build-time — instanciar o client no import
 * quebra o `npm run build` (Nixpacks avalia o módulo ao coletar dados de rotas como /operador).
 */
let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );
  }
  return client;
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver);
  },
});
