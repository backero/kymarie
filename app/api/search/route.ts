import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const category = req.nextUrl.searchParams.get("category")?.trim() ?? "";
  const type = req.nextUrl.searchParams.get("type") ?? "results"; // "results" | "suggestions"

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [], suggestions: [] });
  }

  const categoryFilter =
    category && category !== "all" ? { category: { slug: category } } : {};

  // ── Suggestions (name-only, lightweight) ──────────────────────────────────
  if (type === "suggestions") {
    const suggestions = await prisma.product.findMany({
      where: {
        isActive: true,
        name: { contains: q, mode: "insensitive" },
        ...categoryFilter,
      },
      select: { name: true, slug: true, category: { select: { name: true } } },
      orderBy: [{ isFeatured: "desc" }],
      take: 8,
    });
    return NextResponse.json({ suggestions });
  }

  // ── Full results ───────────────────────────────────────────────────────────
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { shortDesc: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { tags: { has: q } },
      ],
      ...categoryFilter,
    },
    include: { category: true },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: 8,
  });

  // ── Category counts ────────────────────────────────────────────────────────
  const allMatches = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { shortDesc: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    },
    select: { category: { select: { name: true, slug: true } } },
  });

  const categoryCounts: Record<
    string,
    { name: string; slug: string; count: number }
  > = {};
  for (const p of allMatches) {
    const { name, slug } = p.category;
    if (!categoryCounts[slug]) categoryCounts[slug] = { name, slug, count: 0 };
    categoryCounts[slug].count++;
  }

  return NextResponse.json({
    results: products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      comparePrice: p.comparePrice,
      thumbnail: p.thumbnail,
      images: p.images,
      isNew: p.isNew,
      isFeatured: p.isFeatured,
      category: { name: p.category.name, slug: p.category.slug },
    })),
    categoryCounts: Object.values(categoryCounts),
    total: allMatches.length,
  });
}
