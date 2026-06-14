"use client";

import { useActionState, useRef } from "react";
import { uploadFotoComercio, type EditState } from "./actions";

const initial: EditState = { ok: false };

export function FotoForm({
  slug,
  fotoAtual,
}: {
  slug: string;
  fotoAtual: string | null;
}) {
  const [state, formAction, pending] = useActionState(uploadFotoComercio, initial);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="grid gap-4">
      {fotoAtual && (
        <div className="overflow-hidden rounded-xl border border-linha aspect-[16/7] w-full max-w-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fotoAtual}
            alt="Foto atual do comércio"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <form action={formAction} className="flex flex-wrap items-center gap-3">
        <input type="hidden" name="slug" value={slug} />
        <input
          ref={inputRef}
          type="file"
          name="foto"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          id="foto-input"
        />

        <label
          htmlFor="foto-input"
          className="cursor-pointer rounded-lg border border-linha bg-ar px-4 py-2 text-sm font-medium text-concreto hover:border-verde/50 transition-colors"
        >
          {fotoAtual ? "Trocar foto" : "Escolher foto"}
        </label>

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-verde px-4 py-2 text-sm font-semibold text-branco transition-colors hover:bg-verde-escuro disabled:opacity-60"
        >
          {pending ? "Enviando…" : "Salvar foto"}
        </button>

        <p className="w-full text-xs text-concreto-claro">
          JPG, PNG ou WebP · máx. 5 MB
        </p>
      </form>

      {state.error && (
        <p className="rounded-lg bg-aviso/10 px-3 py-2 text-sm font-medium text-aviso">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="rounded-lg bg-verde/10 px-3 py-2 text-sm font-medium text-verde-escuro">
          Foto atualizada com sucesso ✓
        </p>
      )}
    </div>
  );
}
