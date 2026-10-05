import type { IconName } from "@/types/icon";
import { cx } from "@/utils/cx";

interface IconDefinition {
  /** Filled glyphs use fill; line icons use a 2px stroke. */
  kind: "fill" | "stroke";
  path: string;
}

// Inline SVG paths (24×24) — no icon package is installed (AGENTS.md §2.2).
// Brand marks are from Simple Icons (CC0).
const ICONS: Record<IconName, IconDefinition> = {
  "chevron-left": { kind: "stroke", path: "M15 18l-6-6 6-6" },
  "chevron-right": { kind: "stroke", path: "M9 6l6 6-6 6" },
  close: { kind: "stroke", path: "M6 6l12 12M18 6L6 18" },
  discord: {
    kind: "fill",
    path: "M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z",
  },
  "external-link": {
    kind: "stroke",
    path: "M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
  },
  flame: {
    kind: "fill",
    path: "M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z",
  },
  image: {
    kind: "stroke",
    path: "M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M15 9.5h.01",
  },
  menu: { kind: "stroke", path: "M4 7h16M4 12h16M4 17h16" },
  pause: { kind: "fill", path: "M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" },
  play: { kind: "fill", path: "M8 5v14l11-7z" },
  roblox: {
    kind: "fill",
    path: "M18.926 23.998 0 18.892 5.075.002 24 5.108ZM15.348 10.09l-5.282-1.453-1.414 5.273 5.282 1.453z",
  },
  "thumbs-up": {
    kind: "fill",
    path: "M2 21h4V9H2v12zm20-11a2 2 0 0 0-2-2h-6.31l.95-4.57.03-.32a1.5 1.5 0 0 0-.44-1.06L13.17 1 6.59 7.59A1.98 1.98 0 0 0 6 9v10a2 2 0 0 0 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z",
  },
  user: {
    kind: "fill",
    path: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
  },
  x: {
    kind: "fill",
    path: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  },
  youtube: {
    kind: "fill",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
};

export type IconSize = "xs" | "sm" | "md" | "lg";

const sizeStyles: Record<IconSize, string> = {
  xs: "size-3.5",
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

export interface IconProps {
  name: IconName;
  size?: IconSize;
  /** Accessible name. Omit for decorative icons next to visible text. */
  label?: string;
  className?: string;
}

export function Icon({ name, size = "md", label, className }: IconProps) {
  const { kind, path } = ICONS[name];

  return (
    <svg
      viewBox="0 0 24 24"
      className={cx("shrink-0", sizeStyles[size], className)}
      fill={kind === "fill" ? "currentColor" : "none"}
      stroke={kind === "stroke" ? "currentColor" : "none"}
      strokeWidth={kind === "stroke" ? 2 : undefined}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <path d={path} />
    </svg>
  );
}
