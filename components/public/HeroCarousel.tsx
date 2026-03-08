"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react";

// ─── Data ──────────────────────────────────────────────────────────────────────
const SLIDES = [
  {
    badge: "New Collection · 2024",
    headline: "Nature's finest",
    accent: "on your skin",
    body: "Handcrafted soaps born from Ayurvedic wisdom. Cold-pressed oils, six weeks cured — for skin that feels truly loved.",
    cta: { label: "Explore Collection", href: "/products" },
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&q=90",
    alt: "Kumarie handcrafted soaps with botanicals",
  },
  {
    badge: "The Craft",
    headline: "Six weeks cured,",
    accent: "every bar",
    body: "Cold-process curing locks every botanical benefit deep into each bar. No shortcuts. No compromise. Just pure skin science.",
    cta: { label: "Shop Bestsellers", href: "/products" },
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=1200&q=90",
    alt: "Soap making process with natural ingredients",
  },
  {
    badge: "Pure Ingredients",
    headline: "Zero nasties.",
    accent: "All botanical.",
    body: "No SLS. No parabens. No synthetic fragrance. Every ingredient chosen for your skin — and the planet.",
    cta: { label: "View Ingredients", href: "/#ingredients" },
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1200&q=90",
    alt: "Fresh botanical herbs and flowers",
  },
] as const;

const STATS = [
  { value: "10K+", label: "Happy customers" },
  { value: "4.9★", label: "Average rating" },
  { value: "50+", label: "Products" },
  { value: "100%", label: "Natural" },
];

const INTERVAL = 6500;

// ─── Floating particles ────────────────────────────────────────────────────────
const PARTICLES = [
  { x: "12%", y: "28%", size: 9, delay: 0 },
  { x: "28%", y: "72%", size: 5, delay: 1.3 },
  { x: "6%", y: "55%", size: 7, delay: 0.6 },
  { x: "40%", y: "18%", size: 4, delay: 2.1 },
  { x: "22%", y: "85%", size: 6, delay: 0.9 },
];

// ─── Framer variants ───────────────────────────────────────────────────────────
const imgV = {
  enter: (d: number) => ({ x: d > 0 ? "7%" : "-7%", scale: 1.07, opacity: 0 }),
  center: {
    x: 0,
    scale: 1,
    opacity: 1,
    transition: { duration: 0.85, ease: [0.32, 0.72, 0, 1] },
  },
  exit: (d: number) => ({
    x: d > 0 ? "-5%" : "5%",
    scale: 1.02,
    opacity: 0,
    transition: { duration: 0.45 },
  }),
};

const textParentV = {
  enter: {},
  center: { transition: { staggerChildren: 0.11, delayChildren: 0.2 } },
  exit: {},
};

const textChildV = {
  enter: { y: 38, opacity: 0 },
  center: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { y: -16, opacity: 0, transition: { duration: 0.25 } },
};

