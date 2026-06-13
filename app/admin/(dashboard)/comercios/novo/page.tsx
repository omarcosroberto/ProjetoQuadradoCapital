"use client";

import Link from "next/link";
import { useActionState } from "react";
import { CATEGORIAS } from "@/lib/data";
import { criarComercio, type CriarState } from "./actions";

const initialState: CriarState = {};

const inputCls =
  "w-full rounded-lg border border-linha bg-ar px-3 py-2.5 text-sm text-concreto focus:border-verde focus:outline-none";
const labelCls = "mb-1 block text-sm font-semibold text-concreto";

export default function NovoComercioPage() {
  const [state, formAction, pending] = useActionState(
    criarComercio,
    initialState,
  );

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="qc-display text-2xl text-concreto">Novo comércio</h1>
        <Link
          href="/admin"
          className="text-sm text-concreto-claro transition-colors hover:text-verde"
        >
          ← Voltar
        </Link>
      </div>

      <form
        action={formAction}
        className="mt-6 space-y-5 rounded-xl border border-linha bg-branco p-6"
      >
        <div>
          <label htmlFor="nome" className={labelCls}>
            Nome *
          </label>
          <input id="nome" name="nome" required className={inputCls} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="categoria" className={labelCls}>
              Categoria *
            </label>
            <select
              id="categoria"
              name="categoria"
              required
              defaultValue=""
              className={inputCls}
            >
              <option value="" disabled>
                Selecione…
              </option>
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="asa" className={labelCls}>
              Asa *
            </label>
            <select
              id="asa"
              name="asa"
              required
              defaultValue="Sul"
              className={inputCls}
            >
              <option value="Sul">Sul</option>
              <option value="Norte">Norte</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="quadra" className={labelCls}>
              Quadra *
            </label>
            <input
              id="quadra"
              name="quadra"
              type="number"
              min="1"
              required
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="bloco" className={labelCls}>
              Bloco
            </label>
            <input
              id="bloco"
              name="bloco"
              maxLength={2}
              placeholder="A"
              className={inputCls}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="capivaras" className={labelCls}>
              Capivaras (0–5) *
            </label>
            <input
              id="capivaras"
              name="capivaras"
              type="number"
              step="0.1"
              min="0"
              max="5"
              required
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="avaliacoes" className={labelCls}>
              Avaliações
            </label>
            <input
              id="avaliacoes"
              name="avaliacoes"
              type="number"
              min="0"
              defaultValue="0"
              className={inputCls}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="whatsapp" className={labelCls}>
              WhatsApp
            </label>
            <input id="whatsapp" name="whatsapp" className={inputCls} />
          </div>
          <div>
            <label htmlFor="telefone" className={labelCls}>
              Telefone
            </label>
            <input id="telefone" name="telefone" className={inputCls} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="instagram" className={labelCls}>
              Instagram
            </label>
            <input
              id="instagram"
              name="instagram"
              placeholder="@perfil"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="site" className={labelCls}>
              Site
            </label>
            <input id="site" name="site" className={inputCls} />
          </div>
        </div>

        <div>
          <label htmlFor="endereco" className={labelCls}>
            Endereço
          </label>
          <input id="endereco" name="endereco" className={inputCls} />
        </div>

        <div>
          <label htmlFor="presenca_google" className={labelCls}>
            Presença no Google
          </label>
          <select
            id="presenca_google"
            name="presenca_google"
            defaultValue="desconhecida"
            className={inputCls}
          >
            <option value="forte">Forte</option>
            <option value="fraca">Fraca</option>
            <option value="ausente">Ausente</option>
            <option value="desconhecida">Desconhecida</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm font-semibold text-concreto">
          <input
            type="checkbox"
            name="ativo"
            defaultChecked
            className="h-4 w-4 accent-[var(--qc-verde)]"
          />
          Ativo (visível no site)
        </label>

        {state.error && (
          <p className="rounded-lg bg-aviso/10 px-3 py-2 text-sm font-semibold text-aviso">
            {state.error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-verde px-5 py-2.5 text-sm font-semibold text-branco transition-colors hover:bg-verde-escuro disabled:opacity-60"
          >
            {pending ? "Salvando…" : "Cadastrar comércio"}
          </button>
          <Link
            href="/admin"
            className="rounded-lg border border-linha px-5 py-2.5 text-sm font-semibold text-concreto transition-colors hover:bg-ar"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
