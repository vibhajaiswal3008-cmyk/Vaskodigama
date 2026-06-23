import type { SubRegion } from "@/types";

/**
 * Illustrative subnational regions. Only a few countries are included to make
 * the point clearly in the UI that state-level coverage depends on the source
 * and is not universal. These are interface examples, not a data claim.
 */
export const subRegions: SubRegion[] = [
  // India (illustrative states)
  { id: "IN-GJ", countryCode: "IN", name: "Gujarat", kind: "state" },
  { id: "IN-MH", countryCode: "IN", name: "Maharashtra", kind: "state" },
  { id: "IN-DL", countryCode: "IN", name: "Delhi", kind: "territory" },
  { id: "IN-KA", countryCode: "IN", name: "Karnataka", kind: "state" },
  { id: "IN-TN", countryCode: "IN", name: "Tamil Nadu", kind: "state" },
  { id: "IN-TG", countryCode: "IN", name: "Telangana", kind: "state" },
  { id: "IN-WB", countryCode: "IN", name: "West Bengal", kind: "state" },
  { id: "IN-RJ", countryCode: "IN", name: "Rajasthan", kind: "state" },
  { id: "IN-UP", countryCode: "IN", name: "Uttar Pradesh", kind: "state" },
  { id: "IN-PB", countryCode: "IN", name: "Punjab", kind: "state" },

  // United States (illustrative states)
  { id: "US-CA", countryCode: "US", name: "California", kind: "state" },
  { id: "US-TX", countryCode: "US", name: "Texas", kind: "state" },
  { id: "US-NY", countryCode: "US", name: "New York", kind: "state" },
  { id: "US-FL", countryCode: "US", name: "Florida", kind: "state" },
  { id: "US-IL", countryCode: "US", name: "Illinois", kind: "state" },
  { id: "US-NJ", countryCode: "US", name: "New Jersey", kind: "state" },
];

export const getSubRegions = (countryCode: string) =>
  subRegions.filter((s) => s.countryCode === countryCode);
