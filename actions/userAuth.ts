"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
});

// ── Register a new user ────────────────────────────────────────────────────
export async function registerUser(data: z.infer<typeof RegisterSchema>) {
  const validated = RegisterSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.errors[0].message,
    };
  }

  const { name, email, password, phone } = validated.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "An account with this email already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone: phone || null,
    },
  });

  return { success: true };
}

// ── Update user profile ───────────────────────────────────────────────────
const UpdateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
});

export async function updateUserProfile(
  userId: string,
  data: z.infer<typeof UpdateProfileSchema>
) {
  const validated = UpdateProfileSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message };
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: validated.data.name,
      phone: validated.data.phone || null,
    },
  });

  return { success: true };
}

// ── Change password ────────────────────────────────────────────────────────
const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export async function changeUserPassword(
  userId: string,
  data: z.infer<typeof ChangePasswordSchema>
) {
  const validated = ChangePasswordSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { success: false, error: "User not found" };

  const valid = await bcrypt.compare(validated.data.currentPassword, user.password);
  if (!valid) return { success: false, error: "Current password is incorrect" };

  const hashed = await bcrypt.hash(validated.data.newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });

  return { success: true };
}

// ── Get user orders ────────────────────────────────────────────────────────
export async function getUserOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return orders;
}
