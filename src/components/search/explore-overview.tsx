"use client";

import * as React from "react";
import {
  Ship,
  Wallet,
  Building2,
  Factory,
  Globe2,
  TrendingUp,
  Package,
  Clock,
  BarChart3,
} from "lucide-react";
import type { ExploreRecord } from "@/types/explore";
import {
  deriveTrend,
  deriveTopDestinations,
  deriveTransportModes,
  deriveBuyers,
  deriveSuppliers,
} from "./explore-data";
import { DemandChart } from "@/components/charts/charts";
import { HorizontalBars, DonutChart } from "@/components/charts/analytics-charts";
import { IllustrativeBadge } from "@/components/shared/illustrative";
import { formatCompact, formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

/* ── Metric card ──────────────────────────────────────────────────────────── */

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  onClick,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  onClick?: () => void;
  highlight?: boolean;
}) {
  const Wrap = onClick ? "button" : "div";
  return (
    <Wrap
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "flex flex-col gap-3 rounded-xl border bg-background p-5 text-left transition-shadow",
        onClick
          ? "cursor-pointer hover:border-primary hover:shadow-sm"
          : "cursor-default",
        highlight ? "border-primary" : "border-border",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <Icon className="size-4" aria-hidden />
        </span>
        {highlight && (
          <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-semibold text-primary">
            primary
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold tabular-nums text-navy">{value}</p>
        <p className="mt-0.5 text-xs font-medium text-muted">{label}</p>
        <p className="mt-1.5 text-xs text-muted">{sub}</p>
      </div>
    </Wrap>
  );
}

/* ── Insight card ─────────────────────────────────────────────────────────── */

function InsightCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className={cn("mt-1.5 text-lg font-bold", color)}>{value}</p>
      <p className="mt-0.5 text-xs text-muted">{sub}</p>
    </div>
  );
}

/* ── Overview panel ───────────────────────────────────────────────────────── */

