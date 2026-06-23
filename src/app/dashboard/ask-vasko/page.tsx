import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AskVasko } from "@/components/ask-vasko/ask-vasko";

export default function AskVaskoPage() {
  return (
    <>
      <DashboardPageHeader
        title="Ask Vasko"
        description="A demonstration assistant that answers with evidence, confidence and a data date. It does not call an external AI service."
        showIllustrative={false}
      />
      <div className="max-w-3xl">
        <AskVasko />
      </div>
    </>
  );
}
