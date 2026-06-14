import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { LogoQC } from "@/components/logo-qc";
import { Footer } from "@/components/footer";
import { createServerSupabase } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { EditForm } from "./edit-form";
import { FotoForm } from "./foto-form";
import { RespostaForm } from "./resposta-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Meu negócio — Quadrado Capital",
  robots: { index: false, follow: false },
};

type ComercioRow = {
  nome: string;
  categoria: string;
  capivaras: number | string | null;
  avaliacoes: number | null;
  descricao: string | null;
  website: string | null;
  telefone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  foto_url: string | null;
  horario_funcionamento: string[] | null;
};

type AvaliacaoRow = {
  id: string;
  nota: number;
  comentario: string | null;
  created_at: string;
  via_qr: boolean;
};

type RespostaRow = {
  avaliacao_id: string;
  texto: string;
};

function estrelas(n: number): string {
  return "🦫".repeat(Math.round(n));
}

function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function MeuNegocioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/entrar");

  const { data: claim } = await supabase
    .from("qc_reivindicacoes")
    .select("status")
    .eq("user_id", user.id)
    .eq("comercio_slug", slug)
    .maybeSingle();

  if (claim?.status !== "aprovada") {
    return (
      <div className="flex min-h-dvh flex-col bg-ar">
        <header className="bg-concreto px-6 py-4">
          <div className="mx-auto flex max-w-[1100px] items-center justify-between">
            <LogoQC variant="light" />
            <Link href="/" className="text-sm text-branco/70 transition-colors hover:text-verde-suave">
              ← Voltar à busca
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[700px] flex-1 px-6 py-16">
          <div className="rounded-2xl border border-linha bg-branco p-8 text-center">
            <h1 className="qc-display text-2xl text-concreto">Acesso restrito</h1>
            <p className="mt-2 text-sm text-concreto-claro">
              Você ainda não tem uma reivindicação aprovada para este negócio.
            </p>
            <Link
              href={`/comercio/${slug}`}
              className="mt-5 inline-block rounded-lg bg-verde px-4 py-2 text-sm font-semibold text-branco transition-colors hover:bg-verde-escuro"
            >
              Ver o comércio
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const admin = createAdminClient();
  const [{ data: comercio }, { data: avals }] = await Promise.all([
    admin
      .from("comercios")
      .select("nome,categoria,capivaras,avaliacoes,descricao,website,telefone,whatsapp,instagram,foto_url,horario_funcionamento")
      .eq("slug", slug)
      .maybeSingle(),
    admin
      .from("qc_avaliacoes")
      .select("id,nota,comentario,created_at,via_qr")
      .eq("comercio_slug", slug)
      .order("created_at", { ascending: false }),
  ]);

  if (!comercio) redirect("/");

  const c = comercio as ComercioRow;
  const avaliacoes = (avals ?? []) as AvaliacaoRow[];
  const total = avaliacoes.length;
  const media =
    total > 0
      ? (avaliacoes.reduce((s, a) => s + a.nota, 0) / total).toFixed(1)
      : Number(c.capivaras ?? 0).toFixed(1);
  const ultima = avaliacoes[0]
    ? formatarData(avaliacoes[0].created_at)
    : "—";

  // Busca respostas com os IDs das avaliações encontradas.
  const avaliacaoIds = avaliacoes.map((a) => a.id);
  let respostasMap = new Map<string, string>();
  if (avaliacaoIds.length > 0) {
    const { data: resps } = await admin
      .from("qc_respostas_avaliacao")
      .select("avaliacao_id,texto")
      .in("avaliacao_id", avaliacaoIds);
    respostasMap = new Map((resps ?? []).map((r: RespostaRow) => [r.avaliacao_id, r.texto]));
  }

  return (
    <div className="flex min-h-dvh flex-col bg-ar">
      <header className="bg-concreto px-6 py-4">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between">
          <LogoQC variant="light" />
          <Link href="/" className="text-sm text-branco/70 transition-colors hover:text-verde-suave">
            ← Voltar à busca
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1100px] flex-1 px-6 py-10">
        <div className="qc-rise">
          <p className="text-xs font-semibold uppercase tracking-wide text-verde">Painel do dono</p>
          <h1 className="mt-1 qc-display text-2xl text-concreto sm:text-3xl">{c.nome}</h1>
          <p className="mt-1 text-sm text-concreto-claro">{c.categoria}</p>
        </div>

        {/* stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-linha bg-branco p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-concreto-claro">Avaliações</p>
            <p className="mt-1 qc-display text-2xl text-concreto">{total}</p>
          </div>
          <div className="rounded-2xl border border-linha bg-branco p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-concreto-claro">Média (capivaras)</p>
            <p className="mt-1 qc-display text-2xl text-concreto">{media} 🦫</p>
          </div>
          <div className="rounded-2xl border border-linha bg-branco p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-concreto-claro">Última avaliação</p>
            <p className="mt-1 qc-display text-2xl text-concreto">{ultima}</p>
          </div>
        </div>

        {/* Foto de capa */}
        <section className="mt-8 rounded-2xl border border-linha bg-branco p-6 sm:p-8">
          <h2 className="qc-display text-xl text-concreto">Foto de capa</h2>
          <p className="mt-1 text-sm text-concreto-claro">
            Uma boa foto aumenta os cliques no seu comércio. Ela aparece no card da busca e na página pública.
          </p>
          <div className="mt-5">
            <FotoForm slug={slug} fotoAtual={c.foto_url} />
          </div>
        </section>

        {/* edição */}
        <section className="mt-8 rounded-2xl border border-linha bg-branco p-6 sm:p-8">
          <h2 className="qc-display text-xl text-concreto">Informações do negócio</h2>
          <p className="mt-1 text-sm text-concreto-claro">
            Corrija ou complete o que o Google não tem. As mudanças aparecem na página pública.
          </p>
          <div className="mt-5">
            <EditForm
              slug={slug}
              descricao={c.descricao ?? ""}
              website={c.website ?? ""}
              telefone={c.telefone ?? ""}
              whatsapp={c.whatsapp ?? ""}
              instagram={c.instagram ?? ""}
              horario={Array.isArray(c.horario_funcionamento) ? c.horario_funcionamento : null}
            />
          </div>
        </section>

        {/* Avaliações + respostas */}
        <section className="mt-8 rounded-2xl border border-linha bg-branco p-6 sm:p-8">
          <h2 className="qc-display text-xl text-concreto">Avaliações recebidas</h2>
          <p className="mt-1 text-sm text-concreto-claro">
            Responda publicamente. Sua resposta aparece abaixo da avaliação na página do comércio.
          </p>
          {avaliacoes.length === 0 ? (
            <p className="mt-6 text-sm text-concreto-claro text-center py-8">
              Nenhuma avaliação ainda. Compartilhe o QR code com seus clientes!
            </p>
          ) : (
            <ul className="mt-5 grid gap-4">
              {avaliacoes.map((a) => (
                <li key={a.id} className="rounded-xl border border-linha p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-base leading-none">{estrelas(a.nota)}</span>
                      <span className="ml-2 text-xs text-concreto-claro">
                        {formatarData(a.created_at)}
                        {a.via_qr && (
                          <span className="ml-2 rounded-full bg-verde/10 px-2 py-0.5 text-[10px] font-semibold text-verde">
                            QR verificado
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  {a.comentario && (
                    <p className="mt-2 text-sm text-concreto">{a.comentario}</p>
                  )}
                  {respostasMap.has(a.id) && (
                    <div className="mt-3 rounded-lg bg-verde/5 border border-verde/20 px-3 py-2">
                      <p className="text-xs font-semibold text-verde">Sua resposta</p>
                      <p className="mt-1 text-sm text-concreto">{respostasMap.get(a.id)}</p>
                    </div>
                  )}
                  <RespostaForm
                    slug={slug}
                    avaliacaoId={a.id}
                    respostaAtual={respostasMap.get(a.id) ?? null}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* QR code */}
        <section className="mt-8 rounded-2xl border border-verde/30 bg-verde/5 p-6 sm:p-8">
          <p className="qc-brand text-sm text-verde">Avaliações verificadas</p>
          <h2 className="mt-1 qc-display text-xl text-concreto">QR Code para clientes</h2>
          <p className="mt-2 text-sm text-concreto-claro">
            Imprima ou exiba no seu estabelecimento. Avaliações feitas por ele valem{" "}
            <strong className="text-concreto">10× mais</strong> na sua nota.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(`https://quadradocapital.com.br/qr/${slug}`)}&size=180x180&format=png&margin=8&color=1c2823&bgcolor=ffffff`}
            alt={`QR code para avaliar ${slug}`}
            width={180}
            height={180}
            className="mt-4 rounded-xl border border-linha bg-branco p-2"
          />
          <p className="mt-3 text-xs font-mono text-concreto-claro break-all">
            quadradocapital.com.br/qr/{slug}
          </p>
        </section>

        {/* oferta GMN */}
        <div className="mt-8 rounded-2xl border-2 border-verde/30 bg-verde/5 p-6">
          <div className="flex items-start gap-4">
            <span className="text-3xl">🚀</span>
            <div>
              <h3 className="qc-display text-lg text-concreto">Seu negócio merece mais visibilidade</h3>
              <p className="mt-1 text-sm text-concreto-claro">
                O <strong>GMN — Gestão de Marketing de Negócio</strong> é um serviço especializado
                para negócios locais de Brasília. Presença digital completa, gestão de avaliações
                e estratégia local — tudo feito por especialistas.
              </p>
              <ul className="mt-3 space-y-1 text-sm text-concreto-claro">
                <li>✅ Perfil otimizado no Google Meu Negócio</li>
                <li>✅ Gestão de avaliações e respostas</li>
                <li>✅ Estratégia de presença local em Brasília</li>
                <li>✅ Relatório mensal de performance</li>
              </ul>
              <a
                href="https://marcosroberto.pro/gmn"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-verde px-4 py-2.5 text-sm font-semibold text-branco transition-colors hover:bg-verde-escuro"
              >
                Quero saber mais sobre o GMN →
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
