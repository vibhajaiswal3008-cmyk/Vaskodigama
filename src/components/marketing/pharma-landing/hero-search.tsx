"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Package, Hash, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  {
    id: "product",
    label: "Product",
    icon: Package,
    placeholder: "Search a product e.g. Solar Panels",
    example: "e.g. Solar Panels, Basmati Rice, Machinery Parts",
  },
  {
    id: "hs-code",
    label: "HS Code",
    icon: Hash,
    placeholder: "Search an HS code e.g. 8541.40",
    example: "e.g. 8541.40, 1006.30, 7326.90",
  },
  {
    id: "company",
    label: "Company",
    icon: Building2,
    placeholder: "Search a company e.g. Northstar Industrial",
    example: "e.g. importer, exporter, buyer or supplier name",
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

/**
 * Hero search bar for the landing page — Product / HS Code / Company tabs,
 * matching the real Explore workspace's search modes. Submits to /explore,
 * this codebase's real search & results route. Swap the router.push below
 * for a call into src/lib/data (tradeData.runSearch) if this becomes a
 * live query.
 */
export function PharmaLandingHeroSearch() {
  const router = useRouter();
  const [tab, setTab] = React.useState<TabId>("product");
  const [query, setQuery] = React.useState("");

  const active = TABS.find((t) => t.id === tab)!;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const term = query.trim();
    if (!term) return;
    router.push(`/explore?q=${encodeURIComponent(term)}&type=${tab}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-2xl border border-border bg-background p-3 shadow-md sm:p-4"
      role="search"
      aria-label="Search global trade intelligence"
    >
      <div
        role="tablist"
        aria-label="Search mode"
        className="mb-3 flex w-fit gap-1 rounded-lg bg-surface p-1"
      >
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = t.id === tab;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold transition-colors",
                isActive
                  ? "bg-background text-navy shadow-xs"
                  : "text-muted hover:text-navy",
              )}
            >
              <Icon className="size-4" aria-hidden />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex flex-1 items-center rounded-xl border border-border bg-surface px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
          <Search className="size-5 shrink-0 text-muted" aria-hidden />
          <label htmlFor="pharma-landing-search" className="sr-only">
            {active.placeholder}
          </label>
          <input
            id="pharma-landing-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={active.placeholder}
            autoComplete="off"
            className="w-full bg-transparent py-3.5 pl-3 text-sm text-navy placeholder:text-muted focus:outline-none sm:py-4"
          />
        </div>
        <button
          type="submit"
          className="btn-gradient flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold sm:h-auto"
        >
          <Search className="size-4" aria-hidden />
          Search
        </button>
      </div>
      <p className="mt-2.5 px-1 text-xs text-muted">{active.example}</p>
    </form>
  );
}
