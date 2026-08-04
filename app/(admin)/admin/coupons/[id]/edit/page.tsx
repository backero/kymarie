import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCouponById } from "@/actions/coupons";
import { CouponForm } from "@/components/admin/CouponForm";

export default async function EditCouponPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const coupon = await getCouponById(id);

  if (!coupon) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/coupons"
        className="inline-flex items-center gap-2 font-body text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Coupons
      </Link>

      <div>
        <h1 className="font-display text-3xl font-medium text-gray-800">
          Edit Coupon
        </h1>
        <p className="font-body text-sm text-gray-500 mt-1">{coupon.code}</p>
      </div>

      <CouponForm coupon={coupon} />
    </div>
  );
}
