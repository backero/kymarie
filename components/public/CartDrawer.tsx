"use client";

import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal } =
    useCart();
  const total = getTotal();
  const freeShippingThreshold = 599;
  const remainingForFreeShipping = freeShippingThreshold - total;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] rounded-l-3xl overflow-hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-cream-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-forest-500 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-cream-100" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-display text-lg font-medium text-forest-700 leading-none">
                Your Cart
              </h2>
              {items.length > 0 && (
                <span className="font-body text-xs text-sage-500">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={closeCart}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-cream-100 transition-colors text-sage-500 hover:text-forest-600"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Free shipping progress bar */}
        {items.length > 0 && remainingForFreeShipping > 0 && (
          <div className="px-6 py-3 bg-amber-50 border-b border-amber-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-body text-xs text-amber-700 font-medium">
                Add {formatPrice(remainingForFreeShipping)} more for free shipping
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="w-full h-1.5 bg-amber-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((total / freeShippingThreshold) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
        {items.length > 0 && remainingForFreeShipping <= 0 && (
          <div className="px-6 py-2.5 bg-forest-500/10 border-b border-forest-500/10 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-body text-xs text-forest-600 font-medium">
              You qualify for free shipping!
            </span>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 text-center py-16">
              <div className="w-24 h-24 rounded-3xl bg-cream-100 border-2 border-dashed border-cream-300 flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-sage-300" strokeWidth={1} />
              </div>
              <div>
                <p className="font-display text-xl text-forest-600 mb-1.5">
                  Your cart is empty
                </p>
                <p className="font-body text-sm text-sage-500 leading-relaxed max-w-[220px] mx-auto">
                  Discover our handcrafted natural soaps and start your ritual
                </p>
              </div>
              <Link
                href="/products"
                onClick={closeCart}
                className="inline-flex items-center gap-2 bg-forest-500 hover:bg-forest-600 text-cream-100 font-body font-medium tracking-widest uppercase text-xs py-3.5 px-6 rounded-full transition-all duration-300 group mt-2"
              >
                Explore Products
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          ) : (
            <ul className="space-y-1 divide-y divide-cream-100">
              {items.map((item) => (
                <li key={item.id} className="py-5 flex gap-4">
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
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-sage-500 hover:text-forest-600 hover:bg-cream-200 transition-colors rounded-full"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-body text-sm font-semibold text-forest-700">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-8 h-8 flex items-center justify-center text-sage-500 hover:text-forest-600 hover:bg-cream-200 transition-colors rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-8 h-8 flex items-center justify-center text-sage-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-cream-200 px-6 py-5 space-y-4 bg-white">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="font-body text-sm text-sage-600">Subtotal</span>
              <span className="font-display text-xl font-semibold text-forest-700">
                {formatPrice(total)}
              </span>
            </div>

            <p className="font-body text-xs text-sage-400">
              {total >= freeShippingThreshold
                ? "Free shipping applied ✓"
                : `Shipping: ₹60 (free over ₹${freeShippingThreshold})`}
            </p>

            {/* CTA */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex items-center justify-center gap-2 w-full bg-forest-500 hover:bg-forest-600 text-cream-100 font-body font-medium tracking-widest uppercase text-xs py-4 rounded-full transition-all duration-300 group shadow-lg shadow-forest-500/20"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/products"
              onClick={closeCart}
              className="block text-center font-body text-xs text-sage-400 hover:text-amber-600 transition-colors tracking-wide"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
