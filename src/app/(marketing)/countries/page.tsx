import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { CountriesExplorer } from "@/components/marketing/countries-explorer";
import { tradeData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Country Coverage | Trade Intelligence Across 40 Markets",
  description:
    "Explore demonstration import and export activity across 40 markets with consistent country-level views in Vaskodigama.",
};

export default async function CountriesPage() {
  const countries = await tradeData.listCoverage();

  return (
    <>
      <PageHero
        eyebrow="Country coverage"
        title="Explore Trade Intelligence by Country"
        subtitle="Review demonstration import and export activity across 40 markets using consistent country-level views. Coverage can be updated centrally as Vaskodigama expands."
      >
        <ButtonLink href="/explore">Search global trade</ButtonLink>
      </PageHero>

      <Section>
        <CountriesExplorer countries={countries} />
        <p className="mt-8 text-xs text-muted">
          Demonstration coverage. Figures shown are illustrative and generated
          for the demo — they are not real customs values.
        </p>
      </Section>
    </>
  );
}
