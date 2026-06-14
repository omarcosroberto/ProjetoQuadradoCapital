"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { createAuthClient } from "@/lib/supabase";

type Status = "pendente" | "aprovada" | "rejeitada";

type DocField = {
  key: "cnpj" | "alvara" | "vinculo";
  label: string;
  hint: string;
};

const DOCS: DocField[] = [
  {
    key: "cnpj",
    label: "Cartão CNPJ atualizado",
    hint: "Situação cadastral ativa e CNAE correto",
  },
  {
    key: "alvara",
    label: "Alvará de Funcionamento",
    hint: "Emitido pela prefeitura para o endereço físico",
  },
  {
    key: "vinculo",
    label: "Comprovante de Vínculo",
    hint: "Contrato Social ou Procuração do responsável",
  },
];

function UploadField({
  doc,
  file,
  onChange,
}: {
  doc: DocField;
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <p className="text-xs font-semibold text-concreto">{doc.label}</p>
      <p className="mb-1.5 text-[11px] text-concreto-claro">{doc.hint}</p>
      <div
        className={[
          "flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors",
          file
            ? "border-verde/50 bg-verde/5"
            : "border-linha bg-ar hover:border-verde/40",
        ].join(" ")}
        onClick={() => ref.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && ref.current?.click()}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 shrink-0 text-concreto-claro"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <span className="min-w-0 truncate text-xs text-concreto">
          {file ? file.name : "Selecionar arquivo (PDF, JPG, PNG)"}
        </span>
        {file && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
              if (ref.current) ref.current.value = "";
            }}
            className="ml-auto shrink-0 text-concreto-claro hover:text-aviso"
          >
            ✕
          </button>
        )}
      </div>
      <input
        ref={ref}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}

export function ClaimNegocio({ slug }: { slug: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [statusExistente, setStatusExistente] = useState<Status | null>(null);
  const [aberto, setAberto] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [docs, setDocs] = useState<Record<string, File | null>>({
    cnpj: null,
    alvara: null,
    vinculo: null,
  });
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const supabase = createAuthClient();
    let ativo = true;

    async function carregar() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!ativo) return;
      setUser(user ?? null);

      if (user) {
        const { data } = await supabase
          .from("qc_reivindicacoes")
          .select("status")
          .eq("user_id", user.id)
          .eq("comercio_slug", slug)
          .maybeSingle();
        if (ativo) setStatusExistente((data?.status ?? null) as Status | null);
      }
      if (ativo) setCarregando(false);
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [slug, ok]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    const faltando = DOCS.filter((d) => !docs[d.key]);
    if (faltando.length > 0) {
      setErro(`Anexe todos os documentos: ${faltando.map((d) => d.label).join(", ")}.`);
      return;
    }

    setEnviando(true);
    const supabase = createAuthClient();

    try {
      // Upload de cada documento para o Storage
      const urls: Record<string, string> = {};
      for (const doc of DOCS) {
        const file = docs[doc.key]!;
        const ext = file.name.split(".").pop();
        const path = `reivindicacoes/${user!.id}/${slug}/${doc.key}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("qc-documentos")
          .upload(path, file, { upsert: true });
        if (upErr) throw new Error(`Falha ao enviar ${doc.label}: ${upErr.message}`);
        const { data: urlData } = supabase.storage
          .from("qc-documentos")
          .getPublicUrl(path);
        urls[doc.key] = urlData.publicUrl;
      }

      // Inserir a reivindicação com os URLs dos documentos
      const { error: insErr } = await supabase.from("qc_reivindicacoes").insert({
        user_id: user!.id,
        comercio_slug: slug,
        mensagem: mensagem.trim() || null,
        doc_cnpj_url: urls.cnpj,
        doc_alvara_url: urls.alvara,
        doc_vinculo_url: urls.vinculo,
      });

      if (insErr) {
        if (insErr.code === "23505") {
          setErro("Você já enviou uma reivindicação para este comércio.");
          return;
        }
        throw insErr;
      }

      setOk(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido.";
      setErro(msg);
    } finally {
      setEnviando(false);
    }
  }

  if (carregando) return <p className="text-sm text-concreto-claro">Carregando…</p>;

  if (!user) {
    return (
      <div className="rounded-xl border border-linha bg-ar p-4 text-sm text-concreto">
        <p>Faça login com um perfil empresarial para reivindicar.</p>
        <Link
          href="/entrar"
          className="mt-2 inline-block rounded-lg bg-verde px-4 py-2 text-sm font-semibold text-branco transition-colors hover:bg-verde-escuro"
        >
          Entrar
        </Link>
      </div>
    );
  }

  const estado = ok ? "pendente" : statusExistente;

  if (estado === "aprovada") {
    return (
      <div className="rounded-xl border border-verde/30 bg-verde/5 p-4 text-sm">
        <p className="qc-display text-base text-verde-escuro">Você é o dono ✓</p>
        <Link
          href={`/meu-negocio/${slug}`}
          className="mt-2 inline-block rounded-lg bg-verde px-4 py-2 text-sm font-semibold text-branco transition-colors hover:bg-verde-escuro"
        >
          Abrir painel do negócio
        </Link>
      </div>
    );
  }

  if (estado === "pendente") {
    return (
      <div className="rounded-xl border border-aviso/40 bg-aviso/5 p-4 text-sm">
        <p className="qc-display text-base text-concreto">Reivindicação em análise</p>
        <p className="mt-1 text-concreto-claro">
          Recebemos seus documentos. Em breve confirmamos que o perfil é seu.
        </p>
      </div>
    );
  }

  if (estado === "rejeitada") {
    return (
      <div className="rounded-xl border border-linha bg-ar p-4 text-sm text-concreto">
        <p>Sua reivindicação anterior não pôde ser confirmada. Fale com a gente se acha que houve um engano.</p>
      </div>
    );
  }

  if (!aberto) {
    return (
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="rounded-lg border border-verde/40 bg-verde/5 px-4 py-2.5 text-sm font-semibold text-verde-escuro transition-colors hover:bg-verde/10"
      >
        Sou o dono — Enviar documentos para reivindicar
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <p className="text-xs text-concreto-claro">
        Para confirmar a propriedade, precisamos de 3 documentos:
      </p>

      {DOCS.map((doc) => (
        <UploadField
          key={doc.key}
          doc={doc}
          file={docs[doc.key]}
          onChange={(f) => setDocs((prev) => ({ ...prev, [doc.key]: f }))}
        />
      ))}

      <textarea
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
        rows={2}
        maxLength={500}
        placeholder="Informações adicionais (opcional)"
        className="resize-none rounded-lg border border-linha bg-branco px-3.5 py-2.5 text-sm text-concreto placeholder:text-concreto-claro focus:border-verde focus:outline-none"
      />

      {erro && (
        <p className="rounded-lg bg-aviso/10 px-3 py-2 text-sm font-medium text-aviso">
          {erro}
        </p>
      )}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={enviando}
          className="rounded-lg bg-verde px-5 py-2.5 text-sm font-semibold text-branco transition-colors hover:bg-verde-escuro disabled:opacity-60"
        >
          {enviando ? "Enviando documentos…" : "Enviar reivindicação"}
        </button>
        <button
          type="button"
          onClick={() => setAberto(false)}
          className="rounded-lg px-3 py-2 text-sm text-concreto-claro hover:text-concreto"
        >
          Cancelar
        </button>
      </div>

      <p className="text-xs text-concreto-claro">
        Os documentos são usados apenas para verificação e ficam armazenados com segurança.
      </p>
    </form>
  );
}
