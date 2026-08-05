import { CategoryForm } from "@/components/admin/CategoryForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/categories"
          className="flex items-center gap-2 font-body text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </Link>
      </div>

      <div>
        <h1 className="font-display text-3xl font-medium text-gray-800">
          Add New Category
        </h1>
        <p className="font-body text-sm text-gray-500 mt-1">
          Create a new product category for the Kumarie store
        </p>
      </div>

      <CategoryForm />
    </div>
  );
}
