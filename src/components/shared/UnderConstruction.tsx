import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading, HeadingAccent } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { Text } from "@/components/ui/Text";
import { ROUTES } from "@/constants/routes";
import { EXTERNAL_LINKS } from "@/constants/site";
import { cx } from "@/utils/cx";

// A 3×3 wall of stones in grid order (top row first), fire on the left and
// ice on the right like the logo. `drop` is the stacking order: the bottom row
// lands first so the wall builds upward.
const STONES = [
  { id: "top-left", tone: "fire", drop: 6 },
  { id: "top-middle", tone: "fire", drop: 7 },
  { id: "top-right", tone: "ice", drop: 8 },
  { id: "middle-left", tone: "fire", drop: 3 },
  { id: "center", tone: "ice", drop: 4 },
  { id: "middle-right", tone: "ice", drop: 5 },
  { id: "bottom-left", tone: "fire", drop: 0 },
  { id: "bottom-middle", tone: "fire", drop: 1 },
  { id: "bottom-right", tone: "ice", drop: 2 },
] as const;

const STONE_DROP_GAP_MS = 120;

const toneStyles = {
  fire: "bg-gradient-accent shadow-glow-accent",
  ice: "bg-linear-to-b from-cool-bright to-cool shadow-glow-cool",
} as const;

/** Looping "stones being stacked" animation. Static wall under reduced motion. */
function BuildingStones() {
  return (
    <div aria-hidden className="grid grid-cols-3 gap-1.5">
      {STONES.map((stone) => (
        <span
          key={stone.id}
          className={cx(
            "size-7 rounded-control animate-block-drop motion-reduce:animate-none sm:size-9",
            toneStyles[stone.tone],
          )}
          style={{ animationDelay: `${stone.drop * STONE_DROP_GAP_MS}ms` }}
        />
      ))}
    </div>
  );
}

export interface UnderConstructionProps {
  /** Name of the unfinished page, e.g. "About Us". */
  title: string;
  description: string;
}

/** Full-height placeholder for site pages that are not built yet. */
export function UnderConstruction({
  title,
  description,
}: UnderConstructionProps) {
  return (
    <section className="relative isolate flex flex-1 flex-col justify-center overflow-hidden pt-28 pb-12">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="backdrop-glow absolute inset-0" />
        <div className="grid-floor absolute" />
        <div className="scanlines absolute inset-0" />
      </div>

      <Container className="flex flex-col items-center text-center">
        <Reveal step={1}>
          <BuildingStones />
        </Reveal>

        <Reveal step={2} className="mt-8">
          <Eyebrow decoration="framed">Work in progress</Eyebrow>
        </Reveal>

        <Reveal step={3} className="mt-4">
          <Heading as="h1" size="section" effect="shine">
            {title}{" "}
            <HeadingAccent layout="block">under construction</HeadingAccent>
          </Heading>
        </Reveal>

        <Reveal step={4} className="mt-4">
          <Text size="lg" className="max-w-md">
            {description}
          </Text>
        </Reveal>

        <Reveal step={5} className="mt-6">
          <div
            aria-hidden
            className="h-2 w-56 overflow-hidden rounded-full border border-accent/40 bg-surface"
          >
            <div className="hazard-stripes size-full animate-stripes opacity-80 motion-reduce:animate-none" />
          </div>
        </Reveal>

        <Reveal step={6} className="mt-8 w-full sm:w-auto">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button href={ROUTES.home} leadingIcon="chevron-left">
              Back to home
            </Button>
            <Button
              href={EXTERNAL_LINKS.discord}
              variant="secondary"
              leadingIcon="discord"
            >
              Get updates on Discord
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
