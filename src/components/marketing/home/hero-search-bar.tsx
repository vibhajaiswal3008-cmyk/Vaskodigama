"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { EMPTY_PARAMS, serializeExploreParams } from "@/lib/explore";
import type { ExploreMode, ExploreParams } from "@/types/explore";
import { cn } from "@/lib/utils";

const MODES: { id: ExploreMode; label: string }[] = [
  { id: "product", label: "Product" },
  { id: "hs-code", label: "HS Code" },
  { id: "company", label: "Company" },
  { id: "buyer", label: "Buyer" },
  { id: "supplier", label: "Supplier" },
  { id: "importer", label: "Importer" },
  { id: "exporter", label: "Exporter" },
];

const SUGGESTIONS: { label: string; mode: ExploreMode; q: string }[] = [
  { label: "Pharmaceutical ingredients", mode: "product", q: "pharmaceutical" },
  { label: "Solar panels", mode: "product", q: "solar" },
  { label: "Coffee beans", mode: "product", q: "coffee" },
  { label: "HS Code 300490", mode: "hs-code", q: "300490" },
  { label: "Textile machinery", mode: "product", q: "textile" },
];

const PLACEHOLDERS: Record<ExploreMode, string> = {
  product: "Search a product, e.g. natural honey, solar panels…",
  "hs-code": "Enter an HS / HSN code, e.g. 300490",
  company: "Search a company name…",
  buyer: "Find active buyers / importers…",
  supplier: "Find suppliers / exporters…",
  importer: "Search importers…",
  exporter: "Search exporters…",
};

/**
 * Search-first hero centrepiece: large input with selectable mode tabs and
 * suggestion chips. Submitting routes to /explore with URL query parameters,
 * so the search state is shareable and survives refresh.
 */
export function HeroSearchBar() {
  const router = useRouter();
  const [mode, setMode] = React.useState<ExploreMode>("product");
  const [q, setQ] = React.useState("");

  function go(params: Partial<ExploreParams>) {
    const qs = serializeExploreParams({ ...EMPTY_PARAMS, ...params });
    router.push(qs ? `/explore?${qs}` : "/explore");
  }

  return (
    <div className="w-full max-w-3xl">
      {/* Mode tabs */}
      <div
        role="tablist"
        aria-label="Search mode"
        className="mb-3 flex flex-wrap gap-1.5"
      >
        {MODES.map((m) => {
          const active = m.id === mode;
          return (
            <button
              key={m.id}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => setMode(m.id)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "border border-border bg-background text-muted-strong hover:border-primary hover:text-navy",
              )}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Search field */}
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          go({ mode, q: q.trim() });
        }}
        className="flex flex-col gap-2 rounded-[22px] border border-border-strong bg-background p-2 shadow-lg sm:flex-row sm:items-center sm:rounded-full sm:p-2"
      >
        <label htmlFor="hero-q" className="sr-only">
          Search global trade by {mode}
        </label>
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            id="hero-q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={PLACEHOLDERS[mode]}
            className="h-12 w-full rounded-full border-0 bg-transparent pl-12 pr-3 text-base text-navy placeholder:text-muted focus-visible:outline-none"
          />
        </div>
        <button
          type="submit"
          className="btn-gradient inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold"
        >
          Search Global Trade
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </form>

      {/* Suggestions */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted">Try:</span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => go({ mode: s.mode, q: s.q })}
            className="rounded-full border border-border bg-background px-3 py-1 text-muted-strong transition-colors hover:border-primary hover:text-navy"
          >
            {s.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">
        HS Code or HSN Code supported · Illustrative demonstration data
      </p>
    </div>
  );
}
