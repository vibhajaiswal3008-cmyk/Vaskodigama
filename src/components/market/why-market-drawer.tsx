"use client";

import { CheckCircle2, Bell, Bookmark } from "lucide-react";
import type { Market } from "@/types";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreDial } from "@/components/opportunity/opportunity-score";
import { DemandChart } from "@/components/charts/charts";
import { getCountry } from "@/data/mock/countries";
import { formatDelta } from "@/lib/utils";
import { useToast } from "@/components/shared/toast";

const trendLabel: Record<Market["trend"], string> = {
  rising: "Rising demand",
  steady: "Steady demand",
  falling: "Softening demand",
};

/** "Why this market" drawer — evidence + trend + recommended actions. */
export function WhyMarketDrawer({
  market,
  open,
  onClose,
}: {
  market: Market | null;
  open: boolean;
  onClose: () => void;
}) {
  const { toast } = useToast();
  if (!market) return null;
  const country = getCountry(market.countryCode);

  return (
    <Modal
      open={open}
      onClose={onClose}
      variant="drawer-right"
      title={`${country?.flag ?? ""} ${country?.name ?? market.countryCode}`}
      description={`${trendLabel[market.trend]} · ${formatDelta(market.growth)} illustrative YoY`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => toast({ title: "Market saved", tone: "success" })}>
            <Bookmark className="size-4" aria-hidden /> Save market
          </Button>
        </>
      }
    >
      <div className="flex items-center gap-4">
        <ScoreDial value={market.opportunity.value} />
        <div>
          <p className="text-sm text-muted">Opportunity Score</p>
          <p className="text-2xl font-bold text-navy">
            {market.opportunity.value}
            <span className="text-base font-normal text-muted">/100</span>
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Stat label="Competition" value={market.competitionLevel} />
        <Stat label="Supply" value={market.supplierConcentration} />
        <Stat label="Avg value" value={`$${market.avgValue.toFixed(2)}/kg`} />
      </div>

      <section className="mt-6">
        <h3 className="text-sm font-semibold text-navy">Demand trend</h3>
        <p className="text-xs text-muted">
          Illustrative monthly demand index over the period.
        </p>
        <div className="mt-2">
          <DemandChart
            data={market.demandSeries}
            height={180}
            label={`Illustrative demand trend for ${country?.name}. Trend is ${market.trend}.`}
          />
        </div>
      </section>

      <section className="mt-6">
        <h3 className="text-sm font-semibold text-navy">Why this matters</h3>
        <ul className="mt-2 space-y-2">
          {market.opportunity.rationale.map((r) => (
            <li key={r} className="flex items-start gap-2 text-sm text-muted-strong">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
              {r}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h3 className="text-sm font-semibold text-navy">Recommended next actions</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button variant="subtle" size="sm" onClick={() => toast({ title: "Alert created", tone: "success" })}>
            <Bell className="size-4" aria-hidden /> Track this market
          </Button>
        </div>
      </section>

      <div className="mt-6">
        <Badge tone="warning">Illustrative demo data</Badge>
      </div>
    </Modal>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-surface p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-0.5 text-sm font-semibold capitalize text-navy">{value}</p>
    </div>
  );
}
