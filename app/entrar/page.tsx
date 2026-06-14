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
type TipoPerfil = "comum" | "empresarial";

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

function formatarDocumento(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 11) {
    // CPF: 000.000.000-00
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  // CNPJ: 00.000.000/0000-00
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

function formatarCelular(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

export default function EntrarPage() {
  const router = useRouter();
  const [aba, setAba] = useState<Aba>("entrar");
  const [tipoPerfil, setTipoPerfil] = useState<TipoPerfil>("comum");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [senha, setSenha] = useState("");
  const [apelido, setApelido] = useState("");
  const [documento, setDocumento] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function resetCadastro() {
    setErro(null);
    setAviso(null);
    setTipoPerfil("comum");
    setDocumento("");
    setCelular("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setAviso(null);

    const restante = rateLimitRemainingMs();
    if (restante > 0) {
      setErro(`Muitas tentativas. Tente novamente em ${Math.ceil(restante / 60000)} min.`);
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

    if (aba === "criar") {
      const erroApelido = validarApelido(apelido);
      if (erroApelido) { setErro(erroApelido); return; }

      const celularDigits = celular.replace(/\D/g, "");
      if (celularDigits.length < 10) {
        setErro("Informe um celular válido com DDD.");
        return;
      }

      if (tipoPerfil === "empresarial") {
        const docDigits = documento.replace(/\D/g, "");
        if (docDigits.length !== 11 && docDigits.length !== 14) {
          setErro("Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.");
          return;
        }
      }
    }

    setPending(true);
    const supabase = createAuthClient();

    try {
      if (aba === "entrar") {
        const { error } = await supabase.auth.signInWithPassword({
          email: emailLimpo,
          password: senha,
        });
        if (error) { recordAuthAttempt(); setErro(mensagemErro(error.message)); return; }
        clearAuthAttempts();
        router.push("/");
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: emailLimpo,
          password: senha,
        });
        if (error) { recordAuthAttempt(); setErro(mensagemErro(error.message)); return; }
        clearAuthAttempts();

        if (data.user) {
          const perfil: Record<string, string> = {
            id: data.user.id,
            apelido: sanitizeText(apelido),
            tipo_perfil: tipoPerfil,
            celular: celular.replace(/\D/g, ""),
          };
          if (tipoPerfil === "empresarial" && documento) {
            perfil.documento = documento.replace(/\D/g, "");
          }
          await supabase.from("qc_perfis").upsert(perfil);
        }

        if (data.session) {
          router.push("/");
          router.refresh();
        } else {
          setAviso("Conta criada! Enviamos um e-mail de confirmação — confirme para começar.");
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
              {aba === "entrar"
                ? "Entre na sua conta do Quadrado Capital."
                : "Membros avaliam comércios em capivaras 🦫."}
            </p>

            {/* Abas entrar / criar */}
            <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-ar p-1">
              {(["entrar", "criar"] as Aba[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setAba(t); resetCadastro(); }}
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

              {/* ── TIPO DE PERFIL (primeiro no cadastro) ── */}
              {aba === "criar" && (
                <div>
                  <p className="mb-2 text-xs font-semibold text-concreto-claro">
                    Tipo de perfil
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {(["comum", "empresarial"] as TipoPerfil[]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => { setTipoPerfil(t); setDocumento(""); }}
                        className={[
                          "rounded-xl border px-3 py-3 text-left text-sm transition-colors",
                          tipoPerfil === t
                            ? "border-verde bg-verde/5 text-verde"
                            : "border-linha bg-branco text-concreto hover:border-verde/40",
                        ].join(" ")}
                      >
                        <span className="block text-base leading-none">
                          {t === "comum" ? "👤" : "🏢"}
                        </span>
                        <span className="mt-1.5 block font-semibold capitalize">
                          {t === "comum" ? "Pessoa física" : "Empresarial"}
                        </span>
                        <span className="mt-0.5 block text-xs text-concreto-claro">
                          {t === "comum"
                            ? "Avalie comércios da sua quadra"
                            : "Reivindique e gerencie seu negócio"}
                        </span>
                      </button>
                    ))}
                  </div>
                  {tipoPerfil === "empresarial" && (
                    <p className="mt-2 rounded-lg bg-verde/5 px-3 py-2 text-xs text-verde-escuro">
                      Perfis empresariais podem reivindicar comércios e acessar recursos de presença digital.
                    </p>
                  )}
                </div>
              )}

              {/* Apelido */}
              {aba === "criar" && (
                <div>
                  <label className="mb-1 block text-xs font-semibold text-concreto-claro">
                    {tipoPerfil === "empresarial" ? "Nome / Razão Social" : "Apelido"}
                  </label>
                  <input
                    value={apelido}
                    onChange={(e) => setApelido(e.target.value)}
                    maxLength={60}
                    placeholder={tipoPerfil === "empresarial" ? "Nome da empresa ou responsável" : "Como você quer aparecer"}
                    className="w-full rounded-lg border border-linha bg-branco px-3.5 py-2.5 text-sm text-concreto placeholder:text-concreto-claro focus:border-verde focus:outline-none"
                  />
                </div>
              )}

              {/* CPF / CNPJ — só para empresarial */}
              {aba === "criar" && tipoPerfil === "empresarial" && (
                <div>
                  <label className="mb-1 block text-xs font-semibold text-concreto-claro">
                    CPF ou CNPJ <span className="text-aviso">*</span>
                  </label>
                  <input
                    value={documento}
                    onChange={(e) => setDocumento(formatarDocumento(e.target.value))}
                    inputMode="numeric"
                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                    className="w-full rounded-lg border border-linha bg-branco px-3.5 py-2.5 text-sm text-concreto placeholder:text-concreto-claro focus:border-verde focus:outline-none"
                  />
                </div>
              )}

              {/* E-mail */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-concreto-claro">
                  E-mail <span className="text-aviso">*</span>
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

              {/* Celular — obrigatório no cadastro */}
              {aba === "criar" && (
                <div>
                  <label className="mb-1 block text-xs font-semibold text-concreto-claro">
                    Celular (com DDD) <span className="text-aviso">*</span>
                  </label>
                  <input
                    value={celular}
                    onChange={(e) => setCelular(formatarCelular(e.target.value))}
                    type="tel"
                    inputMode="numeric"
                    placeholder="(61) 99999-9999"
                    className="w-full rounded-lg border border-linha bg-branco px-3.5 py-2.5 text-sm text-concreto placeholder:text-concreto-claro focus:border-verde focus:outline-none"
                  />
                </div>
              )}

              {/* Senha */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-concreto-claro">
                  Senha
                </label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  autoComplete={aba === "entrar" ? "current-password" : "new-password"}
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
                    : tipoPerfil === "empresarial"
                      ? "Criar conta empresarial"
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
