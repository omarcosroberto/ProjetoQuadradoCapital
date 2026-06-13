import Link from "next/link";
import { createAdminClient } from "@/lib/supabase-admin";
import { SEED_BUSINESSES } from "@/lib/seed";
import { deletarComercio } from "./actions";

export const dynamic = "force-dynamic";

type Row = {
  slug: string;
  nome: string;
  categoria: string;
  asa: string;
  quadra: number;
  bloco: string | null;
  capivaras: number | string | null;
  avaliacoes: number | null;
  ativo: boolean | null;
};

async function carregarComercios(): Promise<{ rows: Row[]; usandoSeed: boolean }> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return {
      usandoSeed: true,
      rows: SEED_BUSINESSES.map((b) => ({
        slug: b.id,
        nome: b.nome,
        categoria: b.categoria,
        asa: b.asa,
        quadra: b.quadra,
        bloco: b.bloco || null,
        capivaras: b.capivaras,
        avaliacoes: b.avaliacoes,
        ativo: true,
      })),
    };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("comercios")
    .select(
      "slug,nome,categoria,asa,quadra,bloco,capivaras,avaliacoes,ativo",
    )
    .order("asa", { ascending: true })
    .order("quadra", { ascending: true })
    .order("bloco", { ascending: true });

  if (error) {
    console.error("[QC admin] Falha ao listar comércios:", error);
    return { usandoSeed: false, rows: [] };
  }
  return { usandoSeed: false, rows: (data ?? []) as Row[] };
}

export default async function AdminPage() {
  const { rows, usandoSeed } = await carregarComercios();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="qc-display text-2xl text-concreto">Comércios</h1>
          <p className="mt-1 text-sm text-concreto-claro">
            {rows.length} {rows.length === 1 ? "comércio" : "comércios"} no
            diretório
            {usandoSeed ? " (modo seed — Supabase não configurado)" : ""}.
          </p>
        </div>
        <Link
          href="/admin/comercios/novo"
          className="rounded-lg bg-verde px-4 py-2 text-sm font-semibold text-branco transition-colors hover:bg-verde-escuro"
        >
          + Novo comércio
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-linha bg-branco">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-linha text-left text-xs font-semibold uppercase tracking-wide text-concreto-claro">
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Quadra</th>
              <th className="px-4 py-3">Bloco</th>
              <th className="px-4 py-3">Asa</th>
              <th className="px-4 py-3">Capivaras</th>
              <th className="px-4 py-3">Avaliações</th>
              <th className="px-4 py-3">Ativo</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-8 text-center text-concreto-claro"
                >
                  Nenhum comércio cadastrado.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr
                  key={r.slug}
                  className="border-b border-linha last:border-0 hover:bg-ar"
                >
                  <td className="px-4 py-3 font-semibold text-concreto">
                    {r.nome}
                  </td>
                  <td className="px-4 py-3 text-concreto-claro">{r.categoria}</td>
                  <td className="px-4 py-3 text-concreto-claro">{r.quadra}</td>
                  <td className="px-4 py-3 text-concreto-claro">
                    {r.bloco || "—"}
                  </td>
                  <td className="px-4 py-3 text-concreto-claro">{r.asa}</td>
                  <td className="px-4 py-3 text-concreto-claro">
                    {Number(r.capivaras ?? 0).toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-concreto-claro">
                    {r.avaliacoes ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        r.ativo
                          ? "bg-verde/10 text-verde"
                          : "bg-aviso/10 text-aviso"
                      }`}
                    >
                      {r.ativo ? "Sim" : "Não"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/comercio/${r.slug}`}
                        className="rounded-md border border-linha px-2.5 py-1 text-xs font-semibold text-concreto transition-colors hover:border-verde hover:text-verde"
                      >
                        Ver
                      </Link>
                      <form action={deletarComercio}>
                        <input type="hidden" name="slug" value={r.slug} />
                        <button
                          type="submit"
                          className="rounded-md border border-linha px-2.5 py-1 text-xs font-semibold text-aviso transition-colors hover:border-aviso hover:bg-aviso/10"
                        >
                          Deletar
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
