import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { LogoQC } from "@/components/logo-qc";
import { Footer } from "@/components/footer";
import { createServerSupabase } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Meus negócios — Quadrado Capital",
  robots: { index: false, follow: false },
};

type ReivindicacaoRow = {
  id: string;
  comercio_slug: string;
  status: string;
  created_at: string;
};

type ComercioRow = {
  slug: string;
  nome: string;
  categoria: string;
  capivaras: number | string | null;
  avaliacoes: number | null;
};

export default async function MeusNegociosPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/entrar");

  // Check empresarial profile
  const { data: perfil } = await supabase
    .from("qc_perfis")
    .select("tipo_perfil")
    .eq("id", user.id)
    .maybeSingle();

  if (perfil?.tipo_perfil !== "empresarial") redirect("/conta");

  // All claims for this user (approved + pending)
  const { data: claims } = await supabase
    .from("qc_reivindicacoes")
    .select("id,comercio_slug,status,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const lista = (claims ?? []) as ReivindicacaoRow[];

  // Enrich with comercio names using admin client
  let comercioMap = new Map<string, ComercioRow>();
  if (lista.length > 0) {
    const slugs = [...new Set(lista.map((r) => r.comercio_slug))];
    const admin = createAdminClient();
    const { data: comercios } = await admin
      .from("comercios")
      .select("slug,nome,categoria,capivaras,avaliacoes")
      .in("slug", slugs);
    for (const c of (comercios ?? []) as ComercioRow[]) {
      comercioMap.set(c.slug, c);
    }
  }

  const aprovadas = lista.filter((r) => r.status === "aprovada");
  const pendentes = lista.filter((r) => r.status === "pendente");

  return (
    <div className="flex min-h-dvh flex-col bg-ar">
      <header className="bg-concreto px-6 py-4">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between">
          <LogoQC variant="light" />
          <Link
            href="/conta"
            className="text-sm text-branco/70 transition-colors hover:text-verde-suave"
          >
            ← Minha conta
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1100px] flex-1 px-6 py-10">
        <div className="qc-rise">
          <p className="text-xs font-semibold uppercase tracking-wide text-verde">
            Perfil Empresarial
          </p>
          <h1 className="mt-1 qc-display text-2xl text-concreto">
            Meus negócios
          </h1>
          <p className="mt-1 text-sm text-concreto-claro">
            Gerencie os comércios que você reivindicou no Quadrado Capital.
          </p>
        </div>

        {/* Negócios aprovados */}
        {aprovadas.length > 0 && (
          <section className="mt-8">
            <h2 className="qc-display text-lg text-concreto">
              Comércios ativos
            </h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {aprovadas.map((r) => {
                const c = comercioMap.get(r.comercio_slug);
                return (
                  <li key={r.id}>
                    <Link
                      href={`/meu-negocio/${r.comercio_slug}`}
                      className="block rounded-2xl border border-verde/30 bg-branco p-5 transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="qc-display text-base text-concreto truncate">
                            {c?.nome ?? r.comercio_slug}
                          </p>
                          {c?.categoria && (
                            <p className="mt-0.5 text-xs text-concreto-claro">
                              {c.categoria}
                            </p>
                          )}
                        </div>
                        <span className="shrink-0 rounded-full bg-verde/10 px-2.5 py-0.5 text-[11px] font-semibold text-verde-escuro">
                          Ativo
                        </span>
                      </div>
                      {c && (
                        <div className="mt-3 flex items-center gap-3 text-xs text-concreto-claro">
                          <span>🦫 {Number(c.capivaras ?? 0).toFixed(1)}</span>
                          <span>·</span>
                          <span>{c.avaliacoes ?? 0} avaliações</span>
                        </div>
                      )}
                      <p className="mt-3 text-xs font-semibold text-verde">
                        Abrir painel →
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Reivindicações pendentes */}
        {pendentes.length > 0 && (
          <section className="mt-8">
            <h2 className="qc-display text-lg text-concreto">
              Em análise
            </h2>
            <ul className="mt-4 grid gap-3">
              {pendentes.map((r) => {
                const c = comercioMap.get(r.comercio_slug);
                return (
                  <li
                    key={r.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-linha bg-branco p-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-concreto">
                        {c?.nome ?? r.comercio_slug}
                      </p>
                      <p className="text-xs text-concreto-claro">
                        Documentos enviados · aguardando verificação
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-aviso/10 px-2.5 py-0.5 text-[11px] font-semibold text-aviso">
                      Pendente
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {lista.length === 0 && (
          <div className="mt-8 rounded-2xl border border-linha bg-branco p-8 text-center">
            <p className="qc-display text-xl text-concreto">
              Nenhum negócio ainda
            </p>
            <p className="mt-2 text-sm text-concreto-claro">
              Encontre o seu comércio no diretório e clique em "Sou o dono"
              para iniciar o processo de reivindicação.
            </p>
            <Link
              href="/"
              className="mt-5 inline-block rounded-lg bg-verde px-5 py-2.5 text-sm font-semibold text-branco transition-colors hover:bg-verde-escuro"
            >
              Buscar comércios
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
