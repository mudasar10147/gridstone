export interface Game {
  id: string;
  title: string;
  /** Short genre/hook words, shown as "Build · Manage · Dominate". */
  tags: string[];
  /** Share of players who liked the game, 0–100. */
  likePercent: number;
  activePlayers: number;
  image: {
    src: string;
    alt: string;
  };
  playUrl: string;
  detailsUrl: string;
  /** Chart position, when the game is ranked. */
  rank?: number;
}
