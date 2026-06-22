"use client";

import { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { cn } from "@/lib/utils";
import { StatusIndicator, type ToolStatus } from "./status-indicator";

export interface ToolCallProps {
  /** The function the agent called, e.g. "search_transactions". */
  name: string;
  /** Lifecycle state. Drives the status icon. */
  status: ToolStatus;
  /** Optional human-readable one-liner shown next to the name when collapsed. */
  summary?: string;
  /** Arguments passed to the tool. Objects render as formatted JSON. */
  input?: unknown;
  /** Result returned by the tool. Shown when succeeded. */
  output?: unknown;
  /** Error message. Shown when failed. */
  error?: string;
  /** Start expanded. Default: collapsed (the locked decision). */
  defaultOpen?: boolean;
  className?: string;
}

/**
 * ToolCall — MEDIUM register.
 *
 * An action the agent took on its own. Collapsed by default (shows intent +
 * status), expandable to inputs/outputs for auditing. The card stays neutral in
 * every state; only the status icon carries color. See design/decisions.md.
 */
export function ToolCall({
  name,
  status,
  summary,
  input,
  output,
  error,
  defaultOpen = false,
  className,
}: ToolCallProps) {
  const [open, setOpen] = useState(defaultOpen);

  const hasInput = input !== undefined;
  const hasOutput = status === "succeeded" && output !== undefined;
  const hasError = status === "failed" && !!error;
  const expandable = hasInput || hasOutput || hasError;

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      className={cn(
        "rounded-[var(--radius)] border border-medium-border bg-medium-surface",
        "text-medium-fg",
        className,
      )}
    >
      <Collapsible.Trigger
        disabled={!expandable}
        className={cn(
          "flex w-full items-center gap-3 px-4 py-3 text-left",
          "rounded-[var(--radius)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          expandable ? "cursor-pointer" : "cursor-default",
        )}
      >
        <StatusIndicator status={status} size={16} />

        <span className="flex min-w-0 flex-1 items-baseline gap-2">
          <span className="truncate font-mono text-sm font-medium text-medium-fg">
            {name}
          </span>
          {summary && (
            <span className="truncate text-xs text-medium-fg-muted">
              {summary}
            </span>
          )}
        </span>

        {expandable && (
          <ChevronIcon
            className={cn(
              "shrink-0 text-medium-fg-muted transition-transform duration-200 motion-reduce:transition-none",
              open && "rotate-180",
            )}
          />
        )}
      </Collapsible.Trigger>

      <Collapsible.Content className="galata-collapse">
        <div className="space-y-3 border-t border-medium-border px-4 py-3">
          {hasInput && <Section label="Input" value={input} />}
          {hasOutput && <Section label="Output" value={output} />}
          {hasError && (
            <div>
              <SectionLabel>Error</SectionLabel>
              <p className="font-mono text-xs leading-relaxed text-status-danger">
                {error}
              </p>
            </div>
          )}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

function Section({ label, value }: { label: string; value: unknown }) {
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <pre className="overflow-x-auto rounded-[calc(var(--radius)-3px)] bg-quiet-surface px-3 py-2 font-mono text-xs leading-relaxed text-medium-fg">
        {format(value)}
      </pre>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1 text-[0.6875rem] font-medium uppercase tracking-wide text-medium-fg-muted">
      {children}
    </p>
  );
}

/** Pretty-print objects as JSON; leave strings/numbers as-is. */
function format(value: unknown): string {
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
