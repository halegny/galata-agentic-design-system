import { ThemeToggle } from "@/components/theme-toggle";
import { ToolCall } from "@/components/galata/tool-call";

/**
 * Preview for ToolCall (Phase 2). All four states with realistic fintech data,
 * so we can judge the collapsed read and the expanded detail in both themes.
 */
export default function ToolCallPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16">
      <header className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            ToolCall
          </h1>
          <p className="mt-1 text-sm text-muted">
            Medium register. Collapsed by default; expand to audit inputs and
            outputs. Click a row, or Tab to it and press Enter.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <div className="space-y-3">
        <ToolCall
          name="fetch_account_balance"
          status="pending"
          summary="queued"
        />

        <ToolCall
          name="search_transactions"
          status="running"
          summary="scanning the last 90 days"
          input={{ account_id: "acct_8821", since: "2026-03-24", limit: 100 }}
        />

        <ToolCall
          name="search_transactions"
          status="succeeded"
          summary="3 overdue invoices found"
          input={{ account_id: "acct_8821", status: "overdue" }}
          output={{
            count: 3,
            total_due: 12480.0,
            oldest_days_overdue: 42,
            invoices: ["inv_1043", "inv_1051", "inv_1078"],
          }}
        />

        <ToolCall
          name="charge_card"
          status="succeeded"
          summary="defaults to collapsed even when done"
          input={{ amount: 4200, currency: "USD", card: "tok_visa_4242" }}
          output={{ id: "ch_9f2a", status: "captured" }}
          defaultOpen
        />

        <ToolCall
          name="issue_refund"
          status="failed"
          summary="insufficient balance"
          input={{ charge_id: "ch_9f2a", amount: 4200 }}
          error="balance_insufficient: available balance $1,890.00 is less than the requested refund of $4,200.00"
        />
      </div>
    </main>
  );
}
