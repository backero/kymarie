"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
  as?: keyof typeof motion;
}

export function FadeUp({
  children,
  delay = 0,
  duration = 0.6,
  className,
  once = true,
  amount = 0.08,
}: FadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Semantic variant — renders as <section> */
export function FadeUpSection({
  children,
  delay = 0,
  duration = 0.6,
  className,
  once = true,
}: FadeUpProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.06 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
