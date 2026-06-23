import {
  countries,
  hsCodes,
  ports,
  products,
  subRegions,
} from "@/lib/data";
import {
  GlobalTradeSearch,
  type GlobalTradeSearchProps,
} from "./global-trade-search";

type RefKeys = "countries" | "products" | "hsCodes" | "subRegions" | "ports";

/**
 * Server wrapper that supplies reference data (from the data-access layer) to
 * the client GlobalTradeSearch. Pages render <TradeSearch variant="hero" /> and
 * don't need to know where the data comes from. When a real API replaces the
 * mock, only the data layer changes.
 */
export function TradeSearch(props: Omit<GlobalTradeSearchProps, RefKeys>) {
  return (
    <GlobalTradeSearch
      {...props}
      countries={countries}
      products={products}
      hsCodes={hsCodes}
      subRegions={subRegions}
      ports={ports}
    />
  );
}
