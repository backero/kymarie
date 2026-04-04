"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

// ── Subscribe to Newsletter ───────────────────────────────────────────────────
export async function subscribeNewsletter(email: string) {
  const parsed = z.string().email().safeParse(email);
  if (!parsed.success) {
    return { success: false, error: "Invalid email address" };
  }

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
