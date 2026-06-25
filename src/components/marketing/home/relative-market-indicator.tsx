"use client";

import * as React from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { formatCompact } from "@/lib/utils";

/**
 * Fallback for markets that only have a single import value (no time series):
 * a compact horizontal bar showing the country's value relative to the highest
 * market shown, with a marker at the end. One-time fill animation; reduced
 * motion shows the final width immediately.
 */
export function RelativeMarketIndicator({
  value,
  max,
  label,
  index = 0,
}: {
  value: number;
  max: number;
  label: string;
  index?: number;
}) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const pct = Math.max(6, Math.min(100, max > 0 ? (value / max) * 100 : 6));
  const fill = reduced || inView ? pct : 0;

  return (
    <div
      ref={ref}
      className="relative h-2 w-full rounded-full bg-surface-2"
      role="img"
      aria-label={`${label} relative import value: ${formatCompact(value)} dollars.`}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-[var(--chart-2)]"
        style={{
          width: `${fill}%`,
          transition: reduced ? undefined : "width 0.7s var(--ease)",
          transitionDelay: `${(index * 0.09).toFixed(2)}s`,
        }}
      />
      <span
        className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--chart-2)] ring-2 ring-background"
        aria-hidden
        style={{
          left: `${fill}%`,
          transition: reduced ? undefined : "left 0.7s var(--ease)",
          transitionDelay: `${(index * 0.09).toFixed(2)}s`,
        }}
      />
    </div>
  );
}
