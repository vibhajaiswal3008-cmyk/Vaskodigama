import { TrendingUp } from "lucide-react";

/**
 * Original trade-intelligence hero visual: an abstract regional network with
 * route arcs and nodes, plus floating result / growth / buyer cards. Built from
 * SVG + CSS only (no images, no maps). The SVG is decorative (aria-hidden);
 * the floating cards carry readable, clearly illustrative text.
 */
export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      {/* Abstract route network */}
      <svg
        viewBox="0 0 420 340"
        className="w-full"
        role="img"
        aria-label="Abstract illustration of trade routes connecting regional nodes"
      >
        <defs>
          <linearGradient id="vdg-arc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2d8cff" />
            <stop offset="100%" stopColor="#1cc8d7" />
          </linearGradient>
        </defs>
        {/* coordinate ticks */}
        <g stroke="rgba(255,255,255,0.16)" strokeWidth="1">
          <line x1="20" y1="40" x2="20" y2="300" />
          <line x1="20" y1="300" x2="400" y2="300" />
        </g>
        {/* route arcs */}
        <g fill="none" stroke="url(#vdg-arc)" strokeWidth="2" strokeLinecap="round">
          <path className="animate-route" d="M70 250 C 150 120, 250 120, 330 70" />
          <path className="animate-route" style={{ animationDelay: "0.5s" }} d="M70 250 C 140 240, 230 220, 300 200" />
          <path className="animate-route" style={{ animationDelay: "1s" }} d="M330 70 C 360 140, 340 210, 300 200" />
        </g>
        {/* nodes */}
        <g fill="#1cc8d7">
          <circle className="animate-node" cx="70" cy="250" r="6" />
          <circle className="animate-node" style={{ animationDelay: "0.4s" }} cx="330" cy="70" r="6" />
          <circle className="animate-node" style={{ animationDelay: "0.8s" }} cx="300" cy="200" r="6" />
          <circle className="animate-node" style={{ animationDelay: "1.2s" }} cx="180" cy="150" r="4" />
        </g>
      </svg>

      {/* Floating: sample search result */}
      <div className="absolute left-0 top-2 w-56 rounded-xl border border-border bg-background p-3 shadow-lg sm:left-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted">Search result</span>
          <span className="rounded-full bg-warning-soft px-2 py-0.5 text-[10px] font-medium text-warning">Illustrative</span>
        </div>
        <p className="mt-1.5 text-sm font-semibold text-navy">Natural honey → UAE</p>
        <p className="text-xs text-muted">HS 0409 · 🇮🇳 India → 🇦🇪 UAE</p>
        <p className="mt-1.5 text-xs font-semibold text-primary">12 active buyers identified</p>
      </div>

      {/* Floating: market growth mini-card */}
      <div className="absolute bottom-2 left-4 w-44 rounded-xl border border-border bg-background p-3 shadow-lg">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Market growth</p>
        <p className="mt-1 inline-flex items-center gap-1 text-lg font-bold text-success">
          <TrendingUp className="size-4" aria-hidden /> +18.4%
        </p>
        <svg viewBox="0 0 120 32" className="mt-1 w-full" aria-hidden>
          <polyline
            fill="none"
            stroke="var(--chart-1)"
            strokeWidth="2"
            points="0,28 20,24 40,26 60,18 80,14 100,8 120,4"
          />
        </svg>
      </div>

      {/* Floating: buyer card */}
      <div className="absolute right-0 top-24 w-48 rounded-xl border border-border bg-background p-3 shadow-lg">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Top buyer</p>
        <p className="mt-1 text-sm font-semibold text-navy">Meridian Imports FZE</p>
        <p className="text-xs text-muted">🇦🇪 UAE · 9 shipments / mo</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2" aria-hidden>
          <div className="h-full w-[86%] rounded-full bg-primary" />
        </div>
        <p className="mt-1 text-[11px] text-muted">Opportunity 86 / 100</p>
      </div>
    </div>
  );
}
