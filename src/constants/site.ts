import type { IconName } from "@/types/icon";
import { ROUTES } from "./routes";

export const SITE_NAME = "Gridstone Productions";

// TODO: replace each "#" with the studio's real URL — none were provided with
// the design. Discord invite, Roblox group, YouTube channel and X profile.
export const EXTERNAL_LINKS = {
  discord: "#",
  roblox: "#",
  youtube: "#",
  x: "#",
} as const;

export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: ROUTES.home },
  { label: "Our Games", href: ROUTES.games },
  { label: "About Us", href: ROUTES.about },
  { label: "Careers", href: ROUTES.careers },
  { label: "Community", href: ROUTES.community },
];

export interface SocialLink {
  label: string;
  href: string;
  icon: IconName;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "Discord", href: EXTERNAL_LINKS.discord, icon: "discord" },
  { label: "YouTube", href: EXTERNAL_LINKS.youtube, icon: "youtube" },
  { label: "X", href: EXTERNAL_LINKS.x, icon: "x" },
];

export interface StudioStat {
  id: string;
  /** Counted up to on load, then shown with the suffix: 10 + "M+" → "10M+". */
  value: number;
  suffix: string;
  label: string;
}

// Figures from the design mockup — confirm before launch.
export const STUDIO_STATS: StudioStat[] = [
  { id: "visits", value: 10, suffix: "M+", label: "Visits" },
  { id: "players", value: 100, suffix: "K+", label: "Players" },
  { id: "games", value: 5, suffix: "+", label: "Games" },
];
