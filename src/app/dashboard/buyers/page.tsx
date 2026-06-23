import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { CompaniesExplorer } from "@/components/dashboard/companies-explorer";
import { tradeData } from "@/lib/data";

export default async function BuyersPage() {
  const buyers = await tradeData.listBuyers();
  return (
    <>
      <DashboardPageHeader
        title="Buyers"
        description="Active buyers ranked by recent activity, relevance and Opportunity Score. Open a buyer to see why it matters."
      />
      <CompaniesExplorer companies={buyers} kind="buyer" caption="Illustrative buyers" />
    </>
  );
}
