import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Pill,
  FlaskConical,
  ShieldCheck,
  BadgeCheck,
  ScrollText,
  Check,
  Quote,
  Sparkles,
  Globe2,
  Boxes,
  LineChart,
  Search,
  Building2,
  Factory,
  Ship,
  BarChart3,
  Microscope,
  GitCompareArrows,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/misc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { IllustrativeBadge } from "@/components/shared/illustrative";
import { PharmaHeroVisual } from "@/components/marketing/pharma/pharma-hero-visual";
import { PharmaSearch } from "@/components/marketing/pharma/pharma-search";
import { PharmaChallenges } from "@/components/marketing/pharma/pharma-challenges";
import { PharmaShowcaseTabs } from "@/components/marketing/pharma/pharma-showcase-tabs";
import { PharmaUseCases } from "@/components/marketing/pharma/pharma-use-cases";
import { PharmaHowItWorks } from "@/components/marketing/pharma/pharma-how-it-works";
import { PharmaFaq, type FaqItem } from "@/components/marketing/pharma/pharma-faq";
import { tradeData } from "@/lib/data";

/* ── Metadata ─────────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Pharmaceutical Import Export Trade Data | Vaskodigama",
  description:
    "Explore pharmaceutical import-export data, markets, buyers, suppliers, companies and shipment trends with Vaskodigama trade intelligence. Built for pharma commercial and sourcing teams.",
  alternates: {
    canonical: "/solutions/pharmaceuticals",
  },
  openGraph: {
    title: "Pharmaceutical Trade Intelligence | Vaskodigama",
    description:
      "Turn global pharmaceutical trade data into confident growth decisions. Discover markets, buyers, suppliers and shipment trends.",
    type: "website",
  },
};

/* ── Static content ───────────────────────────────────────────────────────── */

const TRUST_PILLARS: { icon: LucideIcon; label: string; sub: string }[] = [
  { icon: FlaskConical, label: "API & formulation aware", sub: "Bulk APIs, intermediates, finished dose" },
  { icon: ScrollText, label: "HS & molecule mapping", sub: "Search by description or classification" },
  { icon: ShieldCheck, label: "Regulatory context", sub: "Not a regulatory database — commercial intel" },
  { icon: BadgeCheck, label: "Evidence & confidence", sub: "Data dates and confidence indicators" },
];

const TARGET_ROLES = [
  "Business development",
  "Export teams",
  "Procurement",
  "Market intelligence",
  "Strategic sourcing",
  "Supply chain",
  "API manufacturers",
  "Generic drug companies",
];

interface Capability {
  icon: LucideIcon;
  title: string;
  body: string;
  tint: string;
}

