import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase-admin";
import { categoriaParaSlug } from "@/lib/data";

const BASE = "https://quadradocapital.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE}/privacidade`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE}/termos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE}/cookies`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  try {
    const supabase = createAdminClient();

    const [comerciosRes, categoriasRes] = await Promise.all([
      supabase
        .from("comercios")
        .select("slug, updated_at")
        .eq("ativo", true),
      supabase
        .from("comercios")
        .select("categoria")
        .eq("ativo", true),
    ]);

    const comercioPages: MetadataRoute.Sitemap = (comerciosRes.data ?? []).map(
      (row) => ({
        url: `${BASE}/comercio/${row.slug}`,
        lastModified: row.updated_at ? new Date(row.updated_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }),
    );

    const categoriasDistintas = Array.from(
      new Set((categoriasRes.data ?? []).map((r) => r.categoria as string)),
    );

    const categoriaPages: MetadataRoute.Sitemap = categoriasDistintas.map(
      (cat) => ({
        url: `${BASE}/categoria/${categoriaParaSlug(cat)}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }),
    );

    return [...staticPages, ...comercioPages, ...categoriaPages];
  } catch (err) {
    console.error("[QC] Falha ao gerar sitemap dinâmico:", err);
    return staticPages;
  }
}
