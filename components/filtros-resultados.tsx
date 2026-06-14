"use client";

import { useMemo, useState } from "react";
import {
  isVerificado,
  quadraLabel,
  type Asa,
  type Business,
} from "@/lib/data";
import { estaAbertoAgora } from "@/lib/horario";
import { BusinessCard } from "./business-card";

type Ordenacao = "melhores" | "visitados" | "az";

const ORDENS: { value: Ordenacao; label: string }[] = [
  { value: "melhores", label: "Mais bem avaliados" },
  { value: "visitados", label: "Mais avaliados" },
  { value: "az", label: "A–Z" },
];

const POR_PAGINA_OPCOES = [6, 12, 24];

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
    if (items.length === 0) return [];
    const b = items[0];
    return [{ key: `${b.asa}|${b.quadra}`, label: quadraLabel(b), asa: b.asa, quadra: b.quadra, items }];
  }
  const mapa = new Map<string, Grupo>();
  for (const b of items) {
    const key = `${b.asa}|${b.quadra}`;
    if (!mapa.has(key)) {
      mapa.set(key, { key, label: quadraLabel(b), asa: b.asa, quadra: b.quadra, items: [] });
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
  const [soVerificado, setSoVerificado] = useState(false);
  const [soAberto, setSoAberto] = useState(false);
  const [soComFoto, setSoComFoto] = useState(false);
  const [busca, setBusca] = useState("");
  const [ordem, setOrdem] = useState<Ordenacao>("melhores");
  const [pagina, setPagina] = useState(1);
  const [perPage, setPerPage] = useState(6);

  function resetPagina() {
    setPagina(1);
  }

  const filtrados = useMemo(() => {
    let lista = itens;
    if (busca.trim()) {
      const q = busca.toLowerCase();
      lista = lista.filter(
        (b) =>
          b.nome.toLowerCase().includes(q) ||
          b.categoria.toLowerCase().includes(q),
      );
    }
    if (soVerificado) lista = lista.filter((b) => isVerificado(b));
    if (soAberto) lista = lista.filter((b) => estaAbertoAgora(b.horarioFuncionamento) === true);
    if (soComFoto) lista = lista.filter((b) => !!b.fotoUrl);

    const cmp: Record<Ordenacao, (a: Business, b: Business) => number> = {
      melhores: (a, b) => b.capivaras - a.capivaras || b.avaliacoes - a.avaliacoes,
      visitados: (a, b) => b.avaliacoes - a.avaliacoes || b.capivaras - a.capivaras,
      az: (a, b) => a.nome.localeCompare(b.nome, "pt-BR"),
    };

    return [...lista].sort(cmp[ordem]);
  }, [itens, busca, soVerificado, soAberto, soComFoto, ordem]);

  const total = filtrados.length;
  const totalPaginas = Math.ceil(total / perPage);
  const paginados = filtrados.slice((pagina - 1) * perPage, pagina * perPage);
  const grupos = useMemo(() => reagrupar(paginados, modoQuadra), [paginados, modoQuadra]);

  return (
    <div>
      {/* Campo de busca */}
      <div className="mb-4">
        <input
          type="search"
          value={busca}
          onChange={(e) => { setBusca(e.target.value); resetPagina(); }}
          placeholder="Buscar por nome ou categoria…"
          className="w-full rounded-xl border border-linha bg-branco px-4 py-2.5 text-sm text-concreto placeholder:text-concreto-claro focus:border-verde focus:outline-none"
        />
      </div>

      {/* Filtros + ordenação */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <FiltroPill ativo={soAberto} onClick={() => { setSoAberto((v) => !v); resetPagina(); }}>
          🟢 Aberto agora
        </FiltroPill>
        <FiltroPill ativo={soVerificado} onClick={() => { setSoVerificado((v) => !v); resetPagina(); }}>
          Verificados
        </FiltroPill>
        <FiltroPill ativo={soComFoto} onClick={() => { setSoComFoto((v) => !v); resetPagina(); }}>
          Com foto
        </FiltroPill>

        <span aria-hidden className="mx-1 h-4 w-px bg-linha" />

        <span className="text-xs font-semibold uppercase tracking-wide text-concreto-claro">
          Ordenar
        </span>
        {ORDENS.map((o) => (
          <FiltroPill
            key={o.value}
            ativo={ordem === o.value}
            onClick={() => { setOrdem(o.value); resetPagina(); }}
          >
            {o.label}
          </FiltroPill>
        ))}
      </div>

      {total === 0 ? (
        <div className="rounded-xl border border-linha bg-branco p-8 text-center">
          <p className="text-2xl mb-2">🦫</p>
          <p className="text-sm font-semibold text-concreto mb-1">Nenhum comércio encontrado</p>
          <p className="text-xs text-concreto-claro mb-4">
            {soAberto && "Pode ser que estejam fechados agora. "}
            Tente remover algum filtro ou buscar por outra quadra.
          </p>
          {(soAberto || soVerificado || soComFoto || busca) && (
            <button
              type="button"
              onClick={() => { setSoAberto(false); setSoVerificado(false); setSoComFoto(false); setBusca(""); resetPagina(); }}
              className="rounded-full bg-verde/10 px-4 py-1.5 text-xs font-semibold text-verde hover:bg-verde/20 transition-colors"
            >
              Limpar filtros
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Resultados agrupados por quadra */}
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

          {/* Paginação */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-linha pt-6">
            {/* Navegação de páginas */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                disabled={pagina === 1}
                className="rounded-full border border-linha bg-branco px-4 py-1.5 text-sm font-semibold text-concreto-claro transition-colors hover:border-verde/40 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Anterior
              </button>
              <span className="text-sm text-concreto-claro">
                {pagina} / {totalPaginas}
              </span>
              <button
                type="button"
                onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                disabled={pagina === totalPaginas}
                className="rounded-full border border-linha bg-branco px-4 py-1.5 text-sm font-semibold text-concreto-claro transition-colors hover:border-verde/40 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Próxima →
              </button>
            </div>

            {/* Itens por página */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-concreto-claro">Por página:</span>
              {POR_PAGINA_OPCOES.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => { setPerPage(n); setPagina(1); }}
                  className={
                    n === perPage
                      ? "rounded-full bg-verde px-3 py-1 text-xs font-bold text-branco"
                      : "rounded-full border border-linha bg-branco px-3 py-1 text-xs font-semibold text-concreto-claro hover:border-verde/40 transition-colors"
                  }
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
