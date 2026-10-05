import type { Metadata } from "next";
import { SiteShell } from "@/components/shared/SiteShell";
import { UnderConstruction } from "@/components/shared/UnderConstruction";
import { ROUTES } from "@/constants/routes";
import { LaunchGate, launchAwareMetadata } from "@/features/launch";

export function generateMetadata(): Promise<Metadata> {
  return launchAwareMetadata("About Us");
}

export default function AboutPage() {
  return (
    <LaunchGate>
      <SiteShell activeHref={ROUTES.about}>
        <UnderConstruction
          title="About Us"
          description="The story of the studio behind the worlds is still being written. Check back soon."
        />
      </SiteShell>
    </LaunchGate>
  );
}
