import type { ReactNode } from "react";
import type { IconName } from "@/types/icon";
import { cx } from "@/utils/cx";
import { Icon } from "./Icon";

export type BadgeVariant = "neutral" | "accent";

const variantStyles: Record<BadgeVariant, string> = {
  neutral: "border-border-strong bg-page/80 text-text-primary",
  accent: "border-accent/60 bg-page/80 text-accent-highlight",
};

export interface BadgeProps {
  variant?: BadgeVariant;
  icon?: IconName;
  className?: string;
  children: ReactNode;
}

export function Badge({
  variant = "neutral",
  icon,
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-control border px-2 py-0.5 font-heading text-sm font-bold backdrop-blur-sm",
        variantStyles[variant],
        className,
      )}
    >
      {children}
      {icon && <Icon name={icon} size="xs" className="text-accent" />}
    </span>
  );
}
