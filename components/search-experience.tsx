"use client";

import { useMemo, useState } from "react";
import {
  buscar,
  categoriaEmoji,
  computeStats,
  contagemPorCategoria,
  type Business,
} from "@/lib/data";
import { BusinessCard } from "./business-card";
import { CapivaraMascote } from "./capivara-mascote";

const EXEMPLOS = ["Academias", "409 Sul", "Restaurantes", "513 Sul", "Cafeterias", "408 Norte"];

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
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center bg-verde qc-brand text-lg leading-none text-branco">
              Q
            </span>
            <span className="qc-brand text-lg text-branco">
              Quadrado <span className="text-verde-suave">Capital</span>
            </span>
          </div>

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
                <button
                  key={categoria}
                  type="button"
                  onClick={() => setQuery(categoria)}
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
                </button>
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
              <strong className="text-concreto">&ldquo;{res.titulo}&rdquo;</strong>.
              Tenta outro tema ou quadra.
            </p>
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
            <div className="space-y-10">
              {res.grupos.map((g) => (
                <div key={g.key}>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="rounded-lg bg-verde/10 px-3 py-1.5 qc-brand text-sm text-verde">
                      {g.label}
                    </span>
                    <span className="h-px flex-1 bg-linha" />
                    <span className="rounded-full bg-ar px-2.5 py-0.5 text-xs font-semibold text-concreto-claro">
                      {g.items.length}{" "}
                      {g.items.length === 1 ? "comércio" : "comércios"}
                    </span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {g.items.map((b) => (
                      <BusinessCard key={b.id} b={b} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
