"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/animations/MagneticButton";

// Mockup image — 3D box render, natural landscape crop
const M = (slug: string) =>
  `https://res.cloudinary.com/dthgjtfvu/image/upload/c_fit,w_900,h_600,q_auto:best/kumarie/products/${slug}.jpg`;

// ── Carousel slides — 3D box mockup images ───────────────────────────────────
const SLIDES = [
  {
    src: M("lavender-saffron-floral-glow-soap"),
    slug: "lavender-saffron-floral-glow-soap",
    name: "Lavender & Saffron",
    tag: "Floral Glow",
    glow: "rgba(180,148,196,0.25)",
    accent: "#9B72B0",
  },
  {
    src: M("papaya-orange-vitamin-c-brightening-soap"),
    slug: "papaya-orange-vitamin-c-brightening-soap",
    name: "Papaya & Orange",
    tag: "Brightening",
    glow: "rgba(232,168,87,0.25)",
    accent: "#D4842A",
  },
  {
    src: M("hibiscus-rose-floral-radiance-soap"),
    slug: "hibiscus-rose-floral-radiance-soap",
    name: "Hibiscus & Rose",
    tag: "Floral Radiance",
    glow: "rgba(196,123,123,0.25)",
    accent: "#C47B7B",
  },
  {
    src: M("neem-thulasi-skin-healing-soap"),
    slug: "neem-thulasi-skin-healing-soap",
    name: "Neem & Thulasi",
    tag: "Skin Healing",
    glow: "rgba(74,124,89,0.22)",
    accent: "#4A7C59",
  },
  {
    src: M("charcoal-detox-polish-soap"),
    slug: "charcoal-detox-polish-soap",
    name: "Charcoal Detox",
    tag: "Deep Polish",
    glow: "rgba(60,60,60,0.20)",
    accent: "#3C3C3C",
  },
  {
    src: M("honey-red-wine-youth-radiance-antioxidant-soap"),
    slug: "honey-red-wine-youth-radiance-antioxidant-soap",
    name: "Honey & Red Wine",
    tag: "Antioxidant",
    glow: "rgba(139,58,58,0.22)",
    accent: "#8B3A3A",
  },
];

const TRUST = [
  "100% natural",
  "No SLS · No parabens",
  "6-week cured",
  "Handcrafted in India",
];

function fadeUp(delay: number, reduced: boolean | null) {
  return {
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduced ? 0.18 : 0.88,
      delay: reduced ? 0 : delay,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  };
}

