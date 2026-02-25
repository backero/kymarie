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
} from "lucide-react";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      icon: TrendingUp,
      color: "bg-green-50 text-green-600",
      iconBg: "bg-green-100",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: "bg-blue-50 text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders.toString(),
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
      iconBg: "bg-amber-100",
    },
    {
      title: "Active Products",
      value: stats.totalProducts.toString(),
      icon: Package,
      color: "bg-forest-50 text-forest-600",
      iconBg: "bg-forest-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-3xl font-medium text-gray-800">
          Dashboard
        </h1>
        <p className="font-body text-sm text-gray-500 mt-1">
          Welcome to Kumarie admin panel
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map(({ title, value, icon: Icon, color, iconBg }) => (
          <div
            key={title}
            className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-body text-sm text-gray-500 mb-1">{title}</p>
                <p className="font-display text-2xl font-medium text-gray-800">
                  {value}
                </p>
              </div>
              <div className={`${iconBg} p-2.5 rounded-lg`}>
                <Icon className={`w-5 h-5 ${color.split(" ")[1]}`} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-medium text-gray-800">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="font-body text-xs text-forest-600 hover:text-amber-600 transition-colors flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <p className="font-body text-sm text-gray-400 text-center py-8">
              No orders yet
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-4 py-3.5 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-body text-sm font-medium text-gray-800 hover:text-forest-600 transition-colors"
                      >
                        #{order.orderNumber}
                      </Link>
                      <span
                        className={`text-xs font-body px-2 py-0.5 rounded-full font-medium ${getOrderStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="font-body text-xs text-gray-400 mt-0.5">
                      {order.customerName} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <p className="font-display text-sm font-medium text-gray-700 flex-shrink-0">
                    {formatPrice(order.total)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Products */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-medium text-gray-800">
              Low Stock
            </h2>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>

          {stats.lowStockProducts.length === 0 ? (
            <p className="font-body text-sm text-gray-400 text-center py-8">
              All products well-stocked
            </p>
          ) : (
            <div className="space-y-3">
              {stats.lowStockProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}/edit`}
                  className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded transition-colors group"
                >
                  <div className="relative w-10 h-10 flex-shrink-0 overflow-hidden rounded bg-gray-100">
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
                    <p className="font-body text-sm font-medium text-gray-700 group-hover:text-forest-600 truncate transition-colors">
                      {product.name}
                    </p>
                    <p
                      className={`font-body text-xs font-medium ${
                        product.stock === 0
                          ? "text-red-500"
                          : product.stock <= 5
                          ? "text-amber-600"
                          : "text-orange-500"
                      }`}
                    >
                      {product.stock === 0 ? "Out of stock" : `${product.stock} left`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <Link
            href="/admin/products"
            className="flex items-center justify-center gap-1 mt-5 pt-4 border-t border-gray-100 font-body text-xs text-forest-600 hover:text-amber-600 transition-colors"
          >
            Manage products <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
