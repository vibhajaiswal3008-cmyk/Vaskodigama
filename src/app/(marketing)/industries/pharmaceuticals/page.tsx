import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Pill,
  FlaskConical,
  ShieldCheck,
  ScrollText,
  Boxes,
  GitCompareArrows,
  LineChart,
  Microscope,
  Building2,
  Globe2,
  Check,
  Quote,
  Sparkles,
  BadgeCheck,
  Search,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/misc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { IllustrativeBadge } from "@/components/shared/illustrative";
import { PharmaHeroVisual } from "@/components/marketing/pharma/pharma-hero-visual";
import { PharmaShowcase } from "@/components/marketing/pharma/pharma-showcase";
import { PharmaFaq, type FaqItem } from "@/components/marketing/pharma/pharma-faq";
import { tradeData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Pharmaceutical Trade Intelligence | Vaskodigama",
  description:
    "Export-import trade analysis for pharmaceutical companies. Map APIs and formulations to HS codes, discover active buyers and suppliers, benchmark prices and study regulatory-sensitive trade flows.",
};

/* ── Static content ──────────────────────────────────────────────────────── */

const TRUST_PILLARS: { icon: LucideIcon; label: string }[] = [
  { icon: FlaskConical, label: "API & formulation aware" },
  { icon: ScrollText, label: "HS & molecule mapping" },
  { icon: ShieldCheck, label: "Regulatory-sensitive flows" },
  { icon: BadgeCheck, label: "Evidence, confidence & data dates" },
];

interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
  tint: string;
}

const FEATURES: Feature[] = [
  {
    icon: ScrollText,
    title: "HS & molecule mapping",
    body: "Connect APIs, intermediates and finished formulations to the right HS / HSN classifications so nothing relevant slips through your search.",
    tint: "text-chart-1 bg-primary-soft",
  },
  {
    icon: Boxes,
    title: "API vs formulation views",
    body: "Separate bulk active ingredients from finished-dose shipments to understand where value moves along the pharmaceutical chain.",
    tint: "text-[var(--chart-2)] bg-[color-mix(in_srgb,var(--chart-2)_16%,white)]",
  },
  {
    icon: Building2,
    title: "Buyer & supplier discovery",
    body: "Surface importers showing real demand for your molecule, and compare exporters and contract manufacturers as sourcing alternatives.",
    tint: "text-success bg-success-soft",
  },
  {
    icon: GitCompareArrows,
    title: "Price benchmarking",
    body: "Review shipment-level values across routes and periods to sanity-check quotes and negotiate from an evidenced position.",
    tint: "text-warning bg-warning-soft",
  },
  {
    icon: ShieldCheck,
    title: "Regulatory-sensitive flows",
    body: "Study controlled and regulated product movement with the context that pharmaceutical trade demands — not generic commodity views.",
    tint: "text-navy bg-surface-2",
  },
  {
    icon: Microscope,
    title: "Shipment-level evidence",
    body: "Drill from a market down to the individual records behind it, each paired with a data date and confidence indicator.",
    tint: "text-chart-1 bg-primary-soft",
  },
];

interface Benefit {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
}

const BENEFITS: Benefit[] = [
  {
    icon: Globe2,
    eyebrow: "Grow exports",
    title: "Find the next market for your API",
    body: "See which countries import your molecule, where demand is sustained, and which buyers are active — so business development starts from evidence, not guesswork.",
    points: [
      "Rank destination markets by import activity",
      "Identify importers handling your product",
      "Spot markets with consistent, repeat demand",
    ],
  },
  {
    icon: Boxes,
    eyebrow: "De-risk sourcing",
    title: "Qualify suppliers with shipment evidence",
    body: "Evaluate exporters and contract manufacturers through their visible trade activity before you commit, and keep credible alternatives on hand.",
    points: [
      "Compare suppliers by route and shipment history",
      "Diversify away from single-source dependence",
      "Benchmark pricing across origins and periods",
    ],
  },
  {
    icon: LineChart,
    eyebrow: "Stay ahead",
    title: "Monitor competitive movement",
    body: "Track how trade activity shifts across products, routes and participants so commercial and procurement teams can act before the market does.",
    points: [
      "Follow changes in trade value and volume",
      "Watch where competitors are active",
      "Turn shifts into prioritised next actions",
    ],
  },
];

