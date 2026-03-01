"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { formatPrice, formatDate, getOrderStatusColor } from "@/lib/utils";

// ─── Animated counter hook ────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1.0, delay = 0) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / (duration * 1000), 1);
        const eased = 1 - Math.pow(1 - progress, 4); // ease-out quart
        setValue(Math.round(eased * target));
        if (progress < 1) rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, delay]);

  return value;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
// NOTE: icon is passed as pre-rendered ReactNode from the server component
// because function references can't be serialized across the server/client boundary.

interface StatCardProps {
  title: string;
  rawValue: number;
  isPrice: boolean;
  /** Pre-rendered icon JSX from the server component */
  icon: ReactNode;
  iconBg: string;
  accent: string;
  border: string;
  index: number;
}

export function AnimatedStatCard({
  title,
  rawValue,
  isPrice,
  icon,
  iconBg,
  accent,
  border,
  index,
}: StatCardProps) {
  const counted = useCountUp(rawValue, 1.0, 0.1 + index * 0.08);

  const displayValue = isPrice
    ? `₹${counted.toLocaleString("en-IN")}`
    : counted.toString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.1 + index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -4,
        boxShadow: "0 16px 40px rgba(0,0,0,0.10)",
        transition: { duration: 0.2 },
      }}
      className={`bg-white rounded-2xl p-5 border ${border} shadow-sm overflow-hidden relative cursor-default`}
    >
      {/* Gradient accent */}
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${accent} rounded-bl-3xl`} />

      <div className="relative">
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center mb-4`}>
          {icon}
        </div>
        <p className="font-display text-3xl font-bold text-neutral-900 mb-1 leading-none tabular-nums">
          {displayValue}
        </p>
        <p className="font-body text-sm text-neutral-500 mt-1.5">{title}</p>
      </div>
    </motion.div>
  );
}

// ─── Recent Orders Table ──────────────────────────────────────────────────────

export function AnimatedOrderRows({
  orders,
}: {
  orders: {
    id: string;
    orderNumber: string;
    customerName: string;
    status: string;
    total: number;
    createdAt: Date | string;
  }[];
}) {
  return (
    <div className="divide-y divide-neutral-50">
      {orders.map((order, i) => {
        const initials = order.customerName
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

        return (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.05 + i * 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex items-center gap-4 px-6 py-3.5 hover:bg-neutral-50/60 transition-colors"
          >
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
                {order.customerName} · {formatDate(order.createdAt as string)}
              </p>
            </div>

            <p className="font-display text-sm font-semibold text-neutral-700 flex-shrink-0">
              {formatPrice(order.total)}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Low Stock Items ──────────────────────────────────────────────────────────

export function AnimatedLowStockItems({
  products,
}: {
  products: {
    id: string;
    name: string;
    thumbnail?: string | null;
    stock: number;
  }[];
}) {
  return (
    <div className="divide-y divide-neutral-50">
      {products.map((product, i) => {
        const stockPct = Math.min((product.stock / 20) * 100, 100);
        const barColor =
          product.stock === 0
            ? "bg-red-500"
            : product.stock <= 5
            ? "bg-amber-500"
            : "bg-orange-400";

        return (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.05 + i * 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link
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
                    <motion.div
                      className={`h-full rounded-full ${barColor}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${stockPct}%` }}
                      transition={{
                        duration: 0.8,
                        delay: 0.3 + i * 0.07,
                        ease: [0.22, 1, 0.36, 1],
                      }}
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
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Dashboard panel wrapper ──────────────────────────────────────────────────

export function AnimatedPanel({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        boxShadow: "0 8px 24px rgba(0,0,0,0.07)",
        transition: { duration: 0.2 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
