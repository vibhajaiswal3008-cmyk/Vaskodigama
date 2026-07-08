import type { DateRangePreset, SearchQuery, SearchType, TradeDirection } from "@/types";

/** Serialize a SearchQuery into URL search params (for shareable results). */
export function queryToParams(q: SearchQuery): URLSearchParams {
  const p = new URLSearchParams();
  p.set("type", q.type);
  if (q.term) p.set("term", q.term);
  if (q.hsCode) p.set("hs", q.hsCode);
  p.set("dir", q.direction);
  if (q.originCountry) p.set("origin", q.originCountry);
  if (q.destinationCountry) p.set("dest", q.destinationCountry);
  p.set("range", String(q.dateRange));
  return p;
}

const SEARCH_TYPES: SearchType[] = ["product", "hs-code", "company", "country"];
const DIRECTIONS: TradeDirection[] = ["import", "export"];
const RANGES: DateRangePreset[] = ["30d", "3m", "6m", "12m", "custom"];

/** Parse URL search params back into a SearchQuery (with safe defaults). */
export function paramsToQuery(
  params: URLSearchParams | Record<string, string | string[] | undefined>,
): SearchQuery {
  const get = (k: string): string | undefined => {
    if (params instanceof URLSearchParams) return params.get(k) ?? undefined;
    const v = params[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const type = (SEARCH_TYPES.includes(get("type") as SearchType)
    ? get("type")
    : "product") as SearchType;
  const direction = (DIRECTIONS.includes(get("dir") as TradeDirection)
    ? get("dir")
    : "import") as TradeDirection;
  const range = (RANGES.includes(get("range") as DateRangePreset)
    ? get("range")
    : "12m") as DateRangePreset;

  return {
    type,
    // "term" is this project's convention; "query"/"product" are accepted as
    // aliases so a hand-built URL (e.g. ?query=paracetamol) still works.
    term: get("term") ?? get("query") ?? get("product") ?? "",
    hsCode: get("hs"),
    direction,
    originCountry: get("origin"),
    destinationCountry: get("dest"),
    dateRange: range,
  };
}

export const emptyQuery: SearchQuery = {
  type: "product",
  term: "",
  direction: "import",
  dateRange: "12m",
};
