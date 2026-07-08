import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchExperience } from "@/components/search/search-experience";
import { Section } from "@/components/ui/misc";

export const metadata: Metadata = {
  title: "Search Results",
  description:
    "Trade intelligence for your search — buyers, suppliers, HS-code accuracy, country movement, pricing and shipment records.",
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

export default function SearchResultsPage() {
  return (
    <Section>
      <Suspense fallback={<p className="text-muted">Loading results…</p>}>
        <SearchExperience resultPath="/search-results" fallback={fallbackQuery} />
      </Suspense>
    </Section>
  );
}
