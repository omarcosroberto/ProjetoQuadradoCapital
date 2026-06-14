import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

/**
 * POST /api/webhooks/nova-avaliacao
 *
 * Recebe INSERT webhook do Supabase (Database Webhooks) quando uma nova
 * avaliação é publicada em qc_avaliacoes.
 *
 * Configurar no Dashboard Supabase:
 *   Database > Webhooks > Create new webhook
 *   - Name: nova-avaliacao
 *   - Table: qc_avaliacoes  |  Event: INSERT
 *   - URL: https://quadradocapital.com.br/api/webhooks/nova-avaliacao
 *   - HTTP Headers: x-webhook-secret = <valor de QC_WEBHOOK_SECRET>
 *
 * Variáveis de ambiente necessárias (Vercel + .env.local):
 *   QC_WEBHOOK_SECRET  — segredo compartilhado com o Supabase webhook
 *   RESEND_API_KEY     — chave da API do Resend para envio de email
 */
export async function POST(req: NextRequest) {
  // 1. Validar o secret header
  const secret = req.headers.get("x-webhook-secret");
  if (!secret || secret !== process.env.QC_WEBHOOK_SECRET) {
    // Retorna 200 mesmo em auth error — webhook deve ser idempotente
    return NextResponse.json({ error: "unauthorized" }, { status: 200 });
  }

  let body: {
    type?: string;
    record?: {
      comercio_slug?: string;
      nota?: number;
      comentario?: string;
    };
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 200 });
  }

  const record = body?.record;
  if (!record?.comercio_slug) {
    return NextResponse.json({ error: "missing_slug" }, { status: 200 });
  }

  const { comercio_slug, nota, comentario } = record;

  try {
    const supabase = createAdminClient();

    // 2. Buscar dono com reivindicação aprovada
    const { data: reivindicacao } = await supabase
      .from("qc_reivindicacoes")
      .select("user_id")
      .eq("comercio_slug", comercio_slug)
      .eq("status", "aprovada")
      .maybeSingle();

    if (!reivindicacao?.user_id) {
      // Nenhum dono reivindicado — sem email para enviar
      return NextResponse.json({ ok: true, skipped: "no_owner" });
    }

    // 3. Buscar email do dono via auth.admin
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.admin.getUserById(reivindicacao.user_id);

    if (userError || !user?.email) {
      return NextResponse.json({ ok: true, skipped: "no_user_email" });
    }

    // 4. Buscar nome do comércio
    const { data: comercio } = await supabase
      .from("comercios")
      .select("nome")
      .eq("slug", comercio_slug)
      .maybeSingle();

    const nomeComercio = comercio?.nome ?? comercio_slug;

    // 5. Enviar email via Resend (REST direto — sem SDK)
    const notaStr = nota !== undefined && nota !== null ? String(nota) : "?";
    const html = [
      `<p>Você recebeu uma nova avaliação de ${notaStr} 🦫 para <strong>${nomeComercio}</strong>.</p>`,
      comentario ? `<p>"${comentario}"</p>` : "",
      `<p><a href="https://quadradocapital.com.br/meu-negocio/${comercio_slug}">Responder agora</a></p>`,
    ]
      .filter(Boolean)
      .join("\n");

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Quadrado Capital <noreply@quadradocapital.com.br>",
        to: [user.email],
        subject: `Nova avaliação no ${nomeComercio}`,
        html,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error("[nova-avaliacao webhook] Resend error:", errText);
      // Retorna 200 para não retentar infinitamente — logar e monitorar
      return NextResponse.json({ ok: true, resend_error: errText });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[nova-avaliacao webhook] unexpected error:", err);
    // Idempotente — sempre 200
    return NextResponse.json({ ok: true, error: String(err) });
  }
}
