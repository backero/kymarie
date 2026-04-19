import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        // Remove channel_binding which can block Neon cold-starts
        url: process.env.DATABASE_URL?.replace("&channel_binding=require", ""),
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Wraps any Prisma call with a single retry on connection failure.
 * Neon free-tier suspends after inactivity; the first query after
 * cold-start can fail — a brief wait + retry is enough to wake it.
 */
export async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      const isConnErr =
        msg.includes("Can't reach database") ||
        msg.includes("Connection refused") ||
        msg.includes("ECONNREFUSED") ||
        msg.includes("connect ETIMEDOUT");

      if (isConnErr && attempt < retries) {
        await new Promise((r) => setTimeout(r, 1800));
        continue;
      }
      throw err;
    }
  }
  throw new Error("unreachable");
}
