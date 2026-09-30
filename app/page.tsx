export default function Home() {
  return (
    <main className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Backdrop */}
      <div aria-hidden className="glow" />
      <div aria-hidden className="grid-floor" />
      <div aria-hidden className="scanlines" />

      {/* HUD corner brackets */}
      <div aria-hidden className="hud-corner left-4 top-4 border-l-2 border-t-2 sm:left-8 sm:top-8" />
      <div aria-hidden className="hud-corner right-4 top-4 border-r-2 border-t-2 sm:right-8 sm:top-8" />
      <div aria-hidden className="hud-corner bottom-4 left-4 border-b-2 border-l-2 sm:bottom-8 sm:left-8" />
      <div aria-hidden className="hud-corner bottom-4 right-4 border-b-2 border-r-2 sm:bottom-8 sm:right-8" />

      <div className="relative z-10 flex flex-col items-center">
        <p className="font-mono text-xs uppercase tracking-[0.5em] text-accent sm:text-sm">
          Gridstone Productions
        </p>

        <h1 className="mt-6 font-display text-[15vw] font-black uppercase leading-[0.95] tracking-tight sm:text-[clamp(3rem,9vw,9rem)]">
          <span className="glitch block sm:inline" data-text="Coming">
            Coming
          </span>{" "}
          <span className="glitch block text-accent sm:inline" data-text="Soon">
            Soon
          </span>
        </h1>

        <p className="mt-6 max-w-md text-base text-muted sm:text-lg">
          A game development studio. Our new game launches tomorrow.
        </p>

        <div className="mt-10 w-64 sm:w-80">
          <div className="flex justify-between font-mono text-[0.7rem] uppercase tracking-[0.25em] text-muted">
            <span>Loading</span>
            <span className="blink text-accent">T-1 Day</span>
          </div>
          <div className="mt-2 h-2 border border-accent/40 p-px">
            <div className="load-bar h-full bg-accent" />
          </div>
        </div>
      </div>
    </main>
  );
}
