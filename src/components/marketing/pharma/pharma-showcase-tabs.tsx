"use client";

import * as React from "react";
import {
  Search,
  Globe2,
  Building2,
  Factory,
  Ship,
  BarChart3,
  SlidersHorizontal,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { IllustrativeBadge } from "@/components/shared/illustrative";

/* ── Tab definitions ──────────────────────────────────────────────────────── */

const TABS = [
  { id: "search", label: "Search", icon: Search },
  { id: "markets", label: "Markets", icon: Globe2 },
  { id: "buyers", label: "Buyers", icon: Building2 },
  { id: "suppliers", label: "Suppliers", icon: Factory },
  { id: "shipments", label: "Shipments", icon: Ship },
  { id: "company", label: "Company", icon: BarChart3 },
] as const;

type TabId = (typeof TABS)[number]["id"];

/* ── Tab panel content ───────────────────────────────────────────────────── */

function SearchPanel() {
  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-surface/60 px-4 py-3">
        <Search className="size-4 shrink-0 text-muted" aria-hidden />
        <span className="text-sm text-navy font-medium">Paracetamol API</span>
        <span className="ml-auto text-xs text-primary font-semibold">HS 2922.29</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["India → All", "Export", "2024–2026", "Clear"].map((f, i) => (
          <span
            key={f}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
              i < 3
                ? "bg-primary-soft text-primary-soft-foreground"
                : "bg-surface text-muted border border-border",
            )}
          >
            {i === 0 && <SlidersHorizontal className="size-3" aria-hidden />}
            {f}
          </span>
        ))}
      </div>

      {/* Result summary */}
      <div className="rounded-xl border border-border bg-background p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">
          Search results summary
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Active markets", value: "18" },
            { label: "Buyers found", value: "42" },
            { label: "Shipment records", value: "200+" },
          ].map((m) => (
            <div key={m.label} className="rounded-lg bg-surface/70 px-3 py-2.5 text-center">
              <p className="text-xl font-bold tabular-nums text-navy">{m.value}</p>
              <p className="text-xs text-muted mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const MARKETS_DATA = [
  { country: "United States", code: "US", pct: 100, trend: "up" },
  { country: "Germany", code: "DE", pct: 81, trend: "up" },
  { country: "Brazil", code: "BR", pct: 64, trend: "up" },
  { country: "Japan", code: "JP", pct: 52, trend: "down" },
  { country: "South Africa", code: "ZA", pct: 38, trend: "up" },
];

function MarketsPanel() {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        Top importing markets · Paracetamol API
      </p>
      {MARKETS_DATA.map((m, i) => (
        <div key={m.country} className="flex items-center gap-3">
          <span className="w-5 shrink-0 text-xs font-medium tabular-nums text-muted">{i + 1}</span>
          <span className="w-6 shrink-0 rounded text-sm">{m.code}</span>
          <span className="w-32 shrink-0 truncate text-sm font-medium text-navy">{m.country}</span>
          <div className="relative flex-1 h-2 overflow-hidden rounded-full bg-surface-2">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all"
              style={{ width: `${m.pct}%` }}
            />
          </div>
          {m.trend === "up" ? (
            <TrendingUp className="size-4 shrink-0 text-success" aria-label="Trending up" />
          ) : (
            <TrendingDown className="size-4 shrink-0 text-danger" aria-label="Trending down" />
          )}
        </div>
      ))}
    </div>
  );
}

const BUYERS_DATA = [
  { name: "Pharma Distributor Co.", country: "United States", shipments: "24", products: "3" },
  { name: "EuroPharma GmbH", country: "Germany", shipments: "18", products: "2" },
  { name: "HealthCorp Brasil", country: "Brazil", shipments: "15", products: "4" },
  { name: "MedTrade Japan KK", country: "Japan", shipments: "9", products: "2" },
];

function BuyersPanel() {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">
        Active buyers · Paracetamol API
      </p>
      {BUYERS_DATA.map((b) => (
        <div
          key={b.name}
          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-4 py-3 hover:bg-surface/60 transition-colors"
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold text-navy truncate">{b.name}</p>
            <p className="text-xs text-muted">{b.country}</p>
          </div>
          <div className="flex shrink-0 items-center gap-4 text-right">
            <div>
              <p className="text-sm font-bold tabular-nums text-navy">{b.shipments}</p>
              <p className="text-xs text-muted">shipments</p>
            </div>
            <ArrowUpRight className="size-4 text-primary" aria-hidden />
          </div>
        </div>
      ))}
    </div>
  );
}

const SUPPLIERS_DATA = [
  { name: "API Solutions Pvt Ltd", country: "India", markets: "12", activity: "High" },
  { name: "Synthesis Chem Corp", country: "China", markets: "8", activity: "High" },
  { name: "EuroAPI SA", country: "France", markets: "5", activity: "Medium" },
  { name: "PharmaChem Ltd", country: "India", markets: "4", activity: "Medium" },
];

