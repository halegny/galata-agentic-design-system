import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Brand mark — Arcade direction, refined.
 *
 * The tower abstracted to its signature: a pointed cap over an open colonnade
 * of arches. Sleeker than the first pass — taller arches, an overhanging roof,
 * no heavy base block, more negative space. Three variants differ only in how
 * many arches and how thin the pillars are, which changes how "delicate" vs
 * "solid" the mark feels and how well it survives at 16px.
 */

// A — THREE ARCHES. Balanced. Slim finial, roof overhangs the colonnade,
// three tall arches on 0.7-wide pillars.
function ArcadeThree() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="2.2" r="0.62" />
      <path d="M12 3 L16 8.2 H8 Z" />
      <path
        fillRule="evenodd"
        d="M8.5 8.7 H15.5 V19.4 H8.5 Z
           M9.2 19.4 V13.8 A0.7 0.7 0 0 1 10.6 13.8 V19.4 Z
           M11.3 19.4 V13.8 A0.7 0.7 0 0 1 12.7 13.8 V19.4 Z
           M13.4 19.4 V13.8 A0.7 0.7 0 0 1 14.8 13.8 V19.4 Z"
      />
    </svg>
  );
}

// B — TWO ARCHES. The most reductive / modern. No finial, steeper cap, two
// wide arches. Most negative space, reads cleanest tiny — least "tower."
function ArcadeTwo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 6 L17.2 10.2 H6.8 Z" />
      <path
        fillRule="evenodd"
        d="M7.3 10.6 H16.7 V18.5 H7.3 Z
           M8.4 18.5 V14.5 A1.4 1.4 0 0 1 11.2 14.5 V18.5 Z
           M12.8 18.5 V14.5 A1.4 1.4 0 0 1 15.6 14.5 V18.5 Z"
      />
    </svg>
  );
}

// C — THREE SLIM. Thinner pillars + wider overhanging roof + finial. The most
// elegant / "designed," but the delicate pillars are the first to blur small.
function ArcadeSlim() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="2" r="0.58" />
      <path d="M12 2.8 L16.4 8.2 H7.6 Z" />
      <path
        fillRule="evenodd"
        d="M8.5 8.7 H15.5 V19.4 H8.5 Z
           M9.05 19.4 V13.6 A0.8 0.8 0 0 1 10.65 13.6 V19.4 Z
           M11.2 19.4 V13.6 A0.8 0.8 0 0 1 12.8 13.6 V19.4 Z
           M13.35 19.4 V13.6 A0.8 0.8 0 0 1 14.95 13.6 V19.4 Z"
      />
    </svg>
  );
}

const CANDIDATES = [
  {
    key: "three",
    name: "A · Three arches",
    note: "Balanced — finial, overhanging roof, three tall arches. Keeps the most tower character while staying clean.",
    Glyph: ArcadeThree,
  },
  {
    key: "two",
    name: "B · Two arches",
    note: "Most reductive and modern. No finial, steeper cap, lots of negative space. Reads cleanest at 16px.",
    Glyph: ArcadeTwo,
  },
  {
    key: "slim",
    name: "C · Three slim",
    note: "Most elegant — thin pillars, wide roof. The delicate pillars are the first thing to blur when tiny.",
    Glyph: ArcadeSlim,
  },
];

const SIZES = [
  { px: 16, label: "16 — favicon" },
  { px: 24, label: "24" },
  { px: 32, label: "32 — tab" },
  { px: 64, label: "64" },
];

export default function BrandPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <header className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Brand mark — Arcade, refined
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Same idea — a pointed cap over the tower&apos;s open arcade — three
            ways. Judge them big, then check the small column: a favicon lives or
            dies at 16px, and the thinner the pillars, the sooner the arches fill
            in and turn to mud.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <div className="space-y-5">
        {CANDIDATES.map(({ key, name, note, Glyph }) => (
          <section
            key={key}
            className="rounded-[var(--radius)] border border-medium-border bg-medium-surface p-5"
          >
            <div>
              <p className="text-base font-medium text-medium-fg">{name}</p>
              <p className="mt-1 max-w-md text-sm leading-relaxed text-medium-fg-muted">
                {note}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap items-end gap-8">
              {/* Hero: large, on the accent tile (how it ships) */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className="flex items-center justify-center rounded-[18px] bg-accent text-white"
                  style={{ width: 96, height: 96, padding: 22 }}
                >
                  <Glyph />
                </div>
                <span className="text-xs text-muted">96 · app tile</span>
              </div>

              {/* Size ladder on the accent tile */}
              <div className="flex items-end gap-5">
                {SIZES.map((s) => (
                  <div key={s.px} className="flex flex-col items-center gap-2">
                    <div
                      className="flex items-center justify-center rounded-[5.5px] bg-accent text-white"
                      style={{ width: s.px, height: s.px, padding: s.px * 0.2 }}
                    >
                      <Glyph />
                    </div>
                    <span className="text-[0.625rem] text-muted">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Monochrome — does the silhouette hold without color? */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className="flex items-center justify-center text-foreground"
                  style={{ width: 64, height: 64 }}
                >
                  <Glyph />
                </div>
                <span className="text-[0.625rem] text-muted">mono</span>
              </div>
            </div>
          </section>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted">
        My pick: <span className="text-foreground">A · Three arches</span> — the
        sleekest version that still reads as an arcade at small sizes. B is the
        most modern but loses the tower; C is the prettiest big but muddies tiny.
        Tell me which, and I&apos;ll wire it into the favicon and the share card.
      </p>
    </main>
  );
}
