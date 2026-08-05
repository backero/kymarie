"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const SETTINGS_ID = "singleton";

const DEFAULT_SETTINGS = {
  shippingFee: 60,
  freeShippingThreshold: 599,
  businessAddress: null as string | null,
  contactEmail: null as string | null,
  contactPhone: null as string | null,
  whatsappNumber: null as string | null,
  instagramUrl: null as string | null,
  facebookUrl: null as string | null,
  twitterUrl: null as string | null,
};

// ── Validation Schema ────────────────────────────────────────────────────────
const SettingsSchema = z.object({
  shippingFee: z.number().min(0),
  freeShippingThreshold: z.number().min(0),
  businessAddress: z.string().optional().nullable(),
  contactEmail: z.string().email().optional().nullable().or(z.literal("")),
  contactPhone: z.string().optional().nullable(),
  whatsappNumber: z.string().optional().nullable(),
  instagramUrl: z.string().url().optional().nullable().or(z.literal("")),
  facebookUrl: z.string().url().optional().nullable().or(z.literal("")),
  twitterUrl: z.string().url().optional().nullable().or(z.literal("")),
});

export type SettingsInput = z.infer<typeof SettingsSchema>;

// ── Get Settings (public — used by storefront) ──────────────────────────────
export async function getSettings() {
  const settings = await prisma.settings.findUnique({
    where: { id: SETTINGS_ID },
  });
  return settings ?? { id: SETTINGS_ID, ...DEFAULT_SETTINGS, updatedAt: new Date() };
}

// ── Update Settings (admin) ──────────────────────────────────────────────────
export async function updateSettings(data: SettingsInput) {
  await requireAdmin();

  const validated = SettingsSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message };
  }

  const cleaned = {
    ...validated.data,
    contactEmail: validated.data.contactEmail || null,
    instagramUrl: validated.data.instagramUrl || null,
    facebookUrl: validated.data.facebookUrl || null,
    twitterUrl: validated.data.twitterUrl || null,
  };

  await prisma.settings.upsert({
    where: { id: SETTINGS_ID },
    update: cleaned,
    create: { id: SETTINGS_ID, ...cleaned },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/contact");

  return { success: true };
}
