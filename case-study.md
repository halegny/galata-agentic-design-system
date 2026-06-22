# Galata — Designing the UI for agents that take real actions

**A design system built on one idea: not all agent output deserves the same weight. Consequence is a visual property — and most agent interfaces ignore it.**

---

> **Role** — Design & engineering (solo). Thesis, design system, tokens, and React/TypeScript components.
> **Type** — Open-source side project · [Repo](#) · [Live demo](#) · [Full write-up](#)
> **Status** — Actively built in the open. *(Replace this line with real traction once you have it — stars, adoptions, talk acceptances, inbound. Don't invent numbers; let the work earn them.)*

### In one skim

AI agents no longer just talk — they move money, send messages, and change systems. But the interfaces we give them still look like chat: a flat stream where four paragraphs of reasoning and a request to wire $40,000 carry identical visual weight. **Galata** is a design system that fixes this by encoding *consequence* into the interface — sorting every agent output into four registers (quiet, medium, loud, interrupt) so a person always knows how much attention a thing demands and is never surprised by an action. This case study is mostly about the **design decisions**, because that's where the work is.

---

## The problem

Picture a real agent run. In a single response, the agent reasons for four paragraphs, calls six tools, cites three sources, and — at the end — asks to wire $40,000 to a vendor.

Rendered the way most AI UI kits render it, all of that is the same: grey text in a vertical stream. The reasoning looks like the answer looks like the wire transfer. A human skimming the thread has no visual signal telling them *this part is just thinking* and *this part is about to move real money*. The interface had exactly one job — make the consequential thing impossible to miss — and it did the opposite.

> *[Visual: "before" screenshot — an undifferentiated agent stream where reasoning and a money-movement request look identical. This is the single most important image in the piece; make it perfect.]*

Existing kits (assistant-ui, prompt-kit, the shadcn AI collection) solve the easy half well: streaming, markdown, message bubbles. Galata is about the hard half — communicating consequence, and handing control to the human at the exact moments it matters. That gap is widest in high-stakes domains like fintech, which is where I focused.

## The insight

The core idea is that **consequence is a visual property**. Every piece of an agent's output belongs to one of four registers, and the design system encodes which one through contrast, weight, density, and motion.

- **Quiet** — reasoning and scratch work. Recessive, available on demand, never competing with the answer.
- **Medium** — actions the agent took on its own: tool calls, retrievals, status. Scannable and neutral — present enough to audit, calm enough to ignore.
- **Loud** — the answer. Highest contrast, primary placement, unmissable.
- **Interrupt** — actions that need human judgment before they happen. Deliberately *not* part of the stream. Weighty, distinct, and blocking. The governing principle: **the human is never surprised by an action.**

Everything else in the system — tokens, components, layout — exists to serve these four registers.

> *[Visual: the four-register diagram, drawn as a weight/attention ladder. Your most shareable asset — design it like a portfolio piece in its own right.]*

## The system

Components are organized by the register they belong to, which is also how the system decides whether a new component earns its place.

| Register | Components |
|----------|------------|
| Quiet | `ThinkingBlock` |
| Medium | `ToolCall`, `AgentStatus`, `Citation` / `SourceList` |
| Loud | `Message` (incl. streaming) |
| Interrupt | `ApprovalGate`, `Interrupt` (stop/cancel) |

Underneath sits a token system — neutral scale plus one accent, spacing, type, radii, light and dark from day one — where contrast and weight are defined *per register* rather than per component. Built with React, TypeScript, Tailwind, and Radix primitives.

> *[Visual: short looping state GIFs — the ToolCall lifecycle (pending → running → succeeded → failed), and the ApprovalGate appearing. Captioned, consistent, light + dark.]*

---

## The decisions

This is the part that matters. A design system is the sum of its judgment calls, so here are three of the load-bearing ones — including the options I rejected.

### 1. Approvals leave the stream

**Decision.** A consequential approval doesn't render as another message in the chat. It renders as a distinct, blocking `Interrupt` surface anchored to the action.

**What I rejected.** The common pattern is an inline approval — a message bubble with Confirm/Reject buttons. I rejected it because it inherits the weight of the stream and gets skimmed past exactly like everything else; it reintroduces the original failure. I also rejected the opposite extreme — a full-screen modal — because it destroys the surrounding context the user needs to make the decision, and it trains people to dismiss reflexively (modal fatigue makes "Confirm" a reflex, which is the worst possible outcome for a money-movement action).

**Why.** The interrupt register exists precisely for this: visually weighty and flow-blocking so it can't be missed, but anchored in context so the human can actually judge it. This is also where accessibility stops being a checkbox — a consequential control needs proper focus management, a keyboard path, and screen-reader semantics, because "approve a transaction" must be safe for everyone, not just mouse users.

### 2. `ToolCall` is collapsed by default

**Decision.** Tool calls render collapsed — showing intent and status — and expand to reveal inputs and outputs on demand.

**What I rejected.** Expanded-by-default (full transparency) turns any non-trivial agent run into a wall of JSON that buries the answer — the loud register loses to noise. Hidden-entirely is worse: it destroys auditability, and in high-stakes contexts the audit trail is the whole point.

**Why.** Tool calls are the medium register — present enough to audit, calm enough to ignore. Collapse-by-default *is* that principle expressed in a default. The answer stays loud; the trail stays available.

### 3. The token system encodes the registers, not the components

**Decision.** Contrast, weight, and elevation are defined per register at the token level. A component belongs to a register and inherits its weight, rather than being hand-styled.

**What I rejected.** Styling each component individually feels faster early on, but it guarantees drift — within a month, consequence stops being legible because every component has made its own contrast choices. A single flat neutral palette was a non-starter, since uniform styling is the exact "everything looks the same" failure the project exists to fix.

**Why.** This makes consequence a *systemic* property instead of a per-screen judgment call, and it's what lets the system grow coherently: a new component can't be added without first deciding which register it's in.

---

## Proof

> *[Embed: the composed demo — a believable agent run that streams a response, shows a tool call working, and pauses at an `ApprovalGate` before a consequential financial action. This is the payoff; it's what turns the argument from theory into something you can watch happen.]*

## What generalizes

Even without using Galata, anyone designing an agent interface can apply the underlying moves:

1. **Sort output by consequence, then style by that sort.** Decide what's quiet, medium, loud, and interrupt before you pick a single color.
2. **Take consequential actions out of the stream.** Anything irreversible should look and behave differently from everything reversible.
3. **Design the states, not the screen.** An agent UI is a state machine; pending, streaming, succeeded, failed, and awaiting-approval are each a real design problem.
4. **Make auditability a default, not a feature.** Collapse the detail, don't delete it.

## Reflection

The hardest part wasn't building components — it was resisting the pull to ship a general-purpose chat kit like everyone else. The discipline of the four registers is what made the system coherent, and constraining the scope to high-stakes agents is what gave it a reason to exist. The honest open question I'm still working through is how far the interrupt register can go before it becomes the very modal-fatigue problem it's meant to avoid — calibrating weight without crossing into alarmism is an ongoing design problem, and the decision log tracks where I've landed so far.

---

*Full reasoning behind every decision lives in the project's design log; the longer write-up goes deeper on each.*
