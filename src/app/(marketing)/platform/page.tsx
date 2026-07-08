import type { Metadata } from "next";
import {
  Search,
  Gauge,
  GitCompareArrows,
  Bell,
  FileText,
  Database,
} from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TradeSearch } from "@/components/search/trade-search";
import { JourneySteps } from "@/components/marketing/sections";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "How Vaskodigama turns shipment records into clear decisions: Global Trade Search, Opportunity Score, comparisons, alerts and reports.",
};

const capabilities = [
  { icon: Search, title: "Global Trade Search", body: "Start from a product, HS code, company or market — with guided suggestions." },
  { icon: Gauge, title: "Opportunity Score", body: "A transparent 0–100 guide with its contributing factors always visible." },
  { icon: GitCompareArrows, title: "Compare", body: "Place buyers, suppliers, markets and prices side by side." },
  { icon: Bell, title: "Alerts", body: "Get notified when buyers, prices, competitors or markets change." },
  { icon: FileText, title: "Reports", body: "Assemble market-entry, buyer-shortlist and other reports." },
  { icon: Database, title: "Data transparency", body: "Coverage, completeness and confidence shown on every view." },
];

export default function PlatformPage() {
  return (
    <>
      <PageHero
        eyebrow="Platform"
        title="From shipment records to clear decisions"
        subtitle="Vaskodigama is built around one idea: every result should explain what it means and what to do next."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/demo">Explore the demo</ButtonLink>
          <ButtonLink href="/contact" variant="outline">
            Request a guided demo
          </ButtonLink>
        </div>
      </PageHero>

      <Section id="search">
        <h2 className="text-2xl font-bold text-navy">Global Trade Search</h2>
        <p className="mt-2 max-w-2xl text-muted">
          Begin with a product or HS code, refine by market, state and port, and
          read a plain-English summary before you search.
        </p>
        <div className="mt-6">
          <TradeSearch variant="full" resultPath="/search-results" />
        </div>
      </Section>

      <Section muted>
        <h2 className="text-2xl font-bold text-navy">What’s inside</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c) => {
            const Icon = c.icon;
            return (
              <Card key={c.title}>
                <CardContent className="pt-5">
                  <Icon className="size-6 text-primary" aria-hidden />
                  <h3 className="mt-3 font-semibold text-navy">{c.title}</h3>
                  <p className="mt-1 text-sm text-muted">{c.body}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section>
        <JourneySteps />
      </Section>
    </>
  );
}
