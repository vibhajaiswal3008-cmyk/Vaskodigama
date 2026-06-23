"use client";

import { useSearchParams } from "next/navigation";
import { TradeSearch } from "@/components/search/trade-search";
import { SearchResults } from "@/components/search/search-results";
import { buildSearchResult } from "@/lib/data";
import { paramsToQuery } from "@/lib/search/params";
import type { SearchQuery } from "@/types";

/**
 * Client-side search experience. Reads the query from the URL (useSearchParams)
 * and computes results in the browser via buildSearchResult. Computing on the
 * client keeps these pages fully static-exportable while still responding to
 * query changes after navigation.
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

  const query = hasQuery ? paramsToQuery(params) : fallback;
  if (!query.term && resultPath.includes("dashboard")) {
    query.term = fallback.term;
  }
  const result = buildSearchResult(query);

  return (
    <>
      <TradeSearch variant="full" resultPath={resultPath} initialQuery={query} />
      <div className="mt-6">
        <SearchResults result={result} />
      </div>
    </>
  );
}
