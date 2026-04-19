/**
 * Kumarie — Generate branded soap mockups with label overlay
 * Run: node scripts/generate-mockups.js
 *
 * Takes each processed soap photo, overlays a clean brand label,
 * saves to public/images/mockups/, then uploads to Cloudinary.
 */

const fs      = require("fs");
const path    = require("path");
const { v2: cloudinary } = require("cloudinary");

// Load .env.local
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

const IN_DIR  = path.join(__dirname, "../public/images/products");
const OUT_DIR = path.join(__dirname, "../public/images/mockups");

// Product display names mapped from slug
const PRODUCT_NAMES = {
  "papaya-orange-vitamin-c-brightening-soap":      ["Papaya & Orange", "Vitamin-C Brightening Soap"],
  "hibiscus-rose-floral-radiance-soap":            ["Hibiscus & Rose", "Floral Radiance Soap"],
  "beetroot-glow-revitalizing-soap":               ["Beetroot Glow", "Revitalizing Soap"],
  "lavender-saffron-floral-glow-soap":             ["Lavender & Saffron", "Floral Glow Soap"],
  "avocado-apricot-deep-nourishing-soap":          ["Avocado & Apricot", "Deep Nourishing Soap"],
  "neem-thulasi-skin-healing-soap":                ["Neem & Thulasi", "Skin Healing Soap"],
  "herbal-revitalizing-soap":                      ["Herbal", "Revitalizing Soap"],
  "aavarampoo-moringa-detox-brighten-soap":        ["Aavarampoo & Moringa", "Detox & Brighten Soap"],
  "turmeric-thulasi-acne-calming-soap":            ["Turmeric & Thulasi", "Acne Calming Soap"],
  "kuppaimeni-calming-skin-healing-soap":          ["Kuppaimeni", "Calming Skin Healing Soap"],
  "charcoal-detox-polish-soap":                    ["Charcoal", "Detox & Polish Soap"],
  "choco-coffee-energizing-polish-soap":           ["Choco Coffee", "Energizing Polish Soap"],
  "almond-donkey-milk-skin-softening-soap":        ["Almond & Donkey Milk", "Skin Softening Soap"],
  "goatmilk-oats-gentle-soothing-soap":            ["Goatmilk & Oats", "Gentle Soothing Soap"],
  "honey-red-wine-youth-radiance-antioxidant-soap":["Honey & Red Wine", "Youth Radiance Soap"],
};

