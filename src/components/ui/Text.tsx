import type { ReactNode } from "react";
import { cx } from "@/utils/cx";

export type TextSize = "xs" | "sm" | "md" | "lg";
export type TextTone = "primary" | "secondary" | "muted";

const sizeStyles: Record<TextSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-base sm:text-lg",
};

const toneStyles: Record<TextTone, string> = {
  primary: "text-text-primary",
  secondary: "text-text-secondary",
  muted: "text-text-muted",
};

export interface TextProps {
  as?: "p" | "span";
  size?: TextSize;
  tone?: TextTone;
  className?: string;
  children: ReactNode;
}

export function Text({
  as: Tag = "p",
  size = "md",
  tone = "secondary",
  className,
  children,
}: TextProps) {
  return (
    <Tag className={cx(sizeStyles[size], toneStyles[tone], className)}>
      {children}
    </Tag>
  );
}
