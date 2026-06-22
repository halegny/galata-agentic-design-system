"use client";

import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { AgentStatus, type StepStatus } from "@/components/galata/agent-status";

const LABELS = [
  "Search transactions",
  "Review overdue invoices",
  "Request approval",
  "Issue payment",
];

export default function AgentStatusPage() {
  // `current` = index of the active step; === LABELS.length means all done.
  const [current, setCurrent] = useState(0);
  const [runKey, setRunKey] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset to the start on replay (render-phase, not in an effect).
  const [prevRun, setPrevRun] = useState(runKey);
  if (prevRun !== runKey) {
    setPrevRun(runKey);
    setCurrent(0);
  }

  useEffect(() => {
    timer.current = setInterval(() => {
      setCurrent((c) => {
        if (c >= LABELS.length) {
          if (timer.current) clearInterval(timer.current);
          return c;
        }
        return c + 1;
      });
    }, 1400);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [runKey]);

  const steps = LABELS.map((label, i) => ({
    label,
    status: (i < current ? "done" : i === current ? "active" : "pending") as StepStatus,
  }));

  return (
    <main className="mx-auto w-full max-w-xl px-6 py-16">
      <header className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            AgentStatus
          </h1>
          <p className="mt-1 text-sm text-muted">
            Medium register. Multi-step progress as a calm timeline — only the
            active step is emphasised.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <AgentStatus title="Working" steps={steps} />

      <button
        type="button"
        onClick={() => setRunKey((k) => k + 1)}
        className="mt-6 rounded-[var(--radius)] border border-border px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground hover:bg-medium-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Replay
      </button>
    </main>
  );
}
