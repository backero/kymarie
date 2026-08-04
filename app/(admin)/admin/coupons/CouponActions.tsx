"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Eye, EyeOff } from "lucide-react";
import { deleteCoupon, toggleCouponStatus } from "@/actions/coupons";
import toast from "react-hot-toast";

export function DeleteCouponButton({ id, code }: { id: string; code: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Delete coupon "${code}"? This action cannot be undone.`)) return;

    setIsDeleting(true);
    try {
      await deleteCoupon(id);
      toast.success("Coupon deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete coupon");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-40"
      title="Delete coupon"
    >
      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
    </button>
  );
}

export function ToggleCouponButton({
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
      await toggleCouponStatus(id);
      toast.success(isActive ? "Coupon deactivated" : "Coupon activated");
      router.refresh();
    } catch {
      toast.error("Failed to update coupon status");
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
      title={isActive ? "Deactivate coupon" : "Activate coupon"}
    >
      {isActive ? (
        <Eye className="w-4 h-4" strokeWidth={1.5} />
      ) : (
        <EyeOff className="w-4 h-4" strokeWidth={1.5} />
      )}
    </button>
  );
}
