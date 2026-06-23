import { describe, expect, it } from "vitest";
import { buildQuerySummary } from "./summary";
import { paramsToQuery, queryToParams, emptyQuery } from "./params";
import { buildSearchResult } from "@/lib/data";
import type { SearchQuery } from "@/types";

describe("buildQuerySummary", () => {
  it("describes an import query with origin and destination", () => {
    const q: SearchQuery = {
      type: "product",
      term: "natural honey",
      direction: "import",
      originCountry: "IN",
      destinationCountry: "AE",
      dateRange: "12m",
    };
    const s = buildQuerySummary(q);
    expect(s).toContain("imports of natural honey");
    expect(s).toContain("into United Arab Emirates");
    expect(s).toContain("from India");
    expect(s).toContain("last 12 months");
  });

  it("handles HS-code queries", () => {
    const q: SearchQuery = {
      type: "hs-code",
      term: "0409",
      hsCode: "0409",
      direction: "export",
      originCountry: "IN",
      dateRange: "6m",
    };
    expect(buildQuerySummary(q)).toContain("HS code 0409");
    expect(buildQuerySummary(q)).toContain("exports");
  });
});

describe("query params round-trip", () => {
  it("serializes and parses back to an equivalent query", () => {
    const q: SearchQuery = {
      type: "product",
      term: "coffee",
      hsCode: "0901",
      direction: "import",
      originCountry: "BR",
      destinationCountry: "US",
      subRegion: "California",
      port: "Los Angeles",
      dateRange: "3m",
    };
    const parsed = paramsToQuery(queryToParams(q));
    expect(parsed).toEqual(q);
  });

  it("falls back to safe defaults for empty params", () => {
    const parsed = paramsToQuery(new URLSearchParams());
    expect(parsed.type).toBe("product");
    expect(parsed.direction).toBe("import");
    expect(parsed.dateRange).toBe("12m");
  });
});

describe("buildSearchResult", () => {
  it("builds a complete result with markets, buyers and suppliers", () => {
    const result = buildSearchResult({ ...emptyQuery, term: "natural honey" });
    expect(result.markets.length).toBeGreaterThan(0);
    expect(result.buyers.length).toBeGreaterThan(0);
    expect(result.suppliers.length).toBeGreaterThan(0);
    expect(result.shipments.length).toBeGreaterThan(0);
    expect(result.overview.opportunity.value).toBeGreaterThan(0);
    expect(result.summary).toContain("natural honey");
  });
});
