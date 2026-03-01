"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type Direction = "left" | "right" | "up" | "down";

interface SlideRevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  distance?: number;
}

function getInitialState(direction: Direction, distance: number) {
  const map: Record<Direction, { opacity: number; x?: number; y?: number }> = {
    left: { x: -distance, opacity: 0 },
    right: { x: distance, opacity: 0 },
    up: { y: -distance, opacity: 0 },
    down: { y: distance, opacity: 0 },
  };
  return map[direction];
}

export function SlideReveal({
  children,
  direction = "left",
  delay = 0,
  duration = 0.65,
  className,
  once = true,
  distance = 40,
}: SlideRevealProps) {
  return (
    <motion.div
      initial={getInitialState(direction, distance)}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once, amount: 0.08 }}
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
