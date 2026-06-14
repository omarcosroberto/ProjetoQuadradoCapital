"use client";

import { useActionState } from "react";
import { salvarResposta, type EditState } from "./actions";

const initial: EditState = { ok: false };

export function RespostaForm({
  slug,
  avaliacaoId,
  respostaAtual,
}: {
  slug: string;
  avaliacaoId: string;
  respostaAtual: string | null;
}) {
  const [state, formAction, pending] = useActionState(salvarResposta, initial);

  return (
    <form action={formAction} className="mt-3 grid gap-2">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="avaliacao_id" value={avaliacaoId} />
      <textarea
        name="texto"
        rows={2}
        maxLength={500}
        defaultValue={respostaAtual ?? ""}
        placeholder="Escreva sua resposta pública para o cliente…"
        className="w-full resize-none rounded-lg border border-linha bg-ar px-3 py-2 text-sm text-concreto placeholder:text-concreto-claro focus:border-verde focus:outline-none"
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-verde px-3.5 py-1.5 text-xs font-semibold text-branco transition-colors hover:bg-verde-escuro disabled:opacity-60"
        >
          {pending ? "Salvando…" : respostaAtual ? "Atualizar resposta" : "Publicar resposta"}
        </button>
        {state.ok && (
          <span className="text-xs font-medium text-verde-escuro">Resposta salva ✓</span>
        )}
        {state.error && (
          <span className="text-xs font-medium text-aviso">{state.error}</span>
        )}
      </div>
    </form>
  );
}
