"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { createAuthClient } from "@/lib/supabase";
import {
  reivindicarNegocio,
  type ClaimState,
} from "@/app/comercio/[slug]/claim-negocio-action";

const initial: ClaimState = { ok: false };

type Status = "pendente" | "aprovada" | "rejeitada";

/**
 * Reivindicação de propriedade para usuários LOGADOS.
 * Distinta do lead-gen ClaimForm (que captura prospects anônimos).
 * Mostra: botão "Sou o dono" → formulário → estados pendente/aprovada/rejeitada.
 */
export function ClaimNegocio({ slug }: { slug: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [statusExistente, setStatusExistente] = useState<Status | null>(null);
  const [aberto, setAberto] = useState(false);

  const [state, formAction, pending] = useActionState(
    reivindicarNegocio,
    initial,
  );

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
  }, [slug, state.ok]);

  if (carregando) {
    return <p className="text-sm text-concreto-claro">Carregando…</p>;
  }

  // Não logado: convida ao login.
  if (!user) {
    return (
      <div className="rounded-xl border border-linha bg-ar p-4 text-sm text-concreto">
        <p>É o dono deste negócio?</p>
        <Link
          href="/entrar"
          className="mt-2 inline-block rounded-lg bg-verde px-4 py-2 text-sm font-semibold text-branco transition-colors hover:bg-verde-escuro"
        >
          Entrar para reivindicar
        </Link>
      </div>
    );
  }

  // Já aprovado: leva ao painel do dono.
  const estado = state.ok ? "pendente" : statusExistente;

  if (estado === "aprovada") {
    return (
      <div className="rounded-xl border border-verde/30 bg-verde/5 p-4 text-sm text-concreto">
        <p className="qc-display text-base text-verde-escuro">
          Você é o dono ✓
        </p>
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
      <div className="rounded-xl border border-aviso/40 bg-aviso/5 p-4 text-sm text-concreto">
        <p className="qc-display text-base text-concreto">
          Reivindicação em análise
        </p>
        <p className="mt-1 text-concreto-claro">
          Recebemos seu pedido. Em breve confirmamos que o perfil é seu.
        </p>
      </div>
    );
  }

  if (estado === "rejeitada") {
    return (
      <div className="rounded-xl border border-linha bg-ar p-4 text-sm text-concreto">
        <p className="text-concreto">
          Sua reivindicação anterior não pôde ser confirmada. Fale com a gente
          se acha que houve um engano.
        </p>
      </div>
    );
  }

  // Nunca reivindicado: botão + formulário.
  if (!aberto) {
    return (
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="rounded-lg border border-verde/40 bg-verde/5 px-4 py-2.5 text-sm font-semibold text-verde-escuro transition-colors hover:bg-verde/10"
      >
        Sou o dono deste negócio — Reivindicar
      </button>
    );
  }

  return (
    <form action={formAction} className="grid gap-3">
      <input type="hidden" name="slug" value={slug} />
      <textarea
        name="mensagem"
        rows={3}
        maxLength={500}
        placeholder="Como podemos confirmar que você é o dono? (opcional)"
        className="resize-none rounded-lg border border-linha bg-branco px-3.5 py-2.5 text-sm text-concreto placeholder:text-concreto-claro focus:border-verde focus:outline-none"
      />
      {state.error && (
        <p className="text-sm font-medium text-aviso">{state.error}</p>
      )}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-verde px-5 py-2.5 text-sm font-semibold text-branco transition-colors hover:bg-verde-escuro disabled:opacity-60"
        >
          {pending ? "Enviando…" : "Enviar reivindicação"}
        </button>
        <button
          type="button"
          onClick={() => setAberto(false)}
          className="rounded-lg px-3 py-2 text-sm text-concreto-claro hover:text-concreto"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
