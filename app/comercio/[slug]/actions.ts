"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { getComercioBySlug } from "@/lib/comercios";

export type FormState = {
  ok: boolean;
  error?: string;
};

const TIPOS = new Set(["reivindicacao", "lead_mrp"]);

export async function criarReivindicacao(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const slug = String(formData.get("slug") ?? "").trim();
  const tipoRaw = String(formData.get("tipo") ?? "reivindicacao").trim();
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();
  const mensagem = String(formData.get("mensagem") ?? "").trim();

  const tipo = TIPOS.has(tipoRaw) ? tipoRaw : "reivindicacao";

  if (!nome) return { ok: false, error: "Informe seu nome." };
  if (!email && !telefone)
    return { ok: false, error: "Informe um e-mail ou telefone para contato." };
  if (nome.length > 120 || mensagem.length > 1000)
    return { ok: false, error: "Texto muito longo." };

  const comercio = await getComercioBySlug(slug);
  if (!comercio) return { ok: false, error: "Comércio não encontrado." };

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("reivindicacoes").insert({
      comercio_slug: comercio.id,
      comercio_nome: comercio.nome,
      tipo,
      nome_contato: nome,
      email: email || null,
      telefone: telefone || null,
      mensagem: mensagem || null,
    });
    if (error) throw error;
    return { ok: true };
  } catch (err) {
    console.error("[QC] Falha ao registrar reivindicação:", err);
    return {
      ok: false,
      error: "Não foi possível enviar agora. Tente de novo em instantes.",
    };
  }
}
