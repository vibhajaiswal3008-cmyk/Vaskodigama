import { Suspense } from "react";
import { SearchExperience } from "@/components/search/search-experience";
import { DashboardPageHeader } from "@/components/dashboard/page-header";

const fallbackQuery = {
  type: "product" as const,
  term: "Natural honey",
  hsCode: "0409",
  direction: "import" as const,
  originCountry: "IN",
  destinationCountry: "AE",
  dateRange: "12m" as const,
};

export default function DashboardSearchPage() {
  return (
    <>
      <DashboardPageHeader
        title="Search"
        description="Refine the query and explore results across markets, buyers, suppliers and more."
        showIllustrative={false}
      />
      <Suspense fallback={<p className="text-muted">Loading search…</p>}>
        <SearchExperience resultPath="/dashboard/search" fallback={fallbackQuery} />
      </Suspense>
    </>
  );
}
