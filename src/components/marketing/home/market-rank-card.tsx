import Link from "next/link";
import { ArrowRight, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { Flag } from "@/components/shared/flag";
import { MarketSparkline, type TrendPoint } from "./market-sparkline";
import { RelativeMarketIndicator } from "./relative-market-indicator";
import { cn, formatCompact } from "@/lib/utils";

export interface MarketRankCardProps {
  rank: number;
  slug: string;
  name: string;
  code: string;
  region: string;
  importValue: number;
  /** Highest import value among the shown markets (for the fallback bar). */
  max: number;
  /** Illustrative monthly trend. Empty/short → relative-value fallback. */
  trend: TrendPoint[];
  /** Stagger index for the entrance animation. */
  index: number;
  /** Subtle highlight for the #1 market. */
  top?: boolean;
}

/** First-quarter vs last-quarter average change (%), from the shown series. */
function quarterChange(trend: TrendPoint[]): number {
  const n = Math.min(3, Math.floor(trend.length / 2)) || 1;
  const avg = (arr: TrendPoint[]) => arr.reduce((s, p) => s + p.value, 0) / arr.length;
  const first = avg(trend.slice(0, n));
  const last = avg(trend.slice(-n));
  return ((last - first) / (first || 1)) * 100;
}

export function MarketRankCard({
  rank,
  slug,
  name,
  code,
  region,
  importValue,
  max,
  trend,
  index,
  top = false,
}: MarketRankCardProps) {
  const hasTrend = trend.length >= 2;
  // Honest change derived from the same illustrative series shown in the
  // sparkline — first vs last quarter averages, so noisy single months don't
  // produce implausible swings.
  const pct = hasTrend ? quarterChange(trend) : null;
  const dir = pct === null ? "flat" : pct > 0.5 ? "up" : pct < -0.5 ? "down" : "flat";
  const DirIcon = dir === "up" ? TrendingUp : dir === "down" ? TrendingDown : Minus;

  return (
    <Link
      href={`/countries/${slug}`}
      aria-label={`${name}, ${region}. Import value ${formatCompact(importValue)} dollars. View market details.`}
      className={cn(
        "group block rounded-xl border p-4 transition-[box-shadow,border-color,transform] duration-200 sm:p-5",
        top
          ? "border-primary/40 bg-primary-soft/40 hover:border-primary"
          : "border-border bg-background hover:border-border-strong hover:shadow-md",
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
        {/* Left: rank · flag · name · region */}
        <div className="flex items-center gap-3 sm:w-56 sm:shrink-0">
          <span className="w-5 shrink-0 text-sm font-bold tabular-nums text-muted/70" aria-hidden>
            {String(rank).padStart(2, "0")}
          </span>
          <Flag code={code} title={name} className="h-7 w-10 shrink-0" />
          <span className="min-w-0">
            <span className="flex items-center gap-1.5">
              <span className="truncate font-semibold text-navy">{name}</span>
              {top ? (
                <span className="shrink-0 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                  Top market
                </span>
              ) : null}
            </span>
            <span className="block text-xs text-muted">{region}</span>
          </span>
        </div>

        {/* Centre: trend */}
        <div className="min-w-0 flex-1">
          {hasTrend ? (
            <MarketSparkline data={trend} label={name} index={index} />
          ) : (
            <RelativeMarketIndicator value={importValue} max={max} label={name} index={index} />
          )}
        </div>

        {/* Right: value · change · action */}
        <div className="flex items-end justify-between gap-3 sm:w-44 sm:shrink-0 sm:flex-col sm:items-end sm:justify-center sm:text-right">
          <div>
            <p className="text-base font-bold tabular-nums text-navy">
              ${formatCompact(importValue)}
            </p>
            <p className="text-xs text-muted">Import value</p>
            {pct !== null ? (
              <p
                className={cn(
                  "mt-0.5 inline-flex items-center gap-1 text-xs font-medium",
                  dir === "up" ? "text-success" : dir === "down" ? "text-danger" : "text-muted",
                )}
              >
                <DirIcon className="size-3" aria-hidden />
                {pct > 0 ? "+" : ""}
                {pct.toFixed(1)}% over 12 months
              </p>
            ) : null}
          </div>
          <span className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-primary opacity-80 transition group-hover:opacity-100">
            View market
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}
