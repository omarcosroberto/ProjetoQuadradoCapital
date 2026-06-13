import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase read-only para o diretório público.
 * Sem sessão/cookies: usa a anon key e o RLS "comercios_public_read"
 * garante que só comércios ativos são lidos.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}

/**
 * Cliente Supabase para uso no browser (componentes "use client").
 * Persiste a sessão em cookies via @supabase/ssr — necessário para login,
 * cadastro e avaliações dos membros.
 */
export function createAuthClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
