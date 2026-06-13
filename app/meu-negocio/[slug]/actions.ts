"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { moderarTexto } from "@/lib/moderation";

export type EditState = {
  ok: boolean;
  error?: string;
};

/**
 * Edição de dados do comércio pelo dono (reivindicação aprovada).
 * A tabela comercios não tem policy de escrita pública, então usamos o
 * service-role client — mas SÓ depois de confirmar, com a sessão do usuário,
 * que ele tem uma reivindicação 'aprovada' para este slug.
 */
export async function salvarNegocio(
  _prev: EditState,
  formData: FormData,
): Promise<EditState> {
  const slug = String(formData.get("slug") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "")
    .trim()
    .slice(0, 1000);
  const website = String(formData.get("website") ?? "").trim().slice(0, 300);
  const telefone = String(formData.get("telefone") ?? "").trim().slice(0, 40);

  if (!slug) return { ok: false, error: "Comércio inválido." };

  // Autorização: usuário logado com reivindicação aprovada para o slug.
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sessão expirada. Entre de novo." };

  const { data: claim } = await supabase
    .from("qc_reivindicacoes")
    .select("status")
    .eq("user_id", user.id)
    .eq("comercio_slug", slug)
    .maybeSingle();

  if (claim?.status !== "aprovada") {
    return { ok: false, error: "Você não tem permissão para editar este negócio." };
  }

  if (descricao) {
    const mod = await moderarTexto(descricao);
    if (!mod.aprovado) {
      return { ok: false, error: mod.motivo ?? "Descrição inadequada." };
    }
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("comercios")
    .update({
      descricao: descricao || null,
      website: website || null,
      telefone: telefone || null,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug);

  if (error) {
    console.error("[QC] Falha ao salvar negócio:", error);
    return { ok: false, error: "Não foi possível salvar. Tente de novo." };
  }

  revalidatePath(`/meu-negocio/${slug}`);
  revalidatePath(`/comercio/${slug}`);
  return { ok: true };
}
