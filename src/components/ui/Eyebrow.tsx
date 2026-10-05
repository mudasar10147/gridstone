import type { ReactNode } from "react";
import { cx } from "@/utils/cx";

/**
 * - `plain`: just the spaced label ("PLAY · CREATE · BELONG").
 * - `lead-rule`: an accent rule before the label ("— OUR TOP GAMES").
 * - `framed`: muted rules on both sides ("— MORE WORLDS AHEAD —").
 */
export type EyebrowDecoration = "plain" | "lead-rule" | "framed";

const ruleStyles: Record<Exclude<EyebrowDecoration, "plain">, string> = {
  "lead-rule": "w-6 shrink-0 bg-accent",
  // Framing rules give way first on narrow screens.
  framed: "w-12 min-w-3 shrink bg-border-strong",
};

export interface EyebrowProps {
  decoration?: EyebrowDecoration;
  className?: string;
  children: ReactNode;
}

export function Eyebrow({
  decoration = "plain",
  className,
  children,
}: EyebrowProps) {
  const rule = decoration !== "plain" && (
    <span aria-hidden className={cx("h-0.5", ruleStyles[decoration])} />
  );

  return (
    <p
      className={cx(
        "flex items-center gap-4 font-heading text-xs font-semibold tracking-eyebrow text-text-muted uppercase sm:text-sm",
        className,
      )}
    >
      {rule}
      <span className="whitespace-nowrap">{children}</span>
      {decoration === "framed" && rule}
    </p>
  );
}
