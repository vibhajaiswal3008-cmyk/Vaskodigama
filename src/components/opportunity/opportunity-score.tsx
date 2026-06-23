import { cn } from "@/lib/utils";
import type { OpportunityScore } from "@/types";
import { InfoTooltip } from "@/components/ui/tooltip";

function band(value: number): { label: string; tone: string } {
  if (value >= 80) return { label: "Strong", tone: "text-success" };
  if (value >= 65) return { label: "Promising", tone: "text-primary" };
  if (value >= 50) return { label: "Moderate", tone: "text-warning" };
  return { label: "Limited", tone: "text-muted-strong" };
}

/** Circular-ish score dial rendered with an accessible SVG + numeric label. */
export function ScoreDial({
  value,
  size = 96,
}: {
  value: number;
  size?: number;
}) {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const { tone } = band(value);
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`Opportunity Score ${value} out of 100`}
    >
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={8} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--primary)"
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        className={cn("fill-current font-bold", tone)}
        fontSize={size * 0.28}
      >
        {value}
      </text>
    </svg>
  );
}

export function OpportunityScoreCard({
  score,
  title = "Opportunity Score",
  subject,
}: {
  score: OpportunityScore;
  title?: string;
  subject?: string;
}) {
  const { label, tone } = band(score.value);
  return (
    <div className="rounded-lg border border-border bg-background p-5">
      <div className="flex items-start gap-4">
        <ScoreDial value={score.value} />
        <div className="min-w-0">
          <h3 className="flex items-center gap-1.5 text-base font-semibold text-navy">
            {title}
            <InfoTooltip label="How the Opportunity Score works">
              An illustrative 0–100 composite that may weigh recent activity,
              shipment frequency, volume growth, supplier concentration, product
              relevance, demand, competition, buyer consistency and data
              freshness. It is a guide, not a scientifically validated metric.
            </InfoTooltip>
          </h3>
          {subject ? (
            <p className="text-sm text-muted">{subject}</p>
          ) : null}
          <p className={cn("mt-1 text-sm font-semibold", tone)}>
            {label} · {score.value}/100
          </p>
        </div>
      </div>

      <dl className="mt-4 space-y-2.5">
        {score.factors.map((f) => (
          <div key={f.label}>
            <div className="flex items-center justify-between text-xs">
              <dt className="flex items-center gap-1 font-medium text-muted-strong">
                {f.label}
                <InfoTooltip label={`${f.label} explained`}>
                  {f.description}
                </InfoTooltip>
              </dt>
              <dd className="font-semibold text-navy">{Math.round(f.value)}</dd>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.min(100, f.value)}%` }}
              />
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
