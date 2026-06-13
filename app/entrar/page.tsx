"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogoQC } from "@/components/logo-qc";
import { createAuthClient } from "@/lib/supabase";
import {
  validarApelido,
  validarEmail,
  sanitizeText,
  rateLimitRemainingMs,
  recordAuthAttempt,
  clearAuthAttempts,
} from "@/lib/sanitize";

type Aba = "entrar" | "criar";

/** Traduz erros do Supabase Auth para mensagens amigáveis em português. */
function mensagemErro(raw: string): string {
  const m = raw.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "E-mail ou senha incorretos.";
  if (m.includes("email not confirmed"))
    return "Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.";
  if (m.includes("user already registered") || m.includes("already registered"))
    return "Este e-mail já tem conta. Tente entrar.";
  if (m.includes("password should be at least"))
    return "A senha precisa de pelo menos 6 caracteres.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Muitas tentativas. Aguarde alguns minutos e tente de novo.";
  return "Algo deu errado. Tente novamente em instantes.";
}

export default function EntrarPage() {
  const router = useRouter();
  const [aba, setAba] = useState<Aba>("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [apelido, setApelido] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setAviso(null);

    const restante = rateLimitRemainingMs();
    if (restante > 0) {
      setErro(
        `Muitas tentativas. Tente novamente em ${Math.ceil(restante / 60000)} min.`,
      );
      return;
    }

    const emailLimpo = email.trim().toLowerCase();
    if (!validarEmail(emailLimpo)) {
      setErro("Informe um e-mail válido.");
      return;
    }
    if (senha.length < 6) {
      setErro("A senha precisa de pelo menos 6 caracteres.");
      return;
    }

    setPending(true);
    const supabase = createAuthClient();

    try {
      if (aba === "entrar") {
        const { error } = await supabase.auth.signInWithPassword({
          email: emailLimpo,
          password: senha,
        });
        if (error) {
          recordAuthAttempt();
          setErro(mensagemErro(error.message));
          return;
        }
        clearAuthAttempts();
        router.push("/");
        router.refresh();
      } else {
        const erroApelido = validarApelido(apelido);
        if (erroApelido) {
          setErro(erroApelido);
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email: emailLimpo,
          password: senha,
        });
        if (error) {
          recordAuthAttempt();
          setErro(mensagemErro(error.message));
          return;
        }
        clearAuthAttempts();

        // Cria/atualiza o perfil público com o apelido sanitizado.
        if (data.user) {
          await supabase
            .from("qc_perfis")
            .upsert({ id: data.user.id, apelido: sanitizeText(apelido) });
        }

        if (data.session) {
          router.push("/");
          router.refresh();
        } else {
          setAviso(
            "Conta criada! Enviamos um e-mail de confirmação — confirme para começar a avaliar.",
          );
          setAba("entrar");
        }
      }
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
              {aba === "entrar" ? "Bem-vindo de volta" : "Crie sua conta"}
            </h1>
            <p className="mt-1.5 text-sm text-concreto-claro">
              Membros do Quadrado Capital avaliam comércios em capivaras 🦫.
            </p>

            {/* abas */}
            <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-ar p-1">
              {(["entrar", "criar"] as Aba[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setAba(t);
                    setErro(null);
                    setAviso(null);
                  }}
                  className={`rounded-lg py-2 text-sm font-semibold transition-colors ${
                    aba === t
                      ? "bg-branco text-concreto shadow-sm"
                      : "text-concreto-claro hover:text-concreto"
                  }`}
                >
                  {t === "entrar" ? "Entrar" : "Criar conta"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-3">
              {aba === "criar" && (
                <div>
                  <label className="mb-1 block text-xs font-semibold text-concreto-claro">
                    Apelido
                  </label>
                  <input
                    value={apelido}
                    onChange={(e) => setApelido(e.target.value)}
                    maxLength={30}
                    placeholder="Como você quer aparecer"
                    className="w-full rounded-lg border border-linha bg-branco px-3.5 py-2.5 text-sm text-concreto placeholder:text-concreto-claro focus:border-verde focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-semibold text-concreto-claro">
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="voce@email.com"
                  className="w-full rounded-lg border border-linha bg-branco px-3.5 py-2.5 text-sm text-concreto placeholder:text-concreto-claro focus:border-verde focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-concreto-claro">
                  Senha
                </label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  autoComplete={
                    aba === "entrar" ? "current-password" : "new-password"
                  }
                  placeholder="Mínimo 6 caracteres"
                  className="w-full rounded-lg border border-linha bg-branco px-3.5 py-2.5 text-sm text-concreto placeholder:text-concreto-claro focus:border-verde focus:outline-none"
                />
              </div>

              {erro && (
                <p className="rounded-lg bg-aviso/10 px-3 py-2 text-sm font-medium text-aviso">
                  {erro}
                </p>
              )}
              {aviso && (
                <p className="rounded-lg bg-verde/10 px-3 py-2 text-sm font-medium text-verde-escuro">
                  {aviso}
                </p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="mt-1 rounded-lg bg-verde px-5 py-2.5 text-sm font-semibold text-branco transition-colors hover:bg-verde-escuro disabled:opacity-60"
              >
                {pending
                  ? "Aguarde…"
                  : aba === "entrar"
                    ? "Entrar"
                    : "Criar conta"}
              </button>
            </form>

            {aba === "entrar" && (
              <p className="mt-4 text-center text-sm">
                <Link
                  href="/recuperar-senha"
                  className="text-concreto-claro transition-colors hover:text-verde"
                >
                  Esqueci a senha
                </Link>
              </p>
            )}
          </div>

          <p className="mt-5 text-center text-xs text-concreto-claro">
            Ao continuar, você concorda com os{" "}
            <Link href="/termos" className="underline hover:text-verde">
              Termos de Uso
            </Link>{" "}
            e a{" "}
            <Link href="/privacidade" className="underline hover:text-verde">
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
