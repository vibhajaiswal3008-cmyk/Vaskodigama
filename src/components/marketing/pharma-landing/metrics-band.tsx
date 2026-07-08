import { IllustrativeBadge } from "@/components/shared/illustrative";

interface Metric {
  label: string;
  value: string;
}

/**
 * Hero metrics band. Values are passed in from real (illustrative) mock data
 * counted in the page component — no fabricated numbers are hardcoded here.
 *
 * `variant="hero"` renders the compact, borderless row (white text divided by
 * hairlines) meant to sit directly inside the dark hero surface, under the
 * search card. `variant="cards"` (default) is the standalone light-surface
 * card grid for use outside a hero.
 */
export function MetricsBand({
  metrics,
  variant = "cards",
}: {
  metrics: Metric[];
  variant?: "cards" | "hero";
}) {
  if (variant === "hero") {
    return (
      <div className="flex flex-wrap items-stretch justify-center divide-x divide-white/15 border-t border-white/15">
        {metrics.map((m) => (
          <div key={m.label} className="min-w-[7.5rem] flex-1 px-4 py-5 text-center">
            <p className="text-xl font-extrabold tabular-nums text-white sm:text-2xl">
              {m.value}
            </p>
            <p className="mt-1 text-xs font-medium text-white/65 sm:text-sm">
              {m.label}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-background px-4 py-5 text-center">
            <p className="text-2xl font-extrabold tabular-nums text-gradient sm:text-3xl">
              {m.value}
            </p>
            <p className="mt-1 text-xs font-medium text-muted sm:text-sm">
              {m.label}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-muted">
        Figures reflect this demonstration&apos;s sample dataset.
        <IllustrativeBadge />
      </p>
    </div>
  );
}
