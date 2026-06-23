import { CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AskVasko } from "@/components/ask-vasko/ask-vasko";

export type SolutionSlug =
  | "exporters"
  | "importers"
  | "market-research"
  | "procurement";

interface SolutionContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  questions: string[];
  features: { title: string; body: string }[];
  demoHref: string;
}

export const solutions: Record<SolutionSlug, SolutionContent> = {
  exporters: {
    eyebrow: "For exporters",
    title: "Find active buyers and growing markets",
    subtitle:
      "See which markets are growing, which buyers are purchasing, and where your product fits best.",
    questions: [
      "Which markets show rising demand for my product?",
      "Which buyers are actively purchasing right now?",
      "Where is competition manageable?",
    ],
    features: [
      { title: "Buyer discovery", body: "Surface active buyers ranked by recent activity and fit." },
      { title: "Market ranking", body: "Compare markets by demand, competition and Opportunity Score." },
      { title: "Price context", body: "Understand the price ranges buyers are paying." },
    ],
    demoHref: "/demo?type=product&term=Natural%20honey&dir=export&origin=IN",
  },
  importers: {
    eyebrow: "For importers",
    title: "Discover dependable suppliers and compare prices",
    subtitle:
      "Evaluate suppliers by consistency, product range and price position before you reach out.",
    questions: [
      "Which suppliers appear dependable?",
      "What prices are being observed?",
      "How frequently do they ship?",
    ],
    features: [
      { title: "Supplier evaluation", body: "Judge consistency, range and price position at a glance." },
      { title: "Price comparison", body: "See ranges and how they move across markets." },
      { title: "Shortlists", body: "Save candidates and compare them side by side." },
    ],
    demoHref: "/demo?type=product&term=Natural%20honey&dir=import&dest=AE",
  },
  "market-research": {
    eyebrow: "Market research",
    title: "Size demand and spot momentum early",
    subtitle:
      "Understand where trade is moving, how fast, and what is changing beneath the surface.",
    questions: [
      "Which markets are growing?",
      "What has recently changed?",
      "Where is the opportunity strongest?",
    ],
    features: [
      { title: "Demand trends", body: "Read demand direction across markets over time." },
      { title: "What changed", body: "Track new entrants, price moves and shifts." },
      { title: "Evidence", body: "Every conclusion shows the records behind it." },
    ],
    demoHref: "/demo?type=product&term=Coffee&dir=import",
  },
  procurement: {
    eyebrow: "Procurement",
    title: "Shortlist and evaluate suppliers with evidence",
    subtitle:
      "Build defensible supplier shortlists with consistency, price position and reasoning attached.",
    questions: [
      "Which suppliers fit our requirements?",
      "How do they compare on price and consistency?",
      "What evidence supports the choice?",
    ],
    features: [
      { title: "Structured shortlists", body: "Compare candidates on consistent criteria." },
      { title: "Supplier assessment", body: "Capture consistency, range and risk signals." },
      { title: "Shareable reports", body: "Export an assessment your team can act on." },
    ],
    demoHref: "/demo?type=product&term=Cotton%20fabric&dir=import",
  },
};

export function SolutionPage({ slug }: { slug: SolutionSlug }) {
  const c = solutions[slug];
  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle}>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={c.demoHref}>Try it in the demo</ButtonLink>
          <ButtonLink href="/contact" variant="outline">
            Request a demo
          </ButtonLink>
        </div>
      </PageHero>

      <Section>
        <h2 className="text-2xl font-bold text-navy">Questions you can answer</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {c.questions.map((q) => (
            <li
              key={q}
              className="flex items-start gap-2 rounded-lg border border-border bg-background p-4"
            >
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <span className="text-sm font-medium text-navy">{q}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section muted>
        <h2 className="text-2xl font-bold text-navy">How Vaskodigama helps</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {c.features.map((f) => (
            <Card key={f.title}>
              <CardContent className="pt-5">
                <h3 className="font-semibold text-navy">{f.title}</h3>
                <p className="mt-1 text-sm text-muted">{f.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl">
          <AskVasko compact />
        </div>
      </Section>
    </>
  );
}
