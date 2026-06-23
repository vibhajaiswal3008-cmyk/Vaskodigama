import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/ui/misc";
import { DataQualityPanel } from "@/components/shared/data-quality";
import { Card, CardContent } from "@/components/ui/card";
import { tradeData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Data transparency",
  description:
    "Know what stands behind every insight: coverage, completeness, confidence, estimated vs observed values, and honest limitations.",
};

const principles = [
  { title: "Estimated vs observed", body: "We distinguish directly observed values from estimates, and label estimates clearly." },
  { title: "Completeness, not perfection", body: "Coverage is never 100%. We show a completeness estimate instead of claiming totality." },
  { title: "Confidence on every view", body: "A confidence indicator travels with the data so you can weigh it." },
  { title: "Contact verification status", body: "Where contact intelligence exists, its verification status is shown — never assumed." },
];

export default async function DataPage() {
  const q = await tradeData.getDataQuality();
  return (
    <>
      <PageHero
        eyebrow="Data transparency"
        title="Know what stands behind every insight"
        subtitle="We’d rather be honest about limitations than overstate accuracy. Here’s how we present data."
      />
      <Section>
        <div className="grid items-start gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-navy">Our principles</h2>
            <div className="mt-5 grid gap-3">
              {principles.map((p) => (
                <Card key={p.title}>
                  <CardContent className="pt-5">
                    <h3 className="font-semibold text-navy">{p.title}</h3>
                    <p className="mt-1 text-sm text-muted">{p.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-navy">Example transparency panel</h2>
            <p className="mt-2 text-sm text-muted">
              This is what appears alongside results in the application.
            </p>
            <div className="mt-4">
              <DataQualityPanel q={q} />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
