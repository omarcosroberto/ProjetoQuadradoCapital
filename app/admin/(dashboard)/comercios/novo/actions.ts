"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase-admin";
import { CATEGORIAS } from "@/lib/data";

export type CriarState = { error?: string };

const PRESENCAS = new Set(["forte", "fraca", "ausente", "desconhecida"]);

function str(formData: FormData, k: string) {
  return String(formData.get(k) ?? "").trim();
}

export async function criarComercio(
  _prev: CriarState,
  formData: FormData,
): Promise<CriarState> {
  const nome = str(formData, "nome");
  const categoria = str(formData, "categoria");
  const asaRaw = str(formData, "asa");
  const quadra = Number(str(formData, "quadra"));
  const bloco = str(formData, "bloco").toUpperCase();
  const capivaras = Number(str(formData, "capivaras"));
  const avaliacoes = Number(str(formData, "avaliacoes") || "0");
  const presenca = str(formData, "presenca_google") || "desconhecida";
  const ativo = formData.get("ativo") != null;

  // Validação
  if (!nome) return { error: "Informe o nome do comércio." };
  if (!CATEGORIAS.includes(categoria))
    return { error: "Selecione uma categoria válida." };
  if (asaRaw !== "Sul" && asaRaw !== "Norte")
    return { error: "Selecione a asa (Sul ou Norte)." };
  if (!Number.isInteger(quadra) || quadra <= 0)
    return { error: "Informe um número de quadra válido." };
  if (Number.isNaN(capivaras) || capivaras < 0 || capivaras > 5)
    return { error: "Capivaras deve estar entre 0 e 5." };
  if (!PRESENCAS.has(presenca))
    return { error: "Presença no Google inválida." };

  const slug = `${quadra}${asaRaw === "Sul" ? "s" : "n"}${bloco ? `-${bloco.toLowerCase()}` : ""}`;

  const supabase = createAdminClient();
  const { error } = await supabase.from("comercios").insert({
    slug,
    nome,
    categoria,
    asa: asaRaw,
    quadra,
    bloco: bloco || null,
    capivaras,
    avaliacoes: Number.isNaN(avaliacoes) ? 0 : avaliacoes,
    whatsapp: str(formData, "whatsapp") || null,
    telefone: str(formData, "telefone") || null,
    instagram: str(formData, "instagram") || null,
    site: str(formData, "site") || null,
    endereco: str(formData, "endereco") || null,
    presenca_google: presenca,
    ativo,
  });

  if (error) {
    console.error("[QC admin] Falha ao criar comércio:", error);
    return {
      error:
        error.code === "23505"
          ? `Já existe um comércio com o slug "${slug}".`
          : "Não foi possível salvar. Tente novamente.",
    };
  }

  revalidatePath("/admin");
  redirect("/admin");
}
