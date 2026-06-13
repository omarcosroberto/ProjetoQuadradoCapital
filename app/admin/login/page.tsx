"use client";

import { useActionState } from "react";
import { loginAdmin, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-ar px-6 text-concreto">
      <div className="w-full max-w-sm rounded-2xl border border-linha bg-branco p-8 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center bg-verde qc-brand text-lg leading-none text-branco">
            Q
          </span>
          <span className="qc-brand text-lg">
            Quadrado <span className="text-verde">Admin</span>
          </span>
        </div>

        <h1 className="mt-6 qc-display text-xl">Acesso restrito</h1>
        <p className="mt-1 text-sm text-concreto-claro">
          Informe a senha para gerenciar o diretório.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="senha"
              className="mb-1 block text-sm font-semibold text-concreto"
            >
              Senha
            </label>
            <input
              id="senha"
              name="senha"
              type="password"
              required
              autoFocus
              className="w-full rounded-lg border border-linha bg-ar px-3 py-2.5 text-sm text-concreto focus:border-verde focus:outline-none"
            />
          </div>

          {state.error && (
            <p className="rounded-lg bg-aviso/10 px-3 py-2 text-sm font-semibold text-aviso">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-verde px-4 py-2.5 text-sm font-semibold text-branco transition-colors hover:bg-verde-escuro disabled:opacity-60"
          >
            {pending ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
