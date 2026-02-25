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
  const status = params.status && params.status !== "All" ? params.status : undefined;
  const page = parseInt(params.page || "1");

  const { orders, total, totalPages } = await getAllOrders({ status, page, limit: 20 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-medium text-gray-800">
          Orders
        </h1>
        <p className="font-body text-sm text-gray-500 mt-1">
          {total} orders total
        </p>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {ORDER_STATUSES.map((s) => (
          <a
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`font-body text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
              (params.status === s || (!params.status && s === "All"))
                ? "bg-forest-500 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-forest-400"
            }`}
          >
            {s}
          </a>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingCart
              className="w-16 h-16 text-gray-200 mb-4"
              strokeWidth={1}
            />
            <p className="font-display text-xl text-gray-400 mb-1">
              No orders yet
            </p>
            <p className="font-body text-sm text-gray-400">
              Orders will appear here once customers start purchasing
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {[
                    "Order",
                    "Customer",
                    "Date",
                    "Items",
                    "Total",
                    "Payment",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3.5 font-body text-xs font-semibold tracking-wider uppercase text-gray-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Order # */}
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-body text-sm font-medium text-forest-600 hover:text-amber-600 transition-colors"
                      >
                        #{order.orderNumber}
                      </Link>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-body text-sm font-medium text-gray-800">
                          {order.customerName}
                        </p>
                        <p className="font-body text-xs text-gray-400">
                          {order.customerEmail}
                        </p>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4">
                      <span className="font-body text-xs text-gray-500">
                        {formatDateTime(order.createdAt)}
                      </span>
                    </td>

                    {/* Items */}
                    <td className="px-5 py-4">
                      <span className="font-body text-sm text-gray-700">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </span>
                    </td>

                    {/* Total */}
                    <td className="px-5 py-4">
                      <span className="font-display text-sm font-medium text-gray-800">
                        {formatPrice(order.total)}
                      </span>
                    </td>

                    {/* Payment Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-body font-medium px-2 py-0.5 rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}
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
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-forest-600 hover:bg-forest-50 rounded transition-colors"
                      >
                        <Eye className="w-4 h-4" strokeWidth={1.5} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/admin/orders?${new URLSearchParams({
                ...(params.status && { status: params.status }),
                page: p.toString(),
              })}`}
              className={`w-9 h-9 flex items-center justify-center font-body text-sm rounded transition-colors ${
                p === page
                  ? "bg-forest-500 text-white"
                  : "border border-gray-200 text-gray-600 hover:border-forest-400"
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
