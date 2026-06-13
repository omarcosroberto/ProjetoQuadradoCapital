import type { MetadataRoute } from "next";

const BASE = "https://quadradocapital.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
  ];
}
