"use client";

import * as React from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  RotateCcw,
  Search,
} from "lucide-react";
import type {
  AnalyticsRecord,
  TradeAnalyticsSummary,
} from "@/types/trade-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Tabs } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/misc";
import { IllustrativeBadge } from "@/components/shared/illustrative";
import { DemandChart, ComparisonBar } from "@/components/charts/charts";
import { DonutChart, HorizontalBars } from "@/components/charts/analytics-charts";
import { getCountry } from "@/data/mock/countries";
import { toCsv, downloadCsv } from "@/lib/csv";
import {
  cn,
  formatCurrency,
  formatDate,
  formatDelta,
  formatNumber,
} from "@/lib/utils";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "markets", label: "Markets" },
  { id: "companies", label: "Companies" },
  { id: "products", label: "Products" },
  { id: "records", label: "Trade Records" },
];

/** Signed change pill, paired with an icon so meaning isn't colour-only. */
function Delta({ value }: { value: number }) {
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-semibold tabular-nums",
        up ? "text-success" : "text-danger",
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {formatDelta(value)}
    </span>
  );
}

function KpiCard({
  label,
  value,
  delta,
  hint,
}: {
  label: string;
  value: string;
  delta: number;
  hint: string;
}) {
  return (
    <div className="tile-glow overflow-hidden rounded-lg border border-border bg-background shadow-xs">
      <div className="rule-gradient" aria-hidden />
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {label}
        </p>
        <p className="mt-1.5 text-2xl font-semibold tabular-nums text-navy">
          {value}
        </p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <Delta value={delta} />
          <span className="text-xs text-muted">vs prev. period</span>
        </div>
        <p className="sr-only">{hint}</p>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle as="h3" className="text-base">
          {title}
        </CardTitle>
        {description ? (
          <p className="mt-1 text-sm text-muted">{description}</p>
        ) : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

const PAGE_SIZE = 10;

export function TradeAnalytics({
  summary,
}: {
  summary: TradeAnalyticsSummary;
}) {
  const [tab, setTab] = React.useState("overview");

  return (
    <div className="space-y-5">
      {/* Coverage context */}
      <p className="text-xs text-muted">
        Coverage {summary.dataQuality.coveragePeriod} · updated{" "}
        {formatDate(summary.dataQuality.lastUpdated)} · source{" "}
        {summary.dataQuality.sourceCategory.toLowerCase()}, {summary.dataQuality.completeness}% illustrative completeness
      </p>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {summary.kpis.map((k) => (
          <KpiCard
            key={k.key}
            label={k.label}
            value={k.value}
            delta={k.delta}
            hint={k.hint}
          />
        ))}
      </div>

      <Tabs tabs={TABS} value={tab} onChange={setTab} />

      <div role="tabpanel">
        {tab === "overview" && <OverviewTab summary={summary} />}
        {tab === "markets" && <MarketsTab summary={summary} />}
        {tab === "companies" && <CompaniesTab summary={summary} />}
        {tab === "products" && <ProductsTab summary={summary} />}
        {tab === "records" && <RecordsTab summary={summary} />}
      </div>
    </div>
  );
}

// --- Overview ---------------------------------------------------------------

function OverviewTab({ summary }: { summary: TradeAnalyticsSummary }) {
  const valueSeries = summary.monthly.map((m) => ({
    period: m.period,
    value: m.value,
  }));
  const volumeSeries = summary.monthly.map((m) => ({
    period: m.period,
    value: m.shipments,
  }));
  const split = summary.flowSplit.map((s) => ({ name: s.flow, value: s.value }));
  const hs = summary.hsDistribution
    .slice(0, 6)
    .map((h) => ({ name: h.description, value: h.value }));
  const importShare =
    Math.round(
      (summary.flowSplit[0].value /
        (summary.flowSplit[0].value + summary.flowSplit[1].value)) *
        100,
    ) || 0;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <SectionCard
        title="Monthly trade value"
        description="Illustrative total value of records per month."
      >
        <DemandChart data={valueSeries} label="Monthly trade value trend, illustrative" />
        <p className="sr-only">
          Twelve months of illustrative trade value, ranging from{" "}
          {formatCurrency(Math.min(...valueSeries.map((d) => d.value)))} to{" "}
          {formatCurrency(Math.max(...valueSeries.map((d) => d.value)))}.
        </p>
      </SectionCard>

      <SectionCard
        title="Monthly record volume"
        description="Illustrative number of shipment records per month."
      >
        <DemandChart data={volumeSeries} label="Monthly record volume trend, illustrative" />
      </SectionCard>

      <SectionCard
        title="Import vs export split"
        description={`Illustrative value split — about ${importShare}% import-side records.`}
      >
        <div className="grid grid-cols-[1fr_auto] items-center gap-4">
          <DonutChart
            data={split}
            label={`Import versus export value split: ${importShare} percent import`}
            valueFormatter={(n) => formatCurrency(n)}
          />
          <ul className="space-y-2 text-sm">
            {split.map((s, i) => (
              <li key={s.name} className="flex items-center gap-2">
                <span
                  className="size-3 rounded-sm"
                  style={{ background: `var(--chart-${i + 1})` }}
                  aria-hidden
                />
                <span className="text-navy">{s.name}</span>
                <span className="ml-auto tabular-nums text-muted">
                  {formatCurrency(s.value)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </SectionCard>

      <SectionCard
        title="HS code distribution"
        description="Illustrative share of value by HS code group."
      >
        <HorizontalBars
          data={hs}
          label="HS code distribution by illustrative value"
          valueFormatter={(n) => formatCurrency(n)}
        />
      </SectionCard>
    </div>
  );
}

// --- Markets ----------------------------------------------------------------

function CountryTable({
  rows,
  caption,
}: {
  rows: TradeAnalyticsSummary["topImporters"];
  caption: string;
}) {
  return (
    <div className="scroll-x">
      <table className="w-full text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
            <th scope="col" className="py-2 pr-3 font-medium">Country</th>
            <th scope="col" className="py-2 pr-3 text-right font-medium">Value</th>
            <th scope="col" className="py-2 pr-3 text-right font-medium">Records</th>
            <th scope="col" className="py-2 text-right font-medium">Trend</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.code} className="border-b border-border/60 last:border-0">
              <td className="py-2.5 pr-3">
                <span className="font-medium text-navy">
                  {c.flag} {c.name}
                </span>
                <span className="ml-2 text-xs text-muted">{c.region}</span>
              </td>
              <td className="py-2.5 pr-3 text-right tabular-nums text-navy">
                {formatCurrency(c.value)}
              </td>
              <td className="py-2.5 pr-3 text-right tabular-nums text-muted">
                {formatNumber(c.shipments)}
              </td>
              <td className="py-2.5 text-right">
                <Delta value={c.growth} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MarketsTab({ summary }: { summary: TradeAnalyticsSummary }) {
  const region = summary.regionValue.map((r) => ({
    name: r.region,
    value: r.value,
  }));
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <SectionCard
        title="Top importing countries"
        description="Illustrative destination markets by value."
      >
        <HorizontalBars
          data={summary.topImporters.map((c) => ({ name: c.name, value: c.value }))}
          label="Top importing countries by illustrative value"
          valueFormatter={(n) => formatCurrency(n)}
        />
        <div className="mt-4">
          <CountryTable rows={summary.topImporters} caption="Top importing countries" />
        </div>
      </SectionCard>

      <SectionCard
        title="Top exporting countries"
        description="Illustrative origin markets by value."
      >
        <HorizontalBars
          data={summary.topExporters.map((c) => ({ name: c.name, value: c.value }))}
          label="Top exporting countries by illustrative value"
          valueFormatter={(n) => formatCurrency(n)}
        />
        <div className="mt-4">
          <CountryTable rows={summary.topExporters} caption="Top exporting countries" />
        </div>
      </SectionCard>

      <SectionCard
        title="Trade value by region"
        description="Illustrative destination value grouped by world region."
        className="lg:col-span-2"
      >
        <ComparisonBar data={region} label="Illustrative trade value by region" />
      </SectionCard>
    </div>
  );
}

// --- Companies --------------------------------------------------------------

function PartnerTable({
  rows,
  roleLabel,
  caption,
}: {
  rows: TradeAnalyticsSummary["leadingBuyers"];
  roleLabel: string;
  caption: string;
}) {
  return (
    <div className="scroll-x">
      <table className="w-full text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
            <th scope="col" className="py-2 pr-3 font-medium">{roleLabel}</th>
            <th scope="col" className="py-2 pr-3 font-medium">Country</th>
            <th scope="col" className="py-2 pr-3 text-right font-medium">Records</th>
            <th scope="col" className="py-2 pr-3 text-right font-medium">Value</th>
            <th scope="col" className="py-2 pr-3 font-medium">Latest</th>
            <th scope="col" className="py-2 text-right font-medium">Trend</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => {
            const country = getCountry(p.countryCode);
            return (
              <tr key={p.id} className="border-b border-border/60 last:border-0">
                <td className="py-2.5 pr-3 font-medium text-navy">{p.name}</td>
                <td className="py-2.5 pr-3 text-muted">
                  {p.flag} {country?.name ?? p.countryCode}
                </td>
                <td className="py-2.5 pr-3 text-right tabular-nums text-muted">
                  {formatNumber(p.shipments)}
                </td>
                <td className="py-2.5 pr-3 text-right tabular-nums text-navy">
                  {formatCurrency(p.value)}
                </td>
                <td className="py-2.5 pr-3 text-muted">{formatDate(p.latest)}</td>
                <td className="py-2.5 text-right">
                  <Delta value={p.growth} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CompaniesTab({ summary }: { summary: TradeAnalyticsSummary }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <SectionCard
        title="Leading buyers"
        description="Illustrative importers ranked by value."
        className="lg:col-span-2"
      >
        <PartnerTable
          rows={summary.leadingBuyers}
          roleLabel="Buyer"
          caption="Leading buyers by illustrative value"
        />
      </SectionCard>

      <SectionCard
        title="Buyer concentration"
        description="Share of illustrative value across leading buyers."
      >
        <HorizontalBars
          data={summary.leadingBuyers.map((p) => ({ name: p.name, value: p.value }))}
          label="Buyer concentration by illustrative value"
          valueFormatter={(n) => formatCurrency(n)}
        />
      </SectionCard>

      <SectionCard
        title="Supplier concentration"
        description="Share of illustrative value across leading suppliers."
      >
        <HorizontalBars
          data={summary.leadingSuppliers.map((p) => ({ name: p.name, value: p.value }))}
          label="Supplier concentration by illustrative value"
          valueFormatter={(n) => formatCurrency(n)}
        />
      </SectionCard>

      <SectionCard
        title="Leading suppliers"
        description="Illustrative exporters ranked by value."
        className="lg:col-span-2"
      >
        <PartnerTable
          rows={summary.leadingSuppliers}
          roleLabel="Supplier"
          caption="Leading suppliers by illustrative value"
        />
      </SectionCard>
    </div>
  );
}

// --- Products ---------------------------------------------------------------

function ProductsTab({ summary }: { summary: TradeAnalyticsSummary }) {
  const hs = summary.hsDistribution.map((h) => ({
    name: `${h.code} · ${h.description}`,
    value: h.value,
  }));
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <SectionCard
        title="HS code distribution"
        description="Illustrative value share by HS code group."
      >
        <DonutChart
          data={hs}
          label="HS code distribution by illustrative value"
          valueFormatter={(n) => formatCurrency(n)}
        />
      </SectionCard>

      <SectionCard
        title="Top products"
        description="Illustrative product lines ranked by value."
      >
        <div className="scroll-x">
          <table className="w-full text-sm">
            <caption className="sr-only">Top products by illustrative value</caption>
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                <th scope="col" className="py-2 pr-3 font-medium">Product</th>
                <th scope="col" className="py-2 pr-3 font-medium">HS</th>
                <th scope="col" className="py-2 pr-3 text-right font-medium">Value</th>
                <th scope="col" className="py-2 text-right font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {summary.topProducts.map((p) => (
                <tr key={p.name} className="border-b border-border/60 last:border-0">
                  <td className="py-2.5 pr-3 font-medium text-navy">{p.name}</td>
                  <td className="py-2.5 pr-3 tabular-nums text-muted">{p.hsCode}</td>
                  <td className="py-2.5 pr-3 text-right tabular-nums text-navy">
                    {formatCurrency(p.value)}
                  </td>
                  <td className="py-2.5 text-right">
                    <Delta value={p.growth} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

// --- Trade Records ----------------------------------------------------------

type SortKey = "date" | "value";

function RecordsTab({ summary }: { summary: TradeAnalyticsSummary }) {
  const [query, setQuery] = React.useState("");
  const [flow, setFlow] = React.useState<"all" | "Import" | "Export">("all");
  const [sort, setSort] = React.useState<SortKey>("date");
  const [page, setPage] = React.useState(0);
  const [detail, setDetail] = React.useState<AnalyticsRecord | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = summary.records.filter((rec) => {
      if (flow !== "all" && rec.flow !== flow) return false;
      if (!q) return true;
      return (
        rec.product.toLowerCase().includes(q) ||
        rec.hsCode.includes(q) ||
        rec.exporter.toLowerCase().includes(q) ||
        rec.importer.toLowerCase().includes(q)
      );
    });
    rows.sort((a, b) =>
      sort === "value" ? b.value - a.value : a.date < b.date ? 1 : -1,
    );
    return rows;
  }, [summary.records, query, flow, sort]);

  // Keep the page in range when filters shrink the result set.
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = filtered.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE,
  );

  function reset() {
    setQuery("");
    setFlow("all");
    setSort("date");
    setPage(0);
  }

  function exportCsv() {
    const csv = toCsv(filtered, [
      { header: "Date", get: (r) => r.date },
      { header: "Product", get: (r) => r.product },
      { header: "HS Code", get: (r) => r.hsCode },
      { header: "Quantity", get: (r) => r.quantity },
      { header: "Unit", get: (r) => r.unit },
      { header: "Unit price", get: (r) => r.unitPrice },
      { header: "Value", get: (r) => r.value },
      { header: "Currency", get: (r) => r.currency },
      { header: "Origin", get: (r) => getCountry(r.originCode)?.name ?? r.originCode },
      { header: "Destination", get: (r) => getCountry(r.destinationCode)?.name ?? r.destinationCode },
      { header: "Exporter", get: (r) => r.exporter },
      { header: "Importer", get: (r) => r.importer },
      { header: "Flow", get: (r) => r.flow },
      { header: "Mode", get: (r) => r.mode },
    ]);
    downloadCsv(csv, "vaskodigama-trade-records-sample.csv");
  }

  const flowFilters: { id: typeof flow; label: string }[] = [
    { id: "all", label: "All" },
    { id: "Import", label: "Import" },
    { id: "Export", label: "Export" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h3" className="text-base">
          Trade records
        </CardTitle>
        <p className="mt-1 text-sm text-muted">
          Illustrative transaction-level records. Filter, sort and export a
          sample as CSV.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative grow sm:max-w-xs">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
              aria-hidden
            />
            <Input
              type="search"
              aria-label="Search records by product, HS code, exporter or importer"
              placeholder="Search product, HS, exporter, importer…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
              className="pl-9"
            />
          </div>

          <div
            role="group"
            aria-label="Filter by trade flow"
            className="inline-flex rounded-md border border-border bg-surface p-0.5"
          >
            {flowFilters.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={flow === f.id}
                onClick={() => {
                  setFlow(f.id);
                  setPage(0);
                }}
                className={cn(
                  "rounded px-3 py-1.5 text-sm font-medium transition-colors",
                  flow === f.id
                    ? "bg-background text-navy shadow-xs"
                    : "text-muted hover:text-navy",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-1.5 text-sm text-muted">
            <span className="sr-only sm:not-sr-only">Sort</span>
            <select
              aria-label="Sort records"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-9 rounded-md border border-border bg-background px-2 text-sm text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <option value="date">Newest first</option>
              <option value="value">Highest value</option>
            </select>
          </label>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="size-4" aria-hidden />
              Reset
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={exportCsv}
              disabled={filtered.length === 0}
            >
              <Download className="size-4" aria-hidden />
              Export CSV
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted" aria-live="polite">
          Showing{" "}
          <span className="font-medium text-navy">{pageRows.length}</span> of{" "}
          <span className="font-medium text-navy">{filtered.length}</span>{" "}
          illustrative records
        </p>

        {filtered.length === 0 ? (
          <EmptyState
            title="No trade records match these filters"
            description="Try removing the flow filter or using a broader product term."
            action={
              <Button variant="outline" size="sm" onClick={reset}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <>
            <div className="scroll-x">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Illustrative trade records, sortable and filterable
                </caption>
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                    <th scope="col" className="py-2 pr-3 font-medium">Date</th>
                    <th scope="col" className="py-2 pr-3 font-medium">Product</th>
                    <th scope="col" className="py-2 pr-3 font-medium">HS</th>
                    <th scope="col" className="py-2 pr-3 font-medium">Route</th>
                    <th scope="col" className="py-2 pr-3 text-right font-medium">Qty</th>
                    <th scope="col" className="py-2 pr-3 text-right font-medium">Value</th>
                    <th scope="col" className="py-2 font-medium">Flow</th>
                    <th scope="col" className="py-2 text-right font-medium">
                      <span className="sr-only">Details</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((rec) => {
                    const origin = getCountry(rec.originCode);
                    const dest = getCountry(rec.destinationCode);
                    return (
                      <tr
                        key={rec.id}
                        className="border-b border-border/60 last:border-0"
                      >
                        <td className="py-2.5 pr-3 whitespace-nowrap text-muted">
                          {formatDate(rec.date)}
                        </td>
                        <td className="py-2.5 pr-3 text-navy">{rec.product}</td>
                        <td className="py-2.5 pr-3 tabular-nums text-muted">{rec.hsCode}</td>
                        <td className="py-2.5 pr-3 whitespace-nowrap text-muted">
                          {origin?.flag} {rec.originCode} → {dest?.flag} {rec.destinationCode}
                        </td>
                        <td className="py-2.5 pr-3 text-right tabular-nums text-muted">
                          {formatNumber(rec.quantity)} {rec.unit}
                        </td>
                        <td className="py-2.5 pr-3 text-right tabular-nums text-navy">
                          {formatCurrency(rec.value)}
                        </td>
                        <td className="py-2.5">
                          <Badge tone={rec.flow === "Import" ? "primary" : "neutral"}>
                            {rec.flow}
                          </Badge>
                        </td>
                        <td className="py-2.5 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDetail(rec)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted">
                Page {safePage + 1} of {pageCount}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={safePage === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                  disabled={safePage >= pageCount - 1}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>

      <RecordDetail record={detail} onClose={() => setDetail(null)} />
    </Card>
  );
}

function RecordDetail({
  record,
  onClose,
}: {
  record: AnalyticsRecord | null;
  onClose: () => void;
}) {
  const origin = record ? getCountry(record.originCode) : null;
  const dest = record ? getCountry(record.destinationCode) : null;
  const rows = record
    ? [
        ["Reference", record.id],
        ["Date", formatDate(record.date)],
        ["Product", record.product],
        ["HS code", record.hsCode],
        ["Quantity", `${formatNumber(record.quantity)} ${record.unit}`],
        ["Unit price", `${formatCurrency(record.unitPrice)} / ${record.unit}`],
        ["Trade value", formatCurrency(record.value)],
        ["Origin", `${origin?.flag ?? ""} ${origin?.name ?? record.originCode}`],
        ["Destination", `${dest?.flag ?? ""} ${dest?.name ?? record.destinationCode}`],
        ["Exporter", record.exporter],
        ["Importer", record.importer],
        ["Trade flow", record.flow],
        ["Transport mode", record.mode],
      ]
    : [];

  return (
    <Modal
      open={record !== null}
      onClose={onClose}
      title="Trade record"
      description="Illustrative sample record — not a verified customs filing."
      variant="drawer-right"
    >
      <dl className="divide-y divide-border text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-2.5">
            <dt className="text-muted">{k}</dt>
            <dd className="text-right font-medium text-navy">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex items-center gap-2">
        <IllustrativeBadge />
        <button
          type="button"
          onClick={() => {
            if (record) void navigator.clipboard?.writeText(record.id);
          }}
          className="text-sm text-primary hover:underline"
        >
          Copy reference
        </button>
      </div>
    </Modal>
  );
}
