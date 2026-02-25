"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star, Leaf } from "lucide-react";
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

  return (
    <article
      className={cn(
        "group relative flex flex-col bg-white border border-cream-300 overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-0.5",
        className
      )}
    >
      {/* Image Container */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[4/5] overflow-hidden bg-cream-200 block"
      >
        <Image
          src={product.thumbnail || product.images[0] || "/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-forest-500 text-cream-100 text-xs font-body font-medium tracking-wider uppercase px-2 py-0.5">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="bg-amber-500 text-white text-xs font-body font-medium tracking-wider uppercase px-2 py-0.5">
              -{discount}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-sage-600 text-cream-100 text-xs font-body font-medium tracking-wider uppercase px-2 py-0.5">
              Sold Out
            </span>
          )}
        </div>

        {/* Quick Add (appears on hover) */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 font-body text-xs font-medium tracking-widest uppercase transition-colors duration-200",
              product.stock === 0
                ? "bg-sage-300 text-white cursor-not-allowed"
                : "bg-forest-600 hover:bg-amber-600 text-cream-100"
            )}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4">
        {/* Category */}
        <div className="flex items-center gap-1.5 mb-2">
          <Leaf className="w-3 h-3 text-sage-400" strokeWidth={1.5} />
          <span className="font-body text-xs text-sage-500 tracking-wider uppercase">
            {product.category.name}
          </span>
        </div>

        {/* Name */}
        <Link
          href={`/products/${product.slug}`}
          className="font-display text-base font-medium text-forest-700 hover:text-amber-600 transition-colors duration-200 leading-snug mb-1 line-clamp-2"
        >
          {product.name}
        </Link>

        {/* Short desc */}
        {product.shortDesc && (
          <p className="font-body text-xs text-sage-500 line-clamp-2 mb-3 leading-relaxed">
            {product.shortDesc}
          </p>
        )}

        {/* Price */}
        <div className="mt-auto flex items-center gap-2">
          <span className="font-display text-lg font-medium text-forest-700">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="font-body text-sm text-sage-400 line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>

        {/* Stock indicator */}
        {product.stock > 0 && product.stock <= 10 && (
          <p className="font-body text-xs text-amber-600 mt-1.5">
            Only {product.stock} left
          </p>
        )}
      </div>
    </article>
  );
}

// Skeleton loader for product card
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-cream-300 overflow-hidden">
      <div className="aspect-[4/5] skeleton" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-16 skeleton rounded" />
        <div className="h-4 w-full skeleton rounded" />
        <div className="h-3 w-4/5 skeleton rounded" />
        <div className="h-5 w-20 skeleton rounded mt-2" />
      </div>
    </div>
  );
}
