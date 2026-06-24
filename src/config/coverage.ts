/**
 * Central country-coverage configuration.
 *
 * DEVELOPER NOTE: This is a DEMONSTRATION coverage list. Replace it with the
 * final, verified production coverage list (and confirm the exact 40 markets)
 * before launch. Per the data-truthfulness rules, the per-country summary
 * figures below are ILLUSTRATIVE and generated deterministically — they are
 * NOT real customs values and must not be presented as such.
 */

export interface CoverageSummary {
  /** Illustrative count of demonstration records held for this market. */
  recordCount: number;
  /** Illustrative import value (USD). */
  importValue: number;
  /** Illustrative export value (USD). */
  exportValue: number;
  /** Most active product group in the demonstration data. */
  topProductGroup: string;
  /** Latest demonstration period label. */
  latestPeriod: string;
}

export interface CoverageCountry {
  slug: string;
  name: string;
  /** ISO-3166 alpha-2 code. */
  code: string;
  region: CoverageRegion;
  flag: string;
  hasImportData: boolean;
  hasExportData: boolean;
  summary: CoverageSummary;
}

export type CoverageRegion =
  | "South Asia"
  | "East Asia"
  | "Southeast Asia"
  | "Middle East"
  | "Europe"
  | "North America"
  | "Latin America"
  | "Africa"
  | "Oceania";

export const COVERAGE_REGIONS: CoverageRegion[] = [
  "South Asia",
  "East Asia",
  "Southeast Asia",
  "Middle East",
  "Europe",
  "North America",
  "Latin America",
  "Africa",
  "Oceania",
];

const PRODUCT_GROUPS = [
  "Pharmaceuticals & healthcare",
  "Chemicals & ingredients",
  "Engineering & machinery",
  "Textiles & apparel",
  "Food & agriculture",
  "Electronics & components",
  "Consumer products",
  "Automotive components",
];

