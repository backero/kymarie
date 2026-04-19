import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Cloudinary CDN URLs — uploaded via scripts/upload-to-cloudinary.js
const CDN: Record<string, string> = {
  "aavarampoo-moringa-detox-brighten-soap":        "https://res.cloudinary.com/dthgjtfvu/image/upload/kumarie/products/aavarampoo-moringa-detox-brighten-soap.jpg",
  "almond-donkey-milk-skin-softening-soap":        "https://res.cloudinary.com/dthgjtfvu/image/upload/kumarie/products/almond-donkey-milk-skin-softening-soap.jpg",
  "avocado-apricot-deep-nourishing-soap":          "https://res.cloudinary.com/dthgjtfvu/image/upload/kumarie/products/avocado-apricot-deep-nourishing-soap.jpg",
  "beetroot-glow-revitalizing-soap":               "https://res.cloudinary.com/dthgjtfvu/image/upload/kumarie/products/beetroot-glow-revitalizing-soap.jpg",
  "charcoal-detox-polish-soap":                    "https://res.cloudinary.com/dthgjtfvu/image/upload/kumarie/products/charcoal-detox-polish-soap.jpg",
  "choco-coffee-energizing-polish-soap":           "https://res.cloudinary.com/dthgjtfvu/image/upload/kumarie/products/choco-coffee-energizing-polish-soap.jpg",
  "goatmilk-oats-gentle-soothing-soap":            "https://res.cloudinary.com/dthgjtfvu/image/upload/kumarie/products/goatmilk-oats-gentle-soothing-soap.jpg",
  "herbal-revitalizing-soap":                      "https://res.cloudinary.com/dthgjtfvu/image/upload/kumarie/products/herbal-revitalizing-soap.jpg",
  "hibiscus-rose-floral-radiance-soap":            "https://res.cloudinary.com/dthgjtfvu/image/upload/kumarie/products/hibiscus-rose-floral-radiance-soap.jpg",
  "honey-red-wine-youth-radiance-antioxidant-soap":"https://res.cloudinary.com/dthgjtfvu/image/upload/kumarie/products/honey-red-wine-youth-radiance-antioxidant-soap.jpg",
  "kuppaimeni-calming-skin-healing-soap":          "https://res.cloudinary.com/dthgjtfvu/image/upload/kumarie/products/kuppaimeni-calming-skin-healing-soap.jpg",
  "lavender-saffron-floral-glow-soap":             "https://res.cloudinary.com/dthgjtfvu/image/upload/kumarie/products/lavender-saffron-floral-glow-soap.jpg",
  "neem-thulasi-skin-healing-soap":                "https://res.cloudinary.com/dthgjtfvu/image/upload/kumarie/products/neem-thulasi-skin-healing-soap.jpg",
  "papaya-orange-vitamin-c-brightening-soap":      "https://res.cloudinary.com/dthgjtfvu/image/upload/kumarie/products/papaya-orange-vitamin-c-brightening-soap.jpg",
  "turmeric-thulasi-acne-calming-soap":            "https://res.cloudinary.com/dthgjtfvu/image/upload/kumarie/products/turmeric-thulasi-acne-calming-soap.jpg",
  "hero-collection":                               "https://res.cloudinary.com/dthgjtfvu/image/upload/kumarie/hero/hero-collection.jpg",
  "hero-pyramid":                                  "https://res.cloudinary.com/dthgjtfvu/image/upload/kumarie/hero/hero-pyramid.jpg",
};
const img = (slug: string) => CDN[slug] ?? "";

