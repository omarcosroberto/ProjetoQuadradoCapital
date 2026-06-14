"use client";

import { useEffect, useMemo, useState } from "react";
import { estaAbertoAgora } from "@/lib/horario";
import {
  isVerificado,
  quadraLabel,
  type Asa,
  type Business,
} from "@/lib/data";
import { BusinessCard } from "./business-card";

type Ordenacao = "melhores" | "visitados" | "mais" | "az";

const ORDENS: { value: Ordenacao; label: string }[] = [
  { value: "melhores", label: "Mais bem avaliados" },
  { value: "visitados", label: "Mais visitados" },
  { value: "mais", label: "Mais avaliados" },
  { value: "az", label: "A–Z" },
];

function FiltroPill({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={ativo}
      onClick={onClick}
      className={
        ativo
          ? "rounded-full bg-verde px-3.5 py-1.5 text-sm font-semibold text-branco"
          : "rounded-full border border-linha bg-branco px-3.5 py-1.5 text-sm font-semibold text-concreto-claro transition-colors hover:border-verde/40"
      }
    >
      {children}
    </button>
  );
}

type Grupo = {
  key: string;
  label: string;
  asa: Asa;
  quadra: number;
  items: Business[];
};

function reagrupar(items: Business[], modoQuadra: boolean): Grupo[] {
  if (modoQuadra) {
    // Modo quadra: lista única ordenada por bloco já vem do filtro/ordem.
    if (items.length === 0) return [];
    const b = items[0];
    return [
      {
        key: `${b.asa}|${b.quadra}`,
        label: quadraLabel(b),
        asa: b.asa,
        quadra: b.quadra,
        items,
      },
    ];
  }
  const mapa = new Map<string, Grupo>();
  for (const b of items) {
    const key = `${b.asa}|${b.quadra}`;
    if (!mapa.has(key)) {
      mapa.set(key, {
        key,
        label: quadraLabel(b),
        asa: b.asa,
        quadra: b.quadra,
        items: [],
      });
    }
    mapa.get(key)!.items.push(b);
  }
  const grupos = Array.from(mapa.values());
  grupos.sort((a, b) =>
    a.asa === b.asa ? a.quadra - b.quadra : a.asa === "Sul" ? -1 : 1,
  );
  return grupos;
}

export function FiltrosResultados({
  itens,
  modoQuadra,
}: {
  itens: Business[];
  modoQuadra: boolean;
}) {
  const [soAberto, setSoAberto] = useState(false);
  const [soVerificado, setSoVerificado] = useState(false);
  const [soFoto, setSoFoto] = useState(false);
  const [ordem, setOrdem] = useState<Ordenacao>("melhores");

  // "Aberto agora" depende do relógio do cliente — recalculado no mount.
  // Guardamos um set de ids abertos para filtrar sem chamar a função por render.
  const [abertosIds, setAbertosIds] = useState<Set<string>>(new Set());
  useEffect(() => {
    const s = new Set<string>();
    for (const b of itens) {
      if (estaAbertoAgora(b.horarioFuncionamento) === true) s.add(b.id);
    }
    setAbertosIds(s);
  }, [itens]);

  const filtrados = useMemo(() => {
    let lista = itens;
    if (soAberto) lista = lista.filter((b) => abertosIds.has(b.id));
    if (soVerificado) lista = lista.filter((b) => isVerificado(b));
    if (soFoto) lista = lista.filter((b) => Boolean(b.fotoUrl));

    const cmp = {
      melhores: (a: Business, b: Business) =>
        b.capivaras - a.capivaras || b.avaliacoes - a.avaliacoes,
      // "Mais visitados": usamos nº de avaliações como proxy de tráfego.
      visitados: (a: Business, b: Business) =>
        b.avaliacoes - a.avaliacoes || b.capivaras - a.capivaras,
      mais: (a: Business, b: Business) =>
        b.avaliacoes - a.avaliacoes || b.capivaras - a.capivaras,
      az: (a: Business, b: Business) => a.nome.localeCompare(b.nome, "pt-BR"),
    }[ordem];

    return [...lista].sort(cmp);
  }, [itens, soAberto, soVerificado, soFoto, ordem, abertosIds]);

  const grupos = useMemo(
    () => reagrupar(filtrados, modoQuadra),
    [filtrados, modoQuadra],
  );

  const total = filtrados.length;

  return (
    <div>
      {/* barra de filtros */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <FiltroPill ativo={soAberto} onClick={() => setSoAberto((v) => !v)}>
          Aberto agora
        </FiltroPill>
        <FiltroPill
          ativo={soVerificado}
          onClick={() => setSoVerificado((v) => !v)}
        >
          Verificados
        </FiltroPill>
        <FiltroPill ativo={soFoto} onClick={() => setSoFoto((v) => !v)}>
          Com foto
        </FiltroPill>
      </div>

      {/* ordenação — pills clicáveis (em vez de <select>) */}
      <div
        role="group"
        aria-label="Ordenar resultados"
        className="mb-6 flex flex-wrap items-center gap-2"
      >
        <span className="text-xs font-semibold uppercase tracking-wide text-concreto-claro">
          Ordenar
        </span>
        {ORDENS.map((o) => (
          <FiltroPill
            key={o.value}
            ativo={ordem === o.value}
            onClick={() => setOrdem(o.value)}
          >
            {o.label}
          </FiltroPill>
        ))}
      </div>

      {total === 0 ? (
        <p className="rounded-xl border border-linha bg-branco p-6 text-center text-sm text-concreto-claro">
          Nenhum comércio bate com esses filtros. Tente afrouxar a seleção.
        </p>
      ) : (
        <div className="space-y-10">
          {grupos.map((g) => (
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
      )}
    </div>
  );
}
