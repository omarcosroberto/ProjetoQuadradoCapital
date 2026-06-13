/**
 * Utilitários de sanitização/validação client-side compartilhados pelas
 * telas de auth e avaliação. O banco tem CHECKs próprios (defesa em
 * profundidade) — isto melhora a UX bloqueando entradas inválidas cedo.
 */

/** Remove tags HTML e normaliza espaços. */
export function sanitizeText(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Apelido: letras (com acento), números, espaço, _ . - — 2 a 30 chars. */
const APELIDO_RE = /^[a-zA-Z0-9À-ÿ _.-]+$/;

export function validarApelido(apelido: string): string | null {
  const v = sanitizeText(apelido);
  if (v.length < 2) return "O apelido precisa de pelo menos 2 caracteres.";
  if (v.length > 30) return "O apelido pode ter no máximo 30 caracteres.";
  if (!APELIDO_RE.test(v))
    return "O apelido só pode ter letras, números, espaço e . _ -";
  return null;
}

/** Comentário de avaliação: máx 500 chars. Retorna texto sanitizado. */
export const COMENTARIO_MAX = 500;

export function sanitizeComentario(value: string): string {
  return sanitizeText(value).slice(0, COMENTARIO_MAX);
}

export function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/* ----------------------- Rate limiting (localStorage) ----------------------- */

const RL_KEY = "qc_auth_attempts";
const RL_MAX = 5;
const RL_WINDOW_MS = 5 * 60 * 1000; // 5 min

type RLState = { count: number; first: number };

function readRL(): RLState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(RL_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as RLState;
  } catch {
    return null;
  }
}

/** Retorna ms restantes do bloqueio, ou 0 se liberado. */
export function rateLimitRemainingMs(): number {
  const st = readRL();
  if (!st) return 0;
  const elapsed = Date.now() - st.first;
  if (elapsed > RL_WINDOW_MS) return 0;
  if (st.count >= RL_MAX) return RL_WINDOW_MS - elapsed;
  return 0;
}

/** Registra uma tentativa falha. */
export function recordAuthAttempt(): void {
  if (typeof window === "undefined") return;
  const st = readRL();
  const now = Date.now();
  let next: RLState;
  if (!st || now - st.first > RL_WINDOW_MS) {
    next = { count: 1, first: now };
  } else {
    next = { count: st.count + 1, first: st.first };
  }
  try {
    window.localStorage.setItem(RL_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

/** Limpa o contador (ex: login bem-sucedido). */
export function clearAuthAttempts(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(RL_KEY);
  } catch {
    /* ignore */
  }
}
