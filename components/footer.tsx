import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto bg-concreto text-branco">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-8 px-6 py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="qc-brand text-lg text-branco">
              Quadrado <span className="text-verde-suave">Capital</span>
            </p>
            <p className="mt-1 text-sm text-branco/55">
              Comércios de Brasília, por quadra.
            </p>
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
