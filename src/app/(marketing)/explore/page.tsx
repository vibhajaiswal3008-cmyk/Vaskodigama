import type { Metadata } from "next";
import { Database, Globe2, Wallet, ArrowLeftRight } from "lucide-react";
import { Section } from "@/components/ui/misc";
import { ExploreWorkspace } from "@/components/search/explore-workspace";
import { tradeData } from "@/lib/data";
import { formatCompact, formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Explore Trade Data | Search Global Trade Records",
  description:
    "Search illustrative global trade records by product, HS Code, company, buyer, supplier, country and port. Filter, sort, export and share results.",
};

export default async function ExplorePage() {
  // Static export: the full illustrative set is passed to the client, which
  // reads filters from the URL and filters in-browser (shareable searches).
  const records = await tradeData.listExploreRecords();

  const totalValue = records.reduce((a, r) => a + r.tradeValue, 0);
  const countries = new Set(
    records.flatMap((r) => [r.originCountry, r.destinationCountry]),
  ).size;
  const imports = records.filter((r) => r.tradeFlow === "Import").length;
  const kpis = [
    { icon: Database, label: "Sample records", value: formatNumber(records.length) },
    { icon: Wallet, label: "Total trade value", value: `$${formatCompact(totalValue)}` },
    { icon: Globe2, label: "Markets involved", value: String(countries) },
    {
      icon: ArrowLeftRight,
      label: "Import / export",
      value: `${imports} / ${records.length - imports}`,
    },
  ];

  return (
    <>
      {/* Bold header */}
      <div className="surface-aurora relative overflow-hidden">
        <div className="bg-route-grid absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-14 sm:px-6 sm:pt-16">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/85">
            Explore data
          </span>
          <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            Search global trade records
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75">
            Start with a product, HS Code, company or trade participant, then
            refine by country, route, date, quantity and value. Switch views,
            export a sample, and share the exact search by copying the URL.
          </p>
          <p
            className="mt-5 inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/85"
            role="note"
          >
            <span className="size-1.5 rounded-full bg-warning" aria-hidden />
            Demonstration environment — records are fictional samples that
            illustrate the Vaskodigama interface.
          </p>
        </div>
      </div>

      {/* KPI band overlapping the header */}
      <div className="relative z-10 mx-auto -mt-12 w-full max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-lg lg:grid-cols-4">
          {kpis.map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="flex items-center gap-3 bg-background p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span>
                  <span className="block text-lg font-bold tabular-nums text-navy">{k.value}</span>
                  <span className="block text-xs text-muted">{k.label}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <Section className="pt-10">
        <ExploreWorkspace records={records} />
      </Section>
    </>
  );
}
