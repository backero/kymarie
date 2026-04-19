"use client";

import React, { ReactNode, Children, isValidElement } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { WordReveal } from "@/components/animations/WordReveal";
import { ScrollReveal } from "@/components/public/ScrollReveal";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
}

interface FilterParams {
  category?: string;
  search?: string;
  page?: string;
  sort?: string;
}

// ─── Page Header ─────────────────────────────────────────────────────────────

export function AnimatedProductsHeader() {
  return (
    <div className="bg-[#FAFAF9] border-b border-cream-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

          {/* Left: headline */}
          <div>
            <ScrollReveal>
              <div className="inline-flex items-center gap-3 mb-5">
                <span className="w-6 h-px bg-amber-400" />
                <span className="font-body text-[10px] tracking-[0.3em] uppercase text-sage-400">
                  The Collection
                </span>
              </div>
            </ScrollReveal>

            <WordReveal
              text="Every bar, a ritual."
              as="h1"
              className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-forest-500 tracking-tight"
              delay={0.06}
            />
          </div>

          {/* Right: descriptor */}
          <ScrollReveal delay={0.2}>
            <p className="font-body text-sm text-sage-500 max-w-xs leading-relaxed md:text-right">
              Small-batch, cold-processed, cured for six weeks.
              <br className="hidden md:block" />
              Nothing synthetic. Nothing unnecessary.
            </p>
          </ScrollReveal>
        </div>

        {/* Decorative line */}
        <motion.div
          className="h-px bg-gradient-to-r from-cream-300 via-amber-300 to-cream-300 mt-10"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

// ─── Sidebar Filter ───────────────────────────────────────────────────────────

export function AnimatedProductsFilter({
  params,
  categories,
}: {
  params: FilterParams;
  categories: (Category & { _count?: { products: number } })[];
}) {
  const hasSearch = Boolean(params.search);
  const activeCategory = params.category;

  return (
    <motion.aside
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="lg:w-56 flex-shrink-0"
    >
      <div className="bg-white border border-cream-300 sticky top-24">

        {/* Search */}
        <div className="p-5 border-b border-cream-300">
          <p className="font-body text-[9px] tracking-[0.25em] uppercase text-sage-400 mb-3 flex items-center gap-2">
            <SlidersHorizontal className="w-3 h-3" />
            Filter
          </p>
          <form method="GET" action="/products">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sage-400" />
              <input
                type="text"
                name="search"
                defaultValue={params.search}
                placeholder="Search products…"
                className="w-full pl-8 pr-8 py-2.5 bg-cream-100 border border-cream-300 font-body text-xs text-forest-700 placeholder-sage-300 focus:outline-none focus:border-amber-400 focus:bg-white transition-all duration-200"
              />
              {hasSearch && (
                <a
                  href="/products"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sage-400 hover:text-forest-500 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
            {activeCategory && (
              <input type="hidden" name="category" value={activeCategory} />
            )}
            <button
              type="submit"
              className="w-full mt-2.5 bg-forest-500 hover:bg-forest-400 text-cream-100 font-body text-[9px] tracking-[0.2em] uppercase py-2.5 transition-colors duration-200"
            >
              Search
            </button>
          </form>
        </div>

        {/* Categories */}
        <div className="p-5">
          <p className="font-body text-[9px] tracking-[0.25em] uppercase text-sage-400 mb-3">
            Category
          </p>
          <ul className="space-y-px">
            {[
              {
                id: "all",
                name: "All Products",
                slug: undefined as string | undefined,
                count: undefined as number | undefined,
              },
              ...categories.map((cat) => ({
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
                count: cat._count?.products,
              })),
            ].map((cat, i) => {
              const isActive = cat.slug
                ? activeCategory === cat.slug
                : !activeCategory;

              return (
                <motion.li
                  key={cat.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.32,
                    delay: 0.12 + i * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={
                      cat.slug
                        ? `/products?category=${cat.slug}`
                        : "/products"
                    }
                    className={`flex items-center justify-between w-full px-3 py-2 font-body text-xs transition-all duration-200 ${
                      isActive
                        ? "bg-forest-500 text-cream-100"
                        : "text-sage-600 hover:text-forest-500 hover:bg-cream-100"
                    }`}
                  >
                    <span>{cat.name}</span>
                    {cat.count !== undefined && (
                      <span
                        className={`text-[9px] tabular-nums ${
                          isActive ? "opacity-60" : "text-sage-400"
                        }`}
                      >
                        {cat.count}
                      </span>
                    )}
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </div>

        {/* Clear all filters */}
        {(activeCategory || hasSearch) && (
          <div className="px-5 pb-5">
            <Link
              href="/products"
              className="flex items-center justify-center gap-1.5 w-full border border-cream-300 hover:border-sage-400 text-sage-500 hover:text-forest-500 font-body text-[9px] tracking-[0.2em] uppercase py-2 transition-all duration-200"
            >
              <X className="w-3 h-3" />
              Clear filters
            </Link>
          </div>
        )}
      </div>
    </motion.aside>
  );
}

// ─── Animated Product Grid ────────────────────────────────────────────────────

export function AnimatedProductGrid({ children }: { children: ReactNode }) {
  const childArray = Children.toArray(children);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
      {childArray.map((child, i) =>
        isValidElement(child) ? (
          <motion.div
            key={(child as React.ReactElement).key ?? i}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.44,
              delay: Math.min(i * 0.06, 0.5),
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {child}
          </motion.div>
        ) : (
          child
        )
      )}
    </div>
  );
}
