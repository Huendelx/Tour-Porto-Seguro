import "server-only";
import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface CurrentProfile {
  id: string;
  email: string | undefined;
  role: "turista" | "operador" | "admin";
  fullName: string | null;
}

/**
 * Quem está logado agora (Server Component/Route Handler) — null se ninguém.
 * `cache()` deduplica dentro da mesma requisição: layout + page chamando isso
 * (ou o painel do operador chamando de novo via requireOperadorProfile) vira
 * 1 round-trip real ao Supabase em vez de N — sem isso, cada navegação no
 * painel disparava vários `auth.getUser()`/`profiles` sequenciais e ficava lento.
 */
export const getCurrentProfile = cache(async (): Promise<CurrentProfile | null> => {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email,
    role: (profile?.role as CurrentProfile["role"]) ?? "turista",
    fullName: profile?.full_name ?? null,
  };
});
