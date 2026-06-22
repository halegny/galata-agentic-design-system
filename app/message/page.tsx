"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Message } from "@/components/galata/message";

export default function MessagePage() {
  // Bumping `run` replays the streaming message via its streamKey.
  const [run, setRun] = useState(0);

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16">
      <header className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Message
          </h1>
          <p className="mt-1 text-sm text-muted">
            Assistant = loud register (the answer). User = the human prompt.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <div className="space-y-6">
        <Message role="user" content="Pay our outstanding balance to Acme Corp." />

        <Message
          role="assistant"
          streaming
          streamKey={run}
          content="I checked your account and found 3 overdue invoices to Acme Corp totaling $40,000 — the oldest is 42 days past due. Because this moves real money, I'll need your approval before sending the wire."
        />

        <div className="pt-2">
          <button
            type="button"
            onClick={() => setRun((r) => r + 1)}
            className="rounded-[var(--radius)] border border-border px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground hover:bg-medium-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Replay streaming
          </button>
        </div>

        <div className="border-t border-border pt-6">
          <p className="mb-2 text-xs uppercase tracking-wide text-muted">
            Static (non-streaming)
          </p>
          <Message
            role="assistant"
            content="Done. I've sent $40,000 to Acme Corp. Confirmation #WIRE-7F2A91."
          />
        </div>
      </div>
    </main>
  );
}
