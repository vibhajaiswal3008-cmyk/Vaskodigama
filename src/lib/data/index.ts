/**
 * Data-access layer (repository).
 *
 * This is the single seam between the UI and the underlying data source. Today
 * it returns ILLUSTRATIVE data from src/data/mock. To go live, replace the
 * bodies of these functions with calls to a real trade-data API — the function
 * signatures and return types (from src/types) stay the same, so no UI
 * component needs to change.
 *
 * All functions are async to mirror a real network-backed source.
 */
import { countries, getCountry, regionGroups } from "@/data/mock/countries";
import { getSubRegions, subRegions } from "@/data/mock/subregions";
import { getPorts, ports } from "@/data/mock/ports";
import {
  getHsByPrefix,
  getHsChildren,
  getHsCode,
  hsCodes,
} from "@/data/mock/hsCodes";
import { getProduct, searchProducts, products } from "@/data/mock/products";
import {
  buyers as mockBuyers,
  companies,
  getCompany,
  suppliers as mockSuppliers,
} from "@/data/mock/companies";
import { markets } from "@/data/mock/markets";
import { priceRecords, shipments } from "@/data/mock/shipments";
import { alerts, changeFeed, savedItems } from "@/data/mock/workspace";
import { baseDataQuality } from "@/data/mock/quality";
import type {
  Company,
  SearchQuery,
  SearchResult,
} from "@/types";
import { buildQuerySummary } from "@/lib/search/summary";

// --- Reference data ---------------------------------------------------------

export const tradeData = {
  async listCountries() {
    return countries;
  },
  async getCountry(code: string) {
    return getCountry(code) ?? null;
  },
  async listRegionGroups() {
    return regionGroups;
  },
  async listSubRegions(countryCode: string) {
    return getSubRegions(countryCode);
  },
  async listPorts(countryCode?: string) {
    return getPorts(countryCode);
  },
  async listProducts() {
    return products;
  },
  async searchProducts(q: string) {
    return searchProducts(q);
  },
  async getProduct(id: string) {
    return getProduct(id) ?? null;
  },
  async searchHsCodes(prefixOrTerm: string) {
    const digits = prefixOrTerm.replace(/\D/g, "");
    if (digits) return getHsByPrefix(digits);
    const term = prefixOrTerm.toLowerCase();
    return hsCodes.filter(
      (h) =>
        h.description.toLowerCase().includes(term) ||
        h.relatedTerms.some((t) => t.toLowerCase().includes(term)),
    );
  },
  async getHsCode(code: string) {
    return getHsCode(code) ?? null;
  },
  async getHsChildren(code: string) {
    return getHsChildren(code);
  },

  // --- Companies ------------------------------------------------------------
  async listCompanies() {
    return companies;
  },
  async getCompany(id: string) {
    return getCompany(id) ?? null;
  },
  async listBuyers() {
    return mockBuyers();
  },
  async listSuppliers() {
    return mockSuppliers();
  },

  // --- Markets / shipments / prices ----------------------------------------
  async listMarkets() {
    return markets;
  },
  async listShipments() {
    return shipments;
  },
  async listPriceRecords() {
    return priceRecords;
  },

  // --- Workspace ------------------------------------------------------------
  async listAlerts() {
    return alerts;
  },
  async listSavedItems() {
    return savedItems;
  },
  async listChangeFeed() {
    return changeFeed;
  },
  async getDataQuality() {
    return baseDataQuality;
  },

  // --- Composite search -----------------------------------------------------
  async runSearch(query: SearchQuery): Promise<SearchResult> {
    return buildSearchResult(query);
  },
};

/**
 * Compose a full search result from the illustrative data. A real
 * implementation would call the trade-data API and map the response into the
 * SearchResult shape.
 */
export function buildSearchResult(query: SearchQuery): SearchResult {
  const buyers = mockBuyers();
  const suppliers = mockSuppliers();
  const competitors: Company[] = suppliers
    .filter((s) => s.id !== suppliers[0]?.id)
    .slice(0, 4);

  const topMarket = [...markets].sort(
    (a, b) => b.opportunity.value - a.opportunity.value,
  )[0];

  const summary = buildQuerySummary(query);

  const totalShipments = shipments.length;
  const avgPrice =
    priceRecords.reduce((a, p) => a + p.avgUnitPrice, 0) / priceRecords.length;

  return {
    query,
    summary,
    overview: {
      metrics: [
        { label: "Active buyers", value: String(buyers.length), delta: 12.5, hint: "Illustrative buyers seen in the period." },
        { label: "Active suppliers", value: String(suppliers.length), delta: 8.1, hint: "Illustrative suppliers seen in the period." },
        { label: "Shipments", value: String(totalShipments), delta: 15.2, hint: "Illustrative shipment records." },
        { label: "Avg price", value: `$${avgPrice.toFixed(2)}/kg`, delta: 4.3, hint: "Illustrative average unit price." },
      ],
      opportunity: topMarket.opportunity,
    },
    markets,
    buyers,
    suppliers,
    shipments,
    prices: priceRecords,
    competitors,
    dataQuality: baseDataQuality,
    recommendedActions: [
      { label: "Save this market", description: "Keep the UAE honey market on your watchlist." },
      { label: "Compare top suppliers", description: "Line up Sunhive, Saffron and Amber Valley side by side." },
      { label: "Create a price alert", description: "Get notified when the average unit price moves." },
      { label: "Add to a report", description: "Build a market-entry report from these findings." },
    ],
  };
}

// Re-export reference collections for convenience in server components.
export { countries, subRegions, ports, hsCodes, products, companies, markets };
