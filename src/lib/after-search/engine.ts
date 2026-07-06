// ============================================================================
// Vaskodigama — trade-intelligence analytics ENGINE.
// Turns raw shipment records (the 13 columns) into customer-facing insights.
//
// Everything here is DETERMINISTIC (seeded RNG, fixed reference calendar) so
// server and client render identical output (no hydration mismatch).
// Swap `generateShipments()` for a real API feed later — `computeInsights()`
// is the contract the UI consumes and works on any Shipment[] array.
// ============================================================================

export type Unit = "KG" | "MT" | "GM" | "PCS";

export interface Shipment {
  date: string;        // YYYY-MM-DD
  month: string;       // YYYY-MM
  hsCode: string;
  product: string;     // full description incl. grade
  grade: string;       // parsed grade/variant tag
  quantity: number;    // in original unit
  unit: Unit;
  qtyKg: number;       // normalised to KG (0 for count-based units)
  isCount: boolean;    // PCS/Nos — tracked separately from weight
  unitRate: number;    // price per KG (USD) — kept per-KG for coherent price analytics
  currency: "USD";
  total: number;       // shipment value (USD)
  origin: string;      // ISO country code
  destination: string; // ISO country code
  exporter: string;
  importer: string;
  originalData: string; // raw source wording (verification layer)
}

export const COUNTRY: Record<string, string> = {
  IN: "India", CN: "China", DE: "Germany", IT: "Italy", US: "United States",
  ES: "Spain", PK: "Pakistan", AE: "UAE", GB: "United Kingdom", BR: "Brazil",
  NL: "Netherlands", ZA: "South Africa", FR: "France", BD: "Bangladesh",
};
export const FLAG: Record<string, string> = {
  IN: "🇮🇳", CN: "🇨🇳", DE: "🇩🇪", IT: "🇮🇹", US: "🇺🇸", ES: "🇪🇸", PK: "🇵🇰",
  AE: "🇦🇪", GB: "🇬🇧", BR: "🇧🇷", NL: "🇳🇱", ZA: "🇿🇦", FR: "🇫🇷", BD: "🇧🇩",
};

