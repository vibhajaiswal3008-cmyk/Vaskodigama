/**
 * Pure client-side data-derivation helpers.
 *
 * All functions accept a filtered ExploreRecord[] and return aggregated views
 * suitable for the Overview, Buyers, Suppliers, Countries, HS Codes, and
 * Routes panels.  No network calls — everything is derived from the same
 * in-memory slice that the table shows.
 */

import type { ExploreRecord } from "@/types/explore";

/* ── Derived types ─────────────────────────────────────────────────────────── */

export interface DerivedCompany {
  name: string;
  role: "buyer" | "supplier";
  countries: string[];   // ISO-2 codes (unique)
  shipments: number;
  totalValue: number;
  latestDate: string;    // ISO date
  topProducts: string[]; // up to 3 product descriptions
  topHsCodes: string[];  // up to 3 HS codes
}

export interface DerivedCountry {
  code: string;
  buyers: number;
  suppliers: number;
  shipments: number;
  totalValue: number;
  latestDate: string;
  topProducts: string[];
  role: "destination" | "origin" | "both";
}

export interface DerivedHsCode {
  code: string;
  description: string;
  shipments: number;
  totalValue: number;
  buyers: number;
  suppliers: number;
  originCountries: string[];
  destinationCountries: string[];
}

export interface DerivedRoute {
  origin: string;
  destination: string;
  shipments: number;
  totalValue: number;
  totalQuantity: number;
  unit: string;
  buyers: number;
  suppliers: number;
  topProducts: string[];
  latestDate: string;
  primaryMode: string;
}

export interface MonthlyPoint {
  period: string;   // "YYYY-MM-01" (ISO) — DemandChart expects an ISO string
  label: string;    // "Jan 2025"
  count: number;
  value: number;
}

/* ── Helpers ───────────────────────────────────────────────────────────────── */

function topN<T>(map: Map<T, number>, n: number): T[] {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k]) => k);
}

function uniq<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

/* ── Public derivation functions ───────────────────────────────────────────── */

export function deriveBuyers(records: ExploreRecord[]): DerivedCompany[] {
  const map = new Map<string, {
    countries: Set<string>;
    shipments: number;
    totalValue: number;
    latestDate: string;
    products: Map<string, number>;
    hsCodes: Map<string, number>;
  }>();

  for (const r of records) {
    const key = r.importer || r.buyer || "";
    if (!key) continue;
    if (!map.has(key)) {
      map.set(key, {
        countries: new Set(),
        shipments: 0,
        totalValue: 0,
        latestDate: r.date,
        products: new Map(),
        hsCodes: new Map(),
      });
    }
    const entry = map.get(key)!;
    entry.countries.add(r.destinationCountry || r.originCountry);
    entry.shipments++;
    entry.totalValue += r.tradeValue ?? 0;
    if (r.date > entry.latestDate) entry.latestDate = r.date;
    entry.products.set(r.productDescription, (entry.products.get(r.productDescription) ?? 0) + 1);
    entry.hsCodes.set(r.hsCode, (entry.hsCodes.get(r.hsCode) ?? 0) + 1);
  }

  return [...map.entries()]
    .map(([name, d]) => ({
      name,
      role: "buyer" as const,
      countries: [...d.countries],
      shipments: d.shipments,
      totalValue: d.totalValue,
      latestDate: d.latestDate,
      topProducts: topN(d.products, 3),
      topHsCodes: topN(d.hsCodes, 3),
    }))
    .sort((a, b) => b.shipments - a.shipments);
}