// ─── Component ─────────────────────────────────────────────────────────────────
export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined,
  );
  const progressRef = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined,
  );

  // Mouse parallax on the image half
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 50, damping: 18 });
  const py = useSpring(rawY, { stiffness: 50, damping: 18 });

  // Navigate helpers
  const navigate = useCallback(
    (i: number) => {
      if (i === current) return;
      setDir(i > current ? 1 : -1);
      setCurrent(i);
      setProgress(0);
    },
    [current],
  );

  const next = useCallback(() => {
    setDir(1);
    setCurrent((c) => (c + 1) % SLIDES.length);
    setProgress(0);
  }, []);

  const prev = useCallback(() => {
    setDir(-1);
    setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
    setProgress(0);
  }, []);

  // Auto-play + progress bar
  useEffect(() => {
    clearInterval(timerRef.current);
    clearInterval(progressRef.current);
    if (paused) return;

    setProgress(0);
    let p = 0;
    const step = (100 * 50) / INTERVAL;

    progressRef.current = setInterval(() => {
      p = Math.min(p + step, 100);
      setProgress(p);
    }, 50);

    timerRef.current = setInterval(() => {
      setDir(1);
      setCurrent((c) => (c + 1) % SLIDES.length);
      p = 0;
      setProgress(0);
    }, INTERVAL);

    return () => {
      clearInterval(timerRef.current);
      clearInterval(progressRef.current);
    };
  }, [paused, current]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    rawX.set(((e.clientX - left) / width - 0.5) * 20);
    rawY.set(((e.clientY - top) / height - 0.5) * 14);
  };

  const slide = SLIDES[current];

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-cream-100"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        rawX.set(0);
        rawY.set(0);
        setPaused(false);
      }}
    >
      {/* Subtle background gradient — top-right only */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-50/60 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/4" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── LEFT: Animated text ──────────────────────────────────────────── */}
          <div className="order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                variants={textParentV}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {/* Pulsing badge */}
                <motion.div variants={textChildV}>
                  <span className="inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-sage-500 font-medium mb-7 select-none w-fit">
                    <span className="w-4 h-px bg-sage-300" />
                    {slide.badge}
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  variants={textChildV}
                  className="font-display text-6xl md:text-7xl lg:text-8xl font-light text-forest-500 leading-[0.92] tracking-tight"
                >
                  {slide.headline}
                </motion.h1>

                {/* Accent line */}
                <motion.div variants={textChildV} className="mb-6">
                  <span className="font-display text-6xl md:text-7xl lg:text-8xl font-light leading-[0.92] tracking-tight text-amber-500">
                    {slide.accent}
                  </span>
                </motion.div>

                {/* Body copy */}
                <motion.p
                  variants={textChildV}
                  className="font-body text-base md:text-lg text-sage-600 leading-relaxed max-w-md mb-10"
                >
                  {slide.body}
                </motion.p>

                {/* CTA */}
                <motion.div variants={textChildV} className="mb-14">
                  <Link
                    href={slide.cta.href}
                    className="group inline-flex items-center gap-3 bg-forest-500 hover:bg-forest-400 text-white font-body font-medium tracking-widest uppercase text-xs py-4 px-8 transition-all duration-200 rounded-full"
                  >
                    {slide.cta.label}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Stats row — always visible */}
            <div className="flex items-center gap-0 pt-8 border-t border-cream-300">
              {STATS.map(({ value, label }, i) => (
                <div
                  key={label}
                  className={`flex-1 text-center ${i > 0 ? "border-l border-cream-300" : ""}`}
                >
                  <p className="font-display text-xl md:text-2xl font-medium text-forest-500 leading-none mb-1">
                    {value}
                  </p>
                  <p className="font-body text-[10px] text-sage-400 tracking-wider uppercase leading-snug">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Image carousel ────────────────────────────────────────── */}
          <div className="order-1 lg:order-2 relative">
            {/* Image frame */}
            <div className="relative aspect-[3/4] max-w-lg mx-auto">
              <div className="relative w-full h-full overflow-hidden rounded-3xl shadow-2xl">
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.div
                    key={current}
                    custom={dir}
                    variants={imgV}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0"
                  >
                    {/* Mouse-parallax + Ken Burns wrapper */}
                    <motion.div
                      className="absolute inset-[-8px]"
                      style={{ x: px, y: py }}
                    >
                      <motion.div
                        className="absolute inset-0"
                        initial={{ scale: 1 }}
                        animate={{ scale: 1.07 }}
                        transition={{
                          duration: INTERVAL / 1000,
                          ease: "linear",
                        }}
                      >
                        <Image
                          src={slide.image}
                          alt={slide.alt}
                          fill
                          className="object-cover"
                          priority={current === 0}
                          sizes="(max-width: 1024px) 90vw, 50vw"
                        />
                      </motion.div>
                    </motion.div>

                    {/* Bottom gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Clean badge */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-white border border-cream-300 rounded-full flex flex-col items-center justify-center shadow-sm z-10">
                <span className="font-display text-xl font-semibold text-forest-500 leading-none">
                  100%
                </span>
                <span className="font-body text-[9px] tracking-widest uppercase text-sage-400 leading-none mt-0.5">
                  Natural
                </span>
              </div>
            </div>

            {/* Nav: prev / dots / next */}
            <div className="flex items-center justify-end gap-3 mt-8">
              <button
                onClick={prev}
                aria-label="Previous slide"
                className="w-10 h-10 rounded-full border border-cream-300 hover:border-forest-300 bg-white hover:bg-cream-100 flex items-center justify-center transition-all duration-200 group"
              >
                <ChevronLeft className="w-4 h-4 text-sage-400 group-hover:text-forest-500 transition-colors" />
              </button>

              <div className="flex items-center gap-1.5">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`rounded-full transition-all duration-300 ${
                      i === current
                        ? "w-6 h-2 bg-forest-500"
                        : "w-2 h-2 bg-cream-300 hover:bg-sage-300"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                aria-label="Next slide"
                className="w-10 h-10 rounded-full border border-cream-300 hover:border-forest-300 bg-white hover:bg-cream-100 flex items-center justify-center transition-all duration-200 group"
              >
                <ChevronRight className="w-4 h-4 text-sage-400 group-hover:text-forest-500 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-play progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-cream-300 overflow-hidden">
        <div
          className="h-full bg-forest-400"
          style={{ width: `${progress}%`, transition: "width 50ms linear" }}
        />
      </div>
    </section>
  );
}
