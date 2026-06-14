"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { moderarTexto, moderarImagem } from "@/lib/moderation";

export type EditState = {
  ok: boolean;
  error?: string;
};

const DIAS = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
] as const;

/** Autoriza: usuário logado com reivindicação aprovada para o slug. */
async function autorizarDono(slug: string) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, supabase };

  const { data: claim } = await supabase
    .from("qc_reivindicacoes")
    .select("status")
    .eq("user_id", user.id)
    .eq("comercio_slug", slug)
    .maybeSingle();

  if (claim?.status !== "aprovada") return { user: null, supabase };
  return { user, supabase };
}

/**
 * Edição de dados do comércio pelo dono.
 * Campos: descricao, website, telefone, whatsapp, instagram, horário (7 dias).
 */
export async function salvarNegocio(
  _prev: EditState,
  formData: FormData,
): Promise<EditState> {
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) return { ok: false, error: "Comércio inválido." };

  const { user } = await autorizarDono(slug);
  if (!user) return { ok: false, error: "Sessão expirada ou sem permissão." };

  const descricao = String(formData.get("descricao") ?? "").trim().slice(0, 1000);
  const website = String(formData.get("website") ?? "").trim().slice(0, 300);
  const telefone = String(formData.get("telefone") ?? "").trim().slice(0, 40);
  const whatsapp = String(formData.get("whatsapp") ?? "").trim().slice(0, 20);
  const instagram = String(formData.get("instagram") ?? "").trim().slice(0, 100);

  // Horário: 7 pares abre/fecha (0=domingo … 6=sábado).
  const linhas: string[] = [];
  let temHorario = false;
  for (let i = 0; i < 7; i++) {
    const fechado = formData.get(`h_${i}_fechado`) === "1";
    const abre = String(formData.get(`h_${i}_abre`) ?? "").trim();
    const fecha = String(formData.get(`h_${i}_fecha`) ?? "").trim();
    if (fechado || abre || fecha) temHorario = true;
    if (fechado || (!abre && !fecha)) {
      linhas.push(`${DIAS[i]}: Fechado`);
    } else {
      linhas.push(`${DIAS[i]}: ${abre} – ${fecha}`);
    }
  }

  if (descricao) {
    const mod = await moderarTexto(descricao);
    if (!mod.aprovado) return { ok: false, error: mod.motivo ?? "Descrição inadequada." };
  }

  const updates: Record<string, unknown> = {
    descricao: descricao || null,
    website: website || null,
    telefone: telefone || null,
    whatsapp: whatsapp || null,
    instagram: instagram || null,
    updated_at: new Date().toISOString(),
  };
  if (temHorario) updates.horario_funcionamento = linhas;

  const admin = createAdminClient();
  const { error } = await admin.from("comercios").update(updates).eq("slug", slug);

  if (error) {
    console.error("[QC] Falha ao salvar negócio:", error);
    return { ok: false, error: "Não foi possível salvar. Tente de novo." };
  }

  revalidatePath(`/meu-negocio/${slug}`);
  revalidatePath(`/comercio/${slug}`);
  return { ok: true };
}

/** Upload de foto de capa do comércio. */
export async function uploadFotoComercio(
  _prev: EditState,
  formData: FormData,
): Promise<EditState> {
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) return { ok: false, error: "Comércio inválido." };

  const { user } = await autorizarDono(slug);
  if (!user) return { ok: false, error: "Sessão expirada ou sem permissão." };

  const file = formData.get("foto") as File | null;
  if (!file || file.size === 0) return { ok: false, error: "Nenhuma imagem selecionada." };
  if (!file.type.startsWith("image/")) return { ok: false, error: "Somente imagens são aceitas." };
  if (file.size > 5 * 1024 * 1024) return { ok: false, error: "Imagem deve ter no máximo 5 MB." };

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `fotos/${slug}/capa.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const admin = createAdminClient();
  const { error: uploadError } = await admin.storage
    .from("qc-comercios")
    .upload(path, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    console.error("[QC] Falha no upload de foto:", uploadError);
    return { ok: false, error: "Falha ao enviar a imagem. Tente de novo." };
  }

  const { data: urlData } = admin.storage.from("qc-comercios").getPublicUrl(path);
  const publicUrl = urlData.publicUrl;

  // Moderação de imagem (SafeSearch).
  const mod = await moderarImagem(publicUrl);
  if (!mod.aprovado) {
    await admin.storage.from("qc-comercios").remove([path]);
    return { ok: false, error: mod.motivo ?? "Imagem inadequada." };
  }

  const { error: updateError } = await admin
    .from("comercios")
    .update({ foto_url: publicUrl, updated_at: new Date().toISOString() })
    .eq("slug", slug);

  if (updateError) {
    console.error("[QC] Falha ao atualizar foto_url:", updateError);
    return { ok: false, error: "Imagem enviada mas não foi possível salvar. Contate o suporte." };
  }

  revalidatePath(`/meu-negocio/${slug}`);
  revalidatePath(`/comercio/${slug}`);
  return { ok: true };
}

/** Salva ou atualiza resposta do dono a uma avaliação. */
export async function salvarResposta(
  _prev: EditState,
  formData: FormData,
): Promise<EditState> {
  const slug = String(formData.get("slug") ?? "").trim();
  const avaliacaoId = String(formData.get("avaliacao_id") ?? "").trim();
  const texto = String(formData.get("texto") ?? "").trim().slice(0, 500);

  if (!slug || !avaliacaoId) return { ok: false, error: "Dados inválidos." };
  if (!texto) return { ok: false, error: "A resposta não pode estar vazia." };

  const { user } = await autorizarDono(slug);
  if (!user) return { ok: false, error: "Sessão expirada ou sem permissão." };

  const mod = await moderarTexto(texto);
  if (!mod.aprovado) return { ok: false, error: mod.motivo ?? "Texto inadequado." };

  const admin = createAdminClient();
  const { error } = await admin.from("qc_respostas_avaliacao").upsert(
    {
      avaliacao_id: avaliacaoId,
      dono_id: user.id,
      texto,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "avaliacao_id" },
  );

  if (error) {
    console.error("[QC] Falha ao salvar resposta:", error);
    return { ok: false, error: "Não foi possível salvar. Tente de novo." };
  }

  revalidatePath(`/meu-negocio/${slug}`);
  revalidatePath(`/comercio/${slug}`);
  return { ok: true };
}
