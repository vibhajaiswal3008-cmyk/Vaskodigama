import type { ShipmentColumn, ShipmentRow } from "@/types/analytics";

const COLDEF: Record<ShipmentColumn, string> = {
  date: "Date", hsn: "HSN", product: "Product", qty: "Qty", unit: "Unit",
  rate: "Rate", value: "Value", currency: "Curr", origin: "Origin",
  destination: "Dest", exporter: "Exporter", importer: "Importer",
};

export const SHIPMENT_COLUMNS: ShipmentColumn[] = [
  "date", "hsn", "product", "qty", "unit", "rate", "value",
  "currency", "origin", "destination", "exporter", "importer",
];

export const columnLabel = (c: ShipmentColumn) => COLDEF[c];

/** RFC-4180 cell escaping (commas, quotes, newlines). */
function cell(v: unknown): string {
  const s = v === null || v === undefined ? "" : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

/**
 * Build CSV text for the currently filtered rows and visible columns, in the
 * visible column order. Safe with zero rows (header only). UTF-8 expected.
 */
export function buildCsv(rows: ShipmentRow[], cols: ShipmentColumn[]): string {
  const header = cols.map((c) => cell(COLDEF[c])).join(",");
  const body = rows.map((r) => cols.map((c) => cell(r[c])).join(",")).join("\n");
  return body ? `${header}\n${body}` : header;
}

/** Trigger a client-side download of CSV text, revoking the object URL after. */
export function downloadCsv(text: string, filename: string) {
  const blob = new Blob(["﻿" + text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
