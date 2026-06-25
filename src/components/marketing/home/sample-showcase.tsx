"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Anchor, Globe2, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Flag } from "@/components/shared/flag";
import { MarketRankCard } from "@/components/marketing/home/market-rank-card";
import type { TrendPoint } from "@/components/marketing/home/market-sparkline";
import { cn, formatCompact } from "@/lib/utils";

export interface ShowcaseCountry {
  slug: string;
  name: string;
  code: string;
  region: string;
  recordCount: number;
  importValue: number;
  exportValue: number;
  /** Illustrative monthly import-value trend (empty → relative-value bar). */
  trend: TrendPoint[];
}

export interface ShowcaseRecord {
  id: string;
  date: string;
  product: string;
  hsCode: string;
  originCode: string;
  destinationCode: string;
  value: number;
  flow: "Import" | "Export";
}

export interface ShowcasePartner {
  id: string;
  name: string;
  code: string;
  value: number;
}

export interface ShowcaseData {
  countries: ShowcaseCountry[];
  records: ShowcaseRecord[];
  buyers: ShowcasePartner[];
  suppliers: ShowcasePartner[];
}

type Tab = "markets" | "records" | "partners";

const TABS: { id: Tab; label: string; icon: typeof Globe2 }[] = [
  { id: "markets", label: "Top markets", icon: Globe2 },
  { id: "records", label: "Sample records", icon: Anchor },
  { id: "partners", label: "Buyers & suppliers", icon: Building2 },
];

export function SampleShowcase({ data }: { data: ShowcaseData }) {
  const [tab, setTab] = React.useState<Tab>("markets");
  const maxImport = Math.max(...data.countries.map((c) => c.importValue), 1);

  return (
    <div className="overflow-hidden rounded-[20px] border border-border bg-background shadow-lg">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-danger/60" />
          <span className="size-2.5 rounded-full bg-warning/60" />
          <span className="size-2.5 rounded-full bg-success/60" />
        </span>
        <span className="ml-1 text-sm font-medium text-navy">
          vaskodigama.app/explore
        </span>
        <Badge tone="warning" className="ml-auto">
          Illustrative demo data
        </Badge>
      </div>

      {/* Tabs */}
      <div role="tablist" aria-label="Sample data" className="flex gap-1 border-b border-border px-3 pt-3">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-t-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-b-2 border-primary text-primary"
                  : "border-b-2 border-transparent text-muted hover:text-navy",
              )}
            >
              <Icon className="size-4" aria-hidden />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="p-4 sm:p-5">
        {tab === "markets" ? (
          <ul className="space-y-3">
            {data.countries.map((c, i) => (
              <li key={c.slug}>
                <MarketRankCard
                  rank={i + 1}
                  slug={c.slug}
                  name={c.name}
                  code={c.code}
                  region={c.region}
                  importValue={c.importValue}
                  max={maxImport}
                  trend={c.trend}
                  index={i}
                  top={i === 0}
                />
              </li>
            ))}
          </ul>
        ) : null}

        {tab === "records" ? (
          <div className="scroll-x">
            <table className="w-full min-w-[560px] text-left text-sm">
              <caption className="sr-only">Sample illustrative trade records</caption>
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                  <th scope="col" className="py-2 pr-3 font-medium">Date</th>
                  <th scope="col" className="py-2 pr-3 font-medium">Product</th>
                  <th scope="col" className="py-2 pr-3 font-medium">HS</th>
                  <th scope="col" className="py-2 pr-3 font-medium">Route</th>
                  <th scope="col" className="py-2 pr-3 font-medium">Flow</th>
                  <th scope="col" className="py-2 text-right font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {data.records.map((r) => (
                  <tr key={r.id} className="border-b border-border/60 last:border-0">
                    <td className="py-2.5 pr-3 tabular-nums text-muted">{r.date}</td>
                    <td className="py-2.5 pr-3 font-medium text-navy">{r.product}</td>
                    <td className="py-2.5 pr-3 tabular-nums text-muted">{r.hsCode}</td>
                    <td className="py-2.5 pr-3 text-muted">
                      <span className="flex items-center gap-1.5 whitespace-nowrap">
                        <Flag code={r.originCode} className="h-3 w-5" /> {r.originCode}
                        <span className="text-muted/60">→</span>
                        <Flag code={r.destinationCode} className="h-3 w-5" /> {r.destinationCode}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3">
                      <Badge tone={r.flow === "Import" ? "primary" : "success"}>{r.flow}</Badge>
                    </td>
                    <td className="py-2.5 text-right font-semibold tabular-nums text-navy">
                      ${formatCompact(r.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {tab === "partners" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <PartnerCol title="Leading buyers" rows={data.buyers} />
            <PartnerCol title="Leading suppliers" rows={data.suppliers} />
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
          <p className="text-xs text-muted">Figures are not real customs values.</p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            Open the full Explore workspace
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}

function PartnerCol({ title, rows }: { title: string; rows: ShowcasePartner[] }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-sm font-semibold text-navy">{title}</p>
      <ul className="mt-2.5 space-y-2">
        {rows.map((p, i) => (
          <li key={p.id} className="flex items-center gap-2.5 text-sm">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary-soft-foreground">
              {i + 1}
            </span>
            <span className="truncate text-navy">{p.name}</span>
            <span className="ml-auto flex shrink-0 items-center gap-1.5 text-xs text-muted">
              <Flag code={p.code} className="h-3 w-5" />
              ${formatCompact(p.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