/** Base list — the demonstration 40 markets, grouped by region. */
const BASE: Omit<CoverageCountry, "summary">[] = [
  // South Asia
  { slug: "india", name: "India", code: "IN", region: "South Asia", flag: "🇮🇳", hasImportData: true, hasExportData: true },
  { slug: "bangladesh", name: "Bangladesh", code: "BD", region: "South Asia", flag: "🇧🇩", hasImportData: true, hasExportData: true },
  { slug: "pakistan", name: "Pakistan", code: "PK", region: "South Asia", flag: "🇵🇰", hasImportData: true, hasExportData: true },
  { slug: "sri-lanka", name: "Sri Lanka", code: "LK", region: "South Asia", flag: "🇱🇰", hasImportData: true, hasExportData: false },
  // East Asia
  { slug: "china", name: "China", code: "CN", region: "East Asia", flag: "🇨🇳", hasImportData: true, hasExportData: true },
  { slug: "japan", name: "Japan", code: "JP", region: "East Asia", flag: "🇯🇵", hasImportData: true, hasExportData: true },
  { slug: "south-korea", name: "South Korea", code: "KR", region: "East Asia", flag: "🇰🇷", hasImportData: true, hasExportData: true },
  // Southeast Asia
  { slug: "vietnam", name: "Vietnam", code: "VN", region: "Southeast Asia", flag: "🇻🇳", hasImportData: true, hasExportData: true },
  { slug: "indonesia", name: "Indonesia", code: "ID", region: "Southeast Asia", flag: "🇮🇩", hasImportData: true, hasExportData: true },
  { slug: "thailand", name: "Thailand", code: "TH", region: "Southeast Asia", flag: "🇹🇭", hasImportData: true, hasExportData: true },
  { slug: "malaysia", name: "Malaysia", code: "MY", region: "Southeast Asia", flag: "🇲🇾", hasImportData: true, hasExportData: true },
  { slug: "singapore", name: "Singapore", code: "SG", region: "Southeast Asia", flag: "🇸🇬", hasImportData: true, hasExportData: true },
  { slug: "philippines", name: "Philippines", code: "PH", region: "Southeast Asia", flag: "🇵🇭", hasImportData: true, hasExportData: false },
  // Middle East
  { slug: "united-arab-emirates", name: "United Arab Emirates", code: "AE", region: "Middle East", flag: "🇦🇪", hasImportData: true, hasExportData: true },
  { slug: "saudi-arabia", name: "Saudi Arabia", code: "SA", region: "Middle East", flag: "🇸🇦", hasImportData: true, hasExportData: true },
  { slug: "turkey", name: "Turkey", code: "TR", region: "Middle East", flag: "🇹🇷", hasImportData: true, hasExportData: true },
  // Europe
  { slug: "germany", name: "Germany", code: "DE", region: "Europe", flag: "🇩🇪", hasImportData: true, hasExportData: true },
  { slug: "united-kingdom", name: "United Kingdom", code: "GB", region: "Europe", flag: "🇬🇧", hasImportData: true, hasExportData: true },
  { slug: "france", name: "France", code: "FR", region: "Europe", flag: "🇫🇷", hasImportData: true, hasExportData: true },
  { slug: "italy", name: "Italy", code: "IT", region: "Europe", flag: "🇮🇹", hasImportData: true, hasExportData: true },
  { slug: "netherlands", name: "Netherlands", code: "NL", region: "Europe", flag: "🇳🇱", hasImportData: true, hasExportData: true },
  { slug: "belgium", name: "Belgium", code: "BE", region: "Europe", flag: "🇧🇪", hasImportData: true, hasExportData: true },
  { slug: "spain", name: "Spain", code: "ES", region: "Europe", flag: "🇪🇸", hasImportData: true, hasExportData: true },
  { slug: "poland", name: "Poland", code: "PL", region: "Europe", flag: "🇵🇱", hasImportData: true, hasExportData: false },
  { slug: "russia", name: "Russia", code: "RU", region: "Europe", flag: "🇷🇺", hasImportData: true, hasExportData: false },
  // North America
  { slug: "united-states", name: "United States", code: "US", region: "North America", flag: "🇺🇸", hasImportData: true, hasExportData: true },
  { slug: "canada", name: "Canada", code: "CA", region: "North America", flag: "🇨🇦", hasImportData: true, hasExportData: true },
  { slug: "mexico", name: "Mexico", code: "MX", region: "North America", flag: "🇲🇽", hasImportData: true, hasExportData: true },
  // Latin America
  { slug: "brazil", name: "Brazil", code: "BR", region: "Latin America", flag: "🇧🇷", hasImportData: true, hasExportData: true },
  { slug: "argentina", name: "Argentina", code: "AR", region: "Latin America", flag: "🇦🇷", hasImportData: true, hasExportData: true },
  { slug: "chile", name: "Chile", code: "CL", region: "Latin America", flag: "🇨🇱", hasImportData: true, hasExportData: true },
  { slug: "colombia", name: "Colombia", code: "CO", region: "Latin America", flag: "🇨🇴", hasImportData: true, hasExportData: false },
  { slug: "peru", name: "Peru", code: "PE", region: "Latin America", flag: "🇵🇪", hasImportData: true, hasExportData: false },
  // Africa
  { slug: "south-africa", name: "South Africa", code: "ZA", region: "Africa", flag: "🇿🇦", hasImportData: true, hasExportData: true },
  { slug: "egypt", name: "Egypt", code: "EG", region: "Africa", flag: "🇪🇬", hasImportData: true, hasExportData: true },
  { slug: "kenya", name: "Kenya", code: "KE", region: "Africa", flag: "🇰🇪", hasImportData: true, hasExportData: false },
  { slug: "nigeria", name: "Nigeria", code: "NG", region: "Africa", flag: "🇳🇬", hasImportData: true, hasExportData: false },
  { slug: "morocco", name: "Morocco", code: "MA", region: "Africa", flag: "🇲🇦", hasImportData: true, hasExportData: false },
  // Oceania
  { slug: "australia", name: "Australia", code: "AU", region: "Oceania", flag: "🇦🇺", hasImportData: true, hasExportData: true },
  { slug: "new-zealand", name: "New Zealand", code: "NZ", region: "Oceania", flag: "🇳🇿", hasImportData: true, hasExportData: true },
];

/** Deterministic 0..1 from a country code (engine-stable, no randomness). */
function seed(code: string): number {
  let h = 0;
  for (let i = 0; i < code.length; i++) h = (h * 31 + code.charCodeAt(i)) % 9973;
  const x = Math.sin(h) * 10000;
  return x - Math.floor(x);
}

/** Build the demonstration summary for a market (deterministic). */
function summaryFor(country: Omit<CoverageCountry, "summary">, index: number): CoverageSummary {
  const s = seed(country.code);
  const recordCount = 4_000 + Math.round(s * 46_000);
  const importValue = 18_000_000 + Math.round(s * 320_000_000);
  const exportValue = country.hasExportData
    ? 12_000_000 + Math.round(seed(country.code + "x") * 280_000_000)
    : 0;
  return {
    recordCount,
    importValue,
    exportValue,
    topProductGroup: PRODUCT_GROUPS[index % PRODUCT_GROUPS.length],
    latestPeriod: "Dec 2025",
  };
}

/** The full demonstration coverage list (40 markets). */
export const coverageCountries: CoverageCountry[] = BASE.map((c, i) => ({
  ...c,
  summary: summaryFor(c, i),
}));

export const getCoverageCountry = (slug: string) =>
  coverageCountries.find((c) => c.slug === slug);

export const coverageCount = coverageCountries.length;
