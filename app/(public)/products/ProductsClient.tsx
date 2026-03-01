"use client";

import React, { ReactNode, Children, isValidElement } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon } from "lucide-react";
import Link from "next/link";
import { FadeUp, SlideReveal } from "@/components/animations";

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

// ─── Animated Page Header ────────────────────────────────────────────────────

export function AnimatedProductsHeader() {
  return (
    <div className="bg-white border-b border-cream-300 py-12 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeUp delay={0.05}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              className="h-px bg-amber-400"
              initial={{ width: 0 }}
              animate={{ width: 40 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            />
            <span className="font-body text-xs tracking-widest uppercase text-amber-600">
              All Products
            </span>
            <motion.div
              className="h-px bg-amber-400"
              initial={{ width: 0 }}
              animate={{ width: 40 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </FadeUp>

        <FadeUp delay={0.12}>
          <h1 className="font-display text-5xl md:text-6xl font-light text-forest-700 mb-3">
            The Collection
          </h1>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="font-body text-sage-500 max-w-xl mx-auto">
            Every bar is a unique ritual — handcrafted in small batches with the finest
            natural ingredients.
          </p>
        </FadeUp>
      </div>
    </div>
  );
}

// ─── Animated Sidebar Filter ─────────────────────────────────────────────────

export function AnimatedProductsFilter({
  params,
  categories,
}: {
  params: FilterParams;
  categories: (Category & { _count?: { products: number } })[];
}) {
  return (
    <SlideReveal direction="left" delay={0.1} className="lg:w-60 flex-shrink-0">
      <div className="bg-white border border-cream-300 p-6 sticky top-24">
        {/* Search */}
        <div className="mb-6">
          <label className="font-body text-xs font-semibold tracking-widest uppercase text-sage-500 mb-3 block">
            Search
          </label>
          <form method="GET" action="/products">
            <div className="relative group">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-400 transition-colors group-focus-within:text-amber-500" />
              <input
                type="text"
                name="search"
                defaultValue={params.search}
                placeholder="Search products..."
                className="w-full pl-9 pr-3 py-2.5 border border-cream-300 font-body text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 text-forest-700 placeholder-sage-400 bg-cream-50 transition-all duration-200"
              />
            </div>
            {params.category && (
              <input type="hidden" name="category" value={params.category} />
            )}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full mt-2 bg-forest-500 text-cream-100 font-body text-xs font-medium tracking-widest uppercase py-2 hover:bg-forest-600 transition-colors"
            >
              Search
            </motion.button>
          </form>
        </div>

        {/* Categories */}
        <div>
          <label className="font-body text-xs font-semibold tracking-widest uppercase text-sage-500 mb-3 block">
            Category
          </label>
          <ul className="space-y-1">
            {[
              { id: "all", name: "All Products", slug: undefined as string | undefined, count: undefined as number | undefined },
              ...categories.map((cat) => ({
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
                count: (cat as Category & { _count?: { products: number } })._count?.products,
              })),
            ].map((cat, i) => {
              const isActive = cat.slug ? params.category === cat.slug : !params.category;
              return (
                <motion.li
                  key={cat.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.1 + i * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={cat.slug ? `/products?category=${cat.slug}` : "/products"}
                    className={`flex items-center justify-between w-full px-3 py-2 font-body text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-forest-500 text-cream-100"
                        : "text-forest-600 hover:bg-cream-100 hover:pl-4"
                    }`}
                  >
                    {cat.name}
                    {cat.count !== undefined && (
                      <span className="text-xs opacity-60">{cat.count}</span>
                    )}
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </SlideReveal>
  );
}

// ─── Animated Product Grid (stagger) ─────────────────────────────────────────
// Uses `animate` (not `whileInView`) so items always appear after Suspense
// resolves — regardless of scroll position or whether once:true already fired.

export function AnimatedProductGrid({ children }: { children: ReactNode }) {
  const childArray = Children.toArray(children);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {childArray.map((child, i) =>
        isValidElement(child) ? (
          <motion.div
            // Use product key so React remounts when category changes
            key={(child as React.ReactElement).key ?? i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.42,
              // Cap total delay so late cards don't wait too long
              delay: Math.min(i * 0.07, 0.56),
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {child}
          </motion.div>
        ) : child
      )}
    </div>
  );
}