export function CinematicHero() {
  const [mounted, setMounted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  // Scroll-driven text fade
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], ["0%", "-8%"]);

  // Subtle mouse tilt on product card
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tiltX = useSpring(useTransform(mx, [-0.5, 0.5], [4, -4]), { stiffness: 80, damping: 20 });
  const tiltY = useSpring(useTransform(my, [-0.5, 0.5], [-4, 4]), { stiffness: 80, damping: 20 });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || reduced) return;
    const handle = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", handle, { passive: true });
    return () => window.removeEventListener("mousemove", handle);
  }, [mounted, reduced, mx, my]);

  // Auto-advance
  useEffect(() => {
    if (!mounted || paused) return;
    const id = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 4000);
    return () => clearInterval(id);
  }, [mounted, paused]);

  const goTo = useCallback((i: number) => { setPaused(true); setCurrent(i); }, []);
  const slide = SLIDES[current];

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen overflow-x-hidden lg:h-screen lg:overflow-hidden"
      aria-label="Hero"
    >
      {/* Smooth animated background color that shifts with each slide */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${current}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 70% 70% at 75% 50%, ${slide.glow} 0%, #F4F3F0 60%)`,
          }}
        />
      </AnimatePresence>
      {/* Base cream fill */}
      <div className="absolute inset-0 -z-10" style={{ background: "#F4F3F0" }} />

      <div className="lg:h-full grid grid-cols-1 lg:grid-cols-2">

        {/* ── LEFT: text ── */}
        <motion.div
          style={reduced ? {} : { opacity: textOpacity, y: textY }}
          className="relative z-10 flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-20 pt-10 pb-12 lg:py-0 order-2 lg:order-1"
        >
          {/* Eyebrow */}
          <motion.div {...fadeUp(0.15, reduced)} className="flex items-center gap-3 mb-8">
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="block w-8 h-px bg-amber-400 origin-left shrink-0"
            />
            <span className="font-body text-[10px] tracking-[0.34em] uppercase text-sage-400">
              Handcrafted in India · Est. 2020
            </span>
          </motion.div>

          {/* Headline */}
          <div className="overflow-hidden mb-6">
            <motion.h1
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: "0%" }}
              transition={{ duration: 1.0, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-light text-forest-500 tracking-tight leading-[0.93]"
              style={{ fontSize: "clamp(1.9rem,6.5vw,5.25rem)" }}
            >
              Soap, the way
              <br />
              <em className="not-italic" style={{ color: "#3D6B5C" }}>nature</em>
              <br />
              intended.
            </motion.h1>
          </div>

          {/* Body */}
          <motion.p
            {...fadeUp(0.55, reduced)}
            className="font-body text-[14px] text-sage-500 leading-relaxed max-w-sm w-full mb-7"
          >
            Small-batch cold-processed bars crafted with Ayurvedic herbs,
            cold-pressed oils, and six weeks of patience.
          </motion.p>

          {/* CTAs */}
          <motion.div {...fadeUp(0.67, reduced)} className="flex flex-wrap items-center gap-3 mb-7">
            <MagneticButton strength={10}>
              <Link
                href="/products"
                className="group inline-flex items-center gap-3 bg-forest-500 hover:bg-forest-400 text-cream-100 font-body text-[11px] tracking-[0.22em] uppercase px-8 py-4 transition-all duration-300"
              >
                Shop Collection
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
            </MagneticButton>
            <MagneticButton strength={5}>
              <Link
                href="#ingredients"
                className="font-body text-[11px] tracking-[0.22em] uppercase text-sage-400 hover:text-forest-500 transition-colors duration-200 border-b border-sage-200 hover:border-forest-400 pb-0.5"
              >
                Our Ingredients
              </Link>
            </MagneticButton>
          </motion.div>

          {/* Trust pills */}
          <motion.div {...fadeUp(0.8, reduced)} className="flex flex-wrap gap-2">
            {TRUST.map((item, i) => (
              <motion.span
                key={item}
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.38, delay: 0.86 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-1.5 font-body text-[9px] tracking-widest uppercase text-sage-500 border border-cream-300 bg-white/50 px-3 py-1.5 rounded-full"
              >
                <span className="w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                {item}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* ── RIGHT: product showcase ── */}
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          className="relative order-1 lg:order-2 flex flex-col items-center justify-center pt-20 pb-4 lg:pt-0 lg:pb-0 lg:h-full"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Product card — tilt on mouse */}
          <motion.div
            style={reduced ? { perspective: 1000 } : { rotateX: tiltY, rotateY: tiltX, perspective: 1000 }}
            className="relative flex flex-col items-center"
          >
            {/* Packaging showcase */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`img-${current}`}
                  initial={{ opacity: 0, scale: 0.93, y: 24 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -16 }}
                  transition={{ duration: 0.70, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-[82vw] h-[54.7vw] max-w-[340px] max-h-[227px] sm:w-[380px] sm:h-[253px] md:w-[460px] md:h-[307px] lg:w-[520px] lg:h-[347px]"
                >
                  {/* Ambient glow matching product colour */}
                  <div
                    className="absolute -inset-8 rounded-full pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at 50% 55%, ${slide.glow} 0%, transparent 68%)`,
                      filter: "blur(32px)",
                    }}
                  />

                  {/* Packaging image — rounded, with crisp shadow */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-[0_24px_56px_rgba(0,0,0,0.16),0_4px_16px_rgba(0,0,0,0.08)]">
                    <Image
                      src={slide.src}
                      alt={slide.name}
                      fill
                      className="object-cover"
                      priority={current === 0}
                      sizes="(max-width: 640px) 300px,(max-width: 1024px) 460px,520px"
                    />
                  </div>

                  {/* Subtle shine overlay */}
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%, rgba(0,0,0,0.04) 100%)",
                    }}
                  />

                  {/* Ground shadow */}
                  <div
                    className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-4/5 h-6 pointer-events-none"
                    style={{
                      background: "radial-gradient(ellipse, rgba(0,0,0,0.15) 0%, transparent 70%)",
                      filter: "blur(12px)",
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Product label below packaging */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`label-${current}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="mt-7 flex flex-col items-center gap-1.5"
              >
                <span
                  className="font-body text-[9px] tracking-[0.3em] uppercase"
                  style={{ color: slide.accent }}
                >
                  {slide.tag}
                </span>
                <span className="font-display text-lg font-light text-forest-500 tracking-tight">
                  {slide.name}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Dot navigation */}
            {mounted && (
              <div className="flex gap-2 mt-6">
                {SLIDES.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={s.name}
                    className="group flex items-center justify-center w-5 h-5"
                  >
                    <span
                      className={`block rounded-full transition-all duration-400 ${
                        i === current
                          ? "w-5 h-1.5 bg-forest-500"
                          : "w-1.5 h-1.5 bg-forest-300/40 group-hover:bg-forest-400/60"
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

        </motion.div>
      </div>

      {/* Scroll indicator */}
      {mounted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.7 }}
          className="absolute bottom-7 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 pointer-events-none z-20"
        >
          <motion.div
            animate={{ scaleY: [1, 1.7, 1], opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-9 bg-sage-400 origin-top"
          />
          <span className="font-body text-[8px] tracking-[0.3em] uppercase text-sage-400/50">
            Scroll
          </span>
        </motion.div>
      )}
    </section>
  );
}
