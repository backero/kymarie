import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.kumarie.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: appUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${appUrl}/products`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${appUrl}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${appUrl}/our-story`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${appUrl}/journal`, lastModified: now, changeFrequency: "weekly", priority: 0.4 },
    { url: `${appUrl}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${appUrl}/sustainability`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${appUrl}/returns`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${appUrl}/shipping`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${appUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${appUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  let products: { slug: string; updatedAt: Date }[] = [];
  let categories: { slug: string }[] = [];

  try {
    [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.category.findMany({
        select: { slug: true },
      }),
    ]);
  } catch {
    return staticRoutes;
  }

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${appUrl}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${appUrl}/products?category=${category.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
