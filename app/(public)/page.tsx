import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, Star, Droplets, Shield, Heart } from "lucide-react";
import { getFeaturedProducts, getCategories } from "@/actions/products";
import { ProductCard } from "@/components/public/ProductCard";
import type { Product } from "@/types";

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-cream-100">
      {/* Background botanical pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232D4A1E' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-amber-400" />
              <span className="font-body text-xs tracking-widest uppercase text-amber-600 font-medium">
                Handcrafted in India
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-light text-forest-700 leading-[0.9] mb-6">
              Nature&apos;s
              <br />
              <em className="not-italic text-amber-600">finest</em>
              <br />
              on your skin
            </h1>

            <p className="font-body text-base md:text-lg text-sage-600 leading-relaxed max-w-md mb-8">
              Each Kumarie bar is hand-poured with pure botanical extracts, cold-pressed oils,
              and centuries of Ayurvedic wisdom — making every wash a sacred ritual.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="group flex items-center gap-3 bg-forest-500 hover:bg-forest-600 text-cream-100 font-body font-medium tracking-widest uppercase text-xs py-4 px-8 transition-all duration-300"
              >
                Explore Collection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/#about"
                className="font-body text-xs tracking-widest uppercase text-forest-600 hover:text-amber-600 transition-colors underline underline-offset-4 decoration-sage-300"
              >
                Our Story
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-cream-300">
              {[
                { label: "100% Natural", icon: Leaf },
                { label: "Cruelty Free", icon: Heart },
                { label: "No Parabens", icon: Shield },
              ].map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-amber-500" strokeWidth={1.5} />
                  <span className="font-body text-xs text-sage-600 tracking-wide">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative aspect-[3/4] max-w-lg mx-auto">
              {/* Main image */}
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=90"
                  alt="Kumarie handcrafted soaps with botanicals"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 90vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-800/20 via-transparent to-transparent" />
              </div>

              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-white border border-cream-300 p-4 shadow-xl max-w-[180px]">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="font-display text-sm font-medium text-forest-700">
                  "Absolutely transformative"
                </p>
                <p className="font-body text-xs text-sage-500 mt-0.5">
                  — Priya M., Bengaluru
                </p>
              </div>

              {/* Green badge */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-forest-500 rounded-full flex flex-col items-center justify-center text-cream-100 shadow-lg">
                <span className="font-display text-xl font-medium leading-none">
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
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-60">
        <div className="w-px h-10 bg-gradient-to-b from-forest-400 to-transparent" />
      </div>
    </section>
  );
}

