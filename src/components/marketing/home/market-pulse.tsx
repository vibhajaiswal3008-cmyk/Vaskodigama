"use client";

import * as React from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Compact "trade pulse" visual that replaces a straight progress bar. A gently
 * curved blue→cyan path whose length encodes the country's relative import
 * value; a dot travels the curve when the row first enters the viewport, then a
 * soft pulse lingers on the destination node.
 *
 * Accessibility: numeric value stays visible in the row (not encoded by motion
 * alone). With prefers-reduced-motion the final curve + node render immediately
 * with no travelling dot or repeated pulse (CSS animations are zeroed globally,
 * and the SMIL <animateMotion> is gated off here).
 */
export function MarketPulse({
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
  const rawId = React.useId();
  const id = rawId.replace(/[^a-zA-Z0-9]/g, "");
  const ref = React.useRef<SVGSVGElement>(null);
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
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Normalised 0.12–1 so even the smallest market shows a readable curve.
  const n = Math.min(1, Math.max(0.12, max > 0 ? value / max : 0.12));
  const sx = 4;
  const sy = 12;
  const ex = 4 + n * 112;
  const ey = 12 - n * 8;
  const cx = (sx + ex) / 2;
  const cy = Math.min(sy, ey) - 2;
  const valuePath = `M${sx},${sy} Q${cx.toFixed(1)},${cy.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`;
  const trackPath = "M4,12 Q60,2 116,4";

  const animate = inView && !reduced;
  const show = inView || reduced;
  const delay = `${(index * 0.09).toFixed(2)}s`;

  return (
    <svg
      ref={ref}
      viewBox="0 0 120 16"
      className="mt-1.5 block w-full"
      role="img"
      aria-label={`Relative import value indicator for ${label}`}
      style={{ ["--mp-delay" as string]: delay } as React.CSSProperties}
    >
      <defs>
        <linearGradient id={`mpg-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--chart-2)" />
        </linearGradient>
      </defs>

      {/* faint full-width guide */}
      <path
        d={trackPath}
        fill="none"
        stroke="var(--border)"
        strokeWidth="1.4"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />

      {/* value curve (length encodes relative import value) */}
      <path
        id={`mpp-${id}`}
        d={valuePath}
        fill="none"
        stroke={`url(#mpg-${id})`}
        strokeWidth="2"
        strokeLinecap="round"
        pathLength={1}
        vectorEffect="non-scaling-stroke"
        className={reduced ? undefined : cn("mp-draw", animate && "mp-draw-in")}
      />

      {/* start node */}
      <circle cx={sx} cy={sy} r="1.7" fill="var(--primary)" />

      {show ? (
        <>
          {/* destination pulse ring */}
          <circle
            cx={ex}
            cy={ey}
            r="3.4"
            fill="var(--chart-2)"
            className={animate ? "mp-dest-pulse" : undefined}
            style={animate ? undefined : { opacity: 0.3 }}
          />
          {/* travelling / resting dot */}
          {animate ? (
            <circle r="2.1" fill="var(--chart-2)">
              <animateMotion
                dur="1s"
                begin={delay}
                fill="freeze"
                keyPoints="0;1"
                keyTimes="0;1"
                calcMode="linear"
              >
                <mpath href={`#mpp-${id}`} />
              </animateMotion>
            </circle>
          ) : (
            <circle cx={ex} cy={ey} r="2.1" fill="var(--chart-2)" />
          )}
        </>
      ) : null}
    </svg>
  );
}
