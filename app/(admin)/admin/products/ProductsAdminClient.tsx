"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

/** Animated table body with staggered row reveal */
export function AnimatedProductTableBody({ children }: { children: ReactNode }) {
  return (
    <motion.tbody
      className="divide-y divide-neutral-50"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.045, delayChildren: 0.08 },
        },
      }}
    >
      {children}
    </motion.tbody>
  );
}

/** Animated product table row */
export function AnimatedProductRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.tr
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.tr>
  );
}

/** Animated page header */
export function AnimatedProductsHeader({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center justify-between"
    >
      {children}
    </motion.div>
  );
}

/** Animated table card */
export function AnimatedTableCard({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.48, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden"
    >
      {children}
    </motion.div>
  );
}
