import Link from "next/link";
import { CheckCircle, Package, ArrowRight, Leaf } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed | Kumarie",
  description: "Your order has been confirmed. Thank you for shopping with Kumarie!",
  robots: { index: false, follow: false },
};

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <div className="min-h-screen bg-cream-100 pt-20 flex items-center justify-center">
      <div className="max-w-lg w-full mx-auto px-4 py-16 text-center">
        {/* Success Icon */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-forest-100 rounded-full animate-ping opacity-20" />
          <div className="relative w-24 h-24 bg-forest-100 rounded-full flex items-center justify-center">
            <CheckCircle
              className="w-12 h-12 text-forest-500"
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Heading */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <Leaf className="w-5 h-5 text-amber-500" strokeWidth={1.5} />
          <span className="font-body text-xs tracking-widest uppercase text-amber-600">
            Order Confirmed
          </span>
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-light text-forest-700 mb-4">
          Thank you!
        </h1>

        {order && (
          <div className="bg-white border border-cream-300 px-6 py-4 mb-6 inline-block">
            <p className="font-body text-xs text-sage-500 tracking-wider uppercase mb-1">
              Order Number
            </p>
            <p className="font-display text-2xl font-medium text-forest-700">
              #{order}
            </p>
          </div>
        )}

        <p className="font-body text-sage-600 leading-relaxed mb-8 max-w-sm mx-auto">
          Your handcrafted soaps are being lovingly packed and will be on their way to you
          soon. You&apos;ll receive an email confirmation shortly.
        </p>

        {/* What happens next */}
        <div className="bg-white border border-cream-300 p-6 mb-8 text-left space-y-4">
          <h3 className="font-body text-xs font-semibold tracking-widest uppercase text-sage-500 mb-4">
            What happens next
          </h3>
          {[
            {
              icon: "📧",
              title: "Order confirmation",
              desc: "You'll receive an email with your order details",
            },
            {
              icon: "📦",
              title: "Packing",
              desc: "Your soaps are hand-packed within 1-2 business days",
            },
            {
              icon: "🚚",
              title: "Shipping",
              desc: "Delivery within 5-7 business days",
            },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-4">
              <span className="text-xl flex-shrink-0">{step.icon}</span>
              <div>
                <p className="font-body text-sm font-medium text-forest-700">
                  {step.title}
                </p>
                <p className="font-body text-xs text-sage-500">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/products"
            className="flex items-center gap-2 bg-forest-500 hover:bg-forest-600 text-cream-100 font-body font-medium tracking-widest uppercase text-xs py-3 px-8 transition-colors group"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/"
            className="font-body text-sm text-sage-500 hover:text-forest-600 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
