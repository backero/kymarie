"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, Search, Leaf } from "lucide-react";
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
  const { getItemCount, openCart } = useCart();
  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-cream-100/95 backdrop-blur-md shadow-sm border-b border-cream-300"
            : "bg-transparent"
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group"
              aria-label="Kumarie Home"
            >
              <div className="w-8 h-8 relative">
                <Leaf className="w-8 h-8 text-forest-500 group-hover:text-amber-500 transition-colors duration-300" strokeWidth={1.5} />
              </div>
              <span
                className={cn(
                  "font-display text-2xl font-medium tracking-wide transition-colors duration-300",
                  isScrolled ? "text-forest-500" : "text-forest-600"
                )}
              >
                Kumarie
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <ul className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "font-body text-sm tracking-widest uppercase transition-colors duration-200 relative group",
                      isScrolled
                        ? "text-forest-600 hover:text-amber-600"
                        : "text-forest-700 hover:text-amber-600"
                    )}
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-amber-500 transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <Link
                href="/products?search=true"
                className="hidden md:flex items-center justify-center w-9 h-9 rounded-full hover:bg-cream-200 transition-colors duration-200 text-forest-600"
              >
                <Search className="w-4 h-4" strokeWidth={1.5} />
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-cream-200 transition-colors duration-200 text-forest-600"
                aria-label={`Cart (${itemCount} items)`}
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs font-body font-medium rounded-full flex items-center justify-center leading-none">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-cream-200 transition-colors duration-200 text-forest-600"
                aria-label="Menu"
              >
                {isMobileOpen ? (
                  <X className="w-5 h-5" strokeWidth={1.5} />
                ) : (
                  <Menu className="w-5 h-5" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isMobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="bg-cream-100/98 backdrop-blur-md border-t border-cream-300 px-6 py-6">
            <ul className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="font-body text-sm tracking-widest uppercase text-forest-600 hover:text-amber-600 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t border-cream-300">
                <Link
                  href="/products"
                  onClick={() => setIsMobileOpen(false)}
                  className="btn-primary inline-block text-center w-full"
                >
                  Shop Now
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
