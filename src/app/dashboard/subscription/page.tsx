import { Check } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";

// NOTE: No prices are shown. Pricing is intentionally not fabricated in this
// demonstration. Plans illustrate possible tiers only.
const plans = [
  {
    name: "Starter",
    blurb: "For individuals exploring trade intelligence.",
    features: ["Global Trade Search", "Opportunity Score", "Saved searches", "Limited exports"],
    current: true,
  },
  {
    name: "Team",
    blurb: "For teams running active research.",
    features: ["Everything in Starter", "Alerts & monitoring", "Compare tools", "Report builder", "Shared saved items"],
    current: false,
  },
  {
    name: "Enterprise",
    blurb: "For organisations with custom needs.",
    features: ["Everything in Team", "Analyst support", "Custom research", "Team workspaces", "Priority support"],
    current: false,
  },
];

export default function SubscriptionPage() {
  return (
    <>
      <DashboardPageHeader
        title="Subscription"
        description="Plans are illustrative. This demonstration has no billing connected and pricing is not set."
        showIllustrative={false}
      />

      <div className="mb-5 rounded-lg border border-warning/30 bg-warning-soft p-3 text-sm text-warning">
        Demonstration only — no payment provider is connected and no charges can
        be made. Prices are intentionally not shown.
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((p) => (
          <Card key={p.name} className={p.current ? "border-primary" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle as="h2">{p.name}</CardTitle>
                {p.current ? <Badge tone="primary">Current (demo)</Badge> : null}
              </div>
              <p className="mt-1 text-sm text-muted">{p.blurb}</p>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-navy">
                Custom
                <span className="ml-1 text-sm font-normal text-muted">pricing</span>
              </p>
              <ul className="mt-4 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-strong">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <ButtonLink
                href="/contact"
                variant={p.current ? "outline" : "primary"}
                className="mt-5 w-full"
              >
                {p.current ? "Manage (demo)" : "Talk to us"}
              </ButtonLink>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
