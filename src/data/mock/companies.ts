import type { Company, OpportunityScore } from "@/types";
import { withQuality } from "./quality";

/** Helper to build an illustrative opportunity score with visible factors. */
function score(value: number, rationale: string[]): OpportunityScore {
  return {
    value,
    rationale,
    factors: [
      { label: "Recent trade activity", value: Math.min(100, value + 4), description: "How recently and often the company has appeared in shipment records." },
      { label: "Shipment frequency", value: Math.max(40, value - 6), description: "Consistency of shipments across the coverage period." },
      { label: "Volume growth", value: Math.max(35, value - 12), description: "Direction of shipment volume over recent months." },
      { label: "Supplier concentration", value: Math.max(30, value - 18), description: "Whether sourcing is spread across many suppliers or a few." },
      { label: "Product relevance", value: Math.min(100, value + 2), description: "Closeness of the company's products to your search." },
      { label: "Data freshness", value: Math.max(50, value - 9), description: "How current the underlying illustrative records are." },
    ],
  };
}

/**
 * Illustrative companies (fictional names). Mix of buyers, suppliers and
 * companies acting as both. Used across buyers/suppliers/competitors views.
 */
export const companies: Company[] = [
  {
    id: "meridian-imports",
    name: "Meridian Imports FZE",
    role: "buyer",
    countryCode: "AE",
    lastActivity: "2025-11-18",
    shipmentFrequency: 9,
    productRelevance: 94,
    supplierCount: 3,
    destinationMarkets: ["AE", "SA"],
    pricePosition: "near-market",
    shipmentConsistency: "consistent",
    opportunity: score(87, [
      "Purchase activity increased over the illustrative period.",
      "The buyer appears to rely on a limited supplier base.",
      "Transaction sizes match a mid-volume exporter profile.",
    ]),
    timeline: [
      { id: "ev1", date: "2024-02-10", type: "product-first-seen", label: "Natural honey first observed", detail: "First illustrative shipment of natural honey recorded." },
      { id: "ev2", date: "2024-07-22", type: "supplier-added", label: "New supplier added", detail: "Began sourcing from a second exporter in South Asia." },
      { id: "ev3", date: "2025-03-15", type: "volume-increase", label: "Shipment volume increased", detail: "Monthly volume rose noticeably versus the prior period." },
      { id: "ev4", date: "2025-11-18", type: "recent-activity", label: "Recent activity", detail: "Most recent illustrative shipment recorded." },
    ],
    dataQuality: withQuality({ confidence: "high", completeness: 78 }),
  },
  {
    id: "gulf-pantry",
    name: "Gulf Pantry Trading LLC",
    role: "buyer",
    countryCode: "AE",
    lastActivity: "2025-10-30",
    shipmentFrequency: 6,
    productRelevance: 88,
    supplierCount: 5,
    destinationMarkets: ["AE"],
    pricePosition: "above-market",
    shipmentConsistency: "variable",
    opportunity: score(79, [
      "Steady purchasing with a broader supplier base.",
      "Average prices sit slightly above the market range.",
    ]),
    dataQuality: withQuality({ completeness: 70 }),
  },
  {
    id: "northwind-foods",
    name: "Northwind Foods Inc.",
    role: "buyer",
    countryCode: "US",
    subRegion: "California",
    lastActivity: "2025-11-05",
    shipmentFrequency: 7,
    productRelevance: 81,
    supplierCount: 4,
    destinationMarkets: ["US"],
    pricePosition: "near-market",
    shipmentConsistency: "consistent",
    opportunity: score(74, [
      "Consistent monthly purchasing pattern.",
      "Sources from multiple regions including South Asia.",
    ]),
    dataQuality: withQuality({ completeness: 68 }),
  },
  {
    id: "sunhive-exports",
    name: "Sunhive Exports Pvt. Ltd.",
    role: "supplier",
    countryCode: "IN",
    subRegion: "Gujarat",
    lastActivity: "2025-11-20",
    shipmentFrequency: 11,
    productRelevance: 92,
    destinationMarkets: ["AE", "US", "DE"],
    productRange: ["Natural honey", "Comb honey", "Beeswax"],
    pricePosition: "near-market",
    shipmentConsistency: "consistent",
    opportunity: score(85, [
      "High shipment consistency across several destination markets.",
      "Product range closely matches the searched product.",
    ]),
    timeline: [
      { id: "se1", date: "2024-01-05", type: "product-first-seen", label: "Natural honey exports begin", detail: "First illustrative export shipment recorded." },
      { id: "se2", date: "2024-09-12", type: "new-sourcing-country", label: "New destination market", detail: "Started shipping to Germany." },
      { id: "se3", date: "2025-06-01", type: "product-diversification", label: "Product diversification", detail: "Added beeswax to export mix." },
    ],
    dataQuality: withQuality({ confidence: "high", completeness: 80 }),
  },
  {
    id: "amber-valley",
    name: "Amber Valley Apiaries",
    role: "supplier",
    countryCode: "IN",
    subRegion: "Punjab",
    lastActivity: "2025-09-28",
    shipmentFrequency: 8,
    productRelevance: 86,
    destinationMarkets: ["AE", "SA"],
    productRange: ["Natural honey", "Organic honey"],
    pricePosition: "below-market",
    shipmentConsistency: "variable",
    opportunity: score(77, [
      "Competitive pricing relative to the market range.",
      "Volume varies seasonally across the period.",
    ]),
    dataQuality: withQuality({ completeness: 66 }),
  },
  {
    id: "saffron-trade",
    name: "Saffron Trade House",
    role: "supplier",
    countryCode: "IN",
    subRegion: "Maharashtra",
    lastActivity: "2025-11-12",
    shipmentFrequency: 10,
    productRelevance: 83,
    destinationMarkets: ["US", "GB", "NL"],
    productRange: ["Natural honey", "Spices"],
    pricePosition: "near-market",
    shipmentConsistency: "consistent",
    opportunity: score(80, [
      "Broad destination coverage across multiple regions.",
      "Consistent shipment cadence.",
    ]),
    dataQuality: withQuality({ completeness: 73 }),
  },
  {
    id: "blue-harbor",
    name: "Blue Harbor Commodities",
    role: "both",
    countryCode: "SG",
    lastActivity: "2025-10-15",
    shipmentFrequency: 5,
    productRelevance: 70,
    supplierCount: 6,
    destinationMarkets: ["SG", "AE"],
    productRange: ["Natural honey", "Edible oils"],
    pricePosition: "above-market",
    shipmentConsistency: "sporadic",
    opportunity: score(64, [
      "Acts as both buyer and re-exporter.",
      "Activity is less frequent and more sporadic.",
    ]),
    dataQuality: withQuality({ completeness: 60, confidence: "low" }),
  },
  {
    id: "continental-naturals",
    name: "Continental Naturals GmbH",
    role: "buyer",
    countryCode: "DE",
    lastActivity: "2025-11-01",
    shipmentFrequency: 6,
    productRelevance: 79,
    supplierCount: 4,
    destinationMarkets: ["DE"],
    pricePosition: "near-market",
    shipmentConsistency: "consistent",
    opportunity: score(72, [
      "Regular European buyer with steady cadence.",
      "Sources increasingly from South Asia.",
    ]),
    dataQuality: withQuality({ completeness: 69 }),
  },
];

export const getCompany = (id: string) => companies.find((c) => c.id === id);
export const buyers = () => companies.filter((c) => c.role === "buyer" || c.role === "both");
export const suppliers = () => companies.filter((c) => c.role === "supplier" || c.role === "both");
