"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { useSearch } from "@/hooks/useSearch";
import { CartDrawer } from "./CartDrawer";
import { SearchBar } from "./SearchBar";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Shop",        href: "/products"     },
  { label: "Ingredients", href: "/#ingredients" },
  { label: "Our Story",   href: "/#about"       },
];

export function Navbar() {
  const [scrolled,        setScrolled]        = useState(false);
  const [mobileMenuOpen,  setMobileMenuOpen]  = useState(false);
  const [mounted,         setMounted]         = useState(false);

  const { getItemCount, openCart } = useCart();
  const { openMobile }             = useSearch();
  const count = mounted ? getItemCount() : 0;

  useEffect(() => {
    setMounted(true);
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white border-b border-cream-300 shadow-[0_1px_12px_rgba(0,0,0,0.04)]"
            : "bg-white/90 backdrop-blur-sm",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-8">

            {/* ── Logo ──────────────────────────────────────────────────────── */}
            <Link href="/" aria-label="Kumarie home" className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Kumarie"
                width={120}
                height={48}
                className="h-9 w-auto object-contain"
                priority
              />
            </Link>

            {/* ── Center nav links (desktop) ────────────────────────────────── */}
            <nav className="hidden md:flex items-center gap-7 flex-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-body text-sm text-sage-500 hover:text-forest-600 tracking-wide transition-colors duration-150 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-forest-400 transition-all duration-200 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* ── Right actions ─────────────────────────────────────────────── */}
            <div className="flex items-center gap-0.5 ml-auto">

              {/* Search icon */}
              <button
                onClick={openMobile}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-sage-400 hover:text-forest-600 hover:bg-cream-100 transition-all duration-150"
                aria-label="Open search"
              >
                <Search className="w-[18px] h-[18px]" strokeWidth={1.75} />
              </button>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative w-9 h-9 flex items-center justify-center rounded-lg text-sage-400 hover:text-forest-600 hover:bg-cream-100 transition-all duration-150"
                aria-label={`Cart${count > 0 ? ` (${count} items)` : ""}`}
              >
                <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.75} />
                <AnimatePresence mode="popLayout">
                  {count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 600, damping: 24 }}
                      className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-forest-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center leading-none"
                    >
                      {count > 9 ? "9+" : count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-sage-400 hover:text-forest-600 hover:bg-cream-100 transition-all duration-150 ml-0.5"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileMenuOpen ? (
                    <motion.span key="close"
                      initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}
                    >
                      <X className="w-5 h-5" strokeWidth={1.5} />
                    </motion.span>
                  ) : (
                    <motion.span key="open"
                      initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}
                    >
                      <Menu className="w-5 h-5" strokeWidth={1.5} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile menu panel ─────────────────────────────────────────────── */}
        <AnimatePresence initial={false}>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-nav"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden border-t border-cream-300 bg-white"
            >
              <nav className="px-6 py-5 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-body text-sm text-sage-600 hover:text-forest-600 py-2.5 border-b border-cream-200 last:border-0 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-3 inline-flex items-center justify-center w-full bg-forest-500 hover:bg-forest-400 text-white font-body font-medium text-xs tracking-widest uppercase py-3 rounded-full transition-colors duration-150"
                >
                  Shop Now
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search overlay (desktop + mobile) */}
      <SearchBar />

      {/* Cart drawer */}
      <CartDrawer />
    </>
  );
}
