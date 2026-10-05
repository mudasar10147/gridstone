import { Container } from "@/components/layout/Container";
import { EmptyState } from "@/components/shared/EmptyState";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { HeadingAccent } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { SECTION_IDS } from "@/constants/routes";
import { getFeaturedGames } from "../services/getFeaturedGames";
import { GameCard } from "./GameCard";
import { GameCarousel } from "./GameCarousel";

const TITLE_ID = "games-title";
// Entrance steps continue on from the hero above (which uses steps 1–4).
const HEADER_STEP = 5;
const FIRST_CARD_STEP = 6;

/** "Play our worlds": the home-page carousel of the studio's top games. */
export async function GameShowcase() {
  const games = await getFeaturedGames();

  const header = (
    <Reveal step={HEADER_STEP}>
      <SectionHeader
        eyebrow="Our top games"
        titleId={TITLE_ID}
        titleEffect="shine"
        title={
          <>
            Play <HeadingAccent layout="block">our worlds</HeadingAccent>
          </>
        }
        description="Unique games. Real communities. Always something new to explore."
      />
    </Reveal>
  );

  return (
    <section
      id={SECTION_IDS.games}
      aria-labelledby={TITLE_ID}
      className="scroll-mt-24 pt-4 pb-4"
    >
      <Container width="wide">
        {games.length === 0 ? (
          <div className="flex flex-col gap-8">
            {header}
            <EmptyState
              title="New worlds incoming"
              description="Our games will appear here soon. Join the Discord to hear first."
            />
          </div>
        ) : (
          <GameCarousel
            header={header}
            label="Top games"
            itemCount={games.length}
          >
            {games.map((game, index) => (
              <li key={game.id}>
                <Reveal
                  direction="from-right"
                  step={FIRST_CARD_STEP + index}
                  className="h-full"
                >
                  <GameCard game={game} />
                </Reveal>
              </li>
            ))}
          </GameCarousel>
        )}
      </Container>
    </section>
  );
}
