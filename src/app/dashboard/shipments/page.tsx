import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ShipmentsTable } from "@/components/dashboard/shipments-table";
import { Card, CardContent } from "@/components/ui/card";
import { tradeData } from "@/lib/data";

export default async function ShipmentsPage() {
  const shipments = await tradeData.listShipments();
  return (
    <>
      <DashboardPageHeader
        title="Shipments"
        description="Detailed shipment records with exporter, importer, route, quantity, value and a per-record confidence flag."
      />
      <Card>
        <CardContent className="pt-5">
          <ShipmentsTable shipments={shipments} />
        </CardContent>
      </Card>
    </>
  );
}
