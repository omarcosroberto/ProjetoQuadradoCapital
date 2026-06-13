"use client";

import { useEffect, useState } from "react";
import { estaAbertoAgora } from "@/lib/horario";

/**
 * Pill "Aberto agora" / "Fechado" calculado no CLIENTE a partir do
 * horario_funcionamento (weekday descriptions do Google).
 *
 * Calcular no cliente evita divergência com o cache ISR: o servidor renderiza
 * sem badge (estado null) e o cliente preenche assim que monta, sempre no
 * horário de Brasília do visitante.
 *
 * `variant`:
 *  - "overlay": pill sobre a foto do card (texto branco, fundo translúcido)
 *  - "inline": pill em superfície clara (página do comércio)
 */
export function EstadoAberto({
  horario,
  variant = "inline",
  className = "",
}: {
  horario: string[] | null | undefined;
  variant?: "overlay" | "inline";
  className?: string;
}) {
  const [aberto, setAberto] = useState<boolean | null>(null);

  useEffect(() => {
    setAberto(estaAbertoAgora(horario ?? undefined));
  }, [horario]);

  if (aberto === null) return null;

  if (variant === "overlay") {
    return (
      <span
        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold leading-none backdrop-blur ${
          aberto ? "bg-verde/90 text-branco" : "bg-concreto/80 text-branco"
        } ${className}`}
      >
        <span
          aria-hidden
          className={`h-1.5 w-1.5 rounded-full ${
            aberto ? "bg-branco" : "bg-branco/60"
          }`}
        />
        {aberto ? "Aberto agora" : "Fechado"}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        aberto ? "bg-verde/10 text-verde-escuro" : "bg-aviso/10 text-aviso"
      } ${className}`}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${
          aberto ? "bg-verde" : "bg-aviso"
        }`}
      />
      {aberto ? "Aberto agora" : "Fechado"}
    </span>
  );
}

/**
 * Hook utilitário — recalcula no cliente. Usado pelos filtros da home
 * (precisam do booleano, não só do pill).
 */
export function useAbertoAgora(horario: string[] | null | undefined) {
  const [aberto, setAberto] = useState<boolean | null>(null);
  useEffect(() => {
    setAberto(estaAbertoAgora(horario ?? undefined));
  }, [horario]);
  return aberto;
}