async function main() {
  console.log("🌱 Seeding Kumarie database with real product catalogue…");

  // ─── 1. Preserve admin ──────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "Admin@Kumarie2024",
    12,
  );
  await prisma.admin.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@kumarie.com" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || "admin@kumarie.com",
      password: hashedPassword,
      name: "Kumarie Admin",
    },
  });
  console.log("✅ Admin preserved");

  // ─── 2. Wipe existing product-related data (FK-safe order) ─────────────────
  console.log("🗑  Clearing existing catalogue…");
  await prisma.wishlistItem.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  console.log("✅ Old catalogue cleared");

  // ─── 3. Categories ──────────────────────────────────────────────────────────
  const [brightening, herbal, detox, nourishing] = await Promise.all([
    prisma.category.create({
      data: {
        name: "Brightening & Glow",
        slug: "brightening-glow",
        description:
          "Vitamin-rich soaps packed with fruits, flowers, and botanicals that visibly even skin tone and enhance your natural radiance.",
        image: img("hero-collection"),
      },
    }),
    prisma.category.create({
      data: {
        name: "Herbal & Ayurvedic",
        slug: "herbal-ayurvedic",
        description:
          "Time-tested Ayurvedic herbs — Neem, Thulasi, Turmeric, and more — crafted to purify, heal, and protect your skin naturally.",
        image: img("neem-thulasi-skin-healing-soap"),
      },
    }),
    prisma.category.create({
      data: {
        name: "Detox & Polish",
        slug: "detox-polish",
        description:
          "Deep-cleansing bars with activated charcoal, coffee, and exfoliating grains that draw out impurities and reveal smoother skin.",
        image: img("charcoal-detox-polish-soap"),
      },
    }),
    prisma.category.create({
      data: {
        name: "Nourishing & Moisturizing",
        slug: "nourishing-moisturizing",
        description:
          "Ultra-rich soaps with milks, oils, and humectants that deliver intense hydration, leaving skin soft, supple, and deeply nourished.",
        image: img("almond-donkey-milk-skin-softening-soap"),
      },
    }),
  ]);
  console.log("✅ 4 categories created");

  // ─── 4. Products ────────────────────────────────────────────────────────────
  const products = [
    // ── BRIGHTENING & GLOW ──────────────────────────────────────────────────
    {
      name: "Avocado & Apricot Deep Nourishing Soap",
      slug: "avocado-apricot-deep-nourishing-soap",
      description:
        "A powerhouse of moisture for dry, flaky skin. Cold-pressed avocado oil floods the skin with Vitamins A and E while apricot extracts gently slough away dead cells for a visibly smoother, healthier glow. Each 100 g bar is handcrafted in small batches — sulfur-free and paraben-free — so you get nothing but nature's best.",
      shortDesc: "Intensely nourishing bar for dry & flaky skin with avocado & apricot",
      price: 349,
      comparePrice: 449,
      stock: 60,
      sku: "KUM-001",
      weight: 100,
      images: [img("avocado-apricot-deep-nourishing-soap")],
      thumbnail: img("avocado-apricot-deep-nourishing-soap"),
      categoryId: brightening.id,
      tags: ["avocado", "apricot", "dry-skin", "nourishing", "vitamin-e"],
      ingredients:
        "Avocado, Apricot, Coconut Oil, Palm Oil, Rice Bran Oil, Castor Oil, Caustic Soda, Essential Oil & Organic Fragrance",
      howToUse:
        "Wet hands and soap. Work into a rich lather and massage gently onto damp skin. Rinse thoroughly with lukewarm water. Follow with your favourite moisturiser.",
      benefits: ["Nourishes dry & flaky skin", "Gentle exfoliation", "Rich in Vitamins A & E", "Improves skin elasticity"],
      isActive: true,
      isFeatured: true,
      isNew: true,
    },
    {
      name: "Beetroot Glow Revitalizing Soap",
      slug: "beetroot-glow-revitalizing-soap",
      description:
        "Nature's rosy secret in a soap bar. Beetroot is loaded with betalains and Vitamin C — a potent combo that brightens, fights environmental stress, and gives the skin a natural, healthy flush. The creamy lather gently lifts away impurities while improving moisture balance, leaving skin refreshed, rejuvenated, and unmistakably glowing.",
      shortDesc: "Vitamin-C rich brightening soap with beetroot extract for a natural rosy glow",
      price: 349,
      comparePrice: 449,
      stock: 55,
      sku: "KUM-004",
      weight: 100,
      images: [img("beetroot-glow-revitalizing-soap")],
      thumbnail: img("beetroot-glow-revitalizing-soap"),
      categoryId: brightening.id,
      tags: ["beetroot", "brightening", "vitamin-c", "natural-glow", "revitalizing"],
      ingredients:
        "Beetroot Extract, Coconut Oil, Palm Oil, Rice Bran Oil, Castor Oil, Caustic Soda, Essential Oil & Organic Fragrance",
      howToUse:
        "Use daily. Lather generously and massage over face or body. Rinse well. Best results seen with consistent use over 4 weeks.",
      benefits: ["Brightens skin tone", "Enhances natural rosy complexion", "Rich in Vitamin C & betalains", "Improves moisture balance"],
      isActive: true,
      isFeatured: true,
      isNew: false,
    },
    {
      name: "Hibiscus & Rose Floral Radiance Soap",
      slug: "hibiscus-rose-floral-radiance-soap",
      description:
        "A floral celebration for your skin. Hibiscus — the 'Botox plant' — is rich in natural AHAs that promote elasticity and soften skin texture. Paired with rose petals that soothe irritation and impart a calming floral aroma, this bar gently refreshes and brightens without stripping essential moisture. The skin feels supple, alive, and beautifully scented after every wash.",
      shortDesc: "Floral radiance bar with hibiscus & rose to brighten, soften, and soothe",
      price: 349,
      comparePrice: 449,
      stock: 60,
      sku: "KUM-009",
      weight: 100,
      images: [img("hibiscus-rose-floral-radiance-soap")],
      thumbnail: img("hibiscus-rose-floral-radiance-soap"),
      categoryId: brightening.id,
      tags: ["hibiscus", "rose", "floral", "brightening", "skin-elasticity"],
      ingredients:
        "Hibiscus Extract, Rose Petals, Coconut Oil, Palm Oil, Rice Bran Oil, Castor Oil, Caustic Soda, Essential Oil & Organic Fragrance",
      howToUse:
        "Use morning or evening. Lather and massage onto wet skin. Inhale the calming floral aroma as you rinse.",
      benefits: ["Brightens & revitalizes dull skin", "Promotes skin elasticity", "Soothes irritation", "Gentle floral cleanse"],
      isActive: true,
      isFeatured: false,
      isNew: true,
    },
    {
      name: "Papaya & Orange Vitamin-C Brightening Soap",
      slug: "papaya-orange-vitamin-c-brightening-soap",
      description:
        "Your daily dose of Vitamin C in a soap bar. Papaya enzymes (papain) dissolve dead skin cells with minimal friction for a refined, smooth surface — without the harshness of physical scrubs. Orange extract floods the skin with antioxidants and a refreshing citrus energy. The result is a brighter, more even complexion that looks healthy and vibrant.",
      shortDesc: "Enzyme-powered brightening bar with papaya & orange for smoother, radiant skin",
      price: 349,
      comparePrice: 449,
      stock: 65,
      sku: "KUM-013",
      weight: 100,
      images: [img("papaya-orange-vitamin-c-brightening-soap")],
      thumbnail: img("papaya-orange-vitamin-c-brightening-soap"),
      categoryId: brightening.id,
      tags: ["papaya", "orange", "vitamin-c", "brightening", "exfoliation"],
      ingredients:
        "Papaya Extract, Orange Extract, Coconut Oil, Palm Oil, Rice Bran Oil, Castor Oil, Caustic Soda, Essential Oil & Organic Fragrance",
      howToUse:
        "Use daily. Lather well and leave on skin for 30 seconds before rinsing to allow the enzymes to work. Ideal for face and body.",
      benefits: ["Gentle enzyme exfoliation", "Improves skin tone", "Rich in antioxidants", "Healthy, vibrant glow"],
      isActive: true,
      isFeatured: true,
      isNew: false,
    },
    {
      name: "Lavender & Saffron Floral Glow Soap",
      slug: "lavender-saffron-floral-glow-soap",
      description:
        "Where luxury meets calm. Precious saffron enhances radiance and evens out skin tone, while French lavender oil works to relax both skin and mind, melting away the stress of the day. This gentle, sulfur-free formula is suitable for all skin types — including sensitive — and leaves a delicate floral warmth that lingers long after you rinse.",
      shortDesc: "Luxury calming soap with saffron brightening & lavender relaxation for all skin types",
      price: 449,
      comparePrice: 599,
      stock: 40,
      sku: "KUM-014",
      weight: 100,
      images: [img("lavender-saffron-floral-glow-soap")],
      thumbnail: img("lavender-saffron-floral-glow-soap"),
      categoryId: brightening.id,
      tags: ["lavender", "saffron", "brightening", "calming", "sensitive-skin"],
      ingredients:
        "Saffron Extract, Lavender Essential Oil, Coconut Oil, Palm Oil, Rice Bran Oil, Castor Oil, Caustic Soda, Organic Fragrance",
      howToUse:
        "Ideal as an evening ritual. Lather and breathe in the floral warmth. Rinse with cool water. Suitable for face and body.",
      benefits: ["Saffron brightens & evens skin tone", "Lavender calms & relaxes", "Gentle for all skin types", "Lingering floral aroma"],
      isActive: true,
      isFeatured: true,
      isNew: true,
    },

    // ── HERBAL & AYURVEDIC ───────────────────────────────────────────────────
    {
      name: "Aavarampoo & Moringa Detox & Brighten Soap",
      slug: "aavarampoo-moringa-detox-brighten-soap",
      description:
        "Two of South India's most revered botanicals, united in one detoxifying bar. Aavarampoo (Tanner's Cassia) has been used for centuries to improve skin clarity and reduce dark spots. Antioxidant-rich moringa removes daily impurities and environmental buildup while delivering essential skin nutrients for a healthy, radiant glow. Naturally anti-inflammatory and deeply calming.",
      shortDesc: "Traditional South Indian botanical bar to detox, brighten, and calm skin",
      price: 349,
      comparePrice: 449,
      stock: 55,
      sku: "KUM-003",
      weight: 100,
      images: [img("aavarampoo-moringa-detox-brighten-soap")],
      thumbnail: img("aavarampoo-moringa-detox-brighten-soap"),
      categoryId: herbal.id,
      tags: ["aavarampoo", "moringa", "detox", "brightening", "ayurvedic"],
      ingredients:
        "Aavarampoo (Tanner's Cassia), Moringa Extract, Coconut Oil, Palm Oil, Rice Bran Oil, Castor Oil, Caustic Soda, Essential Oil & Organic Fragrance",
      howToUse:
        "Use daily on face and body. Work into lather and leave for 20 seconds before rinsing to allow botanical extracts to act.",
      benefits: ["Reduces dark spots", "Removes environmental impurities", "Anti-inflammatory", "Boosts natural radiance"],
      isActive: true,
      isFeatured: true,
      isNew: false,
    },
    {
      name: "Herbal Revitalizing Soap",
      slug: "herbal-revitalizing-soap",
      description:
        "Our most complex formula — a rare blend of ten powerful Ayurvedic herbs. Black seed, fenugreek, hibiscus, amla, vetiver, brahmi, and bhringraj come together with shikakai and almond to replenish moisture, calm dryness, and deliver a comprehensive antioxidant shield. This is complete skin wellness in a single bar, rooted in centuries of herbal tradition.",
      shortDesc: "Multi-herb Ayurvedic powerhouse with 10 botanicals for complete skin nourishment",
      price: 449,
      comparePrice: 599,
      stock: 40,
      sku: "KUM-008",
      weight: 100,
      images: [img("herbal-revitalizing-soap")],
      thumbnail: img("herbal-revitalizing-soap"),
      categoryId: herbal.id,
      tags: ["herbal", "ayurvedic", "brahmi", "bhringraj", "amla", "neem", "multi-herb"],
      ingredients:
        "Black Seed, Fenugreek, Hibiscus, Amla, Vetiver, Brahmi, Bhringraj, Almond, Shikakai, Coconut Oil, Castor Oil, Caustic Soda, Essential Oils",
      howToUse:
        "Use 4–5 times per week. Lather well on damp skin and massage for 30 seconds. Rinse thoroughly. Follow with a light moisturiser.",
      benefits: ["Deeply nourishes & replenishes moisture", "Calms dryness & irritation", "Rich antioxidant protection", "Delivers essential herbal nutrients"],
      isActive: true,
      isFeatured: true,
      isNew: false,
    },
    {
      name: "Kuppaimeni Calming & Skin-Healing Soap",
      slug: "kuppaimeni-calming-skin-healing-soap",
      description:
        "Kuppaimeni (Acalypha indica) is a time-honoured herb in Siddha medicine, long prescribed for skin conditions ranging from acne to inflammation. This bar channels its natural calming, antimicrobial power to minimize blemishes, prevent breakouts, and shield skin from environmental damage — all while leaving it feeling soft, healthy, and refreshed after every wash.",
      shortDesc: "Traditional Siddha herb soap — calming, anti-inflammatory, and naturally acne-fighting",
      price: 349,
      comparePrice: 449,
      stock: 50,
      sku: "KUM-011",
      weight: 100,
      images: [img("kuppaimeni-calming-skin-healing-soap")],
      thumbnail: img("kuppaimeni-calming-skin-healing-soap"),
      categoryId: herbal.id,
      tags: ["kuppaimeni", "ayurvedic", "anti-inflammatory", "acne-care", "siddha"],
      ingredients:
        "Kuppaimeni (Acalypha indica) Extract, Coconut Oil, Palm Oil, Rice Bran Oil, Castor Oil, Caustic Soda, Essential Oil & Organic Fragrance",
      howToUse:
        "Use daily. Suitable for face and body. For acne-prone areas, leave lather on for 30 seconds before rinsing.",
      benefits: ["Calms skin irritation", "Minimizes blemishes & prevents breakouts", "Antioxidant protection", "Soft, healthy-feeling skin"],
      isActive: true,
      isFeatured: false,
      isNew: false,
    },
    {
      name: "Neem & Thulasi Skin-Healing Soap",
      slug: "neem-thulasi-skin-healing-soap",
      description:
        "The ultimate Ayurvedic duo for clear, healthy skin. Neem leaf — revered for millennia as a natural antibacterial — purifies pores and controls breakouts at the source. Holy basil (Thulasi) complements with calming, anti-inflammatory properties that reduce redness and balance the skin. Together they form a deep-cleansing, antimicrobial lather that leaves skin genuinely purified — not stripped.",
      shortDesc: "Ayurvedic antibacterial bar with neem & holy basil for deep purification & acne defence",
      price: 349,
      comparePrice: 449,
      stock: 70,
      sku: "KUM-012",
      weight: 100,
      images: [img("neem-thulasi-skin-healing-soap")],
      thumbnail: img("neem-thulasi-skin-healing-soap"),
      categoryId: herbal.id,
      tags: ["neem", "thulasi", "holy-basil", "ayurvedic", "acne-defence", "antibacterial"],
      ingredients:
        "Neem Leaf Extract, Thulasi (Holy Basil), Coconut Oil, Palm Oil, Rice Bran Oil, Castor Oil, Caustic Soda, Essential Oil & Organic Fragrance",
      howToUse:
        "Use daily. Lather well and massage for 30 seconds for enhanced purifying action. Rinse thoroughly. Ideal for oily and acne-prone skin.",
      benefits: ["Deep purification", "Controls acne & breakouts", "Calms redness & inflammation", "Antimicrobial action"],
      isActive: true,
      isFeatured: true,
      isNew: false,
    },
    {
      name: "Turmeric & Thulasi Acne-Calming Soap",
      slug: "turmeric-thulasi-acne-calming-soap",
      description:
        "Turmeric's golden power meets the sacred healing of Holy Basil in this clean, everyday soap. Curcumin in turmeric balances oil production, brightens dull skin, and neutralises acne-causing bacteria, while Thulasi calms inflammation, rashes, and minor irritation. The result is a complexion that looks naturally radiant, clear, and calm — without harsh chemicals.",
      shortDesc: "Golden Ayurvedic bar with turmeric & holy basil to fight acne, brighten, and calm skin",
      price: 299,
      comparePrice: 399,
      stock: 80,
      sku: "KUM-015",
      weight: 100,
      images: [img("turmeric-thulasi-acne-calming-soap")],
      thumbnail: img("turmeric-thulasi-acne-calming-soap"),
      categoryId: herbal.id,
      tags: ["turmeric", "thulasi", "acne-calming", "brightening", "ayurvedic"],
      ingredients:
        "Turmeric Extract, Thulasi (Holy Basil), Palm Oil, Coconut Oil, Rice Bran Oil, Castor Oil, Caustic Soda, Essential Oil & Organic Fragrance",
      howToUse:
        "Use daily morning and evening. Lather well and massage onto damp skin. Rinse off. Note: turmeric may leave a slight golden tint on washcloths — this is normal.",
      benefits: ["Controls acne-causing bacteria", "Brightens dull skin", "Calms inflammation & rashes", "Purifying everyday cleanse"],
      isActive: true,
      isFeatured: false,
      isNew: false,
    },

    // ── DETOX & POLISH ───────────────────────────────────────────────────────
    {
      name: "Charcoal Detox & Polish Soap",
      slug: "charcoal-detox-polish-soap",
      description:
        "Reset button for your skin. Activated charcoal acts like a magnet, drawing out dirt, excess sebum, and daily pollutants from deep within pores. This bar is ideal for oily and acne-prone skin — it regulates sebum without over-drying, while gently polishing the surface for a visibly smoother, energized complexion. Every wash feels genuinely detoxifying.",
      shortDesc: "Activated charcoal deep-pore detox soap to draw out impurities & balance oily skin",
      price: 299,
      comparePrice: 399,
      stock: 65,
      sku: "KUM-005",
      weight: 100,
      images: [img("charcoal-detox-polish-soap")],
      thumbnail: img("charcoal-detox-polish-soap"),
      categoryId: detox.id,
      tags: ["charcoal", "detox", "deep-pore", "oily-skin", "acne-prone"],
      ingredients:
        "Activated Charcoal, Coconut Oil, Palm Oil, Rice Bran Oil, Castor Oil, Caustic Soda, Essential Oil & Organic Fragrance",
      howToUse:
        "Use 3–4 times per week. Lather on damp skin, focusing on oily zones. Leave for 30 seconds then rinse. Follow with a lightweight moisturiser.",
      benefits: ["Draws out pore impurities", "Controls excess sebum", "Deep-pore detox", "Energizes tired-looking skin"],
      isActive: true,
      isFeatured: true,
      isNew: false,
    },
    {
      name: "Choco Coffee Energizing Polish Soap",
      slug: "choco-coffee-energizing-polish-soap",
      description:
        "An indulgent morning ritual in bar form. Finely ground Arabic coffee exfoliates with just the right amount of texture, buffing away dead skin cells while caffeine stimulates circulation and awakens tired-looking skin. Rich cocoa and chocolate extracts provide a luxurious moisture hit, and the warm, inviting aroma turns any shower into a sensory experience.",
      shortDesc: "Energizing scrub bar with Arabic coffee grounds & chocolate for natural polish & awakened skin",
      price: 349,
      comparePrice: 449,
      stock: 55,
      sku: "KUM-006",
      weight: 100,
      images: [img("choco-coffee-energizing-polish-soap")],
      thumbnail: img("choco-coffee-energizing-polish-soap"),
      categoryId: detox.id,
      tags: ["coffee", "chocolate", "exfoliation", "scrub", "energizing", "caffeine"],
      ingredients:
        "Arabic Coffee Grounds, Cocoa Extract, Coconut Oil, Palm Oil, Rice Bran Oil, Castor Oil, Caustic Soda, Essential Oil & Organic Fragrance",
      howToUse:
        "Use 3–4 times per week on body. Massage gently in circular motions to activate the coffee scrub. Rinse thoroughly. Best used in the morning for an energizing start.",
      benefits: ["Natural coffee-ground exfoliation", "Caffeine awakens & refreshes skin", "Cocoa hydrates & softens", "Rich in antioxidants"],
      isActive: true,
      isFeatured: false,
      isNew: true,
    },

    // ── NOURISHING & MOISTURIZING ────────────────────────────────────────────
    {
      name: "Almond & Donkey Milk Skin-Softening Soap",
      slug: "almond-donkey-milk-skin-softening-soap",
      description:
        "Cleopatra's secret, reimagined. Donkey milk has been cherished for millennia for its uncanny similarity to human skin — proteins and fatty acids that deeply revitalize, retinol that softens fine lines, and a high Vitamin C content that evens skin tone. Almond oil adds a silky moisture barrier that locks in hydration, leaving skin unbelievably soft, smooth, and luminous.",
      shortDesc: "Luxury age-defying bar with donkey milk & almond for intense hydration and luminous skin",
      price: 449,
      comparePrice: 599,
      stock: 40,
      sku: "KUM-002",
      weight: 100,
      images: [img("almond-donkey-milk-skin-softening-soap")],
      thumbnail: img("almond-donkey-milk-skin-softening-soap"),
      categoryId: nourishing.id,
      tags: ["donkey-milk", "almond", "anti-aging", "intense-hydration", "luxury"],
      ingredients:
        "Almond Oil, Donkey Milk Powder, Coconut Oil, Palm Oil, Rice Bran Oil, Caustic Soda, Castor Oil, Essential Oil & Organic Fragrance",
      howToUse:
        "Use daily on face and body. Allow the milky lather to rest on skin for 30 seconds before rinsing. Ideal for dry and mature skin.",
      benefits: ["Intensely hydrates & revitalizes", "Helps even skin tone", "Reduces appearance of fine lines", "Gentle for sensitive skin"],
      isActive: true,
      isFeatured: true,
      isNew: true,
    },
    {
      name: "Goatmilk & Oats Gentle Soothing Soap",
      slug: "goatmilk-oats-gentle-soothing-soap",
      description:
        "Comfort in a bar. Goat milk's lactic acid gently resurfaces the skin while maintaining its natural moisture balance — a delicate combination rarely found in regular cleansers. Oat milk (rich in beta-glucan) calms irritation, repairs the skin barrier, and keeps the complexion smooth and healthy-looking. Lightweight yet deeply nourishing, this bar is the gold standard for sensitive and dry skin.",
      shortDesc: "Ultra-gentle soothing bar with goat milk & oat milk for dry, sensitive, and irritated skin",
      price: 349,
      comparePrice: 449,
      stock: 60,
      sku: "KUM-007",
      weight: 100,
      images: [img("goatmilk-oats-gentle-soothing-soap")],
      thumbnail: img("goatmilk-oats-gentle-soothing-soap"),
      categoryId: nourishing.id,
      tags: ["goat-milk", "oat-milk", "sensitive-skin", "soothing", "gentle"],
      ingredients:
        "Goat Milk Powder, Oat Milk, Coconut Oil, Palm Oil, Rice Bran Oil, Castor Oil, Caustic Soda, Essential Oil & Organic Fragrance",
      howToUse:
        "Suitable for daily use on face and body. Gentle enough for children. Use cool water when rinsing to lock in extra moisture.",
      benefits: ["Gentle nourishing cleanse", "Lasting moisture for dry skin", "Calms irritation & flakiness", "Supports smooth healthy complexion"],
      isActive: true,
      isFeatured: true,
      isNew: false,
    },
    {
      name: "Honey & Red Wine Youth-Radiance Antioxidant Soap",
      slug: "honey-red-wine-youth-radiance-antioxidant-soap",
      description:
        "Wine and honey — two of history's most celebrated skin treatments, now in a single luxurious bar. Red wine's resveratrol delivers one of nature's most powerful antioxidant defences, protecting skin from daily environmental damage while revitalising a dull complexion. Raw honey acts as a humectant, drawing moisture deep into the skin for lasting smoothness that you can feel all day.",
      shortDesc: "Antioxidant-rich luxury bar with honey & red wine to protect, hydrate, and restore radiant glow",
      price: 399,
      comparePrice: 499,
      stock: 45,
      sku: "KUM-010",
      weight: 100,
      images: [img("honey-red-wine-youth-radiance-antioxidant-soap")],
      thumbnail: img("honey-red-wine-youth-radiance-antioxidant-soap"),
      categoryId: nourishing.id,
      tags: ["honey", "red-wine", "antioxidant", "anti-aging", "radiance"],
      ingredients:
        "Raw Honey, Red Wine Extract, Coconut Oil, Palm Oil, Rice Bran Oil, Castor Oil, Caustic Soda, Essential Oil & Organic Fragrance",
      howToUse:
        "Use daily. Massage lather onto damp skin and let it rest for 30 seconds before rinsing. Best used as an evening ritual.",
      benefits: ["Deep honey hydration", "Resveratrol antioxidant protection", "Revitalizes dull skin", "Nourishing gentle cleanse"],
      isActive: true,
      isFeatured: false,
      isNew: true,
    },
  ];

  let count = 0;
  for (const product of products) {
    await prisma.product.create({ data: product });
    count++;
  }
  console.log(`✅ ${count} products created`);

  console.log("\n🎉 Kumarie catalogue seeded successfully!");
  console.log("─────────────────────────────────────────────");
  console.log("  Categories : 4 (Brightening & Glow, Herbal & Ayurvedic,");
  console.log("               Detox & Polish, Nourishing & Moisturizing)");
  console.log(`  Products   : ${count} (from SOAP COVER - KUMARIE V4.24)`);
  console.log("─────────────────────────────────────────────");
  console.log(`  Admin email    : ${process.env.ADMIN_EMAIL || "admin@kumarie.com"}`);
  console.log(`  Admin password : ${process.env.ADMIN_PASSWORD || "Admin@Kumarie2024"}`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
