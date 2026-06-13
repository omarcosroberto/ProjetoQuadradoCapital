"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogoQC } from "@/components/logo-qc";
import { createAuthClient } from "@/lib/supabase";

export default function NovaSenhaPage() {
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (senha.length < 6) {
      setErro("A senha precisa de pelo menos 6 caracteres.");
      return;
    }
    if (senha !== confirma) {
      setErro("As senhas não conferem.");
      return;
    }

    setPending(true);
    try {
      const supabase = createAuthClient();
      const { error } = await supabase.auth.updateUser({ password: senha });
      if (error) {
        setErro(
          "Não foi possível atualizar a senha. O link pode ter expirado — peça um novo.",
        );
        return;
      }
      setOk(true);
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1800);
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
            <h1 className="qc-display text-2xl text-concreto">Nova senha</h1>

            {ok ? (
              <div className="mt-4 rounded-xl border border-verde/30 bg-verde/5 p-5 text-sm text-concreto">
                <p className="qc-display text-base text-verde-escuro">
                  Senha atualizada ✓
                </p>
                <p className="mt-1 text-concreto-claro">
                  Redirecionando você para a página inicial…
                </p>
              </div>
            ) : (
              <>
                <p className="mt-1.5 text-sm text-concreto-claro">
                  Defina sua nova senha de acesso.
                </p>
                <form onSubmit={handleSubmit} className="mt-6 grid gap-3">
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    autoComplete="new-password"
                    placeholder="Nova senha (mín. 6 caracteres)"
                    className="w-full rounded-lg border border-linha bg-branco px-3.5 py-2.5 text-sm text-concreto placeholder:text-concreto-claro focus:border-verde focus:outline-none"
                  />
                  <input
                    type="password"
                    value={confirma}
                    onChange={(e) => setConfirma(e.target.value)}
                    autoComplete="new-password"
                    placeholder="Confirme a nova senha"
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
                    {pending ? "Salvando…" : "Salvar nova senha"}
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
