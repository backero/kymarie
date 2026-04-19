/**
 * Kumarie — Upload raw soap photos to kumarie/products-raw/{slug}
 * then update DB images[] to [mockupUrl, rawSoapUrl]
 * Run: node scripts/upload-raw-soaps.js
 */

const fs = require("fs");
const path = require("path");
const { v2: cloudinary } = require("cloudinary");
const { PrismaClient } = require("@prisma/client");

// Load .env.local
const envPath = path.join(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf8").split("\n").forEach((line) => {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)="?([^"]*)"?$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  });
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL?.replace("&channel_binding=require", "") } },
});

const RAW_DIR = path.join(__dirname, "../public/images/products");

// Load mockup URLs (uploaded previously)
const MOCKUP_URLS = JSON.parse(
  fs.readFileSync(path.join(__dirname, "mockup-product-urls.json"), "utf8")
);

async function uploadRaw(localPath, slug) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      localPath,
      {
        public_id: `kumarie/products-raw/${slug}`,
        overwrite: true,
        invalidate: true,
        resource_type: "image",
        format: "jpg",
        quality: "auto:best",
      },
      (err, res) => {
        if (err) return reject(err);
        resolve(res.secure_url);
      }
    );
  });
}

async function main() {
  console.log("\n🧼  Kumarie — Uploading Raw Soap Photos\n");

  const files = fs.readdirSync(RAW_DIR).filter(f => f.endsWith(".jpg"));
  const failed = [];

  for (const file of files) {
    const slug = path.basename(file, ".jpg");
    const localPath = path.join(RAW_DIR, file);
    const mockupUrl = MOCKUP_URLS[slug];

    if (!mockupUrl) {
      console.log(`  ⚠  ${slug}: no mockup URL, skipping`);
      continue;
    }

    try {
      // Upload raw soap photo
      const rawUrl = await uploadRaw(localPath, slug);

      // Update DB: images = [mockup, raw] — thumbnail stays as mockup
      await prisma.product.updateMany({
        where: { slug },
        data: {
          images: [mockupUrl, rawUrl],
        },
      });

      console.log(`  ✓  ${slug}`);
    } catch (e) {
      console.error(`  ✗  ${slug}: ${e.message}`);
      failed.push(slug);
    }
  }

  await prisma.$disconnect();

  console.log(`\n${"─".repeat(60)}`);
  console.log(`  Done    : ${files.length - failed.length} / ${files.length}`);
  if (failed.length) console.log(`  Failed  : ${failed.join(", ")}`);
  console.log(`  Gallery : mockup (main) + raw soap (thumbnail tab)`);
  console.log(`${"─".repeat(60)}\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
