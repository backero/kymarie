import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package, MapPin, CreditCard, Phone, Mail } from "lucide-react";
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 font-body text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          <div>
            <h1 className="font-display text-2xl font-medium text-gray-800">
              Order #{order.orderNumber}
            </h1>
            <p className="font-body text-xs text-gray-400 mt-0.5">
              Placed {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-body font-medium px-3 py-1.5 rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
            {order.paymentStatus}
          </span>
          <OrderStatusUpdater
            orderId={order.id}
            currentStatus={order.status}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-5">
              <Package className="w-5 h-5 text-forest-500" strokeWidth={1.5} />
              <h2 className="font-display text-lg font-medium text-gray-800">
                Order Items
              </h2>
            </div>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 border-b border-gray-50 last:border-0">
                  <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded bg-gray-100">
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
                    <p className="font-body text-sm font-medium text-gray-800">
                      {item.productName}
                    </p>
                    <p className="font-body text-xs text-gray-400 mt-0.5">
                      {formatPrice(item.unitPrice)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-display text-sm font-medium text-gray-700">
                    {formatPrice(item.totalPrice)}
                  </p>
                </div>
              ))}
            </div>

            {/* Pricing Summary */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              <div className="flex justify-between font-body text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-700">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="text-gray-700">
                  {order.shippingFee === 0 ? "Free" : formatPrice(order.shippingFee)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between font-body text-sm">
                  <span className="text-gray-500">Discount</span>
                  <span className="text-green-600">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-body font-semibold text-base pt-2 border-t border-gray-100">
                <span className="text-gray-800">Total</span>
                <span className="text-gray-800">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          {order.razorpayPaymentId && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-forest-500" strokeWidth={1.5} />
                <h2 className="font-display text-lg font-medium text-gray-800">
                  Payment Details
                </h2>
              </div>
              <div className="space-y-2 font-body text-sm">
                <div className="flex gap-3">
                  <span className="text-gray-500 w-36 flex-shrink-0">Payment ID</span>
                  <span className="text-gray-700 font-mono text-xs break-all">
                    {order.razorpayPaymentId}
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-gray-500 w-36 flex-shrink-0">Order ID</span>
                  <span className="text-gray-700 font-mono text-xs break-all">
                    {order.razorpayOrderId}
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-gray-500 w-36 flex-shrink-0">Method</span>
                  <span className="text-gray-700">{order.paymentMethod}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="font-display text-lg font-medium text-gray-800 mb-4">
              Customer
            </h2>
            <div className="space-y-3">
              <p className="font-body text-sm font-medium text-gray-800">
                {order.customerName}
              </p>
              <a
                href={`mailto:${order.customerEmail}`}
                className="flex items-center gap-2 font-body text-sm text-gray-500 hover:text-forest-600 transition-colors"
              >
                <Mail className="w-4 h-4" strokeWidth={1.5} />
                {order.customerEmail}
              </a>
              <a
                href={`tel:${order.customerPhone}`}
                className="flex items-center gap-2 font-body text-sm text-gray-500 hover:text-forest-600 transition-colors"
              >
                <Phone className="w-4 h-4" strokeWidth={1.5} />
                {order.customerPhone}
              </a>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-forest-500" strokeWidth={1.5} />
              <h2 className="font-display text-lg font-medium text-gray-800">
                Shipping Address
              </h2>
            </div>
            <div className="font-body text-sm text-gray-600 space-y-0.5">
              <p className="font-medium text-gray-800">{order.customerName}</p>
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
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="font-display text-lg font-medium text-gray-800 mb-3">
                Notes
              </h2>
              <p className="font-body text-sm text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
