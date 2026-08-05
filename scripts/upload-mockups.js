/**
 * Kumarie — Upload V4.2 M1 mockup JPGs to Cloudinary, replacing existing product images
 * Run: node scripts/upload-mockups.js
 */

const fs = require("fs");
const path = require("path");
const { v2: cloudinary } = require("cloudinary");

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

const MOCKUP_DIR = "D:/Soaps Updated/Mockup";

const FILE_TO_SLUG = {
  "Aavarampoo":  "aavarampoo-moringa-detox-brighten-soap",
  "Almond":      "almond-donkey-milk-skin-softening-soap",
  "Avacado":     "avocado-apricot-deep-nourishing-soap",
  "Charchol":    "charcoal-detox-polish-soap",
  "Choco":       "choco-coffee-energizing-polish-soap",
  "Goat-milk":   "goatmilk-oats-gentle-soothing-soap",
  "Herbal":      "herbal-revitalizing-soap",
  "Hibiscus":    "hibiscus-rose-floral-radiance-soap",
  "Honey":       "honey-red-wine-youth-radiance-antioxidant-soap",
  "Kuppameni":   "kuppaimeni-calming-skin-healing-soap",
  "Lavender":    "lavender-saffron-floral-glow-soap",
  "NeemThulasi": "neem-thulasi-skin-healing-soap",
  "Pappaya":     "papaya-orange-vitamin-c-brightening-soap",
  "Turmeric":    "turmeric-thulasi-acne-calming-soap",
  "beetroot":    "beetroot-glow-revitalizing-soap",
};

async function uploadMockup(localPath, slug) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      localPath,
      {
        public_id: `kumarie/products/${slug}`,
        overwrite: true,
        invalidate: true,          // purge CDN cache so new image is served immediately
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
  console.log("\n🎁  Kumarie — Uploading Mockup Images\n");

  const files = fs.readdirSync(MOCKUP_DIR).filter(f => f.endsWith(".jpg"));
  const urlMap = {};
  const failed = [];

  for (const file of files) {
    const prefix = Object.keys(FILE_TO_SLUG).find(k =>
      file.toLowerCase().startsWith(k.toLowerCase())
    );
    if (!prefix) {
      console.log(`  ⚠  Skipping (no slug): ${file}`);
      continue;
    }
    const slug = FILE_TO_SLUG[prefix];
    const localPath = path.join(MOCKUP_DIR, file);
    try {
      const url = await uploadMockup(localPath, slug);
      urlMap[slug] = url;
      console.log(`  ✓  ${slug}`);
    } catch (e) {
      console.error(`  ✗  ${slug}: ${e.message}`);
      failed.push(slug);
    }
  }

  const outPath = path.join(__dirname, "mockup-product-urls.json");
  fs.writeFileSync(outPath, JSON.stringify(urlMap, null, 2));

  console.log(`\n${"─".repeat(60)}`);
  console.log(`  Done    : ${Object.keys(urlMap).length} / ${files.length}`);
  if (failed.length) console.log(`  Failed  : ${failed.join(", ")}`);
  console.log(`  Saved   : scripts/mockup-product-urls.json`);
  console.log(`${"─".repeat(60)}\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
