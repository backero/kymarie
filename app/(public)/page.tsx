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
} from "lucide-react";
import { getFeaturedProducts, getCategories } from "@/actions/products";
import { ProductCard } from "@/components/public/ProductCard";
import { TestimonialsCarousel } from "@/components/public/TestimonialsCarousel";
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

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const stats = [
    { value: "10K+", label: "Happy customers" },
    { value: "4.9★", label: "Average rating" },
    { value: "50+", label: "Products" },
    { value: "100%", label: "Natural" },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-cream-100">
      {/* Decorative gradient blobs */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-amber-400/8 rounded-full blur-3xl pointer-events-none translate-x-1/3" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-amber-300/8 rounded-full blur-3xl pointer-events-none -translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — Text */}
          <div className="order-2 lg:order-1">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
              <span className="font-body text-xs tracking-widest uppercase text-amber-700 font-medium">
                Handcrafted in India
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-light text-forest-700 leading-[0.88] mb-6">
              Nature&apos;s
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600">
                finest
              </span>
              <br />
              on your skin
            </h1>

            <p className="font-body text-base md:text-lg text-sage-600 leading-relaxed max-w-md mb-10">
              Each Kumarie bar is hand-poured with pure botanical extracts,
              cold-pressed oils, and centuries of Ayurvedic wisdom — making
              every wash a sacred ritual.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-14">
              <Link
                href="/products"
                className="group inline-flex items-center gap-3 bg-forest-500 hover:bg-forest-600 text-cream-100 font-body font-medium tracking-widest uppercase text-xs py-4 px-8 transition-all duration-300 rounded-full shadow-lg shadow-forest-500/20 hover:shadow-xl hover:shadow-forest-500/25"
              >
                Explore Collection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/#about"
                className="inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-forest-600 hover:text-amber-600 transition-colors group border border-forest-300 hover:border-amber-400 rounded-full py-4 px-6"
              >
                Our Story
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-4 pt-8 border-t border-cream-300">
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="font-display text-2xl md:text-3xl font-semibold text-forest-700 leading-none mb-1">
                    {value}
                  </p>
                  <p className="font-body text-[10px] text-sage-500 tracking-wider uppercase leading-snug">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Image */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative aspect-[3/4] max-w-lg mx-auto">
              {/* Main image — rounded-3xl */}
              <div className="relative w-full h-full overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=90"
                  alt="Kumarie handcrafted soaps with botanicals"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 90vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>

              {/* Floating review card */}
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl border border-cream-200 p-4 shadow-2xl max-w-[200px]">
                <div className="flex items-center gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="font-display text-sm font-medium text-forest-700 leading-snug">
                  &ldquo;Absolutely transformative&rdquo;
                </p>
                <p className="font-body text-xs text-sage-400 mt-1.5">
                  — Priya M., Bengaluru
                </p>
              </div>

              {/* Gold circle badge */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex flex-col items-center justify-center text-white shadow-xl">
                <span className="font-display text-xl font-semibold leading-none">
                  100%
                </span>
                <span className="font-body text-[9px] tracking-widest uppercase leading-none mt-0.5">
                  Natural
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
        <div className="w-px h-10 bg-gradient-to-b from-forest-500 to-transparent animate-bounce" />
      </div>
    </section>
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
                      <Leaf className="w-10 h-10 text-sage-300" strokeWidth={1} />
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

// ─── Brand Story ──────────────────────────────────────────────────────────────
function BrandStory() {
  const stats = [
    { value: "500+", label: "Bars crafted monthly" },
    { value: "6 wks", label: "Curing time per bar" },
    { value: "4.9★", label: "Customer rating" },
    { value: "2019", label: "Founded" },
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image collage */}
          <div className="relative grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600"
                alt="Handcrafting process"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 40vw, 25vw"
              />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden mt-10 rounded-2xl shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1591994843349-f415893b3a6b?w=600"
                alt="Natural ingredients"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 40vw, 25vw"
              />
            </div>
            {/* Gold quote pill */}
            <div className="absolute -bottom-5 left-4 right-4 bg-gradient-to-r from-amber-500 to-amber-400 rounded-2xl px-5 py-3.5 text-center shadow-xl">
              <p className="font-display text-sm italic text-white">
                &ldquo;Made with love, since 2019&rdquo;
              </p>
            </div>
          </div>

          {/* Text */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-amber-400" />
              <span className="font-body text-xs tracking-widest uppercase text-amber-600 font-medium">
                Our Story
              </span>
            </div>
            <h2 className="font-display text-5xl md:text-6xl font-light text-forest-700 leading-tight mb-6">
              Born from a grandmother&apos;s
              <span className="text-amber-500 italic"> recipe</span>
            </h2>
            <div className="space-y-4 font-body text-sage-600 leading-relaxed mb-8">
              <p>
                Kumarie began in a small kitchen in Kerala, inspired by the
                handwritten recipe notebook of Founder Ananya&apos;s grandmother —
                a woman who swore by neem, turmeric, and rose as the ultimate
                skin trio.
              </p>
              <p>
                Today, every Kumarie bar is still hand-poured in small batches,
                cured for a full 6 weeks, and wrapped by hand — carrying
                forward a tradition of care that can&apos;t be rushed.
              </p>
              <p className="font-semibold text-forest-700">
                No shortcuts. No compromises. Just nature, time, and intention.
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {stats.map(({ value, label }) => (
                <div
                  key={label}
                  className="bg-cream-100 rounded-2xl p-4 border border-cream-200"
                >
                  <p className="font-display text-2xl font-semibold text-amber-600 mb-0.5">
                    {value}
                  </p>
                  <p className="font-body text-xs text-sage-500 tracking-wide">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-3 bg-forest-500 hover:bg-forest-600 text-cream-100 font-body font-medium tracking-widest uppercase text-xs py-4 px-8 rounded-full transition-all duration-300 group shadow-lg shadow-forest-500/20"
            >
              Explore the collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Ingredients Spotlight ─────────────────────────────────────────────────────
function IngredientsSection() {
  const ingredients = [
    { emoji: "🌿", name: "Neem", benefit: "Antibacterial & purifying" },
    { emoji: "💛", name: "Turmeric", benefit: "Brightening & anti-inflammatory" },
    { emoji: "🌹", name: "Rose", benefit: "Hydrating & toning" },
    { emoji: "🫒", name: "Olive Oil", benefit: "Deep moisturising" },
    { emoji: "🥥", name: "Coconut Oil", benefit: "Rich lather & cleansing" },
    { emoji: "🌸", name: "Lavender", benefit: "Calming & soothing" },
  ];

  return (
    <section id="ingredients" className="py-20 md:py-24 bg-forest-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
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
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {ingredients.map(({ emoji, name, benefit }) => (
            <div
              key={name}
              className="group bg-white/8 hover:bg-amber-400/15 rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1 border border-white/10 hover:border-amber-400/40 cursor-default"
            >
              <span className="text-4xl mb-3 block">{emoji}</span>
              <p className="font-body font-semibold text-cream-100 text-sm mb-1">
                {name}
              </p>
              <p className="font-body text-xs text-cream-400 leading-relaxed">
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
              <Icon className="w-5 h-5 text-amber-500 flex-shrink-0" strokeWidth={1.5} />
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
      <HeroSection />
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
      <BrandStory />
      <IngredientsSection />
      <TestimonialsCarousel />
      <TrustBar />
      <Newsletter />
    </>
  );
}
