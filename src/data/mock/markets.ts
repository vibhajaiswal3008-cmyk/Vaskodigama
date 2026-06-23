import type { Market, OpportunityScore } from "@/types";

function demand(base: number, drift: number) {
  const months = [
    "2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06",
    "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12",
  ];
  return months.map((period, i) => ({
    period,
    value: Math.round(base + drift * i + Math.sin(i / 2) * (base * 0.05)),
  }));
}

function mScore(value: number, rationale: string[]): OpportunityScore {
  return {
    value,
    rationale,
    factors: [
      { label: "Market demand", value: Math.min(100, value + 3), description: "Illustrative demand level for the product." },
      { label: "Volume growth", value: Math.max(35, value - 5), description: "Direction of import volume over recent months." },
      { label: "Competition", value: Math.max(30, 100 - value), description: "Estimated competitive intensity (lower competition scores higher)." },
      { label: "Buyer consistency", value: Math.max(45, value - 8), description: "How steadily buyers purchase in this market." },
      { label: "Price level", value: Math.max(40, value - 10), description: "Illustrative average price relative to peers." },
    ],
  };
}

/** Illustrative markets for the natural-honey demonstration scenario. */
export const markets: Market[] = [
  {
    id: "mkt-ae",
    countryCode: "AE",
    direction: "import",
    trend: "rising",
    growth: 18.4,
    competitionLevel: "moderate",
    supplierConcentration: "balanced",
    avgValue: 2.9,
    currency: "USD",
    opportunity: mScore(86, [
      "Import demand has been rising steadily.",
      "Competition is moderate, leaving room for new entrants.",
    ]),
    demandSeries: demand(420, 14),
  },
  {
    id: "mkt-us",
    countryCode: "US",
    direction: "import",
    trend: "steady",
    growth: 6.1,
    competitionLevel: "high",
    supplierConcentration: "fragmented",
    avgValue: 3.4,
    currency: "USD",
    opportunity: mScore(71, [
      "Large, steady market with many active suppliers.",
      "Higher competition lowers the entry score.",
    ]),
    demandSeries: demand(910, 6),
  },
  {
    id: "mkt-sa",
    countryCode: "SA",
    direction: "import",
    trend: "rising",
    growth: 22.7,
    competitionLevel: "low",
    supplierConcentration: "concentrated",
    avgValue: 2.7,
    currency: "USD",
    opportunity: mScore(82, [
      "Fast-rising demand with relatively low competition.",
      "Supply is concentrated among a few exporters today.",
    ]),
    demandSeries: demand(260, 12),
  },
  {
    id: "mkt-de",
    countryCode: "DE",
    direction: "import",
    trend: "steady",
    growth: 4.3,
    competitionLevel: "high",
    supplierConcentration: "fragmented",
    avgValue: 3.8,
    currency: "USD",
    opportunity: mScore(64, [
      "Mature European market with stable demand.",
      "Quality and certification expectations are high.",
    ]),
    demandSeries: demand(540, 3),
  },
  {
    id: "mkt-gb",
    countryCode: "GB",
    direction: "import",
    trend: "falling",
    growth: -2.8,
    competitionLevel: "moderate",
    supplierConcentration: "balanced",
    avgValue: 3.6,
    currency: "USD",
    opportunity: mScore(58, [
      "Demand softened slightly over recent months.",
      "Moderate competition among established suppliers.",
    ]),
    demandSeries: demand(480, -3),
  },
];

export const getMarket = (id: string) => markets.find((m) => m.id === id);
