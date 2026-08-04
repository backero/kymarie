"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ── Validation Schema ────────────────────────────────────────────────────────
const CouponSchema = z.object({
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .transform((v) => v.trim().toUpperCase()),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().positive("Value must be positive"),
  minOrder: z.number().min(0).optional().nullable(),
  maxUses: z.number().int().positive().optional().nullable(),
  isActive: z.boolean().default(true),
  expiresAt: z.string().optional().nullable(),
});

export type CouponInput = z.infer<typeof CouponSchema>;

// ── Get All Coupons (admin) ───────────────────────────────────────────────────
export async function getAllCouponsAdmin() {
  await requireAdmin();
  return prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
}

// ── Get Coupon By ID (admin) ──────────────────────────────────────────────────
export async function getCouponById(id: string) {
  await requireAdmin();
  return prisma.coupon.findUnique({ where: { id } });
}

// ── Create Coupon ──────────────────────────────────────────────────────────────
export async function createCoupon(data: CouponInput) {
  await requireAdmin();

  const validated = CouponSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message };
  }

  const existing = await prisma.coupon.findUnique({
    where: { code: validated.data.code },
  });
  if (existing) {
    return { success: false, error: "A coupon with this code already exists" };
  }

  await prisma.coupon.create({
    data: {
      code: validated.data.code,
      type: validated.data.type,
      value: validated.data.value,
      minOrder: validated.data.minOrder ?? null,
      maxUses: validated.data.maxUses ?? null,
      isActive: validated.data.isActive,
      expiresAt: validated.data.expiresAt ? new Date(validated.data.expiresAt) : null,
    },
  });

  revalidatePath("/admin/coupons");
  return { success: true };
}

// ── Update Coupon ──────────────────────────────────────────────────────────────
export async function updateCoupon(id: string, data: CouponInput) {
  await requireAdmin();

  const validated = CouponSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message };
  }

  const existing = await prisma.coupon.findFirst({
    where: { code: validated.data.code, NOT: { id } },
  });
  if (existing) {
    return { success: false, error: "A coupon with this code already exists" };
  }

  await prisma.coupon.update({
    where: { id },
    data: {
      code: validated.data.code,
      type: validated.data.type,
      value: validated.data.value,
      minOrder: validated.data.minOrder ?? null,
      maxUses: validated.data.maxUses ?? null,
      isActive: validated.data.isActive,
      expiresAt: validated.data.expiresAt ? new Date(validated.data.expiresAt) : null,
    },
  });

  revalidatePath("/admin/coupons");
  return { success: true };
}

// ── Delete Coupon ──────────────────────────────────────────────────────────────
export async function deleteCoupon(id: string) {
  await requireAdmin();
  await prisma.coupon.delete({ where: { id } });
  revalidatePath("/admin/coupons");
  return { success: true };
}

// ── Toggle Coupon Status ────────────────────────────────────────────────────────
export async function toggleCouponStatus(id: string) {
  await requireAdmin();

  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) throw new Error("Coupon not found");

  await prisma.coupon.update({
    where: { id },
    data: { isActive: !coupon.isActive },
  });

  revalidatePath("/admin/coupons");
  return { success: true };
}

// ── Validate & Apply Coupon (public) ────────────────────────────────────────────
export async function validateCoupon(code: string, subtotal: number) {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.trim().toUpperCase() },
  });

  if (!coupon) return { success: false, error: "Invalid coupon code" };
  if (!coupon.isActive) return { success: false, error: "This coupon is no longer active" };
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { success: false, error: "This coupon has expired" };
  }
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return { success: false, error: "This coupon has reached its usage limit" };
  }
  if (coupon.minOrder && subtotal < coupon.minOrder) {
    return {
      success: false,
      error: `Minimum order of ₹${coupon.minOrder} required for this coupon`,
    };
  }

  const discount =
    coupon.type === "PERCENTAGE"
      ? Math.round((subtotal * coupon.value) / 100)
      : Math.min(coupon.value, subtotal);

  return { success: true, code: coupon.code, discount };
}
