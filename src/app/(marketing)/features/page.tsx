import type { Metadata } from "next";
import {
  Building2,
  Columns3,
  Download,
  Globe,
  Layers,
  Link2,
  Save,
  Search,
  Table2,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/ui/misc";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Features | A Clearer Workspace for Global Trade Research",
  description:
    "The demonstration capabilities available in the Vaskodigama interface — multi-mode search, country filters, dashboards, exports and shareable searches.",
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

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  return (
    <Card>
      <CardContent className="pt-5">
        <Icon className="size-6 text-primary" aria-hidden />
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
        subtitle="Everything below is available to try in this demonstration, built on illustrative data."
      />

      <Section>
        <h2 className="text-2xl font-bold text-navy">Demonstration capabilities</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {demoFeatures.map((f) => (
            <FeatureCard key={f.title} feature={f} />
          ))}
        </div>
      </Section>
    </>
  );
}