// ---- seeded RNG (mulberry32) -------------------------------------------------
function hash(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---- fixed 12-month calendar (ending Jun 2026) ------------------------------
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export interface MonthKey { key: string; label: string; y: number; m: number; }
function buildMonths(endY: number, endM: number, n: number): MonthKey[] {
  const out: MonthKey[] = [];
  let y = endY, m = endM;
  for (let i = 0; i < n; i++) {
    out.unshift({ key: `${y}-${String(m).padStart(2, "0")}`, label: `${MONTH_NAMES[m - 1]} ${String(y).slice(2)}`, y, m });
    m--; if (m === 0) { m = 12; y--; }
  }
  return out;
}
export const MONTHS = buildMonths(2026, 6, 12);

// ---- reference pools --------------------------------------------------------
const GRADES: [string, number][] = [
  ["USP", 30], ["BP", 24], ["IP", 14], ["EP", 10], ["DMF Grade", 6],
  ["Technical Grade", 6], ["Lab Grade", 4], ["Food Grade", 3], ["Unspecified Grade", 3],
];
const EXPORTERS: [string, string][] = [
  ["Sun Pharma Exports", "IN"], ["Aurobindo Pharma", "IN"], ["Divi's Laboratories", "IN"],
  ["Hetero Drugs Ltd", "IN"], ["Granules India Ltd", "IN"], ["Metrochem API", "IN"],
  ["Zhejiang Huahai", "CN"], ["Jiangsu Hengrui", "CN"], ["Shandong Xinhua", "CN"],
  ["BASF Pharma", "DE"], ["Merck KGaA API", "DE"], ["Farmhispania SpA", "IT"],
];
const IMPORTERS: [string, string][] = [
  ["Pfizer Global Supply", "US"], ["Mylan Inc", "US"], ["Sandoz GmbH", "DE"],
  ["Stada Arzneimittel", "DE"], ["Getz Pharma", "PK"], ["Karachi Pharma Ltd", "PK"],
  ["Genpharm FZE", "AE"], ["Accord Healthcare UK", "GB"], ["EMS Sigma Pharma", "BR"],
  ["Centrient Pharma", "NL"], ["Aspen Pharmacare", "ZA"],
];
const ORIGIN_PREMIUM: Record<string, number> = { IN: 0.92, CN: 0.84, DE: 1.22, IT: 1.15, US: 1.1 };
const GRADE_PREMIUM: Record<string, number> = {
  USP: 1.15, EP: 1.18, BP: 1.1, IP: 1.02, "DMF Grade": 1.35, "Technical Grade": 0.8,
  "Lab Grade": 1.4, "Food Grade": 0.9, "Unspecified Grade": 0.85,
};

function weightedPick<T>(r: () => number, items: [T, number][]): T {
  const total = items.reduce((s, [, w]) => s + w, 0);
  let x = r() * total;
  for (const [v, w] of items) { if ((x -= w) <= 0) return v; }
  return items[0][0];
}

// Default demo product; HS codes chosen to match the Metformin example.
export function primaryHs(product: string): { main: string; related: string[] } {
  if (/metformin/i.test(product)) return { main: "29420090", related: ["29420010", "30049099", "29337900", "29159090"] };
  return { main: "29420090", related: ["30049099", "29339900", "29420010", "38220090"] };
}

// ---- generate a realistic shipment feed for a product -----------------------
export function generateShipments(product: string, count = 220): Shipment[] {
  const r = rng(hash(product.toLowerCase()));
  const { main, related } = primaryHs(product);
  const hsPool: [string, number][] = [[main, 68], [related[0], 12], [related[1], 9], [related[2], 7], [related[3], 4]];
  const forms = ["API", "Active Pharmaceutical Ingredient", "Bulk Drug", "Raw Material", "Powder"];
  const units: [Unit, number][] = [["KG", 68], ["MT", 20], ["GM", 8], ["PCS", 4]];
  const baseRate = 1.8 + r() * 1.6; // USD/KG baseline for this product

  const out: Shipment[] = [];
  for (let i = 0; i < count; i++) {
    // more recent months slightly heavier (mild upward trend)
    const mIdx = Math.min(MONTHS.length - 1, Math.floor(Math.pow(r(), 0.8) * MONTHS.length));
    const mo = MONTHS[mIdx];
    const day = 1 + Math.floor(r() * 27);
    const hsCode = weightedPick(r, hsPool);
    const grade = weightedPick(r, GRADES);
    const [exporter, origin] = EXPORTERS[Math.floor(r() * EXPORTERS.length)];
    const [importer, destination] = IMPORTERS[Math.floor(r() * IMPORTERS.length)];
    const unit = weightedPick(r, units);
    const isCount = unit === "PCS";

    // quantity in KG-equivalent for weight units
    let qtyKg = 0, quantity = 0;
    if (unit === "MT") { const mt = 1 + Math.floor(r() * 24); quantity = mt; qtyKg = mt * 1000; }
    else if (unit === "GM") { const g = 200 + Math.floor(r() * 900); quantity = g; qtyKg = g * 0.001; }
    else if (unit === "PCS") { quantity = 500 + Math.floor(r() * 8000); qtyKg = 0; }
    else { const kg = 100 + Math.floor(r() * 3400); quantity = kg; qtyKg = kg; }

    // per-KG rate = base × origin × grade × monthly drift × noise
    const drift = 1 + (mIdx - MONTHS.length / 2) * 0.012;      // gentle price rise over year
    const noise = 0.85 + r() * 0.3;
    const perKg = baseRate * (ORIGIN_PREMIUM[origin] ?? 1) * (GRADE_PREMIUM[grade] ?? 1) * drift * noise;
    const unitRate = Math.round(perKg * 100) / 100;

    // total value
    const total = isCount
      ? Math.round(quantity * (0.4 + r() * 1.2))               // per-piece value for count units
      : Math.round(perKg * qtyKg);

    const cap = product.replace(/\b\w/g, (c) => c.toUpperCase());
    out.push({
      date: `${mo.key}-${String(day).padStart(2, "0")}`, month: mo.key, hsCode,
      product: `${cap} ${grade} (${forms[Math.floor(r() * forms.length)]})`, grade,
      quantity, unit, qtyKg, isCount, unitRate, currency: "USD", total,
      origin, destination, exporter, importer,
      originalData:
        `${cap.toUpperCase()} ${grade} — HSN ${hsCode} — QTY ${quantity} ${unit} @ USD ${unitRate}/KG — ` +
        `EXP: ${exporter.toUpperCase()} (${COUNTRY[origin]}) — IMP: ${importer.toUpperCase()} (${COUNTRY[destination]}) — ` +
        `BILL DT ${mo.key}-${String(day).padStart(2, "0")}`,
    });
  }
  return out;
}

// ---- aggregation helpers ----------------------------------------------------
const uniq = (arr: string[]) => Array.from(new Set(arr));
interface GroupAcc {
  key: string; shipments: number; value: number; qtyKg: number;
  origin?: string; destination?: string;
  buyers?: Set<string>; suppliers?: Set<string>; months?: Set<string>; descs?: Set<string>;
  last?: string; first?: string;
}
function groupSum(rows: Shipment[], key: (s: Shipment) => string, extra?: (acc: GroupAcc, s: Shipment) => void) {
  const m = new Map<string, GroupAcc>();
  for (const s of rows) {
    const k = key(s);
    if (!m.has(k)) m.set(k, { key: k, shipments: 0, value: 0, qtyKg: 0 });
    const a = m.get(k)!;
    a.shipments++; a.value += s.total; a.qtyKg += s.qtyKg;
    extra?.(a, s);
  }
  return Array.from(m.values());
}
const rate = (value: number, qtyKg: number) => (qtyKg > 0 ? value / qtyKg : 0);
export const fmtUSD = (n: number) => {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${Math.round(n)}`;
};
export const fmtQty = (kg: number) => {
  if (kg >= 1e6) return `${(kg / 1e6).toFixed(1)}k MT`;
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} MT`;
  return `${Math.round(kg)} KG`;
};
export const fmtInt = (n: number) => n.toLocaleString("en-US");

// ---- master insight computation --------------------------------------------
export function computeInsights(product: string, shipments: Shipment[]) {
  const totalValue = shipments.reduce((s, x) => s + x.total, 0);
  const totalQtyKg = shipments.reduce((s, x) => s + x.qtyKg, 0);
  const weightedAvgRate = rate(totalValue, totalQtyKg);
  const perKgRates = shipments.filter((s) => !s.isCount).map((s) => s.unitRate);
  const avgRate = perKgRates.reduce((s, x) => s + x, 0) / (perKgRates.length || 1);

  const byExp = groupSum(shipments, (s) => s.exporter, (a, s) => { (a.origin = s.origin); (a.buyers ??= new Set()).add(s.importer); (a.last = a.last && a.last > s.date ? a.last : s.date); (a.first = a.first && a.first < s.date ? a.first : s.date); });
  const byImp = groupSum(shipments, (s) => s.importer, (a, s) => { (a.destination = s.destination); (a.suppliers ??= new Set()).add(s.exporter); (a.last = a.last && a.last > s.date ? a.last : s.date); (a.first = a.first && a.first < s.date ? a.first : s.date); (a.months ??= new Set()).add(s.month); });
  const byOrigin = groupSum(shipments, (s) => s.origin);
  const byDest = groupSum(shipments, (s) => s.destination);
  const byHs = groupSum(shipments, (s) => s.hsCode, (a, s) => { (a.descs ??= new Set()).add(s.product.replace(/\s*\(.+?\)\s*/, " ").trim()); });
  const byGrade = groupSum(shipments, (s) => s.grade);

  function topBy<T extends { value: number; shipments: number }>(arr: T[], k: "value" | "shipments" = "value"): T[] {
    return [...arr].sort((a, b) => b[k] - a[k]);
  }
  const share = (v: number) => (totalValue > 0 ? (v / totalValue) * 100 : 0);

  // monthly series
  const monthly = MONTHS.map((mo) => {
    const rows = shipments.filter((s) => s.month === mo.key);
    const v = rows.reduce((s, x) => s + x.total, 0);
    const q = rows.reduce((s, x) => s + x.qtyKg, 0);
    return { key: mo.key, label: mo.label, shipments: rows.length, value: v, qtyKg: q, avgRate: rate(v, q) || avgRate };
  });

  // country growth = last-3-month value vs previous-3-month value
  const growthFor = (code: string, field: "origin" | "destination") => {
    const rows = shipments.filter((s) => s[field] === code);
    const recent = rows.filter((s) => MONTHS.slice(-3).some((m) => m.key === s.month)).reduce((s, x) => s + x.total, 0);
    const prev = rows.filter((s) => MONTHS.slice(-6, -3).some((m) => m.key === s.month)).reduce((s, x) => s + x.total, 0);
    return prev > 0 ? Math.round(((recent - prev) / prev) * 100) : recent > 0 ? 100 : 0;
  };

  const exporters = topBy(byExp).map((e) => {
    const first = e.first ?? "", last = e.last ?? "";
    return {
      name: e.key, country: e.origin ?? "", shipments: e.shipments, value: e.value, qtyKg: e.qtyKg,
      avgRate: rate(e.value, e.qtyKg), buyerCount: (e.buyers ?? new Set()).size, last, first,
      isNew: !MONTHS.slice(0, 6).some((m) => first <= `${m.key}-31`) ? false : first >= MONTHS[MONTHS.length - 3].key,
    };
  });
  const importers = topBy(byImp).map((e) => {
    const monthsActive = (e.months ?? new Set()).size;
    const first = e.first ?? "", last = e.last ?? "";
    return {
      name: e.key, country: e.destination ?? "", shipments: e.shipments, value: e.value, qtyKg: e.qtyKg,
      avgRate: rate(e.value, e.qtyKg), supplierCount: (e.suppliers ?? new Set()).size, last, first,
      monthsActive, isNew: first >= MONTHS[MONTHS.length - 3].key, isFrequent: e.shipments >= 8,
      monthlyCounts: MONTHS.map((m) => shipments.filter((s) => s.importer === e.key && s.month === m.key).length),
    };
  });

  const origins = topBy(byOrigin).map((o) => ({ code: o.key, name: COUNTRY[o.key] ?? o.key, shipments: o.shipments, value: o.value, qtyKg: o.qtyKg, avgRate: rate(o.value, o.qtyKg), growth: growthFor(o.key, "origin"), share: share(o.value) }));
  const destinations = topBy(byDest).map((d) => ({ code: d.key, name: COUNTRY[d.key] ?? d.key, shipments: d.shipments, value: d.value, qtyKg: d.qtyKg, avgRate: rate(d.value, d.qtyKg), growth: growthFor(d.key, "destination"), share: share(d.value) }));

  const hs = topBy(byHs, "shipments").map((h) => ({
    code: h.key, shipments: h.shipments, value: h.value, qtyKg: h.qtyKg,
    confidence: Math.min(99, Math.round((h.shipments / shipments.length) * 140)),
    descriptions: Array.from(h.descs ?? new Set<string>()).slice(0, 4),
  }));
  const grades = topBy(byGrade, "shipments").map((g) => ({ grade: g.key, shipments: g.shipments, value: g.value, qtyKg: g.qtyKg, avgRate: rate(g.value, g.qtyKg), share: (g.shipments / shipments.length) * 100 }));

  // exporter → importer relationships
  const pairMap = new Map<string, { exporter: string; importer: string; shipments: number; value: number }>();
  for (const s of shipments) {
    const k = `${s.exporter}||${s.importer}`;
    if (!pairMap.has(k)) pairMap.set(k, { exporter: s.exporter, importer: s.importer, shipments: 0, value: 0 });
    const p = pairMap.get(k)!; p.shipments++; p.value += s.total;
  }
  const pairs = topBy(Array.from(pairMap.values())).slice(0, 12);
  const singleSupplierBuyers = importers.filter((i) => i.supplierCount === 1).map((i) => i.name);
  const multiBuyerSuppliers = exporters.filter((e) => e.buyerCount >= 4).map((e) => e.name);

  // price
  const byOriginRate = origins.map((o) => ({ code: o.code, name: o.name, rate: o.avgRate })).filter((o) => o.rate > 0).sort((a, b) => b.rate - a.rate);
  const byExporterRate = exporters.map((e) => ({ name: e.name, rate: e.avgRate })).filter((e) => e.rate > 0).sort((a, b) => b.rate - a.rate);
  const scatter = shipments.filter((s) => !s.isCount).map((s) => ({ qtyKg: s.qtyKg, rate: s.unitRate }));
  const sortedRates = [...perKgRates].sort((a, b) => a - b);
  const q1 = sortedRates[Math.floor(sortedRates.length * 0.25)] ?? 0;
  const q3 = sortedRates[Math.floor(sortedRates.length * 0.75)] ?? 0;
  const iqr = q3 - q1;
  const outliers = shipments.filter((s) => !s.isCount && (s.unitRate > q3 + 1.5 * iqr || s.unitRate < q1 - 1.5 * iqr)).length;
  const rateMonths = monthly.map((m) => m.avgRate).filter((x) => x > 0);
  const rateMean = rateMonths.reduce((s, x) => s + x, 0) / (rateMonths.length || 1);
  const rateStd = Math.sqrt(rateMonths.reduce((s, x) => s + (x - rateMean) ** 2, 0) / (rateMonths.length || 1));
  const priceVolatilityPct = Math.round((rateStd / (rateMean || 1)) * 100);

  // risk / concentration (Pareto)
  const paretoOf = (arr: Array<{ name: string; value: number; shipments: number }>) => {
    const sorted = topBy(arr).slice(0, 8);
    let cum = 0;
    return sorted.map((x) => { cum += x.value; return { label: x.name, value: x.value, cumPct: (cum / totalValue) * 100 }; });
  };
  const originTopShare = origins[0]?.share ?? 0;
  const exporterTop3Share = share(exporters.slice(0, 3).reduce((s, e) => s + e.value, 0));
  const importerTop3Share = share(importers.slice(0, 3).reduce((s, e) => s + e.value, 0));

  const { main } = primaryHs(product);
  const dates = shipments.map((s) => s.date).sort();

  const cap = product.replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    product: cap,
    summary: {
      product: cap, tradeFlow: "Import", country: destinations[0]?.name ?? "—", mainHs: main,
      dateRange: `${MONTHS[0].label} – ${MONTHS[MONTHS.length - 1].label}`,
      firstDate: dates[0], lastDate: dates[dates.length - 1], totalRecords: shipments.length,
    },
    kpis: {
      totalValue, totalShipments: shipments.length, totalQtyKg, weightedAvgRate, avgRate,
      uniqueExporters: uniq(shipments.map((s) => s.exporter)).length,
      uniqueImporters: uniq(shipments.map((s) => s.importer)).length,
      uniqueOrigins: uniq(shipments.map((s) => s.origin)).length,
      uniqueDestinations: uniq(shipments.map((s) => s.destination)).length,
      topExporter: exporters[0], topImporter: importers[0], topOrigin: origins[0],
    },
    monthly, hs, grades, origins, destinations, exporters, importers, pairs,
    singleSupplierBuyers, multiBuyerSuppliers,
    price: {
      avgRate, weightedAvgRate, min: sortedRates[0] ?? 0, max: sortedRates[sortedRates.length - 1] ?? 0,
      byOriginRate, byExporterRate, scatter, outliers, q1, q3,
      trend: monthly.map((m) => m.avgRate),
    },
    risk: {
      originTopShare, originTopName: origins[0]?.name, exporterTop3Share, importerTop3Share,
      priceVolatilityPct, hsCount: hs.length, singleSupplierBuyers: singleSupplierBuyers.length,
      paretoExporters: paretoOf(exporters), paretoImporters: paretoOf(importers),
    },
  };
}

export type Insights = ReturnType<typeof computeInsights>;

export const KNOWN_PRODUCTS = [
  "metformin", "paracetamol", "ibuprofen", "amoxicillin", "azithromycin", "aspirin",
  "atorvastatin", "omeprazole", "ciprofloxacin", "cetirizine", "turmeric extract",
  "natural honey", "vitamin c", "caffeine anhydrous", "lactose monohydrate",
];
export const isKnown = (q: string) => {
  const s = q.toLowerCase().trim();
  return KNOWN_PRODUCTS.some((k) => s.includes(k) || k.includes(s)) || s.length >= 3;
};
