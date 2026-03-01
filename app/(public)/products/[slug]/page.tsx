import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getProducts } from "@/actions/products";
import { ProductDetailClient } from "./ProductDetailClient";
import { ProductImageGallery } from "./ProductImageGallery";
import { ProductCard } from "@/components/public/ProductCard";
import type { Product } from "@/types";
import { Leaf, Star, Shield, Truck, RefreshCw } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.metaTitle || product.name,
    description: product.metaDesc || product.shortDesc || product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.shortDesc || product.description.slice(0, 160),
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const { products: relatedProducts } = await getProducts({
    category: product.category.slug,
    limit: 4,
  });

  const related = relatedProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-cream-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Images */}
          <ProductImageGallery
            images={product.images}
            productName={product.name}
            isNew={product.isNew}
          />

          {/* Product Info */}
          <div>
            {/* Category */}
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="w-4 h-4 text-sage-400" strokeWidth={1.5} />
              <a
                href={`/products?category=${product.category.slug}`}
                className="font-body text-xs tracking-widest uppercase text-sage-500 hover:text-amber-600 transition-colors"
              >
                {product.category.name}
              </a>
            </div>

            <h1 className="font-display text-4xl md:text-5xl font-medium text-forest-700 leading-tight mb-4">
              {product.name}
            </h1>

            {/* Rating placeholder */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="font-body text-sm text-sage-500">(24 reviews)</span>
            </div>

            {/* Short Description */}
            {product.shortDesc && (
              <p className="font-body text-sage-600 text-base leading-relaxed mb-6 border-l-2 border-amber-400 pl-4 italic">
                {product.shortDesc}
              </p>
            )}

            {/* Client component for add to cart, etc. */}
            <ProductDetailClient product={product as Product} />

            {/* Benefits */}
            {product.benefits.length > 0 && (
              <div className="mt-6">
                <p className="font-body text-xs font-semibold tracking-widest uppercase text-sage-500 mb-3">
                  Key Benefits
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.benefits.map((benefit) => (
                    <span key={benefit} className="tag">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping info */}
            <div className="mt-8 border-t border-cream-300 pt-6 space-y-3">
              {[
                { icon: Truck, text: "Free shipping on orders above ₹599" },
                { icon: Shield, text: "100% natural & ethically sourced ingredients" },
                { icon: RefreshCw, text: "Easy 7-day returns if not satisfied" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-amber-500 flex-shrink-0" strokeWidth={1.5} />
                  <span className="font-body text-sm text-sage-600">{text}</span>
                </div>
              ))}
            </div>

            {/* Ingredients */}
            {product.ingredients && (
              <details className="mt-6 border-t border-cream-300 pt-4">
                <summary className="font-body text-sm font-medium text-forest-700 cursor-pointer hover:text-amber-600 transition-colors">
                  Ingredients
                </summary>
                <p className="font-body text-xs text-sage-500 mt-3 leading-relaxed">
                  {product.ingredients}
                </p>
              </details>
            )}

            {/* How to use */}
            {product.howToUse && (
              <details className="mt-2 border-t border-cream-300 pt-4">
                <summary className="font-body text-sm font-medium text-forest-700 cursor-pointer hover:text-amber-600 transition-colors">
                  How to Use
                </summary>
                <p className="font-body text-xs text-sage-500 mt-3 leading-relaxed">
                  {product.howToUse}
                </p>
              </details>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20 pt-16 border-t border-cream-300">
            <div className="flex items-center gap-3 mb-10">
              <div className="h-px w-10 bg-amber-400" />
              <h2 className="font-display text-3xl font-light text-forest-700">
                You might also love
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p as Product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
