import { GAMES } from "../data/games";
import type { Game } from "../types";

/**
 * The games shown in the home-page showcase, best-ranked first. Async so a
 * real data source (CMS, Roblox API) can replace the static list without
 * touching callers.
 */
export async function getFeaturedGames(): Promise<Game[]> {
  return [...GAMES].sort(
    (a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity),
  );
}
