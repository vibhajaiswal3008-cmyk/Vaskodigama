"use client";

import { X } from "lucide-react";
import type { Company } from "@/types";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { getCountry } from "@/data/mock/countries";

/** Side-by-side company comparison drawer. */
export function CompareDrawer({
  companies,
  open,
  onClose,
  onRemove,
}: {
  companies: Company[];
  open: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
}) {
  const rows: { label: string; get: (c: Company) => string }[] = [
    { label: "Role", get: (c) => c.role },
    { label: "Country", get: (c) => getCountry(c.countryCode)?.name ?? c.countryCode },
    { label: "Opportunity Score", get: (c) => `${c.opportunity.value}/100` },
    { label: "Shipment freq.", get: (c) => `${c.shipmentFrequency}/mo` },
    { label: "Product relevance", get: (c) => `${c.productRelevance}%` },
    { label: "Consistency", get: (c) => c.shipmentConsistency ?? "—" },
    { label: "Price position", get: (c) => c.pricePosition?.replace("-", " ") ?? "—" },
    { label: "Suppliers", get: (c) => (c.supplierCount ? String(c.supplierCount) : "—") },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Compare companies"
      description="Side-by-side view of selected companies (illustrative)."
      size="xl"
      footer={
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      }
    >
      {companies.length === 0 ? (
        <p className="text-sm text-muted">
          No companies selected yet. Use “Compare” on a buyer or supplier to add
          them here.
        </p>
      ) : (
        <div className="scroll-x">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr>
                <th scope="col" className="px-3 py-2 text-left text-xs text-muted">
                  Metric
                </th>
                {companies.map((c) => (
                  <th key={c.id} scope="col" className="px-3 py-2 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-navy">{c.name}</span>
                      <button
                        type="button"
                        onClick={() => onRemove(c.id)}
                        aria-label={`Remove ${c.name} from comparison`}
                        className="text-muted hover:text-danger"
                      >
                        <X className="size-4" aria-hidden />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-t border-border">
                  <th scope="row" className="px-3 py-2 text-left font-medium text-muted-strong">
                    {r.label}
                  </th>
                  {companies.map((c) => (
                    <td key={c.id} className="px-3 py-2 capitalize text-navy">
                      {r.get(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
}
