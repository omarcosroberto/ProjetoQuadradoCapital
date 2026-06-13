import Link from "next/link";
import { LogoQC } from "@/components/logo-qc";
import { Footer } from "@/components/footer";

/** Shell de página de conteúdo (legais): header com logo + footer + prosa QC. */
export function PaginaLegal({
  titulo,
  atualizado,
  children,
}: {
  titulo: string;
  atualizado?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-ar">
      <header className="bg-concreto px-6 py-4">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between">
          <LogoQC variant="light" />
          <Link
            href="/"
            className="text-sm text-branco/70 transition-colors hover:text-verde-suave"
          >
            ← Voltar à busca
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[760px] flex-1 px-6 py-12">
        <h1 className="qc-display text-3xl text-concreto">{titulo}</h1>
        {atualizado && (
          <p className="mt-2 text-sm text-concreto-claro">
            Última atualização: {atualizado}
          </p>
        )}
        <div className="qc-legal mt-8 text-[15px] leading-relaxed text-concreto-claro">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
