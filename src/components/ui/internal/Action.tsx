import type { ComponentProps } from "react";
import Link from "next/link";

export type ActionButtonProps = ComponentProps<"button"> & {
  href?: undefined;
};

export type ActionLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string;
};

/** Navigates when given `href`, otherwise performs an action (AGENTS.md §15). */
export type ActionProps = ActionButtonProps | ActionLinkProps;

function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href);
}

/**
 * Shared element switch for Button and IconButton: internal links use
 * next/link, external links open in a new tab, everything else is a button.
 */
export function Action(props: ActionProps) {
  if (props.href === undefined) {
    return <button type="button" {...props} />;
  }

  if (isExternalHref(props.href)) {
    return <a target="_blank" rel="noopener noreferrer" {...props} />;
  }

  return <Link {...props} />;
}
