import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = "kumarie_admin_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface AdminPayload {
  id: string;
  email: string;
  name: string;
}

// ── Token creation ──────────────────────────────────────────────────────────
export function createToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// ── Token verification ──────────────────────────────────────────────────────
export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch {
    return null;
  }
}

// ── Get admin from cookie ───────────────────────────────────────────────────
export async function getAdminFromCookie(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ── Set auth cookie ─────────────────────────────────────────────────────────
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

// ── Clear auth cookie ────────────────────────────────────────────────────────
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// ── Validate admin credentials ──────────────────────────────────────────────
export async function validateAdmin(
  email: string,
  password: string
): Promise<AdminPayload | null> {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return null;

  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) return null;

  return { id: admin.id, email: admin.email, name: admin.name };
}

// ── Hash password ─────────────────────────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// ── Require admin (throws if not authenticated) ──────────────────────────
export async function requireAdmin(): Promise<AdminPayload> {
  const admin = await getAdminFromCookie();
  if (!admin) {
    throw new Error("Unauthorized");
  }
  return admin;
}
