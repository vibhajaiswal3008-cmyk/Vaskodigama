/**
 * Small, generic CSV helpers for client-side export of illustrative table data.
 * No dependencies; RFC-4180 quoting; UTF-8 BOM for spreadsheet compatibility.
 */

/** Escape one cell (handles commas, quotes and newlines). */
function cell(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

/**
 * Build CSV text from rows. `columns` defines the header label and how to read
 * each cell from a row, in display order. Safe with zero rows (header only).
 */
export function toCsv<T>(
  rows: T[],
  columns: { header: string; get: (row: T) => unknown }[],
): string {
  const head = columns.map((c) => cell(c.header)).join(",");
  const body = rows
    .map((row) => columns.map((c) => cell(c.get(row))).join(","))
    .join("\n");
  return body ? `${head}\n${body}` : head;
}

/** Trigger a browser download of CSV text, revoking the object URL after. */
export function downloadCsv(text: string, filename: string): void {
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
