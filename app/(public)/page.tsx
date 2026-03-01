import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Leaf,
  Star,
  Droplets,
  Shield,
  Heart,
  ChevronRight,
  Truck,
  RotateCcw,
  Award,
  Sun,
  Flower2,
  Waves,
  Feather,
} from "lucide-react";
import { getFeaturedProducts, getCategories } from "@/actions/products";
import { ProductCard } from "@/components/public/ProductCard";
import { TestimonialsCarousel } from "@/components/public/TestimonialsCarousel";
import { HeroCarousel } from "@/components/public/HeroCarousel";
import type { Product, Category } from "@/types";

// ─── Marquee Strip ─────────────────────────────────────────────────────────────
function MarqueeStrip() {
  const items = [
    "100% Natural Ingredients",
    "Cold Pressed Oils",
    "No SLS · No Parabens",
    "Cruelty Free",
    "Ayurvedic Wisdom",
    "Small Batch Crafted",
    "Handcrafted in India",
    "6 Weeks Cured",
  ];
  // Doubled for seamless infinite loop
  const doubled = [...items, ...items];

  return (
    <div className="bg-forest-500 overflow-hidden py-3 border-y border-forest-600">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 mx-10 font-body text-xs font-medium tracking-widest uppercase text-amber-400"
          >
            <span className="text-amber-500 text-sm">✦</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}


// ─── Features Strip ───────────────────────────────────────────────────────────
function FeaturesStrip() {
  const features = [
    {
      icon: Leaf,
      title: "Cold Process",
      desc: "Preserves active botanicals & natural goodness",
    },
    {
      icon: Droplets,
      title: "Pure Oils",
      desc: "Cold-pressed, unrefined & deeply nourishing",
    },
    {
      icon: Shield,
      title: "No Nasties",
      desc: "Free from SLS, parabens & phthalates",
    },
    {
      icon: Heart,
      title: "Cruelty Free",
      desc: "Never tested on animals, ever",
    },
  ];

  return (
    <section className="bg-white py-16 border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group flex flex-col items-center text-center p-6 rounded-2xl hover:bg-cream-100 transition-all duration-300 cursor-default"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-4 group-hover:bg-amber-100 group-hover:scale-110 transition-all duration-300">
                <Icon className="w-7 h-7 text-amber-600" strokeWidth={1.5} />
              </div>
              <p className="font-body text-sm font-semibold text-forest-700 mb-1.5 tracking-wide">
                {title}
              </p>
              <p className="font-body text-xs text-sage-500 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Category Strip ───────────────────────────────────────────────────────────
const fallbackImages: Record<string, string> = {
  "facial-care":
    "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=300&q=80",
  "body-care":
    "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&q=80",
  herbal:
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=300&q=80",
  "gift-sets":
    "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=300&q=80",
};

function CategoryStrip({ categories }: { categories: Category[] }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-10 bg-amber-400" />
              <span className="font-body text-xs tracking-widest uppercase text-amber-600 font-medium">
                Collections
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-light text-forest-700">
              Shop by concern
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 font-body text-xs tracking-widest uppercase text-sage-500 hover:text-amber-600 transition-colors group self-start sm:self-auto"
          >
            View all
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Horizontal scroll */}
        <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => {
            const imgSrc = cat.image || fallbackImages[cat.slug] || null;
            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group flex-shrink-0 flex flex-col items-center gap-3"
              >
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl overflow-hidden border-2 border-transparent group-hover:border-amber-400 transition-all duration-300 bg-cream-200 relative shadow-sm group-hover:shadow-md">
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="144px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Leaf
                        className="w-10 h-10 text-sage-300"
                        strokeWidth={1}
                      />
                    </div>
                  )}
                </div>
                <span className="font-body text-xs text-center font-semibold text-forest-700 group-hover:text-amber-600 transition-colors tracking-wide">
                  {cat.name}
                </span>
              </Link>
            );
          })}

          {/* View All tile */}
          <Link
            href="/products"
            className="group flex-shrink-0 flex flex-col items-center gap-3"
          >
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl border-2 border-dashed border-sage-200 hover:border-amber-400 transition-all duration-300 flex items-center justify-center bg-white group-hover:bg-amber-50">
              <div className="flex flex-col items-center gap-2">
                <ArrowRight className="w-6 h-6 text-sage-300 group-hover:text-amber-500 transition-colors" />
                <span className="font-body text-[10px] text-sage-400 group-hover:text-amber-500 uppercase tracking-widest">
                  All
                </span>
              </div>
            </div>
            <span className="font-body text-xs font-semibold text-sage-400 group-hover:text-amber-600 transition-colors tracking-wide">
              View All
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Ingredients Spotlight ─────────────────────────────────────────────────────
function IngredientsSection() {
  const ingredients = [
    {
      Icon: Leaf,
      name: "Neem",
      latin: "Azadirachta indica",
      benefit:
        "Deeply antibacterial. Purifies pores and combats blemishes without stripping skin.",
    },
    {
      Icon: Sun,
      name: "Turmeric",
      latin: "Curcuma longa",
      benefit:
        "Brightening and anti-inflammatory. Evens tone and imparts a natural luminosity.",
    },
    {
      Icon: Flower2,
      name: "Rose",
      latin: "Rosa damascena",
      benefit:
        "Hydrating and gently toning. Restores radiance and locks in moisture.",
    },
    {
      Icon: Droplets,
      name: "Olive Oil",
      latin: "Olea europaea",
      benefit:
        "Deeply nourishing. Leaves skin soft, supple, and visibly conditioned.",
    },
    {
      Icon: Waves,
      name: "Coconut Oil",
      latin: "Cocos nucifera",
      benefit:
        "Rich lather, gentle cleansing. Effective daily wash that never feels harsh.",
    },
    {
      Icon: Feather,
      name: "Lavender",
      latin: "Lavandula angustifolia",
      benefit:
        "Calming and soothing. Eases irritation and brings quiet to every wash.",
    },
  ];

  return (
    <section id="ingredients" className="py-20 md:py-28 bg-forest-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-amber-500" />
            <span className="font-body text-xs tracking-widest uppercase text-amber-400 font-medium">
              What goes in every bar
            </span>
            <div className="h-px w-10 bg-amber-500" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-light text-cream-100">
            Pure ingredients,{" "}
            <span className="text-amber-400">nothing less</span>
          </h2>
          <p className="font-body text-sage-400 text-sm mt-4 max-w-md mx-auto leading-relaxed">
            Every ingredient is chosen for a reason. Nothing filler, nothing
            synthetic.
          </p>
        </div>

        {/* Cards — 2 col mobile, 3 col desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {ingredients.map(({ Icon, name, latin, benefit }, i) => (
            <div
              key={name}
              className="group relative bg-white/[0.06] hover:bg-white/[0.10] rounded-2xl border border-white/10 hover:border-amber-400/35 p-6 md:p-7 transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-default"
            >
              {/* Hover top accent line */}
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Decorative index number */}
              <span className="absolute top-4 right-5 font-display text-6xl font-light text-white/[0.04] select-none leading-none pointer-events-none">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Icon chip */}
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center mb-5 group-hover:bg-amber-500/22 transition-colors duration-300">
                <Icon
                  className="w-4.5 h-4.5 text-amber-400"
                  strokeWidth={1.5}
                />
              </div>

              {/* Ingredient name */}
              <p className="font-display text-lg md:text-xl font-light text-cream-100 leading-tight mb-1">
                {name}
              </p>

              {/* Latin name */}
              <p className="font-body text-[11px] text-amber-400/60 italic tracking-wide mb-4">
                {latin}
              </p>

              {/* Divider */}
              <div className="h-px w-8 bg-amber-500/25 mb-4" />

              {/* Benefit */}
              <p className="font-body text-xs text-cream-400/80 leading-relaxed">
                {benefit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Trust Bar ─────────────────────────────────────────────────────────────────
function TrustBar() {
  const items = [
    { icon: Truck, label: "Free shipping over ₹599" },
    { icon: RotateCcw, label: "Easy 7-day returns" },
    { icon: Award, label: "100% authentic products" },
    { icon: Shield, label: "Secure payments" },
  ];

  return (
    <div className="bg-white border-t border-cream-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 justify-center">
              <Icon
                className="w-5 h-5 text-amber-500 flex-shrink-0"
                strokeWidth={1.5}
              />
              <span className="font-body text-xs text-sage-600 font-medium tracking-wide">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Newsletter ────────────────────────────────────────────────────────────────
function Newsletter() {
  return (
    <section className="relative bg-forest-700 py-20 md:py-28 overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/8 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 rounded-full px-4 py-1.5 mb-6">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="font-body text-xs text-amber-400 tracking-widest uppercase font-medium">
            Join 5,000+ subscribers
          </span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-light text-cream-100 mb-4">
          Join the ritual
        </h2>
        <p className="font-body text-cream-400 mb-10 leading-relaxed max-w-md mx-auto">
          Skincare wisdom, new arrivals, and exclusive member offers — delivered
          with care. No noise, only things worth reading.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 bg-white/10 border border-white/20 hover:border-amber-400/50 focus:border-amber-400 text-cream-100 placeholder-cream-500 font-body text-sm px-5 py-3.5 focus:outline-none transition-colors rounded-full"
            required
          />
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-400 text-white font-body font-semibold tracking-widest uppercase text-xs px-7 py-3.5 transition-all duration-200 whitespace-nowrap rounded-full hover:shadow-lg hover:shadow-amber-500/30"
          >
            Subscribe
          </button>
        </form>
        <p className="font-body text-xs text-cream-600 mt-5">
          No spam, ever. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
  ]);

  return (
    <>
      <HeroCarousel />
      <MarqueeStrip />
      <FeaturesStrip />

      {/* Featured Products */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-10 bg-amber-400" />
                <span className="font-body text-xs tracking-widest uppercase text-amber-600 font-medium">
                  Bestsellers
                </span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-light text-forest-700">
                Our finest bars
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-forest-600 hover:text-amber-600 transition-colors group border border-forest-300 hover:border-amber-400 rounded-full py-2.5 px-5 self-start"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Mobile: horizontal scroll / Desktop: 4-col grid */}
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 md:grid md:grid-cols-4 md:gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-64 sm:w-72 md:w-auto"
              >
                <ProductCard product={product as Product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CategoryStrip categories={categories as Category[]} />
      <IngredientsSection />
      <TestimonialsCarousel />
      <TrustBar />
      <Newsletter />
    </>
  );
}
