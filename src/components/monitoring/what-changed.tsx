"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { changeFeed } from "@/data/mock/workspace";
import { Badge } from "@/components/ui/badge";
import { IllustrativeBadge } from "@/components/shared/illustrative";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const filters = [
  { id: "all", label: "All" },
  { id: "buyers", label: "Buyers" },
  { id: "suppliers", label: "Suppliers" },
  { id: "prices", label: "Prices" },
  { id: "competitors", label: "Competitors" },
  { id: "markets", label: "Markets" },
] as const;

export function WhatChanged({ limit }: { limit?: number }) {
  const [filter, setFilter] = React.useState<(typeof filters)[number]["id"]>("all");
  const items = changeFeed
    .filter((c) => filter === "all" || c.category === filter)
    .slice(0, limit);

  return (
    <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-navy">What changed</h3>
        <IllustrativeBadge />
      </div>

      <div role="group" aria-label="Filter changes" className="mt-3 flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs font-medium",
              filter === f.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border-strong text-muted-strong hover:bg-surface",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="mt-4 space-y-3">
        {items.length === 0 ? (
          <li className="rounded-md border border-dashed border-border-strong p-4 text-sm text-muted">
            No changes match this filter right now.
          </li>
        ) : (
          items.map((c) => (
            <li key={c.id} className="rounded-lg border border-border bg-surface p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-navy">{c.title}</p>
                <Badge tone="neutral" className="capitalize">
                  {c.category}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted">{c.body}</p>
              <ul className="mt-2 space-y-1">
                {c.evidence.map((e) => (
                  <li key={e} className="flex items-start gap-1.5 text-xs text-muted-strong">
                    <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden />
                    {e}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-muted">As of {formatDate(c.dataDate)}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
