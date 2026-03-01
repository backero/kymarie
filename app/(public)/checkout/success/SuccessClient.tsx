"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight, Leaf } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
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
];

export function SuccessContent({ order }: { order?: string }) {
  // Confetti-like effect using a simple DOM approach
  useEffect(() => {
    // Subtle page title flash
    document.title = "✓ Order Confirmed | Kumarie";
  }, []);

  return (
    <div className="max-w-lg w-full mx-auto px-4 py-16 text-center">
      {/* Animated checkmark icon */}
      <motion.div
        className="relative w-24 h-24 mx-auto mb-8"
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 22, delay: 0.1 }}
      >
        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 bg-amber-400/20 rounded-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [1, 1.5, 1.8], opacity: [0.5, 0.2, 0] }}
          transition={{
            duration: 1.5,
            delay: 0.3,
            repeat: 2,
            repeatDelay: 0.5,
          }}
        />
        <div className="relative w-24 h-24 bg-forest-50 border border-forest-100 rounded-full flex items-center justify-center">
          <CheckCircle
            className="w-12 h-12 text-forest-500"
            strokeWidth={1.5}
          />
        </div>
      </motion.div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center justify-center gap-2 mb-3"
      >
        <span className="font-body text-xs tracking-widest uppercase text-amber-600">
          Order Confirmed
        </span>
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-4xl md:text-5xl font-light text-forest-700 mb-4"
      >
        Thank you!
      </motion.h1>

      {/* Order number card */}
      {order && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.45,
            delay: 0.48,
            type: "spring",
            stiffness: 300,
            damping: 24,
          }}
          className="bg-white border border-cream-300 px-6 py-4 mb-6 inline-block"
        >
          <p className="font-body text-xs text-sage-500 tracking-wider uppercase mb-1">
            Order Number
          </p>
          <p className="font-display text-2xl font-medium text-forest-700">
            #{order}
          </p>
        </motion.div>
      )}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="font-body text-sage-600 leading-relaxed mb-8 max-w-sm mx-auto"
      >
        Your handcrafted soaps are being lovingly packed and will be on their
        way to you soon. You&apos;ll receive an email confirmation shortly.
      </motion.p>

      {/* What happens next — staggered */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white border border-cream-300 p-6 mb-8 text-left space-y-4"
      >
        <h3 className="font-body text-xs font-semibold tracking-widest uppercase text-sage-500 mb-4">
          What happens next
        </h3>
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.7 + i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex items-start gap-4"
          >
            <span className="text-xl flex-shrink-0">{step.icon}</span>
            <div>
              <p className="font-body text-sm font-medium text-forest-700">
                {step.title}
              </p>
              <p className="font-body text-xs text-sage-500">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 1.0 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <Link
            href="/products"
            className="flex items-center gap-2 bg-forest-500 hover:bg-forest-600 text-cream-100 font-body font-medium tracking-widest uppercase text-xs py-3 px-8 transition-colors group"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
        <Link
          href="/"
          className="font-body text-sm text-sage-500 hover:text-forest-600 transition-colors"
        >
          Return to Home
        </Link>
      </motion.div>
    </div>
  );
}
