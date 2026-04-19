import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Leaf,
  Droplets,
  Shield,
  Heart,
  Sun,
  Flower2,
  Waves,
  Feather,
} from "lucide-react";
import { getFeaturedProducts } from "@/actions/products";
import { CinematicHero } from "@/components/public/CinematicHero";
import { BrandStory, HorizontalProductScroll } from "@/components/public/BrandStory";
import { BeforeAfterSection } from "@/components/public/BeforeAfterSection";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { WordReveal } from "@/components/animations/WordReveal";
import { MagneticButton } from "@/components/animations/MagneticButton";
import type { Product } from "@/types";

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
          {features.map(({ icon: Icon, title, desc }, i) => (
            <ScrollReveal key={title} delay={i * 0.08}>
              <div className="group flex flex-col items-center text-center p-8 bg-white hover:bg-cream-100 transition-colors duration-200 cursor-default h-full">
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
            </ScrollReveal>
          ))}
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
    <section
      id="ingredients"
      className="py-20 md:py-28 bg-cream-100 border-y border-cream-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <ScrollReveal>
            <p className="font-body text-xs tracking-widest uppercase text-sage-400 mb-4">
              What goes in every bar
            </p>
          </ScrollReveal>
          <div className="font-display text-3xl md:text-4xl lg:text-5xl font-light text-forest-500 tracking-tight">
            <WordReveal text="Pure ingredients," as="span" delay={0.05} />
            {" "}
            <WordReveal text="nothing less" as="span" className="text-amber-500" delay={0.22} />
          </div>
          <ScrollReveal delay={0.35}>
            <p className="font-body text-sage-400 text-sm mt-4 max-w-md mx-auto leading-relaxed">
              Every ingredient is chosen for a reason. Nothing filler, nothing synthetic.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {ingredients.map(({ Icon, name, latin, benefit }, i) => (
            <ScrollReveal key={name} delay={i * 0.07}>
              <div className="group relative bg-white hover:bg-cream-50 rounded-xl border border-cream-300 hover:border-amber-200 p-6 md:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-md overflow-hidden cursor-default h-full">
                <span className="absolute top-4 right-5 font-display text-6xl font-light text-cream-300 select-none leading-none pointer-events-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-5 group-hover:bg-amber-100 transition-colors duration-200">
                  <Icon className="w-[18px] h-[18px] text-amber-500" strokeWidth={1.5} />
                </div>
                <p className="font-display text-lg md:text-xl font-medium text-forest-500 leading-tight mb-1">
                  {name}
                </p>
                <p className="font-body text-[11px] text-sage-400 italic tracking-wide mb-4">
                  {latin}
                </p>
                <div className="h-px w-8 bg-cream-300 mb-4" />
                <p className="font-body text-xs text-sage-500 leading-relaxed">
                  {benefit}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Newsletter ────────────────────────────────────────────────────────────────
function Newsletter() {
  return (
    <section className="bg-cream-200 py-20 md:py-28 border-t border-cream-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          <p className="font-body text-xs tracking-widest uppercase text-sage-400 mb-4">
            Stay in the loop
          </p>
          <WordReveal
            text="Join the ritual"
            as="h2"
            className="font-display text-3xl md:text-4xl lg:text-5xl font-light text-forest-500 tracking-tight mb-4"
            delay={0.05}
          />
          <p className="font-body text-sage-500 mb-10 leading-relaxed max-w-md mx-auto">
            New arrivals, skincare tips, and exclusive member offers — delivered
            with care. No noise, only things worth reading.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-white border border-cream-300 hover:border-sage-300 focus:border-amber-400 text-forest-500 placeholder-sage-300 font-body text-sm px-5 py-3.5 focus:outline-none transition-colors rounded-full"
              required
            />
            <MagneticButton strength={8}>
              <button
                type="submit"
                className="bg-forest-500 hover:bg-forest-400 text-white font-body font-medium tracking-widest uppercase text-xs px-7 py-3.5 transition-all duration-200 whitespace-nowrap rounded-full"
              >
                Subscribe
              </button>
            </MagneticButton>
          </form>
          <p className="font-body text-xs text-sage-400 mt-5">
            No spam, ever. Unsubscribe at any time.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(8);

  return (
    <>
      <CinematicHero />
      <MarqueeStrip />
      <FeaturesStrip />
      <HorizontalProductScroll products={featuredProducts as Product[]} />
      <BrandStory />
      <BeforeAfterSection />
      <IngredientsSection />
      <Newsletter />
    </>
  );
}
