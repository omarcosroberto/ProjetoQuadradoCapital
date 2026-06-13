import Link from "next/link";

type Size = "sm" | "md" | "lg";

const BOX: Record<Size, string> = {
  sm: "h-7 w-7 text-sm",
  md: "h-9 w-9 text-lg",
  lg: "h-12 w-12 text-2xl",
};

const TEXT: Record<Size, string> = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-2xl",
};

/**
 * Logo do Quadrado Capital: bloco verde arredondado com "Q" branco em bold +
 * wordmark ao lado. Usar via <LogoQC /> (com link pra "/") ou
 * <LogoQC href={null} /> para versão estática.
 */
export function LogoQC({
  size = "md",
  href = "/",
  className = "",
  variant = "default",
}: {
  size?: Size;
  href?: string | null;
  className?: string;
  /** "default" usa cores escuras; "light" usa branco (fundo escuro). */
  variant?: "default" | "light";
}) {
  const wordColor =
    variant === "light" ? "text-branco" : "text-concreto";

  const inner = (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden
        className={`flex items-center justify-center rounded-lg bg-verde qc-brand leading-none text-branco ${BOX[size]}`}
      >
        Q
      </span>
      <span className={`qc-brand ${TEXT[size]} ${wordColor}`}>
        Quadrado <span className="text-verde-suave">Capital</span>
      </span>
    </span>
  );

  if (href === null) return inner;
  return (
    <Link href={href} aria-label="Quadrado Capital — início">
      {inner}
    </Link>
  );
}
