import type { Metadata } from "next";
import "@/components/analytics/analytics.css";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";

export const metadata: Metadata = {
  title: "Trade Analytics",
  description:
    "Deep trade-analytics workspace — overview, geography, products, exporters, importers, supply chain and a shipment-level data explorer.",
};

export default function AnalyticsPage() {
  return (
    <>
      <DashboardPageHeader
        title="Trade Analytics"
        description="A deep analytical workspace across markets, products, partners and shipments. All figures are illustrative demo data."
      />
      <AnalyticsDashboard />
    </>
  );
}
