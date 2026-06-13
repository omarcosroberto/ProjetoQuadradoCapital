import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

/**
 * Gate de autenticação do painel. Vive num route group (dashboard) para NÃO
 * envolver a tela /admin/login — isso evita loop de redirect. Lê o cookie
 * "qc_admin"; se não bater com QC_ADMIN_PASS, manda pra /admin/login.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const authed =
    !!process.env.QC_ADMIN_PASS &&
    cookieStore.get("qc_admin")?.value === process.env.QC_ADMIN_PASS;

  if (!authed) redirect("/admin/login");

  return (
    <div className="flex min-h-dvh bg-ar text-concreto">
      {/* sidebar */}
      <aside className="flex w-56 shrink-0 flex-col bg-concreto text-branco">
        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center bg-verde qc-brand text-base leading-none text-branco">
              Q
            </span>
            <span className="qc-brand text-sm text-branco">
              Quadrado <span className="text-verde-suave">Admin</span>
            </span>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          <Link
            href="/admin"
            className="rounded-lg px-3 py-2 text-sm text-branco/80 transition-colors hover:bg-white/10 hover:text-branco"
          >
            Comércios
          </Link>
          <Link
            href="/admin/comercios/novo"
            className="rounded-lg px-3 py-2 text-sm text-branco/80 transition-colors hover:bg-white/10 hover:text-branco"
          >
            + Novo comércio
          </Link>
        </nav>
        <div className="border-t border-white/10 p-3">
          <Link
            href="/"
            className="block rounded-lg px-3 py-2 text-sm text-branco/60 transition-colors hover:text-verde-suave"
          >
            ← Ver site
          </Link>
        </div>
      </aside>

      {/* conteúdo */}
      <main className="flex-1 overflow-x-auto p-8">{children}</main>
    </div>
  );
}
