"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  initialScale?: number;
  /** "inView" triggers on scroll, "mount" triggers immediately on mount */
  trigger?: "inView" | "mount";
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 0.5,
  className,
  once = true,
  initialScale = 0.86,
  trigger = "inView",
}: ScaleInProps) {
  if (trigger === "mount") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: initialScale }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: initialScale }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once, amount: 0.1 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
