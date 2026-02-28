import Link from "next/link";
import Image from "next/image";
import { getAllProductsAdmin } from "@/actions/products";
import { formatPrice, formatDate } from "@/lib/utils";
import { Plus, Edit, Package } from "lucide-react";
import { DeleteProductButton, ToggleProductButton } from "./ProductActions";

export default async function AdminProductsPage() {
  const products = await getAllProductsAdmin();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-neutral-900">
            Products
          </h1>
          <p className="font-body text-sm text-neutral-500 mt-1">
            {products.length} products total
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-forest-500 hover:bg-forest-600 text-white font-body text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-forest-500/20"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-6">
            <div className="w-20 h-20 rounded-3xl bg-neutral-100 flex items-center justify-center mb-4">
              <Package className="w-10 h-10 text-neutral-300" strokeWidth={1} />
            </div>
            <p className="font-display text-xl text-neutral-500 mb-2">
              No products yet
            </p>
            <p className="font-body text-sm text-neutral-400 mb-6">
              Start by adding your first product
            </p>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 bg-forest-500 text-white font-body text-sm font-medium px-5 py-2.5 rounded-xl"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/60">
                  {["Product", "Category", "Price", "Stock", "Status", "Created", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3.5 font-body text-[11px] font-semibold tracking-wider uppercase text-neutral-400 first:pl-5 last:text-right"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-neutral-50/50 transition-colors group"
                  >
                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                          {product.thumbnail ? (
                            <Image
                              src={product.thumbnail}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="44px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-neutral-300" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-body text-sm font-semibold text-neutral-800 truncate max-w-[180px] group-hover:text-amber-600 transition-colors">
                            {product.name}
                          </p>
                          <p className="font-body text-xs text-neutral-400 mt-0.5 truncate max-w-[180px]">
                            {product.sku || "—"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="font-body text-xs font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
                        {product.category.name}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4">
                      <p className="font-body text-sm font-semibold text-neutral-800">
                        {formatPrice(product.price)}
                      </p>
                      {product.comparePrice && (
                        <p className="font-body text-xs text-neutral-400 line-through mt-0.5">
                          {formatPrice(product.comparePrice)}
                        </p>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4">
                      <span
                        className={`font-body text-sm font-semibold ${
                          product.stock === 0
                            ? "text-red-500"
                            : product.stock <= 10
                            ? "text-amber-600"
                            : "text-neutral-700"
                        }`}
                      >
                        {product.stock}
                        {product.stock <= 10 && product.stock > 0 && (
                          <span className="font-normal text-xs ml-1 text-neutral-400">low</span>
                        )}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-body font-semibold px-2.5 py-1 rounded-full w-fit ${
                            product.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              product.isActive ? "bg-green-500" : "bg-neutral-400"
                            }`}
                          />
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                        {product.isFeatured && (
                          <span className="inline-block text-[10px] font-body font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 w-fit">
                            Featured
                          </span>
                        )}
                        {product.isNew && (
                          <span className="inline-block text-[10px] font-body font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 w-fit">
                            New
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Created */}
                    <td className="px-5 py-4">
                      <span className="font-body text-xs text-neutral-400">
                        {formatDate(product.createdAt)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ToggleProductButton
                          id={product.id}
                          isActive={product.isActive}
                        />
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <Edit className="w-4 h-4" strokeWidth={1.5} />
                        </Link>
                        <DeleteProductButton id={product.id} name={product.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
