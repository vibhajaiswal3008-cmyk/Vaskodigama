import type { Metadata } from "next";
import {
  ArrowRight,
  Boxes,
  Building2,
  LineChart,
  PackageSearch,
  ShoppingCart,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/ui/misc";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Solutions | One Platform, Different Trade Questions",
  description:
    "How Vaskodigama supports exporters, importers, manufacturers, procurement teams, market researchers and trade-data analysts.",
};

interface Solution {
  id: string;
  icon: LucideIcon;
  role: string;
  challenge: string;
  approach: string;
  searchPaths: string[];
  dashboardViews: string[];
  cta: { label: string; href: string };
  detail?: { label: string; href: string };
}

const solutions: Solution[] = [
  {
    id: "exporters",
    icon: ShoppingCart,
    role: "For exporters",
    challenge:
      "Finding markets and companies that show visible demand for a specific product.",
    approach:
      "Search a product or HS Code, compare destination markets, review importer activity and move from country-level trends to individual trade records.",
    searchPaths: ["Product", "HS Code", "Buyer", "Importer"],
    dashboardViews: ["Markets", "Companies", "Trade Records"],
    cta: { label: "Find Buyers", href: "/explore?mode=buyer" },
    detail: { label: "Exporter solution", href: "/solutions/exporters" },
  },
  {
    id: "importers",
    icon: PackageSearch,
    role: "For importers",
    challenge:
      "Identifying dependable suppliers and comparing sourcing patterns before deeper due diligence.",
    approach:
      "Explore exporting countries, review supplier activity, compare price position and shipment consistency, then shortlist candidates to research further.",
    searchPaths: ["Product", "HS Code", "Supplier", "Exporter"],
    dashboardViews: ["Suppliers", "Markets", "Compare"],
    cta: { label: "Discover Suppliers", href: "/explore?mode=supplier" },
    detail: { label: "Importer solution", href: "/solutions/importers" },
  },
  {
    id: "manufacturers",
    icon: Boxes,
    role: "For manufacturers",
    challenge:
      "Understanding market movement, product demand and where expansion might make sense.",
    approach:
      "Study product demand, competitor participation and market movement across countries to prioritise where to focus next.",
    searchPaths: ["Product", "HS Code", "Company"],
    dashboardViews: ["Markets", "Products", "Companies"],
    cta: { label: "Analyze Product Demand", href: "/explore?mode=product" },
  },
  {
    id: "procurement",
    icon: Building2,
    role: "For procurement & sourcing teams",
    challenge:
      "Comparing supplier regions, trading frequency, pricing patterns and concentration risk.",
    approach:
      "Use structured trade records to compare supplier regions and frequency, review pricing patterns and assess concentration risk with evidence attached.",
    searchPaths: ["Supplier", "Exporter", "HS Code", "Port"],
    dashboardViews: ["Suppliers", "Compare", "Reports"],
    cta: { label: "Explore Sourcing Intelligence", href: "/explore?mode=supplier" },
    detail: { label: "Procurement solution", href: "/solutions/procurement" },
  },
  {
    id: "researchers",
    icon: LineChart,
    role: "For market researchers & consultants",
    challenge:
      "Building defensible market views from product, HS Code, country, company, port, value and time.",
    approach:
      "Combine filters to size demand and momentum, then support every conclusion with the underlying records and a clear data date.",
    searchPaths: ["Product", "HS Code", "Company", "Country"],
    dashboardViews: ["Markets", "Trade Analytics", "Reports"],
    cta: { label: "Open Market Analysis", href: "/dashboard/markets" },
    detail: { label: "Market-research solution", href: "/solutions/market-research" },
  },
  {
    id: "analysts",
    icon: Users,
    role: "For trade-data analysts",
    challenge:
      "Moving quickly between summary indicators and transaction-level records without losing context.",
    approach:
      "Filter by trade flow, location, participant, date, quantity and value, export samples to CSV, and share an exact search by copying the URL.",
    searchPaths: ["Product", "HS Code", "Company", "Buyer", "Supplier"],
    dashboardViews: ["Trade Analytics", "Trade Records", "Compare"],
    cta: { label: "Open the Explore workspace", href: "/explore" },
  },
];

function ChipRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {items.map((i) => (
          <Badge key={i} tone="neutral">{i}</Badge>
        ))}
      </div>
    </div>
  );
}

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="One Platform, Different Trade Questions"
        subtitle="Whatever your role, the workflow is the same: start from what you know, refine the records, compare the signals and decide the next action."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/explore">Explore the demo</ButtonLink>
          <ButtonLink href="/contact" variant="outline">Request a Demo</ButtonLink>
        </div>
      </PageHero>

      {solutions.map((s, i) => {
        const Icon = s.icon;
        return (
          <Section key={s.id} muted={i % 2 === 1}>
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="size-6" aria-hidden />
                </span>
                <h2 className="mt-4 text-2xl font-bold text-navy">{s.role}</h2>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted">
                  The challenge
                </p>
                <p className="mt-1 text-muted">{s.challenge}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <ButtonLink href={s.cta.href}>
                    {s.cta.label} <ArrowRight className="size-4" aria-hidden />
                  </ButtonLink>
                  {s.detail ? (
                    <ButtonLink href={s.detail.href} variant="outline">
                      {s.detail.label}
                    </ButtonLink>
                  ) : null}
                </div>
              </div>

              <div className="rounded-[20px] border border-border bg-background p-6 shadow-xs">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  How Vaskodigama helps
                </p>
                <p className="mt-2 text-navy">{s.approach}</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <ChipRow label="Relevant search paths" items={s.searchPaths} />
                  <ChipRow label="Relevant dashboard views" items={s.dashboardViews} />
                </div>
                <p className="mt-5 text-xs text-muted">
                  We help you identify research targets and review visible trade
                  activity — not every company is a qualified sales lead.
                </p>
              </div>
            </div>
          </Section>
        );
      })}

      <Section>
        <div className="flex flex-wrap items-center gap-3 rounded-[20px] border border-border bg-surface p-6">
          <div className="grow">
            <h2 className="text-lg font-semibold text-navy">Not sure where to start?</h2>
            <p className="mt-1 text-sm text-muted">
              Tell us the question you are trying to answer and we will point you
              to the right workflow.
            </p>
          </div>
          <ButtonLink href="/contact">Talk to Our Team</ButtonLink>
          <ButtonLink href="/explore" variant="outline">Explore Trade Data</ButtonLink>
        </div>
      </Section>
    </>
  );
}
