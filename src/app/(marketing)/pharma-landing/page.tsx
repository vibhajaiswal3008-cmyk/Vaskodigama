import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/misc";
import { Reveal } from "@/components/shared/reveal";
import { PharmaLandingHeroSearch } from "@/components/marketing/pharma-landing/hero-search";
import { MetricsBand } from "@/components/marketing/pharma-landing/metrics-band";
import { SearchPreviewDashboard } from "@/components/marketing/pharma-landing/search-preview";
import { AnnouncementStrip, HeroFloatingChips } from "@/components/marketing/pharma-landing/hero-extras";
import {
  ProblemSolution,
  ProductCategories,
  KeyFeatures,
  SearchJourney,
  BuyerSupplierNetwork,
  UseCases,
  WhyVaskodigama,
  GlobalCoverage,
  LandingFinalCta,
} from "@/components/marketing/pharma-landing/sections";
import { tradeData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Global Pharma Trade Intelligence Made Simple | Vaskodigama",
  description:
    "Search APIs, FDFs and KSMs to discover buyers, suppliers, pricing trends and market opportunities across global pharmaceutical trade.",
};

// DRAFT preview route — not linked from navigation yet. Built to compare
// against the current homepage / pharma solution page before deciding where
// this design should live. See VASKODIGAMA-README task notes.
export default async function PharmaLandingDraftPage() {
  const [summary, coverage, buyers, suppliers, shipments, priceRecords, exploreRecords] =
    await Promise.all([
      tradeData.getTradeAnalytics(),
      tradeData.listCoverage(),
      tradeData.listBuyers(),
      tradeData.listSuppliers(),
      tradeData.listShipments(),
      tradeData.listPriceRecords(),
      tradeData.listExploreRecords(),
    ]);

  const avgPrice =
    priceRecords.reduce((a, p) => a + p.avgUnitPrice, 0) / priceRecords.length;
  const opportunityScore = 72;

  const metrics = [
    { label: "Buyers", value: `${buyers.length}` },
    { label: "Suppliers", value: `${suppliers.length}` },
    { label: "Avg. price", value: `$${avgPrice.toFixed(0)}/kg` },
    { label: "Markets", value: `${coverage.length}` },
    { label: "Shipment records", value: `${shipments.length}` },
    { label: "Countries covered", value: `${coverage.length}` },
  ];

  const coverageChips = [
    { label: "Import markets", value: `${summary.topImporters.length}` },
    { label: "Export markets", value: `${summary.topExporters.length}` },
    { label: "Buyer networks", value: `${buyers.length}` },
    { label: "Supplier networks", value: `${suppliers.length}` },
    { label: "Trade routes", value: `${summary.topImporters.length + summary.topExporters.length}` },
    { label: "Shipment records", value: `${shipments.length}` },
  ];

  const recentRecords = exploreRecords.slice(0, 4).map((r) => ({
    id: r.id,
    product: r.productDescription,
    buyer: r.buyer,
    supplier: r.supplier,
    originCode: r.originCountry,
    destinationCode: r.destinationCountry,
    quantity: r.quantity,
    unit: r.unit,
    value: r.tradeValue,
    date: r.date,
  }));

  return (
    <>
      {/* ── Top announcement strip ───────────────────────────────────────── */}
      <AnnouncementStrip />

      {/* ── Header note (draft only) ────────────────────────────────────── */}
      <div className="border-b border-border bg-warning-soft px-4 py-2 text-center text-xs font-medium text-warning">
        Draft preview — pharma-focused landing page, for review only.
      </div>

      {/* ── 1/2/3. Hero with search + embedded metrics ──────────────────── */}
      <section id="top" className="surface-aurora relative overflow-hidden">
        <div className="bg-route-grid absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 pb-10 pt-16 text-center sm:px-6 lg:pt-20">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            <Sparkles className="size-3.5" aria-hidden /> Pharmaceutical trade intelligence
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl">
            Global Pharma Trade Intelligence{" "}
            <span className="text-gradient-light">Made Simple</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/75">
            Search APIs, FDFs and KSMs to discover buyers, suppliers, pricing
            trends, shipment records and market opportunities across global
            pharmaceutical trade.
          </p>
          <Reveal className="relative mx-auto mt-8 max-w-2xl text-left">
            <HeroFloatingChips />
            <PharmaLandingHeroSearch />
          </Reveal>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact?industry=pharma"
              className="inline-flex h-10 items-center rounded-full border border-white/30 px-5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Request Demo
            </Link>
          </div>
        </div>
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <MetricsBand metrics={metrics} variant="hero" />
        </div>
      </section>

      {/* ── 4. Problem → solution ──────────────────────────────────────── */}
      <Section muted className="py-16 sm:py-20">
        <ProblemSolution />
      </Section>

      {/* ── 5. Product intelligence categories ─────────────────────────── */}
      <Section className="py-16 sm:py-20">
        <ProductCategories />
      </Section>

      {/* ── 6. Key platform features ────────────────────────────────────── */}
      <Section muted className="py-16 sm:py-20">
        <KeyFeatures />
      </Section>

      {/* ── 7. Search-to-insight journey ─────────────────────────────────── */}
      <Section className="py-16 sm:py-20">
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

      {/* ── 7b. Sample dashboard / result preview ────────────────────────── */}
      <Section muted className="py-16 sm:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Sample result</Eyebrow>
          <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
            Search result for Metformin API
          </h2>
          <p className="mt-3 text-muted">
            Not raw data — structured, decision-ready intelligence: buyers,
            suppliers, markets, pricing and an Opportunity Score in one view.
          </p>
        </Reveal>
        <Reveal delay={100} className="mx-auto mt-10 max-w-4xl">
          <SearchPreviewDashboard
            productName="Metformin (API)"
            summary={summary}
            buyerCount={buyers.length}
            supplierCount={suppliers.length}
            shipmentCount={shipments.length}
            avgPrice={avgPrice}
            opportunityScore={opportunityScore}
            recentRecords={recentRecords}
          />
        </Reveal>
      </Section>

      {/* ── 7c. Buyer–supplier network ────────────────────────────────────── */}
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

      {/* ── 8. Use cases ────────────────────────────────────────────────── */}
      <Section muted className="py-16 sm:py-20">
        <UseCases />
      </Section>

      {/* ── 9. Why Vaskodigama ─────────────────────────────────────────── */}
      <Section className="py-16 sm:py-20">
        <WhyVaskodigama />
      </Section>

      {/* ── 10. Global coverage ─────────────────────────────────────────── */}
      <Section className="py-16 sm:py-20">
        <GlobalCoverage chips={coverageChips} />
      </Section>

      {/* ── 11. Final CTA ───────────────────────────────────────────────── */}
      <Section className="pb-20">
        <LandingFinalCta />
      </Section>
    </>
  );
}