// Clearly-illustrative scenarios — NOT real customers or quotes (see CLAUDE.md
// data-truthfulness rules). Generic roles only; no named people or companies.
const SCENARIOS: { quote: string; role: string }[] = [
  {
    quote:
      "Instead of cold outreach, we start from the markets already importing our API and the buyers behind those shipments.",
    role: "Business development · generics manufacturer",
  },
  {
    quote:
      "Shipment-level records let us pressure-test supplier quotes and keep a second source qualified at all times.",
    role: "Sourcing lead · formulation company",
  },
  {
    quote:
      "Mapping molecules to HS codes means our analysts stop missing relevant trade and start with the full picture.",
    role: "Market analyst · pharma intelligence team",
  },
];

interface Plan {
  name: string;
  for: string;
  access: string[];
  cta: { label: string; href: string };
  featured?: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Explorer",
    for: "Individual analysts beginning pharmaceutical market research.",
    access: [
      "Core HS & product search",
      "Standard filters",
      "Demonstration dashboards",
      "Limited sample exports",
    ],
    cta: { label: "Request Explorer Access", href: "/contact?plan=explorer&industry=pharma" },
  },
  {
    name: "Growth",
    for: "Export-import, sourcing and BD teams in pharma.",
    access: [
      "Expanded search & filters",
      "Buyer and supplier views",
      "Price benchmarking workflows",
      "Larger report allowances",
      "Priority onboarding",
    ],
    cta: { label: "Request a Custom Plan", href: "/contact?plan=growth&industry=pharma" },
    featured: true,
  },
  {
    name: "Enterprise",
    for: "Large pharma organisations and research teams.",
    access: [
      "Custom country coverage",
      "Team access & roles",
      "Data integrations",
      "Custom reporting",
      "Enterprise support",
    ],
    cta: { label: "Talk to Our Team", href: "/contact?plan=enterprise&industry=pharma" },
  },
];

const FAQS: FaqItem[] = [
  {
    q: "Is the trade data shown here real?",
    a: "No. Everything in this demonstration is illustrative sample data, clearly labelled throughout. It shows how the workflow behaves, not actual shipments. A production deployment would connect a real trade-data source behind the same interface.",
  },
  {
    q: "How do you handle APIs versus finished formulations?",
    a: "Pharmaceutical trade spans bulk active ingredients, intermediates and finished-dose products under different classifications. Vaskodigama maps molecules to the relevant HS / HSN codes so you can search either layer and see where value moves along the chain.",
  },
  {
    q: "Can I discover buyers for a specific molecule?",
    a: "Yes. Starting from a product or HS code, you can surface the markets importing it and the importers active behind those shipments, then drill into the records as supporting evidence.",
  },
  {
    q: "Can coverage be scoped to the countries I care about?",
    a: "Coverage can be tailored to the markets your team researches. Tell us your priority countries during onboarding and we will confirm what is available for your plan.",
  },
  {
    q: "Do you publish pricing?",
    a: "No fixed price is published. Coverage, access limits and support needs vary by team, so we define the right access model with you rather than listing a number that may not fit your research.",
  },
];

/* ── Page ────────────────────────────────────────────────────────────────── */

