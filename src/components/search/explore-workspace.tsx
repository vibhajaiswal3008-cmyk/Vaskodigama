"use client";

import * as React from "react";
import {
  Search,
  SlidersHorizontal,
  Download,
  X,
  RotateCcw,
  LayoutGrid,
  Table as TableIcon,
  ChevronDown,
  ChevronRight,
  Ship,
  Building2,
  Factory,
  Globe2,
  Hash,
  MapPin,
  BarChart3,
  Info,
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
import { cn, formatCompact, formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import { toCsv, downloadCsv } from "@/lib/csv";
import { ExploreOverview } from "./explore-overview";
import { BuyersPanel, SuppliersPanel } from "./explore-companies";
import { CountriesPanel, HSCodesPanel, RoutesPanel } from "./explore-panels";

/* ── Country name lookup ─────────────────────────────────────────────────── */

const getCountryName = (code: string) =>
  coverageCountries.find((c) => c.code === code)?.name ?? code;

/* ── URL state ───────────────────────────────────────────────────────────── */

const EXPLORE_URL_EVENT = "vdg:explore-url";

function useExploreUrlParams(): ExploreParams & { tab: ExploreTab } {
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
  return React.useMemo(() => {
    const raw = Object.fromEntries(new URLSearchParams(search));
    const base = parseExploreParams(raw);
    const tab = EXPLORE_TABS.some((t) => t.id === raw.tab)
      ? (raw.tab as ExploreTab)
      : "overview";
    return { ...base, tab };
  }, [search]);
}

function writeExploreUrlParams(p: ExploreParams & { tab?: ExploreTab }) {
  const qs = serializeExploreParams(p);
  const tabPart = p.tab && p.tab !== "overview" ? `tab=${p.tab}` : "";
  const full = [qs, tabPart].filter(Boolean).join("&");
  window.history.replaceState(null, "", full ? `?${full}` : window.location.pathname);
  window.dispatchEvent(new Event(EXPLORE_URL_EVENT));
}

/* ── Tab definitions ─────────────────────────────────────────────────────── */

type ExploreTab = "overview" | "shipments" | "buyers" | "suppliers" | "countries" | "hs-codes" | "routes";

const EXPLORE_TABS: {
  id: ExploreTab;
  label: string;
  icon: React.ElementType;
  countFn?: (records: ExploreRecord[]) => number;
}[] = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "shipments", label: "Shipments", icon: Ship, countFn: (r) => r.length },
  { id: "buyers", label: "Buyers", icon: Building2, countFn: (r) => new Set(r.map((x) => x.importer || x.buyer).filter(Boolean)).size },
  { id: "suppliers", label: "Suppliers", icon: Factory, countFn: (r) => new Set(r.map((x) => x.exporter || x.supplier).filter(Boolean)).size },
  { id: "countries", label: "Countries", icon: Globe2, countFn: (r) => new Set(r.map((x) => x.destinationCountry).filter(Boolean)).size },
  { id: "hs-codes", label: "HS Codes", icon: Hash, countFn: (r) => new Set(r.map((x) => x.hsCode).filter(Boolean)).size },
  { id: "routes", label: "Routes", icon: MapPin, countFn: (r) => new Set(r.map((x) => `${x.originCountry}→${x.destinationCountry}`)).size },
];

