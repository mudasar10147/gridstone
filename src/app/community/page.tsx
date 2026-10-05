import type { Metadata } from "next";
import { SiteShell } from "@/components/shared/SiteShell";
import { UnderConstruction } from "@/components/shared/UnderConstruction";
import { ROUTES } from "@/constants/routes";
import { LaunchGate, launchAwareMetadata } from "@/features/launch";

export function generateMetadata(): Promise<Metadata> {
  return launchAwareMetadata("Community");
}

export default function CommunityPage() {
  return (
    <LaunchGate>
      <SiteShell activeHref={ROUTES.community}>
        <UnderConstruction
          title="Community"
          description="A home for our players is on its way. In the meantime, come hang out with us on Discord."
        />
      </SiteShell>
    </LaunchGate>
  );
}
