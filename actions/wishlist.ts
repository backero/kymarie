"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ── Get user wishlist ──────────────────────────────────────────────────────
export async function getWishlist(userId: string) {
  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    include: {
      product: {
        include: { category: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return items;
}

// ── Toggle wishlist item ───────────────────────────────────────────────────
export async function toggleWishlist(userId: string, productId: string) {
  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({
      where: { userId_productId: { userId, productId } },
    });
    revalidatePath("/profile");
    return { success: true, added: false };
  } else {
    await prisma.wishlistItem.create({
      data: { userId, productId },
    });
    revalidatePath("/profile");
    return { success: true, added: true };
  }
}

// ── Get wishlisted product IDs (for batch server-side lookups) ──────────────
export async function getWishlistedProductIds(userId: string): Promise<string[]> {
  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    select: { productId: true },
  });
  return items.map((i) => i.productId);
}

// ── Check if product is wishlisted ─────────────────────────────────────────
export async function isWishlisted(userId: string, productId: string) {
  const item = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  return !!item;
}

// ── Remove from wishlist ───────────────────────────────────────────────────
export async function removeFromWishlist(userId: string, productId: string) {
  await prisma.wishlistItem.deleteMany({
    where: { userId, productId },
  });
  revalidatePath("/profile");
  return { success: true };
}
