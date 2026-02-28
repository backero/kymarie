"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Plus, X, Upload, Loader2, Link as LinkIcon } from "lucide-react";
import { createProduct, updateProduct } from "@/actions/products";
import { generateSlug } from "@/lib/utils";
import type { Product } from "@/types";
import toast from "react-hot-toast";

const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Description is required"),
  shortDesc: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  comparePrice: z.coerce.number().optional().nullable(),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  sku: z.string().optional(),
  weight: z.coerce.number().optional().nullable(),
  categoryId: z.string().min(1, "Category is required"),
  ingredients: z.string().optional(),
  howToUse: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [benefits, setBenefits] = useState<string[]>(product?.benefits || []);
  const [tagInput, setTagInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageTab, setImageTab] = useState<"url" | "file">("url");
  const [urlInput, setUrlInput] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      shortDesc: product?.shortDesc || "",
      price: product?.price || 0,
      comparePrice: product?.comparePrice || null,
      stock: product?.stock || 0,
      sku: product?.sku || "",
      weight: product?.weight || null,
      categoryId: product?.categoryId || "",
      ingredients: product?.ingredients || "",
      howToUse: product?.howToUse || "",
      isActive: product?.isActive ?? true,
      isFeatured: product?.isFeatured ?? false,
      isNew: product?.isNew ?? false,
      metaTitle: product?.metaTitle || "",
      metaDesc: product?.metaDesc || "",
    },
  });

  const handleAddUrl = async () => {
    const url = urlInput.trim();
    if (!url) return;
    try { new URL(url); } catch {
      toast.error("Please enter a valid URL");
      return;
    }
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls: [url] }),
    });
    const data = await res.json();
    if (data.success) {
      setImages((prev) => [...prev, ...data.urls]);
      setUrlInput("");
      toast.success("Image added");
    } else {
      toast.error(data.error || "Failed to add image");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImages((prev) => [...prev, ...data.urls]);
        toast.success("Images uploaded successfully");
      } else {
        toast.error(data.error || "Upload failed — try URL mode instead");
      }
    } catch {
      toast.error("Upload error");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags((prev) => [...prev, tag]);
    }
    setTagInput("");
  };

  const addBenefit = () => {
    const benefit = benefitInput.trim();
    if (benefit && !benefits.includes(benefit)) {
      setBenefits((prev) => [...prev, benefit]);
    }
    setBenefitInput("");
  };

  const onSubmit = async (data: ProductFormData) => {
    if (images.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        images,
        thumbnail: images[0],
        tags,
        benefits,
        comparePrice: data.comparePrice || undefined,
        weight: data.weight || undefined,
        sku: data.sku || undefined,
        shortDesc: data.shortDesc || undefined,
        ingredients: data.ingredients || undefined,
        howToUse: data.howToUse || undefined,
        metaTitle: data.metaTitle || undefined,
        metaDesc: data.metaDesc || undefined,
      };

      const result = product
        ? await updateProduct(product.id, payload)
        : await createProduct(payload);

      if (result.success) {
        toast.success(
          product ? "Product updated successfully!" : "Product created successfully!"
        );
        router.push("/admin/products");
        router.refresh();
      } else {
        toast.error("Failed to save product");
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-display text-lg font-medium text-gray-800 mb-5">
              Product Details
            </h3>
            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="font-body text-xs font-medium tracking-wider uppercase text-gray-600 block mb-2">
                  Product Name *
                </label>
                <input
                  {...register("name")}
                  className="w-full border border-gray-200 px-4 py-2.5 font-body text-sm text-gray-800 focus:outline-none focus:border-forest-400 rounded bg-gray-50"
                  placeholder="Rose & Saffron Glow Soap"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 font-body">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Short Description */}
              <div>
                <label className="font-body text-xs font-medium tracking-wider uppercase text-gray-600 block mb-2">
                  Short Description
                </label>
                <input
                  {...register("shortDesc")}
                  className="w-full border border-gray-200 px-4 py-2.5 font-body text-sm text-gray-800 focus:outline-none focus:border-forest-400 rounded bg-gray-50"
                  placeholder="Brief tagline shown in product cards"
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="font-body text-xs font-medium tracking-wider uppercase text-gray-600 block mb-2">
                  Full Description *
                </label>
                <textarea
                  {...register("description")}
                  rows={5}
                  className="w-full border border-gray-200 px-4 py-2.5 font-body text-sm text-gray-800 focus:outline-none focus:border-forest-400 rounded bg-gray-50 resize-y"
                  placeholder="Detailed product description..."
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1 font-body">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Ingredients */}
              <div>
                <label className="font-body text-xs font-medium tracking-wider uppercase text-gray-600 block mb-2">
                  Ingredients
                </label>
                <textarea
                  {...register("ingredients")}
                  rows={3}
                  className="w-full border border-gray-200 px-4 py-2.5 font-body text-sm text-gray-800 focus:outline-none focus:border-forest-400 rounded bg-gray-50 resize-y"
                  placeholder="Saponified Coconut Oil, Rose Water, ..."
                />
              </div>

              {/* How to Use */}
              <div>
                <label className="font-body text-xs font-medium tracking-wider uppercase text-gray-600 block mb-2">
                  How to Use
                </label>
                <textarea
                  {...register("howToUse")}
                  rows={3}
                  className="w-full border border-gray-200 px-4 py-2.5 font-body text-sm text-gray-800 focus:outline-none focus:border-forest-400 rounded bg-gray-50 resize-y"
                  placeholder="Instructions for best results..."
                />
              </div>
            </div>
          </div>

          {/* Tags & Benefits */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-display text-lg font-medium text-gray-800 mb-5">
              Tags & Benefits
            </h3>
            <div className="space-y-5">
              {/* Tags */}
              <div>
                <label className="font-body text-xs font-medium tracking-wider uppercase text-gray-600 block mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="flex-1 border border-gray-200 px-3 py-2 font-body text-sm text-gray-800 focus:outline-none focus:border-forest-400 rounded bg-gray-50"
                    placeholder="Add tag and press Enter"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="bg-forest-500 text-white px-3 py-2 rounded font-body text-sm hover:bg-forest-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-body px-2.5 py-1 rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <label className="font-body text-xs font-medium tracking-wider uppercase text-gray-600 block mb-2">
                  Key Benefits
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addBenefit())
                    }
                    className="flex-1 border border-gray-200 px-3 py-2 font-body text-sm text-gray-800 focus:outline-none focus:border-forest-400 rounded bg-gray-50"
                    placeholder="e.g., Deep hydration"
                  />
                  <button
                    type="button"
                    onClick={addBenefit}
                    className="bg-forest-500 text-white px-3 py-2 rounded font-body text-sm hover:bg-forest-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {benefits.map((benefit) => (
                    <span
                      key={benefit}
                      className="flex items-center gap-1.5 bg-forest-50 text-forest-700 text-xs font-body px-2.5 py-1 rounded-full"
                    >
                      {benefit}
                      <button
                        type="button"
                        onClick={() =>
                          setBenefits((prev) => prev.filter((b) => b !== benefit))
                        }
                        className="text-forest-400 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-display text-lg font-medium text-gray-800 mb-5">
              SEO Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="font-body text-xs font-medium tracking-wider uppercase text-gray-600 block mb-2">
                  Meta Title
                </label>
                <input
                  {...register("metaTitle")}
                  className="w-full border border-gray-200 px-4 py-2.5 font-body text-sm text-gray-800 focus:outline-none focus:border-forest-400 rounded bg-gray-50"
                  placeholder="SEO page title (60 chars max)"
                />
              </div>
              <div>
                <label className="font-body text-xs font-medium tracking-wider uppercase text-gray-600 block mb-2">
                  Meta Description
                </label>
                <textarea
                  {...register("metaDesc")}
                  rows={2}
                  className="w-full border border-gray-200 px-4 py-2.5 font-body text-sm text-gray-800 focus:outline-none focus:border-forest-400 rounded bg-gray-50"
                  placeholder="SEO description (160 chars max)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Images */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-display text-lg font-medium text-gray-800 mb-4">
              Product Images
            </h3>

            {/* Tab switcher */}
            <div className="flex border border-gray-200 rounded-lg overflow-hidden mb-4">
              <button
                type="button"
                onClick={() => setImageTab("url")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-body font-medium transition-colors ${
                  imageTab === "url"
                    ? "bg-forest-500 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                Paste URL
              </button>
              <button
                type="button"
                onClick={() => setImageTab("file")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-body font-medium transition-colors ${
                  imageTab === "file"
                    ? "bg-forest-500 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload File
              </button>
            </div>

            {/* URL input tab */}
            {imageTab === "url" && (
              <div className="space-y-2">
                <p className="font-body text-xs text-gray-400">
                  Paste any image URL (Unsplash, your CDN, etc.)
                </p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddUrl())}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 border border-gray-200 px-3 py-2 font-body text-xs text-gray-800 focus:outline-none focus:border-forest-400 rounded bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={handleAddUrl}
                    className="bg-forest-500 text-white px-3 py-2 rounded font-body text-xs hover:bg-forest-600 transition-colors whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>
                <p className="font-body text-[11px] text-gray-400">
                  💡 Free images: <a href="https://unsplash.com" target="_blank" className="text-forest-500 hover:underline">unsplash.com</a>
                  {" · "}right-click image → Copy image address
                </p>
              </div>
            )}

            {/* File upload tab */}
            {imageTab === "file" && (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-6 cursor-pointer hover:border-forest-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {isUploading ? (
                  <Loader2 className="w-8 h-8 text-forest-400 animate-spin mb-2" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-300 mb-2" strokeWidth={1.5} />
                )}
                <p className="font-body text-sm text-gray-500 text-center">
                  {isUploading ? "Uploading..." : "Click to upload (requires Cloudinary)"}
                </p>
                <p className="font-body text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
              </label>
            )}

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {images.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded bg-gray-100 group"
                  >
                    <Image
                      src={url}
                      alt={`Product image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                    {index === 0 && (
                      <div className="absolute top-1 left-1 bg-forest-500 text-white text-[10px] font-body px-1.5 py-0.5 rounded">
                        Main
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {images.length === 0 && (
              <p className="font-body text-xs text-red-400 mt-2">
                At least one image is required
              </p>
            )}
          </div>

          {/* Pricing */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-display text-lg font-medium text-gray-800 mb-4">
              Pricing
            </h3>
            <div className="space-y-4">
              <div>
                <label className="font-body text-xs font-medium tracking-wider uppercase text-gray-600 block mb-2">
                  Price (₹) *
                </label>
                <input
                  {...register("price")}
                  type="number"
                  step="0.01"
                  className="w-full border border-gray-200 px-4 py-2.5 font-body text-sm text-gray-800 focus:outline-none focus:border-forest-400 rounded bg-gray-50"
                  placeholder="449"
                />
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1 font-body">
                    {errors.price.message}
                  </p>
                )}
              </div>
              <div>
                <label className="font-body text-xs font-medium tracking-wider uppercase text-gray-600 block mb-2">
                  Compare at Price (₹)
                </label>
                <input
                  {...register("comparePrice")}
                  type="number"
                  step="0.01"
                  className="w-full border border-gray-200 px-4 py-2.5 font-body text-sm text-gray-800 focus:outline-none focus:border-forest-400 rounded bg-gray-50"
                  placeholder="599 (original price)"
                />
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-display text-lg font-medium text-gray-800 mb-4">
              Inventory
            </h3>
            <div className="space-y-4">
              <div>
                <label className="font-body text-xs font-medium tracking-wider uppercase text-gray-600 block mb-2">
                  Stock Quantity *
                </label>
                <input
                  {...register("stock")}
                  type="number"
                  className="w-full border border-gray-200 px-4 py-2.5 font-body text-sm text-gray-800 focus:outline-none focus:border-forest-400 rounded bg-gray-50"
                  placeholder="50"
                />
                {errors.stock && (
                  <p className="text-red-500 text-xs mt-1 font-body">
                    {errors.stock.message}
                  </p>
                )}
              </div>
              <div>
                <label className="font-body text-xs font-medium tracking-wider uppercase text-gray-600 block mb-2">
                  SKU
                </label>
                <input
                  {...register("sku")}
                  className="w-full border border-gray-200 px-4 py-2.5 font-body text-sm text-gray-800 focus:outline-none focus:border-forest-400 rounded bg-gray-50"
                  placeholder="KUM-001"
                />
              </div>
              <div>
                <label className="font-body text-xs font-medium tracking-wider uppercase text-gray-600 block mb-2">
                  Weight (grams)
                </label>
                <input
                  {...register("weight")}
                  type="number"
                  className="w-full border border-gray-200 px-4 py-2.5 font-body text-sm text-gray-800 focus:outline-none focus:border-forest-400 rounded bg-gray-50"
                  placeholder="100"
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-display text-lg font-medium text-gray-800 mb-4">
              Category
            </h3>
            <select
              {...register("categoryId")}
              className="w-full border border-gray-200 px-4 py-2.5 font-body text-sm text-gray-800 focus:outline-none focus:border-forest-400 rounded bg-gray-50"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-500 text-xs mt-1 font-body">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Status Toggles */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-display text-lg font-medium text-gray-800 mb-4">
              Visibility
            </h3>
            <div className="space-y-3">
              {[
                { name: "isActive", label: "Active (visible to customers)" },
                { name: "isFeatured", label: "Featured (shown on homepage)" },
                { name: "isNew", label: "Show 'New' badge" },
              ].map(({ name, label }) => (
                <label
                  key={name}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    {...register(name as keyof ProductFormData)}
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-forest-500 focus:ring-forest-400"
                  />
                  <span className="font-body text-sm text-gray-700 group-hover:text-gray-900">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-6 py-4">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
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
          {isSubmitting
            ? "Saving..."
            : product
            ? "Update Product"
            : "Create Product"}
        </button>
      </div>
    </form>
  );
}
