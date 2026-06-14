import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  let codigo: string;
  try {
    const body = await req.json();
    codigo = String(body?.codigo ?? "").trim();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!/^\d{6}$/.test(codigo)) {
    return NextResponse.json(
      { error: "invalid_code", message: "Código inválido." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  // Buscar OTP mais recente não-usado e não-expirado
  const { data: otp } = await admin
    .from("qc_otp_celular")
    .select("id,codigo,expira_em,usado")
    .eq("user_id", user.id)
    .eq("codigo", codigo)
    .eq("usado", false)
    .gte("expira_em", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!otp) {
    return NextResponse.json(
      { error: "wrong_code", message: "Código incorreto ou expirado." },
      { status: 400 },
    );
  }

  // Marcar como usado e verificar celular em paralelo
  await Promise.all([
    admin.from("qc_otp_celular").update({ usado: true }).eq("id", otp.id),
    admin
      .from("qc_perfis")
      .update({ celular_verificado: true })
      .eq("id", user.id),
  ]);

  return NextResponse.json({ ok: true });
}
