"use client";

import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal } =
    useCart();
  const total = getTotal();

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-cream-100 z-50 flex flex-col shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-cream-300">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-forest-500" strokeWidth={1.5} />
            <h2 className="font-display text-xl font-medium text-forest-700">
              Your Cart
            </h2>
            {items.length > 0 && (
              <span className="text-sm font-body text-sage-500">
                ({items.length} {items.length === 1 ? "item" : "items"})
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-cream-200 transition-colors text-sage-500 hover:text-forest-600"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <div className="w-20 h-20 rounded-full bg-cream-200 flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-sage-400" strokeWidth={1} />
              </div>
              <div>
                <p className="font-display text-xl text-forest-600 mb-1">
                  Your cart is empty
                </p>
                <p className="font-body text-sm text-sage-500">
                  Discover our handcrafted soaps
                </p>
              </div>
              <Link
                href="/products"
                onClick={closeCart}
                className="btn-primary mt-2"
              >
                Explore Products
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-cream-300 space-y-0">
              {items.map((item) => (
                <li key={item.id} className="py-5 flex gap-4">
                  {/* Image */}
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeCart}
                    className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-cream-200 img-zoom"
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
                      className="font-display text-base font-medium text-forest-700 hover:text-amber-600 transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="font-body text-sm text-sage-500 mt-0.5">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity & Remove */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-cream-300 rounded">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center text-sage-500 hover:text-forest-600 hover:bg-cream-200 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-body text-sm font-medium text-forest-700">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.stock}
                          className="w-8 h-8 flex items-center justify-center text-sage-500 hover:text-forest-600 hover:bg-cream-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-8 h-8 flex items-center justify-center text-sage-400 hover:text-red-500 transition-colors"
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
          <div className="border-t border-cream-300 px-6 py-5 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="font-body text-sm text-sage-600 tracking-wide">
                Subtotal
              </span>
              <span className="font-display text-xl font-medium text-forest-700">
                {formatPrice(total)}
              </span>
            </div>
            <p className="font-body text-xs text-sage-400">
              Shipping calculated at checkout
            </p>

            {/* CTA */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex items-center justify-center gap-2 w-full bg-forest-500 hover:bg-forest-600 text-cream-100 font-body font-medium tracking-widest uppercase text-xs py-4 transition-all duration-300 group"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/products"
              onClick={closeCart}
              className="block text-center font-body text-xs text-sage-500 hover:text-amber-600 transition-colors tracking-wide"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
