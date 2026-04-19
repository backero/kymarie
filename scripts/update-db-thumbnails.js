/**
 * Kumarie — Update product thumbnail + images in DB to new mockup URLs
 * Run: node scripts/update-db-thumbnails.js
 */

const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

// Load .env.local
const envPath = path.join(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf8").split("\n").forEach((line) => {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)="?([^"]*)"?$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  });
}

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL?.replace("&channel_binding=require", "") } },
});

// Versionless URLs so Cloudinary always serves the latest upload
const MOCKUP_URLS = JSON.parse(
  fs.readFileSync(path.join(__dirname, "mockup-product-urls.json"), "utf8")
);

async function main() {
  console.log("\n🗃️  Updating product thumbnails in database\n");

  for (const [slug, url] of Object.entries(MOCKUP_URLS)) {
    try {
      const updated = await prisma.product.updateMany({
        where: { slug },
        data: {
          thumbnail: url,
          images: [url],
        },
      });
      if (updated.count > 0) {
        console.log(`  ✓  ${slug}`);
      } else {
        console.log(`  ⚠  ${slug}: no product found`);
      }
    } catch (e) {
      console.error(`  ✗  ${slug}: ${e.message}`);
    }
  }

  await prisma.$disconnect();
  console.log("\n  Done.\n");
}

main().catch((e) => { console.error(e); process.exit(1); });
