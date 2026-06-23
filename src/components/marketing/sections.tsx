import Link from "next/link";
import {
  Compass,
  BookOpen,
  GitCompareArrows,
  CheckCircle2,
  Send,
  Layers,
  ArrowRight,
  Database,
  ShieldCheck,
  ClipboardList,
  Microscope,
} from "lucide-react";
import { Eyebrow } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/** Original product-interface preview (no laptop mockups). */
export function ProductPreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background shadow-md">
      <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
        <Compass className="size-4 text-primary" aria-hidden />
        <span className="text-sm font-medium text-navy">Sample result</span>
        <Badge tone="warning" className="ml-auto">
          Illustrative
        </Badge>
      </div>
      <div className="grid gap-4 p-5 sm:grid-cols-[1fr_auto]">
        <div>
          <p className="text-xs text-muted">Query</p>
          <p className="text-sm font-semibold text-navy">
            Imports of natural honey into the UAE from India
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge tone="primary">Product: Natural honey</Badge>
            <Badge tone="neutral">HS 0409</Badge>
            <Badge tone="neutral">🇮🇳 India → 🇦🇪 UAE</Badge>
          </div>
          <div className="mt-4 rounded-lg bg-surface p-3">
            <p className="text-xs font-semibold text-muted-strong">Why this matters</p>
            <p className="mt-1 text-sm text-muted">
              Import demand is rising with moderate competition, and several
              active buyers rely on a small supplier base.
            </p>
          </div>
          <p className="mt-3 text-xs font-semibold text-primary">
            Recommended next action → Compare the top three suppliers
          </p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-primary-soft p-4 text-center">
          <p className="text-xs font-medium text-primary-soft-foreground">
            Opportunity Score
          </p>
          <p className="text-4xl font-bold text-primary">86</p>
          <p className="text-xs text-muted">/ 100</p>
        </div>
      </div>
    </div>
  );
}

