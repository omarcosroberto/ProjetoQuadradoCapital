import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { LogoQC } from "@/components/logo-qc";
import { Footer } from "@/components/footer";
import { CapivaraRating } from "@/components/capivara";
import { createServerSupabase } from "@/lib/supabase-server";
import { SairButton } from "./sair-button";

export const metadata: Metadata = {
  title: "Minha conta — Quadrado Capital",
  robots: { index: false, follow: false },
};

type AvaliacaoRow = {
  id: string;
  comercio_slug: string;
  nota: number;
  comentario: string | null;
  created_at: string;
};

type PerfilRow = {
  apelido: string | null;
  tipo_perfil: string | null;
  celular: string | null;
};

export default async function ContaPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/entrar");

  const [perfilRes, avaliacoesRes] = await Promise.all([
    supabase
      .from("qc_perfis")
      .select("apelido,tipo_perfil,celular")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("qc_avaliacoes")
      .select("id,comercio_slug,nota,comentario,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const perfil = perfilRes.data as PerfilRow | null;
  const lista = (avaliacoesRes.data ?? []) as AvaliacaoRow[];
  const apelido = perfil?.apelido ?? "Membro";
  const empresarial = perfil?.tipo_perfil === "empresarial";

  return (
    <div className="flex min-h-dvh flex-col bg-ar">
      <header className="bg-concreto px-6 py-4">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between">
          <LogoQC variant="light" />
          <Link
            href="/"
            className="text-sm text-branco/70 transition-colors hover:text-verde-suave"
          >
            ← Voltar à busca
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1100px] flex-1 px-6 py-10">
        <div className="qc-rise rounded-2xl border border-linha bg-branco p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-verde">
                Minha conta
              </p>
              <h1 className="mt-1 qc-display text-2xl text-concreto">
                Olá, {apelido} 🦫
              </h1>
              <p className="mt-1 text-sm text-concreto-claro">{user.email}</p>
              {perfil?.celular && (
                <p className="mt-0.5 text-sm text-concreto-claro">
                  {perfil.celular}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                    empresarial
                      ? "bg-verde/10 text-verde-escuro"
                      : "bg-ar text-concreto-claro"
                  }`}
                >
                  {empresarial ? (
                    <>
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-3.5 w-3.5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Perfil Empresarial
                    </>
                  ) : (
                    <>
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-3.5 w-3.5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Pessoa Física
                    </>
                  )}
                </span>
              </div>
            </div>
            <SairButton />
          </div>
        </div>

        {/* Painel do empresário */}
        {empresarial && (
          <div className="mt-6 rounded-2xl border border-verde/30 bg-verde/5 p-6 sm:p-8">
            <p className="qc-brand text-sm text-verde">Perfil Empresarial</p>
            <h2 className="mt-1 qc-display text-xl text-concreto">
              Gerencie seus negócios
            </h2>
            <p className="mt-2 text-sm text-concreto-claro">
              Acesse o painel do dono para editar informações, ver estatísticas
              e gerenciar comércios que você reivindicou.
            </p>
            <Link
              href="/meu-negocio"
              className="mt-4 inline-block rounded-lg bg-verde px-5 py-2.5 text-sm font-semibold text-branco transition-colors hover:bg-verde-escuro"
            >
              Ir para Meus Negócios
            </Link>
          </div>
        )}

        <section className="mt-8">
          <h2 className="qc-display text-xl text-concreto">
            Minhas avaliações
          </h2>
          {lista.length === 0 ? (
            <p className="mt-3 rounded-xl border border-linha bg-branco p-6 text-sm text-concreto-claro">
              Você ainda não avaliou nenhum comércio. Encontre um lugar na sua
              quadra e dê suas capivaras 🦫.{" "}
              <Link href="/" className="font-semibold text-verde underline">
                Buscar comércios
              </Link>
            </p>
          ) : (
            <ul className="mt-4 grid gap-3">
              {lista.map((a) => (
                <li
                  key={a.id}
                  className="rounded-xl border border-linha bg-branco p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <Link
                      href={`/comercio/${a.comercio_slug}`}
                      className="qc-brand text-sm text-verde hover:text-verde-escuro"
                    >
                      {a.comercio_slug}
                    </Link>
                    <CapivaraRating value={a.nota} size="h-4 w-[15px]" />
                  </div>
                  {a.comentario && (
                    <p className="mt-2 text-sm text-concreto-claro">
                      {a.comentario}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
