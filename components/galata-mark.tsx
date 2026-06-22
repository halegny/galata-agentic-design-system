import { cn } from "@/lib/utils";

/**
 * The Galata brand mark: the tower glyph on its own, in the accent color.
 *
 * No tile, no fill behind it. The tower is drawn in `currentColor` and tinted
 * with the accent token, so it tracks the theme. The viewBox is cropped tight
 * to the glyph so it sits at full size next to the wordmark. Size it with a
 * `size-*` class (defaults to 20px tall).
 */
export function GalataMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="6.3 5.5 11.4 13.5"
      className={cn("size-5 text-accent", className)}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
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
