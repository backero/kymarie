"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CASES = [
  {
    id: "hydration",
    label: "Deep Hydration",
    tag: "2 Weeks",
    product: "Goatmilk & Oats Gentle Soothing Soap",
    beforeLabel: "Dry & Flaky",
    afterLabel: "Soft & Nourished",
    image: "/images/before-after/hydration-after.png",
    desc: "Goat milk's lactic acid gently resurfaces the skin while oat beta-glucan calms irritation and locks in lasting moisture.",
    href: "/products",
  },
  {
    id: "brightening",
    label: "Brightening",
    tag: "3 Weeks",
    product: "Papaya & Orange Vitamin-C Soap",
    beforeLabel: "Dull & Uneven",
    afterLabel: "Radiant & Glowing",
    image: "/images/before-after/brightening-after.png",
    desc: "Papain enzymes dissolve dead skin cells while orange extract floods skin with antioxidants for a brighter complexion.",
    href: "/products",
  },
  {
    id: "acne",
    label: "Acne Relief",
    tag: "10 Days",
    product: "Neem & Thulasi Skin-Healing Soap",
    beforeLabel: "Breakout Prone",
    afterLabel: "Clear & Calm",
    image: "/images/before-after/acne-after.png",
    desc: "Neem's nimbidin compound fights acne-causing bacteria while Thulasi soothes inflammation, clearing blemishes naturally.",
    href: "/products",
  },
  {
    id: "sensitive",
    label: "Sensitive Skin",
    tag: "1 Week",
    product: "Lavender & Saffron Floral Glow Soap",
    beforeLabel: "Red & Irritated",
    afterLabel: "Calm & Balanced",
    image: "/images/before-after/sensitive-after.png",
    desc: "Saffron and lavender essential oil soothe reactive skin, reduce redness, and restore the skin's natural balance.",
    href: "/products",
  },
];

export function BeforeAfterSection() {
  const [active, setActive] = useState(0);
  const current = CASES[active];

  return (
    <section className="py-24 md:py-32 bg-white border-b border-cream-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="font-body text-[10px] tracking-[0.35em] uppercase text-sage-400 mb-5"
          >
            Skin Transformations
          </motion.p>

          {/* Gradient glow title */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="relative inline-block"
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(245,182,60,0.22) 0%, transparent 100%)",
                filter: "blur(32px)",
                transform: "scale(1.5)",
              }}
            />
            <h2
              className="relative font-display font-light tracking-tight text-forest-500"
              style={{ fontSize: "clamp(1.8rem,5vw,3.75rem)" }}
            >
              Real results,{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(120deg, #D4842A 0%, #F5B63C 50%, #C8730A 100%)",
                }}
              >
                natural ingredients
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="font-body text-sm text-sage-400 mt-4 max-w-xs mx-auto leading-relaxed"
          >
            Pure botanicals. Visible change.
          </motion.p>
        </div>

        {/* ── Condition pills ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2.5 mb-12"
        >
          {CASES.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActive(i)}
              className={`px-5 py-2 rounded-full font-body text-[11px] tracking-wide uppercase transition-all duration-250 ${
                active === i
                  ? "bg-forest-500 text-white shadow-sm"
                  : "border border-cream-300 text-sage-400 hover:border-sage-300 hover:text-forest-500 bg-white"
              }`}
            >
              {c.label}
            </button>
          ))}
        </motion.div>

        {/* ── Main layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-14 items-center">

          {/* Single image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-square sm:aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.10)]"
            >
              <Image
                src={current.image}
                alt={current.afterLabel}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />

              {/* Before / After chip overlays */}
              <div className="absolute top-5 left-5 bg-black/40 backdrop-blur-sm text-white font-body text-[9px] tracking-[0.2em] uppercase px-3.5 py-2 rounded-full">
                Before · {current.beforeLabel}
              </div>
              <div className="absolute top-5 right-5 bg-amber-400 text-forest-900 font-body text-[9px] font-semibold tracking-[0.2em] uppercase px-3.5 py-2 rounded-full shadow-sm">
                After · {current.afterLabel}
              </div>

              {/* Bottom result strip */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-5 left-5 flex items-center gap-2">
                <span className="font-body text-[9px] tracking-widest uppercase text-white/60">Result in</span>
                <span className="font-display text-xl font-light text-white">{current.tag}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Info panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id + "-info"}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <div>
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-amber-500 mb-2">
                  {current.label}
                </p>
                <h3 className="font-display text-2xl md:text-3xl font-light text-forest-700 leading-snug">
                  {current.product}
                </h3>
              </div>

              <p className="font-body text-sm text-sage-500 leading-relaxed">
                {current.desc}
              </p>

              {/* Before → After state cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-cream-100 border border-cream-200 rounded-2xl p-4">
                  <p className="font-body text-[9px] tracking-widest uppercase text-sage-400 mb-1.5">Before</p>
                  <p className="font-display text-base font-light text-forest-500">{current.beforeLabel}</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <p className="font-body text-[9px] tracking-widest uppercase text-amber-500 mb-1.5">After</p>
                  <p className="font-display text-base font-light text-forest-700">{current.afterLabel}</p>
                </div>
              </div>

              <Link
                href={current.href}
                className="inline-flex items-center gap-2.5 bg-forest-500 hover:bg-forest-400 text-white font-body text-xs tracking-widest uppercase px-6 py-3.5 rounded-full transition-colors duration-200"
              >
                Shop {current.label}
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.8} />
              </Link>
            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}
