import type { ReactNode } from "react";
import { cx } from "@/utils/cx";

/**
 * - `panel`: rounded rectangle.
 * - `angled`: parallelogram with slanted sides — the game-card look.
 */
export type CardShape = "panel" | "angled";

/**
 * - `stacked`: media on top, content below.
 * - `split`: media on the left, content beside it — a shorter, wider card.
 */
export type CardLayout = "stacked" | "split";

// The 1px padding on the outer layer, clipped to the same shape, draws the border.
const shapeStyles: Record<CardShape, string> = {
  panel: "rounded-panel",
  angled: "clip-angled",
};

const layoutStyles: Record<CardLayout, string> = {
  stacked: "flex-col",
  split: "flex-row",
};

export interface CardProps {
  shape?: CardShape;
  layout?: CardLayout;
  /** Lifts and lights up the border on hover — for cards that lead somewhere. */
  interactive?: boolean;
  as?: "article" | "div" | "li";
  className?: string;
  children: ReactNode;
}

export function Card({
  shape = "panel",
  layout = "stacked",
  interactive = false,
  as: Tag = "div",
  className,
  children,
}: CardProps) {
  return (
    <Tag
      // CardMedia reads data-layout so it can size itself for either layout.
      data-layout={layout}
      className={cx(
        "group/card bg-linear-to-b from-border-strong to-border-subtle p-px transition duration-200 has-[a:hover]:from-cool-bright/70",
        shapeStyles[shape],
        interactive &&
          "hover:-translate-y-1 hover:from-cool-bright/70 motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <div
        className={cx(
          "flex h-full overflow-hidden bg-surface",
          layoutStyles[layout],
          shapeStyles[shape],
        )}
      >
        {children}
      </div>
    </Tag>
  );
}

export interface CardSectionProps {
  className?: string;
  children: ReactNode;
}

/**
 * Edge-to-edge media: full width on top in `stacked` cards, a fixed share of
 * the width down the left side in `split` cards, where its inner edge is cut
 * on the same slant as the card so both sides of the image run parallel.
 */
export function CardMedia({ className, children }: CardSectionProps) {
  return (
    <div
      className={cx(
        "relative group-data-[layout=split]/card:w-1/3 group-data-[layout=split]/card:shrink-0 group-data-[layout=split]/card:clip-angled",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Padded content area. Horizontal padding clears the slant on angled cards so
 * text is never clipped by the diagonal edges; in `split` cards the left edge
 * sits against the media, so only the right side needs the clearance.
 */
export function CardBody({ className, children }: CardSectionProps) {
  return (
    <div
      className={cx(
        "flex min-w-0 flex-1 flex-col gap-3 px-card-inset pt-4 pb-5 group-data-[layout=split]/card:gap-2 group-data-[layout=split]/card:py-3 group-data-[layout=split]/card:pl-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
