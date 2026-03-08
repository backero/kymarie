import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Leaf,
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
    <div className="bg-cream-200 overflow-hidden py-3 border-y border-cream-300">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 mx-10 font-body text-xs font-medium tracking-widest uppercase text-sage-500"
          >
            <span className="text-amber-400 text-sm">✦</span>
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
    <section className="bg-white py-14 border-b border-cream-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-cream-300">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group flex flex-col items-center text-center p-8 bg-white hover:bg-cream-100 transition-colors duration-200 cursor-default"
            >
              <div className="w-12 h-12 rounded-xl border border-cream-300 flex items-center justify-center mb-4 group-hover:border-amber-200 group-hover:bg-amber-50 transition-all duration-200">
                <Icon className="w-5 h-5 text-amber-500" strokeWidth={1.5} />
              </div>
              <p className="font-body text-sm font-semibold text-forest-500 mb-1.5 tracking-wide">
                {title}
              </p>
              <p className="font-body text-xs text-sage-400 leading-relaxed">
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
    <section className="py-16 md:py-20 bg-cream-100 border-b border-cream-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-sage-400 mb-3">
              Collections
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-forest-500 tracking-tight">
              Shop by concern
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 font-body text-xs tracking-widest uppercase text-sage-400 hover:text-forest-500 transition-colors group self-start sm:self-auto"
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
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border border-cream-300 group-hover:border-sage-300 transition-all duration-300 bg-cream-200 relative group-hover:shadow-sm">
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
                <span className="font-body text-xs text-center font-medium text-sage-600 group-hover:text-forest-500 transition-colors tracking-wide">
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
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl border border-dashed border-cream-300 hover:border-sage-300 transition-all duration-300 flex items-center justify-center bg-white group-hover:bg-cream-100">
              <div className="flex flex-col items-center gap-2">
                <ArrowRight className="w-5 h-5 text-sage-300 group-hover:text-forest-400 transition-colors" />
                <span className="font-body text-[10px] text-sage-400 group-hover:text-forest-400 uppercase tracking-widest">
                  All
                </span>
              </div>
            </div>
            <span className="font-body text-xs font-medium text-sage-400 group-hover:text-forest-500 transition-colors tracking-wide">
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
    <section id="ingredients" className="py-20 md:py-28 bg-cream-100 border-y border-cream-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-xs tracking-widest uppercase text-sage-400 mb-4">
            What goes in every bar
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-forest-500 tracking-tight">
            Pure ingredients,{" "}
            <span className="text-amber-500">nothing less</span>
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
              className="group relative bg-white hover:bg-cream-50 rounded-xl border border-cream-300 hover:border-amber-200 p-6 md:p-7 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm overflow-hidden cursor-default"
            >
              {/* Decorative index number */}
              <span className="absolute top-4 right-5 font-display text-6xl font-light text-cream-300 select-none leading-none pointer-events-none">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Icon chip */}
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-5 group-hover:bg-amber-100 transition-colors duration-200">
                <Icon
                  className="w-4.5 h-4.5 text-amber-500"
                  strokeWidth={1.5}
                />
              </div>

              {/* Ingredient name */}
              <p className="font-display text-lg md:text-xl font-medium text-forest-500 leading-tight mb-1">
                {name}
              </p>

              {/* Latin name */}
              <p className="font-body text-[11px] text-sage-400 italic tracking-wide mb-4">
                {latin}
              </p>

              {/* Divider */}
              <div className="h-px w-8 bg-cream-300 mb-4" />

              {/* Benefit */}
              <p className="font-body text-xs text-sage-500 leading-relaxed">
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
    <div className="bg-white border-y border-cream-300 py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-cream-300">
          {items.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5 justify-center px-4 py-1">
              <Icon
                className="w-4 h-4 text-sage-400 flex-shrink-0"
                strokeWidth={1.5}
              />
              <span className="font-body text-xs text-sage-500 tracking-wide">
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
    <section className="bg-cream-200 py-20 md:py-28 border-t border-cream-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="font-body text-xs tracking-widest uppercase text-sage-400 mb-4">
          Join 5,000+ subscribers
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-light text-forest-500 tracking-tight mb-4">
          Join the ritual
        </h2>
        <p className="font-body text-sage-500 mb-10 leading-relaxed max-w-md mx-auto">
          Skincare wisdom, new arrivals, and exclusive member offers — delivered
          with care. No noise, only things worth reading.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 bg-white border border-cream-300 hover:border-sage-300 focus:border-amber-400 text-forest-500 placeholder-sage-300 font-body text-sm px-5 py-3.5 focus:outline-none transition-colors rounded-full"
            required
          />
          <button
            type="submit"
            className="bg-forest-500 hover:bg-forest-400 text-white font-body font-medium tracking-widest uppercase text-xs px-7 py-3.5 transition-all duration-200 whitespace-nowrap rounded-full"
          >
            Subscribe
          </button>
        </form>
        <p className="font-body text-xs text-sage-400 mt-5">
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
              <p className="font-body text-xs tracking-widest uppercase text-sage-400 mb-4">
                Bestsellers
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-forest-500 tracking-tight">
                Our finest bars
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-sage-400 hover:text-forest-500 transition-colors group border border-cream-300 hover:border-forest-300 rounded-full py-2.5 px-5 self-start"
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
