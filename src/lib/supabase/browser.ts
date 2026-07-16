"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Client de navegador com sessão — usar em Client Components
 * (formulário de login, botão de logout, etc.)
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
