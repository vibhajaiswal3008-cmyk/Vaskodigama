/**
 * ORIGINAL illustrative dataset for the Trade Analytics workspace.
 *
 * Everything here is fictional and generated DETERMINISTICALLY (no Math.random,
 * no Date.now) so the server and client render identical markup — this avoids
 * hydration drift and keeps charts stable between renders.
 *
 * Developer note: HS codes below are illustrative groupings for the demo and
 * must be validated against an official tariff schedule before production use.
 */
import type { DataQualityIndicator } from "@/types";
import type {
  AnalyticsMonth,
  AnalyticsRecord,
  CountryFlow,
  HsShare,
  PartnerFlow,
  ProductFlow,
  RegionValue,
  TradeAnalyticsSummary,
} from "@/types/trade-analytics";
import { getCountry } from "./countries";

/** Deterministic 0..1 pseudo-random from an integer seed (engine-stable). */
function r(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 4.1414) * 43758.5453;
  return x - Math.floor(x);
}

/** Trailing 12 illustrative months ending Dec 2025. */
const MONTHS = [
  "2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06",
  "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12",
];

interface ProductDef {
  name: string;
  hsCode: string;
  hsLabel: string;
  unit: string;
  basePrice: number;
}

const PRODUCTS: ProductDef[] = [
  { name: "Natural honey, food grade", hsCode: "0409", hsLabel: "Natural honey", unit: "kg", basePrice: 3.2 },
  { name: "Active pharmaceutical ingredients", hsCode: "2941", hsLabel: "Antibiotics & APIs", unit: "kg", basePrice: 78 },
  { name: "Photovoltaic solar modules", hsCode: "8541", hsLabel: "Photovoltaic cells", unit: "pcs", basePrice: 145 },
  { name: "Roasted coffee beans", hsCode: "0901", hsLabel: "Coffee", unit: "kg", basePrice: 6.4 },
  { name: "Textile machinery parts", hsCode: "8448", hsLabel: "Textile machinery", unit: "pcs", basePrice: 220 },
  { name: "Electric motors, single-phase", hsCode: "8501", hsLabel: "Electric motors", unit: "pcs", basePrice: 88 },
  { name: "Cotton woven fabrics", hsCode: "5208", hsLabel: "Cotton fabrics", unit: "m", basePrice: 2.1 },
  { name: "Electronic circuit assemblies", hsCode: "8534", hsLabel: "Printed circuits", unit: "pcs", basePrice: 12 },
  { name: "Industrial control valves", hsCode: "8481", hsLabel: "Taps & valves", unit: "pcs", basePrice: 64 },
  { name: "Flexible packaging films", hsCode: "3920", hsLabel: "Plastic film", unit: "kg", basePrice: 4.3 },
];

interface PartnerDef {
  id: string;
  name: string;
  country: string;
}

const EXPORTERS: PartnerDef[] = [
  { id: "sunhive", name: "Sunhive Exports Pvt. Ltd.", country: "IN" },
  { id: "amber-valley", name: "Amber Valley Apiaries", country: "IN" },
  { id: "meridian-bio", name: "Meridian BioTrade Pvt. Ltd.", country: "IN" },
  { id: "crestfield", name: "Crestfield Textiles", country: "IN" },
  { id: "eastbridge", name: "Eastbridge Engineering Works", country: "CN" },
  { id: "pacifica", name: "Pacifica Electronics Group", country: "CN" },
  { id: "terranova", name: "TerraNova Agricultural Exports", country: "BR" },
  { id: "harborline", name: "Harborline Chemical Trading", country: "DE" },
  { id: "northstar", name: "Northstar Industrial Components", country: "DE" },
  { id: "solstice", name: "Solstice Consumer Products", country: "VN" },
];

const IMPORTERS: PartnerDef[] = [
  { id: "meridian-imports", name: "Meridian Imports FZE", country: "AE" },
  { id: "gulf-pantry", name: "Gulf Pantry Trading LLC", country: "SA" },
  { id: "northwind", name: "Northwind Foods Inc.", country: "US" },
  { id: "continental", name: "Continental Naturals GmbH", country: "DE" },
  { id: "bluehaven", name: "Bluehaven Foods International", country: "GB" },
  { id: "arclight", name: "Arclight Medical Supplies", country: "US" },
  { id: "brightport", name: "Brightport Distribution BV", country: "NL" },
  { id: "summit", name: "Summit Sourcing Co.", country: "JP" },
  { id: "veritas", name: "Veritas Procurement Ltd.", country: "GB" },
  { id: "lumen", name: "Lumen Retail Group", country: "CA" },
];

