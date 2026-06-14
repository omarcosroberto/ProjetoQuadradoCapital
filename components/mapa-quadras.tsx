"use client";

import { useState, useMemo } from "react";
import type { Business } from "@/lib/data";

// ─── Grade ───────────────────────────────────────────────────────────────────
const N   = 16;   // posições 0–15 → quadras 101–116
const CW  = 32;   // largura célula
const CH  = 40;   // altura célula
const GW  = 2;
const GH  = 4;

const PAD_X  = 8;
const PAD_Y  = 8;

const ASA_W = N * (CW + GW) - GW;
const SVG_W = PAD_X + ASA_W + PAD_X;

// ─── Y por série ─────────────────────────────────────────────────────────────
const Y500  = PAD_Y;
const Y300  = Y500 + CH + GH;
const Y100  = Y300 + CH + GH;
// gap entre ímpares e pares (onde ficava o eixão)
const Y200  = Y100 + CH + 18;
const Y400  = Y200 + CH + GH;
const SVG_H = Y400 + CH + PAD_X;

const SERIE_Y: Record<number, number> = {
  500: Y500, 300: Y300, 100: Y100,
  200: Y200, 400: Y400,
};

const SERIES_IMP = [500, 300, 100];
const SERIES_PAR = [200, 400];
const TODAS      = [...SERIES_IMP, ...SERIES_PAR];

// ─── Quadra e X ──────────────────────────────────────────────────────────────
// Quadras reais: 101–116 (a série base ex. 100 não existe)
// Sul: coluna 0 (esq) = quadra 116 (mais perto do centro), coluna 15 = 101 (borda)
// Norte: coluna 0 (esq) = quadra 101 (mais perto do centro), coluna 15 = 116 (borda)
function getQuadra(serie: number, pi: number, asa: "Sul" | "Norte"): number {
  return asa === "Sul" ? serie + (N - pi) : serie + pi + 1;
}
const cellX = (pi: number) => PAD_X + pi * (CW + GW);

// ─── Cores ───────────────────────────────────────────────────────────────────
function cellFill(n: number, max: number, impar: boolean): string {
  if (n === 0) return impar ? "rgba(45,134,89,0.07)" : "rgba(175,82,45,0.07)";
  const t = max <= 1 ? 1 : n / max;
  const a = (0.20 + t * 0.70).toFixed(2);
  return impar ? `rgba(45,134,89,${a})` : `rgba(175,82,45,${a})`;
}
function cellStroke(n: number, impar: boolean): string {
  if (n === 0) return impar ? "rgba(45,134,89,0.18)" : "rgba(175,82,45,0.18)";
  return impar ? "rgba(45,134,89,0.45)" : "rgba(175,82,45,0.45)";
}
function textColor(n: number, max: number, impar: boolean): string {
  if (n === 0) return impar ? "rgba(45,134,89,0.35)" : "rgba(175,82,45,0.35)";
  const t = max <= 1 ? 1 : n / max;
  return t > 0.45
    ? "rgba(255,255,255,0.92)"
    : impar
    ? "rgba(45,134,89,0.90)"
    : "rgba(175,82,45,0.90)";
}

// ─── Componente ──────────────────────────────────────────────────────────────
export function MapaQuadras({
  businesses,
  onSelecionar,
}: {
  businesses: Business[];
  onSelecionar: (query: string) => void;
}) {
  const [asa, setAsa] = useState<"Sul" | "Norte">("Sul");

  const { counts, maxN } = useMemo(() => {
    const m = new Map<number, number>();
    for (const b of businesses) {
      if (b.asa !== asa) continue;
      m.set(b.quadra, (m.get(b.quadra) ?? 0) + 1);
    }
    let mx = 0;
    for (const v of m.values()) mx = Math.max(mx, v);
    return { counts: m, maxN: mx };
  }, [businesses, asa]);

  return (
    <div className="space-y-3">
      {/* Toggle Sul / Norte */}
      <div className="flex gap-2">
        {(["Sul", "Norte"] as const).map((a) => (
          <button
            key={a}
            onClick={() => setAsa(a)}
            className={[
              "rounded-lg px-5 py-2 text-sm font-bold transition-colors",
              asa === a
                ? "bg-verde text-branco"
                : "border border-linha bg-branco text-concreto hover:border-verde/50 hover:text-verde",
            ].join(" ")}
          >
            Asa {a}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="h-auto w-full max-w-[600px]"
          role="img"
          aria-label={`Mapa das quadras — Asa ${asa}`}
        >
          {/* Séries */}
          {TODAS.map((serie) => {
            const ry    = SERIE_Y[serie];
            const impar = SERIES_IMP.includes(serie);

            return (
              <g key={`s${serie}`}>
                {Array.from({ length: N }, (_, pi) => {
                  const q     = getQuadra(serie, pi, asa);
                  const n     = counts.get(q) ?? 0;
                  const ativo = n > 0;
                  const cx    = cellX(pi);

                  return (
                    <g
                      key={q}
                      role={ativo ? "button" : undefined}
                      tabIndex={ativo ? 0 : undefined}
                      aria-label={
                        ativo
                          ? `Quadra ${q} ${asa} — ${n} comércio${n !== 1 ? "s" : ""}`
                          : undefined
                      }
                      className={ativo ? "cursor-pointer" : undefined}
                      onClick={ativo ? () => onSelecionar(`${q} ${asa}`) : undefined}
                      onKeyDown={
                        ativo
                          ? (e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                onSelecionar(`${q} ${asa}`);
                              }
                            }
                          : undefined
                      }
                    >
                      <rect
                        x={cx} y={ry} width={CW} height={CH} rx={3}
                        fill={cellFill(n, maxN, impar)}
                        stroke={cellStroke(n, impar)}
                        strokeWidth={0.7}
                        className={ativo ? "transition-opacity hover:opacity-65" : ""}
                      />
                      {/* Número da quadra */}
                      <text
                        x={cx + CW / 2} y={ry + CH / 2}
                        textAnchor="middle" dominantBaseline="central"
                        fontSize="10" fontWeight={700}
                        fill={textColor(n, maxN, impar)}
                      >
                        {q}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Linha sutil separando ímpares de pares */}
          <line
            x1={PAD_X} y1={Y100 + CH + 9}
            x2={SVG_W - PAD_X} y2={Y100 + CH + 9}
            stroke="rgba(28,40,35,0.12)" strokeWidth={1} strokeDasharray="4 3"
          />
        </svg>
      </div>
    </div>
  );
}
