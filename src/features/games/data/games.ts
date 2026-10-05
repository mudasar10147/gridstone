import type { Game } from "../types";

// Content and figures from the design mockup. Thumbnails are low-resolution
// crops of that mockup — swap in the real key art at the same paths.
// TODO: set playUrl / detailsUrl to each game's Roblox page (not provided yet).
export const GAMES: Game[] = [
  {
    id: "block-city-tycoon",
    title: "Block City Tycoon",
    tags: ["Build", "Manage", "Dominate"],
    likePercent: 92,
    activePlayers: 124_000,
    image: {
      src: "/images/games/block-city-tycoon.jpg",
      alt: "Colourful blocky city skyline with cars on the street",
    },
    playUrl: "#",
    detailsUrl: "#",
    rank: 1,
  },
  {
    id: "aether-knights",
    title: "Aether Knights",
    tags: ["Action RPG", "Level Up", "Explore"],
    likePercent: 95,
    activePlayers: 82_000,
    image: {
      src: "/images/games/aether-knights.jpg",
      alt: "Armoured knight raising a glowing blue sword",
    },
    playUrl: "#",
    detailsUrl: "#",
  },
  {
    id: "starhaven",
    title: "Starhaven",
    tags: ["Sci-Fi Adventure", "Discover"],
    likePercent: 94,
    activePlayers: 67_000,
    image: {
      src: "/images/games/starhaven.jpg",
      alt: "Starship flying past a planet in deep space",
    },
    playUrl: "#",
    detailsUrl: "#",
  },
  {
    id: "mystery-mansion",
    title: "Mystery Mansion",
    tags: ["Horror", "Puzzle", "Survive"],
    likePercent: 90,
    activePlayers: 56_000,
    image: {
      src: "/images/games/mystery-mansion.jpg",
      alt: "Dark haunted mansion with a detective standing outside",
    },
    playUrl: "#",
    detailsUrl: "#",
  },
];
