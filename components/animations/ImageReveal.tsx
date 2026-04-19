"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface ImageRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
}

/**
 * Reveals children with a clip-path wipe + subtle scale,
 * creating the cinematic image-entrance seen on Lumier / luxury sites.
 */
export function ImageReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const prefersReduced = useReducedMotion();

  const clipFrom = {
    up:    "inset(100% 0% 0% 0%)",
    left:  "inset(0% 100% 0% 0%)",
    right: "inset(0% 0% 0% 100%)",
  }[direction];

  const clipTo = "inset(0% 0% 0% 0%)";

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={prefersReduced ? { opacity: 0 } : { clipPath: clipFrom, scale: 1.06, opacity: 0.6 }}
        animate={
          isInView
            ? { clipPath: clipTo, scale: 1, opacity: 1 }
            : prefersReduced
            ? { opacity: 0 }
            : { clipPath: clipFrom, scale: 1.06, opacity: 0.6 }
        }
        transition={{
          duration: prefersReduced ? 0.2 : 0.9,
          delay: prefersReduced ? 0 : delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
