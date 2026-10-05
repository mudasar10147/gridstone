import type { ReactNode } from "react";
import { cx } from "@/utils/cx";

/**
 * - `up`: rises into place (default).
 * - `fade`: opacity only.
 * - `from-left` / `from-right`: slides in horizontally.
 */
export type RevealDirection = "up" | "fade" | "from-left" | "from-right";

const directionStyles: Record<RevealDirection, string> = {
  up: "animate-rise-in",
  fade: "animate-fade-in",
  "from-left": "animate-enter-from-left",
  "from-right": "animate-enter-from-right",
};

/** Gap between consecutive steps of a staggered entrance. */
const STAGGER_MS = 90;

export interface RevealProps {
  direction?: RevealDirection;
  /** Position in the entrance sequence; each step starts a little later. */
  step?: number;
  className?: string;
  children: ReactNode;
}

/**
 * Entrance animation on first paint. Pure CSS, so it needs no JavaScript and
 * plays before hydration; skipped entirely when the user prefers reduced motion.
 */
export function Reveal({
  direction = "up",
  step = 0,
  className,
  children,
}: RevealProps) {
  return (
    <div
      className={cx(
        directionStyles[direction],
        "motion-reduce:animate-none",
        className,
      )}
      style={{ animationDelay: `${step * STAGGER_MS}ms` }}
    >
      {children}
    </div>
  );
}
