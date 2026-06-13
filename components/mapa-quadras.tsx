"use client";

import { useMemo, useState } from "react";
import type { Asa, Business } from "@/lib/data";

/**
 * Mapa compacto das superquadras do Plano Piloto. Cada retângulo é uma quadra;
 * a saturação do verde cresce com a quantidade de comércios. Clicar dispara a
 * busca da home ("NNN Sul" / "NNN Norte").
 *
 * Séries renderizadas: 100, 200, 300, 400, 500 — colunas pares 00..16
 * (padrão das superquadras residenciais; quadras sem comércio ficam neutras).
 */

const SERIES = [100, 200, 300, 400, 500];
const COLUNAS = [0, 2, 4, 6, 8, 10, 12, 14, 16]; // sufixos das quadras

const CELL = 34;
const GAP = 4;
const PAD = 8;

function corPorContagem(n: number, max: number): string {
  if (n === 0) return "var(--qc-ar)";
  // 0..1 → mistura de verde-suave para verde-escuro.
  const t = max <= 1 ? 1 : n / max;
  // Interpola opacidade do verde sobre fundo; usamos rgba do verde (#2d8659).
  const alpha = 0.25 + t * 0.6; // 0.25..0.85
  return `rgba(45, 134, 89, ${alpha.toFixed(2)})`;
}

export function MapaQuadras({
  businesses,
  onSelecionar,
}: {
  businesses: Business[];
  onSelecionar: (query: string) => void;
}) {
  const [asa, setAsa] = useState<Asa>("Sul");

  const { contagem, max } = useMemo(() => {
    const m = new Map<number, number>();
    for (const b of businesses) {
      if (b.asa !== asa) continue;
      m.set(b.quadra, (m.get(b.quadra) ?? 0) + 1);
    }
    let mx = 0;
    for (const v of m.values()) mx = Math.max(mx, v);
    return { contagem: m, max: mx };
  }, [businesses, asa]);

  const width = PAD * 2 + COLUNAS.length * (CELL + GAP) - GAP;
  const height = PAD * 2 + SERIES.length * (CELL + GAP) - GAP;

  return (
    <div>
      {/* abas */}
      <div className="mb-4 inline-flex rounded-full border border-linha bg-branco p-1">
        {(["Sul", "Norte"] as Asa[]).map((a) => (
          <button
            key={a}
            type="button"
            aria-pressed={asa === a}
            onClick={() => setAsa(a)}
            className={
              asa === a
                ? "rounded-full bg-verde px-4 py-1.5 text-sm font-semibold text-branco"
                : "rounded-full px-4 py-1.5 text-sm font-semibold text-concreto-claro transition-colors hover:text-concreto"
            }
          >
            Asa {a}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full max-w-[520px]"
          role="img"
          aria-label={`Mapa de quadras da Asa ${asa}`}
        >
          {SERIES.map((serie, row) =>
            COLUNAS.map((col, ci) => {
              const quadra = serie + col;
              const n = contagem.get(quadra) ?? 0;
              const x = PAD + ci * (CELL + GAP);
              const y = PAD + row * (CELL + GAP);
              const ativo = n > 0;
              const label = `${quadra} ${asa}`;
              return (
                <g
                  key={quadra}
                  role={ativo ? "button" : undefined}
                  tabIndex={ativo ? 0 : undefined}
                  aria-label={
                    ativo
                      ? `Quadra ${label} — ${n} ${n === 1 ? "comércio" : "comércios"}`
                      : undefined
                  }
                  className={ativo ? "cursor-pointer" : "cursor-default"}
                  onClick={ativo ? () => onSelecionar(label) : undefined}
                  onKeyDown={
                    ativo
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onSelecionar(label);
                          }
                        }
                      : undefined
                  }
                >
                  <rect
                    x={x}
                    y={y}
                    width={CELL}
                    height={CELL}
                    rx={5}
                    fill={corPorContagem(n, max)}
                    stroke="var(--qc-linha)"
                    strokeWidth={1}
                    className={
                      ativo
                        ? "transition-[stroke,filter] hover:stroke-[var(--qc-verde)]"
                        : ""
                    }
                  />
                  <text
                    x={x + CELL / 2}
                    y={y + CELL / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="10"
                    fontWeight={ativo ? 600 : 400}
                    fill={
                      n > max * 0.55 && max > 0
                        ? "var(--qc-branco)"
                        : "var(--qc-concreto-claro)"
                    }
                  >
                    {quadra}
                  </text>
                </g>
              );
            }),
          )}
        </svg>
      </div>

      <p className="mt-3 text-xs text-concreto-claro">
        Quanto mais verde, mais comércios mapeados naquela quadra. Clique para
        ver todos.
      </p>
    </div>
  );
}
