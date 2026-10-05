"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { IconButton } from "@/components/ui/IconButton";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cx } from "@/utils/cx";

const AUTOPLAY_INTERVAL_MS = 5_000;

/** `auto` follows the OS motion setting until the visitor presses pause/play. */
type PlayPreference = "auto" | "playing" | "paused";

interface ScrollState {
  canScrollBack: boolean;
  canScrollForward: boolean;
  /** Snap position currently at the left edge, 0-based. */
  position: number;
  /** Number of distinct snap positions the track can scroll through. */
  positionCount: number;
}

export interface GameCarouselProps {
  /** The section title, shown beside the track (above it on small screens). */
  header: ReactNode;
  /** Accessible name for the list of games. */
  label: string;
  itemCount: number;
  /** One <li> per game. */
  children: ReactNode;
}

function measure(track: HTMLElement): { state: ScrollState; step: number } {
  const first = track.firstElementChild;
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  const step = first instanceof HTMLElement ? first.offsetWidth + gap : 0;
  const maxScroll = track.scrollWidth - track.clientWidth;
  // A pixel of slack absorbs sub-pixel rounding at either end.
  const canScrollBack = track.scrollLeft > 1;
  const canScrollForward = track.scrollLeft < maxScroll - 1;

  return {
    step,
    state: {
      canScrollBack,
      canScrollForward,
      position: step ? Math.round(track.scrollLeft / step) : 0,
      positionCount: step ? Math.round(maxScroll / step) + 1 : 1,
    },
  };
}

function scrollTrack(
  track: HTMLElement,
  left: number,
  prefersReducedMotion: boolean,
) {
  track.scrollTo({ left, behavior: prefersReducedMotion ? "auto" : "smooth" });
}

export function GameCarousel({
  header,
  label,
  itemCount,
  children,
}: GameCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [playPreference, setPlayPreference] = useState<PlayPreference>("auto");
  // Hovering or focusing the carousel holds it still so it never moves
  // something the visitor is reading or about to click.
  const [isInteracting, setIsInteracting] = useState(false);
  // Before the first measurement, assume every card is its own position.
  const [scroll, setScroll] = useState<ScrollState>({
    canScrollBack: false,
    canScrollForward: itemCount > 1,
    position: 0,
    positionCount: itemCount,
  });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function update() {
      if (!track) return;
      setScroll(measure(track).state);
    }

    update();
    track.addEventListener("scroll", update, { passive: true });
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(track);

    return () => {
      track.removeEventListener("scroll", update);
      resizeObserver.disconnect();
    };
  }, []);

  const canAutoplay = scroll.positionCount > 1;
  const isPlaying =
    playPreference === "auto"
      ? !prefersReducedMotion
      : playPreference === "playing";

  useEffect(() => {
    if (!isPlaying || isInteracting || !canAutoplay) return;

    const id = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const { state, step } = measure(track);
      // Advance one card; after the last one, return to the start.
      const left = state.canScrollForward ? track.scrollLeft + step : 0;
      scrollTrack(track, left, prefersReducedMotion);
    }, AUTOPLAY_INTERVAL_MS);

    return () => clearInterval(id);
  }, [isPlaying, isInteracting, canAutoplay, prefersReducedMotion]);

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const left = track.scrollLeft + direction * measure(track).step;
    scrollTrack(track, left, prefersReducedMotion);
  }

  const controls = (
    // Inset by the card slant so the controls line up with the last card's
    // bottom-right corner rather than overshooting it.
    <div className="flex items-center justify-end gap-6 pr-(--card-slant)">
      {scroll.positionCount > 1 && (
        <ol aria-hidden className="flex gap-1.5">
          {Array.from({ length: scroll.positionCount }, (_, index) => (
            <li
              // Positions are a fixed sequence, so the index is the identity.
              key={index}
              className={cx(
                "h-1 w-8 rounded-full transition-colors",
                index === scroll.position ? "bg-accent" : "bg-surface-raised",
              )}
            />
          ))}
        </ol>
      )}

      <div className="flex rounded-control border border-border-strong bg-surface/70">
        {canAutoplay && (
          <IconButton
            icon={isPlaying ? "pause" : "play"}
            label={
              isPlaying
                ? "Pause automatic scrolling"
                : "Start automatic scrolling"
            }
            onClick={() => setPlayPreference(isPlaying ? "paused" : "playing")}
          />
        )}
        <IconButton
          icon="chevron-left"
          label="Previous games"
          disabled={!scroll.canScrollBack}
          onClick={() => scrollByCard(-1)}
        />
        <IconButton
          icon="chevron-right"
          label="Next games"
          disabled={!scroll.canScrollForward}
          onClick={() => scrollByCard(1)}
        />
      </div>
    </div>
  );

  return (
    // Title in a fixed first column; the track with its controls beneath
    // (right-aligned) fills the rest.
    <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-center lg:gap-10">
      {header}

      <div
        className="flex min-w-0 flex-col gap-3"
        onPointerEnter={() => setIsInteracting(true)}
        onPointerLeave={() => setIsInteracting(false)}
        onFocus={() => setIsInteracting(true)}
        onBlur={(event) => {
          const next = event.relatedTarget;
          if (!(next instanceof Node && event.currentTarget.contains(next))) {
            setIsInteracting(false);
          }
        }}
      >
        {/* relative: keeps absolutely positioned children (sr-only text) inside
            the scroll area, otherwise they widen the whole page. Item widths
            show exactly 2 (sm, lg) or 3 (xl) cards per view, minus the 1rem gaps;
            pt-1 leaves room for the cards' upward hover lift. */}
        <ul
          ref={trackRef}
          aria-label={label}
          className="scrollbar-hidden relative -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pt-1 *:w-11/12 *:flex-none *:snap-start sm:-mx-6 sm:scroll-px-6 sm:px-6 sm:*:w-[calc((100%-1rem)/2)] lg:mx-0 lg:scroll-px-0 lg:px-0 xl:*:w-[calc((100%-2rem)/3)]"
        >
          {children}
        </ul>

        {controls}
      </div>
    </div>
  );
}
