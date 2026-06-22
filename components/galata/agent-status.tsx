import { cn } from "@/lib/utils";

export type StepStatus = "pending" | "active" | "done" | "failed";

export interface AgentStatusStep {
  label: string;
  status: StepStatus;
}

export interface AgentStatusProps {
  steps: AgentStatusStep[];
  /** Optional eyebrow above the steps, e.g. "Working" or the overall task. */
  title?: string;
  className?: string;
}

/**
 * AgentStatus — MEDIUM register.
 *
 * What the agent is doing across multi-step work, as a calm vertical timeline.
 * Only the active step is emphasised; done steps recede, pending steps stay
 * muted — so "where is it now" reads at a glance without competing with the
 * answer. Reuses the status language (green done · accent active · muted
 * pending · red failed). See design/decisions.md.
 */
export function AgentStatus({ steps, title, className }: AgentStatusProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius)] border border-medium-border bg-medium-surface px-4 py-3.5",
        className,
      )}
    >
      {title && (
        <p className="mb-3 text-[0.6875rem] font-medium uppercase tracking-wide text-medium-fg-muted">
          {title}
        </p>
      )}
      <ol>
        {steps.map((step, i) => {
          const last = i === steps.length - 1;
          return (
            <li key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <StepIcon status={step.status} />
                {!last && (
                  <div
                    className={cn(
                      "my-1 w-px flex-1",
                      step.status === "done" ? "bg-status-success/40" : "bg-medium-border",
                    )}
                  />
                )}
              </div>
              <span
                className={cn(
                  "text-sm",
                  last ? "pb-0" : "pb-3",
                  step.status === "active" && "font-medium text-medium-fg",
                  step.status === "done" && "text-medium-fg-muted",
                  step.status === "pending" && "text-medium-fg-muted",
                  step.status === "failed" && "font-medium text-status-danger",
                )}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function StepIcon({ status }: { status: StepStatus }) {
  const box = "flex h-4 w-4 shrink-0 items-center justify-center";
  switch (status) {
    case "done":
      return (
        <span className={cn(box, "text-status-success")}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
      );
    case "active":
      return (
        <span className={cn(box, "text-accent")}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin motion-reduce:animate-none" aria-hidden="true">
            <path d="M12 3a9 9 0 1 0 9 9" />
          </svg>
        </span>
      );
    case "failed":
      return (
        <span className={cn(box, "text-status-danger")}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </span>
      );
    case "pending":
      return (
        <span className={cn(box, "text-medium-fg-muted")}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
          </svg>
        </span>
      );
  }
}
