"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface WordRevealProps {
  text: string;
  /** Extra className on the outer wrapper */
  className?: string;
  /** Delay before the animation starts (seconds) */
  delay?: number;
  /** Duration per word (seconds) */
  duration?: number;
  /** Stagger between words (seconds) */
  stagger?: number;
  /** Render as this tag */
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  /** Trigger once when in view (default true) */
  once?: boolean;
}

/**
 * Splits text into words and slides each up from a clipped container,
 * creating the signature Lumier-style line-reveal effect.
 */
export function WordReveal({
  text,
  className = "",
  delay = 0,
  duration = 0.7,
  stagger = 0.08,
  as: Tag = "span",
  once = true,
}: WordRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once, amount: 0.3 });
  const prefersReduced = useReducedMotion();

  const words = text.split(" ");

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={`inline ${className}`} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden leading-[1.15]"
          // Small right gap between words
          style={{ marginRight: "0.28em" }}
          aria-hidden="true"
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={prefersReduced ? { opacity: 0 } : { y: "105%", opacity: 0 }}
            animate={
              isInView
                ? { y: "0%", opacity: 1 }
                : prefersReduced
                ? { opacity: 0 }
                : { y: "105%", opacity: 0 }
            }
            transition={{
              duration: prefersReduced ? 0.2 : duration,
              delay: prefersReduced ? 0 : delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Convenience: wraps multiple lines, each line gets its own stagger offset */
interface WordRevealBlockProps {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p";
}

export function WordRevealBlock({
  lines,
  className = "",
  lineClassName = "",
  delay = 0,
  stagger = 0.08,
  duration = 0.72,
  as: Tag = "h2",
}: WordRevealBlockProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.2 });
  const prefersReduced = useReducedMotion();

  // Count total words before current line for global stagger offset
  let wordOffset = 0;

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={className}>
      {lines.map((line, li) => {
        const words = line.split(" ");
        const lineOffset = wordOffset;
        wordOffset += words.length;

        return (
          <span key={li} className={`block ${lineClassName}`}>
            {words.map((word, wi) => (
              <span
                key={wi}
                className="inline-block overflow-hidden leading-[1.15]"
                style={{ marginRight: "0.28em" }}
              >
                <motion.span
                  className="inline-block will-change-transform"
                  initial={prefersReduced ? { opacity: 0 } : { y: "110%", opacity: 0 }}
                  animate={
                    isInView
                      ? { y: "0%", opacity: 1 }
                      : prefersReduced
                      ? { opacity: 0 }
                      : { y: "110%", opacity: 0 }
                  }
                  transition={{
                    duration: prefersReduced ? 0.2 : duration,
                    delay: prefersReduced ? 0 : delay + (lineOffset + wi) * stagger,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </span>
        );
      })}
    </Tag>
  );
}
