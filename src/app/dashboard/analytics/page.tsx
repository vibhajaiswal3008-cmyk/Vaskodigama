import type { Metadata } from "next";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { TradeAnalytics } from "@/components/dashboard/trade-analytics";
import { tradeData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Trade Analytics",
  description:
    "An analytical workspace across markets, companies, products and transaction-level records. All figures are illustrative demo data.",
};

export default async function AnalyticsPage() {
  const summary = await tradeData.getTradeAnalytics();
  return (
    <>
      <DashboardPageHeader
        title="Trade Analytics"
        description="Move between markets, companies, products and transaction-level records in one connected view. All figures are illustrative demo data."
      />
      <TradeAnalytics summary={summary} />
    </>
  );
}
