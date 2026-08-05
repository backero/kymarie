"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ── Validation Schema ────────────────────────────────────────────────────────
const CategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
});

export type CategoryInput = z.infer<typeof CategorySchema>;

// ── Get All Categories (admin) ───────────────────────────────────────────────
export async function getCategoriesAdmin() {
  await requireAdmin();
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

// ── Get Category By ID (admin) ───────────────────────────────────────────────
export async function getCategoryById(id: string) {
  await requireAdmin();
  return prisma.category.findUnique({ where: { id } });
}

// ── Create Category ──────────────────────────────────────────────────────────
export async function createCategory(data: CategoryInput) {
  await requireAdmin();

  const validated = CategorySchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message };
  }

  const existingName = await prisma.category.findUnique({
    where: { name: validated.data.name },
  });
  if (existingName) {
    return { success: false, error: "A category with this name already exists" };
  }

  const slug = generateSlug(validated.data.name);
  const existingSlug = await prisma.category.findUnique({ where: { slug } });
  const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

  const category = await prisma.category.create({
    data: {
      name: validated.data.name,
      slug: finalSlug,
      description: validated.data.description || null,
      image: validated.data.image || null,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return { success: true, category };
}

// ── Update Category ──────────────────────────────────────────────────────────
export async function updateCategory(id: string, data: CategoryInput) {
  await requireAdmin();

  const validated = CategorySchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message };
  }

  const existingName = await prisma.category.findFirst({
    where: { name: validated.data.name, NOT: { id } },
  });
  if (existingName) {
    return { success: false, error: "A category with this name already exists" };
  }

  await prisma.category.update({
    where: { id },
    data: {
      name: validated.data.name,
      description: validated.data.description || null,
      image: validated.data.image || null,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return { success: true };
}

// ── Delete Category ──────────────────────────────────────────────────────────
export async function deleteCategory(id: string) {
  await requireAdmin();

  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });
  if (!category) {
    return { success: false, error: "Category not found" };
  }
  if (category._count.products > 0) {
    return {
      success: false,
      error: `Cannot delete — ${category._count.products} product(s) still use this category`,
    };
  }

  await prisma.category.delete({ where: { id } });

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return { success: true };
}
