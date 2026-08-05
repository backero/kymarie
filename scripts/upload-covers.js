/**
 * Kumarie — Upload soap cover PNGs from D:\Soaps Updated to Cloudinary
 * Run: node scripts/upload-covers.js
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

const COVERS_DIR = "D:/Soaps Updated";

// Map filename prefix → Cloudinary slug
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

async function uploadFile(localPath, slug) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      localPath,
      {
        public_id: `kumarie/covers/${slug}`,
        overwrite: true,
        resource_type: "image",
        format: "png",
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
  console.log("\n📦  Kumarie — Uploading Cover PNGs\n");

  const files = fs.readdirSync(COVERS_DIR).filter(f => f.endsWith(".png") && f.includes("V4.1"));
  const urlMap = {};
  const failed = [];

  for (const file of files) {
    const prefix = Object.keys(FILE_TO_SLUG).find(k =>
      file.toLowerCase().startsWith(k.toLowerCase())
    );
    if (!prefix) {
      console.log(`  ⚠  Skipping (no slug mapping): ${file}`);
      continue;
    }
    const slug = FILE_TO_SLUG[prefix];
    const localPath = path.join(COVERS_DIR, file);
    try {
      const url = await uploadFile(localPath, slug);
      urlMap[slug] = url;
      console.log(`  ✓  ${slug}`);
    } catch (e) {
      console.error(`  ✗  ${slug}: ${e.message}`);
      failed.push(slug);
    }
  }

  // Also upload the Avocado mockup as a reference
  const mockupPath = path.join(COVERS_DIR, "Avacado - KUMARIE V4.2 Mockup.png");
  if (fs.existsSync(mockupPath)) {
    try {
      const url = await uploadFile(mockupPath, "avocado-apricot-deep-nourishing-soap-mockup");
      urlMap["avocado-mockup"] = url;
      console.log(`  ✓  avocado-mockup`);
    } catch (e) {
      console.error(`  ✗  avocado-mockup: ${e.message}`);
    }
  }

  const outPath = path.join(__dirname, "cover-urls.json");
  fs.writeFileSync(outPath, JSON.stringify(urlMap, null, 2));

  console.log(`\n${"─".repeat(60)}`);
  console.log(`  Done    : ${Object.keys(urlMap).length} / ${files.length}`);
  if (failed.length) console.log(`  Failed  : ${failed.join(", ")}`);
  console.log(`  Saved   : scripts/cover-urls.json`);
  console.log(`${"─".repeat(60)}\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
