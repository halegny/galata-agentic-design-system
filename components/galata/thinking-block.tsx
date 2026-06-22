"use client";

import { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { cn } from "@/lib/utils";

export interface ThinkingBlockProps {
  /** "thinking" shows a live shimmer; "done" shows the collapsible reasoning. */
  status?: "thinking" | "done";
  /** The disclosure label when done. Default: "Reasoning". */
  label?: string;
  /** Label while thinking. Default: "Thinking…". */
  thinkingLabel?: string;
  /** Optional duration, e.g. "4s" → "Reasoning · thought for 4s". */
  duration?: string;
  /** The reasoning itself (kept recessive). Shown once done. */
  children: React.ReactNode;
  /** Start expanded. Default: collapsed (quiet is on-demand). */
  defaultOpen?: boolean;
  className?: string;
}

/**
 * ThinkingBlock — QUIET register.
 *
 * The agent's reasoning / scratch work. Recessive and available on demand — it
 * never competes with the answer. Deliberately NOT a card (that would give it
 * medium-register weight); it's a low-key inline disclosure that expands to a
 * muted aside. While the agent reasons it shows a soft "Thinking…" shimmer,
 * which settles into the disclosure once done. See design/decisions.md.
 */
export function ThinkingBlock({
  status = "done",
  label = "Reasoning",
  thinkingLabel = "Thinking…",
  duration,
  children,
  defaultOpen = false,
  className,
}: ThinkingBlockProps) {
  const [open, setOpen] = useState(defaultOpen);

  if (status === "thinking") {
    return (
      <p
        className={cn("galata-shimmer text-xs font-medium", className)}
        role="status"
      >
        {thinkingLabel}
      </p>
    );
  }

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className={className}>
      <Collapsible.Trigger
        className={cn(
          "group inline-flex items-center gap-1.5 rounded-[calc(var(--radius)-4px)] text-xs text-quiet-fg-muted",
          "transition-colors hover:text-quiet-fg",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
      >
        <ChevronIcon
          className={cn(
            "transition-transform duration-200 motion-reduce:transition-none",
            open && "rotate-90",
          )}
        />
        <span>
          {label}
          {duration && ` · thought for ${duration}`}
        </span>
      </Collapsible.Trigger>

      <Collapsible.Content className="galata-collapse">
        <div className="mt-2 border-l-2 border-medium-border pl-3 text-sm leading-relaxed text-quiet-fg">
          {children}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
