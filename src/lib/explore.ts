/**
 * Pure helpers for the Explore workspace: URL <-> params, and filtering /
 * sorting illustrative records. Kept framework-free so both the server page
 * and the client workspace can share them.
 */
import type {
  ExploreMode,
  ExploreParams,
  ExploreRecord,
  ExploreSort,
  TradeFlow,
} from "@/types/explore";

export const EXPLORE_PAGE_SIZE = 12;

export const EXPLORE_MODES: { id: ExploreMode; label: string }[] = [
  { id: "product", label: "Product" },
  { id: "hs-code", label: "HS Code" },
  { id: "company", label: "Company" },
  { id: "buyer", label: "Buyer" },
  { id: "supplier", label: "Supplier" },
  { id: "importer", label: "Importer" },
  { id: "exporter", label: "Exporter" },
];

export const EXPLORE_SORTS: { id: ExploreSort; label: string }[] = [
  { id: "date-desc", label: "Newest first" },
  { id: "date-asc", label: "Oldest first" },
  { id: "value-desc", label: "Highest value" },
  { id: "value-asc", label: "Lowest value" },
  { id: "quantity-desc", label: "Highest quantity" },
];

export const EMPTY_PARAMS: ExploreParams = {
  mode: "product",
  q: "",
  hsCode: "",
  origin: "",
  destination: "",
  flow: "all",
  port: "",
  dateFrom: "",
  dateTo: "",
  minQty: "",
  maxQty: "",
  minValue: "",
  maxValue: "",
  sort: "date-desc",
  page: 1,
};

type RawParams = Record<string, string | string[] | undefined>;

function str(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

const MODE_VALUES = new Set<ExploreMode>([
  "product", "hs-code", "company", "buyer", "supplier", "importer", "exporter",
]);
const SORT_VALUES = new Set<ExploreSort>([
  "date-desc", "date-asc", "value-desc", "value-asc", "quantity-desc",
]);

/** Read params from a Next.js searchParams object (URL is the source of truth). */
export function parseExploreParams(raw: RawParams): ExploreParams {
  const mode = str(raw.mode) as ExploreMode;
  const sort = str(raw.sort) as ExploreSort;
  const flow = str(raw.flow);
  const page = parseInt(str(raw.page), 10);
  return {
    ...EMPTY_PARAMS,
    mode: MODE_VALUES.has(mode) ? mode : "product",
    q: str(raw.q),
    hsCode: str(raw.hs),
    origin: str(raw.origin),
    destination: str(raw.destination),
    flow: flow === "Import" || flow === "Export" ? (flow as TradeFlow) : "all",
    port: str(raw.port),
    dateFrom: str(raw.from),
    dateTo: str(raw.to),
    minQty: str(raw.minQty),
    maxQty: str(raw.maxQty),
    minValue: str(raw.minValue),
    maxValue: str(raw.maxValue),
    sort: SORT_VALUES.has(sort) ? sort : "date-desc",
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

/** Serialize params to a query string, omitting defaults to keep URLs clean. */
export function serializeExploreParams(p: ExploreParams): string {
  const sp = new URLSearchParams();
  if (p.mode !== "product") sp.set("mode", p.mode);
  if (p.q) sp.set("q", p.q);
  if (p.hsCode) sp.set("hs", p.hsCode);
  if (p.origin) sp.set("origin", p.origin);
  if (p.destination) sp.set("destination", p.destination);
  if (p.flow !== "all") sp.set("flow", p.flow);
  if (p.port) sp.set("port", p.port);
  if (p.dateFrom) sp.set("from", p.dateFrom);
  if (p.dateTo) sp.set("to", p.dateTo);
  if (p.minQty) sp.set("minQty", p.minQty);
  if (p.maxQty) sp.set("maxQty", p.maxQty);
  if (p.minValue) sp.set("minValue", p.minValue);
  if (p.maxValue) sp.set("maxValue", p.maxValue);
  if (p.sort !== "date-desc") sp.set("sort", p.sort);
  if (p.page > 1) sp.set("page", String(p.page));
  return sp.toString();
}

function num(v: string): number | null {
  if (!v.trim()) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Apply the mode-scoped term to a record. */
function matchesTerm(rec: ExploreRecord, mode: ExploreMode, q: string): boolean {
  if (!q) return true;
  const t = q.toLowerCase();
  switch (mode) {
    case "hs-code":
      return rec.hsCode.toLowerCase().includes(t.replace(/\s/g, ""));
    case "buyer":
      return rec.buyer.toLowerCase().includes(t);
    case "supplier":
      return rec.supplier.toLowerCase().includes(t);
    case "importer":
      return rec.importer.toLowerCase().includes(t);
    case "exporter":
      return rec.exporter.toLowerCase().includes(t);
    case "company":
      return (
        rec.importer.toLowerCase().includes(t) ||
        rec.exporter.toLowerCase().includes(t) ||
        rec.buyer.toLowerCase().includes(t) ||
        rec.supplier.toLowerCase().includes(t)
      );
    case "product":
    default:
      return (
        rec.productDescription.toLowerCase().includes(t) ||
        rec.hsCode.toLowerCase().includes(t.replace(/\s/g, ""))
      );
  }
}

/** Filter + sort the illustrative records for a query. */
export function filterExploreRecords(
  records: ExploreRecord[],
  p: ExploreParams,
): ExploreRecord[] {
  const minQty = num(p.minQty);
  const maxQty = num(p.maxQty);
  const minValue = num(p.minValue);
  const maxValue = num(p.maxValue);
  const hs = p.hsCode.replace(/\s/g, "");
  const portTerm = p.port.toLowerCase();

  const out = records.filter((rec) => {
    if (!matchesTerm(rec, p.mode, p.q)) return false;
    if (hs && !rec.hsCode.startsWith(hs)) return false;
    if (p.origin && rec.originCountry !== p.origin) return false;
    if (p.destination && rec.destinationCountry !== p.destination) return false;
    if (p.flow !== "all" && rec.tradeFlow !== p.flow) return false;
    if (
      portTerm &&
      !rec.originPort.toLowerCase().includes(portTerm) &&
      !rec.destinationPort.toLowerCase().includes(portTerm)
    )
      return false;
    if (p.dateFrom && rec.date < p.dateFrom) return false;
    if (p.dateTo && rec.date > p.dateTo) return false;
    if (minQty !== null && rec.quantity < minQty) return false;
    if (maxQty !== null && rec.quantity > maxQty) return false;
    if (minValue !== null && rec.tradeValue < minValue) return false;
    if (maxValue !== null && rec.tradeValue > maxValue) return false;
    return true;
  });

  out.sort((a, b) => {
    switch (p.sort) {
      case "date-asc":
        return a.date < b.date ? -1 : 1;
      case "value-desc":
        return b.tradeValue - a.tradeValue;
      case "value-asc":
        return a.tradeValue - b.tradeValue;
      case "quantity-desc":
        return b.quantity - a.quantity;
      case "date-desc":
      default:
        return a.date < b.date ? 1 : -1;
    }
  });

  return out;
}
