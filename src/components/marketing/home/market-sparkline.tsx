"use client";

import * as React from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn, formatCompact } from "@/lib/utils";

export interface TrendPoint {
  period: string;
  value: number;
}

/**
 * Compact sparkline for a market's illustrative monthly import-value trend.
 * Lightweight SVG (no charting dependency). The line draws once when the card
 * enters the viewport; the latest point gets a single soft pulse. Respects
 * reduced motion (renders the final chart immediately). Per-point <title>s give
 * hover tooltips; the svg aria-label describes the trend for screen readers.
 */
export function MarketSparkline({
  data,
  label,
  index = 0,
}: {
  data: TrendPoint[];
  label: string;
  index?: number;
}) {
  const reduced = useReducedMotion();
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "");
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
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const W = 190;
  const H = 44;
  const pad = 5;
  const vals = data.map((d) => d.value);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 1;
  const pts = data.map((d, i) => {
    const x = data.length === 1 ? W / 2 : (i / (data.length - 1)) * (W - 2) + 1;
    const y = H - pad - ((d.value - min) / span) * (H - pad * 2);
    return [x, y] as const;
  });
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  const area = `${line} L${last[0].toFixed(1)},${H} L${pts[0][0].toFixed(1)},${H} Z`;

  const animate = inView && !reduced;
  const delay = `${(index * 0.09).toFixed(2)}s`;
  const hidden = (cls: string) =>
    reduced ? undefined : cn(cls, animate && `${cls}-in`);
  const hiddenStyle = reduced || animate ? undefined : { opacity: 0 };

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="h-11 w-full"
      role="img"
      aria-label={`${label} import-value trend over the displayed period (illustrative).`}
      style={{ ["--spark-delay" as string]: delay } as React.CSSProperties}
    >
      <defs>
        <linearGradient id={`sa-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`sl-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--chart-2)" />
        </linearGradient>
      </defs>

      <path
        d={area}
        fill={`url(#sa-${id})`}
        className={hidden("spark-area")}
        style={hiddenStyle}
      />
      <path
        d={line}
        fill="none"
        stroke={`url(#sl-${id})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        vectorEffect="non-scaling-stroke"
        className={hidden("spark-line")}
      />

      {/* invisible hover targets with tooltips */}
      {data.map((d, i) => (
        <circle key={d.period} cx={pts[i][0]} cy={pts[i][1]} r="7" fill="transparent">
          <title>{`${d.period}: $${formatCompact(d.value)}`}</title>
        </circle>
      ))}

      {/* endpoint: one-time pulse ring + solid dot */}
      <circle
        cx={last[0]}
        cy={last[1]}
        r="3.2"
        fill="var(--chart-2)"
        className={animate ? "spark-pulse-in" : undefined}
        style={{ opacity: animate ? undefined : 0.45 }}
      />
      <circle
        cx={last[0]}
        cy={last[1]}
        r="2.6"
        fill="var(--chart-2)"
        className={hidden("spark-end")}
        style={hiddenStyle}
      />
    </svg>
  );
}
