"use client";

import { useEffect, useRef, useState } from "react";
import { Message } from "@/components/galata/message";
import { ThinkingBlock } from "@/components/galata/thinking-block";
import { ToolCall } from "@/components/galata/tool-call";
import {
  ApprovalGate,
  type ApprovalStatus,
  type ApprovalDetail,
} from "@/components/galata/approval-gate";
import type { ToolStatus } from "@/components/galata/status-indicator";
import { ThemeToggle } from "@/components/theme-toggle";

type Item =
  | { id: number; kind: "thinking"; status: "thinking" | "done"; reasoning: string; duration?: string }
  | { id: number; kind: "message"; role: "user" | "assistant"; content: string; streaming?: boolean }
  | { id: number; kind: "tool"; name: string; summary?: string; status: ToolStatus; input?: unknown; output?: unknown }
  | { id: number; kind: "approval"; title: string; action: string; description?: string; details?: ApprovalDetail[]; status: ApprovalStatus };

type Phase = "idle" | "running" | "done";

const PROMPT = "Pay our outstanding balance to Meridian Logistics.";

export default function DemoPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [runKey, setRunKey] = useState(0);

  const idRef = useRef(0);
  // One active stream / approval at a time, so a single resolver slot each.
  const streamResolve = useRef<(() => void) | null>(null);
  const approvalResolve = useRef<((d: "approved" | "rejected") => void) | null>(null);

  // The "director": an async screenplay. Re-runs when runKey changes (replay),
  // and the cleanup cancels any in-flight run so a replay can't double-drive it.
  useEffect(() => {
    if (runKey === 0) return;
    let cancelled = false;
    const ok = () => !cancelled;
    const newId = () => (idRef.current += 1);
    const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    const addUser = (content: string) =>
      setItems((p) => [...p, { id: newId(), kind: "message", role: "user", content }]);

    // Shows a "Thinking…" shimmer, then settles into recessive reasoning.
    const think = async (o: { reasoning: string; ms?: number }) => {
      const ms = o.ms ?? 2400;
      const id = newId();
      setItems((p) => [...p, { id, kind: "thinking", status: "thinking", reasoning: o.reasoning }]);
      await wait(ms);
      if (!ok()) return;
      setItems((p) =>
        p.map((it) =>
          it.id === id && it.kind === "thinking"
            ? { ...it, status: "done", duration: `${Math.round(ms / 1000)}s` }
            : it,
        ),
      );
    };

    // Resolves when the streamed message finishes appearing.
    const say = (content: string) =>
      new Promise<void>((resolve) => {
        const id = newId();
        streamResolve.current = () => {
          setItems((p) =>
            p.map((it) => (it.id === id && it.kind === "message" ? { ...it, streaming: false } : it)),
          );
          resolve();
        };
        setItems((p) => [...p, { id, kind: "message", role: "assistant", content, streaming: true }]);
      });

    // Appends a running tool, then flips it to succeeded after a beat.
    const tool = async (o: {
      name: string;
      running: string;
      doneSummary: string;
      input: unknown;
      output: unknown;
      ms?: number;
    }) => {
      const id = newId();
      setItems((p) => [
        ...p,
        { id, kind: "tool", name: o.name, summary: o.running, status: "running", input: o.input },
      ]);
      await wait(o.ms ?? 1700);
      if (!ok()) return;
      setItems((p) =>
        p.map((it) =>
          it.id === id && it.kind === "tool"
            ? { ...it, status: "succeeded", summary: o.doneSummary, output: o.output }
            : it,
        ),
      );
    };

    // Resolves only when the human decides — this is what makes the run pause.
    const ask = (o: { title: string; action: string; description?: string; details: ApprovalDetail[] }) =>
      new Promise<"approved" | "rejected">((resolve) => {
        const id = newId();
        approvalResolve.current = (d) => {
          setItems((p) =>
            p.map((it) => (it.id === id && it.kind === "approval" ? { ...it, status: d } : it)),
          );
          resolve(d);
        };
        setItems((p) => [...p, { id, kind: "approval", status: "pending", ...o }]);
      });

    (async () => {
      setItems([]);
      setPhase("running");

      addUser(PROMPT);
      await wait(600);
      if (!ok()) return;

      await think({
        reasoning:
          "The user wants to pay Meridian Logistics. Before moving any money I'll confirm there are outstanding invoices, total them, and surface the oldest overdue date — then ask for approval, since this is a consequential action.",
      });
      if (!ok()) return;
      await wait(400);
      if (!ok()) return;

      await say("Let me check your account for outstanding invoices to Meridian Logistics.");
      if (!ok()) return;
      await wait(450);
      if (!ok()) return;

      await tool({
        name: "search_transactions",
        running: "scanning the last 90 days",
        doneSummary: "3 overdue invoices found",
        input: { vendor: "Meridian Logistics", status: "overdue", window: "90d" },
        output: {
          count: 3,
          total_due: 40000,
          currency: "USD",
          oldest_days_overdue: 42,
          invoices: ["inv_1043", "inv_1051", "inv_1078"],
        },
      });
      if (!ok()) return;
      await wait(500);
      if (!ok()) return;

      await say(
        "I found 3 overdue invoices to Meridian Logistics totaling $40,000 — the oldest is 42 days past due. Because this moves real money, I need your approval before sending the wire.",
      );
      if (!ok()) return;
      await wait(400);
      if (!ok()) return;

      const decision = await ask({
        title: "Approve wire transfer of $40,000 to Meridian Logistics?",
        action: "Wire transfer of $40,000 to Meridian Logistics",
        description: "This moves funds immediately and cannot be undone.",
        details: [
          { label: "Amount", value: "$40,000.00" },
          { label: "Recipient", value: "Meridian Logistics" },
          { label: "From account", value: "•••• 8821" },
          { label: "Reason", value: "3 overdue invoices" },
        ],
      });
      if (!ok()) return;
      await wait(550);
      if (!ok()) return;

      if (decision === "approved") {
        await tool({
          name: "issue_payment",
          running: "sending wire transfer",
          doneSummary: "wire sent",
          input: { amount: 40000, currency: "USD", recipient: "Meridian Logistics", account: "•••• 8821" },
          output: { id: "pay_9f2a3c", status: "sent", confirmation: "WIRE-7F2A91" },
        });
        if (!ok()) return;
        await wait(400);
        if (!ok()) return;
        await say("Done — I've sent $40,000 to Meridian Logistics. Confirmation #WIRE-7F2A91.");
      } else {
        await say(
          "Understood — I won't send the payment. The invoices remain unpaid, and nothing was charged.",
        );
      }
      if (!ok()) return;
      setPhase("done");
    })();

    return () => {
      cancelled = true;
    };
  }, [runKey]);

  const start = () => setRunKey((k) => k + 1);

  return (
    <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col px-6 py-12">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            A real agent run
          </h1>
          <p className="mt-1 text-sm text-muted">
            Watch an agent reason, act, and pause for your approval before it
            moves money. A scripted demo.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <div className="flex-1 space-y-4">
        {items.map((item) => {
          if (item.kind === "thinking") {
            return (
              <ThinkingBlock
                key={item.id}
                status={item.status}
                duration={item.duration}
              >
                {item.reasoning}
              </ThinkingBlock>
            );
          }
          if (item.kind === "message") {
            return (
              <Message
                key={item.id}
                role={item.role}
                content={item.content}
                streaming={item.streaming}
                onStreamComplete={() => streamResolve.current?.()}
              />
            );
          }
          if (item.kind === "tool") {
            return (
              <ToolCall
                key={item.id}
                name={item.name}
                status={item.status}
                summary={item.summary}
                input={item.input}
                output={item.output}
              />
            );
          }
          return (
            <ApprovalGate
              key={item.id}
              status={item.status}
              title={item.title}
              action={item.action}
              description={item.description}
              details={item.details}
              onApprove={() => approvalResolve.current?.("approved")}
              onReject={() => approvalResolve.current?.("rejected")}
            />
          );
        })}
      </div>

      <div className="mt-8">
        {phase === "idle" && (
          <button
            type="button"
            onClick={start}
            className="flex w-full items-center justify-between gap-3 rounded-[var(--radius)] border border-border bg-medium-surface px-4 py-3 text-left transition-colors hover:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span className="truncate text-sm text-muted">{PROMPT}</span>
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <SendIcon />
            </span>
          </button>
        )}
        {phase === "done" && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={start}
              className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-border px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground hover:bg-medium-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ReplayIcon />
              Replay the run
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ReplayIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
