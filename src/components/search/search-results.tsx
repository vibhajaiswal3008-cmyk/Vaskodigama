"use client";

import * as React from "react";
import {
  ArrowUpRight,
  Bell,
  Bookmark,
  CheckCircle2,
  FileText,
  GitCompareArrows,
  TrendingDown,
  TrendingUp,
  Minus,
} from "lucide-react";
import type { Company, Market, SearchResult, ShipmentRecord } from "@/types";
import { makeCompanyColumns, makeShipmentColumns } from "@/components/tables/columns";
import { Tabs } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/tables/data-table";
import { DemandChart, PriceChart, ComparisonBar } from "@/components/charts/charts";
import { OpportunityScoreCard } from "@/components/opportunity/opportunity-score";
import { DataQualityPanel } from "@/components/shared/data-quality";
import { IllustrativeBadge } from "@/components/shared/illustrative";
import { WhyCompanyDrawer } from "@/components/company/why-company-drawer";
import { WhyMarketDrawer } from "@/components/market/why-market-drawer";
import { CompareDrawer } from "@/components/compare/compare-drawer";
import { useToast } from "@/components/shared/toast";
import { getCountry } from "@/data/mock/countries";
import { formatDelta } from "@/lib/utils";

const TABS = [
  "overview",
  "markets",
  "buyers",
  "suppliers",
  "shipments",
  "prices",
  "countries",
  "states",
  "ports",
  "competitors",
] as const;
type TabId = (typeof TABS)[number];

const tabLabels: Record<TabId, string> = {
  overview: "Overview",
  markets: "Markets",
  buyers: "Buyers",
  suppliers: "Suppliers",
  shipments: "Shipments",
  prices: "Prices",
  countries: "Countries",
  states: "States & regions",
  ports: "Ports",
  competitors: "Competitors",
};

export function SearchResults({ result }: { result: SearchResult }) {
  const { toast } = useToast();
  const [tab, setTab] = React.useState<TabId>("overview");
  const [whyCompany, setWhyCompany] = React.useState<Company | null>(null);
  const [whyMarket, setWhyMarket] = React.useState<Market | null>(null);
  const [compareList, setCompareList] = React.useState<Company[]>([]);
  const [compareOpen, setCompareOpen] = React.useState(false);

  const addCompare = React.useCallback(
    (c: Company) =>
      setCompareList((prev) =>
        prev.find((x) => x.id === c.id) ? prev : [...prev, c].slice(0, 4),
      ),
    [],
  );

  const companyColumns = React.useMemo(
    () => makeCompanyColumns(setWhyCompany, addCompare, toast, "buyer"),
    [addCompare, toast],
  );
  const supplierColumns = React.useMemo(
    () => makeCompanyColumns(setWhyCompany, addCompare, toast, "supplier"),
    [addCompare, toast],
  );
  const shipmentColumns = React.useMemo(() => makeShipmentColumns(), []);

  return (
    <div>
      {/* Summary header */}
      <div className="rounded-xl border border-border bg-background p-5 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Search results
            </p>
            <h1 className="mt-1 max-w-2xl text-xl font-bold text-navy">
              {result.summary}
            </h1>
          </div>
          <IllustrativeBadge />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {result.overview.metrics.map((m) => (
            <div key={m.label} className="rounded-lg border border-border bg-surface p-3">
              <p className="text-xs text-muted">{m.label}</p>
              <p className="mt-0.5 text-lg font-bold text-navy">{m.value}</p>
              {typeof m.delta === "number" ? (
                <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-success">
                  <TrendingUp className="size-3" aria-hidden />
                  {formatDelta(m.delta)} illustrative
                </p>
              ) : null}
            </div>
          ))}
        </div>
        {compareList.length > 0 ? (
          <div className="mt-3">
            <Button variant="outline" size="sm" onClick={() => setCompareOpen(true)}>
              <GitCompareArrows className="size-4" aria-hidden /> Compare ({compareList.length})
            </Button>
          </div>
        ) : null}
      </div>

      {/* Tabs */}
      <div className="mt-5">
        <Tabs
          tabs={TABS.map((t) => ({ id: t, label: tabLabels[t] }))}
          value={tab}
          onChange={(id) => setTab(id as TabId)}
        />
      </div>

      <div className="mt-5" role="tabpanel">
        {tab === "overview" ? (
          <OverviewTab result={result} onWhyMarket={setWhyMarket} />
        ) : null}

        {tab === "markets" ? (
          <MarketsTab markets={result.markets} onWhy={setWhyMarket} />
        ) : null}

        {tab === "buyers" ? (
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle as="h2">Buyers</CardTitle>
              <IllustrativeBadge />
            </CardHeader>
            <CardContent>
              <DataTable
                columns={companyColumns}
                data={result.buyers}
                caption="Illustrative buyers for this search"
                searchPlaceholder="Filter buyers…"
              />
            </CardContent>
          </Card>
        ) : null}

        {tab === "suppliers" ? (
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle as="h2">Suppliers</CardTitle>
              <IllustrativeBadge />
            </CardHeader>
            <CardContent>
              <DataTable
                columns={supplierColumns}
                data={result.suppliers}
                caption="Illustrative suppliers for this search"
                searchPlaceholder="Filter suppliers…"
              />
            </CardContent>
          </Card>
        ) : null}

        {tab === "shipments" ? (
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle as="h2">Shipments</CardTitle>
              <IllustrativeBadge />
            </CardHeader>
            <CardContent>
              <DataTable
                columns={shipmentColumns}
                data={result.shipments}
                caption="Illustrative shipment records for this search"
                searchPlaceholder="Filter shipments…"
                pageSize={10}
              />
            </CardContent>
          </Card>
        ) : null}

        {tab === "prices" ? <PricesTab result={result} /> : null}
        {tab === "countries" ? (
          <MarketsTab markets={result.markets} onWhy={setWhyMarket} variant="countries" />
        ) : null}
        {tab === "states" ? <StatesTab /> : null}
        {tab === "ports" ? <PortsTab shipments={result.shipments} /> : null}
        {tab === "competitors" ? (
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle as="h2">Competitors</CardTitle>
              <IllustrativeBadge />
            </CardHeader>
            <CardContent>
              <DataTable
                columns={supplierColumns}
                data={result.competitors}
                caption="Illustrative competitor suppliers"
                searchPlaceholder="Filter competitors…"
              />
            </CardContent>
          </Card>
        ) : null}
      </div>

      <WhyCompanyDrawer
        company={whyCompany}
        open={!!whyCompany}
        onClose={() => setWhyCompany(null)}
        onCompare={addCompare}
      />
      <WhyMarketDrawer
        market={whyMarket}
        open={!!whyMarket}
        onClose={() => setWhyMarket(null)}
      />
      <CompareDrawer
        companies={compareList}
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
        onRemove={(id) => setCompareList((p) => p.filter((c) => c.id !== id))}
      />
    </div>
  );
}

