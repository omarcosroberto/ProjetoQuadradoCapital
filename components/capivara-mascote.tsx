/**
 * Capivara mascote — front-facing, friendly. Usada no hero e estados vazios.
 * Cabeça blocada (focinho retangular típico da capivara), olhos/orelhas/narinas
 * altos. Cor capivara (#8b6f47) sobre um tufo de grama verde (quadra = jardim).
 */
export function CapivaraMascote({
  className = "h-40 w-auto",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 170 180"
      className={className}
      role="img"
      aria-label="Capivara, mascote do Quadrado Capital"
    >
      {/* sombra / grama */}
      <ellipse cx="85" cy="168" rx="58" ry="10" fill="#2d8659" opacity="0.16" />
      <path
        d="M40 168 q4 -14 9 0 M56 168 q4 -16 9 0 M104 168 q4 -16 9 0 M120 168 q4 -14 9 0"
        stroke="#2d8659"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />

      {/* corpo (loaf) */}
      <rect x="34" y="96" width="102" height="68" rx="32" fill="#8b6f47" />
      {/* patas */}
      <rect x="50" y="150" width="24" height="16" rx="8" fill="#755c39" />
      <rect x="96" y="150" width="24" height="16" rx="8" fill="#755c39" />

      {/* cabeça blocada */}
      <rect x="36" y="24" width="98" height="90" rx="30" fill="#8b6f47" />
      {/* orelhas */}
      <ellipse cx="52" cy="30" rx="12" ry="10" fill="#8b6f47" />
      <ellipse cx="118" cy="30" rx="12" ry="10" fill="#8b6f47" />
      <ellipse cx="52" cy="32" rx="5" ry="4" fill="#6f5836" />
      <ellipse cx="118" cy="32" rx="5" ry="4" fill="#6f5836" />

      {/* focinho */}
      <rect x="56" y="72" width="58" height="36" rx="17" fill="#9c8056" />

      {/* olhos */}
      <circle cx="66" cy="58" r="7.5" fill="#2f3435" />
      <circle cx="69" cy="55" r="2.4" fill="#ffffff" />
      <circle cx="104" cy="58" r="7.5" fill="#2f3435" />
      <circle cx="107" cy="55" r="2.4" fill="#ffffff" />

      {/* narinas */}
      <ellipse cx="77" cy="84" rx="3.2" ry="4.2" fill="#5e4a2e" />
      <ellipse cx="93" cy="84" rx="3.2" ry="4.2" fill="#5e4a2e" />
      {/* boca */}
      <path
        d="M74 96 Q85 104 96 96"
        stroke="#5e4a2e"
        strokeWidth="2.8"
        fill="none"
        strokeLinecap="round"
      />

      {/* detalhe orelha interna mais clara */}
      <ellipse cx="52" cy="28" rx="4" ry="3" fill="#a07850" />
      <ellipse cx="118" cy="28" rx="4" ry="3" fill="#a07850" />
    </svg>
  );
}
