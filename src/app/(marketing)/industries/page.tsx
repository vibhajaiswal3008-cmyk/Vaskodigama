import type { Metadata } from "next";
import { Layers, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/ui/misc";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { industries } from "@/components/marketing/sections";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Analytical workspaces for pharmaceuticals, chemicals, food & agriculture, cosmetics, textiles, machinery, electronics and medical devices.",
};

const fields: Record<string, string[]> = {
  pharmaceuticals: ["HS & molecule mapping", "Formulation vs API", "Regulatory-sensitive flows"],
  chemicals: ["Intermediate vs finished", "Hazard considerations", "Bulk vs specialty"],
  "food-agriculture": ["Certifications", "Seasonality", "Packaging detail"],
  cosmetics: ["Active ingredients", "Finished vs bulk", "Claims sensitivity"],
  textiles: ["Fibre → fabric chain", "Greige vs finished", "Composition"],
  machinery: ["Components vs equipment", "Spares", "Capital cycles"],
  electronics: ["Components vs devices", "Assemblies", "Lead times"],
  "medical-devices": ["Class & risk", "Consumables vs capital", "Diagnostics"],
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Different sectors, different questions"
        subtitle="Each industry can need its own analytical fields. Here’s how we think about a few of them."
      />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2">
          {industries.map((ind) => (
            <Card key={ind.id}>
              <CardContent className="pt-5">
                <div className="flex items-center gap-2">
                  <Layers className="size-5 text-primary" aria-hidden />
                  <h2 className="font-semibold text-navy">{ind.name}</h2>
                </div>
                <p className="mt-1 text-sm text-muted">{ind.note}</p>
                <ul className="mt-3 space-y-1.5">
                  {(fields[ind.id] ?? []).map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-strong">
                      <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <ButtonLink href="/demo">Explore the demo</ButtonLink>
        </div>
      </Section>
    </>
  );
}
