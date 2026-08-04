"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ── Validation Schema ────────────────────────────────────────────────────────
const ReviewSchema = z.object({
  author: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  body: z.string().min(10, "Review must be at least 10 characters"),
});

export type ReviewInput = z.infer<typeof ReviewSchema>;

// ── Submit Review (public) ──────────────────────────────────────────────────────
export async function submitReview(productId: string, data: ReviewInput) {
  const validated = ReviewSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message };
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return { success: false, error: "Product not found" };

  await prisma.review.create({
    data: {
      productId,
      author: validated.data.author,
      email: validated.data.email,
      rating: validated.data.rating,
      title: validated.data.title || null,
      body: validated.data.body,
      isApproved: false,
    },
  });

  revalidatePath(`/products/${product.slug}`);
  return { success: true };
}

// ── Get Product Review Stats (public) ────────────────────────────────────────────
export async function getProductReviewStats(productId: string) {
  const result = await prisma.review.aggregate({
    where: { productId, isApproved: true },
    _avg: { rating: true },
    _count: true,
  });

  return {
    average: result._avg.rating ?? 0,
    count: result._count,
  };
}

// ── Get All Reviews (admin) ──────────────────────────────────────────────────────
export async function getAllReviewsAdmin() {
  await requireAdmin();
  return prisma.review.findMany({
    include: { product: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });
}

// ── Toggle Review Approval ─────────────────────────────────────────────────────
export async function toggleReviewApproval(id: string) {
  await requireAdmin();

  const review = await prisma.review.findUnique({
    where: { id },
    include: { product: { select: { slug: true } } },
  });
  if (!review) throw new Error("Review not found");

  await prisma.review.update({
    where: { id },
    data: { isApproved: !review.isApproved },
  });

  revalidatePath("/admin/reviews");
  revalidatePath(`/products/${review.product.slug}`);
  return { success: true };
}

// ── Delete Review ──────────────────────────────────────────────────────────────
export async function deleteReview(id: string) {
  await requireAdmin();

  const review = await prisma.review.findUnique({
    where: { id },
    include: { product: { select: { slug: true } } },
  });
  if (!review) throw new Error("Review not found");

  await prisma.review.delete({ where: { id } });

  revalidatePath("/admin/reviews");
  revalidatePath(`/products/${review.product.slug}`);
  return { success: true };
}
