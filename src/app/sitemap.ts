import type { MetadataRoute } from "next";
import { getAllBrandSlugs } from "@/lib/brands";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const brandSlugs = getAllBrandSlugs();

  const brandPages: MetadataRoute.Sitemap = brandSlugs.map((slug) => ({
    url: `${baseUrl}/brand/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/ranking`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...brandPages,
  ];
}
