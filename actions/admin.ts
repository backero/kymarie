"use server";

import { validateAdmin, createToken, setAuthCookie, clearAuthCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

// ── Admin Login ───────────────────────────────────────────────────────────────
export async function adminLogin(data: z.infer<typeof LoginSchema>) {
  const validated = LoginSchema.parse(data);

  const admin = await validateAdmin(validated.email, validated.password);

  if (!admin) {
    return { success: false, error: "Invalid email or password" };
  }

  const token = createToken(admin);
  await setAuthCookie(token);

  return { success: true };
}

// ── Admin Logout ──────────────────────────────────────────────────────────────
export async function adminLogout() {
  await clearAuthCookie();
  redirect("/admin/login");
}

// ── Subscribe to Newsletter ───────────────────────────────────────────────────
export async function subscribeNewsletter(email: string) {
  const { prisma } = await import("@/lib/prisma");

  try {
    const existing = await prisma.newsletter.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "Already subscribed!" };
    }

    await prisma.newsletter.create({ data: { email } });
    return { success: true, message: "Successfully subscribed!" };
  } catch {
    return { success: false, error: "Subscription failed. Please try again." };
  }
}
