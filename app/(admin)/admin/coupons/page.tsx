import Link from "next/link";
import { getAllCouponsAdmin } from "@/actions/coupons";
import { formatPrice, formatDate } from "@/lib/utils";
import { Plus, Edit, Tag } from "lucide-react";
import { DeleteCouponButton, ToggleCouponButton } from "./CouponActions";

export default async function AdminCouponsPage() {
  const coupons = await getAllCouponsAdmin();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-neutral-900">
            Coupons
          </h1>
          <p className="font-body text-sm text-neutral-500 mt-1">
            {coupons.length} coupons total
          </p>
        </div>
        <Link
          href="/admin/coupons/new"
          className="inline-flex items-center gap-2 bg-forest-500 hover:bg-forest-600 text-white font-body text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm shadow-forest-500/20 hover:scale-105 hover:shadow-md hover:shadow-forest-500/20"
        >
          <Plus className="w-4 h-4" />
          Add Coupon
        </Link>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-neutral-200/70 overflow-hidden">
        {coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-6">
            <div className="w-20 h-20 rounded-3xl bg-neutral-100 flex items-center justify-center mb-4">
              <Tag className="w-10 h-10 text-neutral-300" strokeWidth={1} />
            </div>
            <p className="font-display text-xl text-neutral-500 mb-2">
              No coupons yet
            </p>
            <p className="font-body text-sm text-neutral-400 mb-6">
              Create your first discount coupon
            </p>
            <Link
              href="/admin/coupons/new"
              className="inline-flex items-center gap-2 bg-forest-500 text-white font-body text-sm font-medium px-5 py-2.5 rounded-xl"
            >
              <Plus className="w-4 h-4" />
              Add Coupon
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/60">
                  {["Code", "Type", "Value", "Usage", "Min Order", "Expires", "Status", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3.5 font-body text-[11px] font-semibold tracking-wider uppercase text-neutral-400 first:pl-5 last:text-right"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr
                    key={coupon.id}
                    className="hover:bg-neutral-50/50 transition-colors group border-b border-neutral-50 last:border-0"
                  >
                    <td className="px-5 py-4">
                      <span className="font-body text-sm font-semibold text-neutral-800 tracking-wide">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-body text-xs font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
                        {coupon.type === "PERCENTAGE" ? "Percentage" : "Fixed"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-body text-sm font-semibold text-neutral-800">
                        {coupon.type === "PERCENTAGE"
                          ? `${coupon.value}%`
                          : formatPrice(coupon.value)}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-body text-sm text-neutral-600">
                        {coupon.usedCount}
                        {coupon.maxUses ? ` / ${coupon.maxUses}` : ""}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-body text-sm text-neutral-600">
                        {coupon.minOrder ? formatPrice(coupon.minOrder) : "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-body text-xs text-neutral-400">
                        {coupon.expiresAt ? formatDate(coupon.expiresAt) : "Never"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-body font-semibold px-2.5 py-1 rounded-full w-fit ${
                          coupon.isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            coupon.isActive ? "bg-green-500" : "bg-neutral-400"
                          }`}
                        />
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ToggleCouponButton id={coupon.id} isActive={coupon.isActive} />
                        <Link
                          href={`/admin/coupons/${coupon.id}/edit`}
                          className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit coupon"
                        >
                          <Edit className="w-4 h-4" strokeWidth={1.5} />
                        </Link>
                        <DeleteCouponButton id={coupon.id} code={coupon.code} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
