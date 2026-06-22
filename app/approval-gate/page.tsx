"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  ApprovalGate,
  type ApprovalStatus,
} from "@/components/galata/approval-gate";

type State = "idle" | ApprovalStatus;

export default function ApprovalGatePage() {
  const [state, setState] = useState<State>("idle");

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16">
      <header className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            ApprovalGate
          </h1>
          <p className="mt-1 text-sm text-muted">
            Interrupt register. It appears, takes focus, traps Tab, and blocks
            until you decide — then de-escalates to a calm record.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <div className="space-y-4">
        {state === "idle" ? (
          <button
            type="button"
            onClick={() => setState("pending")}
            className="rounded-[var(--radius)] bg-accent px-3.5 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Trigger approval request
          </button>
        ) : (
          <ApprovalGate
            status={state}
            title="Approve wire transfer of $40,000 to Meridian Logistics?"
            action="Wire transfer of $40,000 to Meridian Logistics"
            description="This moves funds immediately and cannot be undone."
            details={[
              { label: "Amount", value: "$40,000.00" },
              { label: "Recipient", value: "Meridian Logistics" },
              { label: "From account", value: "•••• 8821" },
              { label: "Reason", value: "3 overdue invoices" },
            ]}
            onApprove={() => setState("approved")}
            onReject={() => setState("rejected")}
          />
        )}

        {(state === "approved" || state === "rejected") && (
          <button
            type="button"
            onClick={() => setState("idle")}
            className="rounded-[var(--radius)] border border-border px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground hover:bg-medium-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Reset
          </button>
        )}
      </div>

      <div className="mt-10 border-t border-border pt-6 text-sm text-muted">
        <p className="font-medium text-foreground">Try it by keyboard:</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Trigger it, then press Tab — focus cycles only between Approve and Reject.</li>
          <li>Notice focus does <em>not</em> start on Approve (no accidental commit).</li>
          <li>Decide — the gate becomes a calm “Approved / Rejected” record.</li>
        </ol>
      </div>
    </main>
  );
}
