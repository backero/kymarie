import { Suspense } from "react";
import { getProducts, getCategories } from "@/actions/products";
import { ProductCard, ProductCardSkeleton } from "@/components/public/ProductCard";
import { AnimatedProductsHeader, AnimatedProductsFilter, AnimatedProductGrid } from "./ProductsClient";
import type { Product } from "@/types";
import type { Metadata } from "next";
import { Filter, Search as SearchIcon } from "lucide-react";

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
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-cream-200 flex items-center justify-center mb-4">
          <SearchIcon className="w-10 h-10 text-sage-300" strokeWidth={1} />
        </div>
        <h3 className="font-display text-2xl text-forest-600 mb-2">No products found</h3>
        <p className="font-body text-sage-500 text-sm">
          Try adjusting your filters or search term
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="font-body text-sm text-sage-500">
          Showing <span className="text-forest-700 font-medium">{products.length}</span> of{" "}
          <span className="text-forest-700 font-medium">{total}</span> products
        </p>
      </div>

      {/* Animated stagger grid */}
      <AnimatedProductGrid>
        {products.map((product) => (
          <ProductCard key={product.id} product={product as Product} />
        ))}
      </AnimatedProductGrid>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/products?${new URLSearchParams({
                ...(category && { category }),
                ...(search && { search }),
                page: p.toString(),
              }).toString()}`}
              className={`w-10 h-10 flex items-center justify-center font-body text-sm transition-all duration-200 hover:scale-110 ${
                p === currentPage
                  ? "bg-forest-500 text-cream-100"
                  : "border border-cream-300 text-forest-600 hover:border-forest-400"
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
      {/* Animated Page Header */}
      <AnimatedProductsHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters — slide in from left */}
          <AnimatedProductsFilter params={params} categories={categories} />

          {/* Product Grid */}
          <div className="flex-1">
            <Suspense
              fallback={
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
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
