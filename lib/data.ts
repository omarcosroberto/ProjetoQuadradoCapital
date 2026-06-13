/**
 * Tipos + lógica de busca do Quadrado Capital.
 * Os dados vêm do Supabase (ver lib/comercios.ts); este módulo é puro —
 * todas as funções operam sobre a lista de comércios recebida por parâmetro.
 */

export type Asa = "Sul" | "Norte";

export type Business = {
  id: string;
  nome: string;
  categoria: string;
  asa: Asa;
  quadra: number;
  bloco: string; // "A".."J" (ou "" quando não se aplica)
  capivaras: number; // 1.0 – 5.0
  avaliacoes: number;
  whatsapp?: string;
};

const EMOJI: Record<string, string> = {
  // Alimentação
  Restaurante: "🍽️",
  Lanchonete: "🍔",
  Pizzaria: "🍕",
  Churrascaria: "🥩",
  Hamburgueria: "🍔",
  Sushi: "🍣",
  Cafeteria: "☕",
  Padaria: "🥖",
  Confeitaria: "🎂",
  Sorveteria: "🍦",
  Bar: "🍺",
  Boteco: "🍻",
  "Açougue": "🥩",
  Mercearia: "🥫",
  Mercado: "🛒",
  Supermercado: "🛒",
  Hortifruti: "🥦",
  // Saúde e Beleza
  Farmácia: "💊",
  Clínica: "🩺",
  Dentista: "🦷",
  Academia: "🏋️",
  Barbearia: "💈",
  "Salão de Beleza": "💅",
  Estética: "💆",
  Spa: "🧖",
  // Serviços
  Lavanderia: "🧺",
  "Mecânica": "🔧",
  Borracharia: "🚗",
  "Lava a Jato": "🚿",
  Chaveiro: "🔑",
  Elétrica: "⚡",
  Encanamento: "🔩",
  "Assistência Técnica": "📱",
  Costura: "🧵",
  Sapataria: "👟",
  Tapeçaria: "🪑",
  // Comércio
  Papelaria: "📒",
  Livraria: "📚",
  "Loja de Roupas": "👗",
  Ótica: "👓",
  "Pet Shop": "🐾",
  Floricultara: "🌸",
  Floricultura: "🌸",
  Perfumaria: "🌺",
  Joalheria: "💍",
  Relojoaria: "⌚",
  "Loja de Eletrônicos": "💻",
  "Loja de Móveis": "🛋️",
  Ferragem: "🔨",
  "Material de Construção": "🧱",
  // Educação / Cultura
  Escola: "🏫",
  "Curso de Idiomas": "🌍",
  "Escola de Música": "🎵",
  "Studio de Dança": "💃",
  "Studio Pilates": "🧘",
  // Outros
  Correios: "📮",
  Banco: "🏦",
  "Lotérica": "🎰",
  Imobiliária: "🏠",
  Advocacia: "⚖️",
  Contabilidade: "📊",
  "Agência de Viagens": "✈️",
};

export function categoriaEmoji(c: string) {
  return EMOJI[c] ?? "📍";
}

/** Categorias do diretório — usadas no select do admin e nas páginas /categoria/[slug]. */
export const CATEGORIAS: string[] = [
  // Alimentação
  "Restaurante",
  "Lanchonete",
  "Pizzaria",
  "Churrascaria",
  "Hamburgueria",
  "Sushi",
  "Cafeteria",
  "Padaria",
  "Confeitaria",
  "Sorveteria",
  "Bar",
  "Boteco",
  "Açougue",
  "Mercearia",
  "Mercado",
  "Supermercado",
  "Hortifruti",
  // Saúde e Beleza
  "Farmácia",
  "Clínica",
  "Dentista",
  "Academia",
  "Barbearia",
  "Salão de Beleza",
  "Estética",
  "Spa",
  // Serviços
  "Lavanderia",
  "Mecânica",
  "Borracharia",
  "Lava a Jato",
  "Chaveiro",
  "Assistência Técnica",
  "Costura",
  "Sapataria",
  // Comércio
  "Papelaria",
  "Livraria",
  "Loja de Roupas",
  "Ótica",
  "Pet Shop",
  "Floricultura",
  "Perfumaria",
  "Loja de Eletrônicos",
  "Ferragem",
  "Material de Construção",
  // Educação / Bem-estar
  "Escola",
  "Curso de Idiomas",
  "Studio Pilates",
  "Studio de Dança",
  // Serviços Profissionais
  "Banco",
  "Lotérica",
  "Imobiliária",
  "Contabilidade",
];

