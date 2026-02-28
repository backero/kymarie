import { getDashboardStats } from "@/actions/orders";
import { formatPrice, formatDate, getOrderStatusColor } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Package,
  TrendingUp,
  Clock,
  ArrowRight,
  AlertTriangle,
  Users,
  ChevronRight,
} from "lucide-react";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      icon: TrendingUp,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      accent: "from-amber-400/20 to-transparent",
      border: "border-amber-100",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      accent: "from-blue-400/20 to-transparent",
      border: "border-blue-100",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders.toString(),
      icon: Clock,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      accent: "from-orange-400/20 to-transparent",
      border: "border-orange-100",
    },
    {
      title: "Active Products",
      value: stats.totalProducts.toString(),
      icon: Package,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      accent: "from-violet-400/20 to-transparent",
      border: "border-violet-100",
    },
  ];

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-neutral-900">
            Dashboard
          </h1>
          <p className="font-body text-sm text-neutral-500 mt-1">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <Link
          href="/products"
          target="_blank"
          className="inline-flex items-center gap-2 font-body text-xs font-medium text-neutral-500 hover:text-amber-600 border border-neutral-200 hover:border-amber-300 rounded-xl px-3.5 py-2 transition-all duration-200 bg-white"
        >
          View store
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map(({ title, value, icon: Icon, iconBg, iconColor, accent, border }) => (
          <div
            key={title}
            className={`bg-white rounded-2xl p-5 border ${border} shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative`}
          >
            {/* Gradient accent */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${accent} rounded-bl-3xl`} />

            <div className="relative">
              <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={1.5} />
              </div>
              <p className="font-display text-3xl font-bold text-neutral-900 mb-1 leading-none">
                {value}
              </p>
              <p className="font-body text-sm text-neutral-500 mt-1.5">{title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-blue-500" strokeWidth={1.5} />
              </div>
              <h2 className="font-display text-base font-semibold text-neutral-800">
                Recent Orders
              </h2>
            </div>
            <Link
              href="/admin/orders"
              className="font-body text-xs text-neutral-400 hover:text-amber-600 transition-colors flex items-center gap-1 group"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mb-3">
                <ShoppingCart className="w-7 h-7 text-neutral-300" strokeWidth={1} />
              </div>
              <p className="font-body text-sm text-neutral-400">No orders yet</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-50">
              {stats.recentOrders.map((order) => {
                const initials = order.customerName
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);
                return (
                  <div
                    key={order.id}
                    className="flex items-center gap-4 px-6 py-3.5 hover:bg-neutral-50/60 transition-colors"
                  >
                    {/* Customer avatar */}
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center flex-shrink-0">
                      <span className="font-body text-xs font-semibold text-neutral-600">
                        {initials}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-body text-sm font-semibold text-neutral-800 hover:text-amber-600 transition-colors"
                        >
                          #{order.orderNumber}
                        </Link>
                        <span
                          className={`text-[10px] font-body px-2 py-0.5 rounded-full font-semibold ${getOrderStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="font-body text-xs text-neutral-400 mt-0.5">
                        {order.customerName} · {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <p className="font-display text-sm font-semibold text-neutral-700 flex-shrink-0">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-amber-500" strokeWidth={1.5} />
              </div>
              <h2 className="font-display text-base font-semibold text-neutral-800">
                Low Stock
              </h2>
            </div>
            {stats.lowStockProducts.length > 0 && (
              <span className="font-body text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                {stats.lowStockProducts.length} items
              </span>
            )}
          </div>

          {stats.lowStockProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-3">
                <Package className="w-7 h-7 text-green-400" strokeWidth={1} />
              </div>
              <p className="font-body text-sm text-neutral-400">All products well-stocked</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-50">
              {stats.lowStockProducts.map((product) => {
                const stockPct = Math.min((product.stock / 20) * 100, 100);
                const barColor =
                  product.stock === 0
                    ? "bg-red-500"
                    : product.stock <= 5
                    ? "bg-amber-500"
                    : "bg-orange-400";

                return (
                  <Link
                    key={product.id}
                    href={`/admin/products/${product.id}/edit`}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-neutral-50 transition-colors group"
                  >
                    <div className="relative w-10 h-10 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                      {product.thumbnail && (
                        <Image
                          src={product.thumbnail}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-medium text-neutral-700 group-hover:text-amber-600 truncate transition-colors">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${barColor}`}
                            style={{ width: `${stockPct}%` }}
                          />
                        </div>
                        <span
                          className={`font-body text-[10px] font-semibold flex-shrink-0 ${
                            product.stock === 0
                              ? "text-red-500"
                              : product.stock <= 5
                              ? "text-amber-600"
                              : "text-orange-500"
                          }`}
                        >
                          {product.stock === 0 ? "Out of stock" : `${product.stock} left`}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="px-5 py-3.5 border-t border-neutral-100">
            <Link
              href="/admin/products"
              className="flex items-center justify-center gap-1 font-body text-xs text-neutral-400 hover:text-amber-600 transition-colors group"
            >
              Manage products
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
