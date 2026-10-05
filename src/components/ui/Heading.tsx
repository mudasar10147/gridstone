import type { ReactNode } from "react";
import { cx } from "@/utils/cx";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4";
export type HeadingSize = "display" | "section" | "card";

// Visual size is independent of level so the outline stays logical (§15).
const sizeStyles: Record<HeadingSize, string> = {
  display: "font-display text-display font-black uppercase italic",
  section: "font-display text-section font-black uppercase italic",
  card: "font-heading text-xl leading-tight font-bold uppercase",
};

/**
 * - `none`: plain text.
 * - `shine`: a light sweep crosses the heading every few seconds.
 */
export type HeadingEffect = "none" | "shine";

// Shine paints the text itself (background-clip), so it replaces the colour.
const effectStyles: Record<HeadingEffect, string> = {
  none: "text-text-primary",
  shine: "text-shine",
};

export interface HeadingProps {
  as: HeadingLevel;
  size: HeadingSize;
  effect?: HeadingEffect;
  id?: string;
  className?: string;
  children: ReactNode;
}

export function Heading({
  as: Tag,
  size,
  effect = "none",
  id,
  className,
  children,
}: HeadingProps) {
  return (
    <Tag
      id={id}
      className={cx(effectStyles[effect], sizeStyles[size], className)}
    >
      {children}
    </Tag>
  );
}

export interface HeadingAccentProps {
  /** Starts the accent on its own line, as in the stacked hero titles. */
  layout?: "inline" | "block";
  children: ReactNode;
}

/** The fire-gradient words inside a heading ("WORLDS"). */
export function HeadingAccent({
  layout = "inline",
  children,
}: HeadingAccentProps) {
  // The right padding is a one-off: background-clip:text crops the overhang of
  // the italic final letter without it.
  return (
    <span
      className={cx(
        "text-gradient-accent pr-[0.08em]",
        layout === "block" && "block",
      )}
    >
      {children}
    </span>
  );
}
