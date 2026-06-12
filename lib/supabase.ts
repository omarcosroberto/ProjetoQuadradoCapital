import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase read-only para o diretório público.
 * Sem sessão/cookies: o QC não tem login. Usa a anon key e o RLS
 * "comercios_public_read" garante que só comércios ativos são lidos.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
