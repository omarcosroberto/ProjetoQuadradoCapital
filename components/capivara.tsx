import { useId } from "react";

/** Cabeça de capivara — derivada de brand/quadrado-capital/capivara-rating.svg */
function Cabeca({ mode }: { mode: "fill" | "outline" }) {
  if (mode === "outline") {
    const s = {
      fill: "none",
      stroke: "var(--qc-linha)",
      strokeWidth: 2,
    } as const;
    return (
      <g>
        <ellipse cx="32" cy="40" rx="24" ry="28" {...s} />
        <circle cx="16" cy="18" r="7" {...s} />
        <circle cx="48" cy="18" r="7" {...s} />
        <circle cx="24" cy="35" r="4" {...s} />
        <circle cx="40" cy="35" r="4" {...s} />
        <ellipse cx="32" cy="48" rx="3" ry="2.5" {...s} />
        <path d="M 28 52 Q 32 54 36 52" stroke="var(--qc-linha)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>
    );
  }
  return (
    <g>
      <ellipse cx="32" cy="40" rx="24" ry="28" fill="var(--qc-verde)" />
      <circle cx="16" cy="18" r="7" fill="var(--qc-verde)" />
      <circle cx="48" cy="18" r="7" fill="var(--qc-verde)" />
      <circle cx="24" cy="35" r="4" fill="#1a1a1a" />
      <circle cx="24.5" cy="33.5" r="1.5" fill="#fff" />
      <circle cx="40" cy="35" r="4" fill="#1a1a1a" />
      <circle cx="40.5" cy="33.5" r="1.5" fill="#fff" />
      <ellipse cx="32" cy="48" rx="3" ry="2.5" fill="#1a1a1a" />
      <path d="M 28 52 Q 32 54 36 52" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

function CapivaraIcon({
  variant,
  className = "h-5 w-[18px]",
}: {
  variant: "full" | "half" | "empty";
  className?: string;
}) {
  const clip = useId();
  return (
    <svg viewBox="0 0 64 72" className={className} role="presentation">
      {variant === "half" && (
        <defs>
          <clipPath id={clip}>
            <rect x="0" y="0" width="32" height="72" />
          </clipPath>
        </defs>
      )}
      <Cabeca mode="outline" />
      {variant !== "empty" && (
        <g clipPath={variant === "half" ? `url(#${clip})` : undefined}>
          <Cabeca mode="fill" />
        </g>
      )}
    </svg>
  );
}

export function CapivaraRating({
  value,
  count,
  size,
}: {
  value: number;
  count?: number;
  size?: string;
}) {
  const r = Math.round(value * 2) / 2;
  const full = Math.floor(r);
  const hasHalf = r % 1 !== 0;

  return (
    <div
      className="flex items-center gap-2"
      role="img"
      aria-label={`${value.toFixed(1)} de 5 capivaras`}
    >
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <CapivaraIcon
            key={i}
            className={size}
            variant={i < full ? "full" : i === full && hasHalf ? "half" : "empty"}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-concreto">
        {value.toFixed(1).replace(".", ",")}
      </span>
      {count != null && (
        <span className="text-sm text-concreto-claro">({count})</span>
      )}
    </div>
  );
}
