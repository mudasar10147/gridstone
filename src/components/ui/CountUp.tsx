"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const DEFAULT_DURATION_MS = 1_600;

function easeOutCubic(progress: number): number {
  return 1 - (1 - progress) ** 3;
}

export interface CountUpProps {
  value: number;
  /** Appended after the number, e.g. "M+". */
  suffix?: string;
  durationMs?: number;
}

/**
 * Counts from 0 up to `value` once on mount. The server renders the final
 * number, so no-JS visitors and reduced-motion users simply see it; screen
 * readers always get the final value rather than the ticking digits.
 */
export function CountUp({
  value,
  suffix = "",
  durationMs = DEFAULT_DURATION_MS,
}: CountUpProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [current, setCurrent] = useState(value);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let frame = 0;
    let startedAt: number | null = null;

    function tick(now: number) {
      startedAt ??= now;
      const progress = Math.min(1, (now - startedAt) / durationMs);
      setCurrent(Math.round(value * easeOutCubic(progress)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, durationMs, prefersReducedMotion]);

  // Derived, so switching reduced motion on mid-count shows the final value.
  const shown = prefersReducedMotion ? value : current;

  return (
    <>
      <span aria-hidden>
        {/* Reserve the final width so neighbours don't shift while counting. */}
        <span
          className="inline-block text-right tabular-nums"
          style={{ minWidth: `${String(value).length}ch` }}
        >
          {shown}
        </span>
        {suffix}
      </span>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
    </>
  );
}
