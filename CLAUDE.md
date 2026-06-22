# Galata — project context for Claude Code

@AGENTS.md

> The line above imports AGENTS.md, which carries a critical note: this project
> runs **Next.js 16 + React 19 + Tailwind v4**, newer than older training data.
> Before writing framework code, read the bundled docs in
> `node_modules/next/dist/docs/` rather than relying on memory.

## How to work with the maintainer

The maintainer is a **product designer becoming a design engineer**; Galata is
their open-source portfolio project. Two standing rules:

- **Explain everything in simple language and define technical terms** the first
  time they appear. Don't assume an engineering background.
- **Act as a senior product designer AND a skeptical senior engineer** — push
  back on vague specs, surface trade-offs, recommend rather than just list.

## What this is

An open-source design system for AI agents that take CONSEQUENTIAL ACTIONS
(moving money, sending messages, changing systems) — not another chat UI kit.
Audience: design engineers and AI-product teams. This is also a portfolio
project, so craft is the bar.

## The thesis (everything serves this)

Consequence is a visual property. Every agent output belongs to one of four
REGISTERS, and the design system encodes which one through contrast, weight,
density, and motion:

- QUIET — reasoning / scratch work. Recessive, on-demand. (e.g. ThinkingBlock)
- MEDIUM — actions the agent took on its own: tool calls, retrievals, status.
  Scannable, neutral. (e.g. ToolCall, AgentStatus, Citation)
- LOUD — the answer. Highest contrast, primary. (e.g. Message)
- INTERRUPT — actions needing human judgment. Distinct, weighty, BLOCKING,
  and deliberately NOT part of the stream. (e.g. ApprovalGate, Interrupt)

Governing rule: the human is never surprised by an action.

## Locked decisions

- Tool calls are COLLAPSED by default, expandable to inputs/outputs.
- Approvals LEAVE THE STREAM — they render as a distinct blocking surface,
  never as an inline message bubble, never as a full-screen modal.
- Tokens encode the registers. Components pick a register; never hardcode hex.
- Light + dark, and accessibility, are required from day one — not deferred.
  Consequential controls (ApprovalGate, Interrupt) must be fully keyboard- and
  screen-reader-safe.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 (CSS-first
`@theme` tokens in app/globals.css) · Radix primitives · CVA ·
cn() = clsx + tailwind-merge. No `src/` dir; the `@/` import alias is the root.
Distribution is copy-paste (shadcn-style); components live in
`components/galata/`. No monorepo, no `packages/`, no CLI, no Storybook in v1.

## Conventions

- Design STATES, not screens. Every component implements all its states.
- Restraint over flash. Reference points: Linear, Vercel, Anthropic.
- When you make a real design choice, append it to design/decisions.md.
- Definition of done for any component: all states; correct register + tokens;
  light/dark; keyboard + ARIA + focus; reduced-motion-safe; in the demo/gallery;
  rationale logged.

## Not now (do not build unless asked)

Monorepo, `packages/`, Style Dictionary, registry/CLI, ADR status workflow,
premium/fintech tier, AI authoring pipelines.
