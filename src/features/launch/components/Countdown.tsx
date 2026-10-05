"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const UNITS = [
  { label: "Days", ms: 86_400_000 },
  { label: "Hours", ms: 3_600_000 },
  { label: "Minutes", ms: 60_000 },
  { label: "Seconds", ms: 1_000 },
] as const;

const TICK_MS = 1_000;
const UNLOCK_RETRY_MS = 5_000;

function splitDuration(remaining: number) {
  let rest = Math.max(0, remaining);
  return UNITS.map(({ label, ms }) => {
    const value = Math.floor(rest / ms);
    rest -= value * ms;
    return { label, value };
  });
}

export interface CountdownProps {
  launchAt: number;
  /** Computed on the server so the first client render matches the HTML. */
  initialRemaining: number;
}

export function Countdown({ launchAt, initialRemaining }: CountdownProps) {
  const router = useRouter();
  const [remaining, setRemaining] = useState(initialRemaining);

  useEffect(() => {
    const tick = () => setRemaining(launchAt - Date.now());
    tick();
    const id = setInterval(tick, TICK_MS);
    return () => clearInterval(id);
  }, [launchAt]);

  // Once time is up, ask the server for the unlocked page. Keep retrying in
  // case this device's clock runs slightly ahead of the server's.
  const hasEnded = remaining <= 0;
  useEffect(() => {
    if (!hasEnded) return;
    router.refresh();
    const id = setInterval(() => router.refresh(), UNLOCK_RETRY_MS);
    return () => clearInterval(id);
  }, [hasEnded, router]);

  return (
    <div
      role="timer"
      aria-label="Time until launch"
      className="flex gap-2 sm:gap-4"
    >
      {splitDuration(remaining).map(({ label, value }) => (
        <div
          key={label}
          className="flex w-18 flex-col items-center rounded-control border border-accent/40 bg-page/60 py-3 backdrop-blur-sm sm:w-24 sm:py-4"
        >
          <span className="font-display text-3xl font-black text-text-primary tabular-nums italic sm:text-5xl">
            {String(value).padStart(2, "0")}
          </span>
          <span className="mt-1 font-heading text-xs font-semibold tracking-widest text-text-muted uppercase">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