export function ExploreOverview({
  records,
  onTabChange,
  countryName,
}: {
  records: ExploreRecord[];
  onTabChange: (tab: string) => void;
  countryName: (code: string) => string;
}) {
  const totalValue = records.reduce((a, r) => a + (r.tradeValue ?? 0), 0);
  const uniqueBuyers = new Set(records.map((r) => r.importer || r.buyer).filter(Boolean)).size;
  const uniqueSuppliers = new Set(records.map((r) => r.exporter || r.supplier).filter(Boolean)).size;
  const uniqueCountries = new Set(
    records.flatMap((r) => [r.originCountry, r.destinationCountry].filter(Boolean)),
  ).size;
  const latestDate = records.reduce((latest, r) => (r.date > latest ? r.date : latest), "");

  const trend = React.useMemo(() => deriveTrend(records), [records]);
  const topDest = React.useMemo(() => deriveTopDestinations(records), [records]);
  const modes = React.useMemo(() => deriveTransportModes(records), [records]);
  const topBuyers = React.useMemo(() => deriveBuyers(records).slice(0, 1), [records]);
  const topSuppliers = React.useMemo(() => deriveSuppliers(records).slice(0, 1), [records]);

  // Named destinations for chart labels
  const namedDest = topDest.map((d) => ({ name: countryName(d.name), value: d.value }));

  // Most common HS code
  const hsMap = new Map<string, number>();
  for (const r of records) {
    if (r.hsCode) hsMap.set(r.hsCode, (hsMap.get(r.hsCode) ?? 0) + 1);
  }
  const topHs = [...hsMap.entries()].sort((a, b) => b[1] - a[1])[0];

  if (records.length === 0) {
    return (
      <div className="py-16 text-center">
        <BarChart3 className="mx-auto size-12 text-muted/30" aria-hidden />
        <p className="mt-3 font-semibold text-navy">No data to display</p>
        <p className="mt-1 text-sm text-muted">Adjust your filters to see an overview.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics grid */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-navy">Market snapshot</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={Ship}
            label="Matching shipments"
            value={formatNumber(records.length)}
            sub={`Latest: ${formatDate(latestDate)}`}
            onClick={() => onTabChange("shipments")}
          />
          <MetricCard
            icon={Wallet}
            label="Estimated trade value"
            value={formatCurrency(totalValue)}
            sub="Sum across matching records"
          />
          <MetricCard
            icon={Building2}
            label="Active buyers"
            value={formatNumber(uniqueBuyers)}
            sub={`Across ${uniqueCountries} markets`}
            onClick={() => onTabChange("buyers")}
          />
          <MetricCard
            icon={Factory}
            label="Active suppliers"
            value={formatNumber(uniqueSuppliers)}
            sub="In matching shipments"
            onClick={() => onTabChange("suppliers")}
          />
        </div>
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Trend */}
        <div className="rounded-xl border border-border bg-background p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-navy">Shipment activity by month</h3>
              <p className="mt-0.5 text-xs text-muted">Count of matching records per month</p>
            </div>
            <IllustrativeBadge />
          </div>
          {trend.length > 1 ? (
            <DemandChart
              data={trend.map((t) => ({ period: t.period, value: t.count }))}
              label="Monthly shipment count"
              height={180}
            />
          ) : (
            <div className="flex h-[180px] items-center justify-center text-sm text-muted">
              Insufficient data for trend
            </div>
          )}
          <p className="mt-2 text-xs text-muted">
            {trend.length} months of activity in matching records.
          </p>
        </div>

        {/* Top destinations */}
        <div className="rounded-xl border border-border bg-background p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-navy">Top destination markets</h3>
              <p className="mt-0.5 text-xs text-muted">By number of matching shipments</p>
            </div>
            <button
              type="button"
              onClick={() => onTabChange("countries")}
              className="text-xs font-medium text-primary hover:underline"
            >
              View all
            </button>
          </div>
          {namedDest.length > 0 ? (
            <HorizontalBars
              data={namedDest}
              label="Top destination markets by shipment count"
              height={180}
              valueFormatter={(v) => String(v)}
            />
          ) : (
            <div className="flex h-[180px] items-center justify-center text-sm text-muted">
              No destination data
            </div>
          )}
        </div>
      </div>

      {/* Transport + Key insights */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Transport mode donut */}
        {modes.length > 0 && (
          <div className="rounded-xl border border-border bg-background p-5">
            <h3 className="mb-1 text-sm font-semibold text-navy">Transport modes</h3>
            <p className="mb-4 text-xs text-muted">Distribution of matching records</p>
            <DonutChart
              data={modes}
              label="Transport mode distribution"
              height={160}
              valueFormatter={(v) => String(v)}
            />
            <ul className="mt-3 space-y-1" aria-label="Transport mode breakdown">
              {modes.slice(0, 4).map((m, i) => (
                <li key={m.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="size-2 rounded-full"
                      style={{ background: `var(--chart-${i + 1})` }}
                      aria-hidden
                    />
                    <span className="text-muted-strong">{m.name}</span>
                  </span>
                  <span className="tabular-nums text-navy font-medium">{m.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key insights */}
        <div className={cn("space-y-3", modes.length > 0 ? "lg:col-span-2" : "lg:col-span-3")}>
          <h3 className="text-sm font-semibold text-navy">Key insights</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {topDest[0] && (
              <InsightCard
                label="Top destination"
                value={countryName(topDest[0].name)}
                sub={`${topDest[0].value} shipments (${Math.round((topDest[0].value / records.length) * 100)}% of total)`}
                color="text-primary"
              />
            )}
            {topBuyers[0] && (
              <InsightCard
                label="Most active buyer"
                value={topBuyers[0].name}
                sub={`${topBuyers[0].shipments} shipments · ${formatCurrency(topBuyers[0].totalValue)}`}
                color="text-navy"
              />
            )}
            {topSuppliers[0] && (
              <InsightCard
                label="Most active supplier"
                value={topSuppliers[0].name}
                sub={`${topSuppliers[0].shipments} shipments · ${topSuppliers[0].countries[0] ?? ""}`}
                color="text-navy"
              />
            )}
            {topHs && (
              <InsightCard
                label="Most common HS code"
                value={topHs[0]}
                sub={`${topHs[1]} matching shipments`}
                color="text-success"
              />
            )}
            <InsightCard
              label="Markets covered"
              value={`${uniqueCountries} countries`}
              sub="Across origins and destinations"
              color="text-navy"
            />
            {modes[0] && (
              <InsightCard
                label="Primary transport mode"
                value={modes[0].name}
                sub={`${modes[0].value} of ${records.length} shipments`}
                color="text-navy"
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer note */}
      <p className="flex items-center gap-2 text-xs text-muted">
        <Globe2 className="size-3.5 shrink-0 text-muted" aria-hidden />
        All figures are derived from illustrative demonstration data. Click metric cards to explore the underlying records.
      </p>
    </div>
  );
}
