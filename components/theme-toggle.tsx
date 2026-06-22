"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

// The theme lives on the <html> class (set before paint by the layout script).
// We read it via useSyncExternalStore and notify via a custom event on toggle —
// the correct way to subscribe to external (DOM) state, hydration-safe.
function subscribe(onChange: () => void) {
  window.addEventListener("galata-theme-change", onChange);
  return () => window.removeEventListener("galata-theme-change", onChange);
}
function isDarkNow() {
  return document.documentElement.classList.contains("dark");
}

/**
 * A light/dark toggle. The actual theme is applied before paint by the inline
 * script in app/layout.tsx; this button just flips the `.dark` class on <html>
 * and remembers the choice in localStorage.
 */
export function ThemeToggle({ className }: { className?: string }) {
  // Server snapshot is `true` (dark is the default theme), matching the layout.
  const isDark = useSyncExternalStore(subscribe, isDarkNow, () => true);

  function toggle() {
    const next = !isDarkNow();
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("galata-theme", next ? "dark" : "light");
    } catch {
      // ignore: localStorage can be unavailable (private mode, etc.)
    }
    window.dispatchEvent(new Event("galata-theme-change"));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light and dark theme"
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius)]",
        "border border-border text-muted",
        "transition-colors hover:text-foreground hover:bg-medium-surface",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      {isDark ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
