/**
 * Deterministic demonstration detail for a country-coverage page.
 *
 * All values are ILLUSTRATIVE and generated deterministically (engine-stable
 * Math.sin, no randomness) so server and client render identically. Nothing
 * here represents real customs data.
 */
import {
  coverageCountries,
  getCoverageCountry,
  type CoverageCountry,
} from "@/config/coverage";

const MONTHS = [
  "2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06",
  "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12",
];

const FICTIONAL_PARTNERS = [
  "Meridian BioTrade Pvt. Ltd.",
  "Northstar Industrial Components",
  "Bluehaven Foods International",
  "Arclight Medical Supplies",
  "TerraNova Agricultural Exports",
  "Eastbridge Engineering Works",
  "Solstice Consumer Products",
  "Harborline Chemical Trading",
  "Crestfield Textiles",
  "Pacifica Electronics Group",
];

const PRODUCTS = [
  { name: "Active pharmaceutical ingredients", hsCode: "2941", description: "Antibiotics & APIs" },
  { name: "Photovoltaic solar modules", hsCode: "8541", description: "Photovoltaic cells" },
  { name: "Roasted coffee beans", hsCode: "0901", description: "Coffee" },
  { name: "Textile machinery parts", hsCode: "8448", description: "Textile machinery" },
  { name: "Electric motors", hsCode: "8501", description: "Electric motors" },
  { name: "Cotton woven fabrics", hsCode: "5208", description: "Cotton fabrics" },
  { name: "Industrial control valves", hsCode: "8481", description: "Taps & valves" },
  { name: "Flexible packaging films", hsCode: "3920", description: "Plastic film" },
];

function seed(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) % 9973;
  const x = Math.sin(h) * 10000;
  return x - Math.floor(x);
}

export interface CountryDetail {
  country: CoverageCountry;
  trend: { period: string; value: number }[];
  topProducts: { name: string; hsCode: string; value: number }[];
  topHsCodes: { code: string; description: string; share: number }[];
  topOrigins: { code: string; name: string; flag: string; value: number }[];
  topDestinations: { code: string; name: string; flag: string; value: number }[];
  leadingBuyers: { name: string; value: number; records: number }[];
  leadingSuppliers: { name: string; value: number; records: number }[];
  recentRecords: {
    date: string;
    product: string;
    hsCode: string;
    counterparty: string;
    value: number;
    flow: "Import" | "Export";
  }[];
}

function others(country: CoverageCountry, offset: number, n: number) {
  const pool = coverageCountries.filter((c) => c.slug !== country.slug);
  const start = Math.floor(seed(country.code + offset) * pool.length);
  const out: CoverageCountry[] = [];
  for (let i = 0; i < n; i++) out.push(pool[(start + i * 3) % pool.length]);
  return out;
}

export function buildCountryDetail(slug: string): CountryDetail | null {
  const country = getCoverageCountry(slug);
  if (!country) return null;

  const base = country.summary.importValue / 12;
  const trend = MONTHS.map((period, i) => ({
    period,
    value: Math.round(base * (0.7 + seed(country.code + period) * 0.6) + base * 0.02 * i),
  }));

  const topProducts = PRODUCTS.slice(0, 5).map((p, i) => ({
    name: p.name,
    hsCode: p.hsCode,
    value: Math.round(country.summary.importValue * (0.26 - i * 0.04) * (0.8 + seed(country.code + p.hsCode) * 0.4)),
  })).sort((a, b) => b.value - a.value);

  const hsRaw = PRODUCTS.slice(0, 5).map((p, i) => ({
    code: p.hsCode,
    description: p.description,
    weight: 0.3 - i * 0.04 + seed(country.code + p.hsCode) * 0.1,
  }));
  const hsTotal = hsRaw.reduce((a, b) => a + b.weight, 0) || 1;
  const topHsCodes = hsRaw
    .map((h) => ({ code: h.code, description: h.description, share: Number(((h.weight / hsTotal) * 100).toFixed(1)) }))
    .sort((a, b) => b.share - a.share);

  const topOrigins = others(country, 1, 5).map((c, i) => ({
    code: c.code,
    name: c.name,
    flag: c.flag,
    value: Math.round(country.summary.importValue * (0.22 - i * 0.035) * (0.85 + seed(c.code + "o") * 0.3)),
  })).sort((a, b) => b.value - a.value);

  const topDestinations = others(country, 2, 5).map((c, i) => ({
    code: c.code,
    name: c.name,
    flag: c.flag,
    value: Math.round((country.summary.exportValue || country.summary.importValue * 0.6) * (0.24 - i * 0.04) * (0.85 + seed(c.code + "d") * 0.3)),
  })).sort((a, b) => b.value - a.value);

  const partner = (offset: number, i: number) =>
    FICTIONAL_PARTNERS[(Math.floor(seed(country.code + offset) * FICTIONAL_PARTNERS.length) + i) % FICTIONAL_PARTNERS.length];

  const leadingBuyers = Array.from({ length: 5 }, (_, i) => ({
    name: partner(3, i),
    value: Math.round(country.summary.importValue * (0.18 - i * 0.025) * (0.8 + seed(country.code + "b" + i) * 0.4)),
    records: 40 + Math.round(seed(country.code + "br" + i) * 260),
  })).sort((a, b) => b.value - a.value);

  const leadingSuppliers = Array.from({ length: 5 }, (_, i) => ({
    name: partner(7, i),
    value: Math.round((country.summary.exportValue || country.summary.importValue * 0.6) * (0.2 - i * 0.03) * (0.8 + seed(country.code + "s" + i) * 0.4)),
    records: 35 + Math.round(seed(country.code + "sr" + i) * 240),
  })).sort((a, b) => b.value - a.value);

  const recentRecords = Array.from({ length: 6 }, (_, i) => {
    const p = PRODUCTS[Math.floor(seed(country.code + "rec" + i) * PRODUCTS.length)];
    const day = 2 + Math.floor(seed(country.code + "day" + i) * 26);
    const monthIdx = 11 - (i % 12);
    return {
      date: `${MONTHS[monthIdx]}-${String(day).padStart(2, "0")}`,
      product: p.name,
      hsCode: p.hsCode,
      counterparty: partner(11 + i, i),
      value: Math.round(20_000 + seed(country.code + "v" + i) * 180_000),
      flow: (seed(country.code + "f" + i) > 0.5 ? "Import" : "Export") as "Import" | "Export",
    };
  });

  return {
    country,
    trend,
    topProducts,
    topHsCodes,
    topOrigins,
    topDestinations,
    leadingBuyers,
    leadingSuppliers,
    recentRecords,
  };
}
