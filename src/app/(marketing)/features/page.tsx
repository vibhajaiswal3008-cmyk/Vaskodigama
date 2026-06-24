import type { Metadata } from "next";
import {
  Bell,
  Bot,
  Building2,
  Columns3,
  Download,
  Filter,
  Globe,
  Layers,
  Link2,
  Network,
  Save,
  ScrollText,
  Search,
  ShieldAlert,
  Sparkles,
  Table2,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/ui/misc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Features | What You Can Do Today, and What's Planned",
  description:
    "A clear split between demonstration capabilities available now and planned capabilities on the Vaskodigama roadmap.",
};

interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
}

const demoFeatures: Feature[] = [
  { icon: Search, title: "Multi-mode search", body: "Search by product, HS Code, company, buyer, supplier, importer or exporter." },
  { icon: Globe, title: "Country filters", body: "Filter records by origin, destination, region and port across 40 demonstration markets." },
  { icon: Layers, title: "Product & HS Code analysis", body: "Connect descriptions and classifications to countries, companies and movement." },
  { icon: Users, title: "Buyer & supplier views", body: "Study organisations through their visible import or export activity." },
  { icon: Building2, title: "Company profiles", body: "Illustrative company views built on mock trade activity." },
  { icon: Table2, title: "Interactive dashboards", body: "Review indicators, trends, distributions and detailed records in one workspace." },
  { icon: Download, title: "CSV export of samples", body: "Export the visible sample records to a CSV file from your browser." },
  { icon: Link2, title: "Shareable searches", body: "Every Explore search is captured in the URL, so a link reproduces the state." },
  { icon: Columns3, title: "Responsive data tables", body: "Toggle columns and switch between table and card views on any screen size." },
  { icon: Save, title: "Browser saved searches", body: "Keep handy searches locally in your browser (a demo convenience, not an account)." },
];

const plannedFeatures: Feature[] = [
  { icon: Bell, title: "Real-time or scheduled alerts", body: "Get notified when activity, prices or participants change." },
  { icon: Network, title: "Decision-maker enrichment", body: "Connect records to verified contacts where permitted." },
  { icon: Filter, title: "Production API access", body: "Programmatic access to production trade data." },
  { icon: Users, title: "Team workspaces", body: "Shared lists, roles and collaboration for whole teams." },
  { icon: Bot, title: "CRM integrations", body: "Push research targets into your existing CRM." },
  { icon: Sparkles, title: "AI-assisted summaries", body: "Plain-language summaries with evidence, confidence and a data date." },
  { icon: ScrollText, title: "Scheduled email reports", body: "Recurring market and shipment summaries by email." },
  { icon: ShieldAlert, title: "Advanced risk indicators", body: "Supplier-risk and concentration signals to support due diligence." },
];

function FeatureCard({ feature, status }: { feature: Feature; status: "demo" | "planned" | "contact" }) {
  const Icon = feature.icon;
  const badge =
    status === "demo" ? (
      <Badge tone="success">Demo available</Badge>
    ) : status === "planned" ? (
      <Badge tone="warning">Planned</Badge>
    ) : (
      <Badge tone="primary">Contact us</Badge>
    );
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-center justify-between">
          <Icon className="size-6 text-primary" aria-hidden />
          {badge}
        </div>
        <h3 className="mt-3 font-semibold text-navy">{feature.title}</h3>
        <p className="mt-1 text-sm text-muted">{feature.body}</p>
      </CardContent>
    </Card>
  );
}

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        eyebrow="Features"
        title="A Clearer Workspace for Global Trade Research"
        subtitle="We keep an honest line between what the demonstration does today and what is planned. Planned items are clearly labelled and never described as available now."
      />

      <Section>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-navy">Demonstration capabilities</h2>
          <Badge tone="success">Available in this demo</Badge>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {demoFeatures.map((f) => (
            <FeatureCard key={f.title} feature={f} status="demo" />
          ))}
        </div>
      </Section>

      <Section muted>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-navy">Planned capabilities</h2>
          <Badge tone="warning">On the roadmap</Badge>
        </div>
        <p className="mt-2 max-w-2xl text-muted">
          These are future capabilities. They are not connected in this
          demonstration — register interest and we will keep you updated.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {plannedFeatures.map((f) => (
            <FeatureCard key={f.title} feature={f} status="planned" />
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/explore">Explore the demo</ButtonLink>
          <ButtonLink href="/contact" variant="outline">Register interest</ButtonLink>
        </div>
      </Section>
    </>
  );
}
