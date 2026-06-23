import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ReportBuilder } from "@/components/reports/report-builder";
import { tradeData } from "@/lib/data";

export default async function ReportsPage() {
  const [companies, markets] = await Promise.all([
    tradeData.listCompanies(),
    tradeData.listMarkets(),
  ]);
  return (
    <>
      <DashboardPageHeader
        title="Reports"
        description="Assemble an illustrative report — choose a type, pick markets and companies, preview, print or download."
        showIllustrative={false}
      />
      <ReportBuilder companies={companies} markets={markets} />
    </>
  );
}
