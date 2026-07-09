import type { Metadata } from "next";
import Link from "next/link";
import { Globe2, Layers, Users, Ship, Briefcase } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/misc";
import { Reveal } from "@/components/shared/reveal";
import { PharmaLandingHeroSearch } from "@/components/marketing/pharma-landing/hero-search";
import { MetricsBand } from "@/components/marketing/pharma-landing/metrics-band";
import { AnnouncementStrip, HeroFloatingChips } from "@/components/marketing/pharma-landing/hero-extras";
import {
  DataCoverage,
  ProblemSolution,
  HsChapterCoverage,
  KeyFeatures,
  SearchJourney,
  BuyerSupplierNetwork,
  UseCases,
  GlobalCoverage,
  LandingFinalCta,
} from "@/components/marketing/pharma-landing/sections";
import { tradeData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Global Import-Export Intelligence Across 40+ Countries | Vaskodigama",
  description:
    "Vaskodigama helps businesses discover buyers, suppliers, importers, exporters, shipment records, pricing trends, trade routes and market opportunities across 40+ countries and all HSN chapters.",
};

const HERO_POINTS = [
  { icon: Globe2, label: "40+ countries" },
  { icon: Layers, label: "All HSN chapters" },
  { icon: Users, label: "Buyer & supplier intelligence" },
  { icon: Ship, label: "Shipment-level records" },
  { icon: Briefcase, label: "Built for sourcing, sales & procurement" },
];

export default async function PharmaLandingPage() {
  const coverage = await tradeData.listCoverage();

  const metrics = [
    { label: "Countries covered", value: `${coverage.length}+` },
    { label: "HSN chapters", value: "All" },
    { label: "Trade data", value: "Import & Export" },
    { label: "Intelligence", value: "Buyer & Supplier" },
    { label: "Trade records", value: "Shipment-Level" },
    { label: "Trade insights", value: "Country-Wise" },
  ];

  return (
    <>
      {/* ── Top announcement strip ───────────────────────────────────────── */}
      <AnnouncementStrip />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section id="top" className="surface-aurora relative overflow-hidden">
        <div className="bg-route-grid absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 pb-10 pt-16 text-center sm:px-6 lg:pt-20">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            <Globe2 className="size-3.5" aria-hidden /> Global import-export intelligence
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl">
            Explore Global Import-Export Intelligence{" "}
            <span className="text-gradient-light">Across 40+ Countries and All HSN Chapters</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/75">
            Vaskodigama transforms raw trade records into structured
            intelligence, helping businesses identify active buyers, reliable
            suppliers, pricing trends, shipment activity, country demand and
            market opportunities across global import-export markets.
          </p>

          <ul className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
            {HERO_POINTS.map((p) => {
              const Icon = p.icon;
              return (
                <li
                  key={p.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/90"
                >
                  <Icon className="size-3.5 text-[var(--chart-2)]" aria-hidden />
                  {p.label}
                </li>
              );
            })}
          </ul>

          <Reveal className="relative mx-auto mt-8 max-w-2xl text-left">
            <HeroFloatingChips />
            <PharmaLandingHeroSearch />
          </Reveal>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex h-10 items-center rounded-full bg-white px-5 text-sm font-semibold text-navy hover:bg-white/90"
            >
              Request a Demo
            </Link>
            <Link
              href="#global-coverage"
              className="inline-flex h-10 items-center rounded-full border border-white/30 px-5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Explore Trade Coverage
            </Link>
          </div>
        </div>
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <MetricsBand metrics={metrics} variant="hero" />
        </div>
      </section>

      {/* ── Data coverage ─────────────────────────────────────────────────── */}
      <Section id="data-coverage" muted className="py-16 sm:py-20">
        <DataCoverage />
      </Section>

      {/* ── Vaskodigama Makes It Decision-Ready (artifact) ───────────────── */}
      <Section id="why-us" className="py-16 sm:py-20">
        <ProblemSolution />
      </Section>

      {/* ── Core intelligence features ───────────────────────────────────── */}
      <Section id="intelligence-features" muted className="py-16 sm:py-20">
        <KeyFeatures />
      </Section>

      {/* ── HS chapter coverage ──────────────────────────────────────────── */}
      <Section id="hsn-coverage" className="py-16 sm:py-20">
        <HsChapterCoverage />
      </Section>

      {/* ── Country coverage ─────────────────────────────────────────────── */}
      <Section muted className="py-16 sm:py-20">
        <GlobalCoverage />
      </Section>

      {/* ── How it connects ──────────────────────────────────────────────── */}
      <Section className="py-16 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <Eyebrow>How it connects</Eyebrow>
            <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
              One search, the whole trade picture
            </h2>
            <p className="mt-3 text-muted">
              Every product search links back to the real participants and
              records behind it — importers, exporters, suppliers, origin and
              destination markets, shipment records and price benchmarks, all
              connected to a single search term.
            </p>
          </Reveal>
          <BuyerSupplierNetwork />
        </div>
      </Section>

      {/* ── Search-to-insight journey ─────────────────────────────────────── */}
      <Section muted className="py-16 sm:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>A look inside</Eyebrow>
          <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
            From Search to Actionable Insight in Seconds
          </h2>
          <p className="mt-3 text-muted">
            Vaskodigama doesn&apos;t hand you raw shipment rows — it returns
            structured, decision-ready intelligence in a few clear steps.
          </p>
        </Reveal>
        <div className="mt-12">
          <SearchJourney />
        </div>
      </Section>

      {/* ── Use cases ─────────────────────────────────────────────────────── */}
      <Section id="use-cases" className="py-16 sm:py-20">
        <UseCases />
      </Section>

      {/* ── Final CTA ───────────────────────────────────────────────────── */}
      <Section className="pb-20">
        <LandingFinalCta />
      </Section>
    </>
  );
}
