/**
 * Kumarie — Product Image Mapping & Optimization Script
 * ─────────────────────────────────────────────────────
 * Usage:
 *   node scripts/map-product-images.js
 *
 * What it does:
 *   1. Reads images from a source folder (RAW_DIR below)
 *   2. Maps each image to a product slug using PRODUCT_MAP
 *   3. Copies + renames them to public/images/products/{slug}.jpg
 *   4. Optionally optimizes with sharp (install with: npm i -D sharp)
 *
 * After running:
 *   Update prisma/seed.ts image URLs to use "/images/products/{slug}.jpg"
 *   Then re-run: npm run db:seed
 */

const fs   = require("fs");
const path = require("path");

// ── Configuration ────────────────────────────────────────────────────────────

// Folder containing your raw soap images (update this path)
const RAW_DIR = "I:/My Drive/10- J - GRAPHIC DESIGNER/KUMARIE soap image RAW & JEPG";

// Output folder (inside Next.js public directory)
const OUT_DIR = path.join(__dirname, "../public/images/products");

// Map: raw filename (without extension) → product slug
// Update this to match the actual filenames in RAW_DIR
const PRODUCT_MAP = {
  // ── Brightening & Glow ───────────────────────────────────────────────────
  "avocado-apricot":          "avocado-apricot-deep-nourishing-soap",
  "beetroot-glow":            "beetroot-glow-revitalizing-soap",
  "hibiscus-rose":            "hibiscus-rose-floral-radiance-soap",
  "papaya-orange":            "papaya-orange-vitamin-c-brightening-soap",
  "lavender-saffron":         "lavender-saffron-floral-glow-soap",

  // ── Herbal & Ayurvedic ───────────────────────────────────────────────────
  "aavarampoo-moringa":       "aavarampoo-moringa-detox-brighten-soap",
  "herbal-revitalizing":      "herbal-revitalizing-soap",
  "kuppaimeni":               "kuppaimeni-calming-skin-healing-soap",
  "neem-thulasi":             "neem-thulasi-skin-healing-soap",
  "turmeric-thulasi":         "turmeric-thulasi-acne-calming-soap",

  // ── Detox & Polish ───────────────────────────────────────────────────────
  "charcoal-detox":           "charcoal-detox-polish-soap",
  "choco-coffee":             "choco-coffee-energizing-polish-soap",

  // ── Nourishing & Moisturizing ────────────────────────────────────────────
  "almond-donkey-milk":       "almond-donkey-milk-skin-softening-soap",
  "goatmilk-oats":            "goatmilk-oats-gentle-soothing-soap",
  "honey-red-wine":           "honey-red-wine-youth-radiance-antioxidant-soap",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function findImageFile(sourceDir, baseName) {
  const exts = [".jpg", ".jpeg", ".JPG", ".JPEG", ".png", ".PNG", ".webp", ".WEBP"];
  for (const ext of exts) {
    const full = path.join(sourceDir, `${baseName}${ext}`);
    if (fs.existsSync(full)) return full;
  }
  return null;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🧼 Kumarie — Product Image Mapper\n");

  // Check source dir exists
  if (!fs.existsSync(RAW_DIR)) {
    console.error(`❌  Source directory not found:\n    ${RAW_DIR}`);
    console.error("    Update RAW_DIR in this script to point to your image folder.");
    process.exit(1);
  }

  ensureDir(OUT_DIR);

  // Try to load sharp for optimization
  let sharp = null;
  try {
    sharp = require("sharp");
    console.log("✅  sharp found — images will be optimized\n");
  } catch {
    console.log("⚠️   sharp not installed — images will be copied as-is");
    console.log("    To enable optimization: npm i -D sharp\n");
  }

  const results = { ok: [], missing: [] };

  for (const [rawName, slug] of Object.entries(PRODUCT_MAP)) {
    const srcFile = findImageFile(RAW_DIR, rawName);

    if (!srcFile) {
      results.missing.push({ rawName, slug });
      console.warn(`  ⚠  Not found: "${rawName}" (for ${slug})`);
      continue;
    }

    const destFile = path.join(OUT_DIR, `${slug}.jpg`);

    try {
      if (sharp) {
        await sharp(srcFile)
          .resize(900, 1125, { fit: "cover", position: "center" }) // 4:5 ratio
          .jpeg({ quality: 85, progressive: true, mozjpeg: true })
          .toFile(destFile);
      } else {
        fs.copyFileSync(srcFile, destFile);
      }

      const stat = fs.statSync(destFile);
      const kb   = Math.round(stat.size / 1024);
      console.log(`  ✓  ${slug}.jpg  (${kb} KB)`);
      results.ok.push({ slug, destFile, kb });
    } catch (err) {
      console.error(`  ✗  Failed to process "${rawName}": ${err.message}`);
      results.missing.push({ rawName, slug, error: err.message });
    }
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log(`\n─────────────────────────────────────────`);
  console.log(`  Processed : ${results.ok.length} / ${Object.keys(PRODUCT_MAP).length}`);
  if (results.missing.length) {
    console.log(`  Missing   : ${results.missing.length}`);
    results.missing.forEach(({ rawName }) => console.log(`    - ${rawName}`));
  }
  console.log(`  Output    : ${OUT_DIR}`);
  console.log(`─────────────────────────────────────────\n`);

  // ── Generate seed snippet ─────────────────────────────────────────────────
  if (results.ok.length > 0) {
    console.log("📋  Paste these image paths into prisma/seed.ts:\n");
    results.ok.forEach(({ slug }) => {
      console.log(`  images: ["/images/products/${slug}.jpg"],`);
      console.log(`  thumbnail: "/images/products/${slug}.jpg",`);
    });
    console.log();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