// Generate the SVG label overlay (900px wide × 240px tall)
function makeLabelSvg(line1, line2) {
  // Escape XML special chars
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const l1 = esc(line1);
  const l2 = esc(line2);

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="244">
  <!-- Label background -->
  <rect x="0" y="0" width="900" height="244" fill="rgba(250,249,247,0.96)"/>

  <!-- Top hairline -->
  <line x1="64" y1="18" x2="836" y2="18" stroke="#D8D5CC" stroke-width="0.6"/>
  <!-- Bottom hairline -->
  <line x1="64" y1="226" x2="836" y2="226" stroke="#D8D5CC" stroke-width="0.6"/>

  <!-- Brand name — KUMARIE -->
  <text x="450" y="60"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="11"
    letter-spacing="10"
    fill="#1A1A18"
    text-anchor="middle"
    font-weight="400">KUMARIE</text>

  <!-- Amber accent line under brand -->
  <line x1="390" y1="74" x2="510" y2="74" stroke="#D4A853" stroke-width="0.9"/>

  <!-- Product line 1 (main ingredient) -->
  <text x="450" y="120"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="26"
    fill="#1A1A18"
    text-anchor="middle"
    font-weight="400"
    font-style="italic">${l1}</text>

  <!-- Product line 2 (type) -->
  <text x="450" y="154"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="13"
    letter-spacing="2"
    fill="#1A1A18"
    text-anchor="middle"
    font-weight="400">${l2}</text>

  <!-- Divider -->
  <line x1="390" y1="168" x2="510" y2="168" stroke="#D4D0C8" stroke-width="0.6"/>

  <!-- Tagline -->
  <text x="450" y="190"
    font-family="Arial, Helvetica, sans-serif"
    font-size="8.5"
    letter-spacing="3.5"
    fill="#737370"
    text-anchor="middle">NATURAL · HANDCRAFTED · COLD PROCESSED</text>

  <!-- Weight -->
  <text x="450" y="213"
    font-family="Arial, Helvetica, sans-serif"
    font-size="8"
    letter-spacing="2.5"
    fill="#A0A09E"
    text-anchor="middle">100 g / 3.5 oz</text>
</svg>`);
}

async function processFile(sharp, inPath, outPath, slug) {
  const names = PRODUCT_NAMES[slug];
  if (!names) {
    console.warn(`  ⚠  No name mapping for: ${slug}`);
    return false;
  }
  const [line1, line2] = names;

  // Load source image (900×1125)
  const img = sharp(inPath);
  const meta = await img.metadata();
  const W = meta.width  || 900;
  const H = meta.height || 1125;

  // SVG label is 900×244, placed at the bottom with 16px margin from edges
  const labelH = 244;
  const labelY = H - labelH; // bottom-aligned, flush

  const labelSvg = makeLabelSvg(line1, line2);

  await sharp(inPath)
    .resize(W, H) // keep original size
    .composite([
      {
        input: labelSvg,
        top: labelY,
        left: 0,
      },
    ])
    .jpeg({ quality: 90, progressive: true, mozjpeg: true })
    .toFile(outPath);

  return true;
}

async function uploadToCloudinary(filePath, slug) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        public_id: slug,
        folder: "kumarie/products",
        overwrite: true,
        resource_type: "image",
        transformation: [
          { width: 900, height: 1125, crop: "fill" },
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
  console.log("\n🧼  Kumarie — Mockup Generator\n");

  let sharp;
  try {
    sharp = require("sharp");
  } catch {
    console.error("❌  sharp not found. Run: npm install sharp");
    process.exit(1);
  }

  if (!fs.existsSync(IN_DIR)) {
    console.error(`❌  Source folder not found: ${IN_DIR}`);
    process.exit(1);
  }

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const files = fs.readdirSync(IN_DIR).filter(f => f.endsWith(".jpg"));
  console.log(`📦  Processing ${files.length} product images…\n`);

  const results = { ok: [], fail: [] };

  for (const file of files) {
    const slug    = path.basename(file, ".jpg");
    const inPath  = path.join(IN_DIR, file);
    const outPath = path.join(OUT_DIR, file);

    try {
      const ok = await processFile(sharp, inPath, outPath, slug);
      if (!ok) { results.fail.push(slug); continue; }

      const kb = Math.round(fs.statSync(outPath).size / 1024);
      console.log(`  ✓  ${slug}  (${kb} KB)`);
      results.ok.push({ slug, outPath });
    } catch (e) {
      console.error(`  ✗  ${slug}: ${e.message}`);
      results.fail.push(slug);
    }
  }

  console.log(`\n☁️   Uploading ${results.ok.length} mockups to Cloudinary…\n`);

  const urlMap = {};
  for (const { slug, outPath } of results.ok) {
    try {
      const url = await uploadToCloudinary(outPath, slug);
      urlMap[slug] = url;
      console.log(`  ✓  ${slug}`);
    } catch (e) {
      console.error(`  ✗  ${slug}: ${e.message}`);
    }
  }

  // Save URL map
  const mapPath = path.join(__dirname, "mockup-urls.json");
  fs.writeFileSync(mapPath, JSON.stringify(urlMap, null, 2));

  console.log(`\n${"─".repeat(56)}`);
  console.log(`  Mockups created : ${results.ok.length} / ${files.length}`);
  if (results.fail.length) console.log(`  Failed          : ${results.fail.join(", ")}`);
  console.log(`  Output folder   : ${OUT_DIR}`);
  console.log(`  URL map saved   : scripts/mockup-urls.json`);
  console.log(`${"─".repeat(56)}\n`);
  console.log("✅  Done. Run: npm run db:seed  to update the database.\n");
}

main().catch(e => { console.error(e); process.exit(1); });
