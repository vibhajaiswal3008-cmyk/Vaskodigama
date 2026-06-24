import { Sparkles, ArrowRight, BarChart3, Layers3 } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { HeroSearchBar } from "@/components/marketing/home/hero-search-bar";
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
import { getCountry } from "@/data/mock/countries";

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
        flag: c.flag,
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
      route: `${getCountry(r.originCountry)?.flag ?? ""} ${r.originCountry} → ${getCountry(r.destinationCountry)?.flag ?? ""} ${r.destinationCountry}`,
      value: r.tradeValue,
      flow: r.tradeFlow,
    })),
    buyers: summary.leadingBuyers.slice(0, 5).map((b) => ({
      id: b.id,
      name: b.name,
      flag: b.flag,
      value: b.value,
    })),
    suppliers: summary.leadingSuppliers.slice(0, 5).map((s) => ({
      id: s.id,
      name: s.name,
      flag: s.flag,
      value: s.value,
    })),
  };

  return (
    <>
      {/* ── Hero: search-first ─────────────────────────────────────────── */}
      <section className="surface-aurora relative overflow-hidden">
        <div className="bg-route-grid absolute inset-0 opacity-70" aria-hidden />
        <div className="relative mx-auto w-full max-w-5xl px-4 pb-44 pt-16 text-center sm:px-6 sm:pt-20">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/85">
            <Sparkles className="size-3.5" aria-hidden /> Global trade intelligence
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
            Turn global trade records into{" "}
            <span className="text-gradient-light">clear business opportunities</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/75">
            Search products, HS Codes, companies, buyers, suppliers and markets
            across 40 countries — and turn complex shipment records into
            decision-ready intelligence.
          </p>
          <div className="mt-9">
            <HeroSearchBar />
          </div>
          <p className="mt-8 text-sm text-white/60">
            Built for exporters, importers, manufacturers, sourcing teams and market researchers.
          </p>
        </div>
      </section>

      {/* ── Sample showcase, overlapping the hero ──────────────────────── */}
      <div className="relative z-10 mx-auto -mt-32 w-full max-w-5xl px-4 sm:px-6">
        <SampleShowcase data={showcase} />
      </div>

      {/* ── Credibility band ───────────────────────────────────────────── */}
      <Section className="pt-14 sm:pt-16">
        <StatBand />
      </Section>

      {/* ── Search modes ───────────────────────────────────────────────── */}
      <Section muted className="py-16 sm:py-20">
        <SearchModes />
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
