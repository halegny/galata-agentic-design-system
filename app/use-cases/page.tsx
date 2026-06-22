import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { ExternalLinkIcon } from "@/components/icons";

const CASES = [
  {
    href: "/demo",
    industry: "Finance",
    scenario: "Pay an overdue vendor balance",
    action: "Wire $40,000",
  },
  {
    href: "/use-cases/devops",
    industry: "DevOps",
    scenario: "Reclaim capacity on a cluster",
    action: "Drop a production database",
  },
  {
    href: "/use-cases/legal",
    industry: "Legal",
    scenario: "Act on overdue invoices",
    action: "Send a binding breach notice",
  },
  {
    href: "/use-cases/healthcare",
    industry: "Healthcare",
    scenario: "Treat an infection",
    action: "Order a medication",
  },
  {
    href: "/use-cases/support",
    industry: "Customer support",
    scenario: "Resolve a double charge",
    action: "Issue a refund",
  },
];

export default function UseCasesIndex() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <header className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Use cases
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            One system, four registers — across very different stakes. Each run
            shows the same components handling a consequential action in a
            different industry, and pausing for a human before the irreversible
            moment.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {CASES.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            target="_blank"
            rel="noreferrer"
            className="group rounded-[var(--radius)] border border-medium-border bg-medium-surface p-4 transition-colors hover:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <p className="text-[0.6875rem] font-medium uppercase tracking-wide text-medium-fg-muted">
              {c.industry}
            </p>
            <p className="mt-1.5 text-base font-medium text-medium-fg">
              {c.scenario}
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent">
              {c.action}
              <ExternalLinkIcon />
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
