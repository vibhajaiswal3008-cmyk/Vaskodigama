"use client";

import { useSearchParams } from "next/navigation";
import { TradeSearch } from "@/components/search/trade-search";
import ProductIntelligenceDashboard from "@/components/search/after-search/product-intelligence";
import { paramsToQuery } from "@/lib/search/params";
import type { SearchQuery } from "@/types";

/**
 * Client-side search experience. Reads the query from the URL (useSearchParams)
 * and renders the post-search product intelligence dashboard below the site's
 * Global Trade Search bar. Reading from the URL keeps these pages fully
 * static-exportable while still responding to query changes after navigation.
 */
export function SearchExperience({
  resultPath,
  fallback,
}: {
  resultPath: string;
  /** Default query used when the URL has no search terms. */
  fallback: SearchQuery;
}) {
  const params = useSearchParams();
  const hasQuery =
    params.has("term") ||
    params.has("origin") ||
    params.has("dest") ||
    params.has("hs");

  const parsed = hasQuery ? paramsToQuery(params) : fallback;
  // Dashboard search always needs a term to show results; fall back without mutating.
  const query =
    !parsed.term && resultPath.includes("dashboard")
      ? { ...parsed, term: fallback.term }
      : parsed;

  return (
    <>
      <TradeSearch variant="full" resultPath={resultPath} initialQuery={query} />
      <div className="mt-6">
        <ProductIntelligenceDashboard initialProduct={query.term || fallback.term} />
      </div>
    </>
  );
}