export function deriveSuppliers(records: ExploreRecord[]): DerivedCompany[] {
  const map = new Map<string, {
    countries: Set<string>;
    shipments: number;
    totalValue: number;
    latestDate: string;
    products: Map<string, number>;
    hsCodes: Map<string, number>;
  }>();

  for (const r of records) {
    const key = r.exporter || r.supplier || "";
    if (!key) continue;
    if (!map.has(key)) {
      map.set(key, {
        countries: new Set(),
        shipments: 0,
        totalValue: 0,
        latestDate: r.date,
        products: new Map(),
        hsCodes: new Map(),
      });
    }
    const entry = map.get(key)!;
    entry.countries.add(r.originCountry || r.destinationCountry);
    entry.shipments++;
    entry.totalValue += r.tradeValue ?? 0;
    if (r.date > entry.latestDate) entry.latestDate = r.date;
    entry.products.set(r.productDescription, (entry.products.get(r.productDescription) ?? 0) + 1);
    entry.hsCodes.set(r.hsCode, (entry.hsCodes.get(r.hsCode) ?? 0) + 1);
  }

  return [...map.entries()]
    .map(([name, d]) => ({
      name,
      role: "supplier" as const,
      countries: [...d.countries],
      shipments: d.shipments,
      totalValue: d.totalValue,
      latestDate: d.latestDate,
      topProducts: topN(d.products, 3),
      topHsCodes: topN(d.hsCodes, 3),
    }))
    .sort((a, b) => b.shipments - a.shipments);
}

export function deriveCountries(records: ExploreRecord[]): DerivedCountry[] {
  const destMap = new Map<string, {
    buyers: Set<string>;
    suppliers: Set<string>;
    shipments: number;
    totalValue: number;
    latestDate: string;
    products: Map<string, number>;
  }>();

  const origMap = new Map<string, Set<string>>(); // used to determine "both"

  for (const r of records) {
    const dest = r.destinationCountry;
    const orig = r.originCountry;

    if (dest) {
      if (!destMap.has(dest)) {
        destMap.set(dest, { buyers: new Set(), suppliers: new Set(), shipments: 0, totalValue: 0, latestDate: r.date, products: new Map() });
      }
      const e = destMap.get(dest)!;
      if (r.importer || r.buyer) e.buyers.add(r.importer || r.buyer);
      if (r.exporter || r.supplier) e.suppliers.add(r.exporter || r.supplier);
      e.shipments++;
      e.totalValue += r.tradeValue ?? 0;
      if (r.date > e.latestDate) e.latestDate = r.date;
      e.products.set(r.productDescription, (e.products.get(r.productDescription) ?? 0) + 1);
    }

    if (orig) {
      if (!origMap.has(orig)) origMap.set(orig, new Set());
      origMap.get(orig)!.add(orig);
    }
  }

  return [...destMap.entries()]
    .map(([code, d]) => ({
      code,
      buyers: d.buyers.size,
      suppliers: d.suppliers.size,
      shipments: d.shipments,
      totalValue: d.totalValue,
      latestDate: d.latestDate,
      topProducts: topN(d.products, 3),
      role: (origMap.has(code) ? "both" : "destination") as DerivedCountry["role"],
    }))
    .sort((a, b) => b.shipments - a.shipments);
}

export function deriveHsCodes(records: ExploreRecord[]): DerivedHsCode[] {
  const map = new Map<string, {
    description: string;
    shipments: number;
    totalValue: number;
    buyers: Set<string>;
    suppliers: Set<string>;
    origins: Set<string>;
    destinations: Set<string>;
  }>();

  for (const r of records) {
    if (!r.hsCode) continue;
    if (!map.has(r.hsCode)) {
      map.set(r.hsCode, {
        description: r.productDescription,
        shipments: 0,
        totalValue: 0,
        buyers: new Set(),
        suppliers: new Set(),
        origins: new Set(),
        destinations: new Set(),
      });
    }
    const e = map.get(r.hsCode)!;
    e.shipments++;
    e.totalValue += r.tradeValue ?? 0;
    if (r.importer || r.buyer) e.buyers.add(r.importer || r.buyer);
    if (r.exporter || r.supplier) e.suppliers.add(r.exporter || r.supplier);
    if (r.originCountry) e.origins.add(r.originCountry);
    if (r.destinationCountry) e.destinations.add(r.destinationCountry);
  }

  return [...map.entries()]
    .map(([code, d]) => ({
      code,
      description: d.description,
      shipments: d.shipments,
      totalValue: d.totalValue,
      buyers: d.buyers.size,
      suppliers: d.suppliers.size,
      originCountries: [...d.origins],
      destinationCountries: [...d.destinations],
    }))
    .sort((a, b) => b.shipments - a.shipments);
}

