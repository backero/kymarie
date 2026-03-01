"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

/** Wraps the table body rows with staggered fade-in animation */
export function AnimatedTableBody({ children }: { children: ReactNode }) {
  return (
    <motion.tbody
      className="divide-y divide-neutral-50"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.05, delayChildren: 0.05 },
        },
      }}
    >
      {children}
    </motion.tbody>
  );
}

/** Wraps each <tr> with slide-in animation */
export function AnimatedTableRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.tr
      variants={{
        hidden: { opacity: 0, x: -14 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.tr>
  );
}

/** Animated status filter pills */
export function AnimatedFilterPills({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-2 flex-wrap"
    >
      {children}
    </motion.div>
  );
}

/** Page header fade in */
export function AnimatedPageHeader({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
