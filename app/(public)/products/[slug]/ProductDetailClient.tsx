"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import type { Product } from "@/types";
import toast from "react-hot-toast";

export function ProductDetailClient({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCart();

  const discount = product.comparePrice
    ? calculateDiscount(product.price, product.comparePrice)
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.thumbnail || product.images[0] || "/placeholder.jpg",
        slug: product.slug,
        stock: product.stock,
      });
    }
    toast.success(`${quantity} × ${product.name} added to cart`);
    openCart();
  };

  return (
    <div className="space-y-5">
      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="font-display text-4xl font-medium text-forest-700">
          {formatPrice(product.price)}
        </span>
        {product.comparePrice && product.comparePrice > product.price && (
          <>
            <span className="font-body text-xl text-sage-400 line-through">
              {formatPrice(product.comparePrice)}
            </span>
            <span className="bg-amber-100 text-amber-700 text-sm font-body font-medium px-2 py-0.5">
              Save {discount}%
            </span>
          </>
        )}
      </div>

      {/* Weight */}
      {product.weight && (
        <p className="font-body text-sm text-sage-500">
          Net weight: {product.weight}g
        </p>
      )}

      {/* Quantity Selector */}
      {product.stock > 0 && (
        <div className="flex items-center gap-4">
          <label className="font-body text-sm text-sage-600">Quantity</label>
          <div className="flex items-center border border-cream-300">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center text-sage-500 hover:text-forest-600 hover:bg-cream-100 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-body font-medium text-forest-700">
              {quantity}
            </span>
            <button
              onClick={() =>
                setQuantity(Math.min(product.stock, quantity + 1))
              }
              className="w-10 h-10 flex items-center justify-center text-sage-500 hover:text-forest-600 hover:bg-cream-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="font-body text-xs text-sage-400">
            {product.stock} available
          </span>
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        className={`w-full flex items-center justify-center gap-3 py-4 font-body font-medium tracking-widest uppercase text-sm transition-all duration-300 ${
          product.stock === 0
            ? "bg-sage-200 text-sage-500 cursor-not-allowed"
            : "bg-forest-500 hover:bg-forest-600 text-cream-100 group"
        }`}
      >
        <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
      </button>

      {product.stock > 0 && product.stock <= 5 && (
        <p className="font-body text-sm text-amber-600 text-center font-medium">
          ⚡ Only {product.stock} left in stock — order soon!
        </p>
      )}
    </div>
  );
}