function SuppliersPanel() {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">
        Active suppliers · Paracetamol API
      </p>
      {SUPPLIERS_DATA.map((s) => (
        <div
          key={s.name}
          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-4 py-3 hover:bg-surface/60 transition-colors"
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold text-navy truncate">{s.name}</p>
            <p className="text-xs text-muted">{s.country}</p>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold tabular-nums text-navy">{s.markets}</p>
              <p className="text-xs text-muted">markets</p>
            </div>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                s.activity === "High"
                  ? "bg-success-soft text-success"
                  : "bg-warning-soft text-warning",
              )}
            >
              {s.activity}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

const SHIPMENTS_DATA = [
  { date: "2026-01-18", product: "Paracetamol API (USP)", hs: "2922.29", route: "IN → US", flow: "Export" },
  { date: "2026-01-15", product: "Amoxicillin trihydrate", hs: "2941.10", route: "IN → DE", flow: "Export" },
  { date: "2026-01-12", product: "Metformin HCl 500mg", hs: "3004.90", route: "IN → BR", flow: "Export" },
  { date: "2026-01-09", product: "HPMC capsules size 0", hs: "9602.00", route: "CN → IN", flow: "Import" },
];

function ShipmentsPanel() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Shipment records
        </p>
        <span className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs text-muted-strong">
          <Download className="size-3" aria-hidden /> Export sample
        </span>
      </div>
      <div className="scroll-x rounded-lg border border-border overflow-hidden">
        <table className="w-full min-w-[560px] text-left text-xs">
          <thead>
            <tr className="border-b border-border bg-surface/70">
              {["Date", "Product", "HS Code", "Route", "Flow"].map((h) => (
                <th key={h} scope="col" className="px-3 py-2.5 font-semibold uppercase tracking-wide text-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SHIPMENTS_DATA.map((r) => (
              <tr key={`${r.date}-${r.product}`} className="border-b border-border/60 last:border-0 hover:bg-surface/40">
                <td className="whitespace-nowrap px-3 py-2.5 text-muted-strong">{r.date}</td>
                <td className="px-3 py-2.5 font-medium text-navy max-w-[180px] truncate">{r.product}</td>
                <td className="whitespace-nowrap px-3 py-2.5 font-mono text-muted-strong">{r.hs}</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-muted-strong">{r.route}</td>
                <td className="px-3 py-2.5">
                  <Badge tone={r.flow === "Export" ? "primary" : "neutral"}>{r.flow}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CompanyPanel() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Building2 className="size-6" aria-hidden />
        </div>
        <div>
          <p className="font-bold text-navy">Pharma Distributor Co.</p>
          <p className="text-xs text-muted">United States · Importer</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Products traded", value: "8" },
          { label: "Active markets", value: "5" },
          { label: "Shipments", value: "24" },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-border bg-surface/60 px-3 py-3 text-center">
            <p className="text-2xl font-bold tabular-nums text-navy">{m.value}</p>
            <p className="text-xs text-muted mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-background p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Top products</p>
        {["Paracetamol API (USP)", "Metformin HCl", "Amoxicillin trihydrate"].map((p) => (
          <div key={p} className="flex items-center gap-2 py-1.5 border-b border-border/60 last:border-0">
            <span className="size-1.5 rounded-full bg-primary shrink-0" aria-hidden />
            <span className="text-sm text-navy">{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const PANEL_MAP: Record<TabId, React.ReactNode> = {
  search: <SearchPanel />,
  markets: <MarketsPanel />,
  buyers: <BuyersPanel />,
  suppliers: <SuppliersPanel />,
  shipments: <ShipmentsPanel />,
  company: <CompanyPanel />,
};

/* ── Main component ───────────────────────────────────────────────────────── */

export function PharmaShowcaseTabs() {
  const [active, setActive] = React.useState<TabId>("markets");

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-lg">
      {/* Tab bar */}
      <div
        role="tablist"
        aria-label="Platform showcase"
        className="flex overflow-x-auto border-b border-border bg-surface/60 scrollbar-hide"
      >
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`showcase-tab-${t.id}`}
              aria-selected={isActive}
              aria-controls={`showcase-panel-${t.id}`}
              onClick={() => setActive(t.id)}
              className={cn(
                "relative flex shrink-0 items-center gap-1.5 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                isActive ? "text-primary" : "text-muted hover:text-navy",
              )}
            >
              <Icon className="size-4" aria-hidden />
              {t.label}
              {isActive && (
                <span
                  className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary"
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div className="p-5">
        {TABS.map((t) => (
          <div
            key={t.id}
            id={`showcase-panel-${t.id}`}
            role="tabpanel"
            aria-labelledby={`showcase-tab-${t.id}`}
            hidden={active !== t.id}
            className="min-h-[280px]"
          >
            {active === t.id ? PANEL_MAP[t.id] : null}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border bg-surface/60 px-5 py-3">
        <IllustrativeBadge />
        <span className="text-xs text-muted">Platform preview · illustrative data</span>
      </div>
    </div>
  );
}
