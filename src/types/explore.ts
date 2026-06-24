/**
 * Types for the Explore trade-record workspace.
 *
 * Records are ILLUSTRATIVE fictional samples (see src/data/mock/explore-records.ts),
 * generated deterministically. HS codes are demonstration examples and must be
 * validated against an official tariff schedule before production use.
 */

export type TradeFlow = "Import" | "Export";

export type TransportMode = "Sea" | "Air" | "Road" | "Rail";

export interface ExploreRecord {
  id: string;
  date: string;
  productDescription: string;
  hsCode: string;
  importer: string;
  exporter: string;
  buyer: string;
  supplier: string;
  originCountry: string;
  destinationCountry: string;
  originState?: string;
  destinationState?: string;
  originPort: string;
  destinationPort: string;
  quantity: number;
  unit: string;
  tradeValue: number;
  currency: string;
  tradeFlow: TradeFlow;
  transportMode?: TransportMode;
  reference: string;
}

export type ExploreMode =
  | "product"
  | "hs-code"
  | "company"
  | "buyer"
  | "supplier"
  | "importer"
  | "exporter";

export type ExploreSort =
  | "date-desc"
  | "date-asc"
  | "value-desc"
  | "value-asc"
  | "quantity-desc";

/** Fully described Explore query — also the shape mirrored into the URL. */
export interface ExploreParams {
  mode: ExploreMode;
  q: string;
  hsCode: string;
  origin: string;
  destination: string;
  flow: TradeFlow | "all";
  port: string;
  dateFrom: string;
  dateTo: string;
  minQty: string;
  maxQty: string;
  minValue: string;
  maxValue: string;
  sort: ExploreSort;
  page: number;
}

export interface ExploreResponse {
  records: ExploreRecord[];
  total: number;
  page: number;
  pageSize: number;
}
