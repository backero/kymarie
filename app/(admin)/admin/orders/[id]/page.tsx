import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { getOrderById } from "@/actions/orders";
import {
  formatPrice,
  formatDateTime,
  getOrderStatusColor,
  getPaymentStatusColor,
} from "@/lib/utils";
import { OrderStatusUpdater } from "../OrderStatusUpdater";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) notFound();

  const customerInitials = order.customerName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="flex items-center gap-1.5 font-body text-sm text-neutral-400 hover:text-neutral-700 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Orders
          </Link>
          <span className="text-neutral-200">/</span>
          <div>
            <h1 className="font-display text-2xl font-semibold text-neutral-900">
              Order #{order.orderNumber}
            </h1>
            <p className="font-body text-xs text-neutral-400 mt-0.5">
              Placed {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>

        {/* Status controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className={`text-xs font-body font-semibold px-3 py-1.5 rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}
          >
            {order.paymentStatus}
          </span>
          <OrderStatusUpdater
            orderId={order.id}
            currentStatus={order.status}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Order details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-neutral-100">
              <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                <Package className="w-4 h-4 text-violet-500" strokeWidth={1.5} />
              </div>
              <h2 className="font-display text-base font-semibold text-neutral-800">
                Order Items ({order.items.length})
              </h2>
            </div>

            <div className="divide-y divide-neutral-50">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 px-6 py-4"
                >
                  <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                    {item.productImage && (
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-semibold text-neutral-800">
                      {item.productName}
                    </p>
                    <p className="font-body text-xs text-neutral-400 mt-1">
                      {formatPrice(item.unitPrice)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-display text-sm font-semibold text-neutral-700 flex-shrink-0">
                    {formatPrice(item.totalPrice)}
                  </p>
                </div>
              ))}
            </div>

            {/* Pricing Summary */}
            <div className="px-6 py-5 bg-neutral-50/60 border-t border-neutral-100 space-y-2.5">
              <div className="flex justify-between font-body text-sm">
                <span className="text-neutral-500">Subtotal</span>
                <span className="font-medium text-neutral-700">
                  {formatPrice(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-neutral-500">Shipping</span>
                <span className="font-medium text-neutral-700">
                  {order.shippingFee === 0
                    ? "Free"
                    : formatPrice(order.shippingFee)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between font-body text-sm">
                  <span className="text-neutral-500">Discount</span>
                  <span className="font-medium text-green-600">
                    -{formatPrice(order.discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-body font-bold text-base pt-3 border-t border-neutral-200">
                <span className="text-neutral-900">Total</span>
                <span className="text-neutral-900">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          {order.razorpayPaymentId && (
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2.5 px-6 py-4 border-b border-neutral-100">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-blue-500" strokeWidth={1.5} />
                </div>
                <h2 className="font-display text-base font-semibold text-neutral-800">
                  Payment Details
                </h2>
              </div>
              <div className="px-6 py-5 space-y-3 font-body text-sm">
                <div className="flex gap-3">
                  <span className="text-neutral-400 w-32 flex-shrink-0 font-medium">
                    Payment ID
                  </span>
                  <span className="text-neutral-600 font-mono text-xs break-all bg-neutral-50 px-2 py-1 rounded-lg">
                    {order.razorpayPaymentId}
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-neutral-400 w-32 flex-shrink-0 font-medium">
                    Order ID
                  </span>
                  <span className="text-neutral-600 font-mono text-xs break-all bg-neutral-50 px-2 py-1 rounded-lg">
                    {order.razorpayOrderId}
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-neutral-400 w-32 flex-shrink-0 font-medium">
                    Method
                  </span>
                  <span className="text-neutral-600">{order.paymentMethod}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right — Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-neutral-100">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <User className="w-4 h-4 text-amber-500" strokeWidth={1.5} />
              </div>
              <h2 className="font-display text-base font-semibold text-neutral-800">
                Customer
              </h2>
            </div>
            <div className="px-5 py-4">
              {/* Avatar + name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0">
                  <span className="font-body font-bold text-white text-sm">
                    {customerInitials}
                  </span>
                </div>
                <p className="font-body text-sm font-semibold text-neutral-800">
                  {order.customerName}
                </p>
              </div>
              <div className="space-y-2.5">
                <a
                  href={`mailto:${order.customerEmail}`}
                  className="flex items-center gap-2.5 font-body text-sm text-neutral-500 hover:text-amber-600 transition-colors group"
                >
                  <Mail className="w-3.5 h-3.5 flex-shrink-0 group-hover:text-amber-500" strokeWidth={1.5} />
                  {order.customerEmail}
                </a>
                <a
                  href={`tel:${order.customerPhone}`}
                  className="flex items-center gap-2.5 font-body text-sm text-neutral-500 hover:text-amber-600 transition-colors group"
                >
                  <Phone className="w-3.5 h-3.5 flex-shrink-0 group-hover:text-amber-500" strokeWidth={1.5} />
                  {order.customerPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-neutral-100">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-green-500" strokeWidth={1.5} />
              </div>
              <h2 className="font-display text-base font-semibold text-neutral-800">
                Shipping Address
              </h2>
            </div>
            <div className="px-5 py-4 font-body text-sm text-neutral-600 space-y-1 leading-relaxed">
              <p className="font-semibold text-neutral-800">{order.customerName}</p>
              <p>{order.addressLine1}</p>
              {order.addressLine2 && <p>{order.addressLine2}</p>}
              <p>
                {order.city}, {order.state} {order.pincode}
              </p>
              <p>{order.country}</p>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-amber-50 rounded-2xl border border-amber-100 px-5 py-4">
              <p className="font-body text-xs font-semibold text-amber-700 uppercase tracking-widest mb-2">
                Note
              </p>
              <p className="font-body text-sm text-amber-800 leading-relaxed">
                {order.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
