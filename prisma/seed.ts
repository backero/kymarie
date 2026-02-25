import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "Admin@Kumarie2024",
    12
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
  console.log("✅ Admin created");

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "facial-care" },
      update: {},
      create: {
        name: "Facial Care",
        slug: "facial-care",
        description: "Gentle soaps crafted for delicate facial skin",
      },
    }),
    prisma.category.upsert({
      where: { slug: "body-care" },
      update: {},
      create: {
        name: "Body Care",
        slug: "body-care",
        description: "Luxurious body soaps for daily indulgence",
      },
    }),
    prisma.category.upsert({
      where: { slug: "herbal" },
      update: {},
      create: {
        name: "Herbal",
        slug: "herbal",
        description: "Infused with the purest botanical extracts",
      },
    }),
    prisma.category.upsert({
      where: { slug: "gift-sets" },
      update: {},
      create: {
        name: "Gift Sets",
        slug: "gift-sets",
        description: "Curated collections perfect for gifting",
      },
    }),
  ]);
  console.log("✅ Categories created");

  // Create sample products
  const products = [
    {
      name: "Rose & Saffron Glow Soap",
      slug: "rose-saffron-glow-soap",
      description:
        "Indulge in the timeless luxury of Kumarie's Rose & Saffron Glow Soap. Hand-crafted with pure Bulgarian rose water and precious Kashmir saffron, this bar delivers a radiant, luminous complexion with every wash. The rich, creamy lather gently cleanses while rose hip oil nourishes and saffron brightens, leaving skin with an unmistakable golden glow.",
      shortDesc: "Brightening luxury soap with Bulgarian rose & Kashmir saffron",
      price: 449,
      comparePrice: 599,
      stock: 50,
      sku: "KUM-001",
      weight: 100,
      images: [
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800",
      ],
      thumbnail:
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400",
      categoryId: categories[0].id,
      tags: ["rose", "saffron", "brightening", "luxury", "facial"],
      ingredients:
        "Saponified Coconut Oil, Saponified Palm Oil, Rose Water, Saffron Extract, Rose Hip Oil, Shea Butter, Rose Fragrance, Rose Petals",
      howToUse:
        "Wet hands and soap. Work into a rich lather. Massage gently onto face in circular motions. Rinse thoroughly with lukewarm water. Follow with your favourite moisturiser.",
      benefits: ["Brightens complexion", "Deep hydration", "Anti-aging", "Gentle cleansing"],
      isActive: true,
      isFeatured: true,
      isNew: true,
    },
    {
      name: "Neem & Turmeric Purifying Bar",
      slug: "neem-turmeric-purifying-bar",
      description:
        "Harnessing centuries of Ayurvedic wisdom, this powerful yet gentle purifying bar combines wild-harvested neem leaf extract with pure turmeric root. Known for their antimicrobial and anti-inflammatory properties, these botanicals work in harmony to clarify skin, reduce blemishes, and restore natural balance. Your skin will feel clean, clear, and deeply purified.",
      shortDesc: "Ayurvedic purifying bar with neem & turmeric",
      price: 349,
      comparePrice: 449,
      stock: 75,
      sku: "KUM-002",
      weight: 100,
      images: [
        "https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=800",
        "https://images.unsplash.com/photo-1591994843349-f415893b3a6b?w=800",
      ],
      thumbnail:
        "https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=400",
      categoryId: categories[2].id,
      tags: ["neem", "turmeric", "ayurvedic", "purifying", "acne"],
      ingredients:
        "Saponified Coconut Oil, Neem Leaf Extract, Turmeric Root Powder, Tea Tree Essential Oil, Activated Charcoal, Aloe Vera",
      howToUse:
        "Use daily on face and body. Lather well and leave for 30 seconds before rinsing for enhanced purifying action.",
      benefits: ["Clears acne", "Antibacterial", "Reduces inflammation", "Balances oily skin"],
      isActive: true,
      isFeatured: true,
      isNew: false,
    },
    {
      name: "Lavender & Oat Calm Soap",
      slug: "lavender-oat-calm-soap",
      description:
        "A sanctuary in bar form. Our Lavender & Oat Calm Soap is crafted for sensitive, reactive skin that craves soothing comfort. Colloidal oatmeal creates a protective barrier while French lavender essential oil calms both skin and spirit. The milky, creamy lather envelops skin in gentle care, reducing redness and irritation with every use.",
      shortDesc: "Soothing soap for sensitive skin with lavender & colloidal oat",
      price: 399,
      comparePrice: null,
      stock: 60,
      sku: "KUM-003",
      weight: 110,
      images: [
        "https://images.unsplash.com/photo-1547496502-affa22d38842?w=800",
        "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800",
      ],
      thumbnail:
        "https://images.unsplash.com/photo-1547496502-affa22d38842?w=400",
      categoryId: categories[1].id,
      tags: ["lavender", "oat", "sensitive", "calming", "soothing"],
      ingredients:
        "Saponified Coconut Oil, Colloidal Oatmeal, Lavender Essential Oil, Shea Butter, Calendula Extract, Vitamin E",
      howToUse:
        "Perfect for daily use, even on the most sensitive skin. Gentle enough for children. Rinse with cool water to lock in moisture.",
      benefits: ["Soothes sensitive skin", "Reduces redness", "Moisturising", "Stress-relieving"],
      isActive: true,
      isFeatured: false,
      isNew: false,
    },
    {
      name: "Charcoal & Mint Detox Soap",
      slug: "charcoal-mint-detox-soap",
      description:
        "Reset your skin with our deep-cleansing Charcoal & Mint Detox Soap. Activated bamboo charcoal acts like a magnet, drawing out impurities, excess oil, and environmental pollutants from deep within pores. Energising spearmint essential oil provides a cooling tingle while leaving skin feeling genuinely clean — not stripped.",
      shortDesc: "Deep-cleansing detox bar with activated charcoal & mint",
      price: 379,
      comparePrice: 499,
      stock: 45,
      sku: "KUM-004",
      weight: 100,
      images: [
        "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=800",
      ],
      thumbnail:
        "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=400",
      categoryId: categories[1].id,
      tags: ["charcoal", "mint", "detox", "deep-cleanse", "pore-cleansing"],
      ingredients:
        "Saponified Coconut Oil, Activated Bamboo Charcoal, Spearmint Essential Oil, Kaolin Clay, Tea Tree Oil, Peppermint Extract",
      howToUse:
        "Use 2-3 times per week for best results. Ideal for T-zone or oily areas. Follow with a hydrating moisturiser.",
      benefits: ["Deep pore cleansing", "Oil control", "Detoxifying", "Cooling sensation"],
      isActive: true,
      isFeatured: true,
      isNew: false,
    },
    {
      name: "Sandalwood & Honey Ritual Soap",
      slug: "sandalwood-honey-ritual-soap",
      description:
        "Inspired by ancient Indian beauty rituals, this opulent bar combines the warm, woody depth of Mysore sandalwood with the humectant richness of raw forest honey. Together they create a luxurious bathing experience that leaves skin supple, scented, and luminous. A ritual worth returning to every day.",
      shortDesc: "Luxurious ritual soap with Mysore sandalwood & raw honey",
      price: 499,
      comparePrice: 649,
      stock: 30,
      sku: "KUM-005",
      weight: 110,
      images: [
        "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800",
      ],
      thumbnail:
        "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400",
      categoryId: categories[0].id,
      tags: ["sandalwood", "honey", "luxury", "ritual", "anti-aging"],
      ingredients:
        "Saponified Coconut Oil, Sandalwood Essential Oil, Raw Forest Honey, Almond Oil, Sandalwood Powder, Vitamin E, Saffron",
      howToUse:
        "Best enjoyed as an evening ritual. Allow the warm, earthy lather to envelop you. Rinse and follow with body oil.",
      benefits: ["Anti-aging", "Deep nourishment", "Skin brightening", "Relaxing aroma"],
      isActive: true,
      isFeatured: false,
      isNew: true,
    },
    {
      name: "Botanical Gift Set - 3 Bars",
      slug: "botanical-gift-set-3-bars",
      description:
        "The perfect introduction to the Kumarie universe. This curated gift set includes three of our bestselling soaps: Rose & Saffron Glow, Lavender & Oat Calm, and Neem & Turmeric Pure — each wrapped in our signature kraft paper with hand-tied twine, nestled in a beautiful branded gift box. A thoughtful gift for someone you cherish.",
      shortDesc: "Curated gift set with 3 bestselling soaps in premium packaging",
      price: 999,
      comparePrice: 1197,
      stock: 25,
      sku: "KUM-GS-001",
      weight: 350,
      images: [
        "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800",
      ],
      thumbnail:
        "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400",
      categoryId: categories[3].id,
      tags: ["gift", "set", "collection", "bestseller", "packaging"],
      ingredients:
        "Includes: Rose & Saffron Glow (100g), Lavender & Oat Calm (110g), Neem & Turmeric Pure (100g)",
      howToUse:
        "Each soap can be used daily. Rotate between bars to address different skin concerns throughout the week.",
      benefits: ["Complete skin care", "Premium packaging", "Great gifting", "Value for money"],
      isActive: true,
      isFeatured: true,
      isNew: false,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }
  console.log("✅ Products created");

  console.log("\n🎉 Database seeded successfully!");
  console.log(`\n📧 Admin email: ${process.env.ADMIN_EMAIL || "admin@kumarie.com"}`);
  console.log(`🔑 Admin password: ${process.env.ADMIN_PASSWORD || "Admin@Kumarie2024"}`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
