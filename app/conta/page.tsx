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

export default async function ContaPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/entrar");

  const { data: perfil } = await supabase
    .from("qc_perfis")
    .select("apelido")
    .eq("id", user.id)
    .maybeSingle();

  const { data: avaliacoes } = await supabase
    .from("qc_avaliacoes")
    .select("id,comercio_slug,nota,comentario,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const lista = (avaliacoes ?? []) as AvaliacaoRow[];
  const apelido = perfil?.apelido ?? "Membro";

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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-verde">
                Minha conta
              </p>
              <h1 className="mt-1 qc-display text-2xl text-concreto">
                Olá, {apelido} 🦫
              </h1>
              <p className="mt-1 text-sm text-concreto-claro">{user.email}</p>
            </div>
            <SairButton />
          </div>
        </div>

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
