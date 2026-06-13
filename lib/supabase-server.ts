import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Cliente Supabase server-side com sessão via cookies (@supabase/ssr).
 * Usado em Server Components/Server Functions que precisam saber QUEM é o
 * usuário logado (ex: /conta). Os cookies de sessão são httpOnly por padrão.
 *
 * Em Server Components a escrita de cookies não é permitida — por isso o
 * setAll é envolvido em try/catch (o refresh de token roda no middleware /
 * route handlers, que aqui não temos; a leitura continua funcionando).
 */
export async function createServerSupabase() {
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
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Chamado de um Server Component — ignorar (sem refresh aqui).
          }
        },
      },
    },
  );
}
