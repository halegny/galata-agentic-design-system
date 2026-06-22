# Galata

**A design system for agents that take consequential actions.**

Most AI UI kits are built for chat. Galata is built for what comes after chat — agents that move money, send messages, change records, and touch production systems. When an agent *acts*, the interface is the last thing standing between intent and an irreversible outcome. Galata is a set of React components, design tokens, and — more than either — a point of view about how that interface should behave.

> Status: early and actively built in the open. The thesis and the foundations are here; the component set is filling in. Watching/starring is the best way to follow along.

---

## The problem

Agent interfaces have mostly inherited the shape of chat: a vertical stream of text, where every message looks roughly like every other message. That was fine when the worst an agent could do was be wrong in a sentence. It is no longer fine.

An agent today might, in a single run, reason for four paragraphs, call six tools, cite three sources, and ask to wire $40,000. Rendered as undifferentiated stream text, those things carry the same visual weight. The reasoning and the wire transfer look the same. That is a design failure with real consequences: the human skims, the weighty thing slips past, and the interface quietly did its one job badly.

Existing kits solve the easy half well — streaming, markdown, message bubbles. Galata is about the hard half: communicating **consequence**, and giving the human **control** at the exact moments it matters.

## The thesis: not all agent output deserves the same weight

Galata's core idea is that **consequence is a visual property**. Every piece of an agent's output sits in one of four registers, and the design system encodes which register it's in — through contrast, weight, density, and motion — so a person can always tell, at a glance, how much attention something demands and whether it requires a decision.

**Quiet** — reasoning, intermediate thinking, scratch work. Available on demand, recessive by default. The user can look, but it never competes with the answer.

**Medium** — actions the agent took on its own: tool calls, retrievals, status. Scannable and neutral. Present enough to audit, calm enough to ignore.

**Loud** — the answer. The thing the user actually came for. Highest contrast, primary placement, unmissable.

**Interrupt** — actions that require human judgment before they happen: approvals, confirmations, anything consequential or irreversible. These are deliberately *not* part of the stream. They are weighty, distinct, and they block. The principle behind them: **the human is never surprised by an action.**

This is the whole system. Tokens, components, and layout all exist to serve these four registers. A new component earns its place by knowing which register it belongs to.

## Principles

**Consequence is a visual property.** The amount of attention a thing demands should be legible before a word is read.

**Never surprise the human with an action.** Anything irreversible passes through an Interrupt. The default for consequential actions is to ask, not to do.

**Design states, not screens.** An agent UI is a state machine — pending, streaming, succeeded, failed, awaiting-approval. Each state is designed deliberately. The state machine *is* the work.

**Restraint over flash.** The reference points are Linear, Vercel, and Anthropic, not dashboards that mistake density for sophistication. Calm is a feature, especially when the stakes are high.

**Accessible because the stakes demand it.** Streaming text and approval gates are genuine accessibility problems — live regions, focus management, keyboard paths for consequential controls. These are handled in the core, not deferred. If a screen reader user can't safely approve a transaction, the component isn't done.

## Components

Organized by the register they belong to, because that's how the system thinks.

**Quiet**
- `ThinkingBlock` — collapsible reasoning; muted, recessive, expandable on intent.

**Medium**
- `ToolCall` — an action the agent took: pending → running → succeeded → failed, collapsed by default, expandable to inputs and outputs.
- `AgentStatus` — what the agent is doing right now, across multi-step work.
- `Citation` / `SourceList` — provenance for claims, so "where did this come from" is always answerable.

**Loud**
- `Message` — the answer, including streaming text, rendered as the primary surface.

**Interrupt**
- `ApprovalGate` — human-in-the-loop confirm/reject for consequential actions. Weighty and distinct without being alarmist.
- `Interrupt` — stop and cancel controls for work in flight.

The foundation underneath all of it: a token system (neutral scale + one accent, spacing, type, radii, light and dark from day one) that encodes the four registers as design decisions, not ad-hoc styling.

## Install

Galata follows the copy-paste model popularized by shadcn/ui — you own the code, with no upstream package to fight.

Copy the component you want from [`components/galata/`](./components/galata) into your project, along with the tokens in `app/globals.css` and the `cn()` helper in `lib/utils.ts`. You own the code — there's no package to install or fight.

Built on Next.js, React, TypeScript, Tailwind, and Radix primitives. A registry-based installer (`npx`) may come later, but it is deliberately not part of v1.

## Design rationale

The reasoning behind each decision lives in [`/design`](./design) as a running decision log — why `ToolCall` collapses by default, why approvals leave the stream, how the four registers map to specific tokens. If you only read one thing, read that. The components are the output; the thinking is the point.

## License

The core is MIT. Use it, fork it, ship it.

---

*Named for the Galata Tower — a thing built to watch over what matters.*
