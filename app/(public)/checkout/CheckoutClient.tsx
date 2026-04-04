"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft, Lock, Loader2, MapPin, CheckCircle2, Plus, ChevronDown, ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { createOrder } from "@/actions/orders";
import { FadeUp, SlideReveal } from "@/components/animations";
import { cn } from "@/lib/utils";
import type { RazorpayOptions, RazorpayResponse } from "@/types";
import toast from "react-hot-toast";

const SHIPPING_THRESHOLD = 599;
const SHIPPING_FEE = 60;

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

export type SavedAddress = {
  id: string;
  label: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isPrimary: boolean;
};

export type CheckoutPrefill = {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
};

function FormField({
  label,
  error,
  required,
  className,
  children,
  delay = 0,
}: {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      <label className="font-body text-xs font-medium tracking-wider uppercase text-sage-600 block mb-2">
        {label} {required && <span className="text-amber-500">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2 }}
            className="text-red-500 text-xs mt-1 font-body overflow-hidden"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CheckoutClient({
  userId,
  prefill,
  savedAddresses,
}: {
  userId?: string;
  prefill?: CheckoutPrefill;
  savedAddresses?: SavedAddress[];
}) {
  const router = useRouter();
  const { items, clearCart, getSubtotal } = useCart();
  const subtotal = getSubtotal();
  const shippingFee = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    savedAddresses?.find((a) => a.isPrimary)?.id ?? savedAddresses?.[0]?.id ?? null
  );
  const [showAddressPicker, setShowAddressPicker] = useState(
    (savedAddresses?.length ?? 0) > 0
  );

  const primaryAddress = savedAddresses?.find((a) => a.id === selectedAddressId);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: prefill?.customerName ?? "",
      customerEmail: prefill?.customerEmail ?? "",
      customerPhone: prefill?.customerPhone ?? "",
      ...(primaryAddress
        ? {
            addressLine1: primaryAddress.addressLine1,
            addressLine2: primaryAddress.addressLine2 ?? "",
            city: primaryAddress.city,
            state: primaryAddress.state,
            pincode: primaryAddress.pincode,
          }
        : {}),
    },
  });

  // When user selects a different saved address, update form fields
  useEffect(() => {
    if (!selectedAddressId || !savedAddresses) return;
    const addr = savedAddresses.find((a) => a.id === selectedAddressId);
    if (!addr) return;
    setValue("addressLine1", addr.addressLine1);
    setValue("addressLine2", addr.addressLine2 ?? "");
    setValue("city", addr.city);
    setValue("state", addr.state);
    setValue("pincode", addr.pincode);
    if (!prefill?.customerPhone) setValue("customerPhone", addr.phone);
    if (!prefill?.customerName) setValue("customerName", addr.name);
  }, [selectedAddressId, savedAddresses, setValue, prefill]);

  const inputClass =
    "w-full border border-cream-300 px-4 py-3 font-body text-sm text-forest-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 bg-cream-50 placeholder-sage-300 transition-all duration-200";

  const placeOrder = async (formData: CheckoutForm) => {
    const orderResult = await createOrder({
      ...formData,
      userId: userId ?? undefined,
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
        theme: { color: "#C8A020" },
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
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center py-16"
        >
          <h2 className="font-display text-3xl text-forest-600 mb-3">
            Your cart is empty
          </h2>
          <Link href="/products" className="btn-primary">
            Browse Products
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 pt-20">
      {/* Payment processing overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-5"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            >
              <Loader2 className="w-10 h-10 text-amber-500" />
            </motion.div>
            <div className="text-center">
              <p className="font-display text-2xl text-forest-700 mb-1">
                Processing your order
              </p>
              <p className="font-body text-sm text-sage-500">
                Please wait, do not close this tab...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <FadeUp>
        <div className="bg-white border-b border-cream-300 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div whileHover={{ x: -3 }} transition={{ duration: 0.2 }}>
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 font-body text-sm text-sage-500 hover:text-forest-600 transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to cart
              </Link>
            </motion.div>
            <h1 className="font-display text-4xl font-light text-forest-700">
              Checkout
            </h1>
          </div>
        </div>
      </FadeUp>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Shipping Form */}
            <div className="lg:col-span-2 space-y-8">

              {/* ── Saved Address Picker (if logged in with saved addresses) ── */}
              {savedAddresses && savedAddresses.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white border border-cream-300 p-6 md:p-8"
                >
                  <button
                    type="button"
                    onClick={() => setShowAddressPicker((v) => !v)}
                    className="flex items-center justify-between w-full"
                  >
                    <h2 className="font-display text-xl font-medium text-forest-700 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-amber-500" strokeWidth={1.5} />
                      Saved Addresses
                      <span className="font-body text-xs text-sage-400 normal-case font-normal ml-1">
                        ({savedAddresses.length})
                      </span>
                    </h2>
                    {showAddressPicker ? (
                      <ChevronUp className="w-4 h-4 text-sage-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-sage-400" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {showAddressPicker && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {savedAddresses.map((addr) => (
                            <button
                              key={addr.id}
                              type="button"
                              onClick={() => setSelectedAddressId(addr.id)}
                              className={cn(
                                "text-left p-4 rounded-xl border-2 transition-all duration-200 relative",
                                selectedAddressId === addr.id
                                  ? "border-forest-500 bg-forest-50"
                                  : "border-cream-300 hover:border-cream-400 bg-white"
                              )}
                            >
                              {/* Selected indicator */}
                              {selectedAddressId === addr.id && (
                                <span className="absolute top-3 right-3">
                                  <CheckCircle2 className="w-4 h-4 text-forest-500" />
                                </span>
                              )}

                              <div className="flex items-center gap-2 mb-2">
                                <span className={cn(
                                  "font-body text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full",
                                  selectedAddressId === addr.id
                                    ? "bg-forest-500 text-white"
                                    : "bg-cream-200 text-sage-600"
                                )}>
                                  {addr.label}
                                </span>
                                {addr.isPrimary && (
                                  <span className="font-body text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="font-body text-sm font-medium text-forest-700">
                                {addr.name}
                              </p>
                              <p className="font-body text-xs text-sage-500 mt-0.5 leading-relaxed">
                                {addr.addressLine1}
                                {addr.addressLine2 && `, ${addr.addressLine2}`}
                                <br />
                                {addr.city}, {addr.state} — {addr.pincode}
                              </p>
                              <p className="font-body text-xs text-sage-400 mt-1">
                                {addr.phone}
                              </p>
                            </button>
                          ))}

                          {/* Add new address link */}
                          <Link
                            href="/profile"
                            target="_blank"
                            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-cream-300 hover:border-forest-300 text-sage-400 hover:text-forest-500 transition-all duration-200"
                          >
                            <Plus className="w-5 h-5" strokeWidth={1.5} />
                            <span className="font-body text-xs">Add new address</span>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Contact */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white border border-cream-300 p-6 md:p-8"
              >
                <h2 className="font-display text-xl font-medium text-forest-700 mb-6 pb-4 border-b border-cream-300">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField label="Full Name" error={errors.customerName?.message} required className="md:col-span-2" delay={0.15}>
                    <input
                      {...register("customerName")}
                      className={inputClass}
                      placeholder="Ananya Kumar"
                    />
                  </FormField>
                  <FormField label="Email" error={errors.customerEmail?.message} required delay={0.2}>
                    <input
                      {...register("customerEmail")}
                      type="email"
                      className={inputClass}
                      placeholder="ananya@example.com"
                    />
                  </FormField>
                  <FormField label="Mobile Number" error={errors.customerPhone?.message} required delay={0.25}>
                    <input
                      {...register("customerPhone")}
                      type="tel"
                      className={inputClass}
                      placeholder="9876543210"
                      maxLength={10}
                    />
                  </FormField>
                </div>
              </motion.div>

              {/* Shipping Address */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white border border-cream-300 p-6 md:p-8"
              >
                <h2 className="font-display text-xl font-medium text-forest-700 mb-6 pb-4 border-b border-cream-300 flex items-center justify-between">
                  <span>Shipping Address</span>
                  {selectedAddressId && savedAddresses && savedAddresses.length > 0 && (
                    <span className="font-body text-xs text-forest-500 font-normal bg-forest-50 border border-forest-200 px-2.5 py-1 rounded-full normal-case">
                      Prefilled from saved address
                    </span>
                  )}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField label="Address Line 1" error={errors.addressLine1?.message} required className="md:col-span-2" delay={0.25}>
                    <input
                      {...register("addressLine1")}
                      className={inputClass}
                      placeholder="House/Flat no., Street, Area"
                    />
                  </FormField>
                  <FormField label="Address Line 2" className="md:col-span-2" delay={0.3}>
                    <input
                      {...register("addressLine2")}
                      className={inputClass}
                      placeholder="Landmark, Colony (optional)"
                    />
                  </FormField>
                  <FormField label="City" error={errors.city?.message} required delay={0.32}>
                    <input
                      {...register("city")}
                      className={inputClass}
                      placeholder="Bengaluru"
                    />
                  </FormField>
                  <FormField label="Pincode" error={errors.pincode?.message} required delay={0.34}>
                    <input
                      {...register("pincode")}
                      className={inputClass}
                      placeholder="560001"
                      maxLength={6}
                    />
                  </FormField>
                  <FormField label="State" error={errors.state?.message} required className="md:col-span-2" delay={0.36}>
                    <select
                      {...register("state")}
                      className={inputClass}
                    >
                      <option value="">Select state</option>
                      {indianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <SlideReveal direction="right" delay={0.18} className="lg:col-span-1">
              <div className="bg-white border border-cream-300 p-6 sticky top-24">
                <h2 className="font-display text-xl font-medium text-forest-700 mb-5 pb-4 border-b border-cream-300">
                  Order Summary
                </h2>

                {/* Items */}
                <ul className="space-y-4 mb-5">
                  {items.map((item, i) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                      className="flex gap-3"
                    >
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
                    </motion.li>
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
                    <span className={shippingFee === 0 ? "text-forest-500 font-medium" : "text-forest-700"}>
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

                {/* Pay button */}
                <motion.button
                  type="submit"
                  disabled={isProcessing}
                  whileHover={isProcessing ? {} : { scale: 1.02 }}
                  whileTap={isProcessing ? {} : { scale: 0.97 }}
                  transition={{ duration: 0.14 }}
                  className="w-full flex items-center justify-center gap-3 bg-forest-500 hover:bg-forest-600 disabled:bg-sage-300 text-cream-100 font-body font-medium tracking-widest uppercase text-xs py-4 transition-colors duration-300"
                >
                  <AnimatePresence mode="wait">
                    {isProcessing ? (
                      <motion.span
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </motion.span>
                    ) : (
                      <motion.span
                        key="pay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Lock className="w-4 h-4" />
                        {DEMO_MODE ? "Demo Pay (Simulate)" : "Pay Now"}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

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
            </SlideReveal>
          </div>
        </form>
      </div>
    </div>
  );
}
