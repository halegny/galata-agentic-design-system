# Galata — Decision Log

A running record of real design + engineering judgment calls, newest first.
Each entry: what was decided, what was rejected, and why. This file is the
reasoning behind the system — the components are the output, the thinking is
the point.

---

## 2026-06-22 — Citation / SourceList (Phase 4): provenance

**Decided.** A pair of medium-register components. `Citation` is an inline,
slightly-raised numbered badge at the end of a claim — hover/focus reveals the
source (tooltip), click opens it. `SourceList` is a compact numbered list whose
numbers match the inline citations, so any claim is traceable. They share one
badge style so the numbering reads as one system.

**Rejected.** Footnote-only (forces a jump to the bottom to learn anything).
Inline full-URL links (clutter the prose, break the calm). A heavy source "card"
per citation (medium register should stay scannable, not dominate).

**Why.** "Where did this come from?" must always be answerable — provenance is a
default, not a feature. Calm inline markers keep the claim readable while the
matching list makes the trail explicit. Auditability without noise.

---

## 2026-06-22 — AgentStatus (Phase 4): medium-register progress

**Decided.** `AgentStatus` shows multi-step work as a calm vertical timeline.
Each step is pending / active / done / failed; only the *active* step is
emphasised (full contrast, medium weight) while done and pending steps recede. A
connector line fills green between completed steps. Reuses the status language
(green done · accent spinner active · muted dot pending · red failed).

**Rejected.** Emphasising every step equally (would read as a loud checklist
competing for attention). A progress bar (loses the per-step legibility that
makes "where is it now" answerable).

**Why.** Medium register = "present enough to audit, calm enough to ignore." A
timeline where only the current step stands out lets a person glance and know
the state without the component shouting. It's the same restraint as ToolCall,
applied to multi-step work.

---

## 2026-06-22 — ThinkingBlock (Phase 4): the quiet register

**Decided.** `ThinkingBlock` is the QUIET register. While reasoning it shows a
soft "Thinking…" shimmer; when done it settles into a collapsed, low-key
disclosure ("Reasoning · thought for Xs") that expands to a muted, indented
aside. Collapsed by default.

**Rejected.** Rendering it as a card like ToolCall (that would give reasoning
medium-register weight and let it compete with the answer). Expanded-by-default
(reasoning would dominate). A loud spinner for the thinking state (too
attention-grabbing for quiet).

**Why.** Quiet = recessive, on-demand, never competing with the answer. So it's
deliberately not a surface — it's an inline disclosure that the eye slides past
until wanted. The shimmer signals "actively reasoning" while staying in the
quiet palette (muted base, gentle brighter band), and de-escalates to a
disclosure once settled. Reduced-motion shows static muted text.

---

## 2026-06-22 — The composed agent run (Phase 3, part 3)

**Decided.** The hero demo (`/demo` for now; promote to `/` in polish) is a
*scripted* agent run, written as an async "screenplay": `addUser → say → tool →
say → await ask → branch`. Each helper appends/updates a transcript item and
returns a promise that resolves on the right signal — `say()` on stream
complete, `tool()` after a delay, and `ask()` only on the human's decision. The
`await ask(...)` is literally what makes the run pause at the gate. It branches:
approve → issue_payment + confirmation; reject → stands down.

**Rejected.** Auto-downloading a receipt after the wire (an unrequested action —
violates the project's own "never surprise the human" rule; a download must be
*offered*). A real free-chat input (the run is scripted; a canned prompt is
honest). Building a generic timeline engine (the narrative is fixed; a readable
linear screenplay beats an abstraction here).

**Why.** This is the proof: a visitor watches consequence become a visual
property without a word of explanation — calm medium/loud stream, then the
interrupt that clearly leaves the stream. The async-screenplay shape keeps the
"director" readable and makes the pause-for-approval fall out naturally from
`await`. A run token (runKey) + cancel-on-cleanup makes replay safe.

---

## 2026-06-22 — ApprovalGate (Phase 3, part 2)

**Decided.** `ApprovalGate` (interrupt register) is a distinct, weighty,
BLOCKING surface anchored in the stream. Weight from structure — lifted surface,
strong border, elevation — never alarm-red. Pending state shows a question
(`title`), structured `details` to judge, and Approve/Reject. On resolve it
de-escalates to a calm record using `action` (a statement, since the question
phrasing reads wrong past-tense).

**Rejected.** Radix Dialog/AlertDialog — it renders a full-screen overlay with a
backdrop, which the thesis explicitly rejects (destroys context, trains
reflexive dismissal). So focus management is hand-rolled to keep the gate inline.
Auto-focusing the Approve button (an accidental Enter would commit a $40k wire).

**Why / accessibility (the point — a money-moving control must be safe for
everyone).** role="alertdialog" with labelled title + described body. When the
gate appears, focus moves to the gate itself (not Approve). Tab is trapped
between the two actions while pending — the only way out is to decide. Focus
returns to its origin on resolve. The resolved record uses role="status" so the
outcome is announced.

**Note.** aria-modal is intentionally omitted: there's no visual backdrop
inerting the page, so claiming modality would over-promise. The Tab trap plus
focus move give keyboard users the guidance without lying to assistive tech.

---

## 2026-06-22 — Message + streaming reveal (Phase 3, part 1)

**Decided.** `Message` carries two roles: `assistant` is the LOUD register (the
answer — highest contrast, sits on the page, no bubble), `user` is the human
prompt (an accent bubble, deliberately outside the register system since it
isn't agent output). Assistant text streams in **continuously, word by word**:
each word fades over a long ramp (~1.3s) while words arrive every ~90ms, so
~14 words are always mid-fade — a flowing opacity gradient, never stepping.

**Rejected.** A top-to-bottom gradient "sweep" reveal (looked smooth but is
*dishonest* — it reveals whole lines at once, not how a model actually
generates text; reads as a marketing flourish, not an agent thinking). A
whole-message blur-to-focus (appears all at once — not gradual). Word-by-word
with pauses between sentences (the "reveal-stop-wait" stutter). A blurred fade
(shimmered and tired the eye).

**Why.** Galata's thesis is legible honesty. An LLM generates text token by
token in reading order, so word-by-word streaming is the truthful representation
— and the convention users recognise as "being generated live." The craft was
in tuning it to *flow* (long overlapping fade, no pauses) so honesty didn't cost
smoothness.

**Accessibility.** The animated words are decorative (`aria-hidden`); a separate
visually-hidden live region announces the settled message once, so screen
readers aren't spammed word-by-word. Reduced-motion shows the text instantly.
Browser state (reduced-motion, theme) is read via `useSyncExternalStore`.

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
