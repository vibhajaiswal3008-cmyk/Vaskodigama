"use client";

import * as React from "react";
import {
  Columns3,
  Download,
  LayoutGrid,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Table as TableIcon,
  X,
} from "lucide-react";
import type {
  ExploreMode,
  ExploreParams,
  ExploreRecord,
  ExploreSort,
} from "@/types/explore";
import {
  EMPTY_PARAMS,
  EXPLORE_MODES,
  EXPLORE_PAGE_SIZE,
  EXPLORE_SORTS,
  filterExploreRecords,
  parseExploreParams,
  serializeExploreParams,
} from "@/lib/explore";
import { coverageCountries } from "@/config/coverage";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/misc";
import { IllustrativeBadge } from "@/components/shared/illustrative";
import { Flag } from "@/components/shared/flag";
import { cn, formatCurrency, formatDate, formatNumber } from "@/lib/utils";

/** Small section heading inside the filter panel. */
function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 border-t border-border pt-4 first:border-0 first:pt-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</p>
      {children}
    </div>
  );
}

/** Origin/destination flag + name route, used in table cells and cards. */
function ShipmentRoute({ origin, destination, compact }: { origin: string; destination: string; compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <Flag code={origin} className="h-3 w-4 shrink-0" />
      <span>{compact ? origin : countryName(origin)}</span>
      <span className="text-muted/60" aria-hidden>→</span>
      <Flag code={destination} className="h-3 w-4 shrink-0" />
      <span>{compact ? destination : countryName(destination)}</span>
    </span>
  );
}
import { toCsv, downloadCsv } from "@/lib/csv";

const countryName = (code: string) =>
  coverageCountries.find((c) => c.code === code)?.name ?? code;

const EXPLORE_URL_EVENT = "vdg:explore-url";

/**
 * The URL is the single source of truth for the search (shareable links). We
 * read it with useSyncExternalStore — SSR-safe and lint-clean (no setState in
 * an effect) — and write to it with replaceState + a custom event.
 */
function useExploreUrlParams(): ExploreParams {
  const search = React.useSyncExternalStore(
    (cb) => {
      window.addEventListener(EXPLORE_URL_EVENT, cb);
      window.addEventListener("popstate", cb);
      return () => {
        window.removeEventListener(EXPLORE_URL_EVENT, cb);
        window.removeEventListener("popstate", cb);
      };
    },
    () => window.location.search,
    () => "",
  );
  return React.useMemo(
    () => parseExploreParams(Object.fromEntries(new URLSearchParams(search))),
    [search],
  );
}

function writeExploreUrlParams(p: ExploreParams) {
  const qs = serializeExploreParams(p);
  window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  window.dispatchEvent(new Event(EXPLORE_URL_EVENT));
}

const OPTIONAL_COLUMNS = [
  { id: "originPort", label: "Origin port" },
  { id: "destinationPort", label: "Destination port" },
  { id: "transportMode", label: "Transport mode" },
  { id: "reference", label: "Reference" },
] as const;

type OptionalCol = (typeof OPTIONAL_COLUMNS)[number]["id"];

