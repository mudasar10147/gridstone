import type { ReactNode } from "react";
import { SECTION_IDS } from "@/constants/routes";
import { currentYear } from "@/utils/date";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export interface SiteShellProps {
  /** href of the current page, to mark the active nav item. */
  activeHref: string;
  /** Page sections. The first one must clear the floating header. */
  children: ReactNode;
}

/**
 * Header, main and footer for every site page. Fills the viewport: <main>
 * grows (pages let their first section flex-1 to absorb it) so the footer
 * sits at the bottom of the screen rather than leaving empty space beneath.
 */
export function SiteShell({ activeHref, children }: SiteShellProps) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <SiteHeader activeHref={activeHref} />
      <main id={SECTION_IDS.main} className="flex flex-1 flex-col">
        {children}
      </main>
      <SiteFooter year={currentYear()} />
    </div>
  );
}
