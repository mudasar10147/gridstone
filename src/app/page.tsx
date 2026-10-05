import type { Metadata } from "next";
import { SiteShell } from "@/components/shared/SiteShell";
import { ROUTES } from "@/constants/routes";
import { GameShowcase } from "@/features/games";
import { LaunchGate, launchAwareMetadata } from "@/features/launch";
import { HeroSection } from "./_components/HeroSection";

export function generateMetadata(): Promise<Metadata> {
  return launchAwareMetadata("We Build Worlds");
}

export default function HomePage() {
  return (
    <LaunchGate>
      <SiteShell activeHref={ROUTES.home}>
        <HeroSection />
        <GameShowcase />
      </SiteShell>
    </LaunchGate>
  );
}
