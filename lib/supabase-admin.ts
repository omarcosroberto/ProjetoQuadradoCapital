import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase com service_role — bypassa RLS. NUNCA importar em código
 * que rode no browser. Uso exclusivo: server actions que inserem leads na
 * tabela `reivindicacoes` (que não é publicamente gravável).
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