const CAPABILITIES: Capability[] = [
  {
    icon: Search,
    title: "Pharmaceutical product search",
    body: "Search APIs, formulations, excipients and related pharmaceutical products using descriptions and HS Codes from one search field.",
    tint: "bg-primary-soft text-primary",
  },
  {
    icon: Globe2,
    title: "Market discovery",
    body: "Compare importing and exporting countries to identify active and emerging markets for your product category.",
    tint: "bg-[color-mix(in_srgb,var(--chart-2)_14%,white)] text-[var(--chart-2)]",
  },
  {
    icon: Building2,
    title: "Buyer intelligence",
    body: "Explore companies importing selected pharmaceutical products and review their visible shipment activity across periods.",
    tint: "bg-success-soft text-success",
  },
  {
    icon: Factory,
    title: "Supplier intelligence",
    body: "Identify active exporters and suppliers across selected countries and product categories for sourcing and comparison.",
    tint: "bg-warning-soft text-warning",
  },
  {
    icon: Ship,
    title: "Shipment analysis",
    body: "Review dates, product descriptions, quantities, routes, importers and exporters in a structured, searchable workspace.",
    tint: "bg-surface-2 text-navy",
  },
  {
    icon: BarChart3,
    title: "Company profiles",
    body: "Understand which products, markets and trading partners appear in a company's visible trade activity.",
    tint: "bg-primary-soft text-primary",
  },
  {
    icon: GitCompareArrows,
    title: "Competitor monitoring",
    body: "Study visible trade activity to understand how relevant companies participate across markets where data is available.",
    tint: "bg-[color-mix(in_srgb,var(--chart-2)_14%,white)] text-[var(--chart-2)]",
  },
  {
    icon: Microscope,
    title: "Dashboards & exports",
    body: "Explore trends in dashboards and export permitted sample data for further analysis in your own tools.",
    tint: "bg-success-soft text-success",
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
    title: "Find the next market for your molecule",
    body: "See which countries import your API or formulation, where demand is sustained, and which buyers are active — so business development starts from evidence, not guesswork.",
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
      "Benchmark pricing data across origins and periods",
    ],
  },
  {
    icon: LineChart,
    eyebrow: "Stay ahead",
    title: "Monitor competitive movement",
    body: "Track how trade activity shifts across products, routes and participants so commercial and procurement teams can act before the market does.",
    points: [
      "Follow changes in trade value and volume",
      "Watch where competitors appear active",
      "Turn visible shifts into prioritised next actions",
    ],
  },
];

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
    for: "Individual analysts and small teams evaluating trade opportunities.",
    access: [
      "Product and HS Code search",
      "Selected market views",
      "Sample shipment records",
      "Basic dashboards",
    ],
    cta: { label: "Explore the Demo", href: "/explore?industry=pharmaceuticals" },
  },
  {
    name: "Professional",
    for: "Commercial, sourcing and market-intelligence teams.",
    access: [
      "Expanded market analysis",
      "Buyer and supplier views",
      "Company profiles",
      "Search exports",
      "Priority onboarding",
    ],
    cta: { label: "Request a Custom Plan", href: "/contact?plan=professional&industry=pharma" },
    featured: true,
  },
  {
    name: "Enterprise",
    for: "Pharmaceutical organisations requiring broader access and team workflows.",
    access: [
      "Custom data coverage",
      "Multiple users and roles",
      "Organisation-level requirements",
      "Dedicated onboarding",
      "Enterprise support",
    ],
    cta: { label: "Talk to Sales", href: "/contact?plan=enterprise&industry=pharma" },
  },
];