const MODES = ["Sea", "Air", "Road", "Rail"] as const;

/** Build the full illustrative record set deterministically. */
function buildRecords(): AnalyticsRecord[] {
  const records: AnalyticsRecord[] = [];
  const total = 84;
  for (let i = 0; i < total; i++) {
    const product = PRODUCTS[Math.floor(r(i + 1) * PRODUCTS.length)];
    const exporter = EXPORTERS[Math.floor(r(i + 2) * EXPORTERS.length)];
    const importer = IMPORTERS[Math.floor(r(i + 3) * IMPORTERS.length)];
    const month = MONTHS[i % MONTHS.length];
    const day = 1 + Math.floor(r(i + 4) * 27);
    const date = `${month}-${String(day).padStart(2, "0")}`;

    const baseQty = product.unit === "pcs" ? 400 : product.unit === "m" ? 12000 : 9000;
    const quantity = Math.round(baseQty * (0.5 + r(i + 5) * 1.6));
    const unitPrice = Number((product.basePrice * (0.82 + r(i + 6) * 0.4)).toFixed(2));
    const value = Math.round(quantity * unitPrice);
    const flow: "Import" | "Export" = r(i + 7) > 0.42 ? "Import" : "Export";
    const mode = MODES[Math.floor(r(i + 8) * MODES.length)];

    records.push({
      id: `vdg-${String(10_001 + i)}`,
      date,
      product: product.name,
      hsCode: product.hsCode,
      quantity,
      unit: product.unit,
      unitPrice,
      value,
      currency: "USD",
      originCode: exporter.country,
      destinationCode: importer.country,
      exporter: exporter.name,
      importer: importer.name,
      flow,
      mode,
    });
  }
  return records.sort((a, b) => (a.date < b.date ? 1 : -1));
}

const RECORDS = buildRecords();

// --- Aggregations -----------------------------------------------------------

function sum(ns: number[]): number {
  return ns.reduce((a, b) => a + b, 0);
}

function monthly(): AnalyticsMonth[] {
  return MONTHS.map((period) => {
    const rows = RECORDS.filter((rec) => rec.date.startsWith(period));
    return {
      period,
      value: sum(rows.map((x) => x.value)),
      shipments: rows.length,
      quantity: sum(rows.map((x) => x.quantity)),
    };
  });
}

function countryFlows(side: "originCode" | "destinationCode"): CountryFlow[] {
  const map = new Map<string, { value: number; shipments: number }>();
  for (const rec of RECORDS) {
    const code = rec[side];
    const cur = map.get(code) ?? { value: 0, shipments: 0 };
    cur.value += rec.value;
    cur.shipments += 1;
    map.set(code, cur);
  }
  return [...map.entries()]
    .map(([code, agg], idx) => {
      const c = getCountry(code);
      return {
        code,
        name: c?.name ?? code,
        flag: c?.flag ?? "🏳️",
        region: c?.region ?? "—",
        value: agg.value,
        shipments: agg.shipments,
        growth: Number(((r(idx + 20) - 0.4) * 38).toFixed(1)),
      };
    })
    .sort((a, b) => b.value - a.value);
}

function hsDistribution(): HsShare[] {
  const map = new Map<string, number>();
  for (const rec of RECORDS) {
    map.set(rec.hsCode, (map.get(rec.hsCode) ?? 0) + rec.value);
  }
  const grand = sum([...map.values()]) || 1;
  return [...map.entries()]
    .map(([code, value]) => {
      const def = PRODUCTS.find((p) => p.hsCode === code);
      return {
        code,
        description: def?.hsLabel ?? code,
        value,
        share: Number(((value / grand) * 100).toFixed(1)),
      };
    })
    .sort((a, b) => b.value - a.value);
}

function partnerFlows(
  side: "exporter" | "importer",
  defs: PartnerDef[],
): PartnerFlow[] {
  const map = new Map<string, { value: number; shipments: number; latest: string }>();
  for (const rec of RECORDS) {
    const name = rec[side];
    const cur = map.get(name) ?? { value: 0, shipments: 0, latest: rec.date };
    cur.value += rec.value;
    cur.shipments += 1;
    if (rec.date > cur.latest) cur.latest = rec.date;
    map.set(name, cur);
  }
  return [...map.entries()]
    .map(([name, agg], idx) => {
      const def = defs.find((d) => d.name === name);
      const country = def?.country ?? "—";
      return {
        id: def?.id ?? name,
        name,
        countryCode: country,
        flag: getCountry(country)?.flag ?? "🏳️",
        shipments: agg.shipments,
        value: agg.value,
        latest: agg.latest,
        growth: Number(((r(idx + 40) - 0.38) * 34).toFixed(1)),
      };
    })
    .sort((a, b) => b.value - a.value);
}

