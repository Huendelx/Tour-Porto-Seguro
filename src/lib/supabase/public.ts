import { createClient } from "@supabase/supabase-js";

/**
 * Client público — usa a anon key, respeita RLS.
 * Só enxerga o que qualquer visitante do site pode ver (passeios ativos, operadores).
 * Usar em qualquer leitura que espelha o que aparece no site pro público.
 */
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
);
