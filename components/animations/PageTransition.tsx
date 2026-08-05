"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Animates the page IN on every route change.
 * No exit animation — Next.js App Router swaps children before React can
 * play an exit, which causes "removeChild" DOM errors with AnimatePresence.
 */
export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.997 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: prefersReduced ? 0.15 : 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
