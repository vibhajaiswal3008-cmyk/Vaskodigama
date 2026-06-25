import type { DateRangePreset, SearchQuery } from "@/types";
import { getCountry } from "@/data/mock/countries";

export const dateRangeLabels: Record<DateRangePreset, string> = {
  "30d": "the last 30 days",
  "3m": "the last 3 months",
  "6m": "the last 6 months",
  "12m": "the last 12 months",
  custom: "the selected period",
};

function rangeLabel(range: SearchQuery["dateRange"]): string {
  return dateRangeLabels[range as DateRangePreset] ?? "the selected period";
}

function countryName(code?: string): string | undefined {
  if (!code) return undefined;
  return getCountry(code)?.name ?? code;
}

/**
 * Build a plain-English summary sentence for a query, e.g.
 * "Show imports of natural honey into the UAE from India during the last 12 months."
 * Returns an honest sentence even when fields are missing.
 */
export function buildQuerySummary(q: SearchQuery): string {
  const directionVerb = q.direction === "import" ? "imports" : "exports";
  const subject =
    q.type === "hs-code"
      ? `HS code ${q.hsCode ?? q.term}`
      : q.type === "company"
        ? `company "${q.term}"`
        : q.term || "your selection";

  const origin = countryName(q.originCountry);
  const dest = countryName(q.destinationCountry);

  let route = "";
  if (q.direction === "import") {
    if (dest && origin) route = ` into ${dest} from ${origin}`;
    else if (dest) route = ` into ${dest}`;
    else if (origin) route = ` from ${origin}`;
  } else {
    if (origin && dest) route = ` from ${origin} to ${dest}`;
    else if (origin) route = ` from ${origin}`;
    else if (dest) route = ` to ${dest}`;
  }

  const verb = q.type === "company" ? "Analyse the" : "Show";
  return `${verb} ${directionVerb} of ${subject}${route} during ${rangeLabel(
    q.dateRange,
  )}.`;
}
