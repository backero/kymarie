/**
 * Kumarie — Generate box-style mockup images from flat cover PNGs
 * Approach: crop the front-face panel, add box spine (left strip) + shadow
 * using sharp compositing, then upload to Cloudinary as kumarie/mockups/{slug}
 *
 * Run: node scripts/generate-cover-mockups.js
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
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
const OUT_DIR = path.join(__dirname, "../public/images/mockups");

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

// Output canvas — landscape to match the soap box proportions
const MOCKUP_W = 1200;
const MOCKUP_H = 900;
// Front face: top ~33% of the dieline (the branded panel)
const FACE_CROP_HEIGHT_RATIO = 0.33;

async function buildMockup(coverPath, slug) {
  const meta = await sharp(coverPath).metadata();
  const coverW = meta.width;
  const coverH = meta.height;

  // Crop the front face panel (top 33%)
  const faceH = Math.round(coverH * FACE_CROP_HEIGHT_RATIO);

  // Resize face to fill the display area, keeping aspect ratio, with cream padding
  const faceResized = await sharp(coverPath)
    .extract({ left: 0, top: 0, width: coverW, height: faceH })
    .resize(960, 520, { fit: "contain", background: { r: 244, g: 243, b: 240, alpha: 0 } })
    .png()
    .toBuffer();

  // Narrow left "spine" strip — darker version of left edge of the front face
  const spineRaw = await sharp(coverPath)
    .extract({ left: 0, top: 0, width: Math.round(coverW * 0.08), height: faceH })
    .resize(60, 520, { fit: "fill" })
    .modulate({ brightness: 0.68 })
    .png()
    .toBuffer();

  // Bottom shadow ellipse
  const shadowSvg = Buffer.from(`
    <svg width="${MOCKUP_W}" height="80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#00000022"/>
          <stop offset="100%" stop-color="#00000000"/>
        </radialGradient>
      </defs>
      <ellipse cx="${MOCKUP_W / 2 + 20}" cy="40" rx="${MOCKUP_W * 0.42}" ry="32" fill="url(#sg)"/>
    </svg>
  `);

  // Right edge vignette on face (subtle depth)
  const edgeSvg = Buffer.from(`
    <svg width="960" height="520" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="eg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="75%" stop-color="#00000000"/>
          <stop offset="100%" stop-color="#00000030"/>
        </linearGradient>
      </defs>
      <rect width="960" height="520" fill="url(#eg)"/>
    </svg>
  `);

  // Left edge vignette (front meets spine)
  const leftEdgeSvg = Buffer.from(`
    <svg width="960" height="520" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="le" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#00000018"/>
          <stop offset="8%" stop-color="#00000000"/>
        </linearGradient>
      </defs>
      <rect width="960" height="520" fill="url(#le)"/>
    </svg>
  `);

  // Face top edge darkening (lid/top of box)
  const topEdgeSvg = Buffer.from(`
    <svg width="960" height="520" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="te" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#00000015"/>
          <stop offset="6%" stop-color="#00000000"/>
        </linearGradient>
      </defs>
      <rect width="960" height="520" fill="url(#te)"/>
    </svg>
  `);

  // Compose: transparent canvas
  const faceLeft = 120;  // leave room for spine on left
  const faceTop  = 160;  // vertical centering

  const canvas = sharp({
    create: {
      width: MOCKUP_W,
      height: MOCKUP_H,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  });

  const mockup = await canvas
    .composite([
      // Ground shadow
      { input: shadowSvg, left: 0, top: MOCKUP_H - 78 },
      // Spine (left side of box)
      { input: spineRaw, left: faceLeft - 58, top: faceTop },
      // Front face
      { input: faceResized, left: faceLeft, top: faceTop },
      // Overlays for depth
      { input: edgeSvg,     left: faceLeft, top: faceTop },
      { input: leftEdgeSvg, left: faceLeft, top: faceTop },
      { input: topEdgeSvg,  left: faceLeft, top: faceTop },
    ])
    .png({ compressionLevel: 8 })
    .toBuffer();

  // Save locally
  const localPath = path.join(OUT_DIR, `${slug}.png`);
  fs.writeFileSync(localPath, mockup);

  // Upload local file to Cloudinary
  const url = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      localPath,
      {
        public_id: `kumarie/mockups/${slug}`,
        overwrite: true,
        resource_type: "image",
        format: "png",
      },
      (err, res) => { if (err) return reject(err); resolve(res.secure_url); }
    );
  });

  return url;
}

async function main() {
  console.log("\n🎁  Kumarie — Generating Box Mockups\n");
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const files = fs.readdirSync(COVERS_DIR).filter(f => f.endsWith(".png") && f.includes("V4.1"));
  const urlMap = {};
  const failed = [];

  for (const file of files) {
    const prefix = Object.keys(FILE_TO_SLUG).find(k =>
      file.toLowerCase().startsWith(k.toLowerCase())
    );
    if (!prefix) continue;
    const slug = FILE_TO_SLUG[prefix];
    const coverPath = path.join(COVERS_DIR, file);
    try {
      const url = await buildMockup(coverPath, slug);
      urlMap[slug] = url;
      console.log(`  ✓  ${slug}`);
    } catch (e) {
      console.error(`  ✗  ${slug}: ${e.message}`);
      failed.push(slug);
    }
  }

  const outPath = path.join(__dirname, "mockup-urls.json");
  fs.writeFileSync(outPath, JSON.stringify(urlMap, null, 2));

  console.log(`\n${"─".repeat(60)}`);
  console.log(`  Done    : ${Object.keys(urlMap).length} / ${files.length}`);
  if (failed.length) console.log(`  Failed  : ${failed.join(", ")}`);
  console.log(`  Local   : public/images/mockups/`);
  console.log(`  Remote  : kumarie/mockups/ on Cloudinary`);
  console.log(`  URLs    : scripts/mockup-urls.json`);
  console.log(`${"─".repeat(60)}\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