function OverviewTab({
  result,
  onWhyMarket,
}: {
  result: SearchResult;
  onWhyMarket: (m: Market) => void;
}) {
  const top = [...result.markets].sort(
    (a, b) => b.opportunity.value - a.opportunity.value,
  )[0];
  const countryData = result.markets.map((m) => ({
    name: getCountry(m.countryCode)?.code ?? m.countryCode,
    value: m.opportunity.value,
  }));
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle as="h2">Demand trend</CardTitle>
          </CardHeader>
          <CardContent>
            <DemandChart
              data={top.demandSeries}
              label={`Illustrative demand trend for ${getCountry(top.countryCode)?.name}. Overall trend is ${top.trend}.`}
            />
            <p className="mt-2 text-sm text-muted">
              Demand in {getCountry(top.countryCode)?.name} appears{" "}
              <strong className="text-navy">{top.trend}</strong> ({formatDelta(top.growth)} illustrative YoY).
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle as="h2">Opportunity by market</CardTitle>
          </CardHeader>
          <CardContent>
            <ComparisonBar
              data={countryData}
              label={`Opportunity Score by market: ${countryData.map((d) => `${d.name} ${d.value}`).join(", ")}.`}
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-5">
        <OpportunityScoreCard score={result.overview.opportunity} subject="Top market in this search" />

        <Card>
          <CardHeader>
            <CardTitle as="h2">Why this matters</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.overview.opportunity.rationale.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-muted-strong">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                  {r}
                </li>
              ))}
            </ul>
            <Button
              variant="link"
              className="mt-3 h-auto"
              onClick={() => onWhyMarket(top)}
            >
              Open full market view <ArrowUpRight className="size-4" aria-hidden />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle as="h2">Recommended next actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {result.recommendedActions.map((a, i) => (
              <div key={a.label} className="flex items-start gap-2 rounded-md border border-border bg-surface p-2.5">
                <ActionIcon i={i} />
                <div>
                  <p className="text-sm font-semibold text-navy">{a.label}</p>
                  <p className="text-xs text-muted">{a.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <DataQualityPanel q={result.dataQuality} />
      </div>
    </div>
  );
}

function ActionIcon({ i }: { i: number }) {
  const icons = [Bookmark, GitCompareArrows, Bell, FileText];
  const Icon = icons[i % icons.length];
  return <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />;
}

function trendBadge(trend: Market["trend"]) {
  if (trend === "rising")
    return (
      <Badge tone="success">
        <TrendingUp className="size-3" aria-hidden /> Rising
      </Badge>
    );
  if (trend === "falling")
    return (
      <Badge tone="danger">
        <TrendingDown className="size-3" aria-hidden /> Falling
      </Badge>
    );
  return (
    <Badge tone="neutral">
      <Minus className="size-3" aria-hidden /> Steady
    </Badge>
  );
}

function MarketsTab({
  markets,
  onWhy,
  variant,
}: {
  markets: Market[];
  onWhy: (m: Market) => void;
  variant?: "countries";
}) {
  const sorted = [...markets].sort(
    (a, b) => b.opportunity.value - a.opportunity.value,
  );
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {sorted.map((m) => {
        const country = getCountry(m.countryCode);
        return (
          <Card key={m.id}>
            <CardContent className="pt-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-navy">
                    {country?.flag} {country?.name}
                  </h3>
                  <p className="text-sm text-muted">
                    {formatDelta(m.growth)} illustrative YoY
                  </p>
                </div>
                {trendBadge(m.trend)}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <Metric label="Score" value={`${m.opportunity.value}`} />
                <Metric label="Competition" value={m.competitionLevel} />
                <Metric label="Avg" value={`$${m.avgValue.toFixed(1)}`} />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={() => onWhy(m)}
              >
                {variant === "countries" ? "Compare country" : "Why this market"}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-surface p-2">
      <p className="font-semibold capitalize text-navy">{value}</p>
      <p className="text-muted">{label}</p>
    </div>
  );
}

function PricesTab({ result }: { result: SearchResult }) {
  const latest = result.prices[result.prices.length - 1];
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle as="h2">Price trend</CardTitle>
        </CardHeader>
        <CardContent>
          <PriceChart
            data={result.prices}
            label={`Illustrative price trend. Average ${latest.avgUnitPrice} ${latest.currency} per ${latest.unit}; range ${latest.min}–${latest.max}.`}
          />
          <p className="mt-2 text-sm text-muted">
            Values are illustrative estimated averages, not verified figures.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle as="h2">Latest range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Metric label={`Average / ${latest.unit}`} value={`$${latest.avgUnitPrice.toFixed(2)}`} />
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <Metric label="Low" value={`$${latest.min.toFixed(2)}`} />
            <Metric label="High" value={`$${latest.max.toFixed(2)}`} />
          </div>
          <p className="text-xs text-muted">
            Unit: {latest.unit}. Quantities provide context on the Shipments tab.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function StatesTab() {
  const states = [
    { name: "Gujarat", share: 38 },
    { name: "Maharashtra", share: 27 },
    { name: "Punjab", share: 21 },
    { name: "Other", share: 14 },
  ];
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle as="h2">States &amp; regions</CardTitle>
        <IllustrativeBadge />
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-sm text-muted">
          Subnational coverage is illustrative and available for selected
          countries only. Here, exporting-state breakdown for India.
        </p>
        <ComparisonBar
          data={states.map((s) => ({ name: s.name, value: s.share }))}
          label={`Illustrative exporting-state share: ${states.map((s) => `${s.name} ${s.share}%`).join(", ")}.`}
        />
      </CardContent>
    </Card>
  );
}

function PortsTab({ shipments }: { shipments: ShipmentRecord[] }) {
  const byPort = new Map<string, number>();
  for (const s of shipments) byPort.set(s.port, (byPort.get(s.port) ?? 0) + 1);
  const data = Array.from(byPort.entries()).map(([name, value]) => ({ name, value }));
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle as="h2">Ports</CardTitle>
        <IllustrativeBadge />
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-sm text-muted">
          Illustrative shipment counts by port. Port-level data depends on the
          source and is shown for demonstration only.
        </p>
        <ComparisonBar
          data={data}
          label={`Illustrative shipments by port: ${data.map((d) => `${d.name} ${d.value}`).join(", ")}.`}
        />
      </CardContent>
    </Card>
  );
}

