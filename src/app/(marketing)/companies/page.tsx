import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/ui/misc";
import { Badge } from "@/components/ui/badge";
import { Flag } from "@/components/shared/flag";
import { companies } from "@/data/mock/companies";
import { coverageCountries } from "@/config/coverage";

export const metadata: Metadata = {
  title: "Companies | Illustrative Buyer & Supplier Profiles",
  description:
    "Browse illustrative company profiles — buyers, suppliers and traders — with shipments, products, markets and partners. Demonstration data only.",
};

const countryName = (code: string) =>
  coverageCountries.find((c) => c.code === code)?.name ?? code;

const roleLabel = (role: string) =>
  role === "buyer" ? "Buyer" : role === "supplier" ? "Supplier" : "Buyer & supplier";

export default function CompaniesIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Companies"
        title="Explore company profiles"
        subtitle="Study illustrative buyers, suppliers and traders through their visible shipment activity — products, markets and trading partners."
      />

      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((c) => (
            <Link
              key={c.id}
              href={`/companies/${c.id}`}
              className="tile-glow group flex flex-col rounded-xl border border-border bg-background p-5 shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-sm font-bold text-primary-soft-foreground">
                  {c.name.slice(0, 2).toUpperCase()}
                </span>
                <ArrowUpRight className="size-4 text-muted transition-colors group-hover:text-primary" aria-hidden />
              </div>
              <h2 className="mt-3 font-semibold text-navy">{c.name}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                <Flag code={c.countryCode} className="h-3 w-4" />
                {countryName(c.countryCode)}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge tone="primary">{roleLabel(c.role)}</Badge>
                {c.destinationMarkets && c.destinationMarkets.length > 0 ? (
                  <Badge tone="neutral">{c.destinationMarkets.length} markets</Badge>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-8 text-xs text-muted">
          Illustrative demonstration profiles. Company names and figures are
          fictional and are not real customs data.
        </p>
      </Section>
    </>
  );
}
