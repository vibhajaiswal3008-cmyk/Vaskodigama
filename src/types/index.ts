/**
 * Domain models for Vaskodigama.
 *
 * These types describe the shape of trade-intelligence data. In this build the
 * data is ILLUSTRATIVE and served from src/data/mock via the data-access layer
 * in src/lib/data. The same types are designed to be returned by a real
 * trade-data API later, so UI components depend only on these interfaces.
 */

export type TradeDirection = "import" | "export";

export type Confidence = "high" | "medium" | "low";

export type SearchType = "product" | "hs-code" | "company" | "country";

/** A confidence/coverage indicator attached to any data point. */
export interface DataQualityIndicator {
  /** ISO date the underlying illustrative dataset was last refreshed. */
  lastUpdated: string;
  /** Human label of the coverage window, e.g. "Jan 2024 – Dec 2024". */
  coveragePeriod: string;
  /** Broad source category — never claim official customs unless connected. */
  sourceCategory: string;
  /** 0–100 completeness estimate. */
  completeness: number;
  confidence: Confidence;
  /** Plain-language limitations the user should keep in mind. */
  limitations: string[];
}

export interface Country {
  code: string; // ISO-3166 alpha-2
  name: string;
  region: string;
  flag: string; // emoji flag for lightweight display
  /** Whether illustrative subnational (state/province) data exists here. */
  hasStateData: boolean;
  popular?: boolean;
}

export interface SubRegion {
  id: string;
  countryCode: string;
  name: string; // state / province / territory
  kind: "state" | "province" | "territory" | "region";
}

export interface Port {
  id: string;
  name: string;
  countryCode: string;
  type: "sea" | "air" | "land";
}

export interface HsCode {
  code: string; // 2/4/6+ digits
  description: string;
  level: 2 | 4 | 6 | 8;
  parent?: string;
  /** Related search terms / synonyms. */
  relatedTerms: string[];
  /** True if the code commonly varies by country at deeper levels. */
  variesByCountry?: boolean;
}

export interface Product {
  id: string;
  name: string;
  aliases: string[]; // alternative spellings / names
  category: string;
  /** Candidate HS codes — require user confirmation, never auto-applied. */
  suggestedHsCodes: string[];
}

export type Trend = "rising" | "steady" | "falling";

export interface OpportunityFactor {
  label: string;
  /** Contribution to the score, 0–100 weighted display value. */
  value: number;
  description: string;
}

export interface OpportunityScore {
  /** 0–100 illustrative composite. Not scientifically validated. */
  value: number;
  factors: OpportunityFactor[];
  /** Short evidence statements explaining "why this matters". */
  rationale: string[];
}

export interface PriceRecord {
  period: string; // ISO month
  /** Illustrative average unit price. */
  avgUnitPrice: number;
  currency: string;
  unit: string;
  min: number;
  max: number;
}

export interface TradeEvent {
  id: string;
  date: string;
  type:
    | "product-first-seen"
    | "supplier-added"
    | "volume-increase"
    | "supplier-discontinued"
    | "new-sourcing-country"
    | "product-diversification"
    | "recent-activity";
  label: string;
  detail: string;
}

export interface Company {
  id: string;
  name: string;
  role: "buyer" | "supplier" | "both";
  countryCode: string;
  subRegion?: string;
  /** Last illustrative trade activity (ISO date). */
  lastActivity: string;
  /** Shipments per month (illustrative average). */
  shipmentFrequency: number;
  /** 0–100 relevance to the searched product. */
  productRelevance: number;
  supplierCount?: number;
  destinationMarkets?: string[];
  productRange?: string[];
  pricePosition?: "below-market" | "near-market" | "above-market";
  shipmentConsistency?: "consistent" | "variable" | "sporadic";
  opportunity: OpportunityScore;
  timeline?: TradeEvent[];
  dataQuality: DataQualityIndicator;
}

export interface ShipmentRecord {
  id: string;
  date: string;
  productDescription: string;
  hsCode: string;
  exporter: string;
  importer: string;
  originCountry: string;
  originState?: string;
  destinationCountry: string;
  destinationState?: string;
  port: string;
  quantity: number;
  unit: string;
  /** Illustrative value — never described as verified. */
  value: number;
  currency: string;
  sourceCategory: string;
  confidence: Confidence;
}

export interface Market {
  id: string;
  countryCode: string;
  /** Direction this market represents for the searched product. */
  direction: TradeDirection;
  trend: Trend;
  /** Year-over-year illustrative growth, percentage. */
  growth: number;
  competitionLevel: "low" | "moderate" | "high";
  supplierConcentration: "fragmented" | "balanced" | "concentrated";
  avgValue: number;
  currency: string;
  opportunity: OpportunityScore;
  demandSeries: { period: string; value: number }[];
}

export type AlertFrequency = "daily" | "weekly" | "monthly";

export interface Alert {
  id: string;
  name: string;
  query: string;
  frequency: AlertFrequency;
  channels: ("email" | "in-app")[];
  createdAt: string;
  active: boolean;
  watch: ("buyers" | "suppliers" | "prices" | "competitors" | "markets")[];
}

export interface Insight {
  id: string;
  title: string;
  body: string;
  evidence: string[];
  confidence: Confidence;
  dataDate: string;
}

export type ReportType =
  | "market-entry"
  | "buyer-shortlist"
  | "supplier-assessment"
  | "country-comparison"
  | "price-analysis"
  | "competitor"
  | "shipment-summary";

export interface ReportConfig {
  id: string;
  title: string;
  type: ReportType;
  product?: string;
  hsCode?: string;
  originCountry?: string;
  destinationCountry?: string;
  subRegion?: string;
  dateRange: string;
  companyIds: string[];
  marketIds: string[];
  sections: string[];
  createdAt: string;
}

export type SavedItemKind = "search" | "company" | "market" | "product";

export interface SavedItem {
  id: string;
  kind: SavedItemKind;
  label: string;
  detail: string;
  href: string;
  savedAt: string;
}

/** A fully described search query, used for the summary sentence + routing. */
export interface SearchQuery {
  type: SearchType;
  term: string;
  hsCode?: string;
  direction: TradeDirection;
  originCountry?: string;
  destinationCountry?: string;
  subRegion?: string;
  port?: string;
  dateRange: DateRangePreset | string;
}

export type DateRangePreset =
  | "30d"
  | "3m"
  | "6m"
  | "12m"
  | "custom";

/** Bundled result of a search, consumed by the results dashboard. */
export interface SearchResult {
  query: SearchQuery;
  summary: string;
  overview: {
    metrics: { label: string; value: string; delta?: number; hint?: string }[];
    opportunity: OpportunityScore;
  };
  markets: Market[];
  buyers: Company[];
  suppliers: Company[];
  shipments: ShipmentRecord[];
  prices: PriceRecord[];
  competitors: Company[];
  dataQuality: DataQualityIndicator;
  recommendedActions: { label: string; description: string }[];
}
