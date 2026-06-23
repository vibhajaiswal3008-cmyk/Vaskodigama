import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Hash, Globe2, Gauge } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/ui/misc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Plain-language guides for first-time exporters and experienced analysts — HS codes, reading shipment data, and using the Opportunity Score.",
};

const guides = [
  { icon: Hash, title: "What is an HS code?", body: "A plain-language primer on the international product classification used in customs records.", tag: "Beginner" },
  { icon: Globe2, title: "Reading shipment data", body: "How to interpret exporters, importers, quantities and values without over-reading them.", tag: "Beginner" },
  { icon: Gauge, title: "Using the Opportunity Score", body: "What the score considers, what it doesn’t, and how to use it responsibly.", tag: "Concept" },
  { icon: BookOpen, title: "Market-entry checklist", body: "A practical sequence for evaluating a new market with trade intelligence.", tag: "Workflow" },
];

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Guides for first-time exporters and experienced analysts"
        subtitle="Short, practical explainers. We add to these over time."
      />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2">
          {guides.map((g) => {
            const Icon = g.icon;
            return (
              <Card key={g.title}>
                <CardContent className="pt-5">
                  <div className="flex items-center justify-between">
                    <Icon className="size-6 text-primary" aria-hidden />
                    <Badge tone="neutral">{g.tag}</Badge>
                  </div>
                  <h2 className="mt-3 font-semibold text-navy">{g.title}</h2>
                  <p className="mt-1 text-sm text-muted">{g.body}</p>
                  <p className="mt-3 text-xs font-medium text-muted">
                    Full guide coming soon
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <p className="mt-8 text-center text-sm text-muted">
          Looking for something specific?{" "}
          <Link href="/contact" className="font-medium text-primary hover:underline">
            Ask our team
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
