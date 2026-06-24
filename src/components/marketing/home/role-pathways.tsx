"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Tabs } from "@/components/ui/tabs";
import { ButtonLink } from "@/components/ui/button";

interface Pathway {
  id: string;
  label: string;
  body: string;
  cta: { label: string; href: string };
  points: string[];
}

const PATHWAYS: Pathway[] = [
  {
    id: "exporters",
    label: "Exporters",
    body: "Identify markets showing product demand, study active importers and prioritize outreach using visible trade activity.",
    cta: { label: "Find Buyers", href: "/explore?mode=buyer" },
    points: ["Markets with rising demand", "Active importers to research", "Country-level trends to records"],
  },
  {
    id: "importers",
    label: "Importers",
    body: "Explore exporting countries, review supplier activity and compare sourcing patterns before beginning deeper due diligence.",
    cta: { label: "Discover Suppliers", href: "/explore?mode=supplier" },
    points: ["Exporting countries to consider", "Supplier activity and consistency", "Sourcing patterns to compare"],
  },
  {
    id: "manufacturers",
    label: "Manufacturers",
    body: "Understand market movement, product demand, competitor participation and possible expansion opportunities.",
    cta: { label: "Analyze Product Demand", href: "/explore?mode=product" },
    points: ["Product demand by market", "Competitor participation", "Where to expand next"],
  },
  {
    id: "procurement",
    label: "Procurement Teams",
    body: "Compare supplier regions, trading frequency, pricing patterns and concentration risk using structured trade records.",
    cta: { label: "Explore Sourcing Intelligence", href: "/explore?mode=supplier" },
    points: ["Supplier regions side by side", "Trading frequency and pricing", "Concentration risk signals"],
  },
  {
    id: "researchers",
    label: "Researchers & Consultants",
    body: "Build market views using product, HS Code, country, company, port, value and time-based filters.",
    cta: { label: "Open Market Analysis", href: "/dashboard/markets" },
    points: ["Flexible multi-field filters", "Evidence behind every view", "Shareable, exportable results"],
  },
];

export function RolePathways() {
  const [active, setActive] = React.useState(PATHWAYS[0].id);
  const current = PATHWAYS.find((p) => p.id === active) ?? PATHWAYS[0];

  return (
    <div>
      <Tabs
        tabs={PATHWAYS.map((p) => ({ id: p.id, label: p.label }))}
        value={active}
        onChange={setActive}
      />
      <div className="mt-6 grid gap-6 rounded-[20px] border border-border bg-background p-6 shadow-xs lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h3 className="text-xl font-semibold text-navy">{current.label}</h3>
          <p className="mt-2 text-muted">{current.body}</p>
          <ButtonLink href={current.cta.href} className="mt-5">
            {current.cta.label} <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
        </div>
        <ul className="space-y-2.5">
          {current.points.map((pt) => (
            <li
              key={pt}
              className="flex items-start gap-2 rounded-lg border border-border bg-surface p-3 text-sm font-medium text-navy"
            >
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
              {pt}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