const FAQS: FaqItem[] = [
  {
    q: "What pharmaceutical products can I search?",
    a: "You can search available records using product descriptions, HS Codes and related terms. Coverage depends on the available trade dataset. APIs, formulations, excipients and packaging materials can all be explored where they appear in the data.",
  },
  {
    q: "Can I find pharmaceutical buyers and suppliers?",
    a: "Vaskodigama can help users explore companies appearing as importers, exporters, buyers or suppliers in available trade records. Company profiles show associated products, markets and trading partners.",
  },
  {
    q: "Can I search APIs, formulations and excipients separately?",
    a: "Where these products appear in available descriptions or HS Code classifications, they can be explored through product and classification searches. The platform maps molecules to the relevant HS and HSN codes.",
  },
  {
    q: "Does Vaskodigama verify pharmaceutical product quality?",
    a: "No. Trade records support commercial research but do not replace GMP, regulatory, quality, technical or supplier due diligence. Vaskodigama is a commercial trade-intelligence platform, not a regulatory or quality database.",
  },
  {
    q: "Is the data shown here real or illustrative?",
    a: "All data shown in this demonstration is illustrative sample data, clearly labelled throughout. It shows how the workflow behaves, not actual shipments. A production deployment connects a real trade-data source behind the same interface.",
  },
  {
    q: "Can I export the data?",
    a: "Export availability depends on the selected plan and current product capabilities. Sample CSV exports are available in certain views. Discuss data export requirements with the team during onboarding.",
  },
  {
    q: "Can I filter to a specific country?",
    a: "Users can filter available records by origin country, destination country and other supported market criteria. Country-level views and rankings are available across markets in the coverage set.",
  },
  {
    q: "Is Vaskodigama a regulatory database?",
    a: "No. Vaskodigama is a commercial trade-intelligence platform and is not a substitute for official regulatory databases, pharmacopoeia references, or drug approval registries. Always conduct appropriate regulatory due diligence separately.",
  },
  {
    q: "How do I get started?",
    a: "Explore the demonstration to see the platform in action, or request a personalised walkthrough based on your products and target markets. The team will tailor the session to your molecules, geographies and use case.",
  },
];

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default async function PharmaceuticalSolutionsPage() {
  const coverage = await tradeData.listCoverage();
  const marketCount = coverage.length;

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="surface-hero-light relative overflow-hidden border-b border-border">
        <div className="bg-route-grid-light absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left: copy */}
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-soft-foreground">
                  <Pill className="size-3.5" aria-hidden />
                  Pharmaceutical Trade Intelligence
                </span>
              </Reveal>
              <Reveal delay={60}>
                <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-navy sm:text-5xl lg:text-6xl">
                  Turn global pharmaceutical{" "}
                  <span className="text-gradient">trade data</span> into confident
                  growth decisions.
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
                  Explore import-export activity across APIs, formulations, excipients
                  and related pharmaceutical products. Identify active markets, study
                  company behaviour and analyse shipment trends from one focused
                  workspace.
                </p>
              </Reveal>
              <Reveal delay={180}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink
                    href="/contact?industry=pharma"
                    className="btn-gradient h-12 rounded-full px-7 text-base"
                  >
                    Request a Personalised Demo
                    <ArrowRight className="size-4" aria-hidden />
                  </ButtonLink>
                  <ButtonLink
                    href="/explore?industry=pharmaceuticals"
                    variant="outline"
                    size="lg"
                    className="rounded-full"
                  >
                    Explore Pharmaceutical Data
                  </ButtonLink>
                </div>
              </Reveal>
              <Reveal delay={220}>
                <p className="mt-5 flex items-center gap-2 text-sm text-muted">
                  <Sparkles className="size-4 text-primary" aria-hidden />
                  No credit card required to explore the demonstration.
                </p>
              </Reveal>

              {/* Inline search */}
              <Reveal delay={260}>
                <div className="mt-8">
                  <PharmaSearch />
                </div>
              </Reveal>
            </div>

            {/* Right: visual */}
            <Reveal delay={160} className="lg:pl-4">
              <PharmaHeroVisual />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Trust band ─────────────────────────────────────────────────── */}
      <section className="border-b border-border bg-background py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="mb-8 text-center">
              <p className="text-sm font-semibold text-navy">
                Built for pharmaceutical commercial and supply-chain teams
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {TARGET_ROLES.map((role) => (
                <span
                  key={role}
                  className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-strong"
                >
                  {role}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TRUST_PILLARS.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.label}
                    className="flex items-start gap-3 rounded-xl border border-border bg-surface/60 p-4"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-navy">{p.label}</p>
                      <p className="mt-0.5 text-xs text-muted">{p.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Challenges ─────────────────────────────────────────────────── */}
      <Section muted className="py-16 sm:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>The challenge</Eyebrow>
          <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
            Pharmaceutical trade decisions should not depend on scattered data.
          </h2>
          <p className="mt-3 text-muted">
            Commercial and sourcing teams often spend hours combining shipment
            records, market reports and company research. Vaskodigama brings the
            key trade signals into one searchable workspace.
          </p>
        </Reveal>
        <div className="mt-10">
          <PharmaChallenges />
        </div>
      </Section>

      {/* ── Core capabilities ──────────────────────────────────────────── */}
      <Section className="py-16 sm:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Platform capabilities</Eyebrow>
          <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
            One platform for pharmaceutical trade exploration
          </h2>
          <p className="mt-3 text-muted">
            Every capability shaped for the specific questions pharmaceutical
            teams need to answer.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <Reveal key={cap.title} delay={i * 50}>
                <div className="tile-glow flex h-full flex-col gap-3 rounded-xl border border-border bg-background p-5">
                  <span
                    className={`flex size-10 items-center justify-center rounded-lg ${cap.tint}`}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-semibold text-navy">{cap.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {cap.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* ── Interactive showcase ────────────────────────────────────────── */}
      <Section muted className="py-16 sm:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <Eyebrow>Platform preview</Eyebrow>
            <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
              From product search to market opportunity in one workflow
            </h2>
            <p className="mt-3 text-muted">
              Navigate between search, markets, buyers, suppliers, shipments and
              company profiles — all from a single starting point.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Search by product, HS Code or company",
                "Filter markets by trade direction and date",
                "Explore buyers, suppliers and shipments",
                "Build a picture from shipment-level evidence",
              ].map((pt) => (
                <li key={pt} className="flex items-start gap-2.5 text-sm text-navy">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                  {pt}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-3">
              <ButtonLink
                href="/explore?industry=pharmaceuticals"
                variant="outline"
                className="rounded-full"
              >
                Open the workspace <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <PharmaShowcaseTabs />
          </Reveal>
        </div>
      </Section>

      {/* ── Use cases by role ──────────────────────────────────────────── */}
      <Section className="py-16 sm:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>By role</Eyebrow>
          <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
            Built around the decisions pharmaceutical teams make every day
          </h2>
          <p className="mt-3 text-muted">
            Different teams face different trade questions. Vaskodigama adapts
            to your role and research workflow.
          </p>
        </Reveal>
        <div className="mt-10">
          <PharmaUseCases />
        </div>
      </Section>

      {/* ── How it works ───────────────────────────────────────────────── */}
      <Section muted className="py-16 sm:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
            Move from a product question to actionable trade insight
          </h2>
        </Reveal>
        <div className="mt-12">
          <PharmaHowItWorks />
        </div>
        <Reveal>
          <div className="mt-10 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
            <p className="text-sm text-muted">
              Trade intelligence supports commercial research and does not replace
              regulatory, legal, quality or supplier due diligence.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* ── Benefits ───────────────────────────────────────────────────── */}
      <Section className="py-16 sm:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Business outcomes</Eyebrow>
          <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
            Make pharmaceutical trade research faster and more focused
          </h2>
        </Reveal>
        <div className="mt-12 space-y-14">
          {BENEFITS.map((b, i) => {
            const Icon = b.icon;
            const flip = i % 2 === 1;
            return (
              <Reveal key={b.title}>
                <div className="grid items-center gap-10 lg:grid-cols-2">
                  <div className={flip ? "lg:order-2" : undefined}>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-primary">
                      <Icon className="size-4" aria-hidden />
                      {b.eyebrow}
                    </span>
                    <h3 className="mt-2 text-2xl font-bold text-navy">{b.title}</h3>
                    <p className="mt-3 text-muted">{b.body}</p>
                    <ul className="mt-5 space-y-2.5">
                      {b.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-2.5 text-sm text-navy">
                          <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={flip ? "lg:order-1" : undefined}>
                    <div className="tile-glow rounded-2xl border border-border bg-background p-6 shadow-sm">
                      <div className="rule-gradient w-16" />
                      <div className="mt-5 flex items-center justify-center rounded-xl bg-surface py-14">
                        <Icon className="size-20 text-primary/20" aria-hidden />
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs font-medium text-muted">{b.eyebrow}</span>
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

      {/* ── Scenarios (illustrative) ───────────────────────────────────── */}
      <Section muted className="py-16 sm:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>How teams use it</Eyebrow>
          <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
            How pharmaceutical teams can use Vaskodigama
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
      <Section className="py-16 sm:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Access models</Eyebrow>
          <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
            Plans built around your research needs
          </h2>
          <p className="mt-3 text-muted">
            Coverage, access and support are scoped to how your pharmaceutical team
            researches. We define the right fit with you.
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
                    {plan.featured ? (
                      <Badge tone="primary">Recommended</Badge>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-muted">{plan.for}</p>
                  <ul className="mt-5 flex-1 space-y-2 text-sm">
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
          Pricing depends on data coverage, markets, users and workflow requirements.
          No fixed pricing is published.
        </p>
      </Section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <Section muted className="py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
              Questions pharmaceutical teams ask
            </h2>
            <p className="mt-3 text-muted">
              Coverage spans {marketCount} demonstration markets. Still unsure
              if Vaskodigama fits your product and market needs?
            </p>
            <ButtonLink
              href="/contact?industry=pharma"
              variant="outline"
              className="mt-5 rounded-full"
            >
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
          <div className="surface-aurora relative overflow-hidden rounded-[28px] px-6 py-16 text-center sm:px-12">
            <div className="bg-route-grid absolute inset-0 opacity-60" aria-hidden />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                See where your next pharmaceutical trade
                opportunity may be{" "}
                <span className="text-gradient-light">emerging.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/75">
                Explore products, markets, buyers, suppliers and shipment
                activity through one focused trade-intelligence workspace.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <ButtonLink
                  href="/contact?industry=pharma"
                  className="btn-gradient h-12 rounded-full px-8 text-base"
                >
                  Request a Pharmaceutical Demo{" "}
                  <ArrowRight className="size-4" aria-hidden />
                </ButtonLink>
                <Link
                  href="/explore?industry=pharmaceuticals"
                  className="inline-flex h-12 items-center rounded-full border border-white/30 px-8 text-base font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  Explore the Platform
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
