import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { CompaniesExplorer } from "@/components/dashboard/companies-explorer";
import { tradeData } from "@/lib/data";

export default async function SuppliersPage() {
  const suppliers = await tradeData.listSuppliers();
  return (
    <>
      <DashboardPageHeader
        title="Suppliers"
        description="Evaluate suppliers by shipment consistency, product range, destination markets and price position."
      />
      <CompaniesExplorer companies={suppliers} kind="supplier" caption="Illustrative suppliers" />
    </>
  );
}