/** Normaliza uma categoria para slug de URL. Ex: "Salão de Beleza" → "salao-de-beleza". */
export function categoriaParaSlug(cat: string): string {
  return cat
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Resolve um slug de categoria de volta ao nome original, usando a lista de comércios. */
export function slugParaCategoria(
  slug: string,
  businesses: Business[],
): string | null {
  for (const b of businesses) {
    if (categoriaParaSlug(b.categoria) === slug) return b.categoria;
  }
  return null;
}

export function contagemPorCategoria(businesses: Business[]) {
  const m = new Map<string, number>();
  for (const b of businesses) m.set(b.categoria, (m.get(b.categoria) ?? 0) + 1);
  return Array.from(m, ([categoria, total]) => ({ categoria, total })).sort(
    (a, b) => b.total - a.total,
  );
}

export type Stats = { comercios: number; quadras: number };

export function computeStats(businesses: Business[]): Stats {
  return {
    comercios: businesses.length,
    quadras: new Set(businesses.map((b) => `${b.asa}-${b.quadra}`)).size,
  };
}

export function asaSigla(asa: Asa) {
  return asa === "Sul" ? "SUL" : "NORTE";
}

export function quadraLabel(b: { quadra: number; asa: Asa }) {
  return `QUADRA ${b.quadra} ${asaSigla(b.asa)}`;
}

function normalizar(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

function porBloco(a: Business, b: Business) {
  return (a.bloco || "~").localeCompare(b.bloco || "~");
}

export type Grupo = {
  key: string;
  label: string;
  asa: Asa;
  quadra: number;
  items: Business[];
};

function agrupar(items: Business[]): Grupo[] {
  const mapa = new Map<string, Grupo>();
  for (const b of items) {
    const key = `${b.asa}|${b.quadra}`;
    if (!mapa.has(key)) {
      mapa.set(key, {
        key,
        label: quadraLabel(b),
        asa: b.asa,
        quadra: b.quadra,
        items: [],
      });
    }
    mapa.get(key)!.items.push(b);
  }
  const grupos = Array.from(mapa.values());
  for (const g of grupos) g.items.sort(porBloco);
  grupos.sort((a, b) =>
    a.asa === b.asa ? a.quadra - b.quadra : a.asa === "Sul" ? -1 : 1,
  );
  return grupos;
}

export type Resultado = {
  mode: "quadra" | "tema" | "vazio";
  titulo: string;
  total: number;
  grupos: Grupo[];
};

export function buscar(query: string, businesses: Business[]): Resultado {
  const q = normalizar(query);
  if (!q) return { mode: "vazio", titulo: "", total: 0, grupos: [] };

  const numMatch = q.match(/\b(\d{3})\b/);
  const isSul = /\bsul\b|sqs|cls/.test(q);
  const isNorte = /\bnorte\b|sqn|cln/.test(q);
  const resto = q
    .replace(/\b\d{3}\b/g, "")
    .replace(/sul|norte|sqs|sqn|cls|cln|quadra|qd|bloco/g, "")
    .trim();

  // Modo QUADRA: tem um número de 3 dígitos e o resto é só asa/quadra (sem tema)
  if (numMatch && resto === "") {
    const quadra = Number(numMatch[1]);
    const items = businesses
      .filter(
        (b) =>
          b.quadra === quadra &&
          (isSul ? b.asa === "Sul" : isNorte ? b.asa === "Norte" : true),
      )
      .sort(porBloco);
    return {
      mode: "quadra",
      titulo: `Quadra ${quadra}${isSul ? " Sul" : isNorte ? " Norte" : ""}`,
      total: items.length,
      grupos: agrupar(items),
    };
  }

  // Modo TEMA: casa categoria ou nome (bidirecional, tolera plural)
  const items = businesses.filter((b) => {
    const cat = normalizar(b.categoria);
    const nome = normalizar(b.nome);
    return cat.includes(q) || q.includes(cat) || nome.includes(q);
  });
  return {
    mode: "tema",
    titulo: query.trim(),
    total: items.length,
    grupos: agrupar(items),
  };
}