function topProducts(): ProductFlow[] {
  const map = new Map<string, { value: number; shipments: number; hsCode: string }>();
  for (const rec of RECORDS) {
    const cur = map.get(rec.product) ?? { value: 0, shipments: 0, hsCode: rec.hsCode };
    cur.value += rec.value;
    cur.shipments += 1;
    map.set(rec.product, cur);
  }
  return [...map.entries()]
    .map(([name, agg], idx) => ({
      name,
      hsCode: agg.hsCode,
      value: agg.value,
      shipments: agg.shipments,
      growth: Number(((r(idx + 60) - 0.35) * 40).toFixed(1)),
    }))
    .sort((a, b) => b.value - a.value);
}

function regionValue(): RegionValue[] {
  const map = new Map<string, number>();
  for (const rec of RECORDS) {
    const region = getCountry(rec.destinationCode)?.region ?? "Other";
    map.set(region, (map.get(region) ?? 0) + rec.value);
  }
  return [...map.entries()]
    .map(([region, value]) => ({ region, value }))
    .sort((a, b) => b.value - a.value);
}

const dataQuality: DataQualityIndicator = {
  lastUpdated: "2025-12-31",
  coveragePeriod: "Jan 2025 – Dec 2025",
  sourceCategory: "Illustrative",
  completeness: 74,
  confidence: "medium",
  limitations: [
    "All records are fictional samples created to demonstrate the interface.",
    "HS codes are illustrative groupings and are not validated against an official tariff schedule.",
    "Values and quantities are generated, not sourced from customs filings.",
  ],
};

/** Build the complete analytics summary from the illustrative records. */
export function buildTradeAnalytics(): TradeAnalyticsSummary {
  const totalValue = sum(RECORDS.map((x) => x.value));
  const buyers = new Set(RECORDS.map((x) => x.importer)).size;
  const suppliers = new Set(RECORDS.map((x) => x.exporter)).size;
  const countries = new Set(
    RECORDS.flatMap((x) => [x.originCode, x.destinationCode]),
  ).size;
  const imports = sum(RECORDS.filter((x) => x.flow === "Import").map((x) => x.value));
  const exports = sum(RECORDS.filter((x) => x.flow === "Export").map((x) => x.value));

  return {
    direction: "import",
    kpis: [
      { key: "records", label: "Trade records", value: RECORDS.length.toLocaleString("en-US"), delta: 9.4, hint: "Illustrative records in the coverage period." },
      { key: "value", label: "Total trade value", value: `$${(totalValue / 1_000_000).toFixed(1)}M`, delta: 12.1, hint: "Sum of illustrative record values." },
      { key: "buyers", label: "Buyers", value: String(buyers), delta: 4.5, hint: "Distinct illustrative importers." },
      { key: "suppliers", label: "Suppliers", value: String(suppliers), delta: 6.2, hint: "Distinct illustrative exporters." },
      { key: "countries", label: "Countries", value: String(countries), delta: 2.0, hint: "Distinct origin and destination markets." },
      { key: "avg", label: "Avg record value", value: `$${Math.round(totalValue / RECORDS.length).toLocaleString("en-US")}`, delta: -2.1, hint: "Average illustrative value per record." },
    ],
    monthly: monthly(),
    topImporters: countryFlows("destinationCode").slice(0, 6),
    topExporters: countryFlows("originCode").slice(0, 6),
    hsDistribution: hsDistribution(),
    flowSplit: [
      { flow: "Import", value: imports },
      { flow: "Export", value: exports },
    ],
    regionValue: regionValue(),
    leadingBuyers: partnerFlows("importer", IMPORTERS).slice(0, 6),
    leadingSuppliers: partnerFlows("exporter", EXPORTERS).slice(0, 6),
    topProducts: topProducts(),
    records: RECORDS,
    dataQuality,
  };
}

/** Memoised summary (data is deterministic, so build once). */
export const tradeAnalytics: TradeAnalyticsSummary = buildTradeAnalytics();