export function deriveRoutes(records: ExploreRecord[]): DerivedRoute[] {
  const map = new Map<string, {
    shipments: number;
    totalValue: number;
    totalQuantity: number;
    unit: string;
    buyers: Set<string>;
    suppliers: Set<string>;
    products: Map<string, number>;
    latestDate: string;
    modes: Map<string, number>;
  }>();

  for (const r of records) {
    const key = `${r.originCountry}→${r.destinationCountry}`;
    if (!map.has(key)) {
      map.set(key, {
        shipments: 0,
        totalValue: 0,
        totalQuantity: 0,
        unit: r.unit,
        buyers: new Set(),
        suppliers: new Set(),
        products: new Map(),
        latestDate: r.date,
        modes: new Map(),
      });
    }
    const e = map.get(key)!;
    e.shipments++;
    e.totalValue += r.tradeValue ?? 0;
    e.totalQuantity += r.quantity ?? 0;
    if (r.importer || r.buyer) e.buyers.add(r.importer || r.buyer);
    if (r.exporter || r.supplier) e.suppliers.add(r.exporter || r.supplier);
    e.products.set(r.productDescription, (e.products.get(r.productDescription) ?? 0) + 1);
    if (r.date > e.latestDate) e.latestDate = r.date;
    if (r.transportMode) e.modes.set(r.transportMode, (e.modes.get(r.transportMode) ?? 0) + 1);
  }

  return [...map.entries()]
    .map(([key, d]) => {
      const [origin, destination] = key.split("→");
      const primaryMode = topN(d.modes, 1)[0] ?? "Sea";
      return {
        origin,
        destination,
        shipments: d.shipments,
        totalValue: d.totalValue,
        totalQuantity: d.totalQuantity,
        unit: d.unit,
        buyers: d.buyers.size,
        suppliers: d.suppliers.size,
        topProducts: topN(d.products, 2),
        latestDate: d.latestDate,
        primaryMode,
      };
    })
    .sort((a, b) => b.shipments - a.shipments);
}

export function deriveTrend(records: ExploreRecord[]): MonthlyPoint[] {
  const map = new Map<string, { count: number; value: number }>();

  for (const r of records) {
    if (!r.date) continue;
    const month = r.date.slice(0, 7); // "YYYY-MM"
    if (!map.has(month)) map.set(month, { count: 0, value: 0 });
    const e = map.get(month)!;
    e.count++;
    e.value += r.tradeValue ?? 0;
  }

  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, d]) => {
      const [year, m] = month.split("-");
      const dt = new Date(Number(year), Number(m) - 1, 1);
      const label = dt.toLocaleDateString("en-US", { year: "numeric", month: "short" });
      return {
        period: `${month}-01`,
        label,
        count: d.count,
        value: d.value,
      };
    });
}

export function deriveTopDestinations(records: ExploreRecord[]): { name: string; value: number }[] {
  const map = new Map<string, number>();
  for (const r of records) {
    if (r.destinationCountry) {
      map.set(r.destinationCountry, (map.get(r.destinationCountry) ?? 0) + 1);
    }
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));
}

export function deriveTransportModes(records: ExploreRecord[]): { name: string; value: number }[] {
  const map = new Map<string, number>();
  for (const r of records) {
    const mode = r.transportMode ?? "Unknown";
    map.set(mode, (map.get(mode) ?? 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));
}
