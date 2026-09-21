import type { MetadataRoute } from "next";
import { fabrics } from "@/data/fabrics";
import { categoryPages } from "@/data/categories";
import { cityPages } from "@/data/cities";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/catalog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/delivery`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contacts`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categoryPages.map((page) => ({
    url: `${SITE_URL}/catalog/kategoriya/${page.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const cityRoutes: MetadataRoute.Sitemap = cityPages.map((page) => ({
    url: `${SITE_URL}/portyernye-tkani-optom/${page.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const fabricRoutes: MetadataRoute.Sitemap = fabrics.map((fabric) => ({
    url: `${SITE_URL}/catalog/${fabric.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...cityRoutes, ...fabricRoutes];
}
