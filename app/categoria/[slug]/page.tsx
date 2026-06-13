import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BusinessCard } from "@/components/business-card";
import { Footer } from "@/components/footer";
import {
  categoriaEmoji,
  categoriaParaSlug,
  slugParaCategoria,
} from "@/lib/data";
import { getComercios } from "@/lib/comercios";
import { SEED_BUSINESSES } from "@/lib/seed";

export const revalidate = 300;
export const dynamicParams = true;

export function generateStaticParams() {
  const slugs = new Set<string>();
  for (const b of SEED_BUSINESSES) slugs.add(categoriaParaSlug(b.categoria));
  return Array.from(slugs, (slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const businesses = await getComercios();
  const categoria = slugParaCategoria(slug, businesses);
  if (!categoria) {
    return { title: "Categoria não encontrada — Quadrado Capital" };
  }
  return {
    title: `${categoria} em Brasília — Asa Sul e Norte | Quadrado Capital`,
    description: `Os melhores ${categoria.toLowerCase()} da Asa Sul e Asa Norte de Brasília, organizados por quadra e bloco e avaliados em capivaras 🦫.`,
  };
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const businesses = await getComercios();
  const categoria = slugParaCategoria(slug, businesses);
  if (!categoria) notFound();

  const items = businesses.filter((b) => b.categoria === categoria);

  return (
    <div className="flex min-h-dvh flex-col">
      {/* topo */}
      <header className="bg-concreto text-branco">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center bg-verde qc-brand text-base leading-none text-branco">
              Q
            </span>
            <span className="qc-brand text-base text-branco">
              Quadrado <span className="text-verde-suave">Capital</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-branco/70 transition-colors hover:text-verde-suave"
          >
            ← Voltar à busca
          </Link>
        </div>
      </header>

      {/* hero da categoria */}
      <section className="bg-concreto text-branco">
        <div className="mx-auto max-w-[1100px] px-6 pb-12 pt-2">
          <span
            aria-hidden
            className="flex h-16 w-16 items-center justify-center rounded-xl bg-verde/15 text-3xl"
          >
            {categoriaEmoji(categoria)}
          </span>
          <h1 className="mt-4 qc-display text-3xl md:text-4xl">
            {categoria} <span className="text-verde-suave">em Brasília</span>
          </h1>
          <p className="mt-3 max-w-xl text-lg leading-relaxed text-branco/70">
            Todos os comércios da categoria{" "}
            <strong className="text-branco">{categoria}</strong> na Asa Sul e
            Asa Norte, avaliados em capivaras 🦫.
          </p>
          <p className="mt-4 text-sm text-branco/55">
            <strong className="qc-display text-base text-branco">
              {items.length}
            </strong>{" "}
            {items.length === 1 ? "comércio" : "comércios"} nesta categoria
          </p>
        </div>
      </section>

      {/* grade */}
      <main className="mx-auto w-full max-w-[1100px] flex-1 px-6 py-12">
        {items.length === 0 ? (
          <p className="rounded-xl border border-linha bg-branco p-8 text-center text-concreto-claro">
            Ainda não há comércios cadastrados nesta categoria.
          </p>
        ) : (
          <div className="qc-rise grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((b) => (
              <BusinessCard key={b.id} b={b} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
