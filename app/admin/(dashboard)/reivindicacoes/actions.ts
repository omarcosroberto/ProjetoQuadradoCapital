"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase-admin";

async function assertAdmin(): Promise<void> {
  const cookieStore = await cookies();
  const authed =
    !!process.env.QC_ADMIN_PASS &&
    cookieStore.get("qc_admin")?.value === process.env.QC_ADMIN_PASS;
  if (!authed) throw new Error("Não autorizado.");
}

async function atualizarStatus(
  formData: FormData,
  status: "aprovada" | "rejeitada",
): Promise<void> {
  await assertAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const supabase = createAdminClient();

  // Busca o user_id e slug antes de atualizar para poder setar dono no comércio.
  const { data: claim } = await supabase
    .from("qc_reivindicacoes")
    .select("user_id,comercio_slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("qc_reivindicacoes")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("[QC admin] Falha ao atualizar reivindicação:", error);
    throw new Error("Não foi possível atualizar a reivindicação.");
  }

  // Ao aprovar, marca o comércio como reivindicado e registra o dono.
  if (status === "aprovada" && claim?.user_id && claim?.comercio_slug) {
    await supabase
      .from("comercios")
      .update({ reivindicado: true, dono_id: claim.user_id })
      .eq("slug", claim.comercio_slug);
  }

  revalidatePath("/admin/reivindicacoes");
}

export async function aprovarReivindicacao(formData: FormData): Promise<void> {
  await atualizarStatus(formData, "aprovada");
}

export async function rejeitarReivindicacao(formData: FormData): Promise<void> {
  await atualizarStatus(formData, "rejeitada");
}
