/**
 * Types for the Trade Analytics dashboard (the integrated "Zenrics"-source
 * dashboard, rebranded to Vaskodigama). All data is ILLUSTRATIVE demo data,
 * generated deterministically — see src/data/mock/analytics.ts.
 */

export type AnalyticsTab =
  | "overview"
  | "geographical"
  | "products"
  | "exporters"
  | "importers"
  | "origin"
  | "destination"
  | "supplychain"
  | "explorer";

export type AnalyticsMode = "global" | "export" | "import";

export interface TrendPoint {
  m: string; // month label
  value: number;
  shipments: number;
  qty: number;
  rate: number;
  prevValue: number;
  growth: number;
}

export interface NamedValue {
  name: string;
  value: number;
  growth: number;
  color: string;
}

export interface ProductRow extends NamedValue {
  hsn: string;
  unitRate: number;
  qty: number;
}

export interface EntityRow extends NamedValue {
  shipments: number;
  country: string;
}

export interface HsnShare {
  name: string;
  value: number; // percentage share
}

export interface Relationship {
  ex: string;
  im: string;
  value: number;
  ships: number;
}

export interface Route {
  from: string;
  to: string;
  value: number;
}

export interface ShipmentRow {
  date: string;
  hsn: string;
  product: string;
  qty: number;
  unit: string;
  rate: number;
  value: number;
  currency: string;
  origin: string;
  destination: string;
  exporter: string;
  importer: string;
}

export interface AnalyticsTotals {
  value: number;
  ship: number;
  qty: number;
  prev: number;
}

export interface AnalyticsData {
  trend: TrendPoint[];
  origins: NamedValue[];
  destinations: NamedValue[];
  products: ProductRow[];
  hsn: HsnShare[];
  exporters: EntityRow[];
  importers: EntityRow[];
  relationships: Relationship[];
  routes: Route[];
  ships: ShipmentRow[];
  geo: Record<string, [number, number]>;
  totals: AnalyticsTotals;
}

/** A column key in the Data Explorer table. */
export type ShipmentColumn = keyof Pick<
  ShipmentRow,
  | "date"
  | "hsn"
  | "product"
  | "qty"
  | "unit"
  | "rate"
  | "value"
  | "currency"
  | "origin"
  | "destination"
  | "exporter"
  | "importer"
>;

/** A global-search result pointing at a dashboard section + optional filter. */
export interface SearchHit {
  type: "product" | "hsn" | "exporter" | "importer" | "origin" | "destination";
  label: string;
  detail: string;
  tab: AnalyticsTab;
}
