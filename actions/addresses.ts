"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const AddressSchema = z.object({
  label: z.string().min(1).default("Home"),
  name: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit Indian mobile required"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Valid 6-digit pincode required"),
  country: z.string().default("India"),
  isPrimary: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof AddressSchema>;

// ── Get all addresses for a user ───────────────────────────────────────────
export async function getUserAddresses(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
  });
}

// ── Add new address ────────────────────────────────────────────────────────
export async function addAddress(userId: string, data: AddressInput) {
  const validated = AddressSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message };
  }

  const { isPrimary, ...rest } = validated.data;

  // If setting as primary, unset all others first
  if (isPrimary) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isPrimary: false },
    });
  }

  // If this is the first address, always make it primary
  const count = await prisma.address.count({ where: { userId } });
  const shouldBePrimary = isPrimary || count === 0;

  await prisma.address.create({
    data: { ...rest, userId, isPrimary: shouldBePrimary },
  });

  revalidatePath("/profile");
  revalidatePath("/checkout");
  return { success: true };
}

// ── Update address ─────────────────────────────────────────────────────────
export async function updateAddress(
  addressId: string,
  userId: string,
  data: AddressInput
) {
  const validated = AddressSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message };
  }

  const { isPrimary, ...rest } = validated.data;

  // Verify ownership
  const existing = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });
  if (!existing) return { success: false, error: "Address not found" };

  if (isPrimary) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isPrimary: false },
    });
  }

  await prisma.address.update({
    where: { id: addressId },
    data: { ...rest, isPrimary },
  });

  revalidatePath("/profile");
  revalidatePath("/checkout");
  return { success: true };
}

// ── Delete address ─────────────────────────────────────────────────────────
export async function deleteAddress(addressId: string, userId: string) {
  const existing = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });
  if (!existing) return { success: false, error: "Address not found" };

  await prisma.address.delete({ where: { id: addressId } });

  // If deleted address was primary, promote the next one
  if (existing.isPrimary) {
    const next = await prisma.address.findFirst({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
    if (next) {
      await prisma.address.update({
        where: { id: next.id },
        data: { isPrimary: true },
      });
    }
  }

  revalidatePath("/profile");
  revalidatePath("/checkout");
  return { success: true };
}

// ── Set address as primary ─────────────────────────────────────────────────
export async function setPrimaryAddress(addressId: string, userId: string) {
  await prisma.address.updateMany({
    where: { userId },
    data: { isPrimary: false },
  });
  await prisma.address.update({
    where: { id: addressId },
    data: { isPrimary: true },
  });

  revalidatePath("/profile");
  revalidatePath("/checkout");
  return { success: true };
}
