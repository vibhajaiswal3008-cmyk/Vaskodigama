"use client";

/**
 * Countries, HS Codes, and Routes panel components for the Explore workspace.
 * All derive their data from the same filtered ExploreRecord[] passed by the
 * parent — no additional data fetching.
 */

import * as React from "react";
import {
  Globe2,
  Hash,
  ArrowRight,
  Building2,
  Factory,
  Package,
  Ship,
} from "lucide-react";
import type { ExploreRecord } from "@/types/explore";
import {
  deriveCountries,
  deriveHsCodes,
  deriveRoutes,
  type DerivedCountry,
  type DerivedHsCode,
  type DerivedRoute,
} from "./explore-data";
import { Flag } from "@/components/shared/flag";
import { IllustrativeBadge } from "@/components/shared/illustrative";
import { EmptyState } from "@/components/ui/misc";
import { cn, formatCurrency, formatDate, formatNumber } from "@/lib/utils";

/* ── Countries panel ──────────────────────────────────────────────────────── */

function CountryCard({
  country,
  countryName,
  totalRecords,
}: {
  country: DerivedCountry;
  countryName: (code: string) => string;
  totalRecords: number;
}) {
  const share = totalRecords > 0 ? Math.round((country.shipments / totalRecords) * 100) : 0;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-background p-5 transition-shadow hover:shadow-sm">
      {/* Country header */}
      <div className="flex items-center gap-3">
        <Flag code={country.code} className="h-5 w-7 shrink-0 rounded-sm" />
        <div>
          <p className="font-semibold text-navy">{countryName(country.code)}</p>
          <p className="text-xs text-muted">{country.code}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-lg font-bold tabular-nums text-navy">{formatNumber(country.shipments)}</p>
          <p className="text-xs text-muted">shipments ({share}%)</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all"
          style={{ width: `${share}%` }}
          aria-hidden
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-surface/60 px-2 py-2">
          <p className="text-sm font-bold tabular-nums text-navy">{formatNumber(country.buyers)}</p>
          <p className="text-[10px] text-muted">buyers</p>
        </div>
        <div className="rounded-lg bg-surface/60 px-2 py-2">
          <p className="text-sm font-bold tabular-nums text-navy">{formatNumber(country.suppliers)}</p>
          <p className="text-[10px] text-muted">suppliers</p>
        </div>
        <div className="rounded-lg bg-surface/60 px-2 py-2">
          <p className="text-sm font-bold tabular-nums text-navy">{formatCurrency(country.totalValue)}</p>
          <p className="text-[10px] text-muted">est. value</p>
        </div>
      </div>

      {/* Top product */}
      {country.topProducts[0] && (
        <p className="truncate text-xs text-muted">
          <span className="font-medium text-muted-strong">Top product:</span>{" "}
          {country.topProducts[0]}
        </p>
      )}
    </div>
  );
}

export function CountriesPanel({
  records,
  countryName,
}: {
  records: ExploreRecord[];
  countryName: (code: string) => string;
}) {
  const countries = React.useMemo(() => deriveCountries(records), [records]);

  if (countries.length === 0) {
    return (
      <EmptyState
        icon={<Globe2 className="size-8" />}
        title="No country data"
        description="Adjust your filters to see destination market breakdown."
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">
          <span className="font-semibold text-navy">{formatNumber(countries.length)}</span> destination markets in matching records
        </p>
        <IllustrativeBadge />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((c) => (
          <CountryCard
            key={c.code}
            country={c}
            countryName={countryName}
            totalRecords={records.length}
          />
        ))}
      </div>
    </div>
  );
}

/* ── HS Codes panel ───────────────────────────────────────────────────────── */

