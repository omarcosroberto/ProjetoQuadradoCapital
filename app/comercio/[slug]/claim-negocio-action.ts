"use server";

import { createServerSupabase } from "@/lib/supabase-server";
import { moderarTexto } from "@/lib/moderation";

export type ClaimState = {
  ok: boolean;
  error?: string;
};

/**
 * Reivindicação de propriedade por usuário LOGADO. Grava em
 * public.qc_reivindicacoes com status 'pendente'. RLS garante
 * auth.uid() = user_id. A unique(user_id, comercio_slug) evita duplicatas.
 */
export async function reivindicarNegocio(
  _prev: ClaimState,
  formData: FormData,
): Promise<ClaimState> {
  const slug = String(formData.get("slug") ?? "").trim();
  const mensagem = String(formData.get("mensagem") ?? "").trim().slice(0, 500);

  if (!slug) return { ok: false, error: "Comércio inválido." };

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      error: "Você precisa estar logado para reivindicar este negócio.",
    };
  }

  if (mensagem) {
    const mod = await moderarTexto(mensagem);
    if (!mod.aprovado) {
      return { ok: false, error: mod.motivo ?? "Mensagem inadequada." };
    }
  }

  const { error } = await supabase.from("qc_reivindicacoes").insert({
    user_id: user.id,
    comercio_slug: slug,
    mensagem: mensagem || null,
  });

  if (error) {
    // 23505 = unique_violation (já existe reivindicação deste usuário p/ o slug)
    if (error.code === "23505") {
      return {
        ok: false,
        error: "Você já enviou uma reivindicação para este comércio.",
      };
    }
    console.error("[QC] Falha ao reivindicar negócio:", error);
    return {
      ok: false,
      error: "Não foi possível enviar agora. Tente de novo em instantes.",
    };
  }

  return { ok: true };
}
