"use client";

import { useEffect, useState } from "react";
import { indiceDiaAtual } from "@/lib/horario";

/**
 * Lista os 7 dias do horário de funcionamento, destacando o dia atual.
 * O dia atual é resolvido no CLIENTE (Brasília do visitante) para não divergir
 * do cache ISR da página.
 */
export function HorarioSemana({ horario }: { horario: string[] }) {
  const [hoje, setHoje] = useState(-1);

  useEffect(() => {
    setHoje(indiceDiaAtual(horario));
  }, [horario]);

  return (
    <ul className="grid gap-1.5 text-sm">
      {horario.map((linha, i) => {
        const ativo = i === hoje;
        // Separa "Dia: horário" para alinhar; se não houver ":", mostra cru.
        const sep = linha.indexOf(":");
        const dia = sep > 0 ? linha.slice(0, sep) : linha;
        const valor = sep > 0 ? linha.slice(sep + 1).trim() : "";
        return (
          <li
            key={i}
            className={`flex items-baseline justify-between gap-4 ${
              ativo
                ? "font-semibold text-verde"
                : "text-concreto-claro"
            }`}
          >
            <span className="capitalize">{dia}</span>
            <span className={ativo ? "text-verde" : "text-concreto"}>
              {valor}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
