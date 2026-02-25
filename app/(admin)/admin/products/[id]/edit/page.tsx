import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProductById, getCategories } from "@/actions/products";
import { ProductForm } from "@/components/admin/ProductForm";
import type { Product } from "@/types";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 font-body text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <div>
        <h1 className="font-display text-3xl font-medium text-gray-800">
          Edit Product
        </h1>
        <p className="font-body text-sm text-gray-500 mt-1">
          {product.name}
        </p>
      </div>

      <ProductForm product={product as Product} categories={categories} />
    </div>
  );
}
