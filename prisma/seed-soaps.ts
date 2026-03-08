/**
 * One-time script to seed the 14 remaining Kumarie handmade soaps.
 * Run: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed-soaps.ts
 * Or:  npx tsx prisma/seed-soaps.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const soaps = [
  {
    name: "Almond & Donkey Milk Handmade Soap",
    slug: "almond-donkey-milk-handmade-soap",
    description: "Promote Hair Growth, Reduces Hairfall, Strengthens Hair, Natural Conditioner",
  },
  {
    name: "Beetroot Handmade Soap",
    slug: "beetroot-handmade-soap",
    description: "Promote Hair Growth, Reduces Hairfall, Strengthens Hair, Natural Conditioner",
  },
  {
    name: "Charcoal Handmade Soap",
    slug: "charcoal-handmade-soap",
    description: "Promote Hair Growth, Reduces Hairfall, Strengthens Hair, Natural Conditioner",
  },
  {
    name: "Aavarampoo & Moringa Handmade Soap",
    slug: "aavarampoo-moringa-handmade-soap",
    description: "Promote Hair Growth, Reduces Hairfall, Strengthens Hair, Natural Conditioner",
  },
  {
    name: "Choco & Coffee Handmade Soap",
    slug: "choco-coffee-handmade-soap",
    description: "Promote Hair Growth, Reduces Hairfall, Strengthens Hair, Natural Conditioner",
  },
  {
    name: "Goatmilk & Oats Handmade Soap",
    slug: "goatmilk-oats-handmade-soap",
    description: "Promote Hair Growth, Reduces Hairfall, Strengthens Hair, Natural Conditioner",
  },
  {
    name: "Herbal Handmade Soap",
    slug: "herbal-handmade-soap",
    description: "Promote Hair Growth, Reduces Hairfall, Strengthens Hair, Natural Conditioner",
  },
  {
    name: "Hibiscus & Rose Handmade Soap",
    slug: "hibiscus-rose-handmade-soap",
    description: "Promote Hair Growth, Reduces Hairfall, Strengthens Hair, Natural Conditioner",
  },
  {
    name: "Honey & Red Wine Handmade Soap",
    slug: "honey-red-wine-handmade-soap",
    description: "Promote Hair Growth, Reduces Hairfall, Strengthens Hair, Natural Conditioner",
  },
  {
    name: "Pappaya & Orange Handmade Soap",
    slug: "pappaya-orange-handmade-soap",
    description: "Promote Hair Growth, Reduces Hairfall, Strengthens Hair, Natural Conditioner",
  },
  {
    name: "Neem & Thulasi Handmade Soap",
    slug: "neem-thulasi-handmade-soap",
    description: "Promote Hair Growth, Reduces Hairfall, Strengthens Hair, Natural Conditioner",
  },
  {
    name: "Lavender & Saffron Handmade Soap",
    slug: "lavender-saffron-handmade-soap",
    description: "Promote Hair Growth, Reduces Hairfall, Strengthens Hair, Natural Conditioner",
  },
  {
    name: "Kuppameni Handmade Soap",
    slug: "kuppameni-handmade-soap",
    description: "Helps soothe irritation and reduce inflammation, Rich natural antioxidants, Skin Nourishment.",
  },
  {
    name: "Turmeric & Thulasi Handmade Soap",
    slug: "turmeric-thulasi-handmade-soap",
    description: "Brightens dull skin, promotes a natural glow. Soothes irritation, rashes, minor skin inflammations",
  },
];

async function main() {
  console.log("🌱 Seeding Kumarie soaps...");

  // Get the body-care category
  const category = await prisma.category.findUnique({
    where: { slug: "body-care" },
  });

  if (!category) {
    throw new Error("body-care category not found. Run the main seed first.");
  }

  console.log(`✅ Found category: ${category.name} (${category.id})`);

  let created = 0;
  let skipped = 0;

  for (const soap of soaps) {
    const existing = await prisma.product.findUnique({
      where: { slug: soap.slug },
    });

    if (existing) {
      console.log(`⏭  Skipped (already exists): ${soap.name}`);
      skipped++;
      continue;
    }

    await prisma.product.create({
      data: {
        name: soap.name,
        slug: soap.slug,
        description: soap.description,
        price: 299,
        comparePrice: 359,
        stock: 50,
        images: [],
        categoryId: category.id,
        tags: ["handmade", "soap", "natural"],
        benefits: [],
        isActive: true,
        isFeatured: false,
        isNew: true,
      },
    });

    console.log(`✅ Created: ${soap.name}`);
    created++;
  }

  console.log(`\n🎉 Done! Created: ${created}, Skipped: ${skipped}`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
