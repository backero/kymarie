import { getAllOrders } from "@/actions/orders";
import {
  formatPrice,
  formatDateTime,
  getOrderStatusColor,
  getPaymentStatusColor,
} from "@/lib/utils";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import { OrderStatusUpdater } from "./OrderStatusUpdater";
import {
  AnimatedTableBody,
  AnimatedTableRow,
  AnimatedFilterPills,
  AnimatedPageHeader,
} from "./OrdersClient";

const ORDER_STATUSES = [
  "All",
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const status =
    params.status && params.status !== "All" ? params.status : undefined;
  const page = parseInt(params.page || "1");

  const { orders, total, totalPages } = await getAllOrders({
    status,
    page,
    limit: 20,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatedPageHeader>
        <h1 className="font-display text-3xl font-semibold text-neutral-900">
          Orders
        </h1>
        <p className="font-body text-sm text-neutral-500 mt-1">
          {total} orders total
        </p>
      </AnimatedPageHeader>

      {/* Status Filter Pills */}
      <AnimatedFilterPills>
        {ORDER_STATUSES.map((s) => {
          const isSelected =
            params.status === s || (!params.status && s === "All");
          return (
            <a
              key={s}
              href={`/admin/orders?status=${s}`}
              className={`font-body text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200 ${
                isSelected
                  ? "bg-forest-500 text-white shadow-sm shadow-forest-500/20"
                  : "bg-white border border-neutral-200 text-neutral-500 hover:border-amber-300 hover:text-amber-700"
              }`}
            >
              {s}
            </a>
          );
        })}
      </AnimatedFilterPills>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-6">
            <div className="w-20 h-20 rounded-3xl bg-neutral-100 flex items-center justify-center mb-4">
              <ShoppingCart className="w-10 h-10 text-neutral-300" strokeWidth={1} />
            </div>
            <p className="font-display text-xl text-neutral-500 mb-2">
              No orders yet
            </p>
            <p className="font-body text-sm text-neutral-400">
              Orders will appear here once customers start purchasing
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/60">
                  {[
                    "Order",
                    "Customer",
                    "Date",
                    "Items",
                    "Total",
                    "Payment",
                    "Status",
                    "",
                  ].map((h, i) => (
                    <th
                      key={i}
                      className="text-left px-5 py-3.5 font-body text-[11px] font-semibold tracking-wider uppercase text-neutral-400 last:text-right last:pr-5"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <AnimatedTableBody>
                {orders.map((order) => {
                  const initials = order.customerName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <AnimatedTableRow
                      key={order.id}
                      className="hover:bg-neutral-50/50 transition-colors group"
                    >
                      {/* Order # */}
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-body text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                        >
                          #{order.orderNumber}
                        </Link>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                            <span className="font-body text-xs font-semibold text-neutral-500">
                              {initials}
                            </span>
                          </div>
                          <div>
                            <p className="font-body text-sm font-medium text-neutral-800 leading-none">
                              {order.customerName}
                            </p>
                            <p className="font-body text-xs text-neutral-400 mt-0.5">
                              {order.customerEmail}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4">
                        <span className="font-body text-xs text-neutral-400">
                          {formatDateTime(order.createdAt)}
                        </span>
                      </td>

                      {/* Items */}
                      <td className="px-5 py-4">
                        <span className="font-body text-sm text-neutral-600">
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="px-5 py-4">
                        <span className="font-display text-sm font-semibold text-neutral-800">
                          {formatPrice(order.total)}
                        </span>
                      </td>

                      {/* Payment Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`text-[10px] font-body font-semibold px-2.5 py-1 rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>

                      {/* Order Status */}
                      <td className="px-5 py-4">
                        <OrderStatusUpdater
                          orderId={order.id}
                          currentStatus={order.status}
                        />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="w-8 h-8 inline-flex items-center justify-center text-neutral-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="View order"
                        >
                          <Eye className="w-4 h-4" strokeWidth={1.5} />
                        </Link>
                      </td>
                    </AnimatedTableRow>
                  );
                })}
              </AnimatedTableBody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/admin/orders?${new URLSearchParams({
                ...(params.status && { status: params.status }),
                page: p.toString(),
              })}`}
              className={`w-9 h-9 flex items-center justify-center font-body text-sm rounded-xl transition-all duration-200 hover:scale-110 ${
                p === page
                  ? "bg-forest-500 text-white shadow-sm shadow-forest-500/20"
                  : "bg-white border border-neutral-200 text-neutral-500 hover:border-amber-300 hover:text-amber-600"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
