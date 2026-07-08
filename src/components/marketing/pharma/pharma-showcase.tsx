import { Search, SlidersHorizontal, Download } from "lucide-react";
import { IllustrativeBadge } from "@/components/shared/illustrative";
import { Badge } from "@/components/ui/badge";

/** Illustrative pharma shipment records for the showcase preview. */
const RECORDS = [
  {
    date: "2026-01-18",
    product: "Paracetamol API (USP grade)",
    hs: "2922.29",
    origin: "IN",
    dest: "US",
    flow: "Export",
  },
  {
    date: "2026-01-15",
    product: "Amoxicillin trihydrate, bulk",
    hs: "2941.10",
    origin: "IN",
    dest: "DE",
    flow: "Export",
  },
  {
    date: "2026-01-12",
    product: "Metformin HCl tablets 500mg",
    hs: "3004.90",
    origin: "IN",
    dest: "BR",
    flow: "Export",
  },
  {
    date: "2026-01-09",
    product: "Empty HPMC capsules, size 0",
    hs: "9602.00",
    origin: "CN",
    dest: "IN",
    flow: "Import",
  },
  {
    date: "2026-01-05",
    product: "Insulin glargine, formulation",
    hs: "3004.31",
    origin: "DE",
    dest: "ZA",
    flow: "Export",
  },
];

/**
 * Glassy preview of the shipment-records workspace, scoped to pharmaceutical
 * trade. Entirely illustrative (badged) and uses tokens only.
 */
export function PharmaShowcase() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-lg">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-border bg-surface/70 px-4 py-3 backdrop-blur">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
          <Search className="size-4 shrink-0 text-muted" aria-hidden />
          <span className="truncate text-sm text-muted-strong">
            HS 3004 · medicaments · destination market
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-muted-strong">
          <SlidersHorizontal className="size-4" aria-hidden />
          Filters
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary-soft px-3 py-2 text-sm font-semibold text-primary-soft-foreground">
          <Download className="size-4" aria-hidden />
          Export
        </span>
      </div>

      {/* Records table */}
      <div className="scroll-x">
        <table className="w-full min-w-[640px] text-left text-sm">
          <caption className="sr-only">
            Illustrative sample of pharmaceutical shipment records
          </caption>
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
              <th scope="col" className="px-4 py-2.5 font-medium">Date</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Product</th>
              <th scope="col" className="px-4 py-2.5 font-medium">HS code</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Route</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Flow</th>
            </tr>
          </thead>
          <tbody>
            {RECORDS.map((r) => (
              <tr
                key={`${r.date}-${r.product}`}
                className="border-b border-border/60 transition-colors last:border-0 hover:bg-surface/60"
              >
                <td className="whitespace-nowrap px-4 py-3 text-muted-strong">
                  {r.date}
                </td>
                <td className="px-4 py-3 font-medium text-navy">{r.product}</td>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-strong">
                  {r.hs}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-strong">
                  {r.origin} → {r.dest}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={r.flow === "Export" ? "primary" : "neutral"}>
                    {r.flow}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-surface/70 px-4 py-3 backdrop-blur">
        <IllustrativeBadge />
        <span className="text-xs text-muted">
          Showing 5 of many sample records
        </span>
      </div>
    </div>
  );
}
