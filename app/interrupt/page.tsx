"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Interrupt } from "@/components/galata/interrupt";

export default function InterruptPage() {
  const [state, setState] = useState<"idle" | "running" | "stopped">("idle");

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16">
      <header className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Interrupt
          </h1>
          <p className="mt-1 text-sm text-muted">
            Interrupt register. A stop control for work already in flight — the
            escape hatch. Hover Stop to see the danger intent surface.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <div className="space-y-4">
        {state === "idle" ? (
          <button
            type="button"
            onClick={() => setState("running")}
            className="rounded-[var(--radius)] bg-accent px-3.5 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Start a long task
          </button>
        ) : (
          <Interrupt
            status={state === "running" ? "running" : "stopped"}
            description="Searching transactions across 12 accounts"
            onStop={() => setState("stopped")}
          />
        )}

        {state === "stopped" && (
          <button
            type="button"
            onClick={() => setState("idle")}
            className="rounded-[var(--radius)] border border-border px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground hover:bg-medium-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Reset
          </button>
        )}
      </div>
    </main>
  );
}
