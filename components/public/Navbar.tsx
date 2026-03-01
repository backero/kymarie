"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { CartDrawer } from "./CartDrawer";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Shop", href: "/products" },
  { label: "Our Story", href: "/#about" },
  { label: "Ingredients", href: "/#ingredients" },
  { label: "Journal", href: "/#journal" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { getItemCount, openCart } = useCart();
  const itemCount = mounted ? getItemCount() : 0;

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Navbar slides down on mount */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-cream-100/95 backdrop-blur-md shadow-sm border-b border-cream-300"
            : "bg-transparent",
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center group"
              aria-label="Kumarie Home"
            >
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <Image
                  src="/logo.png"
                  alt="Kumarie"
                  width={130}
                  height={52}
                  className="h-10 w-auto object-contain transition-opacity duration-300 group-hover:opacity-80"
                  priority
                />
              </motion.div>
            </Link>

            {/* Desktop Nav Links — stagger in */}
            <ul className="hidden md:flex items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.15 + i * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "font-body text-sm tracking-widest uppercase transition-colors duration-200 relative group",
                      isScrolled
                        ? "text-forest-600 hover:text-amber-600"
                        : "text-forest-700 hover:text-amber-600",
                    )}
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-amber-500 transition-all duration-300 group-hover:w-full" />
                  </Link>
                </motion.li>
              ))}
            </ul>

            {/* Right Actions */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex items-center gap-4"
            >
              {/* Search */}
              <Link
                href="/products"
                className="hidden md:flex items-center justify-center w-9 h-9 rounded-full hover:bg-cream-200 transition-colors duration-200 text-forest-600"
              >
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ duration: 0.18 }}
                >
                  <Search className="w-4 h-4" strokeWidth={1.5} />
                </motion.div>
              </Link>

              {/* Cart with animated badge */}
              <motion.button
                onClick={openCart}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.15 }}
                className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-cream-200 transition-colors duration-200 text-forest-600"
                aria-label={`Cart (${itemCount} items)`}
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                <AnimatePresence mode="popLayout">
                  {itemCount > 0 && (
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 22,
                      }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs font-body font-medium rounded-full flex items-center justify-center leading-none"
                    >
                      {itemCount > 9 ? "9+" : itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Mobile Menu Toggle */}
              <motion.button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.12 }}
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-cream-200 transition-colors duration-200 text-forest-600"
                aria-label="Menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isMobileOpen ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <X className="w-5 h-5" strokeWidth={1.5} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <Menu className="w-5 h-5" strokeWidth={1.5} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </div>
        </nav>

        {/* Mobile Menu — AnimatePresence for smooth open/close */}
        <AnimatePresence initial={false}>
          {isMobileOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden"
            >
              <div className="bg-cream-100/98 backdrop-blur-md border-t border-cream-300 px-6 py-6">
                <ul className="flex flex-col gap-5">
                  {navLinks.map((link, i) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: i * 0.06,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileOpen(false)}
                        className="font-body text-sm tracking-widest uppercase text-forest-600 hover:text-amber-600 transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                  <motion.li
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: navLinks.length * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="pt-2 border-t border-cream-300"
                  >
                    <Link
                      href="/products"
                      onClick={() => setIsMobileOpen(false)}
                      className="btn-primary inline-block text-center w-full"
                    >
                      Shop Now
                    </Link>
                  </motion.li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
