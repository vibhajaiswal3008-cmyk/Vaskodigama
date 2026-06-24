"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowDownUp, ArrowUpRight, Search } from "lucide-react";
import type { CoverageCountry, CoverageRegion } from "@/config/coverage";
import { COVERAGE_REGIONS } from "@/config/coverage";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/misc";
import { IllustrativeBadge } from "@/components/shared/illustrative";
import { Button } from "@/components/ui/button";
import { cn, formatCompact, formatCurrency } from "@/lib/utils";

type SortKey = "az" | "za" | "records";

const SORTS: { id: SortKey; label: string }[] = [
  { id: "az", label: "A–Z" },
  { id: "za", label: "Z–A" },
  { id: "records", label: "Most records" },
];

function CountryCard({ country }: { country: CoverageCountry }) {
  return (
    <Link
      href={`/countries/${country.slug}`}
      className="group flex flex-col rounded-[14px] border border-border bg-background p-4 shadow-xs transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl leading-none" aria-hidden>
            {country.flag}
          </span>
          <div>
            <p className="font-semibold text-navy">{country.name}</p>
            <p className="text-xs text-muted">
              {country.region} · {country.code}
            </p>
          </div>
        </div>
        <ArrowUpRight
          className="size-4 shrink-0 text-muted transition-colors group-hover:text-primary"
          aria-hidden
        />
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <dt className="text-muted">Records</dt>
          <dd className="font-medium tabular-nums text-navy">
            {formatCompact(country.summary.recordCount)}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Top group</dt>
          <dd className="truncate font-medium text-navy" title={country.summary.topProductGroup}>
            {country.summary.topProductGroup}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Import value</dt>
          <dd className="font-medium tabular-nums text-navy">
            {formatCurrency(country.summary.importValue)}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Export value</dt>
          <dd className="font-medium tabular-nums text-navy">
            {country.summary.exportValue
              ? formatCurrency(country.summary.exportValue)
              : "—"}
          </dd>
        </div>
      </dl>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {country.hasImportData ? (
          <Badge tone="primary">Import data</Badge>
        ) : null}
        {country.hasExportData ? (
          <Badge tone="success">Export data</Badge>
        ) : (
          <Badge tone="outline">Export: coming soon</Badge>
        )}
      </div>
    </Link>
  );
}

export function CountriesExplorer({
  countries,
}: {
  countries: CoverageCountry[];
}) {
  const [query, setQuery] = React.useState("");
  const [region, setRegion] = React.useState<CoverageRegion | "all">("all");
  const [sort, setSort] = React.useState<SortKey>("az");

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = countries.filter((c) => {
      if (region !== "all" && c.region !== region) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q)
      );
    });
    rows.sort((a, b) => {
      if (sort === "records") return b.summary.recordCount - a.summary.recordCount;
      const cmp = a.name.localeCompare(b.name);
      return sort === "za" ? -cmp : cmp;
    });
    return rows;
  }, [countries, query, region, sort]);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative grow sm:max-w-xs">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
              aria-hidden
            />
            <Input
              type="search"
              aria-label="Search countries by name, code or region"
              placeholder="Search countries…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <label className="flex items-center gap-1.5 text-sm text-muted">
            <ArrowDownUp className="size-4" aria-hidden />
            <span className="sr-only sm:not-sr-only">Sort</span>
            <select
              aria-label="Sort countries"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-11 rounded-md border border-border-strong bg-background px-2 text-sm text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <div className="ml-auto self-center">
            <IllustrativeBadge />
          </div>
        </div>

        {/* Region filter */}
        <div role="group" aria-label="Filter by region" className="scroll-x flex gap-1.5 pb-1">
          <button
            type="button"
            aria-pressed={region === "all"}
            onClick={() => setRegion("all")}
            className={cn(
              "whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              region === "all"
                ? "border-primary bg-primary-soft text-primary-soft-foreground"
                : "border-border text-muted hover:border-primary hover:text-navy",
            )}
          >
            All regions
          </button>
          {COVERAGE_REGIONS.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={region === r}
              onClick={() => setRegion(r)}
              className={cn(
                "whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                region === r
                  ? "border-primary bg-primary-soft text-primary-soft-foreground"
                  : "border-border text-muted hover:border-primary hover:text-navy",
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-muted" aria-live="polite">
        Showing <span className="font-medium text-navy">{visible.length}</span> of{" "}
        <span className="font-medium text-navy">{countries.length}</span>{" "}
        demonstration markets
      </p>

      {visible.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No markets match your search"
            description="Try a different country name, ISO code, or clear the region filter."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery("");
                  setRegion("all");
                }}
              >
                Clear filters
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((c) => (
            <CountryCard key={c.slug} country={c} />
          ))}
        </div>
      )}
    </div>
  );
}
