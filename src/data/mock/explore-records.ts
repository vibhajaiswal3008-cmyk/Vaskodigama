/**
 * ORIGINAL illustrative trade-record dataset for the Explore workspace.
 *
 * 120 fictional records generated DETERMINISTICALLY (engine-stable Math.sin,
 * no randomness, no Date.now) so server/client render identically and charts
 * stay stable. Company names are fictional. HS codes are DEMONSTRATION examples
 * and must be validated against an official tariff schedule before production.
 */
import type { ExploreRecord, TradeFlow, TransportMode } from "@/types/explore";

interface ProductDef {
  description: string;
  hsCode: string;
  unit: string;
  basePrice: number;
}

const PRODUCTS: ProductDef[] = [
  { description: "Active pharmaceutical ingredients, bulk", hsCode: "2941", unit: "kg", basePrice: 78 },
  { description: "Packaged medicaments, retail", hsCode: "300490", unit: "kg", basePrice: 120 },
  { description: "Medical diagnostic devices", hsCode: "9018", unit: "pcs", basePrice: 340 },
  { description: "Roasted coffee beans", hsCode: "0901", unit: "kg", basePrice: 6.4 },
  { description: "Textile weaving machinery parts", hsCode: "8446", unit: "pcs", basePrice: 210 },
  { description: "Single-phase electric motors", hsCode: "8501", unit: "pcs", basePrice: 88 },
  { description: "Food flavour concentrates", hsCode: "2106", unit: "kg", basePrice: 14 },
  { description: "Photovoltaic solar modules", hsCode: "8541", unit: "pcs", basePrice: 145 },
  { description: "Corrugated packaging materials", hsCode: "4819", unit: "kg", basePrice: 3.1 },
  { description: "Industrial cleaning chemicals", hsCode: "3402", unit: "kg", basePrice: 4.6 },
  { description: "Automotive brake components", hsCode: "8708", unit: "pcs", basePrice: 52 },
  { description: "Cotton woven fabrics", hsCode: "5208", unit: "m", basePrice: 2.1 },
  { description: "Printed circuit assemblies", hsCode: "8534", unit: "pcs", basePrice: 12 },
  { description: "Natural honey, food grade", hsCode: "0409", unit: "kg", basePrice: 3.2 },
];

const EXPORTERS = [
  "Meridian BioTrade Pvt. Ltd.",
  "Eastbridge Engineering Works",
  "Pacifica Electronics Group",
  "TerraNova Agricultural Exports",
  "Harborline Chemical Trading",
  "Crestfield Textiles",
  "Northstar Industrial Components",
  "Solstice Consumer Products",
];

const IMPORTERS = [
  "Bluehaven Foods International",
  "Arclight Medical Supplies",
  "Summit Sourcing Co.",
  "Brightport Distribution BV",
  "Veritas Procurement Ltd.",
  "Lumen Retail Group",
  "Gulf Pantry Trading LLC",
  "Continental Naturals GmbH",
];

/** Curated origin → destination trading pairs (ISO-2 codes). */
const ROUTES: [string, string][] = [
  ["IN", "AE"], ["IN", "US"], ["IN", "DE"], ["IN", "GB"],
  ["CN", "US"], ["CN", "DE"], ["CN", "NL"], ["CN", "JP"],
  ["VN", "US"], ["VN", "GB"], ["BR", "DE"], ["BR", "NL"],
  ["DE", "FR"], ["DE", "PL"], ["TR", "IT"], ["MX", "US"],
];

const PORTS: Record<string, string[]> = {
  IN: ["Nhava Sheva (JNPT)", "Mundra", "Chennai"],
  CN: ["Shanghai", "Shenzhen", "Ningbo"],
  US: ["Los Angeles", "New York", "Savannah"],
  DE: ["Hamburg", "Bremerhaven"],
  AE: ["Jebel Ali", "Khalifa"],
  GB: ["Felixstowe", "Southampton"],
  NL: ["Rotterdam"],
  VN: ["Hai Phong", "Cat Lai"],
  BR: ["Santos"],
  JP: ["Yokohama", "Kobe"],
  FR: ["Le Havre", "Marseille"],
  PL: ["Gdansk"],
  IT: ["Genoa"],
  TR: ["Mersin"],
  MX: ["Manzanillo"],
};

const STATES: Record<string, string[]> = {
  IN: ["Gujarat", "Maharashtra", "Punjab", "Tamil Nadu"],
  US: ["California", "New York", "Texas", "Georgia"],
};

const MONTHS = [
  "2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06",
  "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12",
];

const MODES: TransportMode[] = ["Sea", "Air", "Road", "Rail"];

function r(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function port(code: string, seed: number): string {
  const list = PORTS[code] ?? ["Main Port"];
  return list[Math.floor(r(seed) * list.length)];
}

function buildRecords(): ExploreRecord[] {
  const records: ExploreRecord[] = [];
  const total = 120;
  for (let i = 0; i < total; i++) {
    const product = PRODUCTS[Math.floor(r(i + 1) * PRODUCTS.length)];
    const [origin, destination] = ROUTES[Math.floor(r(i + 2) * ROUTES.length)];
    const exporter = EXPORTERS[Math.floor(r(i + 3) * EXPORTERS.length)];
    const importer = IMPORTERS[Math.floor(r(i + 4) * IMPORTERS.length)];
    const month = MONTHS[i % MONTHS.length];
    const day = 1 + Math.floor(r(i + 5) * 27);
    const date = `${month}-${String(day).padStart(2, "0")}`;

    const baseQty = product.unit === "pcs" ? 350 : product.unit === "m" ? 11_000 : 8_000;
    const quantity = Math.round(baseQty * (0.5 + r(i + 6) * 1.7));
    const unitPrice = product.basePrice * (0.82 + r(i + 7) * 0.42);
    const tradeValue = Math.round(quantity * unitPrice);
    const tradeFlow: TradeFlow = r(i + 8) > 0.45 ? "Import" : "Export";

    const originStates = STATES[origin];
    const destStates = STATES[destination];

    records.push({
      id: `vdg-ex-${10_001 + i}`,
      date,
      productDescription: product.description,
      hsCode: product.hsCode,
      importer,
      exporter,
      buyer: importer,
      supplier: exporter,
      originCountry: origin,
      destinationCountry: destination,
      originState: originStates ? originStates[Math.floor(r(i + 9) * originStates.length)] : undefined,
      destinationState: destStates ? destStates[Math.floor(r(i + 10) * destStates.length)] : undefined,
      originPort: port(origin, i + 11),
      destinationPort: port(destination, i + 12),
      quantity,
      unit: product.unit,
      tradeValue,
      currency: "USD",
      tradeFlow,
      transportMode: MODES[Math.floor(r(i + 13) * MODES.length)],
      reference: `VDG-${month.replace("-", "")}-${String(1000 + i)}`,
    });
  }
  return records.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const exploreRecords: ExploreRecord[] = buildRecords();
