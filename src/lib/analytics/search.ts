import type { AnalyticsData, SearchHit } from "@/types/analytics";

/**
 * Global search across the analytics dataset — products, HSN chapters,
 * exporters, importers, origin and destination countries. Returns grouped,
 * ranked hits that map to the relevant dashboard tab.
 */
export function searchAnalytics(data: AnalyticsData, query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits: SearchHit[] = [];

  for (const p of data.products) {
    if (p.name.toLowerCase().includes(q) || p.hsn.includes(q)) {
      hits.push({ type: "product", label: p.name, detail: `HSN ${p.hsn}`, tab: "products" });
    }
  }
  for (const h of data.hsn) {
    if (h.name.toLowerCase().includes(q)) {
      hits.push({ type: "hsn", label: h.name, detail: "HSN chapter", tab: "products" });
    }
  }
  for (const e of data.exporters) {
    if (e.name.toLowerCase().includes(q) || e.country.toLowerCase().includes(q)) {
      hits.push({ type: "exporter", label: e.name, detail: e.country, tab: "exporters" });
    }
  }
  for (const im of data.importers) {
    if (im.name.toLowerCase().includes(q) || im.country.toLowerCase().includes(q)) {
      hits.push({ type: "importer", label: im.name, detail: im.country, tab: "importers" });
    }
  }
  for (const o of data.origins) {
    if (o.name.toLowerCase().includes(q)) {
      hits.push({ type: "origin", label: o.name, detail: "Origin country", tab: "origin" });
    }
  }
  for (const d of data.destinations) {
    if (d.name.toLowerCase().includes(q)) {
      hits.push({ type: "destination", label: d.name, detail: "Destination country", tab: "destination" });
    }
  }

  return hits.slice(0, 12);
}
