import Link from "next/link";
import {
  ArrowUpRight,
  Bell,
  Bookmark,
  Clock,
  FileText,
  TrendingUp,
} from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { TradeSearch } from "@/components/search/trade-search";
import { WhatChanged } from "@/components/monitoring/what-changed";
import { ScoreDial } from "@/components/opportunity/opportunity-score";
import { tradeData } from "@/lib/data";
import { getCountry } from "@/data/mock/countries";
import { formatDelta } from "@/lib/utils";

const recentSearches = [
  { label: "Natural honey → UAE", href: "/dashboard/search?type=product&term=Natural%20honey&origin=IN&dest=AE" },
  { label: "Coffee imports (US)", href: "/dashboard/search?type=product&term=Coffee&dest=US" },
  { label: "HS 3004 → Germany", href: "/dashboard/search?type=hs-code&term=3004&dest=DE" },
];

export default async function DashboardOverview() {
  const [saved, alerts, markets] = await Promise.all([
    tradeData.listSavedItems(),
    tradeData.listAlerts(),
    tradeData.listMarkets(),
  ]);
  const topMarkets = [...markets]
    .sort((a, b) => b.opportunity.value - a.opportunity.value)
    .slice(0, 3);
  const activeAlerts = alerts.filter((a) => a.active);

  return (
    <>
      <DashboardPageHeader
        title="Overview"
        description="Your trade-intelligence workspace. Pick up where you left off or start a new search."
      />

      {/* Quick search */}
      <div className="mb-6">
        <TradeSearch variant="compact" resultPath="/dashboard/search" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Recommended opportunities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle as="h2">Recommended opportunities</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {topMarkets.map((m) => {
              const country = getCountry(m.countryCode);
              return (
                <Link
                  key={m.id}
                  href={`/dashboard/markets?country=${m.countryCode}`}
                  className="rounded-lg border border-border bg-surface p-4 hover:border-primary"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-navy">
                      {country?.flag} {country?.name}
                    </span>
                    <ScoreDial value={m.opportunity.value} size={44} />
                  </div>
                  <p className="mt-2 inline-flex items-center gap-1 text-xs text-success">
                    <TrendingUp className="size-3" aria-hidden />
                    {formatDelta(m.growth)} illustrative
                  </p>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent searches */}
        <Card>
          <CardHeader>
            <CardTitle as="h2">Recent searches</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentSearches.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-navy hover:border-primary"
              >
                <Clock className="size-4 text-muted" aria-hidden />
                {s.label}
                <ArrowUpRight className="ml-auto size-4 text-muted" aria-hidden />
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* What changed */}
        <div className="lg:col-span-2">
          <WhatChanged limit={3} />
        </div>

        <div className="space-y-5">
          {/* Saved items */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle as="h2">Saved</CardTitle>
              <Link href="/dashboard/saved" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {saved.slice(0, 4).map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-surface"
                >
                  <Bookmark className="size-4 text-muted" aria-hidden />
                  <span className="truncate text-navy">{item.label}</span>
                  <Badge tone="neutral" className="ml-auto capitalize">
                    {item.kind}
                  </Badge>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Active alerts */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle as="h2">Active alerts</CardTitle>
              <Link href="/dashboard/alerts" className="text-sm text-primary hover:underline">
                Manage
              </Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {activeAlerts.map((a) => (
                <div key={a.id} className="flex items-center gap-2 text-sm">
                  <Bell className="size-4 text-primary" aria-hidden />
                  <span className="truncate text-navy">{a.name}</span>
                  <Badge tone="neutral" className="ml-auto capitalize">
                    {a.frequency}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Report shortcuts */}
      <Card className="mt-5">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle as="h2">Start a report</CardTitle>
          <FileText className="size-5 text-primary" aria-hidden />
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {["Market-entry report", "Buyer shortlist", "Supplier assessment", "Country comparison"].map((r) => (
            <ButtonLink key={r} href="/dashboard/reports" variant="outline" size="sm">
              {r}
            </ButtonLink>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
