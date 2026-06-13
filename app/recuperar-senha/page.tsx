"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoQC } from "@/components/logo-qc";
import { createAuthClient } from "@/lib/supabase";
import { validarEmail } from "@/lib/sanitize";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    const emailLimpo = email.trim().toLowerCase();
    if (!validarEmail(emailLimpo)) {
      setErro("Informe um e-mail válido.");
      return;
    }

    setPending(true);
    try {
      const supabase = createAuthClient();
      const { error } = await supabase.auth.resetPasswordForEmail(emailLimpo, {
        redirectTo: "https://quadradocapital.com.br/nova-senha",
      });
      if (error) {
        setErro("Não foi possível enviar o e-mail. Tente de novo em instantes.");
        return;
      }
      setEnviado(true);
    } catch {
      setErro("Erro de conexão. Verifique sua internet e tente de novo.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-ar">
      <header className="bg-concreto px-6 py-4">
        <div className="mx-auto max-w-[1100px]">
          <LogoQC variant="light" />
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md qc-rise">
          <div className="rounded-2xl border border-linha bg-branco p-7 shadow-sm sm:p-8">
            <h1 className="qc-display text-2xl text-concreto">
              Recuperar senha
            </h1>

            {enviado ? (
              <div className="mt-4 rounded-xl border border-verde/30 bg-verde/5 p-5 text-sm text-concreto">
                <p className="qc-display text-base text-verde-escuro">
                  E-mail enviado ✓
                </p>
                <p className="mt-1 text-concreto-claro">
                  Se houver uma conta com esse e-mail, você receberá um link para
                  criar uma nova senha. Confira também o spam.
                </p>
              </div>
            ) : (
              <>
                <p className="mt-1.5 text-sm text-concreto-claro">
                  Informe seu e-mail e enviaremos um link para redefinir a senha.
                </p>
                <form onSubmit={handleSubmit} className="mt-6 grid gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="voce@email.com"
                    className="w-full rounded-lg border border-linha bg-branco px-3.5 py-2.5 text-sm text-concreto placeholder:text-concreto-claro focus:border-verde focus:outline-none"
                  />
                  {erro && (
                    <p className="rounded-lg bg-aviso/10 px-3 py-2 text-sm font-medium text-aviso">
                      {erro}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={pending}
                    className="mt-1 rounded-lg bg-verde px-5 py-2.5 text-sm font-semibold text-branco transition-colors hover:bg-verde-escuro disabled:opacity-60"
                  >
                    {pending ? "Enviando…" : "Enviar link"}
                  </button>
                </form>
              </>
            )}

            <p className="mt-5 text-center text-sm">
              <Link
                href="/entrar"
                className="text-concreto-claro transition-colors hover:text-verde"
              >
                ← Voltar para entrar
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
