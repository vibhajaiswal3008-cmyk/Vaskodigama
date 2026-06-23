"use client";

import { CheckCircle2, GitCompareArrows, Bell, Bookmark, FileText } from "lucide-react";
import type { Company } from "@/types";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreDial } from "@/components/opportunity/opportunity-score";
import { CompanyTimeline } from "@/components/company/company-timeline";
import { getCountry } from "@/data/mock/countries";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/shared/toast";

/** "Why this company" drawer — evidence + recommended actions. */
export function WhyCompanyDrawer({
  company,
  open,
  onClose,
  onCompare,
}: {
  company: Company | null;
  open: boolean;
  onClose: () => void;
  onCompare?: (c: Company) => void;
}) {
  const { toast } = useToast();
  if (!company) return null;
  const country = getCountry(company.countryCode);

  return (
    <Modal
      open={open}
      onClose={onClose}
      variant="drawer-right"
      title={company.name}
      description={`${company.role === "both" ? "Buyer & supplier" : company.role} · ${country?.name ?? company.countryCode}${company.subRegion ? `, ${company.subRegion}` : ""}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          {onCompare ? (
            <Button
              variant="outline"
              onClick={() => {
                onCompare(company);
                toast({ title: "Added to compare", tone: "success" });
              }}
            >
              <GitCompareArrows className="size-4" aria-hidden /> Compare
            </Button>
          ) : null}
          <Button
            onClick={() => toast({ title: "Company saved", description: "Added to your saved items (demo).", tone: "success" })}
          >
            <Bookmark className="size-4" aria-hidden /> Save company
          </Button>
        </>
      }
    >
      <div className="flex items-center gap-4">
        <ScoreDial value={company.opportunity.value} />
        <div>
          <p className="text-sm text-muted">Opportunity Score</p>
          <p className="text-2xl font-bold text-navy">
            {company.opportunity.value}
            <span className="text-base font-normal text-muted">/100</span>
          </p>
          <p className="text-xs text-muted">Last activity {formatDate(company.lastActivity)}</p>
        </div>
      </div>

      <section className="mt-6">
        <h3 className="text-sm font-semibold text-navy">Why this matters</h3>
        <ul className="mt-2 space-y-2">
          {company.opportunity.rationale.map((r) => (
            <li key={r} className="flex items-start gap-2 text-sm text-muted-strong">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
              {r}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3">
        <Stat label="Shipment frequency" value={`${company.shipmentFrequency}/mo`} />
        <Stat label="Product relevance" value={`${company.productRelevance}%`} />
        {company.supplierCount ? (
          <Stat label="Supplier base" value={String(company.supplierCount)} />
        ) : null}
        {company.pricePosition ? (
          <Stat label="Price position" value={company.pricePosition.replace("-", " ")} />
        ) : null}
        {company.shipmentConsistency ? (
          <Stat label="Consistency" value={company.shipmentConsistency} />
        ) : null}
        {company.destinationMarkets?.length ? (
          <Stat
            label="Destination markets"
            value={company.destinationMarkets
              .map((c) => getCountry(c)?.flag ?? c)
              .join(" ")}
          />
        ) : null}
      </section>

      {company.timeline?.length ? (
        <section className="mt-6">
          <h3 className="text-sm font-semibold text-navy">Company X-Ray timeline</h3>
          <div className="mt-2">
            <CompanyTimeline events={company.timeline} />
          </div>
        </section>
      ) : null}

      <section className="mt-6">
        <h3 className="text-sm font-semibold text-navy">Recommended next actions</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button variant="subtle" size="sm" onClick={() => toast({ title: "Alert created", tone: "success" })}>
            <Bell className="size-4" aria-hidden /> Create an alert
          </Button>
          <Button variant="subtle" size="sm" onClick={() => toast({ title: "Added to report", tone: "success" })}>
            <FileText className="size-4" aria-hidden /> Add to a report
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
