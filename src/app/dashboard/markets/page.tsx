import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { MarketsExplorer } from "@/components/dashboard/markets-explorer";
import { tradeData } from "@/lib/data";

export default async function MarketsPage() {
  const markets = await tradeData.listMarkets();
  return (
    <>
      <DashboardPageHeader
        title="Markets"
        description="Compare markets by demand, competition, supplier concentration and Opportunity Score."
      />
      <MarketsExplorer markets={markets} />
    </>
  );
}
