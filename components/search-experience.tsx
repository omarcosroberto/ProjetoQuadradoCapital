"use client";

import Link from "next/link";
import { useMemo, useState, useRef } from "react";
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
import { Reveal } from "./reveal";


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

/**
 * Skyline de Brasília — linha de horizonte minimalista desenhada à mão.
 * Da esquerda pra direita: Palácio da Alvorada (pilotis curvos), Catedral
 * Metropolitana (hiperboloide / coroa), Congresso Nacional (duas torres +
 * cúpula do Senado + tigela da Câmara) e a Torre de TV.
 * Reflexo no Lago Paranoá embaixo. Cores vêm dos tokens via currentColor.
 */
function SkylineBrasilia({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 300"
      role="img"
      aria-label="Horizonte de Brasília com o Palácio da Alvorada, a Catedral Metropolitana, o Congresso Nacional e a Torre de TV"
      className={className}
      fill="none"
    >
      {/* Sol / planalto — disco suave atrás dos monumentos */}
      <circle cx="270" cy="92" r="64" fill="var(--qc-planalto)" />
      <circle cx="270" cy="92" r="64" fill="var(--qc-ceu)" opacity="0.10" />

      {/* chão / linha do horizonte */}
      <line
        x1="0"
        y1="210"
        x2="520"
        y2="210"
        stroke="var(--qc-linha)"
        strokeWidth="2"
      />

      {/* === GRUPO MONUMENTOS (traço concreto) === */}
      <g
        stroke="var(--qc-concreto)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* --- Palácio da Alvorada: pilotis em arcos invertidos --- */}
        {/* laje superior */}
        <line x1="22" y1="158" x2="118" y2="158" />
        {/* laje da base */}
        <line x1="22" y1="200" x2="118" y2="200" />
        {/* colunas curvas (tangentes que afinam no topo e na base) */}
        <path d="M30 200 C 30 175, 40 165, 50 158" />
        <path d="M52 200 C 52 175, 62 165, 72 158" />
        <path d="M74 200 C 74 175, 84 165, 94 158" />
        <path d="M96 200 C 96 175, 106 165, 112 158" />
        {/* vidro do palácio (preenchimento leve) */}
        <rect
          x="40"
          y="158"
          width="60"
          height="42"
          fill="var(--qc-ceu)"
          opacity="0.12"
          stroke="none"
        />

        {/* --- Catedral Metropolitana: pilares curvos formando a coroa --- */}
        {/* anel da base */}
        <ellipse cx="170" cy="202" rx="40" ry="6" />
        {/* 7 pilares hiperboloides que abrem no topo */}
        <path d="M138 200 C 150 150, 160 130, 158 108" />
        <path d="M150 200 C 158 152, 165 128, 167 106" />
        <path d="M162 200 C 166 150, 170 126, 176 106" />
        <path d="M170 200 C 170 150, 170 124, 170 104" />
        <path d="M178 200 C 174 150, 170 126, 164 106" />
        <path d="M190 200 C 182 152, 175 128, 173 106" />
        <path d="M202 200 C 190 150, 180 130, 182 108" />

        {/* --- Congresso Nacional --- */}
        {/* plataforma / base larga */}
        <line x1="250" y1="200" x2="430" y2="200" />
        {/* duas torres slim gêmeas */}
        <line x1="332" y1="200" x2="332" y2="96" />
        <line x1="348" y1="200" x2="348" y2="96" />
        {/* passarela ligando as torres */}
        <line x1="332" y1="120" x2="348" y2="120" />
        {/* tigela da Câmara (côncava, abre pra cima) à esquerda */}
        <path d="M256 178 A 36 26 0 0 1 328 178" />
        <line x1="256" y1="178" x2="328" y2="178" />
        {/* cúpula do Senado (convexa) à direita */}
        <path d="M352 178 A 36 26 0 0 0 424 178" />
        <line x1="352" y1="178" x2="424" y2="178" />
        {/* preenchimento sutil das torres */}
        <rect
          x="332"
          y="96"
          width="16"
          height="104"
          fill="var(--qc-concreto)"
          opacity="0.06"
          stroke="none"
        />

        {/* --- Torre de TV: mastro + plataforma de observação --- */}
        {/* mastro */}
        <line x1="476" y1="200" x2="476" y2="70" />
        {/* base alargada */}
        <path d="M468 200 L 476 184 L 484 200" />
        {/* plataforma (mirante) */}
        <line x1="462" y1="120" x2="490" y2="120" />
        <line x1="462" y1="130" x2="490" y2="130" />
        <line x1="462" y1="120" x2="462" y2="130" />
        <line x1="490" y1="120" x2="490" y2="130" />
        {/* antena no topo */}
        <line x1="476" y1="70" x2="476" y2="52" strokeWidth="2" />
      </g>

      {/* === REFLEXO NO LAGO PARANOÁ (espelhado e esmaecido) === */}
      <g
        stroke="var(--qc-ceu)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.28"
      >
        {/* reflexo das torres do Congresso */}
        <line x1="332" y1="214" x2="332" y2="252" />
        <line x1="348" y1="214" x2="348" y2="252" />
        {/* reflexo da Torre de TV */}
        <line x1="476" y1="214" x2="476" y2="258" />
        {/* reflexo da catedral (traço único sugerido) */}
        <line x1="170" y1="214" x2="170" y2="244" />
        {/* ondulações da água */}
        <line x1="60" y1="226" x2="120" y2="226" opacity="0.6" />
        <line x1="240" y1="236" x2="320" y2="236" opacity="0.5" />
        <line x1="400" y1="230" x2="460" y2="230" opacity="0.5" />
      </g>

      {/* toque de vegetação do cerrado na base */}
      <g fill="var(--qc-verde)" opacity="0.85">
        <circle cx="14" cy="206" r="5" />
        <circle cx="226" cy="206" r="4" />
        <circle cx="446" cy="206" r="5" />
        <circle cx="506" cy="206" r="4" />
      </g>
    </svg>
  );
}

