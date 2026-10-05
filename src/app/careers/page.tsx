import type { Metadata } from "next";
import { SiteShell } from "@/components/shared/SiteShell";
import { UnderConstruction } from "@/components/shared/UnderConstruction";
import { ROUTES } from "@/constants/routes";
import { LaunchGate, launchAwareMetadata } from "@/features/launch";

export function generateMetadata(): Promise<Metadata> {
  return launchAwareMetadata("Careers");
}

export default function CareersPage() {
  return (
    <LaunchGate>
      <SiteShell activeHref={ROUTES.careers}>
        <UnderConstruction
          title="Careers"
          description="We're getting ready to grow the team. Open roles will be posted here soon."
        />
      </SiteShell>
    </LaunchGate>
  );
}