/* ── Filter sidebar ──────────────────────────────────────────────────────── */

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(true);
  return (
    <div className="border-t border-border pt-4 first:border-0 first:pt-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</p>
        <ChevronDown
          className={cn("size-3.5 text-muted transition-transform", !open && "-rotate-90")}
          aria-hidden
        />
      </button>
      {open && <div className="mt-3 space-y-3">{children}</div>}
    </div>
  );
}

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
      <FilterGroup title="Classification">
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
        <div>
          <Label htmlFor="f-origin">Origin country</Label>
          <select
            id="f-origin"
            className={cn(field, "mt-1")}
            value={params.origin}
            onChange={(e) => update({ origin: e.target.value })}
          >
            <option value="">Any origin</option>
            {coverageCountries.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
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
            <option value="">Any destination</option>
            {coverageCountries.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>
      </FilterGroup>

      <FilterGroup title="Trade direction">
        <div role="group" aria-label="Trade direction" className="inline-flex w-full rounded-md border border-border bg-surface p-0.5">
          {(["all", "Import", "Export"] as const).map((value) => (
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
              {value === "all" ? "All" : value + "s"}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Date range">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="f-from">From</Label>
            <input id="f-from" type="date" className={cn(field, "mt-1")} value={params.dateFrom} max={params.dateTo || undefined} onChange={(e) => update({ dateFrom: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="f-to">To</Label>
            <input id="f-to" type="date" className={cn(field, "mt-1")} value={params.dateTo} min={params.dateFrom || undefined} onChange={(e) => update({ dateTo: e.target.value })} />
          </div>
        </div>
      </FilterGroup>

      <FilterGroup title="Quantity & value">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="f-minq">Min qty</Label>
            <Input id="f-minq" className="mt-1 h-10" inputMode="numeric" value={params.minQty} onChange={(e) => update({ minQty: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="f-maxq">Max qty</Label>
            <Input id="f-maxq" className="mt-1 h-10" inputMode="numeric" value={params.maxQty} onChange={(e) => update({ maxQty: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="f-minv">Min value $</Label>
            <Input id="f-minv" className="mt-1 h-10" inputMode="numeric" value={params.minValue} onChange={(e) => update({ minValue: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="f-maxv">Max value $</Label>
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

/* ── Shipment row (expandable) ──────────────────────────────────────────── */

function ShipmentRow({ rec }: { rec: ExploreRecord }) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <>
      <tr
        className={cn(
          "border-b border-border/60 last:border-0 transition-colors",
          expanded ? "bg-surface/40" : "hover:bg-surface/30",
        )}
      >
        <td className="px-3 py-3">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse details" : "Expand details"}
            className="flex size-6 items-center justify-center rounded text-muted hover:bg-surface hover:text-navy"
          >
            <ChevronRight
              className={cn("size-4 transition-transform", expanded && "rotate-90")}
              aria-hidden
            />
          </button>
        </td>
        <td className="whitespace-nowrap px-3 py-3 text-xs text-muted">
          {formatDate(rec.date)}
        </td>
        <td className="px-3 py-3">
          <p className="max-w-[200px] truncate font-medium text-navy text-sm" title={rec.productDescription}>
            {rec.productDescription}
          </p>
          <p className="mt-0.5 font-mono text-[11px] text-muted">{rec.hsCode}</p>
        </td>
        <td className="px-3 py-3">
          <p className="max-w-[140px] truncate text-sm text-muted-strong" title={rec.importer || rec.buyer}>
            {rec.importer || rec.buyer || "—"}
          </p>
        </td>
        <td className="px-3 py-3">
          <p className="max-w-[140px] truncate text-sm text-muted-strong" title={rec.exporter || rec.supplier}>
            {rec.exporter || rec.supplier || "—"}
          </p>
        </td>
        <td className="whitespace-nowrap px-3 py-3">
          <span className="inline-flex items-center gap-1 text-xs text-muted">
            <Flag code={rec.originCountry} className="h-3 w-4 shrink-0" />
            {rec.originCountry}
            <span className="text-muted/50" aria-hidden>→</span>
            <Flag code={rec.destinationCountry} className="h-3 w-4 shrink-0" />
            {rec.destinationCountry}
          </span>
        </td>
        <td className="px-3 py-3 text-right">
          <p className="font-semibold tabular-nums text-navy text-sm">{formatCurrency(rec.tradeValue)}</p>
          <p className="text-[11px] tabular-nums text-muted">{formatNumber(rec.quantity)} {rec.unit}</p>
        </td>
        <td className="px-3 py-3">
          <Badge tone={rec.tradeFlow === "Import" ? "primary" : "neutral"} className="text-[11px]">
            {rec.tradeFlow}
          </Badge>
        </td>
      </tr>

      {/* Expanded row */}
      {expanded && (
        <tr className="border-b border-border/60 bg-surface/20">
          <td colSpan={8} className="px-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-muted">Reference</dt>
                  <dd className="font-mono font-medium text-navy text-xs">{rec.reference}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted">HS Code</dt>
                  <dd className="font-mono text-navy">{rec.hsCode}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted">Quantity</dt>
                  <dd className="font-medium text-navy">{formatNumber(rec.quantity)} {rec.unit}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted">Trade value</dt>
                  <dd className="font-medium text-navy">{formatCurrency(rec.tradeValue)}</dd>
                </div>
              </dl>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-muted">Origin</dt>
                  <dd className="font-medium text-navy">{getCountryName(rec.originCountry)}{rec.originState ? `, ${rec.originState}` : ""}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted">Origin port</dt>
                  <dd className="font-medium text-navy">{rec.originPort || "—"}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted">Destination</dt>
                  <dd className="font-medium text-navy">{getCountryName(rec.destinationCountry)}{rec.destinationState ? `, ${rec.destinationState}` : ""}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted">Dest. port</dt>
                  <dd className="font-medium text-navy">{rec.destinationPort || "—"}</dd>
                </div>
              </dl>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-muted">Transport</dt>
                  <dd className="font-medium text-navy">{rec.transportMode ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted">Buyer</dt>
                  <dd className="font-medium text-navy">{rec.buyer || rec.importer || "—"}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted">Supplier</dt>
                  <dd className="font-medium text-navy">{rec.supplier || rec.exporter || "—"}</dd>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <IllustrativeBadge />
                  <span className="text-xs text-muted">Sample record</span>
                </div>
              </dl>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

/* ── Shipments panel ─────────────────────────────────────────────────────── */

function ShipmentsPanel({
  records,
  params,
  update,
  onReset,
}: {
  records: ExploreRecord[];
  params: ExploreParams;
  update: (p: Partial<ExploreParams>) => void;
  onReset: () => void;
}) {
  const [view, setView] = React.useState<"table" | "cards">("table");
  const pageCount = Math.max(1, Math.ceil(records.length / EXPLORE_PAGE_SIZE));
  const safePage = Math.min(params.page, pageCount);
  const pageRows = records.slice(
    (safePage - 1) * EXPLORE_PAGE_SIZE,
    safePage * EXPLORE_PAGE_SIZE,
  );

  function exportCsv() {
    const csv = toCsv(records, [
      { header: "Date", get: (r) => r.date },
      { header: "Product", get: (r) => r.productDescription },
      { header: "HS Code", get: (r) => r.hsCode },
      { header: "Importer / Buyer", get: (r) => r.importer || r.buyer },
      { header: "Exporter / Supplier", get: (r) => r.exporter || r.supplier },
      { header: "Origin", get: (r) => getCountryName(r.originCountry) },
      { header: "Destination", get: (r) => getCountryName(r.destinationCountry) },
      { header: "Origin port", get: (r) => r.originPort },
      { header: "Destination port", get: (r) => r.destinationPort },
      { header: "Quantity", get: (r) => r.quantity },
      { header: "Unit", get: (r) => r.unit },
      { header: "Trade value", get: (r) => r.tradeValue },
      { header: "Trade flow", get: (r) => r.tradeFlow },
      { header: "Transport mode", get: (r) => r.transportMode ?? "" },
      { header: "Reference", get: (r) => r.reference },
    ]);
    downloadCsv(csv, "vaskodigama-explore-sample.csv");
  }

  if (records.length === 0) {
    return (
      <EmptyState
        icon={<Ship className="size-8" />}
        title="No shipment records match the current filters"
        description="Try expanding the date range, removing a country filter, or searching with a broader product term."
        action={
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="size-4" aria-hidden />
            Clear all filters
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm text-muted" aria-live="polite">
          <span className="font-semibold tabular-nums text-navy">{formatNumber(records.length)}</span> shipment records
        </p>
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

          <Button variant="secondary" size="sm" onClick={exportCsv}>
            <Download className="size-4" aria-hidden />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Table view */}
      {view === "table" ? (
        <div className="overflow-hidden rounded-xl border border-border bg-background shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <caption className="sr-only">Illustrative shipment records</caption>
              <thead>
                <tr className="border-b border-border bg-surface/50 text-left text-xs uppercase tracking-wide text-muted">
                  <th scope="col" className="px-3 py-3 font-medium w-10"><span className="sr-only">Expand</span></th>
                  <th scope="col" className="px-3 py-3 font-medium">Date</th>
                  <th scope="col" className="px-3 py-3 font-medium">Product · HS</th>
                  <th scope="col" className="px-3 py-3 font-medium">Buyer</th>
                  <th scope="col" className="px-3 py-3 font-medium">Supplier</th>
                  <th scope="col" className="px-3 py-3 font-medium">Route</th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">Value · Qty</th>
                  <th scope="col" className="px-3 py-3 font-medium">Flow</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((rec) => (
                  <ShipmentRow key={rec.id} rec={rec} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card view */
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {pageRows.map((rec) => (
            <div
              key={rec.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <Badge tone={rec.tradeFlow === "Import" ? "primary" : "neutral"}>{rec.tradeFlow}</Badge>
                <span className="text-xs text-muted">{formatDate(rec.date)}</span>
              </div>
              <div>
                <p className="font-medium text-navy line-clamp-2">{rec.productDescription}</p>
                <p className="mt-0.5 font-mono text-xs text-muted">HS {rec.hsCode}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Flag code={rec.originCountry} className="h-3 w-4 shrink-0" />
                {rec.originCountry}
                <span aria-hidden>→</span>
                <Flag code={rec.destinationCountry} className="h-3 w-4 shrink-0" />
                {rec.destinationCountry}
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2 text-sm">
                <span className="tabular-nums text-muted">{formatNumber(rec.quantity)} {rec.unit}</span>
                <span className="font-semibold tabular-nums text-navy">{formatCurrency(rec.tradeValue)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {records.length > EXPLORE_PAGE_SIZE && (
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-muted">
            Page {safePage} of {pageCount} · {formatNumber(records.length)} records
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
      )}
    </div>
  );
}

/* ── Main ExploreWorkspace ──────────────────────────────────────────────── */

export function ExploreWorkspace({ records }: { records: ExploreRecord[] }) {
  const params = useExploreUrlParams();
  const { tab, ...exploreParams } = params;

  const [filterOpen, setFilterOpen] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const searchRef = React.useRef<HTMLFormElement>(null);

  const update = (patch: Partial<ExploreParams & { tab?: ExploreTab }>) =>
    writeExploreUrlParams({
      ...params,
      ...patch,
      page: "page" in patch ? (patch.page as number) : 1,
    });

  const setTab = (t: string) => update({ tab: t as ExploreTab });
  const reset = () => writeExploreUrlParams({ ...EMPTY_PARAMS, tab });

  const filtered = React.useMemo(
    () => filterExploreRecords(records, exploreParams),
    [records, exploreParams],
  );

  const activeFilterCount = [
    exploreParams.hsCode, exploreParams.origin, exploreParams.destination,
    exploreParams.dateFrom, exploreParams.dateTo, exploreParams.minQty,
    exploreParams.maxQty, exploreParams.minValue, exploreParams.maxValue,
  ].filter(Boolean).length + (exploreParams.flow !== "all" ? 1 : 0);

  // Active filter chips
  const chips: { key: string; label: string; clear: () => void }[] = [];
  if (exploreParams.q) chips.push({ key: "q", label: `"${exploreParams.q}"`, clear: () => update({ q: "" }) });
  if (exploreParams.hsCode) chips.push({ key: "hs", label: `HS: ${exploreParams.hsCode}`, clear: () => update({ hsCode: "" }) });
  if (exploreParams.origin) chips.push({ key: "o", label: `Origin: ${getCountryName(exploreParams.origin)}`, clear: () => update({ origin: "" }) });
  if (exploreParams.destination) chips.push({ key: "d", label: `Dest: ${getCountryName(exploreParams.destination)}`, clear: () => update({ destination: "" }) });
  if (exploreParams.flow !== "all") chips.push({ key: "f", label: exploreParams.flow === "Import" ? "Imports only" : "Exports only", clear: () => update({ flow: "all" }) });
  if (exploreParams.dateFrom) chips.push({ key: "df", label: `From ${exploreParams.dateFrom}`, clear: () => update({ dateFrom: "" }) });
  if (exploreParams.dateTo) chips.push({ key: "dt", label: `To ${exploreParams.dateTo}`, clear: () => update({ dateTo: "" }) });

  return (
    <div className="space-y-4">
      {/* ── Search bar ─────────────────────────────────────────────────── */}
      <form
        ref={searchRef}
        role="search"
        aria-label="Search trade records"
        onSubmit={(e) => e.preventDefault()}
        className="rounded-xl border border-border bg-background p-3 shadow-xs"
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <label htmlFor="ex-mode" className="sr-only">Search mode</label>
          <select
            id="ex-mode"
            value={exploreParams.mode}
            onChange={(e) => update({ mode: e.target.value as ExploreMode })}
            className="h-11 rounded-lg border border-border-strong bg-background px-2.5 text-sm font-medium text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:w-36"
          >
            {EXPLORE_MODES.map((m) => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
          <div className="relative grow">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <Input
              type="search"
              aria-label={`Search by ${exploreParams.mode}`}
              placeholder={
                exploreParams.mode === "hs-code"
                  ? "HS Code, e.g. 300490"
                  : `Search by ${exploreParams.mode}…`
              }
              value={exploreParams.q}
              onChange={(e) => update({ q: e.target.value })}
              className="pl-9 h-11"
            />
          </div>
          <Button type="submit" className="h-11 shrink-0">
            <Search className="size-4" aria-hidden />
            Search
          </Button>
        </div>
      </form>

      {/* ── Demo notice ────────────────────────────────────────────────── */}
      <div
        role="note"
        className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning-soft px-3 py-2 text-sm text-warning"
      >
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        <span>
          <strong>Demonstration environment</strong> — all records are fictional samples that illustrate the Vaskodigama interface.
        </span>
      </div>

      {/* ── Result count + active chips ────────────────────────────────── */}
      {(chips.length > 0 || filtered.length < records.length) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted" aria-live="polite">
            <span className="font-semibold text-navy">{formatNumber(filtered.length)}</span>
            {" "}/{" "}
            {formatNumber(records.length)} records match
          </span>
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
          {chips.length > 0 && (
            <button
              type="button"
              onClick={reset}
              className="text-xs font-medium text-muted hover:text-danger"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* ── Tabs + content ─────────────────────────────────────────────── */}
      <div className="lg:grid lg:grid-cols-[256px_1fr] lg:gap-5">
        {/* Desktop sidebar */}
        <aside className={cn("hidden lg:block", !sidebarOpen && "lg:hidden")}>
          <div className="sticky top-24 rounded-xl border border-border bg-background p-4 shadow-xs">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-primary" aria-hidden />
                <h2 className="text-sm font-semibold text-navy">Filters</h2>
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="text-xs text-muted hover:text-navy"
                aria-label="Collapse filters"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <FiltersForm params={exploreParams} update={update} onReset={reset} />
          </div>
        </aside>

        {/* Collapsed sidebar toggle */}
        {!sidebarOpen && (
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="hidden lg:flex items-center gap-1.5 self-start rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted hover:text-navy"
            aria-label="Show filters"
          >
            <SlidersHorizontal className="size-4" aria-hidden />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}

        {/* Main content */}
        <div className="min-w-0 space-y-4">
          {/* Tab bar */}
          <div
            role="tablist"
            aria-label="Result categories"
            className="flex gap-0.5 overflow-x-auto rounded-xl border border-border bg-surface/60 p-1 scrollbar-hide"
          >
            {EXPLORE_TABS.map((t) => {
              const Icon = t.icon;
              const count = t.countFn ? t.countFn(filtered) : undefined;
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${t.id}`}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "relative flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary",
                    isActive
                      ? "bg-background text-navy shadow-xs"
                      : "text-muted hover:text-navy",
                  )}
                >
                  <Icon className="size-3.5" aria-hidden />
                  {t.label}
                  {count !== undefined && (
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                        isActive ? "bg-primary-soft text-primary" : "bg-surface-2 text-muted",
                      )}
                    >
                      {formatCompact(count)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile filter button (inside main area) */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong px-3 py-1.5 text-sm font-medium text-navy hover:bg-surface"
            >
              <SlidersHorizontal className="size-4" aria-hidden />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-0.5 rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground">{activeFilterCount}</span>
              )}
            </button>
          </div>

          {/* Tab panels */}
          {EXPLORE_TABS.map((t) => (
            <div
              key={t.id}
              id={`panel-${t.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${t.id}`}
              hidden={tab !== t.id}
            >
              {tab === t.id && (
                <>
                  {t.id === "overview" && (
                    <ExploreOverview
                      records={filtered}
                      onTabChange={setTab}
                      countryName={getCountryName}
                    />
                  )}
                  {t.id === "shipments" && (
                    <ShipmentsPanel
                      records={filtered}
                      params={exploreParams}
                      update={update}
                      onReset={reset}
                    />
                  )}
                  {t.id === "buyers" && (
                    <BuyersPanel records={filtered} countryName={getCountryName} />
                  )}
                  {t.id === "suppliers" && (
                    <SuppliersPanel records={filtered} countryName={getCountryName} />
                  )}
                  {t.id === "countries" && (
                    <CountriesPanel records={filtered} countryName={getCountryName} />
                  )}
                  {t.id === "hs-codes" && (
                    <HSCodesPanel records={filtered} countryName={getCountryName} />
                  )}
                  {t.id === "routes" && (
                    <RoutesPanel records={filtered} countryName={getCountryName} />
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <Modal open={filterOpen} onClose={() => setFilterOpen(false)} title="Filters" variant="drawer-right">
        <FiltersForm params={exploreParams} update={update} onReset={reset} />
        <div className="mt-4">
          <Button className="w-full" onClick={() => setFilterOpen(false)}>
            Show {formatNumber(filtered.length)} records
          </Button>
        </div>
      </Modal>
    </div>
  );
}

