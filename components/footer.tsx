export function Footer() {
  return (
    <footer className="mt-auto bg-concreto text-branco">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-6 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="qc-brand text-lg text-branco">
            Quadrado <span className="text-verde-suave">Capital</span>
          </p>
          <p className="mt-1 text-sm text-branco/55">
            Comércios de Brasília, por quadra.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end sm:text-right">
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
            Site por Marcos Roberto PRO
          </a>
        </div>
      </div>
    </footer>
  );
}
