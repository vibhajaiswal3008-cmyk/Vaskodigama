"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Bookmark, GitCompareArrows } from "lucide-react";
import type { Company, ShipmentRecord } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCountry } from "@/data/mock/countries";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";

type ToastFn = (t: { title: string; description?: string; tone?: "info" | "success" | "warning" }) => void;

/** Column factory for buyers/suppliers/companies tables. */
export function makeCompanyColumns(
  onView: (c: Company) => void,
  onCompare: (c: Company) => void,
  toast: ToastFn,
  kind: "buyer" | "supplier",
): ColumnDef<Company, unknown>[] {
  return [
    {
      accessorKey: "name",
      header: "Company",
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onView(row.original)}
          className="text-left font-semibold text-primary hover:underline"
        >
          {row.original.name}
        </button>
      ),
    },
    {
      id: "country",
      header: "Country",
      accessorFn: (c) => getCountry(c.countryCode)?.name ?? c.countryCode,
      cell: ({ row }) => (
        <span>
          {getCountry(row.original.countryCode)?.flag}{" "}
          {getCountry(row.original.countryCode)?.name}
          {row.original.subRegion ? (
            <span className="text-muted"> · {row.original.subRegion}</span>
          ) : null}
        </span>
      ),
    },
    {
      accessorKey: "lastActivity",
      header: "Last activity",
      cell: ({ getValue }) => (
        <span className="text-muted">{formatDate(getValue() as string)}</span>
      ),
    },
    {
      accessorKey: "shipmentFrequency",
      header: "Freq./mo",
      cell: ({ getValue }) => formatNumber(getValue() as number),
    },
    kind === "supplier"
      ? {
          id: "range",
          header: "Products",
          accessorFn: (c) => c.productRange?.length ?? 0,
          cell: ({ row }) => (
            <span className="text-muted">
              {row.original.productRange?.slice(0, 2).join(", ") ?? "—"}
            </span>
          ),
        }
      : {
          accessorKey: "supplierCount",
          header: "Suppliers",
          cell: ({ getValue }) => formatNumber((getValue() as number) ?? 0),
        },
    {
      id: "score",
      header: "Score",
      accessorFn: (c) => c.opportunity.value,
      cell: ({ row }) => (
        <Badge tone={row.original.opportunity.value >= 80 ? "success" : "primary"}>
          {row.original.opportunity.value}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            aria-label={`Save ${row.original.name}`}
            onClick={() => toast({ title: "Saved", description: row.original.name, tone: "success" })}
          >
            <Bookmark className="size-4" aria-hidden />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            aria-label={`Compare ${row.original.name}`}
            onClick={() => {
              onCompare(row.original);
              toast({ title: "Added to compare", tone: "success" });
            }}
          >
            <GitCompareArrows className="size-4" aria-hidden />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onView(row.original)}>
            View
          </Button>
        </div>
      ),
    },
  ];
}

/** Column factory for the detailed shipments table. */
export function makeShipmentColumns(): ColumnDef<ShipmentRecord, unknown>[] {
  return [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ getValue }) => formatDate(getValue() as string),
    },
    { accessorKey: "productDescription", header: "Product" },
    { accessorKey: "hsCode", header: "HS code" },
    { accessorKey: "exporter", header: "Exporter" },
    { accessorKey: "importer", header: "Importer" },
    {
      id: "route",
      header: "Route",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {getCountry(row.original.originCountry)?.flag}
          {row.original.originState ? ` ${row.original.originState}` : ""} →{" "}
          {getCountry(row.original.destinationCountry)?.flag}
          {row.original.destinationState ? ` ${row.original.destinationState}` : ""}
        </span>
      ),
    },
    { accessorKey: "port", header: "Port" },
    {
      accessorKey: "quantity",
      header: "Qty",
      cell: ({ row }) => `${formatNumber(row.original.quantity)} ${row.original.unit}`,
    },
    {
      accessorKey: "value",
      header: "Value",
      cell: ({ row }) => formatCurrency(row.original.value, row.original.currency),
    },
    {
      accessorKey: "confidence",
      header: "Confidence",
      cell: ({ getValue }) => {
        const c = getValue() as ShipmentRecord["confidence"];
        return (
          <Badge tone={c === "high" ? "success" : c === "medium" ? "warning" : "danger"} className="capitalize">
            {c}
          </Badge>
        );
      },
    },
  ];
}
