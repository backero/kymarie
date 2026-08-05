/**
 * Kumarie — Upload processed product images to Cloudinary
 * Run: node scripts/upload-to-cloudinary.js
 *
 * Reads public/images/products/*.jpg, uploads each to Cloudinary
 * under kumarie/products/{slug}, then prints the URL map for seed.ts.
 */

const fs      = require("fs");
const path    = require("path");
const { v2: cloudinary } = require("cloudinary");

// Load .env.local manually (no dotenv dependency)
const envPath = path.join(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf8").split("\n").forEach(line => {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)="?([^"]*)"?$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  });
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PRODUCTS_DIR = path.join(__dirname, "../public/images/products");
const HERO_DIR     = path.join(__dirname, "../public/images/hero");

function uploadFile(filePath, publicId, folder) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        public_id: publicId,
        folder,
        overwrite: true,
        resource_type: "image",
        transformation: [
          { width: 900, height: 1125, crop: "fill", gravity: "center" },
          { quality: "auto:best" },
          { fetch_format: "auto" },
        ],
      },
      (err, result) => {
        if (err || !result) return reject(err || new Error("Upload failed"));
        resolve(result.secure_url);
      }
    );
  });
}

async function main() {
  console.log("\n☁️   Kumarie — Cloudinary Uploader\n");

  if (!process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY === "your-api-key") {
    console.error("❌  CLOUDINARY_API_KEY not set in .env.local");
    process.exit(1);
  }

  if (!fs.existsSync(PRODUCTS_DIR)) {
    console.error(`❌  Products folder not found: ${PRODUCTS_DIR}`);
    console.error("    Run: node scripts/process-product-images.js  first");
    process.exit(1);
  }

  const files = fs.readdirSync(PRODUCTS_DIR).filter(f => f.endsWith(".jpg"));
  if (files.length === 0) {
    console.error("❌  No .jpg files found in public/images/products/");
    process.exit(1);
  }

  const urlMap = {};

  // ── Product images ──
  console.log(`📦  Uploading ${files.length} product images…\n`);
  for (const file of files) {
    const slug     = path.basename(file, ".jpg");
    const filePath = path.join(PRODUCTS_DIR, file);
    try {
      const url = await uploadFile(filePath, slug, "kumarie/products");
      urlMap[slug] = url;
      console.log(`  ✓  ${slug}`);
      console.log(`     ${url}`);
    } catch (e) {
      console.error(`  ✗  ${slug}: ${e.message}`);
    }
  }

  // ── Hero images ──
  if (fs.existsSync(HERO_DIR)) {
    const heroFiles = fs.readdirSync(HERO_DIR).filter(f => f.endsWith(".jpg"));
    if (heroFiles.length > 0) {
      console.log(`\n🖼   Uploading ${heroFiles.length} hero images…\n`);
      for (const file of heroFiles) {
        const slug     = path.basename(file, ".jpg");
        const filePath = path.join(HERO_DIR, file);
        try {
          const url = await uploadFile(filePath, slug, "kumarie/hero");
          urlMap[`hero/${slug}`] = url;
          console.log(`  ✓  hero/${slug}`);
          console.log(`     ${url}`);
        } catch (e) {
          console.error(`  ✗  hero/${slug}: ${e.message}`);
        }
      }
    }
  }

  // ── Output URL map for seed.ts ──
  const succeeded = Object.keys(urlMap).filter(k => !k.startsWith("hero/"));
  console.log(`\n${"─".repeat(60)}`);
  console.log(`  Uploaded: ${succeeded.length} / ${files.length} product images`);
  console.log(`${"─".repeat(60)}\n`);

  // Write URL map to a JSON file for use by seed-with-cloudinary.js
  const outPath = path.join(__dirname, "cloudinary-urls.json");
  fs.writeFileSync(outPath, JSON.stringify(urlMap, null, 2));
  console.log(`✅  URL map saved to scripts/cloudinary-urls.json`);
  console.log(`    Run: node scripts/seed-with-cloudinary.js  to update the database\n`);
}

main().catch(e => { console.error(e); process.exit(1); });