export function SearchExperience({ businesses }: { businesses: Business[] }) {
  const [query, setQuery] = useState("");
  const res = buscar(query, businesses);
  const resultsRef = useRef<HTMLElement>(null);

  function scrollToResults() {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const categorias = useMemo(
    () => contagemPorCategoria(businesses),
    [businesses],
  );
  const stats = useMemo(() => computeStats(businesses), [businesses]);

  // Top 5 quadras: score = soma(avaliacoes * capivaras) por quadra+asa, atualizado a cada render
  const quadrasPopulares = useMemo(() => {
    const scores = new Map<string, number>();
    for (const b of businesses) {
      const key = `${b.quadra} ${b.asa}`;
      scores.set(key, (scores.get(key) ?? 0) + (b.avaliacoes ?? 0) * (b.capivaras ?? 0));
    }
    return [...scores.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([key]) => key);
  }, [businesses]);

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
      {/* HERO — claro e luminoso, temática Brasília */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-planalto text-concreto">
        {/* grade das superquadras (padrão Lúcio Costa) — bem sutil */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              "linear-gradient(var(--qc-concreto) 1px, transparent 1px), linear-gradient(90deg, var(--qc-concreto) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        {/* brilho azul Lago Paranoá no canto */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-28 h-96 w-96 rounded-full bg-ceu/15 blur-3xl"
        />

        <div className="relative mx-auto max-w-[860px] px-6 py-12 md:py-16">
          {/* Marca centralizada */}
          <div className="flex justify-center">
            <LogoQC variant="default" href={null} />
          </div>

          {/* mascote */}
          <div className="mt-4 flex justify-center">
            <CapivaraMascote className="qc-float h-36 w-auto md:h-44" />
          </div>

          <h1 className="qc-display mt-6 text-center text-3xl text-concreto md:text-5xl">
            Encontre tudo na sua{" "}
            <span className="text-verde">quadra</span>.
          </h1>

          {/* busca centralizada — estilo Google */}
          <div className="relative mt-8 mx-auto max-w-2xl">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-verde">
              <LupaIcon />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") scrollToResults();
              }}
              placeholder='Busque um tema ("academias") ou uma quadra ("409 sul")'
              className="w-full rounded-2xl border-2 border-verde/30 bg-branco py-4 pl-12 pr-4 text-base text-concreto shadow-xl shadow-ceu/10 placeholder:text-concreto-claro focus:border-verde focus:shadow-verde/15 focus:outline-none"
              autoFocus
            />
          </div>

          {/* stats centralizadas */}
          <div className="mt-6 flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-sm text-concreto-claro">
            <span>
              <strong className="qc-display text-base text-concreto">
                {stats.comercios}
              </strong>{" "}
              comércios
            </span>
            <span aria-hidden className="text-linha">·</span>
            <span>
              <strong className="qc-display text-base text-concreto">
                {stats.quadras}
              </strong>{" "}
              quadras mapeadas
            </span>
            <span aria-hidden className="text-linha">·</span>
            <span>Avaliação em Capivaras 🦫</span>
          </div>

          {/* divisor arquitetônico estilo Niemeyer */}
          <hr className="qc-niemeyer-line mt-10" />

          {/* mapa de quadras */}
          <Reveal delay={100}>
            <div className="mt-8 rounded-2xl border border-linha bg-branco/60 p-5 shadow-sm shadow-ceu/5">
              <div className="rounded-xl bg-branco p-4 shadow-sm">
                <MapaQuadras
                  businesses={businesses}
                  onSelecionar={(q) => {
                    setQuery(q);
                    setTimeout(scrollToResults, 80);
                  }}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* RESULTADOS */}
      <section ref={resultsRef} className="mx-auto max-w-[1100px] px-6 py-12">
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
                  className="group flex items-center gap-3 rounded-xl border border-linha bg-branco p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-verde/40 hover:shadow-md hover:shadow-ceu/10"
                >
                  <span
                    aria-hidden
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-planalto text-xl"
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
          </div>
        ) : res.total === 0 ? (
          <div className="qc-rise rounded-xl border border-linha bg-branco p-8 text-center">
            <p className="text-concreto-claro">
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