export function ProblemSolution() {
  const problems = [
    {
      title: "Too much data, too little direction",
      body: "Endless rows of shipment records rarely tell you where to focus.",
    },
    {
      title: "Buyer and supplier evaluation is hard",
      body: "It’s difficult to judge who is active, reliable and a good fit.",
    },
    {
      title: "Important changes hide in static records",
      body: "New buyers, price moves and competitor activity are easy to miss.",
    },
  ];
  const solutions = [
    "Prioritised opportunities, ranked and explained",
    "Plain-language explanations behind every result",
    "Clear, recommended next actions you can act on",
  ];
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <Eyebrow>The problem</Eyebrow>
        <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">
          Trade records alone don’t tell you what to do
        </h2>
        <ul className="mt-5 space-y-3">
          {problems.map((p) => (
            <li key={p.title} className="rounded-lg border border-border bg-background p-4">
              <p className="font-semibold text-navy">{p.title}</p>
              <p className="mt-1 text-sm text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <Eyebrow>How Vaskodigama helps</Eyebrow>
        <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">
          From records to decisions
        </h2>
        <ul className="mt-5 space-y-3">
          {solutions.map((s) => (
            <li
              key={s}
              className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary-soft/50 p-4"
            >
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <span className="font-medium text-navy">{s}</span>
            </li>
          ))}
        </ul>
        <ButtonLink href="/platform" variant="outline" className="mt-5">
          See how it works <ArrowRight className="size-4" aria-hidden />
        </ButtonLink>
      </div>
    </div>
  );
}

const journeySteps = [
  { icon: Compass, title: "Discover", body: "Search by product, HS code or market and surface promising opportunities.", benefit: "Start from a goal, not a blank table." },
  { icon: BookOpen, title: "Understand", body: "Read plain-language explanations and the evidence behind each result.", benefit: "Know why something matters." },
  { icon: GitCompareArrows, title: "Compare", body: "Line up buyers, suppliers, markets and prices side by side.", benefit: "Decide with context." },
  { icon: CheckCircle2, title: "Decide", body: "Use the Opportunity Score and recommended actions to choose.", benefit: "Move from analysis to action." },
  { icon: Send, title: "Connect", body: "Save opportunities, set alerts and build a report to act on.", benefit: "Carry the work forward." },
];

export function JourneySteps() {
  return (
    <div>
      <div className="text-center">
        <Eyebrow>The journey</Eyebrow>
        <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">
          Discover → Understand → Compare → Decide → Connect
        </h2>
      </div>
      <ol className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {journeySteps.map((s, i) => {
          const Icon = s.icon;
          return (
            <li key={s.title} className="rounded-xl border border-border bg-background p-5">
              <div className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="text-xs font-semibold text-muted">Step {i + 1}</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-navy">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.body}</p>
              <p className="mt-3 text-xs font-medium text-primary">{s.benefit}</p>
            </li>
          );
        })}
      </ol>
      <div className="mt-6 text-center">
        <ButtonLink href="/demo">Walk through the demo</ButtonLink>
      </div>
    </div>
  );
}

export const industries = [
  { id: "pharmaceuticals", name: "Pharmaceuticals", note: "Formulations, APIs, regulatory-sensitive trade." },
  { id: "chemicals", name: "Chemicals", note: "Intermediates, specialty and bulk chemicals." },
  { id: "food-agriculture", name: "Food & agriculture", note: "Commodities, packaged foods, certifications." },
  { id: "cosmetics", name: "Cosmetics & personal care", note: "Actives, formulations, finished goods." },
  { id: "textiles", name: "Textiles", note: "Fibre, yarn, fabric and made-ups." },
  { id: "machinery", name: "Machinery", note: "Components, capital equipment, spares." },
  { id: "electronics", name: "Electronics", note: "Components, devices, assemblies." },
  { id: "medical-devices", name: "Medical devices", note: "Instruments, consumables, diagnostics." },
];

export function IndustriesGrid() {
  return (
    <div>
      <div className="text-center">
        <Eyebrow>Industry workspaces</Eyebrow>
        <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">
          Different sectors, different questions
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-muted">
          Each industry can need its own analytical fields — from regulatory
          codes to certification and packaging detail.
        </p>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {industries.map((ind) => (
          <div key={ind.id} className="rounded-xl border border-border bg-background p-5">
            <Layers className="size-5 text-primary" aria-hidden />
            <h3 className="mt-3 font-semibold text-navy">{ind.name}</h3>
            <p className="mt-1 text-sm text-muted">{ind.note}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <ButtonLink href="/industries" variant="outline">
          Explore industries <ArrowRight className="size-4" aria-hidden />
        </ButtonLink>
      </div>
    </div>
  );
}

export function AnalystSupport() {
  const services = [
    { icon: Compass, label: "Market-entry research" },
    { icon: ClipboardList, label: "Buyer shortlisting" },
    { icon: ShieldCheck, label: "Supplier evaluation" },
    { icon: Microscope, label: "Product research" },
    { icon: GitCompareArrows, label: "Competitor analysis" },
    { icon: Database, label: "Custom reports" },
  ];
  return (
    <div className="grid items-center gap-8 lg:grid-cols-2">
      <div>
        <Eyebrow>Human analyst support</Eyebrow>
        <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">
          Technology for speed. People for the harder questions.
        </h2>
        <p className="mt-3 text-muted">
          When a question needs judgement, our research support can help with
          deeper, tailored work alongside the platform.
        </p>
        <ButtonLink href="/contact" className="mt-5">
          Ask a Trade Analyst
        </ButtonLink>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <li key={s.label} className="flex items-center gap-3 rounded-lg border border-border bg-background p-4">
              <Icon className="size-5 text-primary" aria-hidden />
              <span className="text-sm font-medium text-navy">{s.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function FinalCta() {
  return (
    <div className="rounded-2xl bg-navy px-6 py-12 text-center text-white sm:px-12">
      <h2 className="mx-auto max-w-2xl text-2xl font-bold sm:text-3xl">
        See the market clearly. Find the right opportunity. Take the next step
        with confidence.
      </h2>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/demo"
          className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-navy hover:bg-white/90"
        >
          Explore Demo
        </Link>
        <Link
          href="/contact"
          className="rounded-md border border-white/30 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
        >
          Request a Guided Demo
        </Link>
      </div>
    </div>
  );
}
