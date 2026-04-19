"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import type { Product } from "@/types";
import toast from "react-hot-toast";

export function ProductDetailClient({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem, openCart } = useCart();

  const discount = product.comparePrice
    ? calculateDiscount(product.price, product.comparePrice)
    : 0;

  const handleAddToCart = () => {
    if (added) return;
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
    setAdded(true);
    toast.success(`${quantity} × ${product.name} added to cart`);
    setTimeout(() => {
      setAdded(false);
      openCart();
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-5"
    >
      {/* Price */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-baseline gap-3"
      >
        <span className="font-display text-4xl font-medium text-forest-700">
          {formatPrice(product.price)}
        </span>
        {product.comparePrice && product.comparePrice > product.price && (
          <>
            <span className="font-body text-xl text-sage-400 line-through">
              {formatPrice(product.comparePrice)}
            </span>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2, type: "spring", stiffness: 300 }}
              className="bg-amber-100 text-amber-700 text-sm font-body font-medium px-2.5 py-0.5 rounded-full"
            >
              Save {discount}%
            </motion.span>
          </>
        )}
      </motion.div>

      {/* Weight */}
      {product.weight && (
        <p className="font-body text-sm text-sage-500">
          Net weight: {product.weight}g
        </p>
      )}

      {/* Quantity Selector */}
      {product.stock > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-4"
        >
          <label className="font-body text-sm text-sage-600">Quantity</label>
          <div className="flex items-center border border-cream-300 rounded-lg overflow-hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center text-sage-500 hover:text-forest-600 hover:bg-cream-100 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </motion.button>
            <AnimatePresence mode="wait">
              <motion.span
                key={quantity}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="w-12 text-center font-body font-medium text-forest-700"
              >
                {quantity}
              </motion.span>
            </AnimatePresence>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="w-10 h-10 flex items-center justify-center text-sage-500 hover:text-forest-600 hover:bg-cream-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>
          <span className="font-body text-xs text-sage-400">
            {product.stock} available
          </span>
        </motion.div>
      )}

      {/* Add to Cart Button */}
      <motion.button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        whileHover={product.stock > 0 && !added ? { scale: 1.01 } : {}}
        whileTap={product.stock > 0 && !added ? { scale: 0.98 } : {}}
        transition={{ duration: 0.14, ease: "easeInOut" }}
        className={`relative w-full overflow-hidden flex items-center justify-center gap-3 py-4 font-body font-medium tracking-widest uppercase text-sm transition-all duration-400 ${
          product.stock === 0
            ? "bg-sage-200 text-sage-500 cursor-not-allowed"
            : added
            ? "bg-amber-500 text-white"
            : "bg-forest-500 hover:bg-forest-600 text-cream-100"
        }`}
      >
        {/* Shimmer effect on hover */}
        {product.stock > 0 && !added && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            whileHover={{ x: "100%", opacity: 0.15 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-white skew-x-12 pointer-events-none"
          />
        )}

        <AnimatePresence mode="wait">
          {added ? (
            <motion.span
              key="added"
              initial={{ opacity: 0, scale: 0.8, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3"
            >
              <Check className="w-5 h-5" strokeWidth={2} />
              Added to Cart!
            </motion.span>
          ) : (
            <motion.span
              key="default"
              initial={{ opacity: 0, scale: 0.8, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {product.stock > 0 && product.stock <= 5 && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="font-body text-sm text-amber-600 text-center font-medium"
        >
          ⚡ Only {product.stock} left in stock — order soon!
        </motion.p>
      )}
    </motion.div>
  );
}
