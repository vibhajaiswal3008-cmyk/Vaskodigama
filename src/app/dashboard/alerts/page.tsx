import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AlertsManager } from "@/components/dashboard/alerts-manager";
import { WhatChanged } from "@/components/monitoring/what-changed";
import { tradeData } from "@/lib/data";

export default async function AlertsPage() {
  const alerts = await tradeData.listAlerts();
  return (
    <>
      <DashboardPageHeader
        title="Alerts"
        description="Get notified when buyers, suppliers, prices, competitors or markets change."
      />
      <AlertsManager initial={alerts} />
      <div className="mt-8">
        <WhatChanged />
      </div>
    </>
  );
}
