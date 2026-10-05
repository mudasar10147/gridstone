import { Container } from "@/components/layout/Container";
import { StatCard } from "@/components/domain/StatCard";
import { Button } from "@/components/ui/Button";
import { Heading, HeadingAccent } from "@/components/ui/Heading";
import { Image } from "@/components/ui/Image";
import { Reveal } from "@/components/ui/Reveal";
import { Text } from "@/components/ui/Text";
import { ROUTES } from "@/constants/routes";
import { EXTERNAL_LINKS, STUDIO_STATS } from "@/constants/site";

const TITLE_ID = "hero-title";
// Each side panel spans 5/12 of the viewport from md up; hidden below md, so
// the tiny fallback keeps phones from fetching a full-size image.
const SIDE_ART_SIZES = "(min-width: 768px) 42vw, 1px";

/** Home-page hero: "We build worlds" over the two mascot artworks. */
export function HeroSection() {
  return (
    <section
      aria-labelledby={TITLE_ID}
      className="relative isolate flex flex-1 flex-col justify-center overflow-hidden pt-24 pb-6 lg:pb-2"
    >
      <div aria-hidden className="hero-glow absolute inset-0 -z-10">
        {/* Art spans the full hero height so tall screens have no empty band
            under it; the hero is roughly the art's 5:4 shape at laptop sizes,
            so the cover crop stays light. */}
        <div className="mask-fade-to-right absolute inset-y-0 left-0 hidden w-5/12 animate-enter-from-left motion-reduce:animate-none md:block">
          <Image
            layout="fill"
            src="/images/hero/hero-explorer.jpg"
            alt=""
            sizes={SIDE_ART_SIZES}
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <div className="mask-fade-to-left absolute inset-y-0 right-0 hidden w-5/12 animate-enter-from-right motion-reduce:animate-none md:block">
          <Image
            layout="fill"
            src="/images/hero/hero-creator.jpg"
            alt=""
            sizes={SIDE_ART_SIZES}
            loading="eager"
          />
        </div>
        <div className="hero-vignette absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-b from-transparent to-page" />
      </div>

      <Container className="flex flex-col items-center text-center">
        <Reveal step={1}>
          <Heading as="h1" size="display" effect="shine" id={TITLE_ID}>
            We build <HeadingAccent layout="block">worlds</HeadingAccent>
          </Heading>
        </Reveal>

        <Reveal step={2} className="mt-4">
          <Text size="lg" className="max-w-xl">
            Roblox games that bring people together
          </Text>
        </Reveal>

        <Reveal step={3} className="mt-6 w-full sm:w-auto">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button href={ROUTES.games} size="lg" leadingIcon="play">
              Explore our games
            </Button>
            <Button
              href={EXTERNAL_LINKS.roblox}
              variant="secondary"
              size="lg"
              leadingIcon="roblox"
            >
              Play now on Roblox
            </Button>
          </div>
        </Reveal>

        <Reveal step={4} className="mt-5">
          <dl className="flex divide-x divide-border-strong">
            {STUDIO_STATS.map((stat) => (
              <StatCard
                key={stat.id}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
