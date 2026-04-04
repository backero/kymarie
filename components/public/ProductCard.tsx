"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Heart, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useCart } from "@/hooks/useCart";
import { toggleWishlist } from "@/actions/wishlist";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
  className?: string;
  initialWishlisted?: boolean;
}

export function ProductCard({ product, className, initialWishlisted = false }: ProductCardProps) {
  const { addItem } = useCart();
  const { data: session } = useSession();
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const discount = product.comparePrice
    ? calculateDiscount(product.price, product.comparePrice)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.thumbnail || product.images[0] || "/placeholder.jpg",
      slug: product.slug,
      stock: product.stock,
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session || session.user?.role !== "user") {
      toast.error("Sign in to save products to your wishlist");
      return;
    }

    if (wishlistLoading) return;
    setWishlistLoading(true);

    try {
      const result = await toggleWishlist(session.user.id, product.id);
      setIsWishlisted(result.added);
      toast.success(result.added ? "Added to wishlist" : "Removed from wishlist");
    } catch {
      toast.error("Failed to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex flex-col bg-white rounded-xl overflow-hidden border border-cream-300",
        "hover:border-cream-400 hover:shadow-md transition-all duration-300",
        className
      )}
    >
      {/* Image Container */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[4/5] overflow-hidden bg-cream-100 block"
      >
        {product.thumbnail || product.images?.[0] ? (
          <Image
            src={product.thumbnail || product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-cream-100 gap-3">
            <div className="w-14 h-14 rounded-full bg-cream-200 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-sage-300" strokeWidth={1.5} />
            </div>
            <span className="font-body text-[10px] tracking-widest uppercase text-sage-300">
              Photo coming soon
            </span>
          </div>
        )}

        {/* Pill Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="bg-forest-500 text-white text-[10px] font-body font-medium tracking-wider uppercase px-2.5 py-1 rounded-full"
            >
              New
            </motion.span>
          )}
          {discount > 0 && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-amber-500 text-white text-[10px] font-body font-medium tracking-wider uppercase px-2.5 py-1 rounded-full"
            >
              -{discount}%
            </motion.span>
          )}
          {product.stock === 0 && (
            <span className="bg-sage-500 text-cream-100 text-[10px] font-body font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist button — appears on hover */}
        <motion.button
          onClick={handleWishlist}
          disabled={wishlistLoading}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.88 }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white border border-cream-300 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isWishlisted ? "filled" : "empty"}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              <Heart
                className={cn(
                  "w-4 h-4 transition-colors duration-200",
                  isWishlisted ? "text-red-500 fill-red-500" : "text-sage-500"
                )}
              />
            </motion.div>
          </AnimatePresence>
        </motion.button>

        {/* Quick Add — slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-350 ease-out">
          <motion.button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            whileTap={product.stock > 0 ? { scale: 0.97 } : undefined}
            className={cn(
              "w-full flex items-center justify-center gap-2.5 py-3.5 font-body text-xs font-semibold tracking-widest uppercase transition-all duration-200",
              product.stock === 0
                ? "bg-sage-400 text-white cursor-not-allowed"
                : "bg-forest-500 hover:bg-forest-400 text-white"
            )}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {product.stock === 0 ? "Out of Stock" : "Quick Add"}
          </motion.button>
        </div>
      </Link>

      {/* Card Content */}
      <div className="flex-1 flex flex-col p-4">
        {/* Category pill */}
        <span className="font-body text-[10px] text-sage-400 tracking-widest uppercase mb-2.5">
          {product.category.name}
        </span>

        {/* Product name */}
        <Link
          href={`/products/${product.slug}`}
          className="font-display text-[15px] font-medium text-forest-500 hover:text-amber-500 transition-colors duration-200 leading-snug mb-2 line-clamp-2"
        >
          {product.name}
        </Link>

        {/* Short description */}
        {product.shortDesc && (
          <p className="font-body text-xs text-sage-500 line-clamp-2 mb-3 leading-relaxed">
            {product.shortDesc}
          </p>
        )}

        {/* Price + stock row */}
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg font-semibold text-forest-700">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="font-body text-sm text-sage-400 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          {product.stock > 0 && product.stock <= 10 && (
            <span className="font-body text-[10px] text-sage-500 font-medium bg-cream-200 border border-cream-300 px-2 py-0.5 rounded-full whitespace-nowrap">
              {product.stock} left
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// Skeleton loader with stagger-aware animation
export function ProductCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="flex flex-col bg-white rounded-xl overflow-hidden border border-cream-300"
    >
      <div className="aspect-[4/5] skeleton" />
      <div className="p-4 space-y-2.5">
        <div className="h-3 w-16 skeleton rounded-full" />
        <div className="h-4 w-full skeleton rounded-full" />
        <div className="h-3 w-4/5 skeleton rounded-full" />
        <div className="h-5 w-24 skeleton rounded-full mt-2" />
      </div>
    </motion.div>
  );
}
