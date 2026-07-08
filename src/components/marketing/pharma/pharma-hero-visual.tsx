import { Pill, TrendingUp, ShieldCheck, ArrowUpRight } from "lucide-react";
import { IllustrativeBadge } from "@/components/shared/illustrative";

/** Illustrative top-market bars for the hero intelligence card. */
const MARKETS = [
  { label: "United States", pct: 100, tint: "var(--chart-1)" },
  { label: "Germany", pct: 78, tint: "var(--chart-3)" },
  { label: "Brazil", pct: 61, tint: "var(--chart-2)" },
  { label: "Japan", pct: 47, tint: "var(--chart-6)" },
  { label: "South Africa", pct: 33, tint: "var(--chart-5)" },
];

/**
 * Decorative, glassy "molecule → market" intelligence card for the pharma
 * hero. Purely illustrative — the badge makes that explicit. Uses design
 * tokens only; ambient float respects reduced motion via the global rule.
 */
export function PharmaHeroVisual() {
  return (
    <div className="relative">
      {/* Ambient glow blobs behind the card */}
      <div
        className="animate-float absolute -left-10 -top-10 size-40 rounded-full bg-primary/20 blur-3xl"
        aria-hidden
      />
      <div
        className="animate-float absolute -bottom-12 -right-8 size-48 rounded-full bg-[var(--chart-2)]/20 blur-3xl"
        style={{ animationDelay: "1.5s" }}
        aria-hidden
      />

      <div className="relative rounded-2xl border border-white/60 bg-background/70 p-5 shadow-lg backdrop-blur-xl sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Pill className="size-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-navy">
                HS 3004 · Medicaments
              </p>
              <p className="text-xs text-muted">Import demand by market</p>
            </div>
          </div>
          <IllustrativeBadge />
        </div>

        {/* Top markets bar list */}
        <ul className="mt-5 space-y-3" aria-label="Illustrative top import markets">
          {MARKETS.map((m) => (
            <li key={m.label} className="flex items-center gap-3">
              <span className="w-28 shrink-0 truncate text-xs font-medium text-muted-strong">
                {m.label}
              </span>
              <span className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                <span
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ width: `${m.pct}%`, backgroundColor: m.tint }}
                />
              </span>
            </li>
          ))}
        </ul>

        {/* Insight strip */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-surface/60 p-3">
            <div className="flex items-center gap-1.5 text-success">
              <TrendingUp className="size-4" aria-hidden />
              <span className="text-xs font-semibold">Rising demand</span>
            </div>
            <p className="mt-1 text-lg font-bold text-navy">Brazil</p>
            <p className="text-xs text-muted">Sustained 4-quarter activity</p>
          </div>
          <div className="rounded-xl border border-border bg-surface/60 p-3">
            <div className="flex items-center gap-1.5 text-primary">
              <ShieldCheck className="size-4" aria-hidden />
              <span className="text-xs font-semibold">Evidence-led</span>
            </div>
            <p className="mt-1 text-lg font-bold text-navy">High</p>
            <p className="text-xs text-muted">Confidence · data to Q1 2026</p>
          </div>
        </div>

        {/* Footer action hint */}
        <div className="mt-4 flex items-center justify-between rounded-xl bg-navy px-4 py-3">
          <span className="text-sm font-medium text-white/90">
            12 active buyers identified
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#bfe0ff]">
            View buyers
            <ArrowUpRight className="size-4" aria-hidden />
          </span>
        </div>
      </div>
    </div>
  );
}
