import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Client de servidor com sessão (lê/escreve cookies de auth).
 * Usar em Server Components e Route Handlers pra saber quem está logado.
 * Ainda respeita RLS — não confundir com o admin.ts (service_role).
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // chamado de dentro de um Server Component sem permissão de escrita —
            // o middleware já cuida de renovar a sessão nesse caso.
          }
        },
      },
    }
  );
}
