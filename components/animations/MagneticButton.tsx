"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number; // how many px it moves (default 16)
  as?: "button" | "div" | "a";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

/**
 * Wraps children in a container that magnetically follows the cursor
 * on hover — a hallmark of premium Framer/luxury sites.
 */
export function MagneticButton({
  children,
  className = "",
  strength = 16,
  as: Tag = "div",
  href,
  onClick,
  type,
  disabled,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const prefersReduced = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setPos({
      x: ((e.clientX - cx) / rect.width) * strength * 2,
      y: ((e.clientY - cy) / rect.height) * strength * 2,
    });
  };

  const handleMouseLeave = () => setPos({ x: 0, y: 0 });

  const props: Record<string, unknown> = {
    ref,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    className: `relative inline-flex items-center justify-center ${className}`,
  };

  if (Tag === "a") props.href = href;
  if (Tag === "button") { props.type = type ?? "button"; props.disabled = disabled; props.onClick = onClick; }
  if (Tag === "div") props.onClick = onClick;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 200, damping: 18, mass: 0.6 }}
      className={`inline-flex ${className}`}
      {...(Tag === "a" ? {} : {})}
    >
      {/* Inner content shifts slightly opposite for parallax depth */}
      <motion.span
        animate={{ x: pos.x * -0.3, y: pos.y * -0.3 }}
        transition={{ type: "spring", stiffness: 200, damping: 18, mass: 0.6 }}
        className="inline-flex items-center justify-center w-full h-full"
      >
        {children}
      </motion.span>
    </motion.div>
  );
}
