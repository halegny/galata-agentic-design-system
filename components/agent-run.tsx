"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Message } from "@/components/galata/message";
import { ThinkingBlock } from "@/components/galata/thinking-block";
import { ToolCall } from "@/components/galata/tool-call";
import { AgentStatus, type AgentStatusStep } from "@/components/galata/agent-status";
import { Interrupt } from "@/components/galata/interrupt";
import { SourceList, type Source } from "@/components/galata/citation";
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
  | { id: number; kind: "tool"; name: string; summary?: string; status: ToolStatus; input?: unknown; output?: unknown; error?: string }
  | { id: number; kind: "status"; title?: string; steps: AgentStatusStep[] }
  | { id: number; kind: "interrupt"; status: "running" | "stopped"; description: string }
  | { id: number; kind: "sources"; title?: string; sources: Source[] }
  | { id: number; kind: "approval"; title: string; action: string; description?: string; details?: ApprovalDetail[]; status: ApprovalStatus };

/** Helpers handed to a script. Each appends/updates the transcript and (where
 *  it makes sense) resolves when the matching signal fires. */
export interface RunControls {
  user(content: string): void;
  think(reasoning: string, ms?: number): Promise<void>;
  say(content: string): Promise<void>;
  tool(o: {
    name: string;
    running: string;
    doneSummary: string;
    input?: unknown;
    output?: unknown;
    ms?: number;
    fail?: boolean;
    error?: string;
  }): Promise<void>;
  status(steps: AgentStatusStep[], title?: string): { set(steps: AgentStatusStep[]): void };
  /** A long task with a live Stop control. Resolves "stopped" if the user
   *  stops it, or "completed" after ms. */
  interruptible(o: { description: string; ms?: number }): Promise<"completed" | "stopped">;
  sources(list: Source[], title?: string): void;
  ask(o: { title: string; action: string; description?: string; details: ApprovalDetail[] }): Promise<"approved" | "rejected">;
  wait(ms: number): Promise<void>;
}

export type RunScript = (c: RunControls) => Promise<void>;

export interface AgentRunProps {
  title: string;
  subtitle: string;
  /** The (canned) user prompt shown in the input bar; the script appends it. */
  prompt: string;
  /** Define this at module scope so its identity is stable across renders. */
  script: RunScript;
}

