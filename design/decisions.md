# Galata — Decision Log

A running record of real design + engineering judgment calls, newest first.
Each entry: what was decided, what was rejected, and why. This file is the
reasoning behind the system — the components are the output, the thinking is
the point.

---

## 2026-06-22 — ToolCall: the hero component (Phase 2)

**Decided.** `ToolCall` (medium register) renders collapsed by default — status
icon + monospace function name + optional summary — and expands to Input/Output
as formatted JSON (failed calls show an Error instead). Built on Radix
Collapsible: the whole header row is the trigger, giving `aria-expanded`,
keyboard operation, and focus management for free. The card stays neutral in
every state; only the status icon carries color.

**Rejected.** Expanded-by-default (a wall of JSON buries the answer — the loud
register loses to noise). Auto-expanding failed calls (fights the medium
register's calm; the red icon already draws the eye). Hidden-entirely
(destroys auditability, which is the whole point in high-stakes contexts).

**Why.** Tool calls are medium register — "present enough to audit, calm enough
to ignore." Collapse-by-default *is* that principle expressed as a default.

**Accessibility lesson (logged on purpose).** First pass made the status icon a
`<button>` for a keyboard-focusable tooltip, which nested a button inside the
row's trigger button — invalid HTML, hydration error. Fix: a status is
*information, not an action*, so it became `<span role="img" aria-label>` with a
hover tooltip. More correct semantically, fewer Tab stops, and the status word
is still announced as part of the focused row. The wrong instinct (make
everything focusable) produced worse a11y than the right one.

---

## 2026-06-22 — Token foundation: two layers, register-driven (Phase 1)

**Decided.** A two-layer token system in `app/globals.css`:
- **Primitives** — raw palette, named by what they are (`--neutral-900`,
  `--blue-500`). Components never touch these.
- **Semantic, per register** — `--quiet-*`, `--medium-*`, `--loud-*`,
  `--interrupt-*` (surface, fg, fg-muted, border) built from primitives.
  Components pick a register; they never pick a color.

Palette: cool navy-tinted neutrals + one royal-blue accent (`#5663f5` dark /
`#4e5bf2` light), drawn from a reference dashboard the maintainer chose. Dark
theme is the hero; light is derived. Dark mode is class-based (`.dark` on
`<html>`) so a toggle can flip it live, with a no-flash script in the layout.

**Rejected.** Per-component styling (guarantees drift — the exact failure the
project exists to fix). A single flat neutral palette (the "everything looks the
same" problem). OS-only dark mode via `prefers-color-scheme` (can't be toggled
on the page, which a showcase needs).

**Why.** This makes consequence a *systemic* property: the registers live in the
tokens, so a new component can't be added without choosing a register. It also
makes the README/case-study claim literally true in code.

---

## 2026-06-22 — Interrupt weight comes from structure, not color

**Decided.** The interrupt register signals weight through a lifted surface, a
stronger border, and real elevation (shadow) — not through alarm-red.

**Rejected.** Warm amber/red caution colors (read as a warning toast; trains
reflexive dismissal). Tinting the interrupt with the brand accent (blurs the
line between "important" and "consequential").

**Why.** "Weighty and distinct without being alarmist." Structure makes it feel
*lifted out of the stream* and serious without panic — and keeps the one-accent
discipline intact.

---

## 2026-06-22 — A controlled exception to "one accent": status colors

**Decided.** Two semantic status colors — a muted green (`--status-success`) and
a restrained red (`--status-danger`) — used ONLY to signal tool-call state, and
ONLY on small icons. Status reads as: pending (neutral dot) · running (accent
spinner) · succeeded (green check) · failed (red ✕). Rendered icon-only with a
tooltip (hover + keyboard focus) and a screen-reader label; the icon SHAPE
carries the meaning so it works on touch and without color.

**Rejected.** Holding the line at one accent with neutral-only status icons
(success vs failure a half-beat slower to scan). A visible text label beside the
icon (the maintainer preferred the cleaner icon-only read).

**Why.** Status is *information*, not decoration — the one moment a person
scanning tool calls actually cares is "did it work or break?" A tiny, disciplined
exception serves that without reopening the "everything is colorful" failure.

---

## 2026-06-22 — Defer Vercel deploy until there's something to show

**Decided.** Keep the repo private on GitHub for now; do not deploy to Vercel
yet. Deploy when the hero `ToolCall` (Phase 2) or composed demo (Phase 3) looks
good — and flip the repo public in the same moment.

**Rejected.** The kickoff plan's "deploy empty early to prove the pipeline."

**Why.** The Next.js + Vercel path is extremely well-trodden and low-risk, and a
passing local `npm run build` already gives ~90% of that confidence. An empty
live URL serves nothing. A live link matters when there's something worth
sharing — so deploy then, not before.

---

## 2026-06-22 — Project setup (Phase 0)

**Decided.** One Next.js app (App Router), not a monorepo. Components live in
`components/galata/` and are distributed copy-paste (shadcn-style). Stack locked:
Next.js 16, React 19, TypeScript, Tailwind v4 (CSS-first `@theme` tokens), Radix
primitives, CVA, `cn()` helper.

**Rejected.** A monorepo with `packages/ui` (the README's earlier wording) —
over-engineering for a single-app, copy-paste library; deferred indefinitely.
Building on Node 18 — it is end-of-life; upgraded to Node 22 LTS first.

**Why.** The guiding principle is *build one beautiful component first and
extract the system from it*. A single app is both the component lab and the
deployable hero demo. Minimal infrastructure now; let the system emerge.

---

<!-- New decisions go above this line, newest first. Template:

## YYYY-MM-DD — <short title>

**Decided.** ...

**Rejected.** ...

**Why.** ...

-->
