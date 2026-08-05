/**
 * Kumarie — Process & optimize actual product photos
 * Run: node scripts/process-product-images.js
 */

const fs   = require("fs");
const path = require("path");

const RAW = "I:/My Drive/10- J - GRAPHIC DESIGNER/KUMARIE soap image RAW & JEPG";
const OUT = path.join(__dirname, "../public/images/products");

// ── Visual mapping (identified by viewing each photo) ───────────────────────
// Named files confirmed by filename; numbered by color/texture identification.
const MAP = [
  // Brightening & Glow
  { src: "Orange papaya.JPG",   slug: "papaya-orange-vitamin-c-brightening-soap"     }, // olive-yellow bar, white bg
  { src: "IMG_9312.JPG",        slug: "hibiscus-rose-floral-radiance-soap"            }, // red/cream artisan swirl, white bg
  { src: "IMG_9316.JPG",        slug: "beetroot-glow-revitalizing-soap"               }, // solid mauve-rose bar, white bg
  { src: "Saffron lavender.JPG",slug: "lavender-saffron-floral-glow-soap"             }, // rose/cream swirl, white bg
  { src: "IMG_9310.JPG",        slug: "avocado-apricot-deep-nourishing-soap"          }, // smooth golden-tan bar, white bg

  // Herbal & Ayurvedic
  { src: "Neem tulsi.JPG",      slug: "neem-thulasi-skin-healing-soap"                }, // dark espresso-brown, white bg
  { src: "IMG_9304.JPG",        slug: "herbal-revitalizing-soap"                      }, // dark brown speckled herbs, white bg
  { src: "IMG_9305.JPG",        slug: "aavarampoo-moringa-detox-brighten-soap"        }, // similar herb-brown, white bg
  { src: "IMG_9350.JPG",        slug: "turmeric-thulasi-acne-calming-soap"            }, // bright golden-yellow bar
  { src: "IMG_9341.JPG",        slug: "kuppaimeni-calming-skin-healing-soap"          }, // warm tan bar, dramatic warm light

  // Detox & Polish
  { src: "IMG_9370.JPG",        slug: "charcoal-detox-polish-soap"                    }, // pitch-black textured bar
  { src: "IMG_9314.JPG",        slug: "choco-coffee-energizing-polish-soap"           }, // very dark rough brown bar, white bg

  // Nourishing & Moisturizing
  { src: "Almond donkey.JPG",   slug: "almond-donkey-milk-skin-softening-soap"        }, // beige/tan with flecks, white bg
  { src: "IMG_9307.JPG",        slug: "goatmilk-oats-gentle-soothing-soap"            }, // creamy pale bar, white bg
  { src: "IMG_9320.JPG",        slug: "honey-red-wine-youth-radiance-antioxidant-soap"}, // deep burgundy bar, white bg
];

// ── Hero / collection images (for homepage) ──────────────────────────────────
const HERO_MAP = [
  { src: "IMG_9395.JPG",   slug: "hero-pyramid"   }, // dramatic pyramid of all soaps
  { src: "IMG_9390.JPG",   slug: "hero-collection" }, // flat-lay scatter of all soaps
];

async function processImage(srcFile, destFile, isHero = false) {
  const sharp = require("sharp");

  if (isHero) {
    // Hero images: wider crop, slightly more compression
    await sharp(srcFile)
      .resize(1400, 900, { fit: "cover", position: "attention" })
      .jpeg({ quality: 88, progressive: true, mozjpeg: true })
      .toFile(destFile);
  } else {
    // Product images: 4:5 ratio, tight crop on soap, white bg preserved
    await sharp(srcFile)
      .resize(900, 1125, { fit: "cover", position: "attention" })
      .jpeg({ quality: 88, progressive: true, mozjpeg: true })
      .toFile(destFile);
  }
}

async function main() {
  console.log("\n🧼  Kumarie — Image Processor\n");

  if (!fs.existsSync(RAW)) {
    console.error(`❌  Source folder not found:\n    ${RAW}`);
    process.exit(1);
  }

  // Create output dirs
  [OUT, path.join(__dirname, "../public/images/hero")].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  const results = { ok: [], fail: [] };

  // ── Product images ──
  console.log("📦  Product images:");
  for (const { src, slug } of MAP) {
    const srcPath  = path.join(RAW, src);
    const destPath = path.join(OUT, `${slug}.jpg`);

    if (!fs.existsSync(srcPath)) {
      console.log(`  ⚠  Missing: ${src}`);
      results.fail.push(src);
      continue;
    }

    try {
      await processImage(srcPath, destPath);
      const kb = Math.round(fs.statSync(destPath).size / 1024);
      console.log(`  ✓  ${slug}.jpg  (${kb} KB)`);
      results.ok.push(slug);
    } catch (e) {
      console.error(`  ✗  ${src}: ${e.message}`);
      results.fail.push(src);
    }
  }

  // ── Hero images ──
  console.log("\n🖼   Hero images:");
  for (const { src, slug } of HERO_MAP) {
    const srcPath  = path.join(RAW, src);
    const destPath = path.join(__dirname, `../public/images/hero/${slug}.jpg`);

    if (!fs.existsSync(srcPath)) {
      console.log(`  ⚠  Missing: ${src}`);
      continue;
    }

    try {
      await processImage(srcPath, destPath, true);
      const kb = Math.round(fs.statSync(destPath).size / 1024);
      console.log(`  ✓  hero/${slug}.jpg  (${kb} KB)`);
    } catch (e) {
      console.error(`  ✗  ${src}: ${e.message}`);
    }
  }

  // ── Summary ──
  console.log(`\n${"─".repeat(48)}`);
  console.log(`  Done  : ${results.ok.length} / ${MAP.length} products`);
  if (results.fail.length) {
    console.log(`  Failed: ${results.fail.join(", ")}`);
  }
  console.log(`  Out   : ${OUT}`);
  console.log(`${"─".repeat(48)}\n`);
}

main().catch(e => { console.error(e); process.exit(1); });
