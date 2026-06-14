import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CapivaraRating } from "@/components/capivara";
import { Footer } from "@/components/footer";
import { FolhaCapivara } from "@/components/folha-capivara";
import { BandeiraReivindicado } from "@/components/bandeira-reivindicado";
import { asaSigla, categoriaEmoji } from "@/lib/data";
import {
  getComercioBySlug,
  getComercioSlugs,
  type ComercioDetalhe,
} from "@/lib/comercios";
import { ClaimForm } from "./claim-form";
import { ClaimNegocio } from "@/components/claim-negocio";
import { AvaliacaoForm } from "@/components/avaliacao-form";
import { EstadoAberto } from "@/components/estado-aberto";
import { HorarioSemana } from "@/components/horario-semana";
import { ShareButton } from "@/components/share-button";
import { createServerSupabase } from "@/lib/supabase-server";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getComercioSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = await getComercioBySlug(slug);
  if (!c) return { title: "Comércio não encontrado — Quadrado Capital" };
  const BASE = "https://quadradocapital.com.br";
  const asaNome = c.asa === "Sul" ? "Asa Sul" : "Asa Norte";
  const blocoStr = c.bloco ? ` Bloco ${c.bloco}` : "";
  const canonicalUrl = `${BASE}/comercio/${slug}`;
  return {
    title: `${c.nome} na Quadra ${c.quadra} ${asaNome} — Quadrado Capital`,
    description: `${c.categoria} no${blocoStr ? blocoStr + "," : ""} Quadra ${c.quadra} ${asaNome} de Brasília. Avaliações reais, horário e contato.`,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${c.nome} na Quadra ${c.quadra} ${asaNome} — Quadrado Capital`,
      description: `${c.categoria} · Quadra ${c.quadra} ${c.asa} · Brasília`,
      url: canonicalUrl,
      images: c.fotoUrl
        ? [{ url: c.fotoUrl, width: 1200, height: 630, alt: c.nome }]
        : [{ url: `${BASE}/og-image.png`, width: 1200, height: 630, alt: "Quadrado Capital" }],
      locale: "pt_BR",
      type: "website",
    },
  };
}

function onlyDigits(s?: string) {
  return (s ?? "").replace(/\D/g, "");
}

function Contato({ c }: { c: ComercioDetalhe }) {
  const wa = onlyDigits(c.whatsapp);
  const tel = onlyDigits(c.telefone);
  const items: { label: string; href: string }[] = [];
  if (wa)
    items.push({
      label: "WhatsApp",
      href: `https://wa.me/${wa.startsWith("55") ? wa : `55${wa}`}`,
    });
  if (tel) items.push({ label: "Telefone", href: `tel:+55${tel}` });
  if (c.site)
    items.push({
      label: "Site",
      href: c.site.startsWith("http") ? c.site : `https://${c.site}`,
    });
  if (c.instagram)
    items.push({
      label: "Instagram",
      href: `https://instagram.com/${c.instagram.replace(/^@/, "")}`,
    });

  if (items.length === 0) return null;
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {items.map((i) => (
        <a
          key={i.label}
          href={i.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-linha bg-branco px-3.5 py-2 text-sm font-semibold text-concreto transition-colors hover:border-verde hover:text-verde"
        >
          {i.label}
        </a>
      ))}
    </div>
  );
}

