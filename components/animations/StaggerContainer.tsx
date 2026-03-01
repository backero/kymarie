"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
  once?: boolean;
  amount?: number;
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  /** Override per-item animation direction */
  direction?: "up" | "down" | "left" | "right" | "scale";
}

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.52,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const scaleItemVariants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
  },
};

const leftItemVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
  },
};

const rightItemVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
  },
};

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.08,
  delayChildren = 0.05,
  once = true,
  amount = 0.05,
}: StaggerContainerProps) {
  return (
    <motion.div
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren,
          },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  direction = "up",
}: StaggerItemProps) {
  const variants =
    direction === "scale"
      ? scaleItemVariants
      : direction === "left"
      ? leftItemVariants
      : direction === "right"
      ? rightItemVariants
      : itemVariants;

  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  );
}
