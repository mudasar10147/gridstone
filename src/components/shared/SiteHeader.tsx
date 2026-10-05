import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { SECTION_IDS } from "@/constants/routes";
import { EXTERNAL_LINKS, NAV_ITEMS } from "@/constants/site";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { NavLink } from "./NavLink";
import { SocialLinks } from "./SocialLinks";

export interface SiteHeaderProps {
  /** href of the current page, to mark the active nav item. */
  activeHref: string;
}

/** Floats over the page's first section; that section must clear its height. */
export function SiteHeader({ activeHref }: SiteHeaderProps) {
  return (
    <header className="absolute inset-x-0 top-0 z-40 animate-drop-in motion-reduce:animate-none">
      <a
        href={`#${SECTION_IDS.main}`}
        className="sr-only rounded-control bg-accent px-4 py-2 font-semibold text-text-on-accent focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
      >
        Skip to content
      </a>

      <Container width="wide">
        <div className="relative flex h-18 items-center justify-between gap-4 rounded-b-panel border border-t-0 border-border-subtle bg-page/70 px-4 backdrop-blur-md sm:px-6 lg:h-20">
          <Logo />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-6 xl:gap-9">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <NavLink
                    href={item.href}
                    isActive={item.href === activeHref}
                    variant="bar"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            {/* Visibility lives on wrappers: a display utility passed through
                className would conflict with the component's own display. */}
            <div className="hidden xl:block">
              <SocialLinks />
            </div>
            <div className="hidden sm:block">
              <Button href={EXTERNAL_LINKS.discord} trailingIcon="chevron-right">
                Join Discord
              </Button>
            </div>

            <MobileNav>
              <nav aria-label="Main">
                <ul className="flex flex-col gap-1">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.label}>
                      <NavLink
                        href={item.href}
                        isActive={item.href === activeHref}
                        variant="stacked"
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-3 flex flex-col gap-3 border-t border-border-subtle pt-3">
                <SocialLinks />
                <Button
                  href={EXTERNAL_LINKS.discord}
                  trailingIcon="chevron-right"
                  fullWidth
                >
                  Join Discord
                </Button>
              </div>
            </MobileNav>
          </div>
        </div>
      </Container>
    </header>
  );
}