/** Reusable filter form — rendered in the desktop sidebar and the mobile drawer. */
function FiltersForm({
  params,
  update,
  onReset,
}: {
  params: ExploreParams;
  update: (patch: Partial<ExploreParams>) => void;
  onReset: () => void;
}) {
  const field =
    "h-10 w-full rounded-md border border-border-strong bg-background px-2.5 text-sm text-navy focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring";

  return (
    <div className="space-y-4">
      <FilterGroup title="Product classification">
        <div>
          <Label htmlFor="f-hs">HS Code</Label>
          <Input
            id="f-hs"
            className="mt-1 h-10"
            inputMode="numeric"
            placeholder="e.g. 300490"
            value={params.hsCode}
            onChange={(e) => update({ hsCode: e.target.value })}
          />
        </div>
      </FilterGroup>

      <FilterGroup title="Geography">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="f-origin">Origin country</Label>
            <select
              id="f-origin"
              className={cn(field, "mt-1")}
              value={params.origin}
              onChange={(e) => update({ origin: e.target.value })}
            >
              <option value="">Any</option>
              {coverageCountries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="f-dest">Destination country</Label>
            <select
              id="f-dest"
              className={cn(field, "mt-1")}
              value={params.destination}
              onChange={(e) => update({ destination: e.target.value })}
            >
              <option value="">Any</option>
              {coverageCountries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </FilterGroup>

      <FilterGroup title="Trade details">
        <div>
          <span className="text-sm font-medium text-muted-strong">Trade direction</span>
          <div role="group" aria-label="Trade direction" className="mt-1 inline-flex w-full rounded-md border border-border bg-surface p-0.5">
            {([
              ["all", "All"],
              ["Import", "Imports"],
              ["Export", "Exports"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={params.flow === value}
                onClick={() => update({ flow: value })}
                className={cn(
                  "flex-1 rounded px-2 py-1.5 text-sm font-medium transition-colors",
                  params.flow === value ? "bg-background text-navy shadow-xs" : "text-muted hover:text-navy",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="f-from">Start date</Label>
            <input id="f-from" type="date" className={cn(field, "mt-1")} value={params.dateFrom} max={params.dateTo || undefined} onChange={(e) => update({ dateFrom: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="f-to">End date</Label>
            <input id="f-to" type="date" className={cn(field, "mt-1")} value={params.dateTo} min={params.dateFrom || undefined} onChange={(e) => update({ dateTo: e.target.value })} />
          </div>
        </div>
      </FilterGroup>

      <FilterGroup title="Quantity & value">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="f-minq">Min quantity</Label>
            <Input id="f-minq" className="mt-1 h-10" inputMode="numeric" value={params.minQty} onChange={(e) => update({ minQty: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="f-maxq">Max quantity</Label>
            <Input id="f-maxq" className="mt-1 h-10" inputMode="numeric" value={params.maxQty} onChange={(e) => update({ maxQty: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="f-minv">Min value (USD)</Label>
            <Input id="f-minv" className="mt-1 h-10" inputMode="numeric" value={params.minValue} onChange={(e) => update({ minValue: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="f-maxv">Max value (USD)</Label>
            <Input id="f-maxv" className="mt-1 h-10" inputMode="numeric" value={params.maxValue} onChange={(e) => update({ maxValue: e.target.value })} />
          </div>
        </div>
      </FilterGroup>

      <Button type="button" variant="ghost" size="sm" onClick={onReset} className="w-full">
        <RotateCcw className="size-4" aria-hidden />
        Clear all filters
      </Button>
    </div>
  );
}

function RecordCard({
  rec,
  onOpen,
}: {
  rec: ExploreRecord;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex flex-col rounded-[14px] border border-border bg-background p-4 text-left shadow-xs transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="flex items-center justify-between gap-2">
        <Badge tone={rec.tradeFlow === "Import" ? "primary" : "neutral"}>{rec.tradeFlow}</Badge>
        <span className="text-xs text-muted">{formatDate(rec.date)}</span>
      </div>
      <p className="mt-2 font-medium text-navy">{rec.productDescription}</p>
      <p className="text-xs text-muted">HS {rec.hsCode}</p>
      <p className="mt-2 text-sm text-muted">
        <ShipmentRoute origin={rec.originCountry} destination={rec.destinationCountry} />
      </p>
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="tabular-nums text-muted">{formatNumber(rec.quantity)} {rec.unit}</span>
        <span className="font-semibold tabular-nums text-navy">{formatCurrency(rec.tradeValue)}</span>
      </div>
    </button>
  );
}

export function ExploreWorkspace({
  records,
}: {
  records: ExploreRecord[];
}) {
  const params = useExploreUrlParams();
  const [view, setView] = React.useState<"table" | "cards">("table");
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [colsOpen, setColsOpen] = React.useState(false);
  const [hidden, setHidden] = React.useState<Set<OptionalCol>>(new Set());
  const [detail, setDetail] = React.useState<ExploreRecord | null>(null);

  const update = (patch: Partial<ExploreParams>) =>
    writeExploreUrlParams({
      ...params,
      ...patch,
      // Any change other than an explicit page change resets to page 1.
      page: "page" in patch ? (patch.page as number) : 1,
    });

  const reset = () => writeExploreUrlParams(EMPTY_PARAMS);

  const filtered = React.useMemo(
    () => filterExploreRecords(records, params),
    [records, params],
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / EXPLORE_PAGE_SIZE));
  const safePage = Math.min(params.page, pageCount);
  const pageRows = filtered.slice(
    (safePage - 1) * EXPLORE_PAGE_SIZE,
    (safePage - 1) * EXPLORE_PAGE_SIZE + EXPLORE_PAGE_SIZE,
  );

  const showCol = (id: OptionalCol) => !hidden.has(id);
  function toggleCol(id: OptionalCol) {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function exportCsv() {
    const csv = toCsv(filtered, [
      { header: "Date", get: (r) => r.date },
      { header: "Product", get: (r) => r.productDescription },
      { header: "HS Code", get: (r) => r.hsCode },
      { header: "Importer / Buyer", get: (r) => r.importer },
      { header: "Exporter / Supplier", get: (r) => r.exporter },
      { header: "Origin", get: (r) => countryName(r.originCountry) },
      { header: "Destination", get: (r) => countryName(r.destinationCountry) },
      { header: "Origin port", get: (r) => r.originPort },
      { header: "Destination port", get: (r) => r.destinationPort },
      { header: "Quantity", get: (r) => r.quantity },
      { header: "Unit", get: (r) => r.unit },
      { header: "Trade value", get: (r) => r.tradeValue },
      { header: "Currency", get: (r) => r.currency },
      { header: "Trade flow", get: (r) => r.tradeFlow },
      { header: "Transport mode", get: (r) => r.transportMode ?? "" },
      { header: "Reference", get: (r) => r.reference },
    ]);
    downloadCsv(csv, "vaskodigama-explore-sample.csv");
  }

  const activeFilterCount = [
    params.hsCode, params.origin, params.destination,
    params.dateFrom, params.dateTo, params.minQty, params.maxQty,
    params.minValue, params.maxValue,
  ].filter(Boolean).length + (params.flow !== "all" ? 1 : 0);

  // Active-filter chips shown above the results (each removable).
  const modeLabel =
    EXPLORE_MODES.find((m) => m.id === params.mode)?.label ?? "Search";
  const chips: { key: string; label: string; clear: () => void }[] = [];
  if (params.q) chips.push({ key: "q", label: `${modeLabel}: ${params.q}`, clear: () => update({ q: "" }) });
  if (params.hsCode) chips.push({ key: "hs", label: `HS Code: ${params.hsCode}`, clear: () => update({ hsCode: "" }) });
  if (params.origin) chips.push({ key: "o", label: `Origin: ${countryName(params.origin)}`, clear: () => update({ origin: "" }) });
  if (params.destination) chips.push({ key: "d", label: `Destination: ${countryName(params.destination)}`, clear: () => update({ destination: "" }) });
  if (params.flow !== "all") chips.push({ key: "f", label: `Flow: ${params.flow}`, clear: () => update({ flow: "all" }) });
  if (params.dateFrom) chips.push({ key: "df", label: `From ${params.dateFrom}`, clear: () => update({ dateFrom: "" }) });
  if (params.dateTo) chips.push({ key: "dt", label: `To ${params.dateTo}`, clear: () => update({ dateTo: "" }) });
  if (params.minQty) chips.push({ key: "mq", label: `Min qty ${params.minQty}`, clear: () => update({ minQty: "" }) });
  if (params.maxQty) chips.push({ key: "xq", label: `Max qty ${params.maxQty}`, clear: () => update({ maxQty: "" }) });
  if (params.minValue) chips.push({ key: "mv", label: `Min value ${params.minValue}`, clear: () => update({ minValue: "" }) });
  if (params.maxValue) chips.push({ key: "xv", label: `Max value ${params.maxValue}`, clear: () => update({ maxValue: "" }) });

  return (
    <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-6">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-[14px] border border-border bg-background p-4 shadow-xs">
          <div className="mb-3 flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-primary" aria-hidden />
            <h2 className="text-sm font-semibold text-navy">Filters</h2>
          </div>
          <FiltersForm params={params} update={update} onReset={reset} />
        </div>
      </aside>

      <div className="min-w-0">
        {/* Search bar */}
        <form
          role="search"
          onSubmit={(e) => e.preventDefault()}
          className="rounded-[14px] border border-border bg-background p-3 shadow-xs"
        >
          <div className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor="ex-mode" className="sr-only">Search mode</label>
            <select
              id="ex-mode"
              value={params.mode}
              onChange={(e) => update({ mode: e.target.value as ExploreMode })}
              className="h-11 rounded-md border border-border-strong bg-background px-2.5 text-sm font-medium text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:w-40"
            >
              {EXPLORE_MODES.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
            <div className="relative grow">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
              <Input
                type="search"
                aria-label={`Search by ${params.mode}`}
                placeholder={
                  params.mode === "hs-code"
                    ? "HS Code or HSN Code, e.g. 300490"
                    : `Search by ${params.mode}…`
                }
                value={params.q}
                onChange={(e) => update({ q: e.target.value })}
                className="pl-9"
              />
            </div>
            <Button type="submit" className="shrink-0">Search Global Trade</Button>
          </div>
        </form>

        {/* Toolbar */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <p className="text-sm text-muted" aria-live="polite">
            <span className="text-base font-semibold tabular-nums text-navy">{formatNumber(filtered.length)}</span> shipment records
          </p>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border-strong px-3 py-1.5 text-sm font-medium text-navy hover:bg-surface lg:hidden"
          >
            <SlidersHorizontal className="size-4" aria-hidden />
            Filters
            {activeFilterCount > 0 ? (
              <span className="ml-0.5 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">{activeFilterCount}</span>
            ) : null}
          </button>

          <div className="ml-auto flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-sm text-muted">
              <span className="sr-only sm:not-sr-only">Sort</span>
              <select
                aria-label="Sort records"
                value={params.sort}
                onChange={(e) => update({ sort: e.target.value as ExploreSort })}
                className="h-9 rounded-md border border-border bg-background px-2 text-sm text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {EXPLORE_SORTS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </label>

            {/* View toggle */}
            <div role="group" aria-label="View" className="inline-flex rounded-md border border-border bg-surface p-0.5">
              <button
                type="button"
                aria-pressed={view === "table"}
                aria-label="Table view"
                onClick={() => setView("table")}
                className={cn("rounded px-2 py-1.5", view === "table" ? "bg-background text-navy shadow-xs" : "text-muted")}
              >
                <TableIcon className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                aria-pressed={view === "cards"}
                aria-label="Card view"
                onClick={() => setView("cards")}
                className={cn("rounded px-2 py-1.5", view === "cards" ? "bg-background text-navy shadow-xs" : "text-muted")}
              >
                <LayoutGrid className="size-4" aria-hidden />
              </button>
            </div>

            {view === "table" ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setColsOpen((o) => !o)}
                  aria-expanded={colsOpen}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border-strong px-3 py-1.5 text-sm font-medium text-navy hover:bg-surface"
                >
                  <Columns3 className="size-4" aria-hidden />
                  <span className="hidden sm:inline">Columns</span>
                </button>
                {colsOpen ? (
                  <div className="absolute right-0 z-10 mt-1 w-48 rounded-md border border-border bg-background p-2 shadow-md">
                    {OPTIONAL_COLUMNS.map((c) => (
                      <label key={c.id} className="flex items-center gap-2 rounded px-2 py-1.5 text-sm text-navy hover:bg-surface">
                        <input
                          type="checkbox"
                          checked={showCol(c.id)}
                          onChange={() => toggleCol(c.id)}
                          className="size-4 rounded border-border-strong accent-[var(--primary)]"
                        />
                        {c.label}
                      </label>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}

            <Button variant="secondary" size="sm" onClick={exportCsv} disabled={filtered.length === 0}>
              <Download className="size-4" aria-hidden />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>
          </div>
        </div>

        {/* Active filter chips */}
        {chips.length > 0 ? (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-muted">Active filters:</span>
            {chips.map((chip) => (
              <span
                key={chip.key}
                className="inline-flex items-center gap-1 rounded-full bg-primary-soft py-1 pl-2.5 pr-1 text-xs font-medium text-primary-soft-foreground"
              >
                {chip.label}
                <button
                  type="button"
                  onClick={chip.clear}
                  aria-label={`Remove filter ${chip.label}`}
                  className="rounded-full p-0.5 hover:bg-primary/15"
                >
                  <X className="size-3" aria-hidden />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={reset}
              className="ml-1 text-xs font-medium text-muted hover:text-danger"
            >
              Clear all
            </button>
          </div>
        ) : null}

        {/* Results */}
        <div className="mt-3">
          {filtered.length === 0 ? (
            <EmptyState
              title="No matching shipment records"
              description="Try removing a filter, expanding the date range or searching with a broader product term."
              action={
                <Button variant="outline" size="sm" onClick={reset}>Clear all filters</Button>
              }
            />
          ) : view === "cards" ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {pageRows.map((rec) => (
                <RecordCard key={rec.id} rec={rec} onOpen={() => setDetail(rec)} />
              ))}
            </div>
          ) : (
            <div className="scroll-x rounded-[14px] border border-border bg-background shadow-xs">
              <table className="w-full text-sm">
                <caption className="sr-only">Illustrative trade records</caption>
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                    <th scope="col" className="px-3 py-2.5 font-medium">Date</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Product</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">HS</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Importer</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Exporter</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Route</th>
                    {showCol("originPort") ? <th scope="col" className="px-3 py-2.5 font-medium">Origin port</th> : null}
                    {showCol("destinationPort") ? <th scope="col" className="px-3 py-2.5 font-medium">Dest. port</th> : null}
                    <th scope="col" className="px-3 py-2.5 text-right font-medium">Qty</th>
                    <th scope="col" className="px-3 py-2.5 text-right font-medium">Value</th>
                    {showCol("transportMode") ? <th scope="col" className="px-3 py-2.5 font-medium">Mode</th> : null}
                    <th scope="col" className="px-3 py-2.5 font-medium">Flow</th>
                    {showCol("reference") ? <th scope="col" className="px-3 py-2.5 font-medium">Reference</th> : null}
                    <th scope="col" className="px-3 py-2.5 text-right font-medium"><span className="sr-only">Details</span></th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((rec) => (
                    <tr key={rec.id} className="border-b border-border/60 last:border-0 hover:bg-surface">
                      <td className="whitespace-nowrap px-3 py-2.5 text-muted">{formatDate(rec.date)}</td>
                      <td className="px-3 py-2.5 text-navy">
                        <span className="block max-w-[220px] truncate font-medium" title={rec.productDescription}>
                          {rec.productDescription}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-xs tabular-nums text-muted-strong">{rec.hsCode}</span>
                      </td>
                      <td className="px-3 py-2.5 text-muted">
                        <span className="block max-w-[160px] truncate" title={rec.importer}>{rec.importer}</span>
                      </td>
                      <td className="px-3 py-2.5 text-muted">
                        <span className="block max-w-[160px] truncate" title={rec.exporter}>{rec.exporter}</span>
                      </td>
                      <td className="px-3 py-2.5 text-muted">
                        <ShipmentRoute origin={rec.originCountry} destination={rec.destinationCountry} compact />
                      </td>
                      {showCol("originPort") ? <td className="px-3 py-2.5 text-muted">{rec.originPort}</td> : null}
                      {showCol("destinationPort") ? <td className="px-3 py-2.5 text-muted">{rec.destinationPort}</td> : null}
                      <td className="px-3 py-2.5 text-right tabular-nums text-muted">{formatNumber(rec.quantity)} {rec.unit}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-navy">{formatCurrency(rec.tradeValue)}</td>
                      {showCol("transportMode") ? <td className="px-3 py-2.5 text-muted">{rec.transportMode}</td> : null}
                      <td className="px-3 py-2.5"><Badge tone={rec.tradeFlow === "Import" ? "primary" : "neutral"}>{rec.tradeFlow}</Badge></td>
                      {showCol("reference") ? <td className="px-3 py-2.5 tabular-nums text-muted">{rec.reference}</td> : null}
                      <td className="px-3 py-2.5 text-right">
                        <Button variant="ghost" size="sm" onClick={() => setDetail(rec)}>View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filtered.length > 0 ? (
          <div className="mt-4 flex items-center justify-between gap-2">
            <span className="text-sm text-muted">
              Page {safePage} of {pageCount} · {formatNumber(filtered.length)} shipment records
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => update({ page: Math.max(1, safePage - 1) })} disabled={safePage <= 1}>
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => update({ page: Math.min(pageCount, safePage + 1) })} disabled={safePage >= pageCount}>
                Next
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Mobile filter drawer */}
      <Modal open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Filters" variant="drawer-right">
        <FiltersForm params={params} update={update} onReset={reset} />
        <div className="mt-4">
          <Button className="w-full" onClick={() => setDrawerOpen(false)}>
            Show {formatNumber(filtered.length)} shipment records
          </Button>
        </div>
      </Modal>

      {/* Record detail drawer */}
      <Modal
        open={detail !== null}
        onClose={() => setDetail(null)}
        title="Trade record"
        description="Illustrative sample record — not a verified customs filing."
        variant="drawer-right"
      >
        {detail ? (
          <>
            <dl className="divide-y divide-border text-sm">
              {([
                ["Reference", detail.reference],
                ["Date", formatDate(detail.date)],
                ["Product", detail.productDescription],
                ["HS code", detail.hsCode],
                ["Importer / Buyer", detail.importer],
                ["Exporter / Supplier", detail.exporter],
                ["Origin", `${countryName(detail.originCountry)}${detail.originState ? `, ${detail.originState}` : ""}`],
                ["Destination", `${countryName(detail.destinationCountry)}${detail.destinationState ? `, ${detail.destinationState}` : ""}`],
                ["Origin port", detail.originPort],
                ["Destination port", detail.destinationPort],
                ["Quantity", `${formatNumber(detail.quantity)} ${detail.unit}`],
                ["Trade value", formatCurrency(detail.tradeValue)],
                ["Trade flow", detail.tradeFlow],
                ["Transport mode", detail.transportMode ?? "—"],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-right font-medium text-navy">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex items-center gap-3">
              <IllustrativeBadge />
              <button
                type="button"
                onClick={() => void navigator.clipboard?.writeText(detail.reference)}
                className="text-sm text-primary hover:underline"
              >
                Copy reference
              </button>
            </div>
          </>
        ) : null}
      </Modal>
    </div>
  );
}
