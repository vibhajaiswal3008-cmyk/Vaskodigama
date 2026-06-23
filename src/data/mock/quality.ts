import type { DataQualityIndicator } from "@/types";

/**
 * Shared illustrative data-quality indicator. Centralised so every surface
 * shows consistent, honest caveats. Never claim 100% accuracy or "live" data.
 */
export const baseDataQuality: DataQualityIndicator = {
  lastUpdated: "2025-12-01",
  coveragePeriod: "Jan 2024 – Nov 2025",
  sourceCategory: "Illustrative demo dataset",
  completeness: 72,
  confidence: "medium",
  limitations: [
    "This dataset is illustrative and is not connected to a live customs feed.",
    "Subnational (state) coverage is included for a few countries only.",
    "Values are estimates for demonstration and are not verified figures.",
  ],
};

export function withQuality(
  overrides: Partial<DataQualityIndicator> = {},
): DataQualityIndicator {
  return { ...baseDataQuality, ...overrides };
}
