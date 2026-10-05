import type { Metadata } from "next";
import { SiteShell } from "@/components/shared/SiteShell";
import { UnderConstruction } from "@/components/shared/UnderConstruction";
import { ROUTES } from "@/constants/routes";
import { LaunchGate, launchAwareMetadata } from "@/features/launch";

export function generateMetadata(): Promise<Metadata> {
  return launchAwareMetadata("Our Games");
}

export default function GamesPage() {
  return (
    <LaunchGate>
      <SiteShell activeHref={ROUTES.games}>
        <UnderConstruction
          title="Our Games"
          description="We're assembling the full library of Gridstone worlds. Until then, jump into our top games from the home page."
        />
      </SiteShell>
    </LaunchGate>
  );
}
