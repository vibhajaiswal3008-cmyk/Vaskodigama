import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Boxes, Building2, Globe2, Wallet } from "lucide-react";
import { Section } from "@/components/ui/misc";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Flag } from "@/components/shared/flag";
import { IllustrativeBadge } from "@/components/shared/illustrative";
import { CompanyProfileTabs } from "@/components/company/company-profile-tabs";
import { companies, getCompany } from "@/data/mock/companies";
import { shipments as allShipments } from "@/data/mock/shipments";
import { coverageCountries } from "@/config/coverage";
import { formatCompact, formatDate } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return companies.map((c) => ({ id: c.id }));
}

const countryName = (code: string) =>
  coverageCountries.find((c) => c.code === code)?.name ?? code;

const roleLabel = (role: string) =>
  role === "buyer" ? "Buyer" : role === "supplier" ? "Supplier" : "Buyer & supplier";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const company = getCompany(id);
  if (!company) return { title: "Company" };
  return {
    title: `${company.name} | Company Profile`,
    description: `Illustrative trade profile for ${company.name} — shipments, products, markets and partners. Demonstration data only.`,
  };
}

export default async function CompanyProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = getCompany(id);
  if (!company) notFound();

  const shipments = allShipments.filter(
    (s) => s.exporter === company.name || s.importer === company.name,
  );
  const totalValue = shipments.reduce((a, s) => a + s.value, 0);
  const partners = new Set(
    shipments.map((s) => (s.exporter === company.name ? s.importer : s.exporter)),
  ).size;
  const markets = new Set(
    shipments.map((s) => (s.exporter === company.name ? s.destinationCountry : s.originCountry)),
  );
  const marketCount = markets.size || (company.destinationMarkets?.length ?? 0);

  const kpis = [
    { icon: Boxes, label: "Shipments", value: String(shipments.length) },
    { icon: Wallet, label: "Trade value", value: `$${formatCompact(totalValue)}` },
    { icon: Building2, label: "Trade partners", value: String(partners) },
    { icon: Globe2, label: "Markets", value: String(marketCount) },
  ];

  return (
    <>
      {/* Profile header */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
          <Link
            href="/companies"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <ArrowLeft className="size-4" aria-hidden />
            All companies
          </Link>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-xl font-bold text-primary-soft-foreground">
                {company.name.slice(0, 2).toUpperCase()}
              </span>
              <div>
                <h1 className="text-2xl font-bold text-navy sm:text-3xl">{company.name}</h1>
                <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Flag code={company.countryCode} className="h-3.5 w-5" />
                    {countryName(company.countryCode)}
                    {company.subRegion ? `, ${company.subRegion}` : ""}
                  </span>
                  <Badge tone="primary">{roleLabel(company.role)}</Badge>
                  <span>Last activity {formatDate(company.lastActivity)}</span>
                </p>
                {company.productRange && company.productRange.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {company.productRange.map((p) => (
                      <span key={p} className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-muted-strong">
                        {p}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
            <IllustrativeBadge />
          </div>
        </div>
      </div>

      <Section className="py-8 sm:py-10">
        {/* Summary metrics */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis.map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 shadow-xs">
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

        <div className="mt-6">
          <CompanyProfileTabs company={company} shipments={shipments} />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4">
          <p className="text-sm text-muted">
            Illustrative demonstration profile — figures are not real customs values.
          </p>
          <ButtonLink href={`/explore?mode=company&q=${encodeURIComponent(company.name)}`} variant="outline" size="sm">
            View in Explore
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
