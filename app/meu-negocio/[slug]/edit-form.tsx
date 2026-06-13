"use client";

import { useActionState } from "react";
import { salvarNegocio, type EditState } from "./actions";

const initial: EditState = { ok: false };

export function EditForm({
  slug,
  descricao,
  website,
  telefone,
}: {
  slug: string;
  descricao: string;
  website: string;
  telefone: string;
}) {
  const [state, formAction, pending] = useActionState(salvarNegocio, initial);

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="slug" value={slug} />

      <div>
        <label
          htmlFor="telefone"
          className="text-sm font-medium text-concreto"
        >
          Telefone
        </label>
        <input
          id="telefone"
          name="telefone"
          type="tel"
          defaultValue={telefone}
          placeholder="(61) 99999-9999"
          className="mt-1.5 w-full rounded-lg border border-linha bg-branco px-3.5 py-2.5 text-sm text-concreto placeholder:text-concreto-claro focus:border-verde focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="website" className="text-sm font-medium text-concreto">
          Site
        </label>
        <input
          id="website"
          name="website"
          type="url"
          defaultValue={website}
          placeholder="https://seusite.com.br"
          className="mt-1.5 w-full rounded-lg border border-linha bg-branco px-3.5 py-2.5 text-sm text-concreto placeholder:text-concreto-claro focus:border-verde focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="descricao"
          className="text-sm font-medium text-concreto"
        >
          Descrição
        </label>
        <textarea
          id="descricao"
          name="descricao"
          rows={4}
          maxLength={1000}
          defaultValue={descricao}
          placeholder="Conte o que seu negócio oferece, diferenciais, horários especiais…"
          className="mt-1.5 w-full resize-none rounded-lg border border-linha bg-branco px-3.5 py-2.5 text-sm text-concreto placeholder:text-concreto-claro focus:border-verde focus:outline-none"
        />
        <p className="mt-1 text-xs text-concreto-claro">Até 1000 caracteres.</p>
      </div>

      {state.error && (
        <p className="rounded-lg bg-aviso/10 px-3 py-2 text-sm font-medium text-aviso">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="rounded-lg bg-verde/10 px-3 py-2 text-sm font-medium text-verde-escuro">
          Informações salvas ✓
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="justify-self-start rounded-lg bg-verde px-5 py-2.5 text-sm font-semibold text-branco transition-colors hover:bg-verde-escuro disabled:opacity-60"
      >
        {pending ? "Salvando…" : "Salvar alterações"}
      </button>
    </form>
  );
}
