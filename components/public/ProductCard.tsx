"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

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

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((w) => !w);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 border border-cream-200",
        className
      )}
    >
      {/* Image Container */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[4/5] overflow-hidden bg-cream-100 block"
      >
        <Image
          src={product.thumbnail || product.images[0] || "/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Pill Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-forest-500 text-cream-100 text-[10px] font-body font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="bg-amber-500 text-white text-[10px] font-body font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
              -{discount}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-sage-500 text-cream-100 text-[10px] font-body font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist button — appears on hover */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors duration-200",
              isWishlisted ? "text-red-500 fill-red-500" : "text-sage-500"
            )}
          />
        </button>

        {/* Quick Add — slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-350 ease-out">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={cn(
              "w-full flex items-center justify-center gap-2.5 py-3.5 font-body text-xs font-semibold tracking-widest uppercase transition-all duration-200",
              product.stock === 0
                ? "bg-sage-400/90 text-white cursor-not-allowed backdrop-blur-sm"
                : "bg-forest-500/95 hover:bg-amber-600 text-cream-100 backdrop-blur-sm"
            )}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {product.stock === 0 ? "Out of Stock" : "Quick Add"}
          </button>
        </div>
      </Link>

      {/* Card Content */}
      <div className="flex-1 flex flex-col p-4">
        {/* Category pill */}
        <span className="font-body text-[10px] text-amber-600 tracking-widest uppercase font-semibold mb-2.5">
          {product.category.name}
        </span>

        {/* Product name */}
        <Link
          href={`/products/${product.slug}`}
          className="font-display text-[15px] font-medium text-forest-700 hover:text-amber-600 transition-colors duration-200 leading-snug mb-2 line-clamp-2"
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
            <span className="font-body text-[10px] text-amber-600 font-medium bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full whitespace-nowrap">
              {product.stock} left
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

// Skeleton loader
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-cream-200">
      <div className="aspect-[4/5] skeleton" />
      <div className="p-4 space-y-2.5">
        <div className="h-3 w-16 skeleton rounded-full" />
        <div className="h-4 w-full skeleton rounded-full" />
        <div className="h-3 w-4/5 skeleton rounded-full" />
        <div className="h-5 w-24 skeleton rounded-full mt-2" />
      </div>
    </div>
  );
}
