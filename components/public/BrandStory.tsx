"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import type { Product } from "@/types";
import { ProductCard } from "@/components/public/ProductCard";
import { WordRevealBlock, WordReveal } from "@/components/animations/WordReveal";
import { MagneticButton } from "@/components/animations/MagneticButton";

const STATS = [
  { value: "6 Weeks", label: "Curing time per batch" },
  { value: "100%", label: "Natural ingredients" },
  { value: "0", label: "Synthetic additives" },
  { value: "2020", label: "Founded in India" },
];

const STORY_LINES = [
  "Every bar of Kumarie soap begins",
  "with a single truth: your skin",
  "deserves nothing but the purest.",
];

export function BrandStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-24 md:py-36 overflow-hidden"
      style={{ background: "linear-gradient(160deg,#F4F3F0 0%,#EEECEA 50%,#F0F2EE 100%)" }}
      aria-label="Brand story"
    >
      {/* Ambient glow blobs */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 80% 20%,rgba(170,203,189,0.12) 0%,transparent 60%)," +
            "radial-gradient(ellipse 50% 40% at 10% 80%,rgba(240,228,195,0.10) 0%,transparent 60%)",
        }}
      />

      {/* Large decorative letter */}
      <div
        aria-hidden="true"
        className="absolute -top-4 right-0 font-display text-[12rem] md:text-[16rem] font-light select-none leading-none pointer-events-none"
        style={{ color: "rgba(61,107,92,0.04)" }}
      >
        K
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left: story text */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-3 mb-8"
            >
              <span className="w-8 h-px bg-amber-400" />
              <p className="font-body text-[10px] tracking-[0.32em] uppercase text-amber-600">
                Our Story
              </p>
            </motion.div>

            <WordRevealBlock
              lines={STORY_LINES}
              as="h2"
              className="font-display text-3xl md:text-4xl lg:text-[3.5rem] font-light text-forest-500 leading-[1.1] tracking-tight mb-10"
              lineClassName="block"
              delay={0.1}
              stagger={0.07}
              duration={0.75}
            />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-5"
            >
              <p className="font-body text-[15px] text-sage-500 leading-relaxed max-w-md">
                We started Kumarie with an obsession: recreate the skincare rituals
                of our grandmothers using only what the earth freely gives. No
                shortcuts, no synthetics, no compromises.
              </p>
              <p className="font-body text-[15px] text-sage-500 leading-relaxed max-w-md">
                Each bar is cold-processed in small batches, cured for six weeks,
                and wrapped by hand. The result is a soap that nourishes as
                much as it cleanses.
              </p>

              <div className="pt-4">
                <MagneticButton strength={10}>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-3 bg-forest-500 hover:bg-forest-400 text-cream-100 font-body text-xs tracking-[0.2em] uppercase px-7 py-3.5 transition-all duration-300"
                  >
                    Shop the Collection
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M1 7h12M8 2l5 5-5 5" />
                    </svg>
                  </Link>
                </MagneticButton>
              </div>
            </motion.div>
          </div>

          {/* Right: stats grid — light cards */}
          <div className="grid grid-cols-2 gap-4">
            {STATS.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.25 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group bg-white/70 backdrop-blur-sm border border-cream-300 hover:border-amber-200 p-5 md:p-7 lg:p-9 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
              >
                <p className="font-display text-3xl md:text-4xl font-light text-forest-500 mb-2 group-hover:text-amber-500 transition-colors duration-300">
                  {value}
                </p>
                <div className="w-6 h-px bg-amber-300 mb-3" />
                <p className="font-body text-[10px] text-sage-400 tracking-[0.2em] uppercase">
                  {label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Featured Products Section (clean stagger, no GSAP pin) ─────────────────

interface HorizontalScrollProps {
  products: Product[];
}

export function HorizontalProductScroll({ products }: HorizontalScrollProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  const shown = products.slice(0, 8);

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
        >
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-sage-400 mb-3">
              Bestsellers
            </p>
            <WordReveal
              text="Our finest bars"
              as="h2"
              className="font-display text-3xl md:text-4xl lg:text-5xl font-light text-forest-500 tracking-tight"
              delay={0.08}
            />
          </div>
          <a
            href="/products"
            className="inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-sage-400 hover:text-forest-500 transition-colors group border border-cream-300 hover:border-forest-300 rounded-full py-2.5 px-5 self-start"
          >
            View all
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 5h12M8 1l4 4-4 4" />
            </svg>
          </a>
        </motion.div>

        {/* Desktop: 4-col grid with stagger */}
        <div className="hidden md:grid grid-cols-4 gap-6">
          {shown.slice(0, 4).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.6,
                delay: i * 0.09,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* Second row on desktop if more products */}
        {shown.length > 4 && (
          <div className="hidden md:grid grid-cols-4 gap-6 mt-6">
            {shown.slice(4, 8).map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.09,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Mobile: horizontal scroll row */}
        <div className="md:hidden flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
          {shown.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-64">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
