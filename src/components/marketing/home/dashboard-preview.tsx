import { ArrowUpRight } from "lucide-react";
import type { TradeAnalyticsSummary } from "@/types/trade-analytics";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DemandChart } from "@/components/charts/charts";
import { HorizontalBars } from "@/components/charts/analytics-charts";
import { getCountry } from "@/data/mock/countries";
import { formatCompact, formatCurrency } from "@/lib/utils";

/** Embedded, functional-looking dashboard preview for the homepage. */
export function DashboardPreview({ summary }: { summary: TradeAnalyticsSummary }) {
  const kpis = summary.kpis.slice(0, 4);
  const trend = summary.monthly.map((m) => ({ period: m.period, value: m.value }));
  const importers = summary.topImporters.slice(0, 5).map((c) => ({ name: c.name, value: c.value }));
  const buyers = summary.leadingBuyers.slice(0, 4);
  const suppliers = summary.leadingSuppliers.slice(0, 4);

  return (
    <div className="overflow-hidden rounded-[20px] border border-border bg-background shadow-md">
      <div className="flex items-center justify-between border-b border-border bg-surface px-5 py-3">
        <p className="text-sm font-semibold text-navy">Global Trade Overview</p>
        <Badge tone="warning">Demonstration data</Badge>
      </div>

      <div className="space-y-4 p-5">
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.key} className="rounded-lg border border-border bg-surface p-3">
              <p className="text-xs text-muted">{k.label}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-navy">{k.value}</p>
              <p className={`text-xs font-medium ${k.delta >= 0 ? "text-success" : "text-danger"}`}>
                {k.delta >= 0 ? "+" : ""}{k.delta}%
              </p>
            </div>
          ))}
        </div>

        {/* Trend + top importers */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm font-semibold text-navy">Monthly trade value</p>
            <DemandChart data={trend} label="Illustrative monthly trade value" height={180} />
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm font-semibold text-navy">Top importing countries</p>
            <HorizontalBars
              data={importers}
              label="Top importing countries, illustrative"
              height={180}
              valueFormatter={(n) => formatCurrency(n)}
            />
          </div>
        </div>

        {/* Buyers + suppliers */}
        <div className="grid gap-4 sm:grid-cols-2">
          <PartnerList title="Leading buyers" rows={buyers} />
          <PartnerList title="Leading suppliers" rows={suppliers} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <p className="text-xs text-muted">
            Illustrative demo data — figures are not real customs values.
          </p>
          <ButtonLink href="/dashboard/analytics" size="sm">
            View Demo Dashboard <ArrowUpRight className="size-4" aria-hidden />
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

function PartnerList({
  title,
  rows,
}: {
  title: string;
  rows: TradeAnalyticsSummary["leadingBuyers"];
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-sm font-semibold text-navy">{title}</p>
      <ul className="mt-2 space-y-1.5">
        {rows.map((p) => {
          const country = getCountry(p.countryCode);
          return (
            <li key={p.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="truncate text-navy">{p.name}</span>
              <span className="shrink-0 text-xs text-muted">
                {country?.flag} {formatCompact(p.value)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
