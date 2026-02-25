import { getCategories } from "@/actions/products";
import { ProductForm } from "@/components/admin/ProductForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="flex items-center gap-2 font-body text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
      </div>

      <div>
        <h1 className="font-display text-3xl font-medium text-gray-800">
          Add New Product
        </h1>
        <p className="font-body text-sm text-gray-500 mt-1">
          Create a new product listing for the Kumarie store
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
