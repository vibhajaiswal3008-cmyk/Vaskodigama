import { TrendingUp, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * Decorative, animated trade-trend visual for the hero. Pure SVG + CSS
 * (no JS) — the area line draws in, bars grow and the marker pulses. All motion
 * is disabled by the global prefers-reduced-motion rule. Figures are
 * illustrative, not real values.
 */
export function HeroChart() {
  // Illustrative monthly series (deterministic).
  const pts = [22, 30, 26, 38, 34, 48, 44, 58, 64, 60, 74, 82];
  const w = 320;
  const h = 150;
  const max = 90;
  const step = w / (pts.length - 1);
  const coords = pts.map((p, i) => [i * step, h - (p / max) * h] as const);
  const line = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c[0].toFixed(1)},${c[1].toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;

  return (
    <div className="relative">
      <div className="rounded-[20px] border border-border bg-background p-5 shadow-lg">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-navy">Global trade value</p>
            <p className="text-xs text-muted">Illustrative · last 12 months</p>
          </div>
          <Badge tone="success" className="gap-1">
            <TrendingUp className="size-3.5" aria-hidden /> +18.4%
          </Badge>
        </div>

        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="mt-4 h-36 w-full"
          role="img"
          aria-label="Illustrative upward trend in global trade value over twelve months"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="heroArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="heroLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--chart-2)" />
            </linearGradient>
          </defs>
          {/* gridlines */}
          {[0.25, 0.5, 0.75].map((g) => (
            <line key={g} x1="0" y1={h * g} x2={w} y2={h * g} stroke="var(--border)" strokeWidth="1" />
          ))}
          <path d={area} fill="url(#heroArea)" />
          <path
            d={line}
            fill="none"
            stroke="url(#heroLine)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-route"
          />
          <circle cx={coords[coords.length - 1][0]} cy={coords[coords.length - 1][1]} r="5" fill="var(--chart-2)" className="animate-node" />
        </svg>

        {/* mini KPIs */}
        <div className="mt-3 grid grid-cols-3 gap-3 border-t border-border pt-3">
          {[
            { label: "Records", value: "4.6K" },
            { label: "Markets", value: "40" },
            { label: "Avg value", value: "$182K" },
          ].map((k) => (
            <div key={k.label}>
              <p className="text-base font-bold tabular-nums text-navy">{k.value}</p>
              <p className="text-xs text-muted">{k.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* floating accent chips */}
      <div className="animate-float absolute -left-3 -top-3 hidden rounded-xl border border-border bg-background px-3 py-2 shadow-md sm:block">
        <p className="text-xs text-muted">Top buyer market</p>
        <p className="text-sm font-semibold text-navy">🇦🇪 UAE · +12%</p>
      </div>
      <div className="animate-float absolute -bottom-4 -right-3 hidden items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 shadow-md sm:flex" style={{ animationDelay: "1.2s" }}>
        <span className="flex size-7 items-center justify-center rounded-lg bg-success-soft text-success">
          <ArrowUpRight className="size-4" aria-hidden />
        </span>
        <span>
          <span className="block text-xs text-muted">New suppliers</span>
          <span className="block text-sm font-semibold text-navy">+34 this period</span>
        </span>
      </div>
    </div>
  );
}
