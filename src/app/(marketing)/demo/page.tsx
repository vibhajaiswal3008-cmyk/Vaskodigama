import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchExperience } from "@/components/search/search-experience";
import { Section } from "@/components/ui/misc";

export const metadata: Metadata = {
  title: "Explore a sample market",
  description:
    "Try the Global Trade Search with illustrative data and explore a sample market result — buyers, suppliers, prices and an Opportunity Score.",
};

const fallbackQuery = {
  type: "product" as const,
  term: "Natural honey",
  hsCode: "0409",
  direction: "import" as const,
  originCountry: "IN",
  destinationCountry: "AE",
  dateRange: "12m" as const,
};

export default function DemoPage() {
  return (
    <Section>
      <div className="mb-6 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Interactive demo
        </p>
        <h1 className="mt-1 text-3xl font-bold text-navy">
          Explore a sample market
        </h1>
        <p className="mt-2 text-muted">
          Adjust the search below or use the prefilled scenario (natural honey
          from India into the UAE). All data is illustrative.
        </p>
      </div>

      <Suspense fallback={<p className="text-muted">Loading the demo…</p>}>
        <SearchExperience resultPath="/demo" fallback={fallbackQuery} />
      </Suspense>
    </Section>
  );
}
