"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  buscar,
  categoriaEmoji,
  categoriaParaSlug,
  computeStats,
  contagemPorCategoria,
  type Business,
} from "@/lib/data";
import { CapivaraMascote } from "./capivara-mascote";
import { LogoQC } from "./logo-qc";
import { FiltrosResultados } from "./filtros-resultados";
import { MapaQuadras } from "./mapa-quadras";

const EXEMPLOS = ["Academias", "409 Sul", "Restaurantes", "513 Sul", "Cafeterias", "408 Norte"];
const QUADRAS_POPULARES = ["409 Sul", "410 Sul", "513 Sul", "408 Norte", "410 Norte"];

function LupaIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

export function SearchExperience({ businesses }: { businesses: Business[] }) {
  const [query, setQuery] = useState("");
  const res = buscar(query, businesses);
  const categorias = useMemo(
    () => contagemPorCategoria(businesses),
    [businesses],
  );
  const stats = useMemo(() => computeStats(businesses), [businesses]);

  // Estado vazio inteligente: quando a busca não acha nada, decidimos a sugestão
  // a partir do formato da query (parece quadra? parece categoria?).
  const sugestao = useMemo(() => {
    const q = query.trim();
    const num = q.match(/\b(\d{3})\b/);
    if (num) {
      const alvo = Number(num[1]);
      const quadras = Array.from(
        new Set(businesses.map((b) => b.quadra)),
      ).sort((a, b) => Math.abs(a - alvo) - Math.abs(b - alvo));
      return { tipo: "quadra" as const, quadras: quadras.slice(0, 3) };
    }
    return { tipo: "categoria" as const };
  }, [query, businesses]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-concreto text-branco">
        {/* grade das superquadras */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* brilho verde */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-28 h-96 w-96 rounded-full bg-verde/25 blur-3xl"
        />

        <div className="relative mx-auto max-w-[1100px] px-6 py-12 md:py-16">
          {/* Marca */}
          <LogoQC variant="light" href={null} />

          <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1.35fr_1fr]">
            <div>
              {/* mascote no mobile */}
              <div className="mb-5 flex lg:hidden">
                <CapivaraMascote className="qc-float h-24 w-auto" />
              </div>

              <h1 className="qc-display max-w-2xl text-3xl md:text-5xl">
                Encontre tudo na sua{" "}
                <span className="text-verde-suave">quadra</span>.
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-branco/70">
                Comércios da Asa Sul e Asa Norte de Brasília, organizados por{" "}
                <strong className="text-branco">quadra</strong> e{" "}
                <strong className="text-branco">bloco</strong>. Avaliados em
                capivaras 🦫.
              </p>

              {/* busca */}
              <div className="relative mt-7 max-w-2xl">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-concreto-claro">
                  <LupaIcon />
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder='Busque um tema ("academias") ou uma quadra ("409 sul")'
                  className="w-full rounded-xl border-2 border-transparent bg-branco py-3.5 pl-12 pr-4 text-base text-concreto shadow-lg shadow-black/20 placeholder:text-concreto-claro focus:border-verde focus:outline-none"
                  autoFocus
                />
              </div>

              {/* exemplos */}
              <div className="mt-4 flex flex-wrap gap-2">
                {EXEMPLOS.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => setQuery(ex)}
                    className="rounded-full border border-branco/20 px-3 py-1 text-sm text-branco/75 transition-colors hover:border-verde-suave hover:text-branco"
                  >
                    {ex}
                  </button>
                ))}
              </div>

              {/* quadras populares — atalho rápido */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-branco/45">
                  Quadras populares
                </span>
                {QUADRAS_POPULARES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuery(q)}
                    className="rounded-full bg-verde/15 px-3 py-1 text-sm font-semibold text-verde-suave transition-colors hover:bg-verde/25 hover:text-branco"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* stats */}
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-branco/55">
                <span>
                  <strong className="qc-display text-base text-branco">
                    {stats.comercios}
                  </strong>{" "}
                  comércios
                </span>
                <span aria-hidden className="text-branco/20">
                  ·
                </span>
                <span>
                  <strong className="qc-display text-base text-branco">
                    {stats.quadras}
                  </strong>{" "}
                  quadras mapeadas
                </span>
                <span aria-hidden className="text-branco/20">
                  ·
                </span>
                <span>nota em capivaras 🦫</span>
              </div>
            </div>

            {/* mascote no desktop */}
            <div className="hidden justify-end lg:flex">
              <CapivaraMascote className="qc-float h-72 w-auto" />
            </div>
          </div>

          {/* explorar por quadra — mapa */}
          <div className="mt-10 rounded-2xl border border-branco/10 bg-branco/[0.04] p-5">
            <p className="qc-brand text-sm text-verde-suave">
              Explorar por quadra
            </p>
            <p className="mt-1 text-sm text-branco/60">
              Toque numa superquadra pra ver os comércios dela.
            </p>
            <div className="mt-4 rounded-xl bg-branco p-4">
              <MapaQuadras businesses={businesses} onSelecionar={setQuery} />
            </div>
          </div>
        </div>
      </section>

      {/* RESULTADOS */}
      <section className="mx-auto max-w-[1100px] px-6 py-12">
        {res.mode === "vazio" ? (
          <div className="qc-rise">
            <p className="qc-brand mb-4 text-sm text-verde">
              Explore por categoria
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {categorias.map(({ categoria, total }) => (
                <Link
                  key={categoria}
                  href={`/categoria/${categoriaParaSlug(categoria)}`}
                  className="group flex items-center gap-3 rounded-xl border border-linha bg-branco p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-verde/40 hover:shadow-md"
                >
                  <span
                    aria-hidden
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ar text-xl"
                  >
                    {categoriaEmoji(categoria)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate qc-display text-sm text-concreto">
                      {categoria}
                    </span>
                    <span className="block text-xs text-concreto-claro">
                      {total} {total === 1 ? "lugar" : "lugares"}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
            <p className="mt-8 max-w-lg text-sm text-concreto-claro">
              Ou digite uma quadra específica (ex: <strong>409 Sul</strong>) pra
              ver todos os comércios dela, em ordem por bloco A · B · C · D.
            </p>
          </div>
        ) : res.total === 0 ? (
          <div className="qc-rise rounded-xl border border-linha bg-branco p-8 text-center">
            <CapivaraMascote className="mx-auto h-24 w-auto opacity-80" />
            <p className="mt-4 text-concreto-claro">
              Nada encontrado para{" "}
              <strong className="text-concreto">
                &ldquo;{res.titulo}&rdquo;
              </strong>
              .
            </p>

            {sugestao.tipo === "quadra" && sugestao.quadras.length > 0 ? (
              <div className="mt-6">
                <p className="text-sm font-semibold text-concreto">
                  Quadras mais próximas com comércio:
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {sugestao.quadras.map((qd) => (
                    <button
                      key={qd}
                      type="button"
                      onClick={() => setQuery(String(qd))}
                      className="rounded-full bg-verde px-3.5 py-1.5 text-sm font-semibold text-branco transition-colors hover:bg-verde-escuro"
                    >
                      Quadra {qd}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <p className="text-sm font-semibold text-concreto">
                  Procure por uma categoria:
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {categorias.slice(0, 8).map(({ categoria }) => (
                    <button
                      key={categoria}
                      type="button"
                      onClick={() => setQuery(categoria)}
                      className="rounded-full border border-linha bg-branco px-3.5 py-1.5 text-sm font-semibold text-concreto-claro transition-colors hover:border-verde/40"
                    >
                      {categoriaEmoji(categoria)} {categoria}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-7 text-sm font-semibold text-verde underline-offset-2 hover:underline"
            >
              Ver todos os comércios
            </button>
          </div>
        ) : (
          <div className="qc-rise">
            <p className="mb-6 text-sm text-concreto-claro">
              {res.mode === "quadra"
                ? `Comércios da ${res.titulo} — em ordem por bloco`
                : `Resultados para "${res.titulo}" — agrupados por quadra`}{" "}
              · <strong className="text-concreto">{res.total}</strong>{" "}
              encontrado(s)
            </p>
            <FiltrosResultados
              itens={res.grupos.flatMap((g) => g.items)}
              modoQuadra={res.mode === "quadra"}
            />
          </div>
        )}
      </section>
    </>
  );
}
