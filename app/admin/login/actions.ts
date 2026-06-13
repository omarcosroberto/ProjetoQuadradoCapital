"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type LoginState = { error?: string };

const SETE_DIAS = 86400 * 7;

export async function loginAdmin(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const senha = String(formData.get("senha") ?? "");
  const esperada = process.env.QC_ADMIN_PASS;

  if (!esperada) {
    return { error: "QC_ADMIN_PASS não configurada no servidor." };
  }
  if (senha !== esperada) {
    return { error: "Senha incorreta" };
  }

  const cookieStore = await cookies();
  cookieStore.set("qc_admin", senha, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SETE_DIAS,
  });

  redirect("/admin");
}
