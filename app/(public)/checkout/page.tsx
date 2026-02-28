"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Lock } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { createOrder } from "@/actions/orders";
import type { RazorpayOptions, RazorpayResponse } from "@/types";
import toast from "react-hot-toast";

const SHIPPING_THRESHOLD = 599;
const SHIPPING_FEE = 60;

// Demo mode: true when no real Razorpay key is configured
const DEMO_MODE =
  !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID.startsWith("rzp_test_xxx");

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Valid email required"),
  customerPhone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Valid 10-digit Indian mobile number required"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Valid 6-digit pincode required"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Lakshadweep", "Puducherry",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, getSubtotal } = useCart();
  const subtotal = getSubtotal();
  const shippingFee = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  const placeOrder = async (formData: CheckoutForm) => {
    const orderResult = await createOrder({
      ...formData,
      items: items.map((item) => ({
        productId: item.id,
        productName: item.name,
        productImage: item.image,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
      subtotal,
      shippingFee,
      discount: 0,
      total,
      country: "India",
    });

    if (!orderResult.success || !orderResult.order) {
      throw new Error(orderResult.error || "Failed to create order");
    }
    return orderResult.order;
  };

  const onSubmit = async (formData: CheckoutForm) => {
    if (items.length === 0) { toast.error("Your cart is empty"); return; }
    setIsProcessing(true);

    try {
      const order = await placeOrder(formData);

      // ── DEMO MODE: skip Razorpay ──────────────────────────────────
      if (DEMO_MODE) {
        const res = await fetch("/api/payment/demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.id }),
        });
        const data = await res.json();
        if (data.success) {
          clearCart();
          toast.success("Demo payment successful! 🎉");
          router.push(`/checkout/success?order=${order.orderNumber}`);
        } else {
          toast.error("Demo payment failed");
        }
        return;
      }

      // ── REAL MODE: Razorpay ───────────────────────────────────────
      const razorpayRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, amount: total }),
      });
      const razorpayData = await razorpayRes.json();

      if (!razorpayData.success) {
        toast.error("Payment initialization failed");
        return;
      }

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: Math.round(total * 100),
        currency: "INR",
        name: "Kumarie",
        description: `Order #${order.orderNumber}`,
        image: "/logo.png",
        order_id: razorpayData.razorpayOrderId,
        handler: async (response: RazorpayResponse) => {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: order.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            clearCart();
            toast.success("Payment successful!");
            router.push(`/checkout/success?order=${order.orderNumber}`);
          } else {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: formData.customerName,
          email: formData.customerEmail,
          contact: formData.customerPhone,
        },
        theme: { color: "#2D4A1E" },
      };

      if (typeof window !== "undefined") {
        const win = window as typeof window & { Razorpay: new (opts: RazorpayOptions) => { open: () => void } };
        if (!win.Razorpay) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load Razorpay"));
            document.head.appendChild(script);
          });
        }
        const rzp = new win.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-100 pt-20 flex items-center justify-center">
        <div className="text-center py-16">
          <h2 className="font-display text-3xl text-forest-600 mb-3">
            Your cart is empty
          </h2>
          <Link href="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 pt-20">
      <div className="bg-white border-b border-cream-300 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 font-body text-sm text-sage-500 hover:text-forest-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to cart
          </Link>
          <h1 className="font-display text-4xl font-light text-forest-700">
            Checkout
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Shipping Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact */}
              <div className="bg-white border border-cream-300 p-6 md:p-8">
                <h2 className="font-display text-xl font-medium text-forest-700 mb-6 pb-4 border-b border-cream-300">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="font-body text-xs font-medium tracking-wider uppercase text-sage-600 block mb-2">
                      Full Name *
                    </label>
                    <input
                      {...register("customerName")}
                      className="w-full border border-cream-300 px-4 py-3 font-body text-sm text-forest-700 focus:outline-none focus:border-forest-400 bg-cream-50 placeholder-sage-300"
                      placeholder="Ananya Kumar"
                    />
                    {errors.customerName && (
                      <p className="text-red-500 text-xs mt-1 font-body">
                        {errors.customerName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="font-body text-xs font-medium tracking-wider uppercase text-sage-600 block mb-2">
                      Email *
                    </label>
                    <input
                      {...register("customerEmail")}
                      type="email"
                      className="w-full border border-cream-300 px-4 py-3 font-body text-sm text-forest-700 focus:outline-none focus:border-forest-400 bg-cream-50 placeholder-sage-300"
                      placeholder="ananya@example.com"
                    />
                    {errors.customerEmail && (
                      <p className="text-red-500 text-xs mt-1 font-body">
                        {errors.customerEmail.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="font-body text-xs font-medium tracking-wider uppercase text-sage-600 block mb-2">
                      Mobile Number *
                    </label>
                    <input
                      {...register("customerPhone")}
                      type="tel"
                      className="w-full border border-cream-300 px-4 py-3 font-body text-sm text-forest-700 focus:outline-none focus:border-forest-400 bg-cream-50 placeholder-sage-300"
                      placeholder="9876543210"
                      maxLength={10}
                    />
                    {errors.customerPhone && (
                      <p className="text-red-500 text-xs mt-1 font-body">
                        {errors.customerPhone.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white border border-cream-300 p-6 md:p-8">
                <h2 className="font-display text-xl font-medium text-forest-700 mb-6 pb-4 border-b border-cream-300">
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="font-body text-xs font-medium tracking-wider uppercase text-sage-600 block mb-2">
                      Address Line 1 *
                    </label>
                    <input
                      {...register("addressLine1")}
                      className="w-full border border-cream-300 px-4 py-3 font-body text-sm text-forest-700 focus:outline-none focus:border-forest-400 bg-cream-50 placeholder-sage-300"
                      placeholder="House/Flat no., Street, Area"
                    />
                    {errors.addressLine1 && (
                      <p className="text-red-500 text-xs mt-1 font-body">
                        {errors.addressLine1.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="font-body text-xs font-medium tracking-wider uppercase text-sage-600 block mb-2">
                      Address Line 2
                    </label>
                    <input
                      {...register("addressLine2")}
                      className="w-full border border-cream-300 px-4 py-3 font-body text-sm text-forest-700 focus:outline-none focus:border-forest-400 bg-cream-50 placeholder-sage-300"
                      placeholder="Landmark, Colony (optional)"
                    />
                  </div>

                  <div>
                    <label className="font-body text-xs font-medium tracking-wider uppercase text-sage-600 block mb-2">
                      City *
                    </label>
                    <input
                      {...register("city")}
                      className="w-full border border-cream-300 px-4 py-3 font-body text-sm text-forest-700 focus:outline-none focus:border-forest-400 bg-cream-50 placeholder-sage-300"
                      placeholder="Bengaluru"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1 font-body">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="font-body text-xs font-medium tracking-wider uppercase text-sage-600 block mb-2">
                      Pincode *
                    </label>
                    <input
                      {...register("pincode")}
                      className="w-full border border-cream-300 px-4 py-3 font-body text-sm text-forest-700 focus:outline-none focus:border-forest-400 bg-cream-50 placeholder-sage-300"
                      placeholder="560001"
                      maxLength={6}
                    />
                    {errors.pincode && (
                      <p className="text-red-500 text-xs mt-1 font-body">
                        {errors.pincode.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="font-body text-xs font-medium tracking-wider uppercase text-sage-600 block mb-2">
                      State *
                    </label>
                    <select
                      {...register("state")}
                      className="w-full border border-cream-300 px-4 py-3 font-body text-sm text-forest-700 focus:outline-none focus:border-forest-400 bg-cream-50"
                    >
                      <option value="">Select state</option>
                      {indianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-red-500 text-xs mt-1 font-body">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-cream-300 p-6 sticky top-24">
                <h2 className="font-display text-xl font-medium text-forest-700 mb-5 pb-4 border-b border-cream-300">
                  Order Summary
                </h2>

                {/* Items */}
                <ul className="space-y-4 mb-5">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3">
                      <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden bg-cream-200">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-forest-500 text-cream-100 text-xs font-body font-medium rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm font-medium text-forest-700 line-clamp-1">
                          {item.name}
                        </p>
                        <p className="font-body text-sm text-sage-500">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Pricing */}
                <div className="border-t border-cream-300 pt-4 space-y-2 mb-5">
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-sage-600">Subtotal</span>
                    <span className="text-forest-700">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-sage-600">Shipping</span>
                    <span
                      className={
                        shippingFee === 0
                          ? "text-forest-500 font-medium"
                          : "text-forest-700"
                      }
                    >
                      {shippingFee === 0 ? "Free" : formatPrice(shippingFee)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-cream-300 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-body font-semibold text-forest-700">Total</span>
                    <span className="font-display text-2xl font-medium text-forest-700">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-3 bg-forest-500 hover:bg-forest-600 disabled:bg-sage-300 text-cream-100 font-body font-medium tracking-widest uppercase text-xs py-4 transition-colors duration-300"
                >
                  <Lock className="w-4 h-4" />
                  {isProcessing
                    ? "Processing..."
                    : DEMO_MODE
                    ? "Demo Pay (Simulate)"
                    : "Pay Now"}
                </button>

                {DEMO_MODE && (
                  <p className="font-body text-[11px] text-amber-600 text-center bg-amber-50 border border-amber-200 px-3 py-2 mt-2">
                    🧪 Demo mode — no real payment will be charged
                  </p>
                )}

                <div className="flex items-center justify-center gap-2 mt-3">
                  <Lock className="w-3 h-3 text-sage-400" />
                  <p className="font-body text-xs text-sage-400">
                    {DEMO_MODE ? "Demo mode active" : "Secured by Razorpay"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
