"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { createCoupon, updateCoupon } from "@/actions/coupons";
import toast from "react-hot-toast";

const couponFormSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters"),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.coerce.number().positive("Value must be positive"),
  minOrder: z.coerce.number().optional().nullable(),
  maxUses: z.coerce.number().int().optional().nullable(),
  isActive: z.boolean().default(true),
  expiresAt: z.string().optional().nullable(),
});

type CouponFormData = z.infer<typeof couponFormSchema>;

interface Coupon {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minOrder: number | null;
  maxUses: number | null;
  isActive: boolean;
  expiresAt: Date | null;
}

export function CouponForm({ coupon }: { coupon?: Coupon }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: coupon?.code || "",
      type: coupon?.type || "PERCENTAGE",
      value: coupon?.value || 0,
      minOrder: coupon?.minOrder ?? null,
      maxUses: coupon?.maxUses ?? null,
      isActive: coupon?.isActive ?? true,
      expiresAt: coupon?.expiresAt
        ? new Date(coupon.expiresAt).toISOString().slice(0, 10)
        : "",
    },
  });

  const onSubmit = async (data: CouponFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        minOrder: data.minOrder || null,
        maxUses: data.maxUses || null,
        expiresAt: data.expiresAt || null,
      };

      const result = coupon
        ? await updateCoupon(coupon.id, payload)
        : await createCoupon(payload);

      if (result.success) {
        toast.success(coupon ? "Coupon updated successfully!" : "Coupon created successfully!");
        router.push("/admin/coupons");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to save coupon");
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
            Coupon Code *
          </label>
          <input
            {...register("code")}
            className="w-full border border-gray-200 px-4 py-2.5 font-body text-sm text-gray-800 focus:outline-none focus:border-forest-400 rounded bg-gray-50 uppercase"
            placeholder="WELCOME10"
          />
          {errors.code && (
            <p className="text-red-500 text-xs mt-1 font-body">{errors.code.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-body text-xs font-medium tracking-wider uppercase text-gray-600 block mb-2">
              Discount Type *
            </label>
            <select
              {...register("type")}
              className="w-full border border-gray-200 px-4 py-2.5 font-body text-sm text-gray-800 focus:outline-none focus:border-forest-400 rounded bg-gray-50"
            >
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED">Fixed Amount (₹)</option>
            </select>
          </div>
          <div>
            <label className="font-body text-xs font-medium tracking-wider uppercase text-gray-600 block mb-2">
              Value *
            </label>
            <input
              {...register("value")}
              type="number"
              step="0.01"
              className="w-full border border-gray-200 px-4 py-2.5 font-body text-sm text-gray-800 focus:outline-none focus:border-forest-400 rounded bg-gray-50"
              placeholder="10"
            />
            {errors.value && (
              <p className="text-red-500 text-xs mt-1 font-body">{errors.value.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-body text-xs font-medium tracking-wider uppercase text-gray-600 block mb-2">
              Minimum Order (₹)
            </label>
            <input
              {...register("minOrder")}
              type="number"
              className="w-full border border-gray-200 px-4 py-2.5 font-body text-sm text-gray-800 focus:outline-none focus:border-forest-400 rounded bg-gray-50"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="font-body text-xs font-medium tracking-wider uppercase text-gray-600 block mb-2">
              Max Uses
            </label>
            <input
              {...register("maxUses")}
              type="number"
              className="w-full border border-gray-200 px-4 py-2.5 font-body text-sm text-gray-800 focus:outline-none focus:border-forest-400 rounded bg-gray-50"
              placeholder="Unlimited"
            />
          </div>
        </div>

        <div>
          <label className="font-body text-xs font-medium tracking-wider uppercase text-gray-600 block mb-2">
            Expires On
          </label>
          <input
            {...register("expiresAt")}
            type="date"
            className="w-full border border-gray-200 px-4 py-2.5 font-body text-sm text-gray-800 focus:outline-none focus:border-forest-400 rounded bg-gray-50"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            {...register("isActive")}
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-forest-500 focus:ring-forest-400"
          />
          <span className="font-body text-sm text-gray-700 group-hover:text-gray-900">
            Active (customers can use this coupon)
          </span>
        </label>
      </div>

      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-6 py-4 max-w-xl">
        <button
          type="button"
          onClick={() => router.push("/admin/coupons")}
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
          {isSubmitting ? "Saving..." : coupon ? "Update Coupon" : "Create Coupon"}
        </button>
      </div>
    </form>
  );
}
