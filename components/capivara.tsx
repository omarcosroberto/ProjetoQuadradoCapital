import { CAPY_LABELS } from "@/components/capivara-face";

const FADE_STYLE = "opacity(0.3) grayscale(0.6)";

/** Mostra a capivara mascote — usada no seletor do formulário. */
export function CapivaraSprite({
  nivel: _nivel,
  className = "h-16 w-16",
}: {
  nivel: number;
  className?: string;
}) {
  return (
    <div
      role="presentation"
      className={className}
      style={{
        backgroundImage: "url(/capivara.png)",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}

/**
 * Mostra as 5 capivaras como sistema de score.
 * Sem avaliação → todas coloridas. Conforme a nota cai, capivaras ficam apagadas.
 */
export function CapivaraRating({
  value,
  count,
}: {
  value: number;
  count?: number;
}) {
  const semAvaliacao = count === 0 || value === 0;
  const nivel = semAvaliacao ? 5 : Math.min(5, Math.max(1, Math.round(value)));
  const label = CAPY_LABELS[nivel];

  return (
    <div
      className="flex flex-col gap-2"
      role="img"
      aria-label={`${value.toFixed(1)} de 5 capivaras — ${label}`}
    >
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = semAvaliacao ? 1 : Math.min(1, Math.max(0, value - (i - 1)));
          const baseStyle = {
            backgroundImage: "url(/capivara.png)",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat" as const,
          };

          if (fill <= 0) {
            return (
              <div
                key={i}
                className="h-10 w-10 shrink-0"
                style={{ ...baseStyle, filter: FADE_STYLE }}
              />
            );
          }

          if (fill >= 1) {
            return (
              <div
                key={i}
                className="h-10 w-10 shrink-0"
                style={baseStyle}
              />
            );
          }

          // Preenchimento parcial: base apagada + overlay original cortado
          return (
            <div key={i} className="relative h-10 w-10 shrink-0">
              <div
                className="absolute inset-0"
                style={{ ...baseStyle, filter: FADE_STYLE }}
              />
              <div
                className="absolute inset-0"
                style={{
                  ...baseStyle,
                  clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)`,
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold leading-none text-concreto">
          {value.toFixed(1).replace(".", ",")}
        </span>
        <span className="text-xs font-semibold text-verde-escuro">{label}</span>
        {count != null && (
          <span className="text-xs text-concreto-claro">
            {count} {count === 1 ? "avaliação" : "avaliações"}
          </span>
        )}
      </div>
    </div>
  );
}
