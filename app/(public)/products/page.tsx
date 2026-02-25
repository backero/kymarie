import { Suspense } from "react";
import { getProducts, getCategories } from "@/actions/products";
import { ProductCard, ProductCardSkeleton } from "@/components/public/ProductCard";
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product as Product} />
        ))}
      </div>

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
              className={`w-10 h-10 flex items-center justify-center font-body text-sm transition-colors ${
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
      {/* Page Header */}
      <div className="bg-white border-b border-cream-300 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-amber-400" />
            <span className="font-body text-xs tracking-widest uppercase text-amber-600">
              All Products
            </span>
            <div className="h-px w-10 bg-amber-400" />
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-light text-forest-700 mb-3">
            The Collection
          </h1>
          <p className="font-body text-sage-500 max-w-xl mx-auto">
            Every bar is a unique ritual — handcrafted in small batches with the finest
            natural ingredients.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-60 flex-shrink-0">
            <div className="bg-white border border-cream-300 p-6 sticky top-24">
              {/* Search */}
              <div className="mb-6">
                <label className="font-body text-xs font-semibold tracking-widest uppercase text-sage-500 mb-3 block">
                  Search
                </label>
                <form method="GET" action="/products">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-400" />
                    <input
                      type="text"
                      name="search"
                      defaultValue={params.search}
                      placeholder="Search products..."
                      className="w-full pl-9 pr-3 py-2.5 border border-cream-300 font-body text-sm focus:outline-none focus:border-forest-400 text-forest-700 placeholder-sage-400 bg-cream-50"
                    />
                  </div>
                  {params.category && (
                    <input type="hidden" name="category" value={params.category} />
                  )}
                  <button
                    type="submit"
                    className="w-full mt-2 bg-forest-500 text-cream-100 font-body text-xs font-medium tracking-widest uppercase py-2 hover:bg-forest-600 transition-colors"
                  >
                    Search
                  </button>
                </form>
              </div>

              {/* Categories */}
              <div>
                <label className="font-body text-xs font-semibold tracking-widest uppercase text-sage-500 mb-3 block">
                  Category
                </label>
                <ul className="space-y-1">
                  <li>
                    <a
                      href="/products"
                      className={`flex items-center justify-between w-full px-3 py-2 font-body text-sm transition-colors ${
                        !params.category
                          ? "bg-forest-500 text-cream-100"
                          : "text-forest-600 hover:bg-cream-100"
                      }`}
                    >
                      All Products
                    </a>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <a
                        href={`/products?category=${cat.slug}`}
                        className={`flex items-center justify-between w-full px-3 py-2 font-body text-sm transition-colors ${
                          params.category === cat.slug
                            ? "bg-forest-500 text-cream-100"
                            : "text-forest-600 hover:bg-cream-100"
                        }`}
                      >
                        {cat.name}
                        <span className="text-xs opacity-60">
                          {(cat as typeof cat & { _count: { products: number } })._count?.products}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <Suspense
              fallback={
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {[...Array(6)].map((_, i) => (
                    <ProductCardSkeleton key={i} />
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
