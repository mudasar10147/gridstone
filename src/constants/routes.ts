/** In-page anchor targets. Shared by the sections that own them and the links to them. */
export const SECTION_IDS = {
  main: "main",
  games: "games",
} as const;

export const ROUTES = {
  home: "/",
  games: "/games",
  about: "/about",
  careers: "/careers",
  community: "/community",
} as const;
