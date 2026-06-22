"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

export interface MessageProps {
  /** "assistant" is the LOUD register (the answer). "user" is the human prompt. */
  role: "user" | "assistant";
  content: string;
  /** When true, an assistant message reveals word-by-word with a caret. */
  streaming?: boolean;
  /** Called once the streamed text has fully appeared. Drives the demo timeline. */
  onStreamComplete?: () => void;
  /** Change this to replay the stream-in animation without remounting. */
  streamKey?: string | number;
  className?: string;
}

/**
 * Message.
 *
 * - assistant → LOUD register: the answer. Highest contrast, sits on the page
 *   (no bubble), optionally streamed in.
 * - user → the human's prompt. Not an agent register; rendered as a distinct
 *   accent bubble so the human's turn reads as clearly separate from the agent.
 */
export function Message({
  role,
  content,
  streaming = false,
  onStreamComplete,
  streamKey,
  className,
}: MessageProps) {
  if (role === "user") {
    return (
      <div className={cn("flex justify-end", className)}>
        <div className="max-w-[85%] rounded-[var(--radius)] bg-accent px-4 py-2.5 text-sm leading-relaxed text-accent-foreground">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("text-loud-fg", className)}>
      {streaming ? (
        <StreamedText
          text={content}
          onComplete={onStreamComplete}
          streamKey={streamKey}
        />
      ) : (
        <p className="text-base leading-relaxed">{content}</p>
      )}
    </div>
  );
}

function StreamedText({
  text,
  onComplete,
  streamKey,
}: {
  text: string;
  onComplete?: () => void;
  streamKey?: string | number;
}) {
  // Words arrive on a steady, continuous interval (no pauses). Each fades in
  // over a long ramp (the CSS), so the reveal flows instead of stepping.
  const tokens = useMemo(() => text.match(/\S+\s*/g) ?? [text], [text]);
  const reduced = usePrefersReducedMotion();
  const [count, setCount] = useState(0);

  // Reset progress when the text or replay key changes — React's render-phase
  // pattern for "adjusting state on prop change" (no setState-in-effect, and no
  // flash of stale text before an effect could reset it).
  const [marker, setMarker] = useState({ text, streamKey });
  if (marker.text !== text || marker.streamKey !== streamKey) {
    setMarker({ text, streamKey });
    setCount(0);
  }

  // Keep onComplete current without restarting the stream when its identity
  // changes (ref writes belong in an effect, not in render).
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(() => onCompleteRef.current?.(), 250);
      return () => clearTimeout(t);
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= tokens.length) {
        clearInterval(id);
        onCompleteRef.current?.();
      }
    }, 90);
    return () => clearInterval(id);
    // streamKey lets the demo replay the stream without remounting.
  }, [tokens, reduced, streamKey]);

  const shown = reduced ? tokens.length : count;
  const done = shown >= tokens.length;

  return (
    <p className="text-base leading-relaxed">
      {/* Visual layer is decorative (aria-hidden); each word fades in on mount. */}
      <span aria-hidden="true">
        {tokens.slice(0, shown).map((tok, i) => (
          <span key={i} className={reduced ? undefined : "galata-token"}>
            {tok}
          </span>
        ))}
      </span>
      {/* Authoritative layer for screen readers: announced once, when settled. */}
      <span className="sr-only" aria-live="polite">
        {done ? text : ""}
      </span>
    </p>
  );
}

function usePrefersReducedMotion() {
  // Subscribe to the OS setting via useSyncExternalStore — the correct tool for
  // reading external browser state (no setState-in-effect, hydration-safe).
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false, // server snapshot: assume motion allowed
  );
}
