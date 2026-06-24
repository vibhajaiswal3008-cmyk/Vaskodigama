import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/misc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { IllustrativeBadge } from "@/components/shared/illustrative";
import { DemandChart } from "@/components/charts/charts";
import { coverageCountries } from "@/config/coverage";
import { buildCountryDetail } from "@/lib/country-detail";
import { formatCompact, formatCurrency, formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return coverageCountries.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const detail = buildCountryDetail(slug);
  if (!detail) return { title: "Country not found" };
  return {
    title: `${detail.country.name} | Trade Intelligence`,
    description: `Demonstration import and export activity for ${detail.country.name} — trends, top products, HS codes, partners and recent records.`,
  };
}

function ValueList({
  rows,
  max,
}: {
  rows: { key: string; label: string; sub?: string; value: number }[];
  max: number;
}) {
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.key}>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate text-navy">{r.label}</span>
            <span className="shrink-0 tabular-nums text-muted">
              {formatCurrency(r.value)}
            </span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2" aria-hidden>
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${Math.max(4, Math.round((r.value / max) * 100))}%` }}
            />
          </div>
          {r.sub ? <span className="sr-only">{r.sub}</span> : null}
        </li>
      ))}
    </ul>
  );
}

export default async function CountryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = buildCountryDetail(slug);
  if (!detail) notFound();

  const { country } = detail;
  const originMax = Math.max(...detail.topOrigins.map((o) => o.value), 1);
  const destMax = Math.max(...detail.topDestinations.map((o) => o.value), 1);
  const buyerMax = Math.max(...detail.leadingBuyers.map((o) => o.value), 1);
  const supplierMax = Math.max(...detail.leadingSuppliers.map((o) => o.value), 1);

  const kpis = [
    { label: "Demonstration records", value: formatCompact(country.summary.recordCount) },
    { label: "Import value", value: formatCurrency(country.summary.importValue) },
    { label: "Export value", value: country.summary.exportValue ? formatCurrency(country.summary.exportValue) : "—" },
    { label: "Top product group", value: country.summary.topProductGroup },
  ];

  return (
    <>
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <Link
            href="/countries"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <ArrowLeft className="size-4" aria-hidden />
            All countries
          </Link>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl leading-none" aria-hidden>
                {country.flag}
              </span>
              <div>
                <h1 className="text-3xl font-bold text-navy sm:text-4xl">
                  {country.name}
                </h1>
                <p className="mt-1 text-muted">
                  {country.region} · {country.code} · latest {country.summary.latestPeriod}
                </p>
              </div>
            </div>
            <IllustrativeBadge />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {country.hasImportData ? <Badge tone="primary">Import data</Badge> : null}
            {country.hasExportData ? (
              <Badge tone="success">Export data</Badge>
            ) : (
              <Badge tone="outline">Export: coming soon</Badge>
            )}
          </div>
        </div>
      </div>

      <Section>
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-[14px] border border-border bg-background p-4 shadow-xs">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">{k.label}</p>
              <p className="mt-1.5 text-lg font-semibold text-navy">{k.value}</p>
            </div>
          ))}
        </div>

        {/* Trend + products */}
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle as="h2" className="text-base">Trade-value trend</CardTitle>
              <p className="mt-1 text-sm text-muted">
                Illustrative monthly trade value for {country.name}.
              </p>
            </CardHeader>
            <CardContent>
              <DemandChart
                data={detail.trend}
                label={`Illustrative monthly trade value for ${country.name}`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle as="h2" className="text-base">Top products</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 text-sm">
                {detail.topProducts.map((p) => (
                  <li key={p.hsCode} className="flex items-center justify-between gap-3">
                    <span className="truncate text-navy">{p.name}</span>
                    <span className="shrink-0 tabular-nums text-muted">{formatCurrency(p.value)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* HS codes + origins + destinations */}
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle as="h2" className="text-base">Top HS codes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 text-sm">
                {detail.topHsCodes.map((h) => (
                  <li key={h.code} className="flex items-center justify-between gap-3">
                    <span className="text-navy">
                      <span className="font-medium tabular-nums">{h.code}</span>{" "}
                      <span className="text-muted">{h.description}</span>
                    </span>
                    <span className="shrink-0 tabular-nums text-muted">{h.share}%</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle as="h2" className="text-base">Top origin countries</CardTitle>
            </CardHeader>
            <CardContent>
              <ValueList
                max={originMax}
                rows={detail.topOrigins.map((o) => ({
                  key: o.code,
                  label: `${o.flag} ${o.name}`,
                  value: o.value,
                }))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle as="h2" className="text-base">Top destination countries</CardTitle>
            </CardHeader>
            <CardContent>
              <ValueList
                max={destMax}
                rows={detail.topDestinations.map((o) => ({
                  key: o.code,
                  label: `${o.flag} ${o.name}`,
                  value: o.value,
                }))}
              />
            </CardContent>
          </Card>
        </div>

        {/* Buyers + suppliers */}
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle as="h2" className="text-base">Leading buyers</CardTitle>
            </CardHeader>
            <CardContent>
              <ValueList
                max={buyerMax}
                rows={detail.leadingBuyers.map((b, i) => ({
                  key: `${b.name}-${i}`,
                  label: b.name,
                  value: b.value,
                }))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle as="h2" className="text-base">Leading suppliers</CardTitle>
            </CardHeader>
            <CardContent>
              <ValueList
                max={supplierMax}
                rows={detail.leadingSuppliers.map((s, i) => ({
                  key: `${s.name}-${i}`,
                  label: s.name,
                  value: s.value,
                }))}
              />
            </CardContent>
          </Card>
        </div>

        {/* Recent records */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle as="h2" className="text-base">Recent demonstration records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="scroll-x">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Recent illustrative trade records for {country.name}
                </caption>
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                    <th scope="col" className="py-2 pr-3 font-medium">Date</th>
                    <th scope="col" className="py-2 pr-3 font-medium">Product</th>
                    <th scope="col" className="py-2 pr-3 font-medium">HS</th>
                    <th scope="col" className="py-2 pr-3 font-medium">Counterparty</th>
                    <th scope="col" className="py-2 pr-3 font-medium">Flow</th>
                    <th scope="col" className="py-2 text-right font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.recentRecords.map((r, i) => (
                    <tr key={i} className="border-b border-border/60 last:border-0">
                      <td className="py-2.5 pr-3 whitespace-nowrap text-muted">{formatDate(r.date)}</td>
                      <td className="py-2.5 pr-3 text-navy">{r.product}</td>
                      <td className="py-2.5 pr-3 tabular-nums text-muted">{r.hsCode}</td>
                      <td className="py-2.5 pr-3 text-muted">{r.counterparty}</td>
                      <td className="py-2.5 pr-3">
                        <Badge tone={r.flow === "Import" ? "primary" : "neutral"}>{r.flow}</Badge>
                      </td>
                      <td className="py-2.5 text-right tabular-nums text-navy">{formatCurrency(r.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="mt-8 flex flex-wrap items-center gap-3 rounded-[20px] border border-border bg-surface p-6">
          <div className="grow">
            <h2 className="text-lg font-semibold text-navy">
              Search {country.name} in the Explore workspace
            </h2>
            <p className="mt-1 text-sm text-muted">
              Filter demonstration records by product, HS code, participant and trade flow.
            </p>
          </div>
          <ButtonLink href={`/explore?destination=${country.code}`}>
            Search {country.name}
          </ButtonLink>
          <ButtonLink href="/contact" variant="outline">
            Request a demo
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
