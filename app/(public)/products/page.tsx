import { Suspense } from "react";
import { getProducts, getCategories } from "@/actions/products";
import { ProductCard, ProductCardSkeleton } from "@/components/public/ProductCard";
import { AnimatedProductsHeader, AnimatedProductsFilter, AnimatedProductGrid } from "./ProductsClient";
import type { Product } from "@/types";
import type { Metadata } from "next";
import { Search as SearchIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Shop All Natural Soaps",
  description:
    "Browse Kumarie's full collection of handcrafted natural soaps. From brightening rose & saffron to purifying neem & turmeric.",
};

interface SearchParams {
  category?: string;
  search?: string;
  page?: string;
  sort?: string;
}

async function ProductGrid({ searchParams }: { searchParams: SearchParams }) {
  const { category, search, page = "1" } = searchParams;

  const { products, total, totalPages, page: currentPage } = await getProducts({
    category,
    search,
    page: parseInt(page),
    limit: 12,
  });

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-center">
        <div className="w-16 h-16 rounded-full bg-cream-200 border border-cream-300 flex items-center justify-center mb-5">
          <SearchIcon className="w-7 h-7 text-sage-300" strokeWidth={1.2} />
        </div>
        <h3 className="font-display text-2xl font-light text-forest-500 mb-2">
          Nothing found
        </h3>
        <p className="font-body text-sm text-sage-400 mb-6">
          Try a different keyword or browse all products.
        </p>
        <a
          href="/products"
          className="font-body text-xs tracking-widest uppercase text-sage-400 hover:text-forest-500 border-b border-sage-300 hover:border-forest-400 pb-0.5 transition-colors"
        >
          Clear filters
        </a>
      </div>
    );
  }

  return (
    <div>
      {/* Result count */}
      <p className="font-body text-xs text-sage-400 mb-6 tracking-wide">
        Showing{" "}
        <span className="text-forest-700 font-medium">{products.length}</span>{" "}
        of <span className="text-forest-700 font-medium">{total}</span>{" "}
        products
      </p>

      {/* Staggered grid */}
      <AnimatedProductGrid>
        {products.map((product) => (
          <ProductCard key={product.id} product={product as Product} />
        ))}
      </AnimatedProductGrid>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-14">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/products?${new URLSearchParams({
                ...(category && { category }),
                ...(search && { search }),
                page: p.toString(),
              }).toString()}`}
              className={`w-9 h-9 flex items-center justify-center font-body text-xs transition-all duration-200 ${
                p === currentPage
                  ? "bg-forest-500 text-cream-100"
                  : "border border-cream-300 text-sage-500 hover:border-forest-400 hover:text-forest-500"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-cream-100 pt-20">
      <AnimatedProductsHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Sidebar */}
          <AnimatedProductsFilter params={params} categories={categories} />

          {/* Grid */}
          <div className="flex-1 min-w-0">
            <Suspense
              fallback={
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                  {[...Array(6)].map((_, i) => (
                    <ProductCardSkeleton key={i} index={i} />
                  ))}
                </div>
              }
            >
              <ProductGrid searchParams={params} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
