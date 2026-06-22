"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

export interface Source {
  /** The source title, e.g. "Q3 Vendor Report". */
  title: string;
  /** Where it's from, e.g. a domain or system name. */
  source?: string;
  href?: string;
}

export interface CitationProps {
  /** 1-based number; matches the source's position in SourceList. */
  index: number;
  title?: string;
  source?: string;
  href?: string;
  className?: string;
}

const badgeBase =
  "inline-flex items-center justify-center rounded-[5px] border border-medium-border bg-medium-surface font-medium text-medium-fg-muted transition-colors";

/**
 * Citation — MEDIUM register.
 *
 * An inline reference marker: a small raised numbered badge at the end of a
 * claim. Calm and scannable; hover or focus reveals the source, click opens it.
 * Its number matches the source's position in SourceList. See design/decisions.md.
 */
export function Citation({ index, title, source, href, className }: CitationProps) {
  const aria =
    `Source ${index}` +
    (title ? `: ${title}` : "") +
    (source ? ` (${source})` : "");

  const badge = cn(
    badgeBase,
    "mx-0.5 h-[1.15em] min-w-[1.15em] translate-y-[-0.35em] px-[0.3em] text-[0.7em] leading-none",
    "hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
    className,
  );

  return (
    <Tooltip.Provider delayDuration={150}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={aria}
              className={badge}
            >
              {index}
            </a>
          ) : (
            <span role="note" aria-label={aria} tabIndex={0} className={badge}>
              {index}
            </span>
          )}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            sideOffset={6}
            className="z-50 max-w-xs rounded-md border border-border bg-interrupt-surface px-2.5 py-1.5 shadow-lg"
          >
            <span className="block text-xs font-medium text-foreground">
              {title ?? `Source ${index}`}
            </span>
            {source && (
              <span className="mt-0.5 block text-[0.6875rem] text-muted">
                {source}
              </span>
            )}
            <Tooltip.Arrow className="fill-interrupt-surface" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

export interface SourceListProps {
  sources: Source[];
  /** Eyebrow label. Default: "Sources". */
  title?: string;
  className?: string;
}

/**
 * SourceList — MEDIUM register.
 *
 * The collected provenance behind the answer. A compact numbered list whose
 * numbers match the inline Citations, so any claim is traceable to its source.
 */
export function SourceList({ sources, title = "Sources", className }: SourceListProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius)] border border-medium-border bg-medium-surface p-2",
        className,
      )}
    >
      <p className="px-2 pb-2 pt-1 text-[0.6875rem] font-medium uppercase tracking-wide text-medium-fg-muted">
        {title}
      </p>
      <ol className="space-y-0.5">
        {sources.map((s, i) => {
          const inner = (
            <>
              <span
                className={cn(
                  badgeBase,
                  "mt-px h-[18px] min-w-[18px] px-1 text-[0.6875rem] leading-none",
                )}
              >
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm text-medium-fg">{s.title}</span>
                {s.source && (
                  <span className="block truncate text-xs text-medium-fg-muted">
                    {s.source}
                  </span>
                )}
              </span>
            </>
          );
          const rowClass =
            "flex items-start gap-2.5 rounded-[calc(var(--radius)-3px)] px-2 py-1.5 transition-colors hover:bg-quiet-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-medium-surface";
          return (
            <li key={i}>
              {s.href ? (
                <a href={s.href} target="_blank" rel="noreferrer" className={cn(rowClass, "group")}>
                  {inner}
                </a>
              ) : (
                <div className={rowClass}>{inner}</div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
