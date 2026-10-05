import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { SITE_NAME } from "@/constants/site";
import { cx } from "@/utils/cx";
import { LAUNCH_AT } from "../config";
import { Countdown } from "./Countdown";

// HUD-style brackets in each corner of the screen.
const CORNERS = [
  "top-4 left-4 border-t-2 border-l-2 sm:top-8 sm:left-8",
  "top-4 right-4 border-t-2 border-r-2 sm:top-8 sm:right-8",
  "bottom-4 left-4 border-b-2 border-l-2 sm:bottom-8 sm:left-8",
  "right-4 bottom-4 border-r-2 border-b-2 sm:right-8 sm:bottom-8",
];

export interface ComingSoonProps {
  remaining: number;
}

/** Full-screen pre-launch page: no scrolling, just the countdown. */
export function ComingSoon({ remaining }: ComingSoonProps) {
  return (
    <main className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div aria-hidden className="backdrop-glow absolute inset-0" />
      <div aria-hidden className="grid-floor absolute" />
      <div aria-hidden className="scanlines absolute inset-0" />
      {CORNERS.map((position) => (
        <div
          key={position}
          aria-hidden
          className={cx("absolute size-10 border-accent/60", position)}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center">
        <Eyebrow>{SITE_NAME}</Eyebrow>

        <Heading as="h1" size="display" className="mt-6">
          <span className="glitch-text block sm:inline" data-text="Coming">
            Coming
          </span>{" "}
          <span
            className="glitch-text block text-accent sm:inline"
            data-text="Soon"
          >
            Soon
          </span>
        </Heading>

        <Text size="lg" className="mt-6 max-w-lg">
          A game development studio. Our new game launches in
        </Text>

        <div className="mt-6">
          <Countdown launchAt={LAUNCH_AT} initialRemaining={remaining} />
        </div>
      </div>
    </main>
  );
}
