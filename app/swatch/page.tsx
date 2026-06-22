import { ThemeToggle } from "@/components/theme-toggle";
import { StatusIndicator } from "@/components/galata/status-indicator";

/**
 * Throwaway token swatch (Phase 1). Proves the four registers read correctly
 * in light and dark, and that they feel distinct in weight. Not a real page —
 * it gets deleted once the component gallery exists.
 */
export default function SwatchPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <header className="mb-12 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Register swatch
          </h1>
          <p className="mt-1 text-sm text-muted">
            The four registers as tokens. Toggle the theme — every value swaps
            from one source of truth.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <div className="space-y-5">
        {/* QUIET */}
        <RegisterRow
          name="Quiet"
          note="reasoning / scratch — recessive, on demand"
        >
          <div className="rounded-[var(--radius)] bg-quiet-surface px-4 py-3">
            <p className="text-sm text-quiet-fg">
              Considering three approaches before answering…
            </p>
            <p className="mt-1 text-xs text-quiet-fg-muted">
              Intermediate thinking. Present, but never competing with the answer.
            </p>
          </div>
        </RegisterRow>

        {/* MEDIUM */}
        <RegisterRow
          name="Medium"
          note="tool calls / status — scannable, neutral"
        >
          <div className="space-y-2">
            <div className="rounded-[var(--radius)] border border-medium-border bg-medium-surface px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-medium-fg">
                  search_transactions
                </p>
                <StatusIndicator status="succeeded" />
              </div>
              <p className="mt-1 text-xs text-medium-fg-muted">
                Calm enough to ignore, present enough to audit.
              </p>
            </div>
            <div className="rounded-[var(--radius)] border border-medium-border bg-medium-surface px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-medium-fg">charge_card</p>
                <StatusIndicator status="failed" />
              </div>
              <p className="mt-1 text-xs text-medium-fg-muted">
                Status reads from the icon; hover or focus it for the label.
              </p>
            </div>
            {/* Full status language preview: pending / running / succeeded / failed */}
            <div className="flex items-center gap-4 rounded-[var(--radius)] border border-medium-border bg-medium-surface px-4 py-3">
              <span className="text-xs text-medium-fg-muted">All states:</span>
              <StatusIndicator status="pending" />
              <StatusIndicator status="running" />
              <StatusIndicator status="succeeded" />
              <StatusIndicator status="failed" />
            </div>
          </div>
        </RegisterRow>

        {/* LOUD */}
        <RegisterRow name="Loud" note="the answer — highest contrast, primary">
          <div className="bg-loud-surface">
            <p className="text-base font-medium leading-relaxed text-loud-fg">
              You have three unpaid invoices totaling $12,480, the oldest 42 days
              overdue.
            </p>
            <p className="mt-1 text-sm text-loud-fg-muted">
              The thing the user actually came for. Unmissable.
            </p>
          </div>
        </RegisterRow>

        {/* INTERRUPT */}
        <RegisterRow
          name="Interrupt"
          note="approvals — weighty, distinct, leaves the stream"
        >
          <div className="rounded-[var(--radius)] border border-interrupt-border bg-interrupt-surface px-5 py-4 shadow-interrupt">
            <p className="text-sm font-semibold text-interrupt-fg">
              Approve wire transfer of $40,000 to Acme Corp?
            </p>
            <p className="mt-1 text-xs text-interrupt-fg-muted">
              Weight comes from structure — lifted surface, border, elevation —
              not from alarm-red.
            </p>
            <div className="mt-4 flex gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-[calc(var(--radius)-2px)] bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground">
                <CheckIcon />
                Approve
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-[calc(var(--radius)-2px)] border border-interrupt-border px-3 py-1.5 text-sm font-medium text-interrupt-fg">
                <XIcon />
                Reject
              </button>
            </div>
          </div>
        </RegisterRow>
      </div>
    </main>
  );
}

function CheckIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function XIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function RegisterRow({
  name,
  note,
  children,
}: {
  name: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-2 flex items-baseline gap-2">
        <h2 className="text-sm font-semibold text-foreground">{name}</h2>
        <span className="text-xs text-muted">{note}</span>
      </div>
      {children}
    </section>
  );
}
