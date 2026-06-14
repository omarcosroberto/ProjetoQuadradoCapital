import Link from "next/link";

/** Capivara icon — monochrome, adapta ao fundo escuro do footer */
function CapivaraIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      {/* cabeça */}
      <ellipse cx="50" cy="72" rx="28" ry="32" fill="currentColor" />
      {/* orelhas */}
      <circle cx="24" cy="42" r="9" fill="currentColor" />
      <circle cx="76" cy="42" r="9" fill="currentColor" />
      {/* olho esquerdo */}
      <circle cx="38" cy="64" r="5" fill="#0f1f14" />
      <circle cx="39.5" cy="62.5" r="1.6" fill="#fff" />
      {/* olho direito */}
      <circle cx="62" cy="64" r="5" fill="#0f1f14" />
      <circle cx="63.5" cy="62.5" r="1.6" fill="#fff" />
      {/* nariz */}
      <ellipse cx="50" cy="76" rx="4" ry="3" fill="#0f1f14" />
      {/* boca */}
      <path d="M 44 82 Q 50 86 56 82" stroke="#0f1f14" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* acento folha verde */}
      <path d="M 66 36 L 72 26 L 76 36 Q 72 32 66 36" fill="#4ade80" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto bg-concreto text-branco">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-8 px-6 py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          {/* Logo: capivara + wordmark */}
          <div className="flex items-center gap-3">
            <CapivaraIcon className="h-12 w-auto text-verde-suave" />
            <div>
              <p className="qc-brand text-lg text-branco">
                Quadrado <span className="text-verde-suave">Capital</span>
              </p>
              <p className="mt-0.5 text-sm text-branco/55">
                Comércios de Brasília, por quadra.
              </p>
            </div>
          </div>

          {/* navegação legal + conta */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link
              href="/entrar"
              className="text-branco/70 transition-colors hover:text-verde-suave"
            >
              Entrar
            </Link>
            <Link
              href="/privacidade"
              className="text-branco/70 transition-colors hover:text-verde-suave"
            >
              Privacidade
            </Link>
            <Link
              href="/termos"
              className="text-branco/70 transition-colors hover:text-verde-suave"
            >
              Termos
            </Link>
            <Link
              href="/cookies"
              className="text-branco/70 transition-colors hover:text-verde-suave"
            >
              Cookies
            </Link>
          </nav>
        </div>

        <div className="flex flex-col items-start gap-2 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <a
            href="https://planopilotodigital.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-branco/45 transition-colors hover:text-verde-suave"
          >
            uma empresa Plano Piloto Digital
          </a>
          <a
            href="https://www.marcosroberto.pro"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-branco/30 transition-colors hover:text-verde-suave"
          >
            © 2026 Marcos Roberto PRO · Todos os direitos reservados.
          </a>
        </div>
      </div>
    </footer>
  );
}
