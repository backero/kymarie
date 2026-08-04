// Repeatable sync: copies Category + Product rows from the production DB
// (pulled fresh from Vercel each run) into the local dev DB. Upserts by id,
// so it's safe to re-run any time — never deletes local Orders/Reviews/
// Wishlist rows, and never touches Users/Admins/Coupons.
//
// Requires: `vercel` CLI installed and this project linked (`vercel link`)
// and logged in to the account that owns the kumarie-app project.
//
// Usage: npm run db:sync-prod

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const ROOT = process.cwd();
const PROD_ENV_FILE = path.join(ROOT, ".env.production.local");
const LOCAL_ENV_FILE = path.join(ROOT, ".env.local");

function readDatabaseUrl(envFilePath: string): string {
  const content = fs.readFileSync(envFilePath, "utf-8");
  const match = content.match(/^DATABASE_URL="?([^"\n]+)"?/m);
  if (!match) {
    throw new Error(`Could not find DATABASE_URL in ${envFilePath}`);
  }
  return match[1];
}

function pullProductionDatabaseUrl(): string {
  console.log("Pulling production environment variables from Vercel...");
  execSync(
    `vercel env pull "${PROD_ENV_FILE}" --environment=production --yes`,
    { cwd: ROOT, stdio: "inherit" }
  );
  try {
    return readDatabaseUrl(PROD_ENV_FILE);
  } finally {
    fs.unlinkSync(PROD_ENV_FILE);
  }
}

async function main() {
  const prodUrl = pullProductionDatabaseUrl();
  const localUrl = readDatabaseUrl(LOCAL_ENV_FILE);

  if (prodUrl === localUrl) {
    throw new Error(
      "Production and local DATABASE_URL are identical — refusing to sync a database into itself."
    );
  }

  const prod = new PrismaClient({ datasources: { db: { url: prodUrl } } });
  const local = new PrismaClient({ datasources: { db: { url: localUrl } } });

  try {
    const categories = await prod.category.findMany();
    const products = await prod.product.findMany();
    console.log(
      `Found in production: ${categories.length} categories, ${products.length} products`
    );

    for (const cat of categories) {
      await local.category.upsert({
        where: { id: cat.id },
        update: cat,
        create: cat,
      });
    }
    console.log(`Synced ${categories.length} categories`);

    for (const p of products) {
      await local.product.upsert({
        where: { id: p.id },
        update: p,
        create: p,
      });
    }
    console.log(`Synced ${products.length} products`);
  } finally {
    await prod.$disconnect();
    await local.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
