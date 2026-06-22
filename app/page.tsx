import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const USE_CASES = [
  { href: "/demo", industry: "Finance", action: "Wire $40,000" },
  { href: "/use-cases/devops", industry: "DevOps", action: "Drop a production database" },
  { href: "/use-cases/legal", industry: "Legal", action: "Send a binding notice" },
  { href: "/use-cases/healthcare", industry: "Healthcare", action: "Order a medication" },
  { href: "/use-cases/support", industry: "Customer support", action: "Issue a refund" },
];

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      {/* Top bar */}
      <nav className="flex items-center justify-between">
        <span className="text-sm font-semibold tracking-tight text-foreground">
          Galata
        </span>
        <div className="flex items-center gap-4">
          <Link href="/demo" className="text-sm text-muted transition-colors hover:text-foreground">
            Demo
          </Link>
          <Link href="/use-cases" className="text-sm text-muted transition-colors hover:text-foreground">
            Use cases
          </Link>
          <a
            href="https://github.com/halegny/galata-agentic-design-system"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <ThemeToggle />
        </div>
      </nav>

      {/* Hero */}
      <header className="pt-20 pb-16">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          Open-source design system
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
          Design for agents that take
          <br className="hidden sm:block" /> consequential actions.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          Most agent interfaces treat every output the same — four paragraphs of
          reasoning and a request to wire $40,000 look identical. Galata makes{" "}
          <span className="text-foreground">consequence a visual property</span>,
          so a person always knows what deserves their attention.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Watch a live agent run
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/use-cases"
            className="inline-flex items-center rounded-[var(--radius)] border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-medium-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Explore use cases
          </Link>
        </div>
      </header>

      {/* The four registers */}
      <section className="border-t border-border pt-14">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">
          Four registers
        </h2>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
          Every agent output belongs to one. The system encodes which — through
          contrast, weight, density, and motion — so attention is allocated
          before a word is read.
        </p>

        <div className="mt-8 space-y-5">
          <RegisterRow name="Quiet" note="reasoning · recessive, on demand">
            <div className="rounded-[var(--radius)] bg-quiet-surface px-4 py-3">
              <p className="text-sm text-quiet-fg">Considering three approaches before answering…</p>
            </div>
          </RegisterRow>

          <RegisterRow name="Medium" note="actions the agent took · scannable, neutral">
            <div className="flex items-center justify-between rounded-[var(--radius)] border border-medium-border bg-medium-surface px-4 py-3">
              <span className="font-mono text-sm font-medium text-medium-fg">search_transactions</span>
              <span className="text-status-success" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              </span>
            </div>
          </RegisterRow>

          <RegisterRow name="Loud" note="the answer · highest contrast, primary">
            <p className="text-base font-medium leading-relaxed text-loud-fg">
              You have 3 overdue invoices totaling $40,000, the oldest 42 days
              past due.
            </p>
          </RegisterRow>

          <RegisterRow name="Interrupt" note="needs human judgment · weighty, blocking, leaves the stream">
            <div className="rounded-[var(--radius)] border border-interrupt-border bg-interrupt-surface px-5 py-4 shadow-interrupt">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-interrupt-fg-muted">
                Approval required
              </p>
              <p className="mt-1.5 text-sm font-semibold text-interrupt-fg">
                Approve wire transfer of $40,000 to Meridian Logistics?
              </p>
              <div className="mt-3 flex gap-2">
                <span className="rounded-[calc(var(--radius)-2px)] bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground">Approve</span>
                <span className="rounded-[calc(var(--radius)-2px)] border border-interrupt-border px-3 py-1.5 text-sm font-medium text-interrupt-fg">Reject</span>
              </div>
            </div>
          </RegisterRow>
        </div>

        <p className="mt-8 text-sm text-muted">
          Governing rule:{" "}
          <span className="text-foreground">the human is never surprised by an action.</span>
        </p>
      </section>

      {/* Use cases teaser */}
      <section className="border-t border-border pt-14 mt-16">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">
          One system, many stakes
        </h2>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
          The same components and registers, across very different consequences
          — each run pausing for a human before the irreversible moment.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {USE_CASES.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group rounded-[var(--radius)] border border-medium-border bg-medium-surface px-4 py-3 transition-colors hover:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <p className="text-[0.6875rem] font-medium uppercase tracking-wide text-medium-fg-muted">
                {c.industry}
              </p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-medium-fg">
                {c.action}
                <span className="text-accent transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Components */}
      <section className="border-t border-border pt-14 mt-16">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">Components</h2>
        <p className="mt-1 text-sm text-muted">
          Organized by the register they belong to. Each links to a live preview.
        </p>
        <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <ComponentGroup
            register="Quiet"
            items={[{ name: "ThinkingBlock", href: "/thinking-block" }]}
          />
          <ComponentGroup
            register="Loud"
            items={[{ name: "Message", href: "/message" }]}
          />
          <ComponentGroup
            register="Medium"
            items={[
              { name: "ToolCall", href: "/tool-call" },
              { name: "AgentStatus", href: "/agent-status" },
              { name: "Citation / SourceList", href: "/citation" },
            ]}
          />
          <ComponentGroup
            register="Interrupt"
            items={[
              { name: "ApprovalGate", href: "/approval-gate" },
              { name: "Interrupt", href: "/interrupt" },
            ]}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 border-t border-border pt-6 pb-4 text-sm text-muted">
        <p>
          The reasoning behind every decision lives in the design log. MIT
          licensed.
        </p>
        <p className="mt-2 text-xs text-muted">
          Named for the Galata Tower — a thing built to watch over what matters.
        </p>
      </footer>
    </div>
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
    <div className="grid gap-2 sm:grid-cols-[8rem_1fr] sm:gap-6">
      <div className="pt-1">
        <p className="text-sm font-semibold text-foreground">{name}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted">{note}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

function ComponentGroup({
  register,
  items,
}: {
  register: string;
  items: { name: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-[0.6875rem] font-medium uppercase tracking-wide text-muted">
        {register}
      </p>
      <ul className="mt-2 space-y-1.5">
        {items.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              className="group inline-flex items-center gap-1.5 text-sm text-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:underline"
            >
              {it.name}
              <span className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
