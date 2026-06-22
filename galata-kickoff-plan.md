# Galata — Build Kickoff Plan (Claude Code + VSCode)

A step-by-step plan to start the project, written for building with Claude Code. The guiding principle, decided earlier: **build one beautiful component first and extract the system from it** — do not scaffold all the infrastructure before a single thing looks good. Get to a deployed, real-feeling demo fast; expand from there.

---

## How to work with Claude Code on this (read first)

Three habits make this go well:

1. **`CLAUDE.md` is the brain.** Claude Code automatically reads a `CLAUDE.md` in the working directory at the start of every session. Put the thesis, the locked decisions, the stack, and the conventions there, and every session stays consistent without you re-explaining. The ready-to-paste contents are in the appendix below — creating this file is step one.
2. **One component per session, one commit per component.** Don't ask for the whole library at once. Drive it component-by-component: "build `ToolCall`, all states, to the definition-of-done checklist." Review it in the browser, then commit. Small loops keep quality high and let you course-correct.
3. **Verify visually, every time.** This is a design system — the bar is how it *looks and feels*, which Claude Code can't judge. Run the dev server, look at every state in light and dark, check keyboard behavior yourself. The checklist exists so you and Claude Code share the same definition of "done."

---

## Tech decisions (locked for v1)

- **One Next.js app**, App Router — it's both your component lab *and* your deployable hero demo, and it deploys to Vercel in one click. No monorepo in v1.
- **React + TypeScript, Tailwind, Radix primitives, CVA** for variants, plus the standard `cn` helper (`clsx` + `tailwind-merge`).
- **Distribution = copy-paste** (shadcn-style: you own the code in `components/galata/`). No published npm package, no CLI in v1.
- **Tokens = CSS variables.** Tailwind v4 (current) uses CSS-first config, so the four registers live as custom properties in `globals.css` under `@theme`. If `create-next-app` gives you v3, they live in `tailwind.config.ts` instead — ask Claude Code to confirm the version and use the matching approach.

**Explicitly NOT in v1** (deferred, on purpose): monorepo / workspaces, Style Dictionary, the registry CLI, the proposed→locked ADR ceremony (a plain `decisions.md` is enough for a solo project), Storybook (optional, later), the premium fintech tier, and any AI authoring pipelines.

---

## Phase 0 — Setup (~30 min)

**Goal:** a running, version-controlled, deployed-empty Next.js app with the project context in place.

1. **Pick the project folder.** This lives somewhere new, not inside `portfolio-site`. Suggested: `~/Documents/galata` — adjust to your preference. Create it and open it in VSCode.
2. **Scaffold the app.** From inside the folder:
   ```bash
   npx create-next-app@latest .
   ```
   Choose: TypeScript **yes**, Tailwind **yes**, App Router **yes**, ESLint **yes**, `src/` directory **your call** (the plan below assumes no `src/`, adjust paths if you use it).
3. **Install the component dependencies:**
   ```bash
   npm install class-variance-authority clsx tailwind-merge
   # Radix primitives, installed per component as you need them, e.g.:
   npm install @radix-ui/react-collapsible
   ```
4. **Create the supporting files** (or have Claude Code create them):
   - `CLAUDE.md` — paste the appendix contents.
   - `design/principles.md` and `design/decisions.md` — the lightweight design log.
   - Replace the default `README.md` with the Galata README you already have.
5. **Git + GitHub:** `git init`, first commit, create the repo, push.
6. **Deploy empty to Vercel.** Connect the repo and deploy now, while it's trivial. Proving the deploy pipeline early means shipping later is friction-free.

**Done when:** the app runs locally (`npm run dev`), the repo is on GitHub, a placeholder page is live on Vercel, and `CLAUDE.md` + `design/` exist.

---

## Phase 1 — The token foundation, minimal (~half a session)

**Goal:** just enough of the four-register system to style one component. Don't build the whole token system speculatively — build what `ToolCall` will need, and let the rest emerge.

- Define a neutral scale + one accent as CSS variables, light and dark.
- Encode the **four registers** (quiet / medium / loud / interrupt) as semantic tokens — e.g. text contrast, surface, and border treatments per register — so a component picks a register rather than hand-styling.
- Add the `cn` helper in `lib/utils.ts`.
- Prove it: make a throwaway swatch render the four registers and confirm flipping a token visibly changes the output in both themes.

**Done when:** the four registers are visible as tokens in both light and dark, and changing one token changes the rendered result.

---

## Phase 2 — The hero component: `ToolCall`, end to end (~1–2 sessions)

**Goal:** one impeccable component that proves the whole thesis and becomes the reference every later component copies. This is the most important phase — don't rush it.

- Build `components/galata/tool-call.tsx` with all states: **pending → running → succeeded → failed**.
- Collapsed by default (shows intent + status), expandable to inputs/outputs — using Radix Collapsible.
- It belongs to the **medium** register; style it from register tokens, no hardcoded colors.
- Light + dark; purposeful motion on expand/collapse and on the running state; respect `prefers-reduced-motion`.
- Accessibility: keyboard-operable trigger, correct ARIA, sensible focus.
- Record the key choice in `design/decisions.md` (collapsed-by-default and why).

