"use client";

import * as React from "react";
import { X } from "lucide-react";
import type { Company } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox, EmptyState } from "@/components/ui/misc";
import { getCountry } from "@/data/mock/countries";

/** Pick companies to compare and view them side by side (illustrative). */
export function CompareBoard({ companies }: { companies: Company[] }) {
  const [selected, setSelected] = React.useState<string[]>(
    companies.slice(0, 2).map((c) => c.id),
  );

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 4
          ? [...prev, id]
          : prev,
    );

  const chosen = companies.filter((c) => selected.includes(c.id));

  const rows: { label: string; get: (c: Company) => string }[] = [
    { label: "Role", get: (c) => c.role },
    { label: "Country", get: (c) => getCountry(c.countryCode)?.name ?? c.countryCode },
    { label: "Opportunity Score", get: (c) => `${c.opportunity.value}/100` },
    { label: "Shipment freq.", get: (c) => `${c.shipmentFrequency}/mo` },
    { label: "Product relevance", get: (c) => `${c.productRelevance}%` },
    { label: "Consistency", get: (c) => c.shipmentConsistency ?? "—" },
    { label: "Price position", get: (c) => c.pricePosition?.replace("-", " ") ?? "—" },
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
      <Card>
        <CardContent className="pt-5">
          <p className="mb-2 text-sm font-semibold text-navy">
            Select up to 4 companies
          </p>
          <div className="space-y-2">
            {companies.map((c) => (
              <Checkbox
                key={c.id}
                checked={selected.includes(c.id)}
                onChange={() => toggle(c.id)}
                disabled={!selected.includes(c.id) && selected.length >= 4}
                label={
                  <span>
                    <span className="font-medium text-navy">{c.name}</span>
                    <Badge tone="neutral" className="ml-1 capitalize">
                      {c.role}
                    </Badge>
                  </span>
                }
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-5">
          {chosen.length === 0 ? (
            <EmptyState
              title="Nothing selected"
              description="Pick at least one company on the left to compare."
            />
          ) : (
            <div className="scroll-x">
              <table className="w-full min-w-[520px] border-collapse text-sm">
                <caption className="sr-only">Company comparison</caption>
                <thead>
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs text-muted">
                      Metric
                    </th>
                    {chosen.map((c) => (
                      <th key={c.id} scope="col" className="px-3 py-2 text-left">
                        <span className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-navy">{c.name}</span>
                          <button
                            type="button"
                            onClick={() => toggle(c.id)}
                            aria-label={`Remove ${c.name}`}
                            className="text-muted hover:text-danger"
                          >
                            <X className="size-4" aria-hidden />
                          </button>
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.label} className="border-t border-border">
                      <th scope="row" className="px-3 py-2 text-left font-medium text-muted-strong">
                        {r.label}
                      </th>
                      {chosen.map((c) => (
                        <td key={c.id} className="px-3 py-2 capitalize text-navy">
                          {r.get(c)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
