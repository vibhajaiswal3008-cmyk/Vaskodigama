"use client";

import * as React from "react";
import { ArrowRight, Globe2, ShoppingCart, BarChart3, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";

const USE_CASES = [
  {
    id: "export",
    label: "Export & Business Development",
    icon: Globe2,
    heading: "Discover your next export market",
    body: "Business development and international sales teams can move from broad market awareness to focused outreach — grounded in visible import activity and buyer data.",
    points: [
      "Discover active import markets for a selected API or formulation",
      "Identify prospective buyers with relevant product activity",
      "Review buyer shipment history before making contact",
      "Compare destination countries by activity and trend",
      "Study competitor market presence where visible",
    ],
    cta: { label: "Explore export opportunities", href: "/explore?type=product&industry=pharmaceuticals" },
    accent: "text-primary bg-primary-soft",
  },
  {
    id: "procurement",
    label: "Procurement & Sourcing",
    icon: ShoppingCart,
    heading: "Identify and compare pharmaceutical suppliers",
    body: "Procurement and strategic sourcing teams can understand the supplier landscape before beginning qualification — reducing guesswork and supporting evidence-based shortlisting.",
    points: [
      "Identify active supplier markets for APIs, excipients and packaging",
      "Compare exporter activity across origin countries",
      "Analyse sourcing routes and visible shipment frequency",
      "Review available value benchmarks across periods",
      "Support supplier shortlisting with shipment-level evidence",
    ],
    cta: { label: "Explore supplier intelligence", href: "/explore?type=company&industry=pharmaceuticals" },
    accent: "text-success bg-success-soft",
  },
  {
    id: "market-intel",
    label: "Market Intelligence",
    icon: BarChart3,
    heading: "Build evidence-backed market assessments",
    body: "Analysts and market-intelligence teams can combine product, company and country views into a more focused and data-backed understanding of pharmaceutical trade.",
    points: [
      "Track product-level trade movement across markets",
      "Compare countries by import or export activity",
      "Review company participation in selected categories",
      "Monitor visible shifts in trade activity over time",
      "Prepare structured assessments from a single workspace",
    ],
    cta: { label: "Explore market intelligence", href: "/explore?type=product&industry=pharmaceuticals" },
    accent: "text-[var(--chart-2)] bg-[color-mix(in_srgb,var(--chart-2)_14%,white)]",
  },
  {
    id: "portfolio",
    label: "Portfolio & Commercial Strategy",
    icon: Layers,
    heading: "Prioritise products and geographies with confidence",
    body: "Portfolio and commercial strategy teams can study demand patterns, identify active geographies and support market-prioritisation research with visible trade signals.",
    points: [
      "Study product demand patterns across regions",
      "Identify active geographies for priority molecules",
      "Compare related HS categories and formulation types",
      "Understand which markets show consistent trade activity",
      "Support market-prioritisation research with shipment evidence",
    ],
    cta: { label: "Explore product intelligence", href: "/explore?type=product&industry=pharmaceuticals" },
    accent: "text-warning bg-warning-soft",
  },
] as const;

export function PharmaUseCases() {
  const [active, setActive] = React.useState(0);
  const uc = USE_CASES[active];
  const Icon = uc.icon;

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      {/* Sidebar tabs */}
      <div
        role="tablist"
        aria-label="Use case category"
        className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:overflow-visible"
      >
        {USE_CASES.map((u, i) => {
          const TabIcon = u.icon;
          const isActive = active === i;
          return (
            <button
              key={u.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`uc-panel-${u.id}`}
              onClick={() => setActive(i)}
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all",
                isActive
                  ? "border-primary bg-primary-soft text-primary shadow-xs"
                  : "border-border bg-background text-muted-strong hover:border-border-strong hover:text-navy",
              )}
            >
              <TabIcon className="size-4 shrink-0" aria-hidden />
              <span className="whitespace-nowrap lg:whitespace-normal">{u.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content panel */}
      {USE_CASES.map((u, i) => (
        <div
          key={u.id}
          id={`uc-panel-${u.id}`}
          role="tabpanel"
          aria-labelledby={`uc-tab-${u.id}`}
          hidden={active !== i}
        >
          {active === i && (
            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${u.accent}`}>
                  <Icon className="size-6" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    {u.label}
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-navy">{u.heading}</h3>
                </div>
              </div>
              <p className="mt-4 text-muted">{u.body}</p>
              <ul className="mt-5 space-y-2.5">
                {u.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm text-navy">
                    <span
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                      aria-hidden
                    />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-2">
                <ButtonLink href={u.cta.href} variant="outline" className="rounded-full">
                  {u.cta.label}
                  <ArrowRight className="size-4" aria-hidden />
                </ButtonLink>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
