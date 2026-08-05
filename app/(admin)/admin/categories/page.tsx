import Link from "next/link";
import { getCategoriesAdmin } from "@/actions/categories";
import { Plus, Edit, Tag } from "lucide-react";
import { DeleteCategoryButton } from "./CategoryActions";

export default async function AdminCategoriesPage() {
  const categories = await getCategoriesAdmin();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-neutral-900">
            Categories
          </h1>
          <p className="font-body text-sm text-neutral-500 mt-1">
            {categories.length} categories total
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 bg-forest-500 hover:bg-forest-600 text-white font-body text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm shadow-forest-500/20 hover:scale-105 hover:shadow-md hover:shadow-forest-500/20"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Link>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-neutral-200/70 overflow-hidden">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-6">
            <div className="w-20 h-20 rounded-3xl bg-neutral-100 flex items-center justify-center mb-4">
              <Tag className="w-10 h-10 text-neutral-300" strokeWidth={1} />
            </div>
            <p className="font-display text-xl text-neutral-500 mb-2">
              No categories yet
            </p>
            <p className="font-body text-sm text-neutral-400 mb-6">
              Create your first product category
            </p>
            <Link
              href="/admin/categories/new"
              className="inline-flex items-center gap-2 bg-forest-500 text-white font-body text-sm font-medium px-5 py-2.5 rounded-xl"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/60">
                  {["Name", "Slug", "Products", ""].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3.5 font-body text-[11px] font-semibold tracking-wider uppercase text-neutral-400 first:pl-5 last:text-right"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-neutral-50/50 transition-colors group border-b border-neutral-50 last:border-0"
                  >
                    <td className="px-5 py-4">
                      <span className="font-body text-sm font-semibold text-neutral-800">
                        {category.name}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-body text-xs text-neutral-400">
                        {category.slug}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-body text-sm text-neutral-600">
                        {category._count.products}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/admin/categories/${category.id}/edit`}
                          className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit category"
                        >
                          <Edit className="w-4 h-4" strokeWidth={1.5} />
                        </Link>
                        <DeleteCategoryButton id={category.id} name={category.name} />
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
