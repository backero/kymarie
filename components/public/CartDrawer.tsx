"use client";

import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal } =
    useCart();

  if (!mounted) return null;
  const total = getTotal();
  const freeShippingThreshold = 599;
  const remainingForFreeShipping = freeShippingThreshold - total;
  const progressPct = Math.min((total / freeShippingThreshold) * 100, 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.42, ease: [0.32, 0.72, 0, 1] }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl  overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-cream-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cream-200 border border-cream-300 flex items-center justify-center">
                  <ShoppingBag
                    className="w-4 h-4 text-sage-500"
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <h2 className="font-display text-lg font-medium text-forest-700 leading-none">
                    Your Cart
                  </h2>
                  <AnimatePresence mode="wait">
                    {items.length > 0 && (
                      <motion.span
                        key={items.length}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.2 }}
                        className="font-body text-xs text-sage-500 block"
                      >
                        {items.length} {items.length === 1 ? "item" : "items"}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <motion.button
                onClick={closeCart}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.18 }}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-cream-100 transition-colors text-sage-500 hover:text-forest-600"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </motion.button>
            </div>

            {/* Free shipping progress bar */}
            <AnimatePresence>
              {items.length > 0 && remainingForFreeShipping > 0 && (
                <motion.div
                  key="progress"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 py-3 bg-cream-100 border-b border-cream-300">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-body text-xs text-sage-600 font-medium">
                        Add {formatPrice(remainingForFreeShipping)} more for
                        free shipping
                      </span>
                      <Sparkles className="w-3.5 h-3.5 text-sage-400" />
                    </div>
                    <div className="w-full h-1 bg-cream-300 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-forest-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              {items.length > 0 && remainingForFreeShipping <= 0 && (
                <motion.div
                  key="free-shipping"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span className="font-body text-xs text-amber-700 font-medium">
                      You qualify for free shipping!
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: 0.1 }}
                  className="flex flex-col items-center justify-center h-full gap-5 text-center py-16"
                >
                  <div className="w-24 h-24 rounded-3xl bg-cream-100 border-2 border-dashed border-cream-300 flex items-center justify-center">
                    <ShoppingBag
                      className="w-10 h-10 text-sage-300"
                      strokeWidth={1}
                    />
                  </div>
                  <div>
                    <p className="font-display text-xl text-forest-600 mb-1.5">
                      Your cart is empty
                    </p>
                    <p className="font-body text-sm text-sage-500 leading-relaxed max-w-[220px] mx-auto">
                      Discover our handcrafted natural soaps and start your
                      ritual
                    </p>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Link
                      href="/products"
                      onClick={closeCart}
                      className="inline-flex items-center gap-2 bg-forest-500 hover:bg-forest-400 text-white font-body font-medium tracking-widest uppercase text-xs py-3.5 px-6 rounded-full transition-all duration-200 group mt-2"
                    >
                      Explore Products
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </motion.div>
                </motion.div>
              ) : (
                <ul className="space-y-1 divide-y divide-cream-100">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{
                          opacity: 0,
                          x: -24,
                          height: 0,
                          marginBottom: 0,
                          paddingTop: 0,
                          paddingBottom: 0,
                        }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="py-5 flex gap-4 overflow-hidden"
                      >
                        {/* Thumbnail */}
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeCart}
                          className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-cream-100 block hover:opacity-90 transition-opacity"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.slug}`}
                            onClick={closeCart}
                            className="font-display text-[15px] font-medium text-forest-700 hover:text-amber-600 transition-colors line-clamp-1 leading-snug"
                          >
                            {item.name}
                          </Link>
                          <p className="font-body text-sm font-semibold text-forest-600 mt-1">
                            {formatPrice(item.price)}
                          </p>

                          {/* Quantity & Remove */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center bg-cream-100 rounded-full border border-cream-200 overflow-hidden">
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="w-8 h-8 flex items-center justify-center text-sage-500 hover:text-forest-600 hover:bg-cream-200 transition-colors rounded-full"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </motion.button>
                              <AnimatePresence mode="popLayout">
                                <motion.span
                                  key={item.quantity}
                                  initial={{ opacity: 0, y: -8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 8 }}
                                  transition={{ duration: 0.15 }}
                                  className="w-8 text-center font-body text-sm font-semibold text-forest-700"
                                >
                                  {item.quantity}
                                </motion.span>
                              </AnimatePresence>
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                disabled={item.quantity >= item.stock}
                                className="w-8 h-8 flex items-center justify-center text-sage-500 hover:text-forest-600 hover:bg-cream-200 transition-colors rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </motion.button>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.85 }}
                              onClick={() => removeItem(item.id)}
                              className="w-8 h-8 flex items-center justify-center text-sage-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            <AnimatePresence>
              {items.length > 0 && (
                <motion.div
                  key="footer"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.28 }}
                  className="border-t border-cream-200 px-6 py-5 space-y-4 bg-white"
                >
                  {/* Subtotal */}
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm text-sage-600">
                      Subtotal
                    </span>
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={total}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.2 }}
                        className="font-display text-xl font-semibold text-forest-700"
                      >
                        {formatPrice(total)}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  <p className="font-body text-xs text-sage-400">
                    {total >= freeShippingThreshold
                      ? "Free shipping applied ✓"
                      : `Shipping: ₹60 (free over ₹${freeShippingThreshold})`}
                  </p>

                  {/* CTA */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="flex items-center justify-center gap-2 w-full bg-forest-500 hover:bg-forest-400 text-white font-body font-medium tracking-widest uppercase text-xs py-4 rounded-full transition-all duration-200 group"
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>

                  <Link
                    href="/products"
                    onClick={closeCart}
                    className="block text-center font-body text-xs text-sage-400 hover:text-forest-500 transition-colors tracking-wide"
                  >
                    Continue Shopping
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
