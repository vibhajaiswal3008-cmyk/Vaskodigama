"use client";

import * as React from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Counts up from 0 to `value` once, when scrolled into view. Respects reduced
 * motion (shows the final value immediately). setState only happens inside the
 * IntersectionObserver / rAF callbacks (external events), never synchronously
 * in the effect body — keeps the React Compiler lint rule happy.
 */
export function StatCountUp({
  value,
  suffix = "",
  duration = 1100,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        if (reduced) {
          setDisplay(value);
          return;
        }
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(value * eased);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduced, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {Math.round(display)}
      {suffix}
    </span>
  );
}
