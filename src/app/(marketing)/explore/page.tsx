import type { Metadata } from "next";
import { Section } from "@/components/ui/misc";
import { ExploreWorkspace } from "@/components/search/explore-workspace";
import { tradeData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Explore Trade Data | Search Global Trade Records",
  description:
    "Search illustrative global trade records by product, HS Code, company, buyer, supplier, country and port. Filter, sort, export and share results.",
};

export default async function ExplorePage() {
  // Static export: the full illustrative set is passed to the client, which
  // reads filters from the URL and filters in-browser (shareable searches).
  const records = await tradeData.listExploreRecords();

  return (
    <>
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Explore data
          </p>
          <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
            Search Global Trade Records
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            Start with a product, HS Code, company or trade participant, then
            refine by country, route, date, quantity and value. Switch views,
            export a sample and share the exact search by copying the URL.
          </p>
          <p
            className="mt-4 rounded-md border border-warning/30 bg-warning-soft px-3 py-2 text-sm text-warning"
            role="note"
          >
            Demonstration environment: records shown on this page are fictional
            samples created to illustrate the Vaskodigama interface.
          </p>
        </div>
      </div>

      <Section>
        <ExploreWorkspace records={records} />
      </Section>
    </>
  );
}
