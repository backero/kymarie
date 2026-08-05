import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCategoryById } from "@/actions/categories";
import { CategoryForm } from "@/components/admin/CategoryForm";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-2 font-body text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Categories
      </Link>

      <div>
        <h1 className="font-display text-3xl font-medium text-gray-800">
          Edit Category
        </h1>
        <p className="font-body text-sm text-gray-500 mt-1">{category.name}</p>
      </div>

      <CategoryForm category={category} />
    </div>
  );
}
