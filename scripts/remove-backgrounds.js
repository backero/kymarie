/**
 * Kumarie — Remove backgrounds from product images via Cloudinary AI
 * Run: node scripts/remove-backgrounds.js
 *
 * Uses Cloudinary's e_background_removal transformation to produce
 * transparent PNG versions saved to kumarie/products-transparent/
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
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

const SLUGS = [
  "lavender-saffron-floral-glow-soap",
  "papaya-orange-vitamin-c-brightening-soap",
  "hibiscus-rose-floral-radiance-soap",
  "neem-thulasi-skin-healing-soap",
  "charcoal-detox-polish-soap",
  "honey-red-wine-youth-radiance-antioxidant-soap",
  // extras for product pages
  "beetroot-glow-revitalizing-soap",
  "avocado-apricot-deep-nourishing-soap",
  "turmeric-thulasi-acne-calming-soap",
  "kuppaimeni-calming-skin-healing-soap",
  "herbal-revitalizing-soap",
  "aavarampoo-moringa-detox-brighten-soap",
  "almond-donkey-milk-skin-softening-soap",
  "goatmilk-oats-gentle-soothing-soap",
  "choco-coffee-energizing-polish-soap",
];

const OUT_DIR = path.join(__dirname, "../public/images/transparent");

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode === 302 || res.statusCode === 301) {
          file.close();
          fs.unlinkSync(dest);
          return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
        }
        res.pipe(file);
        file.on("finish", () => { file.close(); resolve(); });
      })
      .on("error", (err) => {
        fs.unlinkSync(dest);
        reject(err);
      });
  });
}

async function processSlug(slug) {
  const sourcePublicId = `kumarie/products/${slug}`;
  const destPublicId   = `kumarie/products-transparent/${slug}`;
  const localPath      = path.join(OUT_DIR, `${slug}.png`);

  // Upload with background-removal eager transformation
  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${sourcePublicId}.jpg`,
      {
        public_id: destPublicId,
        overwrite: true,
        resource_type: "image",
        background_removal: "cloudinary_ai",
        format: "png",
      },
      (err, res) => {
        if (err) return reject(err);
        resolve(res);
      }
    );
  });

  // Download the transparent PNG locally too
  await downloadFile(result.secure_url, localPath);

  return result.secure_url;
}

async function main() {
  console.log("\n🪄  Kumarie — Background Removal\n");

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const urlMap = {};
  const failed = [];

  for (const slug of SLUGS) {
    try {
      const url = await processSlug(slug);
      urlMap[slug] = url;
      console.log(`  ✓  ${slug}`);
    } catch (e) {
      const msg = String(e?.message || e);
      // If add-on not enabled Cloudinary returns a specific error
      if (msg.includes("background_removal") || msg.includes("Add-on")) {
        console.error(`\n❌  Background Removal add-on not enabled on this Cloudinary account.`);
        console.error(`    Enable it at: https://cloudinary.com/console/addons`);
        console.error(`    Choose "Cloudinary AI Background Removal" (free tier available)\n`);
        process.exit(1);
      }
      console.error(`  ✗  ${slug}: ${msg}`);
      failed.push(slug);
    }
  }

  const outPath = path.join(__dirname, "transparent-urls.json");
  fs.writeFileSync(outPath, JSON.stringify(urlMap, null, 2));

  console.log(`\n${"─".repeat(60)}`);
  console.log(`  Done    : ${Object.keys(urlMap).length} / ${SLUGS.length}`);
  if (failed.length) console.log(`  Failed  : ${failed.join(", ")}`);
  console.log(`  Saved   : scripts/transparent-urls.json`);
  console.log(`${"─".repeat(60)}\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
