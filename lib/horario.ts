/**
 * Interpreta o horario_funcionamento do Google Places (array de strings
 * "weekday descriptions", ex.: "segunda-feira: 08:00 – 18:00") para decidir
 * se o comércio está aberto agora (horário de Brasília).
 *
 * Best-effort: se não conseguir interpretar a linha do dia, retorna null
 * (a UI então não mostra o badge).
 */

const DIAS_PT = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
];

// Dias em inglês (retorno da API sem languageCode=pt-BR).
const DIAS_EN = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

function normalizar(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Minutos desde 00:00 para "HH:MM". null se inválido. */
function paraMinutos(hhmm: string): number | null {
  const m = hhmm.match(/(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

/** Agora em Brasília como { diaSemana 0-6, minutos do dia }. */
function agoraBrasilia(): { dia: number; minutos: number } {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(new Date());
  const wd = parts.find((p) => p.type === "weekday")?.value ?? "Sun";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return { dia: map[wd] ?? 0, minutos: (hour % 24) * 60 + minute };
}

/** Dia da semana atual em Brasília (0 = domingo … 6 = sábado). */
export function diaSemanaBrasilia(): number {
  return agoraBrasilia().dia;
}

/**
 * Dado o array de weekday descriptions do Google, devolve o índice (0..n-1) da
 * linha que corresponde ao dia de hoje em Brasília. -1 se não encontrar.
 */
export function indiceDiaAtual(weekday: string[] | undefined): number {
  if (!weekday || weekday.length === 0) return -1;
  const idx = agoraBrasilia().dia;
  const nomePT = DIAS_PT[idx];
  const nomeEN = DIAS_EN[idx];
  return weekday.findIndex((l) => {
    const n = normalizar(l);
    return n.startsWith(normalizar(nomePT)) || n.startsWith(nomeEN);
  });
}

/**
 * Retorna true (aberto), false (fechado) ou null (não foi possível determinar).
 * Suporta descrições em português e inglês (Google Places API).
 */
export function estaAbertoAgora(weekday: string[] | undefined): boolean | null {
  if (!weekday || weekday.length === 0) return null;

  const { dia, minutos } = agoraBrasilia();
  const nomePT = DIAS_PT[dia];
  const nomeEN = DIAS_EN[dia];

  // Acha a linha do dia atual (PT ou EN).
  const linha = weekday.find((l) => {
    const n = normalizar(l);
    return n.startsWith(normalizar(nomePT)) || n.startsWith(nomeEN);
  });
  if (!linha) return null;

  const norm = normalizar(linha);

  if (norm.includes("fechado") || norm.includes("closed")) return false;
  if (norm.includes("24 horas") || norm.includes("aberto 24") || norm.includes("open 24")) return true;

  // Extrai pares HH:MM – HH:MM (pode haver vários intervalos no dia).
  const horas = linha.match(/\d{1,2}:\d{2}/g);
  if (!horas || horas.length < 2) return null;

  for (let i = 0; i + 1 < horas.length; i += 2) {
    const ini = paraMinutos(horas[i]);
    const fim = paraMinutos(horas[i + 1]);
    if (ini === null || fim === null) continue;
    if (fim > ini) {
      if (minutos >= ini && minutos < fim) return true;
    } else {
      // Vira a meia-noite (ex.: 18:00 – 02:00).
      if (minutos >= ini || minutos < fim) return true;
    }
  }
  return false;
}
