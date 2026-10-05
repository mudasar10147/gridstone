import type { IconName } from "@/types/icon";
import { cx } from "@/utils/cx";
import { Icon, type IconSize } from "./Icon";
import {
  Action,
  type ActionButtonProps,
  type ActionLinkProps,
} from "./internal/Action";

export type IconButtonVariant = "ghost" | "outline";
export type IconButtonSize = "md" | "lg";

const variantStyles: Record<IconButtonVariant, string> = {
  ghost:
    "text-text-secondary not-disabled:hover:bg-surface-raised/60 not-disabled:hover:text-text-primary",
  outline:
    "border border-border-strong bg-surface/70 text-text-primary not-disabled:hover:border-cool-bright not-disabled:hover:text-cool-bright",
};

// Both sizes stay at or above the 44px touch-target minimum.
const sizeStyles: Record<IconButtonSize, { box: string; icon: IconSize }> = {
  md: { box: "size-11", icon: "md" },
  lg: { box: "size-12", icon: "lg" },
};

interface IconButtonOwnProps {
  icon: IconName;
  /** Required: icon-only controls need an accessible name (AGENTS.md §15). */
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
}

export type IconButtonProps = IconButtonOwnProps &
  (
    | Omit<ActionButtonProps, keyof IconButtonOwnProps | "children">
    | Omit<ActionLinkProps, keyof IconButtonOwnProps | "children">
  );

export function IconButton({
  icon,
  label,
  variant = "ghost",
  size = "md",
  className,
  ...actionProps
}: IconButtonProps) {
  return (
    <Action
      {...actionProps}
      aria-label={label}
      className={cx(
        "inline-flex shrink-0 items-center justify-center rounded-control transition duration-200 not-disabled:active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40",
        variantStyles[variant],
        sizeStyles[size].box,
        className,
      )}
    >
      <Icon name={icon} size={sizeStyles[size].icon} />
    </Action>
  );
}