export default async function PharmaceuticalsPage() {
  const coverage = await tradeData.listCoverage();
  const marketCount = coverage.length;

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="surface-hero-light relative overflow-hidden border-b border-border">
        <div className="bg-route-grid-light absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <Reveal>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-soft-foreground">
              <Pill className="size-3.5" aria-hidden /> For pharmaceutical companies
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] text-navy sm:text-5xl">
              Export-import intelligence for{" "}
              <span className="text-gradient">pharmaceutical trade</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              Map APIs and formulations to the right HS codes, discover active
              buyers and suppliers, benchmark prices and study regulatory-sensitive
              flows — turning complex shipment records into clear commercial
              decisions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink
                href="/contact?industry=pharma"
                className="btn-gradient h-12 rounded-full px-7 text-base"
              >
                Request a Demo <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
              <ButtonLink
                href="/explore?industry=pharmaceuticals"
                variant="outline"
                size="lg"
                className="rounded-full"
              >
                Explore the demo
              </ButtonLink>
            </div>
            <p className="mt-6 flex items-center gap-2 text-sm text-muted">
              <Sparkles className="size-4 text-primary" aria-hidden />
              Built for exporters, importers, sourcing and market-research teams in pharma.
            </p>
          </Reveal>

          <Reveal delay={120} className="lg:pl-4">
            <PharmaHeroVisual />
          </Reveal>
        </div>
      </section>

      {/* ── Social proof / trust band ──────────────────────────────────── */}
      <Section className="py-12 sm:py-14">
        <Reveal className="rounded-2xl border border-border bg-surface/60 px-6 py-7 backdrop-blur">
          <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
            <div className="max-w-md">
              <p className="text-sm font-semibold text-navy">
                Designed around the realities of pharmaceutical trade
              </p>
              <p className="mt-1 text-sm text-muted">
                Not a generic commodity tool — the context pharma teams need,
                with every figure shown as illustrative demo data.
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4 lg:gap-x-8">
              {TRUST_PILLARS.map((p) => {
                const Icon = p.icon;
                return (
                  <li key={p.label} className="flex flex-col items-center gap-2 lg:items-start">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="text-xs font-medium leading-tight text-muted-strong">
                      {p.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </Section>

      {/* ── Features ───────────────────────────────────────────────────── */}
      <Section muted className="py-16 sm:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Built for pharma questions</Eyebrow>
          <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
            Everything you need to read the{" "}
            <span className="text-gradient">pharmaceutical market</span>
          </h2>
          <p className="mt-3 text-muted">
            Search, compare and decide with capabilities shaped for active
            ingredients, formulations and regulated trade.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={i * 70}>
                <div className="tile-glow group flex h-full flex-col rounded-xl border border-border bg-background p-5">
                  <span className={`flex size-11 items-center justify-center rounded-xl ${f.tint}`}>
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-semibold text-navy">{f.title}</h3>
                  <p className="mt-1.5 flex-1 text-sm text-muted">{f.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* ── Product showcase ───────────────────────────────────────────── */}
      <Section className="py-16 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <Reveal>
            <Eyebrow>A look inside</Eyebrow>
            <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
              From a molecule to the records behind the market
            </h2>
            <p className="mt-3 text-muted">
              Start with an HS code or product, filter to the routes and periods
              that matter, and drop straight into shipment-level evidence — the
              same workspace your analysts would use day to day.
            </p>
            <ul className="mt-5 space-y-2.5">
              {[
                { icon: Search, t: "Search by HS code, product or company" },
                { icon: GitCompareArrows, t: "Filter by route, flow and period" },
                { icon: Microscope, t: "Drill into transaction-level records" },
              ].map((row) => {
                const Icon = row.icon;
                return (
                  <li key={row.t} className="flex items-center gap-3 text-sm font-medium text-navy">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    {row.t}
                  </li>
                );
              })}
            </ul>
            <ButtonLink href="/explore?industry=pharmaceuticals" variant="outline" className="mt-6 rounded-full">
              Open the workspace <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </Reveal>
          <Reveal delay={120}>
            <PharmaShowcase />
          </Reveal>
        </div>
      </Section>

      {/* ── Benefits ───────────────────────────────────────────────────── */}
      <Section muted className="py-16 sm:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Outcomes, not just data</Eyebrow>
          <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
            Turn trade records into pharma decisions
          </h2>
        </Reveal>
        <div className="mt-12 space-y-12">
          {BENEFITS.map((b, i) => {
            const Icon = b.icon;
            const flip = i % 2 === 1;
            return (
              <Reveal key={b.title}>
                <div className="grid items-center gap-8 lg:grid-cols-2">
                  <div className={flip ? "lg:order-2" : undefined}>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-primary">
                      <Icon className="size-4" aria-hidden />
                      {b.eyebrow}
                    </span>
                    <h3 className="mt-2 text-2xl font-bold text-navy">{b.title}</h3>
                    <p className="mt-3 text-muted">{b.body}</p>
                    <ul className="mt-5 space-y-2.5">
                      {b.points.map((p) => (
                        <li key={p} className="flex items-start gap-2.5 text-sm text-navy">
                          <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={flip ? "lg:order-1" : undefined}>
                    <div className="tile-glow rounded-2xl border border-border bg-background p-6 shadow-sm">
                      <div className="rule-gradient w-16" />
                      <div className="mt-5 flex items-center justify-center rounded-xl bg-surface py-12">
                        <Icon className="size-16 text-primary/30" aria-hidden />
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs font-medium text-muted">
                          {b.eyebrow}
                        </span>
                        <IllustrativeBadge />
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* ── Testimonials (illustrative scenarios) ──────────────────────── */}
      <Section className="py-16 sm:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>How teams could use it</Eyebrow>
          <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
            Illustrative ways pharma teams put it to work
          </h2>
          <p className="mt-3 flex items-center justify-center gap-2 text-muted">
            Sample scenarios, not real customer quotes.
            <IllustrativeBadge />
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {SCENARIOS.map((s, i) => (
            <Reveal key={s.role} delay={i * 80}>
              <Card className="tile-glow h-full">
                <CardContent className="flex h-full flex-col pt-6">
                  <Quote className="size-7 text-primary/40" aria-hidden />
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-navy">
                    &ldquo;{s.quote}&rdquo;
                  </p>
                  <p className="mt-4 border-t border-border pt-3 text-xs font-medium text-muted">
                    {s.role}
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Pricing ────────────────────────────────────────────────────── */}
      <Section muted className="py-16 sm:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Access models</Eyebrow>
          <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
            Plans built around the data you need
          </h2>
          <p className="mt-3 text-muted">
            Coverage and access are scoped to how your pharma team researches.
            Tell us your priority molecules and markets and we will define the fit.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 80}>
              <Card
                className={
                  plan.featured
                    ? "relative h-full border-primary shadow-md"
                    : "h-full"
                }
              >
                <CardContent className="flex h-full flex-col pt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-navy">{plan.name}</h3>
                    {plan.featured ? <Badge tone="primary">Most requested</Badge> : null}
                  </div>
                  <p className="mt-2 text-sm text-muted">{plan.for}</p>
                  <ul className="mt-5 space-y-2 text-sm">
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
            </Reveal>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-muted">
          No fixed pricing is published — specific limits are agreed with the team.
        </p>
      </Section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <Section className="py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
              Questions pharma teams ask
            </h2>
            <p className="mt-3 text-muted">
              Coverage spans {marketCount} demonstration markets. Still unsure if
              it fits your molecules?
            </p>
            <ButtonLink href="/contact?industry=pharma" variant="outline" className="mt-5 rounded-full">
              Ask the team <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </Reveal>
          <Reveal delay={100}>
            <PharmaFaq items={FAQS} />
          </Reveal>
        </div>
      </Section>

      {/* ── Final CTA ──────────────────────────────────────────────────── */}
      <Section className="pb-20 pt-0">
        <Reveal>
          <div className="surface-aurora relative overflow-hidden rounded-[28px] px-6 py-14 text-center sm:px-12">
            <div className="bg-route-grid absolute inset-0 opacity-60" aria-hidden />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                See your molecule&apos;s market in a{" "}
                <span className="text-gradient-light">single search</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/75">
                Explore the demonstration workspace, or talk to the team about the
                pharmaceutical coverage and access your business needs.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <ButtonLink
                  href="/contact?industry=pharma"
                  className="btn-gradient h-12 rounded-full px-7 text-base"
                >
                  Request a Demo <ArrowRight className="size-4" aria-hidden />
                </ButtonLink>
                <Link
                  href="/explore?industry=pharmaceuticals"
                  className="inline-flex h-12 items-center rounded-full border border-white/30 px-7 text-base font-semibold text-white hover:bg-white/10"
                >
                  Explore Trade Data
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
