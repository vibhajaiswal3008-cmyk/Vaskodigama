"use client";

import * as React from "react";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import type { Market } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreDial } from "@/components/opportunity/opportunity-score";
import { WhyMarketDrawer } from "@/components/market/why-market-drawer";
import { getCountry } from "@/data/mock/countries";
import { formatDelta } from "@/lib/utils";

function trendBadge(trend: Market["trend"]) {
  if (trend === "rising")
    return <Badge tone="success"><TrendingUp className="size-3" aria-hidden /> Rising</Badge>;
  if (trend === "falling")
    return <Badge tone="danger"><TrendingDown className="size-3" aria-hidden /> Falling</Badge>;
  return <Badge tone="neutral"><Minus className="size-3" aria-hidden /> Steady</Badge>;
}

export function MarketsExplorer({ markets }: { markets: Market[] }) {
  const [active, setActive] = React.useState<Market | null>(null);
  const sorted = [...markets].sort((a, b) => b.opportunity.value - a.opportunity.value);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((m) => {
          const country = getCountry(m.countryCode);
          return (
            <Card key={m.id}>
              <CardContent className="pt-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-navy">
                      {country?.flag} {country?.name}
                    </h3>
                    <p className="text-sm text-muted">
                      {formatDelta(m.growth)} illustrative YoY
                    </p>
                  </div>
                  <ScoreDial value={m.opportunity.value} size={52} />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  {trendBadge(m.trend)}
                  <span className="text-xs capitalize text-muted">
                    {m.competitionLevel} competition
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => setActive(m)}
                >
                  Why this market
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <WhyMarketDrawer market={active} open={!!active} onClose={() => setActive(null)} />
    </div>
  );
}
