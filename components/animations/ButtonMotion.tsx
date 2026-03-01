"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface ButtonMotionProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  /** Scale factor on hover (default 1.02) */
  hoverScale?: number;
  /** Scale factor on press (default 0.96) */
  tapScale?: number;
}

/**
 * Drop-in animated <button>.
 * Provides subtle scale-up on hover and scale-down on press.
 * Preserves all native button props.
 */
export function ButtonMotion({
  children,
  className,
  hoverScale = 1.02,
  tapScale = 0.96,
  disabled,
  ...props
}: ButtonMotionProps) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: hoverScale }}
      whileTap={disabled ? undefined : { scale: tapScale }}
      transition={{ duration: 0.14, ease: "easeInOut" }}
      className={className}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}

/** Animated <a> / Link wrapper for CTA links */
export function LinkMotion({
  children,
  className,
  hoverScale = 1.02,
  tapScale = 0.97,
  ...props
}: Omit<ButtonMotionProps, "disabled"> & { href?: string }) {
  return (
    <motion.a
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: tapScale }}
      transition={{ duration: 0.14, ease: "easeInOut" }}
      className={className}
      {...(props as HTMLMotionProps<"a">)}
    >
      {children}
    </motion.a>
  );
}
