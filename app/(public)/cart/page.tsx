"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingBag, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";

const SHIPPING_THRESHOLD = 599;
const SHIPPING_FEE = 60;

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getSubtotal } = useCart();
  const subtotal = getSubtotal();
  const shippingFee = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  return (
    <div className="min-h-screen bg-cream-100 pt-20">
      {/* Header */}
      <div className="bg-white border-b border-cream-300 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 font-body text-sm text-sage-500 hover:text-forest-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue shopping
          </Link>
          <h1 className="font-display text-4xl font-light text-forest-700">
            Your Cart
            {items.length > 0 && (
              <span className="font-body text-lg font-normal text-sage-500 ml-3">
                ({items.length} {items.length === 1 ? "item" : "items"})
              </span>
            )}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {items.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-cream-200 flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-sage-300" strokeWidth={1} />
            </div>
            <h2 className="font-display text-3xl text-forest-600 mb-2">
              Your cart is empty
            </h2>
            <p className="font-body text-sage-500 mb-8">
              Discover our handcrafted soap collection
            </p>
            <Link href="/products" className="btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-5 bg-white border border-cream-300 p-4 md:p-6"
                >
                  {/* Image */}
                  <Link href={`/products/${item.slug}`} className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 overflow-hidden bg-cream-200 img-zoom">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-display text-lg font-medium text-forest-700 hover:text-amber-600 transition-colors"
                        >
                          {item.name}
                        </Link>
                        <p className="font-body text-sm text-sage-500 mt-0.5">
                          {formatPrice(item.price)} each
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-sage-400 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex items-center border border-cream-300">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-9 h-9 flex items-center justify-center text-sage-500 hover:text-forest-600 hover:bg-cream-100 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center font-body text-sm font-medium text-forest-700">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-9 h-9 flex items-center justify-center text-sage-500 hover:text-forest-600 hover:bg-cream-100 transition-colors disabled:opacity-40"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <p className="font-display text-xl font-medium text-forest-700">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear cart */}
              <div className="flex justify-end">
                <button
                  onClick={clearCart}
                  className="font-body text-xs text-sage-400 hover:text-red-500 transition-colors tracking-wide"
                >
                  Clear all items
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-cream-300 p-6 sticky top-24">
                <h2 className="font-display text-xl font-medium text-forest-700 mb-6 pb-4 border-b border-cream-300">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between font-body text-sm">
                    <span className="text-sage-600">Subtotal</span>
                    <span className="text-forest-700 font-medium">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-body text-sm">
                    <span className="text-sage-600">Shipping</span>
                    <span
                      className={
                        shippingFee === 0 ? "text-forest-500 font-medium" : "text-forest-700 font-medium"
                      }
                    >
                      {shippingFee === 0 ? "Free" : formatPrice(shippingFee)}
                    </span>
                  </div>
                  {shippingFee > 0 && (
                    <p className="font-body text-xs text-amber-600 bg-amber-50 px-3 py-2">
                      Add {formatPrice(SHIPPING_THRESHOLD - subtotal)} more for free shipping
                    </p>
                  )}
                </div>

                <div className="border-t border-cream-300 pt-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-body font-semibold text-forest-700">
                      Total
                    </span>
                    <span className="font-display text-2xl font-medium text-forest-700">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <p className="font-body text-xs text-sage-400 mt-1">
                    Including all taxes
                  </p>
                </div>

                <Link
                  href="/checkout"
                  className="flex items-center justify-center gap-2 w-full bg-forest-500 hover:bg-forest-600 text-cream-100 font-body font-medium tracking-widest uppercase text-xs py-4 transition-colors duration-300 group"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
