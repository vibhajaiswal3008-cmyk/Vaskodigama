import type {
  AnalyticsData,
  EntityRow,
  NamedValue,
  ProductRow,
  ShipmentRow,
  TrendPoint,
} from "@/types/analytics";

/**
 * ILLUSTRATIVE trade-analytics demo data, generated deterministically so the
 * dashboard renders identically on every server/client render (no hydration
 * mismatch). Ported from the source dashboard's seeded generator.
 *
 * This is the single data source for the analytics dashboard. To go live,
 * replace `analyticsData` with values from a real API mapped into these types —
 * no UI component needs to change.
 */

/** Seeded pseudo-random generator (deterministic). Not cryptographic. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

const SERIES = [
  "#4F8CFF", "#22D3A7", "#A78BFA", "#F5B544", "#36D6E7",
  "#FB6F92", "#6EE7B7", "#93C5FD", "#C4B5FD", "#5EEAD4",
];

function build(): AnalyticsData {
  const r = rng(42);
  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  let base = 280;
  const trend: TrendPoint[] = months.map((m, i) => {
    const season = 1 + 0.18 * Math.sin((i / 12) * Math.PI * 2);
    base = base * (1 + (r() - 0.42) * 0.12);
    const value = base * season * 1e6;
    const shipments = Math.round(base * season * 42);
    const qty = Math.round(base * season * 980);
    const rate = 3.2 + (r() - 0.5) * 0.9 + i * 0.04;
    const prevValue = value * (0.82 + r() * 0.2);
    return {
      m,
      value,
      shipments,
      qty,
      rate: +rate.toFixed(2),
      prevValue,
      growth: +(((value - prevValue) / prevValue) * 100).toFixed(1),
    };
  });

  const geo: Record<string, [number, number]> = {
    India: [20, 78], China: [35, 105], USA: [38, -97], Germany: [51, 10],
    Singapore: [1.3, 103.8], UAE: [24, 54], Netherlands: [52, 5], Italy: [42, 12],
    Switzerland: [47, 8], Japan: [36, 138], Brazil: [-10, -55], UK: [54, -2],
    France: [47, 2], Mexico: [23, -102], Canada: [56, -106], Spain: [40, -4],
    Australia: [-25, 133],
  };

  const mk = (arr: [string, number][]): NamedValue[] =>
    arr.map((d, i) => ({
      name: d[0],
      value: d[1] * 1e6,
      growth: +(r() * 44 - 14).toFixed(1),
      color: SERIES[i % SERIES.length],
    }));

  const origins = mk([
    ["India", 412], ["China", 388], ["USA", 301], ["Germany", 244],
    ["Singapore", 198], ["UAE", 176], ["Netherlands", 151], ["Italy", 128],
    ["Switzerland", 112], ["Japan", 97],
  ]);
  const destinations = mk([
    ["USA", 356], ["Germany", 289], ["Brazil", 211], ["UK", 198],
    ["France", 167], ["UAE", 154], ["Mexico", 139], ["Canada", 121],
    ["Spain", 104], ["Australia", 88],
  ]);

  const products: ProductRow[] = (
    [
      ["Paracetamol API", 318, "2922", 4.1], ["Azithromycin", 244, "2941", 62],
      ["Metformin HCl", 221, "2925", 2.8], ["Ibuprofen", 198, "2916", 5.4],
      ["Atorvastatin", 176, "2933", 88], ["Amoxicillin", 154, "2941", 41],
      ["Pantoprazole", 132, "2933", 54], ["Ciprofloxacin", 118, "2933", 37],
      ["Cetirizine", 96, "2933", 29], ["Omeprazole", 84, "2933", 46],
    ] as [string, number, string, number][]
  ).map((d, i) => ({
    name: d[0],
    value: d[1] * 1e6,
    hsn: d[2],
    unitRate: d[3],
    growth: +(r() * 54 - 20).toFixed(1),
    qty: Math.round((d[1] * 1e6) / (d[3] * 1000)),
    color: SERIES[i % SERIES.length],
  }));

  const hsn = [
    ["2941 — Antibiotics", 28], ["3004 — Medicaments", 24], ["2933 — Heterocyclics", 17],
    ["2922 — Amino-compounds", 12], ["2934 — Nucleic acids", 9], ["2936 — Vitamins", 6],
    ["Others", 4],
  ].map((d) => ({ name: d[0] as string, value: d[1] as number }));

  const mkEntity = (arr: [string, number, number, string][]): EntityRow[] =>
    arr.map((d, i) => ({
      name: d[0],
      value: d[1] * 1e6,
      shipments: d[2],
      country: d[3],
      growth: +(r() * 50 - 16).toFixed(1),
      color: SERIES[i % SERIES.length],
    }));

  const exporters = mkEntity([
    ["Aurobindo Pharma", 284, 4120, "India"], ["Dr. Reddy's Labs", 261, 3880, "India"],
    ["Sun Pharma", 238, 3510, "India"], ["Cipla Ltd", 207, 3190, "India"],
    ["Divis Laboratories", 188, 2740, "India"], ["Hetero Drugs", 164, 2510, "India"],
    ["Lupin Ltd", 142, 2180, "India"], ["Glenmark", 121, 1890, "India"],
    ["Zhejiang Huahai", 112, 1760, "China"], ["Teva API", 98, 1540, "Israel"],
  ]);
  const importers = mkEntity([
    ["McKesson Corp", 241, 3620, "USA"], ["Pfizer Inc", 218, 3280, "USA"],
    ["Teva Pharma", 196, 2940, "Israel"], ["Sandoz Intl", 174, 2610, "Germany"],
    ["Mylan NV", 158, 2380, "USA"], ["Viatris", 139, 2090, "USA"],
    ["AmerisourceBergen", 122, 1840, "USA"], ["Cardinal Health", 108, 1620, "USA"],
    ["Sanofi", 94, 1410, "France"], ["Novartis AG", 81, 1230, "Switzerland"],
  ]);

  const relationships = (
    [
      ["Aurobindo Pharma", "McKesson Corp", 84], ["Divis Laboratories", "Pfizer Inc", 71],
      ["Dr. Reddy's Labs", "Teva Pharma", 66], ["Cipla Ltd", "Sandoz Intl", 58],
      ["Sun Pharma", "Viatris", 51], ["Hetero Drugs", "Mylan NV", 44],
      ["Lupin Ltd", "AmerisourceBergen", 38], ["Glenmark", "Cardinal Health", 31],
    ] as [string, string, number][]
  ).map((d) => ({ ex: d[0], im: d[1], value: d[2] * 1e6, ships: Math.round(d[2] * 12) }));

  const routes = (
    [
      ["India", "USA", 318], ["China", "Germany", 271], ["India", "Brazil", 198],
      ["Germany", "UK", 167], ["India", "UAE", 144], ["China", "Mexico", 121],
      ["Singapore", "France", 98], ["USA", "Canada", 86],
    ] as [string, string, number][]
  ).map((d) => ({ from: d[0], to: d[1], value: d[2] * 1e6 }));

  const ships: ShipmentRow[] = [];
  const units = ["KG", "MT", "KG", "DRUM", "KG"];
  for (let i = 0; i < 60; i++) {
    const p = products[Math.floor(r() * products.length)];
    const o = origins[Math.floor(r() * origins.length)];
    const de = destinations[Math.floor(r() * destinations.length)];
    const ex = exporters[Math.floor(r() * exporters.length)];
    const im = importers[Math.floor(r() * importers.length)];
    const q = Math.round(500 + r() * 9500);
    const rate = +(p.unitRate * (0.8 + r() * 0.4)).toFixed(2);
    ships.push({
      date: "2026-0" + (1 + Math.floor(r() * 6)) + "-" + (10 + Math.floor(r() * 18)),
      hsn: p.hsn,
      product: p.name,
      qty: q,
      unit: units[Math.floor(r() * units.length)],
      rate,
      value: Math.round(q * rate),
      currency: "USD",
      origin: o.name,
      destination: de.name,
      exporter: ex.name,
      importer: im.name,
    });
  }

  return {
    trend, origins, destinations, products, hsn, exporters, importers,
    relationships, routes, ships, geo,
    totals: {
      value: trend.reduce((a, t) => a + t.value, 0),
      ship: trend.reduce((a, t) => a + t.shipments, 0),
      qty: trend.reduce((a, t) => a + t.qty, 0),
      prev: trend.reduce((a, t) => a + t.prevValue, 0),
    },
  };
}

export const analyticsSeries = SERIES;
export const analyticsData: AnalyticsData = build();
export const analyticsCountries = ["India", "China", "USA", "Germany", "Singapore", "UAE", "Japan", "Brazil"];
