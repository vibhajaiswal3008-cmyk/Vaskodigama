import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { CompareBoard } from "@/components/dashboard/compare-board";
import { tradeData } from "@/lib/data";

export default async function ComparePage() {
  const companies = await tradeData.listCompanies();
  return (
    <>
      <DashboardPageHeader
        title="Compare"
        description="Place companies side by side on consistent criteria to support a decision."
      />
      <CompareBoard companies={companies} />
    </>
  );
}
