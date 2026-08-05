"use server";

import { prisma, withRetry } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ── Validation Schemas ──────────────────────────────────────────────────────
const ProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description too short"),
  shortDesc: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  comparePrice: z.number().optional().nullable(),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  sku: z.string().optional().nullable(),
  weight: z.number().optional().nullable(),
  categoryId: z.string().min(1, "Category is required"),
  tags: z.array(z.string()),
  ingredients: z.string().optional().nullable(),
  howToUse: z.string().optional().nullable(),
  benefits: z.array(z.string()),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  metaTitle: z.string().optional().nullable(),
  metaDesc: z.string().optional().nullable(),
  images: z.array(z.string()),
  thumbnail: z.string().optional().nullable(),
});

// ── Get All Products (public) ────────────────────────────────────────────────
export async function getProducts(options?: {
  category?: string;
  featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const { category, featured, search, page = 1, limit = 12 } = options || {};

  const where: Record<string, unknown> = { isActive: true };

  if (category) {
    where.category = { slug: category };
  }

  if (featured !== undefined) {
    where.isFeatured = featured;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { tags: { hasSome: [search] } },
    ];
  }

  const [products, total] = await withRetry(() =>
    Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])
  );

  return {
    products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

// ── Get Single Product ────────────────────────────────────────────────────────
export async function getProductBySlug(slug: string) {
  return withRetry(() =>
    prisma.product.findFirst({
      where: { slug, isActive: true },
      include: {
        category: true,
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    })
  );
}

// ── Get Product By ID (admin) ─────────────────────────────────────────────────
export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
}

// ── Get Featured Products ─────────────────────────────────────────────────────
export async function getFeaturedProducts(limit = 4) {
  return withRetry(() =>
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    })
  );
}

// ── Get All Products (admin) ──────────────────────────────────────────────────
export async function getAllProductsAdmin() {
  await requireAdmin();
  return prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

// ── Create Product ────────────────────────────────────────────────────────────
export async function createProduct(data: z.infer<typeof ProductSchema>) {
  await requireAdmin();

  const validated = ProductSchema.parse(data);
  const slug = generateSlug(validated.name);

  // Check slug uniqueness
  const existing = await prisma.product.findUnique({ where: { slug } });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  const product = await prisma.product.create({
    data: {
      ...validated,
      slug: finalSlug,
      comparePrice: validated.comparePrice ?? null,
      sku: validated.sku ?? null,
      weight: validated.weight ?? null,
      ingredients: validated.ingredients ?? null,
      howToUse: validated.howToUse ?? null,
      metaTitle: validated.metaTitle ?? null,
      metaDesc: validated.metaDesc ?? null,
      thumbnail: validated.thumbnail ?? null,
      shortDesc: validated.shortDesc ?? null,
    },
  });

  revalidatePath("/products");
  revalidatePath("/admin/products");
  return { success: true, product };
}

// ── Update Product ────────────────────────────────────────────────────────────
export async function updateProduct(
  id: string,
  data: Partial<z.infer<typeof ProductSchema>>
) {
  await requireAdmin();

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });

  revalidatePath("/products");
  revalidatePath(`/products/${product.slug}`);
  revalidatePath("/admin/products");
  return { success: true, product };
}

// ── Delete Product ────────────────────────────────────────────────────────────
export async function deleteProduct(id: string) {
  await requireAdmin();

  await prisma.product.delete({ where: { id } });

  revalidatePath("/products");
  revalidatePath("/admin/products");
  return { success: true };
}

// ── Toggle Product Status ─────────────────────────────────────────────────────
export async function toggleProductStatus(id: string) {
  await requireAdmin();

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error("Product not found");

  await prisma.product.update({
    where: { id },
    data: { isActive: !product.isActive },
  });

  revalidatePath("/admin/products");
  return { success: true };
}

// ── Get Categories ────────────────────────────────────────────────────────────
export async function getCategories() {
  return withRetry(() =>
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    })
  );
}
