import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/ui/misc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pricing | Plans Built Around the Data You Need",
  description:
    "Vaskodigama access models for individuals, teams and enterprises. Tell us what you want to research and we will help define the right plan.",
};

interface Plan {
  name: string;
  for: string[];
  access: string[];
  cta: { label: string; href: string };
  featured?: boolean;
}

const plans: Plan[] = [
  {
    name: "Explorer",
    for: ["Individual professionals", "Early market research", "Occasional product and country analysis"],
    access: ["Core search", "Standard filters", "Demonstration dashboards", "Limited sample exports"],
    cta: { label: "Request Explorer Access", href: "/contact?plan=explorer" },
  },
  {
    name: "Growth",
    for: ["Export-import teams", "Manufacturers", "Procurement groups", "Business-development teams"],
    access: ["Expanded search", "Advanced filters", "Buyer and supplier views", "Larger report requirements", "Priority onboarding"],
    cta: { label: "Request a Custom Plan", href: "/contact?plan=growth" },
    featured: true,
  },
  {
    name: "Enterprise",
    for: ["Large organizations", "Research teams", "Consulting firms", "Data-intensive workflows"],
    access: ["Custom country requirements", "Team access", "Data integrations", "Custom reports", "Enterprise support"],
    cta: { label: "Talk to Our Team", href: "/contact?plan=enterprise" },
  },
];

const comparison: { feature: string; explorer: boolean | string; growth: boolean | string; enterprise: boolean | string }[] = [
  { feature: "Multi-mode search", explorer: true, growth: true, enterprise: true },
  { feature: "Country & route filters", explorer: true, growth: true, enterprise: true },
  { feature: "Demonstration dashboards", explorer: true, growth: true, enterprise: true },
  { feature: "Buyer & supplier views", explorer: "Limited", growth: true, enterprise: true },
  { feature: "Sample CSV exports", explorer: "Limited", growth: "Expanded", enterprise: "Based on agreed access" },
  { feature: "Saved searches", explorer: "Browser only", growth: "Planned", enterprise: "Planned" },
  { feature: "Team access", explorer: false, growth: "Discuss with the team", enterprise: true },
  { feature: "Data integrations & API", explorer: false, growth: "Planned", enterprise: "Planned capability" },
  { feature: "Priority support", explorer: false, growth: true, enterprise: true },
];

const faqs: { q: string; a: string }[] = [
  {
    q: "Why are prices not displayed?",
    a: "Coverage, access limits and support needs vary by team. We define the right access model with you rather than publishing a number that may not fit your research.",
  },
  {
    q: "Can access be customized by country?",
    a: "Yes — coverage can be scoped to the markets you research. Tell us your priority countries and we will confirm what is available.",
  },
  {
    q: "Can plans support multiple users?",
    a: "Team access is available subject to plan. We will discuss seats and roles based on how your team works.",
  },
  {
    q: "Is API access available?",
    a: "API access is part of the planned enterprise roadmap. Contact the team to discuss future integration requirements.",
  },
  {
    q: "Can I request a demonstration?",
    a: "Yes. You can explore this demonstration build now, and we are happy to walk a team through the workflow that matches your goals.",
  },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true)
    return <Check className="mx-auto size-4 text-success" aria-label="Included" />;
  if (value === false)
    return <Minus className="mx-auto size-4 text-muted" aria-label="Not included" />;
  return <span className="text-xs text-muted-strong">{value}</span>;
}

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Plans Built Around the Data You Need"
        subtitle="Coverage, access limits and support requirements vary by team. Tell us what you want to research, and we will help define the right access model."
      />

      <Section>
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.featured ? "border-primary shadow-md" : undefined}
            >
              <CardContent className="flex h-full flex-col pt-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-navy">{plan.name}</h2>
                  {plan.featured ? <Badge tone="primary">Most requested</Badge> : null}
                </div>
                <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted">
                  Suitable for
                </p>
                <ul className="mt-1 space-y-1 text-sm text-muted">
                  {plan.for.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted">
                  Access categories
                </p>
                <ul className="mt-1 space-y-1.5 text-sm">
                  {plan.access.map((a) => (
                    <li key={a} className="flex items-start gap-2 text-navy">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                      {a}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-2">
                  <ButtonLink
                    href={plan.cta.href}
                    variant={plan.featured ? "primary" : "outline"}
                    className="w-full"
                  >
                    {plan.cta.label}
                  </ButtonLink>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-3 text-xs text-muted">
          Unconfirmed production features are marked as planned. Specific limits
          are agreed with the team and are not published here.
        </p>

        {/* Comparison */}
        <h2 className="mt-12 text-2xl font-bold text-navy">Compare access</h2>
        <div className="scroll-x mt-4 rounded-[14px] border border-border bg-background shadow-xs">
          <table className="w-full text-sm">
            <caption className="sr-only">Plan comparison</caption>
            <thead>
              <tr className="border-b border-border text-left">
                <th scope="col" className="px-4 py-3 font-medium text-navy">Capability</th>
                <th scope="col" className="px-4 py-3 text-center font-medium text-navy">Explorer</th>
                <th scope="col" className="px-4 py-3 text-center font-medium text-navy">Growth</th>
                <th scope="col" className="px-4 py-3 text-center font-medium text-navy">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.feature} className="border-b border-border/60 last:border-0">
                  <th scope="row" className="px-4 py-3 text-left font-normal text-navy">{row.feature}</th>
                  <td className="px-4 py-3 text-center"><Cell value={row.explorer} /></td>
                  <td className="px-4 py-3 text-center"><Cell value={row.growth} /></td>
                  <td className="px-4 py-3 text-center"><Cell value={row.enterprise} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FAQ */}
        <h2 className="mt-12 text-2xl font-bold text-navy">Pricing questions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {faqs.map((f) => (
            <Card key={f.q}>
              <CardContent className="pt-5">
                <h3 className="font-semibold text-navy">{f.q}</h3>
                <p className="mt-1.5 text-sm text-muted">{f.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3 rounded-[20px] border border-border bg-surface p-6">
          <div className="grow">
            <h2 className="text-lg font-semibold text-navy">Not sure which plan fits?</h2>
            <p className="mt-1 text-sm text-muted">
              Tell us what you want to research and we will recommend an access model.
            </p>
          </div>
          <ButtonLink href="/contact">Request a Custom Plan</ButtonLink>
          <ButtonLink href="/explore" variant="outline">Explore the demo</ButtonLink>
        </div>
      </Section>
    </>
  );
}
