/**
 * Bandeira = proprietário reivindicou este negócio.
 * Cinza = ainda não reivindicado (convida a ação).
 */

export function BandeiraReivindicado({
  reivindicado,
  size = "sm",
}: {
  reivindicado: boolean;
  size?: "sm" | "md";
}) {
  const isMd = size === "md";
  return (
    <span
      title={
        reivindicado
          ? "Negócio reivindicado pelo proprietário ✅"
          : "Proprietário ainda não reivindicou — você é o dono? Reivindique!"
      }
      aria-label={reivindicado ? "Reivindicado" : "Não reivindicado"}
      className={[
        "inline-flex shrink-0 items-center gap-1 rounded-full font-semibold leading-none transition-colors",
        isMd ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[11px]",
        reivindicado
          ? "bg-capivara/10 text-capivara"
          : "bg-concreto/8 text-concreto/30",
      ].join(" ")}
    >
      {/* Bandeirinha em mastro — símbolo de "plantar bandeira" = reivindicar */}
      <svg
        viewBox="0 0 24 24"
        className={[
          isMd ? "h-4 w-4" : "h-3.5 w-3.5",
          !reivindicado && "drop-shadow-[0_1px_1px_rgba(0,0,0,0.12)]",
        ]
          .filter(Boolean)
          .join(" ")}
        fill="currentColor"
        aria-hidden
      >
        {/* Mastro */}
        <line
          x1="5"
          y1="2"
          x2="5"
          y2="22"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        {/* Bandeira ondulando à direita */}
        <path d="M5 3 C9 2 14 2 19 5 C14 8.5 9 9 5 8 Z" />
      </svg>
      {reivindicado ? "Reivindicado" : "Não reivindicado"}
    </span>
  );
}
