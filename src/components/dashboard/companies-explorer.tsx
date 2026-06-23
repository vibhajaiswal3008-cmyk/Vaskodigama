"use client";

import * as React from "react";
import { GitCompareArrows } from "lucide-react";
import type { Company } from "@/types";
import { DataTable } from "@/components/tables/data-table";
import { makeCompanyColumns } from "@/components/tables/columns";
import { Button } from "@/components/ui/button";
import { WhyCompanyDrawer } from "@/components/company/why-company-drawer";
import { CompareDrawer } from "@/components/compare/compare-drawer";
import { useToast } from "@/components/shared/toast";

/** Client explorer for buyers / suppliers / companies with drawers + compare. */
export function CompaniesExplorer({
  companies,
  kind,
  caption,
}: {
  companies: Company[];
  kind: "buyer" | "supplier";
  caption: string;
}) {
  const { toast } = useToast();
  const [view, setView] = React.useState<Company | null>(null);
  const [compareList, setCompareList] = React.useState<Company[]>([]);
  const [compareOpen, setCompareOpen] = React.useState(false);

  const addCompare = React.useCallback(
    (c: Company) =>
      setCompareList((prev) =>
        prev.find((x) => x.id === c.id) ? prev : [...prev, c].slice(0, 4),
      ),
    [],
  );

  const columns = React.useMemo(
    () => makeCompanyColumns(setView, addCompare, toast, kind),
    [addCompare, toast, kind],
  );

  return (
    <div>
      {compareList.length > 0 ? (
        <div className="mb-3">
          <Button variant="outline" size="sm" onClick={() => setCompareOpen(true)}>
            <GitCompareArrows className="size-4" aria-hidden /> Compare ({compareList.length})
          </Button>
        </div>
      ) : null}

      <DataTable
        columns={columns}
        data={companies}
        caption={caption}
        searchPlaceholder={`Filter ${kind === "buyer" ? "buyers" : "suppliers"}…`}
        pageSize={10}
      />

      <WhyCompanyDrawer
        company={view}
        open={!!view}
        onClose={() => setView(null)}
        onCompare={addCompare}
      />
      <CompareDrawer
        companies={compareList}
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
        onRemove={(id) => setCompareList((p) => p.filter((c) => c.id !== id))}
      />
    </div>
  );
}
