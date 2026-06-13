/**
 * Folha verde = verificado pelo QC (presença forte no Google).
 * Folha cinza com sombra = ainda não verificado.
 * Símbolo escolhido porque a capivara é herbívora — come folhas.
 */

export function FolhaCapivara({
  verificado,
  size = "sm",
}: {
  verificado: boolean;
  size?: "sm" | "md";
}) {
  const isMd = size === "md";
  return (
    <span
      title={
        verificado
          ? "Comércio verificado pelo Quadrado Capital 🌿"
          : "Ainda não verificado — em análise"
      }
      aria-label={verificado ? "Verificado" : "Não verificado"}
      className={[
        "inline-flex shrink-0 items-center gap-1 rounded-full font-semibold leading-none transition-colors",
        isMd ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[11px]",
        verificado
          ? "bg-verde/10 text-verde"
          : "bg-concreto/8 text-concreto/30",
      ].join(" ")}
    >
      <svg
        viewBox="0 0 24 24"
        className={[
          isMd ? "h-4 w-4" : "h-3.5 w-3.5",
          !verificado &&
            "drop-shadow-[0_1px_1px_rgba(0,0,0,0.12)]",
        ]
          .filter(Boolean)
          .join(" ")}
        fill="currentColor"
        aria-hidden
      >
        {/* Haste */}
        <path
          d="M12 21 C12 21 11 14 9 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        {/* Folha */}
        <path d="M9.5 10.5 C6 8 4 4 9 3 C14 2 17 6 15 9.5 C13.5 12 10.5 12 9.5 10.5 Z" />
      </svg>
      {verificado ? "Verificado" : "Não verificado"}
    </span>
  );
}
