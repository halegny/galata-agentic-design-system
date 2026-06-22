"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

export type ToolStatus = "pending" | "running" | "succeeded" | "failed";

const META: Record<ToolStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "text-medium-fg-muted" },
  running: { label: "Running", color: "text-accent" },
  succeeded: { label: "Succeeded", color: "text-status-success" },
  failed: { label: "Failed", color: "text-status-danger" },
};

/**
 * Icon-only status with a tooltip. The icon SHAPE carries the meaning (works on
 * touch and without color), the tooltip adds the precise word on hover, and
 * role="img" + aria-label exposes it to screen readers.
 *
 * It is intentionally NOT a button — a status is information, not an action —
 * so it adds no extra Tab stop and can safely nest inside other controls.
 */
export function StatusIndicator({
  status,
  size = 16,
}: {
  status: ToolStatus;
  size?: number;
}) {
  const meta = META[status];
  return (
    <Tooltip.Provider delayDuration={150}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span
            role="img"
            aria-label={meta.label}
            className={cn(
              "inline-flex items-center justify-center",
              meta.color,
            )}
          >
            <StatusIcon status={status} size={size} />
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            sideOffset={6}
            className="z-50 rounded-md border border-border bg-interrupt-surface px-2 py-1 text-xs font-medium text-foreground shadow-lg select-none"
          >
            {meta.label}
            <Tooltip.Arrow className="fill-interrupt-surface" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

function StatusIcon({ status, size }: { status: ToolStatus; size: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
  };

  switch (status) {
    case "succeeded":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    case "failed":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      );
    case "running":
      // Spinner. Stops for users who prefer reduced motion.
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin motion-reduce:animate-none">
          <path d="M12 3a9 9 0 1 0 9 9" />
        </svg>
      );
    case "pending":
      return (
        <svg {...common} fill="currentColor">
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
  }
}
