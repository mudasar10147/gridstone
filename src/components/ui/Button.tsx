import type { ReactNode } from "react";
import type { IconName } from "@/types/icon";
import { cx } from "@/utils/cx";
import { Icon } from "./Icon";
import { Spinner } from "./Spinner";
import {
  Action,
  type ActionButtonProps,
  type ActionLinkProps,
} from "./internal/Action";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-accent text-text-on-accent shadow-glow-accent not-disabled:hover:brightness-110",
  secondary:
    "border border-cool bg-surface/70 text-text-primary shadow-glow-cool not-disabled:hover:border-cool-bright not-disabled:hover:bg-cool/15",
  ghost:
    "text-text-secondary not-disabled:hover:bg-surface-raised/60 not-disabled:hover:text-text-primary",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-11 gap-2 px-4 text-sm",
  md: "h-12 gap-2.5 px-6 text-base",
  lg: "h-14 gap-3 px-7 text-lg",
};

interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  fullWidth?: boolean;
  children: ReactNode;
}

type ButtonAsButton = ButtonOwnProps &
  Omit<ActionButtonProps, keyof ButtonOwnProps> & {
    /** Shows a spinner and blocks repeat clicks while an action runs. */
    loading?: boolean;
  };

type ButtonAsLink = ButtonOwnProps &
  Omit<ActionLinkProps, keyof ButtonOwnProps> & { loading?: never };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  size = "md",
  leadingIcon,
  trailingIcon,
  fullWidth = false,
  loading = false,
  className,
  children,
  ...actionProps
}: ButtonProps) {
  const classes = cx(
    "inline-flex items-center justify-center rounded-control font-heading font-bold tracking-wide whitespace-nowrap uppercase transition duration-200 select-none not-disabled:active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50",
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && "w-full",
    className,
  );

  const content = (
    <>
      {loading ? (
        <Spinner size="sm" label="Working" />
      ) : (
        leadingIcon && <Icon name={leadingIcon} size="sm" />
      )}
      <span>{children}</span>
      {trailingIcon && <Icon name={trailingIcon} size="sm" />}
    </>
  );

  if (actionProps.href !== undefined) {
    return (
      <Action {...actionProps} className={classes}>
        {content}
      </Action>
    );
  }

  return (
    <Action
      {...actionProps}
      className={classes}
      disabled={actionProps.disabled || loading}
      aria-busy={loading || undefined}
    >
      {content}
    </Action>
  );
}
