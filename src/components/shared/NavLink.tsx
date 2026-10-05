import Link from "next/link";
import { cx } from "@/utils/cx";

/**
 * - `bar`: horizontal desktop navigation, active item underlined.
 * - `stacked`: full-width rows in the mobile menu.
 */
export type NavLinkVariant = "bar" | "stacked";

const variantStyles: Record<
  NavLinkVariant,
  { base: string; active: string; idle: string }
> = {
  bar: {
    base: "relative flex h-11 items-center px-1 text-sm font-semibold after:absolute after:inset-x-0 after:bottom-1 after:h-0.5 after:rounded-full after:transition xl:text-base",
    active: "text-accent after:bg-accent",
    idle: "text-text-primary after:bg-transparent hover:text-accent-highlight",
  },
  stacked: {
    base: "flex min-h-12 items-center rounded-control px-3 font-heading text-lg font-bold uppercase tracking-wide",
    active: "bg-surface-raised text-accent",
    idle: "text-text-primary hover:bg-surface-raised/60",
  },
};

export interface NavLinkProps {
  href: string;
  isActive: boolean;
  variant: NavLinkVariant;
  children: string;
}

export function NavLink({ href, isActive, variant, children }: NavLinkProps) {
  const styles = variantStyles[variant];

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cx(styles.base, isActive ? styles.active : styles.idle)}
    >
      {children}
    </Link>
  );
}
