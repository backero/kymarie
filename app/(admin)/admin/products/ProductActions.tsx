"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Eye, EyeOff } from "lucide-react";
import { deleteProduct, toggleProductStatus } from "@/actions/products";
import toast from "react-hot-toast";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Delete "${name}"? This action cannot be undone.`)) return;

    setIsDeleting(true);
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-40"
      title="Delete product"
    >
      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
    </button>
  );
}

export function ToggleProductButton({
  id,
  isActive,
}: {
  id: string;
  isActive: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await toggleProductStatus(id);
      toast.success(isActive ? "Product deactivated" : "Product activated");
      router.refresh();
    } catch {
      toast.error("Failed to update product status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`w-8 h-8 flex items-center justify-center rounded transition-colors disabled:opacity-40 ${
        isActive
          ? "text-green-500 hover:text-gray-500 hover:bg-gray-50"
          : "text-gray-400 hover:text-green-500 hover:bg-green-50"
      }`}
      title={isActive ? "Deactivate product" : "Activate product"}
    >
      {isActive ? (
        <Eye className="w-4 h-4" strokeWidth={1.5} />
      ) : (
        <EyeOff className="w-4 h-4" strokeWidth={1.5} />
      )}
    </button>
  );
}