export default async function ComercioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [c, supabase] = await Promise.all([
    getComercioBySlug(slug),
    createServerSupabase(),
  ]);
  if (!c) notFound();

  // Verifica se o usuário logado tem perfil empresarial
  const { data: { user } } = await supabase.auth.getUser();
  let perfilEmpresarial = false;
  if (user) {
    const { data: perfil } = await supabase
      .from("qc_perfis")
      .select("tipo_perfil")
      .eq("id", user.id)
      .maybeSingle();
    perfilEmpresarial = perfil?.tipo_perfil === "empresarial";
  }

  const BASE = "https://quadradocapital.com.br";
  const local = `Quadra ${c.quadra} ${asaSigla(c.asa)}`;
  const asaNome = c.asa === "Sul" ? "Asa Sul" : "Asa Norte";
  const canonicalUrl = `${BASE}/comercio/${slug}`;
  const googleFraco =
    c.presencaGoogle === "fraca" || c.presencaGoogle === "ausente";
  const temHorario =
    Array.isArray(c.horarioFuncionamento) &&
    c.horarioFuncionamento.length > 0;

  // JSON-LD LocalBusiness
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: c.nome,
    description: c.descricao ?? `${c.categoria} na ${asaNome}, Quadra ${c.quadra}${c.bloco ? ` Bloco ${c.bloco}` : ""} de Brasília.`,
    url: canonicalUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Brasília",
      addressRegion: "DF",
      addressCountry: "BR",
      ...(c.endereco ? { streetAddress: c.endereco } : {}),
    },
    ...(c.telefone ? { telephone: c.telefone } : {}),
    ...(c.fotoUrl ? { image: c.fotoUrl } : {}),
    ...(temHorario ? { openingHours: c.horarioFuncionamento } : {}),
    ...(c.avaliacoes > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: c.capivaras.toFixed(1),
            reviewCount: String(c.avaliacoes),
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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

      <main className="mx-auto w-full max-w-[1100px] flex-1 px-6 py-10">
        <nav className="mb-6 text-sm text-concreto-claro">
          <Link href="/" className="hover:text-verde">
            Início
          </Link>{" "}
          <span aria-hidden>/</span>{" "}
          <span className="text-concreto">{local}</span>{" "}
          <span aria-hidden>/</span>{" "}
          <span className="text-concreto">{c.nome}</span>
        </nav>

        <div className={`grid gap-8 ${perfilEmpresarial ? "lg:grid-cols-[1.4fr_1fr]" : ""}`}>
          {/* coluna principal */}
          <div className="qc-rise">
            {c.fotoUrl && (
              <div className="mb-6 overflow-hidden rounded-2xl border border-linha bg-branco">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.fotoUrl}
                  alt={`Foto de ${c.nome}`}
                  className="h-56 w-full object-cover sm:h-72"
                />
              </div>
            )}
            <div className="rounded-2xl border border-linha bg-branco p-6 sm:p-8">
              <EstadoAberto
                horario={c.horarioFuncionamento}
                variant="inline"
                className="mb-4"
              />
              <div className="flex items-start gap-4">
                <span
                  aria-hidden
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-ar text-3xl"
                >
                  {categoriaEmoji(c.categoria)}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-verde">
                    {c.categoria}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <h1 className="qc-display text-2xl text-concreto sm:text-3xl">
                      {c.nome}
                    </h1>
                    <FolhaCapivara
                      verificado={c.presencaGoogle === "forte"}
                      size="md"
                    />
                    <BandeiraReivindicado
                      reivindicado={c.reivindicado ?? false}
                      size="md"
                    />
                  </div>
                  <p className="mt-2 text-sm text-concreto-claro">
                    {c.bloco ? (
                      <span className="font-semibold text-concreto">
                        Bloco {c.bloco}
                      </span>
                    ) : (
                      "Comércio local"
                    )}{" "}
                    · {local}
                    {c.endereco ? ` · ${c.endereco}` : ""}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-linha pt-5">
                <CapivaraRating value={c.capivaras} count={c.avaliacoes} />
                <p className="mt-2 text-xs text-concreto-claro">
                  Avaliação em Capivaras 🦫 — a régua de qualidade do Quadrado
                  Capital.
                </p>
              </div>

              <Contato c={c} />

              <div className="mt-3">
                <ShareButton title={`${c.nome} — Quadrado Capital`} url={canonicalUrl} />
              </div>

              {c.descricao && (
                <div className="mt-6 border-t border-linha pt-5">
                  <p className="text-sm whitespace-pre-line text-concreto-claro">
                    {c.descricao}
                  </p>
                </div>
              )}
            </div>

            {/* 2. HORÁRIO DE FUNCIONAMENTO — 7 dias, hoje em verde */}
            {temHorario && (
              <div className="mt-6 rounded-2xl border border-linha bg-branco p-6 sm:p-8">
                <p className="qc-display text-lg text-concreto">
                  Horário de funcionamento
                </p>
                <div className="mt-4">
                  <HorarioSemana horario={c.horarioFuncionamento!} />
                </div>
              </div>
            )}

            {/* 3. AVALIAÇÕES da comunidade (membros logados) */}
            <AvaliacaoForm slug={c.id} />

            {/* 4. REIVINDICAÇÃO — apenas perfis empresariais logados */}
            {perfilEmpresarial && (
              <div className="mt-6 rounded-2xl border border-linha bg-branco p-6 sm:p-8">
                <p className="qc-brand text-sm text-verde">Sou o dono</p>
                <h2 className="mt-1 qc-display text-xl text-concreto">
                  Gerencie este negócio
                </h2>
                <p className="mt-2 text-sm text-concreto-claro">
                  Reivindique com seu perfil empresarial para editar informações
                  e acessar o painel do dono.
                </p>
                <div className="mt-5">
                  <ClaimNegocio slug={c.id} />
                </div>
              </div>
            )}

            {/* 5. PRESENÇA DIGITAL — visível apenas para perfis empresariais logados */}
            {perfilEmpresarial && (
              <div
                className={`mt-6 rounded-2xl border p-6 sm:p-8 ${
                  googleFraco
                    ? "border-aviso/40 bg-aviso/5"
                    : "border-linha bg-branco"
                }`}
              >
                <p className="qc-brand text-sm text-verde">Presença digital</p>
                <h2 className="mt-1 qc-display text-xl text-concreto">
                  {googleFraco
                    ? "Este comércio quase não aparece no Google."
                    : "Quer atrair mais clientes da sua quadra?"}
                </h2>
                <p className="mt-2 max-w-prose text-sm text-concreto-claro">
                  {googleFraco
                    ? "Quem busca por perto não está te encontrando. A Marcos Roberto PRO coloca seu comércio no mapa: Google Meu Negócio, avaliações e presença online que vira cliente na porta."
                    : "A Marcos Roberto PRO cuida da sua presença online — Google Meu Negócio, avaliações e mais visibilidade na sua região."}
                </p>
                <div className="mt-5">
                  <ClaimForm slug={c.id} variant="lead_mrp" />
                </div>
              </div>
            )}
          </div>

          {/* coluna lateral — apenas para perfis empresariais */}
          {perfilEmpresarial && (
            <aside className="qc-rise lg:sticky lg:top-6 lg:self-start">
              <div className="rounded-2xl border border-linha bg-branco p-6">
                <p className="qc-brand text-sm text-verde">É o seu comércio?</p>
                <h2 className="mt-1 qc-display text-xl text-concreto">
                  Prefere que a gente entre em contato?
                </h2>
                <p className="mt-2 text-sm text-concreto-claro">
                  Deixe seu contato e confirmamos que o perfil é seu.
                </p>
                <div className="mt-5">
                  <ClaimForm slug={c.id} variant="reivindicacao" />
                </div>
              </div>
            </aside>
          )}
        </div>
      </main>

      <Footer />
    </div>
    </>
  );
}
