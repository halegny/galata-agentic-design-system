"use client";

import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/utils";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface ApprovalDetail {
  label: string;
  value: string;
}

export interface ApprovalGateProps {
  /** The decision, phrased as a question, e.g. "Approve wire transfer of $40,000?" */
  title: string;
  /** The action as a plain statement, e.g. "Wire transfer of $40,000". Shown in
   *  the resolved record (where a question would read wrong). Falls back to title. */
  action?: string;
  /** Optional context shown under the title. */
  description?: string;
  /** Structured facts the human should weigh before deciding. */
  details?: ApprovalDetail[];
  /** Controlled lifecycle. "pending" blocks and traps focus; the rest are calm. */
  status?: ApprovalStatus;
  onApprove?: () => void;
  onReject?: () => void;
  approveLabel?: string;
  rejectLabel?: string;
  className?: string;
}

/**
 * ApprovalGate — INTERRUPT register.
 *
 * A consequential action that needs human judgment. It does NOT render as a chat
 * bubble (it would get skimmed) nor a full-screen modal (destroys context, trains
 * reflexive dismissal). It's a distinct, weighty, BLOCKING surface anchored in
 * the stream. Weight comes from structure — lifted surface, strong border,
 * elevation — never alarm-red. See design/decisions.md.
 *
 * Accessibility (this is the point — a money-moving control must be safe for
 * everyone): role="alertdialog"; focus moves to the gate when it appears (never
 * onto Approve, to avoid an accidental commit); Tab is trapped between the two
 * actions while pending; focus returns on resolve.
 */
export function ApprovalGate({
  title,
  action,
  description,
  details,
  status = "pending",
  onApprove,
  onReject,
  approveLabel = "Approve",
  rejectLabel = "Reject",
  className,
}: ApprovalGateProps) {
  const titleId = useId();
  const descId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (status !== "pending") return;
    // Remember what was focused, then move focus onto the gate itself.
    prevFocusRef.current = document.activeElement as HTMLElement | null;
    containerRef.current?.focus();
    return () => {
      // On leaving "pending", return focus to where it came from (if still there).
      const prev = prevFocusRef.current;
      if (prev && prev.isConnected) prev.focus();
    };
  }, [status]);

  // Trap Tab within the gate while pending: the only way out is to decide.
  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (status !== "pending" || e.key !== "Tab") return;
    const focusables = getFocusable(containerRef.current);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === containerRef.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  if (status !== "pending") {
    const approved = status === "approved";
    return (
      <div
        role="status"
        className={cn(
          "flex items-center gap-2.5 rounded-[var(--radius)] border border-medium-border bg-medium-surface px-4 py-3",
          className,
        )}
      >
        <span className={approved ? "text-status-success" : "text-status-danger"}>
          {approved ? <CheckIcon /> : <XIcon />}
        </span>
        <span className="text-sm font-medium text-medium-fg">
          {approved ? "Approved" : "Rejected"}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm text-medium-fg-muted">
          {action ?? title}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      role="alertdialog"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className={cn(
        "rounded-[var(--radius)] border border-interrupt-border bg-interrupt-surface px-5 py-4 shadow-interrupt outline-none",
        className,
      )}
    >
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-interrupt-fg-muted">
        Approval required
      </p>
      <h3
        id={titleId}
        className="mt-1.5 text-base font-semibold leading-snug text-interrupt-fg"
      >
        {title}
      </h3>
      {description && (
        <p id={descId} className="mt-1.5 text-sm text-interrupt-fg-muted">
          {description}
        </p>
      )}

      {details && details.length > 0 && (
        <dl className="mt-3 space-y-1.5 rounded-[calc(var(--radius)-3px)] bg-quiet-surface px-3 py-2.5">
          {details.map((d) => (
            <div key={d.label} className="flex items-baseline justify-between gap-4 text-sm">
              <dt className="text-interrupt-fg-muted">{d.label}</dt>
              <dd className="font-medium tabular-nums text-interrupt-fg">{d.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onApprove}
          className="inline-flex items-center gap-1.5 rounded-[calc(var(--radius)-2px)] bg-accent px-3.5 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-interrupt-surface"
        >
          <CheckIcon />
          {approveLabel}
        </button>
        <button
          type="button"
          onClick={onReject}
          className="inline-flex items-center gap-1.5 rounded-[calc(var(--radius)-2px)] border border-interrupt-border px-3.5 py-2 text-sm font-medium text-interrupt-fg transition-colors hover:border-interrupt-fg-muted hover:bg-interrupt-fg/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-interrupt-surface"
        >
          <XIcon />
          {rejectLabel}
        </button>
      </div>
    </div>
  );
}

function getFocusable(el: HTMLElement | null): HTMLElement[] {
  if (!el) return [];
  return Array.from(
    el.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
    ),
  );
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
