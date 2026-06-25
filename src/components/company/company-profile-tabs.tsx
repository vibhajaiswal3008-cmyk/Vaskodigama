"use client";

import * as React from "react";
import { PackageSearch } from "lucide-react";
import type { Company, ShipmentRecord } from "@/types";
import { Tabs } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/misc";
import { Flag } from "@/components/shared/flag";
import { IllustrativeBadge } from "@/components/shared/illustrative";
import { OpportunityScoreCard } from "@/components/opportunity/opportunity-score";
import { coverageCountries } from "@/config/coverage";
import { cn, formatCurrency, formatDate, formatNumber } from "@/lib/utils";

const countryName = (code: string) =>
  coverageCountries.find((c) => c.code === code)?.name ?? code;

const TAB_DEFS = [
  { id: "overview", label: "Overview" },
  { id: "shipments", label: "Shipments" },
  { id: "products", label: "Products" },
  { id: "markets", label: "Markets" },
  { id: "partners", label: "Partners" },
] as const;

type TabId = (typeof TAB_DEFS)[number]["id"];

/** Origin → destination with flags. */
function Route({ from, to }: { from: string; to: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <Flag code={from} className="h-3 w-4 shrink-0" /> {from}
      <span className="text-muted/60" aria-hidden>→</span>
      <Flag code={to} className="h-3 w-4 shrink-0" /> {to}
    </span>
  );
}

