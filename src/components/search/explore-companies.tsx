"use client";

import * as React from "react";
import {
  Building2,
  Factory,
  Calendar,
  TrendingUp,
  Package,
  Globe2,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import type { ExploreRecord } from "@/types/explore";
import { deriveBuyers, deriveSuppliers, type DerivedCompany } from "./explore-data";
import { Flag } from "@/components/shared/flag";
import { IllustrativeBadge } from "@/components/shared/illustrative";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import { EmptyState } from "@/components/ui/misc";

/* ── Company card ─────────────────────────────────────────────────────────── */

function CompanyCard({
  company,
  role,
  countryName,
}: {
  company: DerivedCompany;
  role: "buyer" | "supplier";
  countryName: (code: string) => string;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const primaryCountry = company.countries[0] ?? "";

  return (
    <div className="group rounded-xl border border-border bg-background p-5 transition-shadow hover:shadow-sm">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
          {role === "buyer" ? (
            <Building2 className="size-5" aria-hidden />
          ) : (
            <Factory className="size-5" aria-hidden />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-navy" title={company.name}>
            {company.name}
          </h3>
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted">
            {primaryCountry && (
              <span className="flex items-center gap-1">
                <Flag code={primaryCountry} className="h-3 w-4 shrink-0" />
                {countryName(primaryCountry)}
              </span>
            )}
            <Badge tone={role === "buyer" ? "primary" : "neutral"} className="capitalize">
              {role}
            </Badge>
          </div>
        </div>
      </div>

      {/* Key stats */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-surface/60 px-3 py-2">
          <p className="text-lg font-bold tabular-nums text-navy">{formatNumber(company.shipments)}</p>
          <p className="text-xs text-muted">Shipments</p>
        </div>
        <div className="rounded-lg bg-surface/60 px-3 py-2">
          <p className="text-lg font-bold tabular-nums text-navy">
            {formatCurrency(company.totalValue)}
          </p>
          <p className="text-xs text-muted">Est. value</p>
        </div>
      </div>

      {/* Meta row */}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
        <span className="flex items-center gap-1">
          <Calendar className="size-3" aria-hidden />
          Last active {formatDate(company.latestDate)}
        </span>
        {company.countries.length > 1 && (
          <span className="flex items-center gap-1">
            <Globe2 className="size-3" aria-hidden />
            {company.countries.length} markets
          </span>
        )}
      </div>

      {/* Top products */}
      {company.topProducts.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
            Top products
          </p>
          <ul className="space-y-1">
            {company.topProducts.slice(0, expanded ? 3 : 2).map((p) => (
              <li key={p} className="flex items-start gap-1.5 text-xs text-muted-strong">
                <Package className="mt-0.5 size-3 shrink-0 text-muted" aria-hidden />
                <span className="line-clamp-1">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* HS codes */}
      {expanded && company.topHsCodes.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
            HS codes
          </p>
          <div className="flex flex-wrap gap-1">
            {company.topHsCodes.map((hs) => (
              <span
                key={hs}
                className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-xs text-muted-strong"
              >
                {hs}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Expand toggle */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg border border-border py-1.5 text-xs font-medium text-muted hover:bg-surface hover:text-navy transition-colors"
      >
        {expanded ? "Show less" : "Show more"}
        <ChevronDown
          className={cn("size-3.5 transition-transform", expanded && "rotate-180")}
          aria-hidden
        />
      </button>
    </div>
  );
}

/* ── Buyers panel ─────────────────────────────────────────────────────────── */

export function BuyersPanel({
  records,
  countryName,
}: {
  records: ExploreRecord[];
  countryName: (code: string) => string;
}) {
  const buyers = React.useMemo(() => deriveBuyers(records), [records]);

  if (buyers.length === 0) {
    return (
      <EmptyState
        icon={<Building2 className="size-8" />}
        title="No buyers found"
        description="Adjust your filters to find buyers in the matching shipment records."
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">
          <span className="font-semibold text-navy">{formatNumber(buyers.length)}</span> buyers in matching records
        </p>
        <IllustrativeBadge />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {buyers.map((b) => (
          <CompanyCard key={b.name} company={b} role="buyer" countryName={countryName} />
        ))}
      </div>
    </div>
  );
}

/* ── Suppliers panel ──────────────────────────────────────────────────────── */

export function SuppliersPanel({
  records,
  countryName,
}: {
  records: ExploreRecord[];
  countryName: (code: string) => string;
}) {
  const suppliers = React.useMemo(() => deriveSuppliers(records), [records]);

  if (suppliers.length === 0) {
    return (
      <EmptyState
        icon={<Factory className="size-8" />}
        title="No suppliers found"
        description="Adjust your filters to find suppliers in the matching shipment records."
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">
          <span className="font-semibold text-navy">{formatNumber(suppliers.length)}</span> suppliers in matching records
        </p>
        <IllustrativeBadge />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((s) => (
          <CompanyCard key={s.name} company={s} role="supplier" countryName={countryName} />
        ))}
      </div>
    </div>
  );
}
