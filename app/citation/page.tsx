import { ThemeToggle } from "@/components/theme-toggle";
import { Citation, SourceList } from "@/components/galata/citation";

const SOURCES = [
  { title: "Q3 Vendor Spend Report", source: "finance.internal", href: "#" },
  { title: "Accounts Payable Policy", source: "handbook.company.com", href: "#" },
  { title: "Meridian Logistics — Master Services Agreement", source: "contracts.internal", href: "#" },
];

export default function CitationPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16">
      <header className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Citation / SourceList
          </h1>
          <p className="mt-1 text-sm text-muted">
            Medium register. Inline markers make claims traceable; the source
            list collects the provenance. Hover or focus a marker.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <div className="space-y-6">
        <p className="text-base leading-relaxed text-loud-fg">
          The outstanding balance to Meridian Logistics has grown 18% since Q2
          <Citation index={1} title="Q3 Vendor Spend Report" source="finance.internal" href="#" />, and
          invoices more than 30 days overdue are eligible for immediate payment
          under policy
          <Citation index={2} title="Accounts Payable Policy" source="handbook.company.com" href="#" />.
          The current agreement sets net-30 terms with no early-payment discount
          <Citation index={3} title="Meridian Logistics — Master Services Agreement" source="contracts.internal" href="#" />.
        </p>

        <SourceList sources={SOURCES} />
      </div>
    </main>
  );
}