**Done when:** it passes the per-component checklist below, and cycling through all four states in the browser looks and feels genuinely polished in both themes.

---

## Phase 3 — The composed demo (~1–2 sessions)

**Goal:** your hero artifact — a believable agent run, not a component grid. This is what makes the thesis real and what you'll put at the top of the case study.

- Build the landing page (`app/page.tsx`) as a **fintech agent transcript**: the agent streams a response, runs a tool call (your `ToolCall`), and **pauses at an `ApprovalGate`** before a consequential action (e.g. issuing a refund or moving money).
- This forces you to build two more components to the same bar:
  - `Message` (+ streaming text) — the **loud** register.
  - `ApprovalGate` — the **interrupt** register: weighty, distinct, *leaves the stream*, with real focus management and a keyboard path (a consequential control must be safe for everyone).
- Make the approval moment the emotional peak of the page — it's the whole point.
- Deploy it.

**Done when:** a visitor can watch a realistic agent run end-to-end on the live URL, and the approval moment clearly reads as different in weight from everything around it.

---

## Phase 4 — Fill out the core set (~2–4 sessions)

**Goal:** complete the free core, each component to the same checklist, each woven into the demo or a gallery.

- `ThinkingBlock` — quiet register, collapsible reasoning.
- `Citation` / `SourceList` — medium register, provenance.
- `AgentStatus` — medium register, multi-step progress.
- `Interrupt` — interrupt register, stop/cancel control.

Add each to `design/decisions.md` as you make real choices.

**Done when:** all core components exist and pass the checklist, in light and dark.

---

## Phase 5 — Polish & ship (~1–2 sessions)

**Goal:** turn it into a portfolio-grade, shareable thing.

- Build a secondary **component gallery** page (`app/components/page.tsx`) showing every component in all states — the "matrix" reference, subordinate to the hero demo.
- Capture the assets the README and case study reference: the **before/after** comparison image, the **four-register diagram**, per-component **state GIFs**, and the composed-flow recording.
- Accessibility pass across everything (focus order, live regions for streaming, reduced-motion).
- Finalize the README with real visuals; flesh out `design/principles.md`.
- Final deploy.

**Done when:** the live site leads with the composed demo, the README has real assets (no placeholders), and the repo reads as intentional and finished.

Then: publish the case study, write the blog post, submit the talk.

---

## Per-component definition of done (the shared checklist)

Give this to Claude Code for every component:

- [ ] All states designed and implemented (not just the happy path)
- [ ] Belongs to one register; styled from register tokens; **no hardcoded hex**
- [ ] Light + dark both correct
- [ ] Keyboard accessible; focus managed; correct ARIA (live regions for streaming, focus trap/return for the approval gate)
- [ ] Motion is purposeful and respects `prefers-reduced-motion`
- [ ] Appears in the composed demo and/or the gallery
- [ ] A short rationale entry added to `design/decisions.md`
- [ ] Reviewed visually in the browser by you, in both themes

---

## Suggested file structure

```
galata/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx              # the composed hero demo (landing)
│  └─ components/page.tsx   # secondary: component gallery / states matrix
├─ components/
│  └─ galata/              # THE LIBRARY — copy-paste source of truth
│     ├─ tool-call.tsx
│     ├─ message.tsx
│     ├─ thinking-block.tsx
│     ├─ approval-gate.tsx
│     ├─ citation.tsx
│     ├─ agent-status.tsx
│     └─ interrupt.tsx
├─ lib/
│  └─ utils.ts              # cn() helper
├─ design/
│  ├─ principles.md         # the thesis, expanded
│  └─ decisions.md          # lightweight decision log
├─ app/globals.css          # tokens: the four registers as CSS vars (Tailwind v4 @theme)
├─ CLAUDE.md                # project context Claude Code reads every session
└─ README.md
```

---

## Appendix — `CLAUDE.md` starter (paste into the project root)

```markdown
# Galata — project context for Claude Code

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
Next.js (App Router) · TypeScript · Tailwind · Radix primitives · CVA ·
cn() = clsx + tailwind-merge. Distribution is copy-paste (shadcn-style);
components live in components/galata/. No monorepo, no CLI, no Storybook in v1.

## Conventions
- Design STATES, not screens. Every component implements all its states.
- Restraint over flash. Reference points: Linear, Vercel, Anthropic.
- When you make a real design choice, append it to design/decisions.md.
- Definition of done for any component: all states; correct register + tokens;
  light/dark; keyboard + ARIA + focus; reduced-motion-safe; in the demo/gallery;
  rationale logged.

## Not now (do not build unless asked)
Monorepo, Style Dictionary, registry/CLI, ADR status workflow, premium/fintech
tier, AI authoring pipelines.
```