export function CompanyProfileTabs({
  company,
  shipments,
}: {
  company: Company;
  shipments: ShipmentRecord[];
}) {
  const [tab, setTab] = React.useState<TabId>("overview");

  const isExporter = company.role === "supplier" || company.role === "both";

  // Derive partners / products / markets from this company's shipments.
  const partners = aggregate(
    shipments.map((s) => ({
      key: s.exporter === company.name ? s.importer : s.exporter,
      value: s.value,
    })),
  );
  const products = aggregate(shipments.map((s) => ({ key: s.productDescription, value: s.value })));
  const markets = aggregate(
    shipments.map((s) => ({
      key: s.exporter === company.name ? s.destinationCountry : s.originCountry,
      value: s.value,
    })),
  );

  const counts = {
    shipments: shipments.length,
    products: products.length,
    markets: markets.length,
    partners: partners.length,
  };

  return (
    <div>
      <Tabs
        tabs={TAB_DEFS.map((t) => ({
          id: t.id,
          label: t.label,
          count: t.id === "overview" ? undefined : counts[t.id as keyof typeof counts],
        }))}
        value={tab}
        onChange={(id) => setTab(id as TabId)}
      />

      <div className="mt-5" role="tabpanel">
        {tab === "overview" ? (
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <OpportunityScoreCard score={company.opportunity} subject={`${company.name} activity`} />
            </div>
            <div className="space-y-5 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle as="h2">Why this matters</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {company.opportunity.rationale.map((r) => (
                      <li key={r} className="flex items-start gap-2 text-sm text-muted-strong">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                        {r}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              {company.timeline && company.timeline.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle as="h2">Trade timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="relative space-y-4 border-l border-border pl-5">
                      {company.timeline.map((e) => (
                        <li key={e.id} className="relative">
                          <span className="absolute -left-[1.45rem] top-1 size-2.5 rounded-full border-2 border-background bg-primary" aria-hidden />
                          <p className="text-xs tabular-nums text-muted">{formatDate(e.date)}</p>
                          <p className="text-sm font-semibold text-navy">{e.label}</p>
                          {e.detail ? <p className="text-sm text-muted">{e.detail}</p> : null}
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </div>
        ) : null}

        {tab === "shipments" ? (
          shipments.length === 0 ? (
            <EmptyState icon={<PackageSearch className="size-6" aria-hidden />} title="No shipment records" description="No illustrative shipments are recorded for this company in the demonstration data." />
          ) : (
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle as="h2">Shipments</CardTitle>
                <IllustrativeBadge />
              </CardHeader>
              <CardContent>
                <div className="scroll-x">
                  <table className="w-full text-sm">
                    <caption className="sr-only">Illustrative shipments for {company.name}</caption>
                    <thead>
                      <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                        <th scope="col" className="px-2 py-2 font-medium">Date</th>
                        <th scope="col" className="px-2 py-2 font-medium">Product</th>
                        <th scope="col" className="px-2 py-2 font-medium">HS</th>
                        <th scope="col" className="px-2 py-2 font-medium">{isExporter ? "Buyer" : "Supplier"}</th>
                        <th scope="col" className="px-2 py-2 font-medium">Route</th>
                        <th scope="col" className="px-2 py-2 text-right font-medium">Quantity</th>
                        <th scope="col" className="px-2 py-2 text-right font-medium">Shipment value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shipments.map((s) => (
                        <tr key={s.id} className="border-b border-border/60 last:border-0 hover:bg-surface">
                          <td className="whitespace-nowrap px-2 py-2.5 text-muted">{formatDate(s.date)}</td>
                          <td className="px-2 py-2.5 text-navy">
                            <span className="block max-w-[220px] truncate" title={s.productDescription}>{s.productDescription}</span>
                          </td>
                          <td className="px-2 py-2.5">
                            <span className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-xs text-muted-strong">{s.hsCode}</span>
                          </td>
                          <td className="px-2 py-2.5 text-muted">
                            <span className="block max-w-[160px] truncate" title={s.exporter === company.name ? s.importer : s.exporter}>
                              {s.exporter === company.name ? s.importer : s.exporter}
                            </span>
                          </td>
                          <td className="px-2 py-2.5 text-muted"><Route from={s.originCountry} to={s.destinationCountry} /></td>
                          <td className="px-2 py-2.5 text-right tabular-nums text-muted">{formatNumber(s.quantity)} {s.unit}</td>
                          <td className="px-2 py-2.5 text-right tabular-nums text-navy">{formatCurrency(s.value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )
        ) : null}

        {tab === "products" ? (
          <RankedList
            title="Products"
            rows={products}
            renderKey={(k) => k}
          />
        ) : null}

        {tab === "markets" ? (
          <RankedList
            title={isExporter ? "Destination markets" : "Sourcing markets"}
            rows={markets}
            renderKey={(k) => (
              <span className="inline-flex items-center gap-2">
                <Flag code={k} className="h-3.5 w-5 shrink-0" /> {countryName(k)}
              </span>
            )}
          />
        ) : null}

        {tab === "partners" ? (
          <RankedList
            title={isExporter ? "Buyers" : "Suppliers"}
            rows={partners}
            renderKey={(k) => k}
          />
        ) : null}
      </div>
    </div>
  );
}

interface Agg {
  key: string;
  count: number;
  value: number;
}

function aggregate(items: { key: string; value: number }[]): Agg[] {
  const map = new Map<string, Agg>();
  for (const it of items) {
    const cur = map.get(it.key) ?? { key: it.key, count: 0, value: 0 };
    cur.count += 1;
    cur.value += it.value;
    map.set(it.key, cur);
  }
  return [...map.values()].sort((a, b) => b.value - a.value);
}

function RankedList({
  title,
  rows,
  renderKey,
}: {
  title: string;
  rows: Agg[];
  renderKey: (key: string) => React.ReactNode;
}) {
  if (rows.length === 0) {
    return (
      <EmptyState title={`No ${title.toLowerCase()} found`} description="No illustrative records are available for this view." />
    );
  }
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle as="h2">{title}</CardTitle>
        <IllustrativeBadge />
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {rows.map((r, i) => (
            <li key={r.key}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="flex min-w-0 items-center gap-2 font-medium text-navy">
                  <span className="w-5 shrink-0 text-xs tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="truncate">{renderKey(r.key)}</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block tabular-nums font-semibold text-navy">{formatCurrency(r.value)}</span>
                  <span className="block text-xs text-muted">{r.count} {r.count === 1 ? "shipment" : "shipments"}</span>
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2" aria-hidden>
                <div
                  className={cn("h-full rounded-full bg-gradient-to-r from-primary to-[var(--chart-2)]")}
                  style={{ width: `${Math.max(6, Math.round((r.value / max) * 100))}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