function HsCodeRow({
  hs,
  countryName,
  totalRecords,
}: {
  hs: DerivedHsCode;
  countryName: (code: string) => string;
  totalRecords: number;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const share = totalRecords > 0 ? Math.round((hs.shipments / totalRecords) * 100) : 0;

  return (
    <div className="rounded-xl border border-border bg-background">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-surface/40"
      >
        {/* HS code badge */}
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-2 font-mono text-xs font-semibold text-muted-strong">
          {hs.code.slice(0, 4)}
        </span>

        {/* Description */}
        <div className="min-w-0 flex-1">
          <p className="font-medium text-navy">{hs.code}</p>
          <p className="mt-0.5 line-clamp-1 text-xs text-muted">{hs.description}</p>
        </div>

        {/* Stats */}
        <div className="hidden shrink-0 items-center gap-4 text-right sm:flex">
          <div>
            <p className="text-sm font-bold tabular-nums text-navy">{hs.shipments}</p>
            <p className="text-[10px] text-muted">shipments</p>
          </div>
          <div>
            <p className="text-sm font-bold tabular-nums text-navy">{formatCurrency(hs.totalValue)}</p>
            <p className="text-[10px] text-muted">est. value</p>
          </div>
          <div>
            <p className="text-sm font-bold tabular-nums text-navy">{share}%</p>
            <p className="text-[10px] text-muted">of total</p>
          </div>
        </div>

        <Hash
          className={cn(
            "size-4 shrink-0 text-muted transition-transform",
            expanded && "rotate-90",
          )}
          aria-hidden
        />
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-border px-4 pb-4 pt-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
                Origin countries
              </p>
              <div className="flex flex-wrap gap-1.5">
                {hs.originCountries.map((c) => (
                  <span key={c} className="flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 text-xs text-muted-strong">
                    <Flag code={c} className="h-2.5 w-3.5" />
                    {countryName(c)}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
                Destination countries
              </p>
              <div className="flex flex-wrap gap-1.5">
                {hs.destinationCountries.map((c) => (
                  <span key={c} className="flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 text-xs text-muted-strong">
                    <Flag code={c} className="h-2.5 w-3.5" />
                    {countryName(c)}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-3 flex gap-4 text-sm">
            <span className="flex items-center gap-1 text-muted">
              <Building2 className="size-3.5" aria-hidden />
              {hs.buyers} buyers
            </span>
            <span className="flex items-center gap-1 text-muted">
              <Factory className="size-3.5" aria-hidden />
              {hs.suppliers} suppliers
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export function HSCodesPanel({
  records,
  countryName,
}: {
  records: ExploreRecord[];
  countryName: (code: string) => string;
}) {
  const hsCodes = React.useMemo(() => deriveHsCodes(records), [records]);

  if (hsCodes.length === 0) {
    return (
      <EmptyState
        icon={<Hash className="size-8" />}
        title="No HS codes found"
        description="Adjust your filters to see HS code breakdown."
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">
          <span className="font-semibold text-navy">{formatNumber(hsCodes.length)}</span> HS codes in matching records
        </p>
        <IllustrativeBadge />
      </div>
      <div className="space-y-2">
        {hsCodes.map((hs) => (
          <HsCodeRow key={hs.code} hs={hs} countryName={countryName} totalRecords={records.length} />
        ))}
      </div>
    </div>
  );
}

/* ── Routes panel ─────────────────────────────────────────────────────────── */

function RouteCard({
  route,
  countryName,
}: {
  route: DerivedRoute;
  countryName: (code: string) => string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-5 transition-shadow hover:shadow-sm">
      {/* Route header */}
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2 min-w-0">
          <Flag code={route.origin} className="h-4 w-5.5 shrink-0 rounded-sm" />
          <span className="truncate font-semibold text-navy">{countryName(route.origin)}</span>
          <ArrowRight className="size-3.5 shrink-0 text-muted" aria-hidden />
          <Flag code={route.destination} className="h-4 w-5.5 shrink-0 rounded-sm" />
          <span className="truncate font-semibold text-navy">{countryName(route.destination)}</span>
        </div>
      </div>

      {/* Key stats */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-surface/60 px-2 py-2 text-center">
          <p className="text-sm font-bold tabular-nums text-navy">{formatNumber(route.shipments)}</p>
          <p className="text-[10px] text-muted">shipments</p>
        </div>
        <div className="rounded-lg bg-surface/60 px-2 py-2 text-center">
          <p className="text-sm font-bold tabular-nums text-navy">{formatCurrency(route.totalValue)}</p>
          <p className="text-[10px] text-muted">est. value</p>
        </div>
        <div className="rounded-lg bg-surface/60 px-2 py-2 text-center">
          <p className="text-sm font-bold tabular-nums text-navy">{route.buyers}</p>
          <p className="text-[10px] text-muted">buyers</p>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
        <span className="flex items-center gap-1">
          <Ship className="size-3" aria-hidden />
          {route.primaryMode}
        </span>
        <span className="flex items-center gap-1">
          <Factory className="size-3" aria-hidden />
          {route.suppliers} suppliers
        </span>
        <span>Last: {formatDate(route.latestDate)}</span>
      </div>

      {/* Top product */}
      {route.topProducts[0] && (
        <p className="mt-2 truncate text-xs text-muted">
          <Package className="mr-1 inline size-3" aria-hidden />
          {route.topProducts[0]}
        </p>
      )}
    </div>
  );
}

export function RoutesPanel({
  records,
  countryName,
}: {
  records: ExploreRecord[];
  countryName: (code: string) => string;
}) {
  const routes = React.useMemo(() => deriveRoutes(records), [records]);

  if (routes.length === 0) {
    return (
      <EmptyState
        icon={<Globe2 className="size-8" />}
        title="No trade routes found"
        description="Adjust your filters to see origin-to-destination route analysis."
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">
          <span className="font-semibold text-navy">{formatNumber(routes.length)}</span> trade routes in matching records
        </p>
        <IllustrativeBadge />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {routes.map((r) => (
          <RouteCard
            key={`${r.origin}-${r.destination}`}
            route={r}
            countryName={countryName}
          />
        ))}
      </div>
    </div>
  );
}
