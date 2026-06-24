"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { coverageCountries } from "@/config/coverage";
import {
  EMPTY_PARAMS,
  EXPLORE_MODES,
  serializeExploreParams,
} from "@/lib/explore";
import type { ExploreMode, ExploreParams } from "@/types/explore";
import { cn } from "@/lib/utils";

interface Suggestion {
  label: string;
  mode: ExploreMode;
  q: string;
}

const SUGGESTIONS: Suggestion[] = [
  { label: "Pharmaceutical ingredients", mode: "product", q: "pharmaceutical" },
  { label: "Solar panels", mode: "product", q: "solar" },
  { label: "Coffee beans", mode: "product", q: "coffee" },
  { label: "HS Code 300490", mode: "hs-code", q: "300490" },
  { label: "Textile machinery", mode: "product", q: "textile" },
  { label: "Electric motors", mode: "product", q: "electric motors" },
];

const field =
  "h-11 w-full rounded-md border border-border-strong bg-background px-3 text-sm text-navy focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring";

export function HomeSearch() {
  const router = useRouter();
  const [mode, setMode] = React.useState<ExploreMode>("product");
  const [q, setQ] = React.useState("");
  const [origin, setOrigin] = React.useState("");
  const [destination, setDestination] = React.useState("");
  const [flow, setFlow] = React.useState<ExploreParams["flow"]>("all");
  const [advanced, setAdvanced] = React.useState(false);

  function go(params: Partial<ExploreParams>) {
    const qs = serializeExploreParams({ ...EMPTY_PARAMS, ...params });
    router.push(qs ? `/explore?${qs}` : "/explore");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    go({ mode, q: q.trim(), origin, destination, flow });
  }

  function reset() {
    setMode("product");
    setQ("");
    setOrigin("");
    setDestination("");
    setFlow("all");
  }

  return (
    <div className="rounded-[22px] border border-border bg-background p-4 shadow-lg sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-navy">Start With What You Know</h2>
          <p className="mt-1 text-sm text-muted">
            Search by product, classification, company, location or trade participant.
          </p>
        </div>
        <span className="text-xs text-muted">HS Code or HSN Code supported</span>
      </div>

      <form onSubmit={onSubmit} className="mt-4" role="search">
        <div className="flex flex-col gap-2 sm:flex-row">
          <label htmlFor="home-mode" className="sr-only">Search mode</label>
          <select
            id="home-mode"
            value={mode}
            onChange={(e) => setMode(e.target.value as ExploreMode)}
            className={cn(field, "sm:w-40 font-medium")}
          >
            {EXPLORE_MODES.map((m) => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
          <div className="relative grow">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <Input
              aria-label={`Search by ${mode}`}
              placeholder={mode === "hs-code" ? "e.g. 300490" : `Search by ${mode}…`}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" size="lg" className="shrink-0">Search Global Trade</Button>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAdvanced((a) => !a)}
            aria-expanded={advanced}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <SlidersHorizontal className="size-4" aria-hidden />
            Advanced filters
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 text-sm text-muted hover:text-navy"
          >
            <X className="size-3.5" aria-hidden />
            Reset
          </button>
        </div>

        {advanced ? (
          <div className="mt-3 grid gap-3 rounded-lg border border-border bg-surface p-3 sm:grid-cols-3">
            <div>
              <label htmlFor="home-origin" className="text-xs font-medium text-muted">Origin country</label>
              <select id="home-origin" value={origin} onChange={(e) => setOrigin(e.target.value)} className={cn(field, "mt-1 h-10")}>
                <option value="">Any</option>
                {coverageCountries.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="home-dest" className="text-xs font-medium text-muted">Destination country</label>
              <select id="home-dest" value={destination} onChange={(e) => setDestination(e.target.value)} className={cn(field, "mt-1 h-10")}>
                <option value="">Any</option>
                {coverageCountries.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="home-flow" className="text-xs font-medium text-muted">Trade flow</label>
              <select id="home-flow" value={flow} onChange={(e) => setFlow(e.target.value as ExploreParams["flow"])} className={cn(field, "mt-1 h-10")}>
                <option value="all">Import & export</option>
                <option value="Import">Import</option>
                <option value="Export">Export</option>
              </select>
            </div>
          </div>
        ) : null}
      </form>

      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Suggested searches</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => go({ mode: s.mode, q: s.q })}
              className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-navy transition-colors hover:border-primary hover:text-primary"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
