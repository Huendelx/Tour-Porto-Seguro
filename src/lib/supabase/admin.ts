import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Client privilegiado — usa a service_role, ignora RLS.
 * NUNCA importar em código que roda no navegador (o import "server-only" quebra o build se isso acontecer).
 * Reservado pra escrita (reservas, painel do operador) e leituras que exigem ver dado não-público.
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);
