import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

const OTP_TTL_MIN = 10;
const MAX_OTP_PER_HOUR = 5;

export async function POST(_req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Rate-limit: no máximo MAX_OTP_PER_HOUR por hora por user
  const { count } = await admin
    .from("qc_otp_celular")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", new Date(Date.now() - 60 * 60 * 1000).toISOString());

  if ((count ?? 0) >= MAX_OTP_PER_HOUR) {
    return NextResponse.json(
      { error: "rate_limit", message: "Muitas tentativas. Tente novamente em 1 hora." },
      { status: 429 },
    );
  }

  // Verificar se celular está cadastrado
  const { data: perfil } = await admin
    .from("qc_perfis")
    .select("celular,celular_verificado")
    .eq("id", user.id)
    .maybeSingle();

  if (!perfil?.celular) {
    return NextResponse.json(
      { error: "no_celular", message: "Nenhum celular cadastrado." },
      { status: 400 },
    );
  }

  if (perfil.celular_verificado) {
    return NextResponse.json(
      { error: "already_verified", message: "Celular já verificado." },
      { status: 400 },
    );
  }

  // Gerar código de 6 dígitos
  const codigo = String(Math.floor(100000 + Math.random() * 900000));
  const expira_em = new Date(Date.now() + OTP_TTL_MIN * 60 * 1000).toISOString();

  await admin.from("qc_otp_celular").insert({
    user_id: user.id,
    codigo,
    expira_em,
  });

  // Formatar celular para exibição no email
  const digits = perfil.celular.replace(/\D/g, "");
  const celularFormatado =
    digits.length === 11
      ? `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
      : digits;

  // Enviar OTP via email (Resend)
  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <p style="font-size:14px;color:#555">
        Você solicitou a verificação do celular <strong>${celularFormatado}</strong>
        no Quadrado Capital.
      </p>
      <p style="margin:24px 0">
        <span style="display:inline-block;background:#1e3a2f;color:#fff;
          font-size:28px;font-weight:700;letter-spacing:8px;
          padding:14px 24px;border-radius:10px">
          ${codigo}
        </span>
      </p>
      <p style="font-size:13px;color:#888">
        O código expira em ${OTP_TTL_MIN} minutos.
        Se não foi você, ignore este e-mail.
      </p>
    </div>
  `;

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Quadrado Capital <noreply@quadradocapital.com.br>",
      to: [user.email!],
      subject: `${codigo} é seu código de verificação — Quadrado Capital`,
      html,
    }),
  });

  if (!resendRes.ok) {
    console.error("[otp/enviar] Resend error:", await resendRes.text());
    return NextResponse.json(
      { error: "email_failed", message: "Não foi possível enviar o código. Tente novamente." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, email: user.email });
}
