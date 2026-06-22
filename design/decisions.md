# Galata — Decision Log

A running record of real design + engineering judgment calls, newest first.
Each entry: what was decided, what was rejected, and why. This file is the
reasoning behind the system — the components are the output, the thinking is
the point.

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
