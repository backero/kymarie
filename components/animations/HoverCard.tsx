"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface HoverCardProps {
  children: ReactNode;
  className?: string;
  /** How many px to lift on hover (default: 6) */
  liftY?: number;
  /** Add a subtle scale increase on hover */
  scale?: number;
  /** Whether to add a shadow on hover via inline style (complement with shadow classes) */
  shadowOnHover?: boolean;
}

/**
 * Wraps children in a motion.div that lifts + optionally scales on hover.
 * Drop-in replacement for a plain <div> on any card element.
 */
export function HoverCard({
  children,
  className,
  liftY = 6,
  scale = 1.01,
  shadowOnHover = false,
}: HoverCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -liftY,
        scale,
        boxShadow: shadowOnHover
          ? "0 20px 48px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)"
          : undefined,
        transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
