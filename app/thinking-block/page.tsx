"use client";

import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThinkingBlock } from "@/components/galata/thinking-block";
import { Message } from "@/components/galata/message";

export default function ThinkingBlockPage() {
  const [status, setStatus] = useState<"idle" | "thinking" | "done">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function run() {
    if (timer.current) clearTimeout(timer.current);
    setStatus("thinking");
    timer.current = setTimeout(() => setStatus("done"), 2600);
  }

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16">
      <header className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            ThinkingBlock
          </h1>
          <p className="mt-1 text-sm text-muted">
            Quiet register. A live “Thinking…” shimmer that settles into
            recessive, on-demand reasoning — never competing with the answer.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <div className="space-y-6">
        <button
          type="button"
          onClick={run}
          className="rounded-[var(--radius)] border border-border px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground hover:bg-medium-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {status === "idle" ? "Run reasoning" : "Replay"}
        </button>

        {status !== "idle" && (
          <div className="space-y-6">
            <ThinkingBlock status={status === "thinking" ? "thinking" : "done"} duration="3s">
              The user wants to pay Meridian Logistics. I should confirm there are
              outstanding invoices before moving any money, then surface the total
              and the oldest overdue date. Since this moves real funds, I must not
              act without explicit approval.
            </ThinkingBlock>

            {status === "done" && (
              <Message
                role="assistant"
                content="You have 3 overdue invoices to Meridian Logistics totaling $40,000, the oldest 42 days past due."
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
