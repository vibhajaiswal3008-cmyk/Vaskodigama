/**
 * Types for the Trade Analytics workspace.
 *
 * This is an ORIGINAL Vaskodigama feature. All figures are ILLUSTRATIVE and
 * generated deterministically (see src/data/mock/tradeAnalytics.ts), then
 * served through the data-access layer in src/lib/data so a real trade-data
 * API can replace the source without changing the UI.
 */
import type { DataQualityIndicator, TradeDirection } from "@/types";

/** A single month in a value/volume time series. */
export interface AnalyticsMonth {
  /** ISO month, e.g. "2025-06". */
  period: string;
  /** Illustrative trade value for the month. */
  value: number;
  /** Number of illustrative shipment records in the month. */
  shipments: number;
  /** Illustrative total quantity (kg-equivalent). */
  quantity: number;
}

/** Aggregated activity for a country (as origin or destination). */
export interface CountryFlow {
  code: string;
  name: string;
  flag: string;
  region: string;
  value: number;
  shipments: number;
  /** Illustrative period-over-period change, percentage. */
  growth: number;
}

/** Aggregated activity for a trading partner (buyer or supplier). */
export interface PartnerFlow {
  id: string;
  name: string;
  countryCode: string;
  flag: string;
  shipments: number;
  value: number;
  /** Most recent illustrative activity (ISO date). */
  latest: string;
  growth: number;
}

/** Share of activity attributed to one HS code. */
export interface HsShare {
  code: string;
  description: string;
  value: number;
  /** 0–100 share of total value. */
  share: number;
}

/** A product line aggregated across records. */
export interface ProductFlow {
  name: string;
  hsCode: string;
  value: number;
  shipments: number;
  growth: number;
}

/** Total value attributed to a world region. */
export interface RegionValue {
  region: string;
  value: number;
}

/** A single illustrative transaction-level record for the explorer table. */
export interface AnalyticsRecord {
  id: string;
  date: string;
  product: string;
  hsCode: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  value: number;
  currency: string;
  originCode: string;
  destinationCode: string;
  exporter: string;
  importer: string;
  flow: "Import" | "Export";
  mode: "Sea" | "Air" | "Road" | "Rail";
}

/** A KPI with an illustrative period-over-period delta. */
export interface AnalyticsKpi {
  key: string;
  label: string;
  value: string;
  /** Signed percentage change vs the previous illustrative period. */
  delta: number;
  hint: string;
}

/** The complete summary consumed by the Trade Analytics UI. */
export interface TradeAnalyticsSummary {
  direction: TradeDirection;
  kpis: AnalyticsKpi[];
  monthly: AnalyticsMonth[];
  topImporters: CountryFlow[];
  topExporters: CountryFlow[];
  hsDistribution: HsShare[];
  flowSplit: { flow: "Import" | "Export"; value: number }[];
  regionValue: RegionValue[];
  leadingBuyers: PartnerFlow[];
  leadingSuppliers: PartnerFlow[];
  topProducts: ProductFlow[];
  records: AnalyticsRecord[];
  dataQuality: DataQualityIndicator;
}

/** Column keys available in the Trade Records explorer. */
export type AnalyticsColumn =
  | "date"
  | "product"
  | "hsCode"
  | "quantity"
  | "unit"
  | "unitPrice"
  | "value"
  | "originCode"
  | "destinationCode"
  | "exporter"
  | "importer"
  | "flow"
  | "mode";
