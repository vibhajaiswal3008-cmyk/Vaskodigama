import { CalendarClock, Database, Gauge, ShieldQuestion } from "lucide-react";
import type { Confidence, DataQualityIndicator } from "@/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const confidenceTone: Record<Confidence, "success" | "warning" | "danger"> = {
  high: "success",
  medium: "warning",
  low: "danger",
};

/** Honest data-transparency panel. Never claims completeness or accuracy. */
export function DataQualityPanel({ q }: { q: DataQualityIndicator }) {
  const rows = [
    { icon: CalendarClock, label: "Last updated", value: formatDate(q.lastUpdated) },
    { icon: CalendarClock, label: "Coverage period", value: q.coveragePeriod },
    { icon: Database, label: "Source category", value: q.sourceCategory },
    { icon: Gauge, label: "Completeness", value: `${q.completeness}% (estimated)` },
  ];
  return (
    <div className="rounded-lg border border-border bg-background p-5">
      <h3 className="flex items-center gap-2 text-base font-semibold text-navy">
        <ShieldQuestion className="size-5 text-primary" aria-hidden />
        What stands behind this
      </h3>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label} className="flex items-start gap-2">
            <r.icon className="mt-0.5 size-4 text-muted" aria-hidden />
            <div>
              <dt className="text-xs text-muted">{r.label}</dt>
              <dd className="text-sm font-medium text-navy">{r.value}</dd>
            </div>
          </div>
        ))}
        <div className="flex items-start gap-2">
          <Gauge className="mt-0.5 size-4 text-muted" aria-hidden />
          <div>
            <dt className="text-xs text-muted">Confidence</dt>
            <dd>
              <Badge tone={confidenceTone[q.confidence]} className="capitalize">
                {q.confidence}
              </Badge>
            </dd>
          </div>
        </div>
      </dl>
      <div className="mt-4 rounded-md bg-surface p-3">
        <p className="text-xs font-medium text-muted-strong">Data limitations</p>
        <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-muted">
          {q.limitations.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
