import { Sparkles, ArrowRight, BarChart3, Layers3 } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { HeroSearchBar } from "@/components/marketing/home/hero-search-bar";
import { HeroChart } from "@/components/marketing/home/hero-chart";
import { StatBand } from "@/components/marketing/home/stat-band";
import {
  SearchModes,
  ValueProps,
  PlannedCapabilities,
  BoldFinalCta,
} from "@/components/marketing/home/vibrant-sections";
import {
  SampleShowcase,
  type ShowcaseData,
} from "@/components/marketing/home/sample-showcase";
import { RolePathways } from "@/components/marketing/home/role-pathways";
import { DashboardPreview } from "@/components/marketing/home/dashboard-preview";
import { IndustriesGrid } from "@/components/marketing/sections";
import { tradeData } from "@/lib/data";

export default async function HomePage() {
  const [summary, coverage, records] = await Promise.all([
    tradeData.getTradeAnalytics(),
    tradeData.listCoverage(),
    tradeData.listExploreRecords(),
  ]);

  const showcase: ShowcaseData = {
    countries: [...coverage]
      .sort((a, b) => b.summary.importValue - a.summary.importValue)
      .slice(0, 6)
      .map((c) => ({
        slug: c.slug,
        name: c.name,
        code: c.code,
        region: c.region,
        recordCount: c.summary.recordCount,
        importValue: c.summary.importValue,
        exportValue: c.summary.exportValue,
      })),
    records: records.slice(0, 6).map((r) => ({
      id: r.id,
      date: r.date,
      product: r.productDescription,
      hsCode: r.hsCode,
      originCode: r.originCountry,
      destinationCode: r.destinationCountry,
      value: r.tradeValue,
      flow: r.tradeFlow,
    })),
    buyers: summary.leadingBuyers.slice(0, 5).map((b) => ({
      id: b.id,
      name: b.name,
      code: b.countryCode,
      value: b.value,
    })),
    suppliers: summary.leadingSuppliers.slice(0, 5).map((s) => ({
      id: s.id,
      name: s.name,
      code: s.countryCode,
      value: s.value,
    })),
  };

  return (
    <>
      {/* ── Hero: search-first, light & vibrant ────────────────────────── */}
      <section className="surface-hero-light relative overflow-hidden border-b border-border">
        <div className="bg-route-grid-light absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-soft-foreground">
              <Sparkles className="size-3.5" aria-hidden /> Global trade intelligence
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] text-navy sm:text-5xl">
              Turn global trade records into{" "}
              <span className="text-gradient">clear business opportunities</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              Search products, HS Codes, companies, buyers, suppliers and markets
              across 40 countries — and turn complex shipment records into
              decision-ready intelligence.
            </p>
            <div className="mt-8">
              <HeroSearchBar />
            </div>
            <p className="mt-7 text-sm text-muted">
              Built for exporters, importers, manufacturers, sourcing teams and market researchers.
            </p>
          </div>
          <Reveal className="lg:pl-6">
            <HeroChart />
          </Reveal>
        </div>
      </section>

      {/* ── Credibility band ───────────────────────────────────────────── */}
      <Section className="pt-14 sm:pt-16">
        <StatBand />
      </Section>

      {/* ── Sample showcase ────────────────────────────────────────────── */}
      <Section muted className="py-16 sm:py-20">
        <Reveal className="mb-8 max-w-2xl">
          <Eyebrow>A look inside</Eyebrow>
          <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
            Explore a sample of what&apos;s inside
          </h2>
          <p className="mt-3 text-muted">
            Top markets, sample shipment records, and leading buyers &amp; suppliers —
            all illustrative demonstration data.
          </p>
        </Reveal>
        <Reveal>
          <SampleShowcase data={showcase} />
        </Reveal>
      </Section>

      {/* ── Search modes ───────────────────────────────────────────────── */}
      <Section className="py-16 sm:py-20">
        <Reveal>
          <SearchModes />
        </Reveal>
      </Section>

      {/* ── Value propositions ─────────────────────────────────────────── */}
      <Section>
        <ValueProps />
      </Section>

      {/* ── Role pathways ──────────────────────────────────────────────── */}
      <Section muted>
        <div className="mb-8 max-w-2xl">
          <Eyebrow>For your role</Eyebrow>
          <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
            One platform, different trade questions
          </h2>
          <p className="mt-3 text-muted">
            Each path preconfigures the search and dashboard for how your team works.
          </p>
        </div>
        <RolePathways />
      </Section>

      {/* ── Dashboard preview ──────────────────────────────────────────── */}
      <Section>
        <div className="grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:pt-6">
            <Eyebrow>Decision-ready dashboards</Eyebrow>
            <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
              See the market from more than one angle
            </h2>
            <p className="mt-3 text-muted">
              Move between summary indicators, trends, companies, countries, HS
              Codes and transaction-level records in one connected workspace.
            </p>
            <ul className="mt-5 space-y-2.5">
              {[
                { icon: BarChart3, t: "Trends, distributions and KPIs at a glance" },
                { icon: Layers3, t: "Drill from a country to the records behind it" },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <li key={f.t} className="flex items-center gap-3 text-sm font-medium text-navy">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    {f.t}
                  </li>
                );
              })}
            </ul>
            <ButtonLink href="/dashboard/analytics" className="mt-6">
              View Demo Dashboard <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>
          <DashboardPreview summary={summary} />
        </div>
      </Section>

      {/* ── Industries ─────────────────────────────────────────────────── */}
      <Section muted>
        <IndustriesGrid />
      </Section>

      {/* ── Roadmap ────────────────────────────────────────────────────── */}
      <Section>
        <PlannedCapabilities />
      </Section>

      {/* ── Final CTA ──────────────────────────────────────────────────── */}
      <Section className="pb-20">
        <BoldFinalCta />
      </Section>
    </>
  );
}