// ─── Features Strip ───────────────────────────────────────────────────────────
function FeaturesStrip() {
  const features = [
    { icon: Leaf, title: "Cold Process", desc: "Preserves all natural goodness" },
    { icon: Droplets, title: "Pure Oils", desc: "Cold-pressed & unrefined" },
    { icon: Shield, title: "No Nasties", desc: "Free from SLS, parabens & phthalates" },
    { icon: Heart, title: "Cruelty Free", desc: "Never tested on animals" },
  ];

  return (
    <section className="bg-forest-600 text-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-forest-500 divide-y lg:divide-y-0">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-center gap-4 py-8 px-6 lg:px-8 group"
            >
              <Icon
                className="w-8 h-8 text-amber-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                strokeWidth={1.5}
              />
              <div>
                <p className="font-body text-sm font-semibold tracking-wide text-cream-100">
                  {title}
                </p>
                <p className="font-body text-xs text-cream-400 leading-snug">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Brand Story ──────────────────────────────────────────────────────────────
function BrandStory() {
  return (
    <section id="about" className="section-divider bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Images */}
          <div className="relative grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600"
                alt="Handcrafting process"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 40vw, 25vw"
              />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden mt-8">
              <Image
                src="https://images.unsplash.com/photo-1591994843349-f415893b3a6b?w=600"
                alt="Natural ingredients"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 40vw, 25vw"
              />
            </div>
            {/* Decorative text */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-amber-50 border border-amber-200 px-6 py-3 text-center whitespace-nowrap">
              <p className="font-display text-sm italic text-amber-700">
                "Made with love, since 2019"
              </p>
            </div>
          </div>

          {/* Text */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-amber-400" />
              <span className="font-body text-xs tracking-widest uppercase text-amber-600">
                Our Story
              </span>
            </div>
            <h2 className="font-display text-5xl md:text-6xl font-light text-forest-700 leading-tight mb-6">
              Born from a grandmother&apos;s
              <em className="not-italic text-amber-600"> recipe</em>
            </h2>
            <div className="space-y-4 font-body text-sage-600 leading-relaxed">
              <p>
                Kumarie began in a small kitchen in Kerala, inspired by the handwritten recipe
                notebook of Founder Ananya&apos;s grandmother — a woman who swore by neem, turmeric,
                and rose as the ultimate skin trio.
              </p>
              <p>
                What started as a personal ritual became a passion, and then a calling. Today,
                every Kumarie bar is still hand-poured in small batches, cured for a full 6 weeks,
                and wrapped by hand — carrying forward a tradition of care that can&apos;t be rushed.
              </p>
              <p className="font-medium text-forest-700">
                No shortcuts. No compromises. Just nature, time, and intention.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-3 mt-8 font-body text-xs tracking-widest uppercase text-forest-600 hover:text-amber-600 transition-colors group"
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

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const testimonials = [
    {
      text: "I&apos;ve tried every natural soap brand out there. Kumarie is the first that actually kept my skin soft all day. The Rose & Saffron bar is extraordinary.",
      author: "Priya Menon",
      location: "Bengaluru",
      rating: 5,
    },
    {
      text: "My face hasn&apos;t been this clear in years. The Neem & Turmeric bar reduced my breakouts in just two weeks. I&apos;m never going back.",
      author: "Arjun Shah",
      location: "Mumbai",
      rating: 5,
    },
    {
      text: "The packaging, the scent, the lather — everything about Kumarie feels premium. It&apos;s become my favourite self-care ritual.",
      author: "Kavitha Reddy",
      location: "Hyderabad",
      rating: 5,
    },
  ];

  return (
    <section className="section-divider bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-amber-400" />
            <span className="font-body text-xs tracking-widest uppercase text-amber-600">
              What they say
            </span>
            <div className="h-px w-10 bg-amber-400" />
          </div>
          <h2 className="font-display text-5xl font-light text-forest-700">
            Loved by thousands
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white border border-cream-300 p-8 relative group hover:border-amber-300 transition-colors duration-300"
            >
              {/* Quote mark */}
              <span className="absolute top-4 right-6 font-display text-7xl text-cream-300 leading-none pointer-events-none">
                &ldquo;
              </span>

              <div className="flex items-center gap-1 mb-5">
                {[...Array(t.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>

              <p
                className="font-body text-sage-600 leading-relaxed mb-6 relative z-10"
                dangerouslySetInnerHTML={{ __html: t.text }}
              />

              <div className="border-t border-cream-300 pt-4">
                <p className="font-display text-base font-medium text-forest-700">
                  {t.author}
                </p>
                <p className="font-body text-xs text-sage-400 mt-0.5">
                  {t.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Newsletter ────────────────────────────────────────────────────────────────
function Newsletter() {
  return (
    <section className="bg-forest-600 py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Leaf
          className="w-10 h-10 text-amber-400 mx-auto mb-5"
          strokeWidth={1}
        />
        <h2 className="font-display text-4xl md:text-5xl font-light text-cream-100 mb-3">
          Join the ritual
        </h2>
        <p className="font-body text-sage-200 mb-8 leading-relaxed">
          Subscribe for skincare wisdom, new arrivals, and exclusive member offers.
          No noise — only things worth reading.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 bg-white/10 border border-forest-400 text-cream-100 placeholder-cream-400 font-body text-sm px-4 py-3 focus:outline-none focus:border-amber-400 transition-colors"
            required
          />
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-400 text-forest-800 font-body font-semibold tracking-widest uppercase text-xs px-6 py-3 transition-colors duration-200 whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
        <p className="font-body text-xs text-cream-500 mt-4">
          No spam, ever. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(4);

  return (
    <>
      <HeroSection />
      <FeaturesStrip />

      {/* Featured Products */}
      <section className="section-divider bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-10 bg-amber-400" />
                <span className="font-body text-xs tracking-widest uppercase text-amber-600">
                  Bestsellers
                </span>
              </div>
              <h2 className="font-display text-5xl font-light text-forest-700">
                Our finest bars
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-forest-600 hover:text-amber-600 transition-colors group self-start md:self-auto"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product as Product} />
            ))}
          </div>
        </div>
      </section>

      <BrandStory />
      <Testimonials />
      <Newsletter />
    </>
  );
}
