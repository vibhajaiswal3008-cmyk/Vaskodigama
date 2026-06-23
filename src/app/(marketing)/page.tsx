import { Sparkles } from "lucide-react";
import { TradeSearch } from "@/components/search/trade-search";
import { Section, Eyebrow } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GoalSelector } from "@/components/marketing/goal-selector";
import { AskVasko } from "@/components/ask-vasko/ask-vasko";
import { WhatChanged } from "@/components/monitoring/what-changed";
import { CompanyTimeline } from "@/components/company/company-timeline";
import { OpportunityScoreCard } from "@/components/opportunity/opportunity-score";
import { DataQualityPanel } from "@/components/shared/data-quality";
import {
  AnalystSupport,
  FinalCta,
  IndustriesGrid,
  JourneySteps,
  ProblemSolution,
  ProductPreview,
} from "@/components/marketing/sections";
import { tradeData } from "@/lib/data";
import { getCompany } from "@/data/mock/companies";

export default async function HomePage() {
  const dataQuality = await tradeData.getDataQuality();
  const meridian = getCompany("meridian-imports")!;

  return (
    <>
      {/* Hero */}
      <Section className="pt-12 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Badge tone="primary" className="mb-4">
              <Sparkles className="size-3.5" aria-hidden /> Trade intelligence, made decision-ready
            </Badge>
            <h1 className="text-4xl font-bold leading-tight text-navy sm:text-5xl">
              Trade data that tells you what to do next.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted">
              Search products, HS codes and markets. Discover suitable buyers and
              suppliers, understand trade movement, and turn complex shipment
              records into clear business decisions.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/demo" size="lg">
                Explore a Sample Market
              </ButtonLink>
              <ButtonLink href="/contact" variant="outline" size="lg">
                Request a Guided Demo
              </ButtonLink>
            </div>
          </div>
          <ProductPreview />
        </div>

        <div className="mt-10">
          <TradeSearch variant="hero" resultPath="/demo" />
        </div>
      </Section>

      {/* Goal selector */}
      <Section muted>
        <GoalSelector />
      </Section>

      {/* Problem / solution */}
      <Section>
        <ProblemSolution />
      </Section>

      {/* Five-step journey */}
      <Section muted>
        <JourneySteps />
      </Section>

      {/* Opportunity Score + Why this matters */}
      <Section>
        <div className="grid items-start gap-8 lg:grid-cols-2">
          <div>
            <Eyebrow>Vaskodigama Opportunity Score</Eyebrow>
            <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">
              One score, with the reasons in plain sight
            </h2>
            <p className="mt-3 text-muted">
              The illustrative Opportunity Score may consider recent trade
              activity, shipment frequency, volume growth, supplier
              concentration, product relevance, market demand, competition,
              buyer consistency and data freshness. It’s a guide to focus
              attention — not a scientifically validated metric.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-strong">
              <li>• Purchase activity increased in the illustrative period.</li>
              <li>• The buyer appears to use a limited supplier base.</li>
              <li>• Transaction sizes match the selected exporter profile.</li>
              <li>• Sourcing activity from South Asia increased.</li>
            </ul>
          </div>
          <OpportunityScoreCard
            score={meridian.opportunity}
            title="Example: Meridian Imports"
            subject="Illustrative buyer in the UAE"
          />
        </div>
      </Section>

      {/* Company X-Ray + What Changed */}
      <Section muted>
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <Eyebrow>Company X-Ray</Eyebrow>
            <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">
              A company’s trade story over time
            </h2>
            <p className="mt-3 text-muted">
              See when a company first appeared, added suppliers, grew volume,
              entered new markets or diversified products.
            </p>
            <div className="mt-5 rounded-xl border border-border bg-background p-5">
              <CompanyTimeline events={meridian.timeline ?? []} />
            </div>
          </div>
          <div>
            <Eyebrow>Monitoring</Eyebrow>
            <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">
              Know what changed
            </h2>
            <p className="mt-3 text-muted">
              Track new buyers and suppliers, price moves, competitor activity
              and market shifts — filtered to what you care about.
            </p>
            <div className="mt-5">
              <WhatChanged limit={3} />
            </div>
          </div>
        </div>
      </Section>

      {/* Ask Vasko */}
      <Section>
        <div className="text-center">
          <Eyebrow>Ask Vasko</Eyebrow>
          <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">
            Ask a question, get an answer with evidence
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-muted">
            A demonstration assistant that always shows the reasoning, data date
            and confidence behind a recommendation.
          </p>
        </div>
        <div className="mx-auto mt-6 max-w-3xl">
          <AskVasko />
        </div>
      </Section>

      {/* Industries */}
      <Section muted>
        <IndustriesGrid />
      </Section>

      {/* Data transparency */}
      <Section>
        <div className="grid items-start gap-8 lg:grid-cols-2">
          <div>
            <Eyebrow>Data transparency</Eyebrow>
            <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">
              Know what stands behind every insight
            </h2>
            <p className="mt-3 text-muted">
              Every view shows when data was last updated, the coverage period,
              source category, completeness and confidence — and is honest about
              its limitations. We never claim 100% accuracy.
            </p>
            <ButtonLink href="/data" variant="outline" className="mt-5">
              How our data works
            </ButtonLink>
          </div>
          <DataQualityPanel q={dataQuality} />
        </div>
      </Section>

      {/* Analyst support */}
      <Section muted>
        <AnalystSupport />
      </Section>

      {/* Final CTA */}
      <Section>
        <FinalCta />
      </Section>
    </>
  );
}
