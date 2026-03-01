import { getDashboardStats } from "@/actions/orders";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import {
  ShoppingCart,
  Package,
  TrendingUp,
  Clock,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import {
  AnimatedStatCard,
  AnimatedOrderRows,
  AnimatedLowStockItems,
  AnimatedPanel,
} from "./DashboardClient";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  // Icons are pre-rendered as JSX here in the server component.
  // This avoids passing function references (non-serializable) to client components.
  const statCards = [
    {
      title: "Total Revenue",
      rawValue: stats.totalRevenue,
      isPrice: true,
      icon: <TrendingUp className="w-5 h-5 text-amber-600" strokeWidth={1.5} />,
      iconBg: "bg-amber-100",
      accent: "from-amber-400/20 to-transparent",
      border: "border-amber-100",
    },
    {
      title: "Total Orders",
      rawValue: stats.totalOrders,
      isPrice: false,
      icon: <ShoppingCart className="w-5 h-5 text-blue-600" strokeWidth={1.5} />,
      iconBg: "bg-blue-100",
      accent: "from-blue-400/20 to-transparent",
      border: "border-blue-100",
    },
    {
      title: "Pending Orders",
      rawValue: stats.pendingOrders,
      isPrice: false,
      icon: <Clock className="w-5 h-5 text-orange-600" strokeWidth={1.5} />,
      iconBg: "bg-orange-100",
      accent: "from-orange-400/20 to-transparent",
      border: "border-orange-100",
    },
    {
      title: "Active Products",
      rawValue: stats.totalProducts,
      isPrice: false,
      icon: <Package className="w-5 h-5 text-violet-600" strokeWidth={1.5} />,
      iconBg: "bg-violet-100",
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

      {/* Animated Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => (
          <AnimatedStatCard key={card.title} {...card} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <AnimatedPanel
          delay={0.35}
          className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden"
        >
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
            <AnimatedOrderRows orders={stats.recentOrders} />
          )}
        </AnimatedPanel>

        {/* Low Stock */}
        <AnimatedPanel
          delay={0.42}
          className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <Package className="w-4 h-4 text-amber-500" strokeWidth={1.5} />
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
            <AnimatedLowStockItems products={stats.lowStockProducts} />
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
        </AnimatedPanel>
      </div>
    </div>
  );
}
