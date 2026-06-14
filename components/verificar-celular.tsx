"use client";

import { useState } from "react";

type Estado = "idle" | "enviando" | "aguardando" | "verificando" | "verificado" | "erro";

export function VerificarCelular({
  celular,
  celularVerificado,
}: {
  celular: string;
  celularVerificado: boolean;
}) {
  const [estado, setEstado] = useState<Estado>(celularVerificado ? "verificado" : "idle");
  const [codigo, setCodigo] = useState("");
  const [emailOtp, setEmailOtp] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const digits = celular.replace(/\D/g, "");
  const celularFormatado =
    digits.length === 11
      ? `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
      : celular;

  async function enviarOtp() {
    setEstado("enviando");
    setMensagem(null);
    try {
      const res = await fetch("/api/otp/enviar", { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        setMensagem(json.message ?? "Erro ao enviar código.");
        setEstado("erro");
        return;
      }
      setEmailOtp(json.email ?? null);
      setEstado("aguardando");
    } catch {
      setMensagem("Erro de conexão. Tente novamente.");
      setEstado("erro");
    }
  }

  async function verificarOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{6}$/.test(codigo)) {
      setMensagem("Digite os 6 dígitos do código.");
      return;
    }
    setEstado("verificando");
    setMensagem(null);
    try {
      const res = await fetch("/api/otp/verificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMensagem(json.message ?? "Código incorreto.");
        setEstado("aguardando");
        return;
      }
      setEstado("verificado");
    } catch {
      setMensagem("Erro de conexão. Tente novamente.");
      setEstado("aguardando");
    }
  }

  if (estado === "verificado") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-verde/10 px-3 py-1 text-xs font-semibold text-verde-escuro">
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        Celular verificado
      </span>
    );
  }

  if (estado === "idle" || estado === "erro") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-concreto-claro">{celularFormatado}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-aviso/10 px-2.5 py-0.5 text-xs font-semibold text-aviso">
          Não verificado
        </span>
        <button
          type="button"
          onClick={enviarOtp}
          className="rounded-full border border-verde/40 bg-branco px-3 py-0.5 text-xs font-semibold text-verde transition-colors hover:bg-verde/5"
        >
          Verificar agora
        </button>
        {mensagem && (
          <p className="w-full text-xs text-aviso">{mensagem}</p>
        )}
      </div>
    );
  }

  if (estado === "enviando") {
    return (
      <p className="text-sm text-concreto-claro">Enviando código…</p>
    );
  }

  // aguardando | verificando
  return (
    <div className="mt-2 rounded-xl border border-linha bg-ar p-4">
      <p className="text-sm font-semibold text-concreto">Insira o código enviado por e-mail</p>
      {emailOtp && (
        <p className="mt-0.5 text-xs text-concreto-claro">
          Enviamos um código de 6 dígitos para <strong>{emailOtp}</strong>.
        </p>
      )}
      <form onSubmit={verificarOtp} className="mt-3 flex flex-wrap items-center gap-2">
        <input
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          placeholder="000000"
          maxLength={6}
          className="w-32 rounded-lg border border-linha bg-branco px-3.5 py-2 text-center text-base font-semibold tracking-[0.3em] text-concreto placeholder:tracking-normal placeholder:text-concreto-claro focus:border-verde focus:outline-none"
        />
        <button
          type="submit"
          disabled={estado === "verificando" || codigo.length !== 6}
          className="rounded-lg bg-verde px-4 py-2 text-sm font-semibold text-branco transition-colors hover:bg-verde-escuro disabled:opacity-50"
        >
          {estado === "verificando" ? "Verificando…" : "Confirmar"}
        </button>
        <button
          type="button"
          onClick={enviarOtp}
          className="text-xs text-concreto-claro underline hover:text-verde"
        >
          Reenviar
        </button>
      </form>
      {mensagem && (
        <p className="mt-2 text-xs text-aviso">{mensagem}</p>
      )}
    </div>
  );
}
