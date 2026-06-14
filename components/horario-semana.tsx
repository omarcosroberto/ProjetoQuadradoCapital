"use client";

import { useEffect, useState } from "react";
import { indiceDiaAtual } from "@/lib/horario";

// Mapeamento de nomes de dias em inglês → português-BR
const EN_PARA_PT: Record<string, string> = {
  sunday: "domingo",
  monday: "segunda-feira",
  tuesday: "terça-feira",
  wednesday: "quarta-feira",
  thursday: "quinta-feira",
  friday: "sexta-feira",
  saturday: "sábado",
};

// Converte "8:00 AM" / "08:00 AM" → "08:00" e "6:30 PM" → "18:30"
function amPmPara24h(s: string): string {
  return s.replace(/(\d{1,2}):(\d{2})\s*(AM|PM)/gi, (_, h, m, period) => {
    let hh = Number(h);
    if (period.toUpperCase() === "AM") {
      if (hh === 12) hh = 0;
    } else {
      if (hh !== 12) hh += 12;
    }
    return `${String(hh).padStart(2, "0")}:${m}`;
  });
}

// Normaliza uma linha de horário:
// - Traduz dia em inglês para português
// - Converte AM/PM para 24h
// - Padroniza o separador de intervalo para " – "
function normalizarLinha(linha: string): string {
  // Traduz dia no início da string
  const lower = linha.toLowerCase().trim();
  for (const [en, pt] of Object.entries(EN_PARA_PT)) {
    if (lower.startsWith(en)) {
      linha = pt + linha.slice(en.length);
      break;
    }
  }
  // 24h
  linha = amPmPara24h(linha);
  return linha;
}

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
      {horario.map((linhaOriginal, i) => {
        const linha = normalizarLinha(linhaOriginal);
        const ativo = i === hoje;
        // Separa "Dia: horário" — o separador pode ser ":" ou ser parte de "HH:MM",
        // então separamos apenas no primeiro ":" que não está dentro de um número.
        const sep = linha.search(/:\s*(?!\d{2})/);
        const dia  = sep > 0 ? linha.slice(0, sep) : linha;
        const valor = sep > 0 ? linha.slice(sep + 1).trim() : "";
        return (
          <li
            key={i}
            className={`flex items-baseline justify-between gap-4 ${
              ativo ? "font-semibold text-verde" : "text-concreto-claro"
            }`}
          >
            <span className="capitalize">{dia}</span>
            <span className={ativo ? "text-verde" : "text-concreto"}>
              {valor || "—"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
