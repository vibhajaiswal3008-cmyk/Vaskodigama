import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { CompaniesExplorer } from "@/components/dashboard/companies-explorer";
import { tradeData } from "@/lib/data";

export default async function CompaniesPage() {
  const companies = await tradeData.listCompanies();
  return (
    <>
      <DashboardPageHeader
        title="Companies"
        description="All companies in this search context — buyers, suppliers and those acting as both. Open one for its trade story."
      />
      <CompaniesExplorer companies={companies} kind="buyer" caption="Illustrative companies" />
    </>
  );
}
