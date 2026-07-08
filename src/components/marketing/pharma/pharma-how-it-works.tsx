import { Search, SlidersHorizontal, BarChart3, Briefcase } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";

interface Step {
  number: string;
  icon: LucideIcon;
  title: string;
  body: string;
}

const STEPS: Step[] = [
  {
    number: "01",
    icon: Search,
    title: "Search",
    body: "Enter a pharmaceutical product, HS Code or company name. The platform maps your query to relevant trade categories and classifications.",
  },
  {
    number: "02",
    icon: SlidersHorizontal,
    title: "Refine",
    body: "Filter by country, trade direction, date range and other available parameters to focus on the markets and periods that matter to you.",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Analyse",
    body: "Review active markets, company profiles, shipment patterns and trend dashboards. Drill from a market view down to individual records.",
  },
  {
    number: "04",
    icon: Briefcase,
    title: "Act",
    body: "Shortlist opportunities, note the relevant companies and continue with your commercial, regulatory, quality and supplier due diligence processes.",
  },
];

export function PharmaHowItWorks() {
  return (
    <div className="relative">
      {/* Connector line (desktop) */}
      <div
        className="absolute left-0 right-0 top-[44px] hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block"
        aria-hidden
      />

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <Reveal key={step.title} delay={i * 80}>
              <div className="flex flex-col items-start gap-4">
                {/* Step icon circle */}
                <div className="relative flex size-[52px] shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background shadow-sm">
                  <Icon className="size-5 text-primary" aria-hidden />
                  <span
                    className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white"
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">
                    Step {step.number}
                  </p>
                  <h3 className="mt-0.5 text-lg font-bold text-navy">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
