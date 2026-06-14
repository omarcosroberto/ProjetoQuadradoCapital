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
          ? "Comércio verificado pelo Quadrado Capital"
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
      {/* Ícone de escudo com check — verificação */}
      <svg
        viewBox="0 0 20 20"
        className={isMd ? "h-3.5 w-3.5" : "h-3 w-3"}
        fill="currentColor"
        aria-hidden
      >
        {verificado ? (
          <>
            <path
              fillRule="evenodd"
              d="M10 1.5L3 4.5v5c0 4 3.1 7.5 7 8.5 3.9-1 7-4.5 7-8.5v-5L10 1.5zm-.75 9.28L7.22 8.75l-1.06 1.06 3.09 3.09 5.59-5.59-1.06-1.06-4.53 4.53z"
            />
          </>
        ) : (
          <path
            fillRule="evenodd"
            d="M10 1.5L3 4.5v5c0 4 3.1 7.5 7 8.5 3.9-1 7-4.5 7-8.5v-5L10 1.5zm0 12.8c-2.9-.9-5-3.7-5-6.3V6.1l5-2.2 5 2.2v1.9c0 2.6-2.1 5.4-5 6.3z"
            opacity={0.5}
          />
        )}
      </svg>
      {verificado ? "Verificado" : "Não verificado"}
    </span>
  );
}
