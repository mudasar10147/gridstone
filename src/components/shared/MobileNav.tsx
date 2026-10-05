"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { IconButton } from "@/components/ui/IconButton";

export interface MobileNavProps {
  /** Menu contents, rendered on the server and passed through. */
  children: ReactNode;
}

/**
 * Disclosure menu for small screens. It is an inline panel, not a modal, so it
 * does not trap focus; Escape closes it and returns focus to the toggle.
 */
export function MobileNav({ children }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      toggleRef.current?.focus();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <IconButton
        ref={toggleRef}
        icon={isOpen ? "close" : "menu"}
        label={isOpen ? "Close menu" : "Open menu"}
        variant="outline"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((open) => !open)}
      />

      {/* Clicks are delegated so following any link inside closes the menu. */}
      <div
        id={panelId}
        hidden={!isOpen}
        onClick={(event) => {
          if (event.target instanceof Element && event.target.closest("a")) {
            setIsOpen(false);
          }
        }}
        className="absolute inset-x-0 top-full mt-2 rounded-panel border border-border-subtle bg-surface p-3 shadow-glow-cool"
      >
        {children}
      </div>
    </div>
  );
}
