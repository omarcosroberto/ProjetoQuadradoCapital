"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase-admin";

/** Deleta um comércio pelo slug. Usado pelo botão Deletar da tabela admin. */
export async function deletarComercio(formData: FormData): Promise<void> {
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) return;

  const supabase = createAdminClient();
  const { error } = await supabase.from("comercios").delete().eq("slug", slug);
  if (error) {
    console.error("[QC admin] Falha ao deletar comércio:", error);
    throw new Error("Não foi possível deletar o comércio.");
  }

  revalidatePath("/admin");
}
