import "server-only";
import { createPublicClient } from "./supabase";
import { SEED_BUSINESSES } from "./seed";
import type { Asa, Business, PresencaGoogle } from "./data";

export type { PresencaGoogle } from "./data";

/** Perfil completo de um comércio (página /comercio/[slug]). */
export type ComercioDetalhe = Business & {
  endereco?: string;
  telefone?: string;
  instagram?: string;
  site?: string;
  website?: string;
  descricao?: string;
  presencaGoogle: PresencaGoogle;
};

type ComercioRow = {
  slug: string;
  nome: string;
  categoria: string;
  asa: string;
  quadra: number;
  bloco: string | null;
  capivaras: number | string | null;
  avaliacoes: number | null;
  whatsapp: string | null;
  foto_url: string | null;
  horario_funcionamento: string[] | null;
  presenca_google: string | null;
};

type ComercioDetalheRow = ComercioRow & {
  endereco: string | null;
  telefone: string | null;
  instagram: string | null;
  site: string | null;
  website: string | null;
  descricao: string | null;
};

function mapRow(r: ComercioRow): Business {
  return {
    id: r.slug,
    nome: r.nome,
    categoria: r.categoria,
    asa: r.asa as Asa,
    quadra: r.quadra,
    bloco: r.bloco ?? "",
    capivaras: Number(r.capivaras ?? 0),
    avaliacoes: r.avaliacoes ?? 0,
    whatsapp: r.whatsapp ?? undefined,
    fotoUrl: r.foto_url ?? undefined,
    horarioFuncionamento: Array.isArray(r.horario_funcionamento)
      ? r.horario_funcionamento
      : undefined,
    presencaGoogle: (r.presenca_google ?? "desconhecida") as PresencaGoogle,
  };
}

function mapDetalhe(r: ComercioDetalheRow): ComercioDetalhe {
  return {
    ...mapRow(r),
    endereco: r.endereco ?? undefined,
    telefone: r.telefone ?? undefined,
    instagram: r.instagram ?? undefined,
    site: r.site ?? undefined,
    website: r.website ?? undefined,
    descricao: r.descricao ?? undefined,
    presencaGoogle: (r.presenca_google ?? "desconhecida") as PresencaGoogle,
  };
}

/**
 * Carrega todos os comércios ativos do Supabase. A busca/agrupamento roda no
 * cliente sobre esta lista (UX instantânea), então buscamos tudo de uma vez.
 * Se o Supabase falhar ou não estiver configurado, cai no seed para o site
 * nunca abrir vazio.
 */
export async function getComercios(): Promise<Business[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return SEED_BUSINESSES;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("comercios")
      .select(
        "slug,nome,categoria,asa,quadra,bloco,capivaras,avaliacoes,whatsapp,foto_url,horario_funcionamento,presenca_google",
      )
      .eq("ativo", true)
      .order("asa", { ascending: true })
      .order("quadra", { ascending: true })
      .order("bloco", { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) return SEED_BUSINESSES;

    return (data as ComercioRow[]).map(mapRow);
  } catch (err) {
    console.error("[QC] Falha ao carregar comércios do Supabase:", err);
    return SEED_BUSINESSES;
  }
}

/** Carrega o perfil completo de um comércio pelo slug. null se não existir. */
export async function getComercioBySlug(
  slug: string,
): Promise<ComercioDetalhe | null> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const seed = SEED_BUSINESSES.find((b) => b.id === slug);
    return seed ? { ...seed, presencaGoogle: "desconhecida" } : null;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("comercios")
      .select(
        "slug,nome,categoria,asa,quadra,bloco,capivaras,avaliacoes,whatsapp,endereco,telefone,instagram,site,website,descricao,foto_url,horario_funcionamento,presenca_google",
      )
      .eq("ativo", true)
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    return mapDetalhe(data as ComercioDetalheRow);
  } catch (err) {
    console.error("[QC] Falha ao carregar comércio:", err);
    const seed = SEED_BUSINESSES.find((b) => b.id === slug);
    return seed ? { ...seed, presencaGoogle: "desconhecida" } : null;
  }
}

/** Slugs de todos os comércios ativos — para generateStaticParams. */
export async function getComercioSlugs(): Promise<string[]> {
  const businesses = await getComercios();
  return businesses.map((b) => b.id);
}
