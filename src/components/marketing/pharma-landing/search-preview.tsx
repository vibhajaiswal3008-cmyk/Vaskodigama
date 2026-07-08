import { Ship, ArrowUpRight } from "lucide-react";
import type { TradeAnalyticsSummary } from "@/types/trade-analytics";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { ScoreDial } from "@/components/opportunity/opportunity-score";
import { Flag } from "@/components/shared/flag";
import { formatCompact, formatCurrency } from "@/lib/utils";

interface RecentRecord {
  id: string;
  originCode: string;
  destinationCode: string;
  value: number;
  date: string;
}

/**
 * Static "search result" dashboard preview — shows the shape of the
 * intelligence Vaskodigama returns after a search, built from the same
 * illustrative summary data as the rest of the site (not a live query).
 */
export function SearchPreviewDashboard({
  productName,
  summary,
  buyerCount,
  supplierCount,
  shipmentCount,
  avgPrice,
  opportunityScore,
  recentRecords,
}: {
  productName: string;
  summary: TradeAnalyticsSummary;
  buyerCount: number;
  supplierCount: number;
  shipmentCount: number;
  avgPrice: number;
  opportunityScore: number;
  recentRecords: RecentRecord[];
}) {
  const importers = summary.topImporters.slice(0, 4);
  const exporters = summary.topExporters.slice(0, 4);

  return (
    <div className="overflow-hidden rounded-[20px] border border-border bg-background shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface px-5 py-3">
        <div>
          <p className="text-xs text-muted">Search result for</p>
          <p className="text-sm font-semibold text-navy">{productName}</p>
        </div>
        <Badge tone="warning">Illustrative demo data</Badge>
      </div>

      <div className="space-y-4 p-5">
        {/* Core KPIs */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "Buyers", value: formatCompact(buyerCount) },
            { label: "Suppliers", value: formatCompact(supplierCount) },
            { label: "Avg. price", value: `${formatCurrency(avgPrice)}/kg` },
            { label: "Shipment volume", value: formatCompact(shipmentCount) },
          ].map((k) => (
            <div key={k.label} className="rounded-lg border border-border bg-surface p-3">
              <p className="text-xs text-muted">{k.label}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-navy">{k.value}</p>
            </div>
          ))}
        </div>

        {/* Top countries */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm font-semibold text-navy">Top importing countries</p>
            <ul className="mt-2 space-y-1.5">
              {importers.map((c) => (
                <li key={c.code} className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2 text-navy">
                    <Flag code={c.code} className="h-3 w-5" /> {c.name}
                  </span>
                  <span className="text-xs text-muted">{formatCompact(c.value)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm font-semibold text-navy">Top exporting countries</p>
            <ul className="mt-2 space-y-1.5">
              {exporters.map((c) => (
                <li key={c.code} className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2 text-navy">
                    <Flag code={c.code} className="h-3 w-5" /> {c.name}
                  </span>
                  <span className="text-xs text-muted">{formatCompact(c.value)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recent records + opportunity score */}
        <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm font-semibold text-navy">Recent shipment records</p>
            <ul className="mt-2 divide-y divide-border">
              {recentRecords.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-2 py-1.5 text-sm">
                  <span className="flex items-center gap-1.5 text-navy">
                    <Ship className="size-3.5 text-muted" aria-hidden />
                    {r.originCode} <ArrowUpRight className="size-3 text-muted" aria-hidden /> {r.destinationCode}
                  </span>
                  <span className="text-xs text-muted">{formatCurrency(r.value)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border border-border p-4 text-center">
            <p className="text-sm font-semibold text-navy">Opportunity Score</p>
            <div className="mt-2">
              <ScoreDial value={opportunityScore} size={84} />
            </div>
            <p className="mt-2 text-xs text-muted">Illustrative composite indicator</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <p className="text-xs text-muted">
            Not raw data — structured, decision-ready intelligence.
          </p>
          <ButtonLink href="/explore?industry=pharmaceuticals" size="sm">
            Open full result <ArrowUpRight className="size-4" aria-hidden />
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
