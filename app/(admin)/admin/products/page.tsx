import Link from "next/link";
import Image from "next/image";
import { getAllProductsAdmin } from "@/actions/products";
import { formatPrice, formatDate } from "@/lib/utils";
import { Plus, Edit, Trash2, Eye, EyeOff, Package } from "lucide-react";
import { DeleteProductButton, ToggleProductButton } from "./ProductActions";

export default async function AdminProductsPage() {
  const products = await getAllProductsAdmin();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-medium text-gray-800">
            Products
          </h1>
          <p className="font-body text-sm text-gray-500 mt-1">
            {products.length} products total
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-forest-500 hover:bg-forest-600 text-white font-body text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package className="w-16 h-16 text-gray-200 mb-4" strokeWidth={1} />
            <p className="font-display text-xl text-gray-400 mb-2">
              No products yet
            </p>
            <p className="font-body text-sm text-gray-400 mb-6">
              Start by adding your first product
            </p>
            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 bg-forest-500 text-white font-body text-sm px-4 py-2 rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3.5 font-body text-xs font-semibold tracking-wider uppercase text-gray-500">
                    Product
                  </th>
                  <th className="text-left px-5 py-3.5 font-body text-xs font-semibold tracking-wider uppercase text-gray-500">
                    Category
                  </th>
                  <th className="text-left px-5 py-3.5 font-body text-xs font-semibold tracking-wider uppercase text-gray-500">
                    Price
                  </th>
                  <th className="text-left px-5 py-3.5 font-body text-xs font-semibold tracking-wider uppercase text-gray-500">
                    Stock
                  </th>
                  <th className="text-left px-5 py-3.5 font-body text-xs font-semibold tracking-wider uppercase text-gray-500">
                    Status
                  </th>
                  <th className="text-left px-5 py-3.5 font-body text-xs font-semibold tracking-wider uppercase text-gray-500">
                    Created
                  </th>
                  <th className="text-right px-5 py-3.5 font-body text-xs font-semibold tracking-wider uppercase text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                          {product.thumbnail ? (
                            <Image
                              src={product.thumbnail}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-body text-sm font-medium text-gray-800 truncate max-w-[180px]">
                            {product.name}
                          </p>
                          <p className="font-body text-xs text-gray-400 truncate max-w-[180px]">
                            {product.sku}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="font-body text-sm text-gray-600">
                        {product.category.name}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-body text-sm font-medium text-gray-800">
                          {formatPrice(product.price)}
                        </p>
                        {product.comparePrice && (
                          <p className="font-body text-xs text-gray-400 line-through">
                            {formatPrice(product.comparePrice)}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4">
                      <span
                        className={`font-body text-sm font-medium ${
                          product.stock === 0
                            ? "text-red-500"
                            : product.stock <= 10
                            ? "text-amber-600"
                            : "text-gray-700"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-block text-xs font-body font-medium px-2 py-0.5 rounded-full ${
                            product.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                        {product.isFeatured && (
                          <span className="inline-block text-xs font-body font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Created */}
                    <td className="px-5 py-4">
                      <span className="font-body text-xs text-gray-400">
                        {formatDate(product.createdAt)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-forest-600 hover:bg-forest-50 rounded transition-colors"
                          title="View on site"
                        >
                          <Eye className="w-4 h-4" strokeWidth={1.5} />
                        </Link>
                        <ToggleProductButton
                          id={product.id}
                          isActive={product.isActive}
                        />
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
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