export function AgentRun({ title, subtitle, prompt, script }: AgentRunProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [runKey, setRunKey] = useState(0);

  const idRef = useRef(0);
  const streamResolve = useRef<(() => void) | null>(null);
  const approvalResolve = useRef<((d: "approved" | "rejected") => void) | null>(null);
  const interruptStop = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (runKey === 0) return;
    let aborted = false;
    const newId = () => (idRef.current += 1);
    // Resolves only if not aborted, so a replay halts the previous run's timeline.
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        setTimeout(() => {
          if (!aborted) resolve();
        }, ms);
      });

    const controls: RunControls = {
      user: (content) =>
        setItems((p) => [...p, { id: newId(), kind: "message", role: "user", content }]),

      think: async (reasoning, ms = 2400) => {
        const id = newId();
        setItems((p) => [...p, { id, kind: "thinking", status: "thinking", reasoning }]);
        await wait(ms);
        if (aborted) return;
        setItems((p) =>
          p.map((it) =>
            it.id === id && it.kind === "thinking"
              ? { ...it, status: "done", duration: `${Math.round(ms / 1000)}s` }
              : it,
          ),
        );
      },

      say: (content) =>
        new Promise<void>((resolve) => {
          const id = newId();
          streamResolve.current = () => {
            setItems((p) =>
              p.map((it) => (it.id === id && it.kind === "message" ? { ...it, streaming: false } : it)),
            );
            resolve();
          };
          setItems((p) => [...p, { id, kind: "message", role: "assistant", content, streaming: true }]);
        }),

      tool: async (o) => {
        const id = newId();
        setItems((p) => [
          ...p,
          { id, kind: "tool", name: o.name, summary: o.running, status: "running", input: o.input },
        ]);
        await wait(o.ms ?? 1700);
        if (aborted) return;
        setItems((p) =>
          p.map((it) =>
            it.id === id && it.kind === "tool"
              ? o.fail
                ? { ...it, status: "failed", summary: o.doneSummary, error: o.error }
                : { ...it, status: "succeeded", summary: o.doneSummary, output: o.output }
              : it,
          ),
        );
      },

      status: (steps, title) => {
        const id = newId();
        setItems((p) => [...p, { id, kind: "status", steps, title }]);
        return {
          set: (next) =>
            setItems((p) =>
              p.map((it) => (it.id === id && it.kind === "status" ? { ...it, steps: next } : it)),
            ),
        };
      },

      interruptible: ({ description, ms = 4000 }) =>
        new Promise<"completed" | "stopped">((resolve) => {
          const id = newId();
          let settled = false;
          interruptStop.current = () => {
            if (settled || aborted) return;
            settled = true;
            setItems((p) =>
              p.map((it) => (it.id === id && it.kind === "interrupt" ? { ...it, status: "stopped" } : it)),
            );
            resolve("stopped");
          };
          setItems((p) => [...p, { id, kind: "interrupt", status: "running", description }]);
          setTimeout(() => {
            if (settled || aborted) return;
            settled = true;
            // Completed: the in-flight bar disappears; the script continues.
            setItems((p) => p.filter((it) => it.id !== id));
            resolve("completed");
          }, ms);
        }),

      sources: (list, title) =>
        setItems((p) => [...p, { id: newId(), kind: "sources", sources: list, title }]),

      ask: (o) =>
        new Promise<"approved" | "rejected">((resolve) => {
          const id = newId();
          approvalResolve.current = (d) => {
            setItems((p) =>
              p.map((it) => (it.id === id && it.kind === "approval" ? { ...it, status: d } : it)),
            );
            resolve(d);
          };
          setItems((p) => [...p, { id, kind: "approval", status: "pending", ...o }]);
        }),

      wait,
    };

    (async () => {
      setItems([]);
      setPhase("running");
      try {
        await script(controls);
      } catch {
        // a script error shouldn't crash the page
      }
      if (aborted) return;
      setPhase("done");
    })();

    return () => {
      aborted = true;
    };
  }, [runKey, script]);

  const start = () => setRunKey((k) => k + 1);

  return (
    <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col px-6 py-12">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <Link
            href="/use-cases"
            className="text-xs text-muted transition-colors hover:text-foreground"
          >
            ← Use cases
          </Link>
          <h1 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
        </div>
        <ThemeToggle />
      </header>

      <div className="flex-1 space-y-4">
        {items.map((item) => {
          switch (item.kind) {
            case "thinking":
              return (
                <ThinkingBlock key={item.id} status={item.status} duration={item.duration}>
                  {item.reasoning}
                </ThinkingBlock>
              );
            case "message":
              return (
                <Message
                  key={item.id}
                  role={item.role}
                  content={item.content}
                  streaming={item.streaming}
                  onStreamComplete={() => streamResolve.current?.()}
                />
              );
            case "tool":
              return (
                <ToolCall
                  key={item.id}
                  name={item.name}
                  status={item.status}
                  summary={item.summary}
                  input={item.input}
                  output={item.output}
                  error={item.error}
                />
              );
            case "status":
              return <AgentStatus key={item.id} title={item.title} steps={item.steps} />;
            case "interrupt":
              return (
                <Interrupt
                  key={item.id}
                  status={item.status}
                  description={item.description}
                  onStop={() => interruptStop.current?.()}
                />
              );
            case "sources":
              return <SourceList key={item.id} title={item.title} sources={item.sources} />;
            case "approval":
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
          }
        })}
      </div>

      <div className="mt-8">
        {phase === "idle" && (
          <button
            type="button"
            onClick={start}
            className="flex w-full items-center justify-between gap-3 rounded-[var(--radius)] border border-border bg-medium-surface px-4 py-3 text-left transition-colors hover:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span className="truncate text-sm text-muted">{prompt}</span>
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
