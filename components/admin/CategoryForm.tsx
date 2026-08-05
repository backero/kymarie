"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { createCategory, updateCategory } from "@/actions/categories";
import toast from "react-hot-toast";

const categoryFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  image: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

interface Category {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
}

export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      image: category?.image || "",
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: data.name,
        description: data.description || null,
        image: data.image || null,
      };

      const result = category
        ? await updateCategory(category.id, payload)
        : await createCategory(payload);

      if (result.success) {
        toast.success(category ? "Category updated successfully!" : "Category created successfully!");
        router.push("/admin/categories");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to save category");
      }
    } catch (error) {
      console.error("Form error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5 max-w-xl">
        <div>
          <label className="font-body text-xs font-medium tracking-wider uppercase text-gray-600 block mb-2">
            Category Name *
          </label>
          <input
            {...register("name")}
            className="w-full border border-gray-200 px-4 py-2.5 font-body text-sm text-gray-800 focus:outline-none focus:border-forest-400 rounded bg-gray-50"
            placeholder="Herbal & Ayurvedic"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1 font-body">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="font-body text-xs font-medium tracking-wider uppercase text-gray-600 block mb-2">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={3}
            className="w-full border border-gray-200 px-4 py-2.5 font-body text-sm text-gray-800 focus:outline-none focus:border-forest-400 rounded bg-gray-50"
            placeholder="Optional short description"
          />
        </div>

        <div>
          <label className="font-body text-xs font-medium tracking-wider uppercase text-gray-600 block mb-2">
            Image URL
          </label>
          <input
            {...register("image")}
            className="w-full border border-gray-200 px-4 py-2.5 font-body text-sm text-gray-800 focus:outline-none focus:border-forest-400 rounded bg-gray-50"
            placeholder="https://res.cloudinary.com/..."
          />
        </div>
      </div>

      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-6 py-4 max-w-xl">
        <button
          type="button"
          onClick={() => router.push("/admin/categories")}
          className="font-body text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-forest-500 hover:bg-forest-600 disabled:bg-gray-300 text-white font-body font-medium text-sm px-6 py-2.5 rounded-lg transition-colors"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Saving..." : category ? "Update Category" : "Create Category"}
        </button>
      </div>
    </form>
  );
}
