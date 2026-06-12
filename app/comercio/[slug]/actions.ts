"use server";

import { createPublicClient } from "@/lib/supabase";

export type FormState = {
  ok: boolean;
  error?: string;
};

const TIPOS = new Set(["reivindicacao", "lead_mrp"]);

export async function criarReivindicacao(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  // Honeypot: campo escondido que só bot preenche. Se veio cheio, finge sucesso
  // e não grava nada.
  if (String(formData.get("empresa_site") ?? "").trim() !== "") {
    return { ok: true };
  }

  const slug = String(formData.get("slug") ?? "").trim();
  const tipoRaw = String(formData.get("tipo") ?? "reivindicacao").trim();
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();
  const mensagem = String(formData.get("mensagem") ?? "").trim();

  const tipo = TIPOS.has(tipoRaw) ? tipoRaw : "reivindicacao";

  // Validação amigável no client-side; a RPC valida de novo (defesa em profundidade).
  if (!nome) return { ok: false, error: "Informe seu nome." };
  if (!email && !telefone)
    return { ok: false, error: "Informe um e-mail ou telefone para contato." };
  if (nome.length > 120 || mensagem.length > 1000)
    return { ok: false, error: "Texto muito longo." };

  try {
    // RPC SECURITY DEFINER: o QC usa só a anon key. A função valida o comércio,
    // usa o nome do banco e grava em reivindicacoes (que não é publicamente gravável).
    const supabase = createPublicClient();
    const { error } = await supabase.rpc("criar_reivindicacao", {
      p_slug: slug,
      p_nome: nome,
      p_email: email || null,
      p_telefone: telefone || null,
      p_mensagem: mensagem || null,
      p_tipo: tipo,
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
