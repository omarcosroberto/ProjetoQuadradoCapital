import { createAdminClient } from "@/lib/supabase-admin";
import { aprovarReivindicacao, rejeitarReivindicacao } from "./actions";

export const dynamic = "force-dynamic";

type ReivRow = {
  id: string;
  user_id: string;
  comercio_slug: string;
  status: string;
  mensagem: string | null;
  created_at: string;
  doc_cnpj_url: string | null;
  doc_alvara_url: string | null;
  doc_vinculo_url: string | null;
};

type Enriquecida = ReivRow & {
  comercioNome: string;
  email: string;
};

async function carregar(): Promise<Enriquecida[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return [];
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("qc_reivindicacoes")
    .select(
      "id,user_id,comercio_slug,status,mensagem,created_at,doc_cnpj_url,doc_alvara_url,doc_vinculo_url",
    )
    .eq("status", "pendente")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[QC admin] Falha ao listar reivindicações:", error);
    return [];
  }

  const rows = (data ?? []) as ReivRow[];
  if (rows.length === 0) return [];

  // Nomes dos comércios.
  const slugs = [...new Set(rows.map((r) => r.comercio_slug))];
  const { data: comercios } = await supabase
    .from("comercios")
    .select("slug,nome")
    .in("slug", slugs);
  const nomePorSlug = new Map(
    (comercios ?? []).map((c: { slug: string; nome: string }) => [
      c.slug,
      c.nome,
    ]),
  );

  // E-mails dos usuários (auth.users via admin API, não dá join via PostgREST).
  const emailPorUser = new Map<string, string>();
  await Promise.all(
    [...new Set(rows.map((r) => r.user_id))].map(async (uid) => {
      try {
        const { data } = await supabase.auth.admin.getUserById(uid);
        if (data?.user?.email) emailPorUser.set(uid, data.user.email);
      } catch {
        /* ignore */
      }
    }),
  );

  return rows.map((r) => ({
    ...r,
    comercioNome: nomePorSlug.get(r.comercio_slug) ?? r.comercio_slug,
    email: emailPorUser.get(r.user_id) ?? "—",
  }));
}

function formatarData(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

const DOCS_LABELS: { key: keyof ReivRow; label: string }[] = [
  { key: "doc_cnpj_url", label: "Cartão CNPJ" },
  { key: "doc_alvara_url", label: "Alvará de Funcionamento" },
  { key: "doc_vinculo_url", label: "Comprovante de Vínculo" },
];

export default async function ReivindicacoesPage() {
  const lista = await carregar();

  return (
    <div>
      <div>
        <h1 className="qc-display text-2xl text-concreto">Reivindicações</h1>
        <p className="mt-1 text-sm text-concreto-claro">
          {lista.length} pendente{lista.length === 1 ? "" : "s"} de análise.
        </p>
      </div>

      {lista.length === 0 ? (
        <div className="mt-6 rounded-xl border border-linha bg-branco p-8 text-center text-sm text-concreto-claro">
          Nenhuma reivindicação pendente.
        </div>
      ) : (
        <ul className="mt-6 grid gap-4">
          {lista.map((r) => (
            <li
              key={r.id}
              className="rounded-xl border border-linha bg-branco p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="qc-display text-base text-concreto">
                    {r.comercioNome}
                  </p>
                  <p className="mt-0.5 text-sm text-concreto-claro">
                    {r.email} · enviado em {formatarData(r.created_at)}
                  </p>
                  <p className="mt-0.5 text-xs text-concreto-claro">
                    slug: {r.comercio_slug}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <form action={aprovarReivindicacao}>
                    <input type="hidden" name="id" value={r.id} />
                    <button
                      type="submit"
                      className="rounded-md bg-verde px-3 py-1.5 text-xs font-semibold text-branco transition-colors hover:bg-verde-escuro"
                    >
                      Aprovar
                    </button>
                  </form>
                  <form action={rejeitarReivindicacao}>
                    <input type="hidden" name="id" value={r.id} />
                    <button
                      type="submit"
                      className="rounded-md border border-linha px-3 py-1.5 text-xs font-semibold text-aviso transition-colors hover:border-aviso hover:bg-aviso/10"
                    >
                      Rejeitar
                    </button>
                  </form>
                </div>
              </div>

              {/* Documentos enviados */}
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {DOCS_LABELS.map(({ key, label }) => {
                  const url = r[key] as string | null;
                  return (
                    <div
                      key={key}
                      className={`rounded-lg border p-3 ${
                        url
                          ? "border-verde/30 bg-verde/5"
                          : "border-linha bg-ar opacity-50"
                      }`}
                    >
                      <p className="text-[11px] font-semibold text-concreto-claro uppercase tracking-wide">
                        {label}
                      </p>
                      {url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-verde hover:text-verde-escuro"
                        >
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-3.5 w-3.5 shrink-0"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Ver documento
                        </a>
                      ) : (
                        <p className="mt-1 text-xs text-concreto-claro">
                          Não enviado
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {r.mensagem && (
                <p className="mt-3 rounded-lg bg-ar p-3 text-sm text-concreto-claro">
                  "{r.mensagem}"
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
