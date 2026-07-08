import {
  Globe2,
  Building2,
  BarChart3,
  ShoppingCart,
  Eye,
  Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";

interface Challenge {
  icon: LucideIcon;
  title: string;
  body: string;
  tint: string;
}

const CHALLENGES: Challenge[] = [
  {
    icon: Globe2,
    title: "Find the right market",
    body: "See where selected pharmaceutical products are actively imported or exported, without sifting through generic commodity data.",
    tint: "bg-primary-soft text-primary",
  },
  {
    icon: Building2,
    title: "Identify active companies",
    body: "Explore buyers, suppliers, importers and exporters connected to the product, rather than relying on unverified directories.",
    tint: "bg-[color-mix(in_srgb,var(--chart-2)_14%,white)] text-[var(--chart-2)]",
  },
  {
    icon: BarChart3,
    title: "Understand shipment behaviour",
    body: "Review shipment frequency, routes, quantities and available value indicators to understand how markets actually behave.",
    tint: "bg-success-soft text-success",
  },
  {
    icon: ShoppingCart,
    title: "Compare sourcing options",
    body: "Study supplier markets and company activity before beginning deeper qualification, so shortlisting starts from evidence.",
    tint: "bg-warning-soft text-warning",
  },
  {
    icon: Eye,
    title: "Monitor competitors",
    body: "Observe visible trade relationships and market activity where data permits, and keep track of how the competitive landscape shifts.",
    tint: "bg-surface-2 text-navy",
  },
  {
    icon: Clock,
    title: "Reduce research time",
    body: "Move from broad product searches to focused market and company analysis in one workspace, not across a dozen separate tools.",
    tint: "bg-primary-soft text-primary",
  },
];

export function PharmaChallenges() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CHALLENGES.map((c, i) => {
        const Icon = c.icon;
        return (
          <Reveal key={c.title} delay={i * 60}>
            <div className="tile-glow group flex h-full flex-col gap-4 rounded-xl border border-border bg-background p-5">
              <span
                className={`flex size-10 items-center justify-center rounded-lg ${c.tint}`}
              >
                <Icon className="size-5" aria-hidden />
              </span>
              <div>
                <h3 className="font-semibold text-navy">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{c.body}</p>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
