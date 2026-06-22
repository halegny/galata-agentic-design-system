"use client";

import { cn } from "@/lib/utils";

export interface InterruptProps {
  /** Controlled: "running" shows the stop control; "stopped" a calm record. */
  status?: "running" | "stopped";
  /** What's in flight, e.g. "Searching transactions". */
  description?: string;
  /** Stop button text. Default: "Stop". */
  label?: string;
  onStop?: () => void;
  className?: string;
}

/**
 * Interrupt — INTERRUPT register.
 *
 * A stop/cancel control for work already in flight — the always-available
 * escape hatch. Distinct from ApprovalGate (which blocks BEFORE a consequential
 * action): Interrupt halts something already running. Lighter than the gate (no
 * focus trap; it's a persistent control, not a blocking decision), but
 * interrupt-register because stopping an agent mid-action is consequential. The
 * Stop control reveals a danger tint on hover rather than sitting in alarm-red.
 * See design/decisions.md.
 */
export function Interrupt({
  status = "running",
  description = "Working…",
  label = "Stop",
  onStop,
  className,
}: InterruptProps) {
  if (status === "stopped") {
    return (
      <div
        role="status"
        className={cn(
          "flex items-center gap-2.5 rounded-[var(--radius)] border border-medium-border bg-medium-surface px-4 py-3",
          className,
        )}
      >
        <span className="text-status-danger">
          <StopIcon />
        </span>
        <span className="text-sm font-medium text-status-danger">Stopped</span>
        <span className="min-w-0 flex-1 truncate text-sm text-medium-fg-muted">
          {description}
        </span>
      </div>
    );
  }

  return (
    <div
      role="status"
      className={cn(
        "flex items-center gap-3 rounded-[var(--radius)] border border-interrupt-border bg-interrupt-surface px-4 py-2.5",
        className,
      )}
    >
      <SpinnerIcon />
      <span className="min-w-0 flex-1 truncate text-sm text-interrupt-fg">
        {description}
      </span>
      <button
        type="button"
        onClick={onStop}
        aria-label="Stop the current task"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-[calc(var(--radius)-2px)] border border-interrupt-border px-2.5 py-1 text-sm font-medium text-interrupt-fg transition-colors hover:border-status-danger hover:text-status-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-interrupt-surface"
      >
        <StopIcon />
        {label}
      </button>
    </div>
  );
}

function StopIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      className="shrink-0 animate-spin text-accent motion-reduce:animate-none"
      aria-hidden="true"
    >
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  );
}
