"use client";

import { useActionState } from "react";
import { criarReivindicacao, type FormState } from "./actions";

const initial: FormState = { ok: false };

type Variant = "reivindicacao" | "lead_mrp";

const COPY: Record<
  Variant,
  { placeholderMsg: string; cta: string; sucesso: string }
> = {
  reivindicacao: {
    placeholderMsg: "Conta um pouco sobre o seu comércio (opcional)",
    cta: "Reivindicar este perfil",
    sucesso:
      "Recebemos sua reivindicação! Em breve a gente entra em contato para confirmar que o perfil é seu.",
  },
  lead_mrp: {
    placeholderMsg: "O que você gostaria de melhorar? (opcional)",
    cta: "Quero aparecer melhor no Google",
    sucesso:
      "Show! A Plano Piloto Digital vai te chamar para mostrar como melhorar sua presença online.",
  },
};

export function ClaimForm({
  slug,
  variant,
}: {
  slug: string;
  variant: Variant;
}) {
  const [state, formAction, pending] = useActionState(
    criarReivindicacao,
    initial,
  );
  const copy = COPY[variant];

  if (state.ok) {
    return (
      <div className="rounded-xl border border-verde/30 bg-verde/5 p-5 text-sm text-concreto">
        <p className="qc-display text-base text-verde-escuro">Enviado ✓</p>
        <p className="mt-1 text-concreto-claro">{copy.sucesso}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-3">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="tipo" value={variant} />
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="nome"
          required
          placeholder="Seu nome"
          className="rounded-lg border border-linha bg-branco px-3.5 py-2.5 text-sm text-concreto placeholder:text-concreto-claro focus:border-verde focus:outline-none"
        />
        <input
          name="telefone"
          type="tel"
          placeholder="WhatsApp / telefone"
          className="rounded-lg border border-linha bg-branco px-3.5 py-2.5 text-sm text-concreto placeholder:text-concreto-claro focus:border-verde focus:outline-none"
        />
      </div>
      <input
        name="email"
        type="email"
        placeholder="E-mail"
        className="rounded-lg border border-linha bg-branco px-3.5 py-2.5 text-sm text-concreto placeholder:text-concreto-claro focus:border-verde focus:outline-none"
      />
      <textarea
        name="mensagem"
        rows={3}
        placeholder={copy.placeholderMsg}
        className="resize-none rounded-lg border border-linha bg-branco px-3.5 py-2.5 text-sm text-concreto placeholder:text-concreto-claro focus:border-verde focus:outline-none"
      />
      {state.error && (
        <p className="text-sm font-medium text-aviso">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-verde px-5 py-2.5 text-sm font-semibold text-branco transition-colors hover:bg-verde-escuro disabled:opacity-60"
      >
        {pending ? "Enviando…" : copy.cta}
      </button>
      <p className="text-xs text-concreto-claro">
        Ao enviar, você concorda em ser contatado sobre este comércio.
      </p>
    </form>
  );
}
