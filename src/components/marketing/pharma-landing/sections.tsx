import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Users,
  Factory,
  LineChart,
  Globe2,
  FlaskConical,
  Pill,
  Beaker,
  ShoppingCart,
  ShieldCheck,
  Ship,
  Map as MapIcon,
  Radar,
  Briefcase,
  ClipboardList,
  Search as SearchIcon,
  Truck,
  Building2,
  Check,
  ArrowRight,
  TrendingUp,
  Award,
  Target,
  DollarSign,
  Database,
  Cpu,
  Gauge,
  ChevronDown,
} from "lucide-react";
import { Eyebrow } from "@/components/ui/misc";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { IllustrativeBadge } from "@/components/shared/illustrative";
import { Flag } from "@/components/shared/flag";
import { cn } from "@/lib/utils";

/* ── Problem → Solution ──────────────────────────────────────────────────── */

const PROBLEM_CARDS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Users,
    title: "Identify Active Buyers",
    body: "Surface importers already showing demand for your API, FDF or KSM, instead of starting business development from a cold list.",
  },
  {
    icon: Factory,
    title: "Track Reliable Suppliers",
    body: "Compare exporters and contract manufacturers by visible shipment history so sourcing decisions rest on evidence, not a single quote.",
  },
  {
    icon: LineChart,
    title: "Analyze Pricing Trends",
    body: "Review shipment-level values across routes and periods to sanity-check quotes and negotiate from an informed position.",
  },
  {
    icon: Globe2,
    title: "Discover High-Potential Markets",
    body: "Rank destination and origin countries by trade activity to prioritise where a molecule or formulation is worth pursuing next.",
  },
];

/* Raw shipment record — one illustrative example, consistent with the
   Metformin API sample used throughout the rest of this page. */
const RAW_RECORD_FIELDS = [
  { label: "Product", value: "Metformin HCl" },
  { label: "HS code", value: "2929.90" },
  { label: "Buyer", value: "Arclight Medical Supplies" },
  { label: "Supplier", value: "Northstar Industrial Components" },
  { label: "Quantity", value: "6.4K kg" },
  { label: "Value", value: "$19,815" },
  { label: "Origin → destination", value: "IN → GB" },
];

const INTELLIGENCE_CHIPS: { icon: LucideIcon; label: string }[] = [
  { icon: Users, label: "Buyer Mapping" },
  { icon: ShieldCheck, label: "Supplier Validation" },
  { icon: LineChart, label: "Price Benchmarking" },
  { icon: Ship, label: "Shipment Analysis" },
  { icon: Globe2, label: "Market Ranking" },
  { icon: Radar, label: "Competitor Tracking" },
];

const DECISION_OUTPUTS: { icon: LucideIcon; label: string; value: string }[] = [
  { icon: Users, label: "Active buyers", value: "5" },
  { icon: Factory, label: "Reliable suppliers", value: "4" },
  { icon: DollarSign, label: "Average price", value: "$3/kg" },
  { icon: MapIcon, label: "Top markets", value: "40" },
  { icon: Gauge, label: "Opportunity score", value: "72/100" },
];

/** Connector between the three artifact stages — horizontal on desktop, vertical on mobile. */
function StageConnector() {
  return (
    <div className="flex shrink-0 items-center justify-center py-2 lg:py-0">
      <ArrowRight className="hidden size-6 shrink-0 text-[var(--chart-2)] lg:block" aria-hidden />
      <ChevronDown className="size-6 shrink-0 text-[var(--chart-2)] lg:hidden" aria-hidden />
    </div>
  );
}

/**
 * The section's main visual: raw shipment record → Vaskodigama's
 * intelligence layer → structured decision output. Built from cards, chips
 * and connectors only (no charting library) — the point is legibility, not
 * decoration.
 */
function DataTransformArtifact() {
  return (
    <div className="rounded-[28px] border border-border bg-surface p-5 sm:p-8">
      <div className="flex flex-col items-stretch lg:flex-row lg:items-center">
        {/* Stage 1 — raw shipment data */}
        <div className="flex-1 rounded-2xl border border-border bg-background p-5 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-surface-2 text-muted-strong">
              <Database className="size-4" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-navy">Raw shipment data</p>
              <p className="text-[11px] text-muted">Unstructured trade record</p>
            </div>
          </div>
          <dl className="mt-4 space-y-2 border-t border-dashed border-border pt-3">
            {RAW_RECORD_FIELDS.map((f) => (
              <div key={f.label} className="flex items-baseline justify-between gap-3 text-xs">
                <dt className="shrink-0 text-muted">{f.label}</dt>
                <dd className="truncate text-right font-medium text-muted-strong">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <StageConnector />

        {/* Stage 2 — Vaskodigama intelligence layer */}
        <div className="relative flex-1 overflow-hidden rounded-2xl bg-navy p-5 shadow-md lg:flex-[1.15]">
          <div className="bg-route-grid absolute inset-0 opacity-40" aria-hidden />
          <div className="relative">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-[var(--chart-2)]">
                <Cpu className="size-4" aria-hidden />
              </span>
              <p className="text-sm font-semibold text-white">Vaskodigama Intelligence Layer</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {INTELLIGENCE_CHIPS.map((c) => {
                const Icon = c.icon;
                return (
                  <span
                    key={c.label}
                    className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-2 text-[11px] font-medium text-white/90"
                  >
                    <Icon className="size-3.5 shrink-0 text-[var(--chart-2)]" aria-hidden />
                    {c.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <StageConnector />

        {/* Stage 3 — structured decision output */}
        <div className="flex-1 rounded-2xl border border-primary/15 bg-primary-soft p-5 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-background text-primary">
              <Target className="size-4" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-navy">Business decision output</p>
              <p className="text-[11px] text-muted">Structured, decision-ready</p>
            </div>
          </div>
          <ul className="mt-4 space-y-2">
            {DECISION_OUTPUTS.map((o) => {
              const Icon = o.icon;
              return (
                <li
                  key={o.label}
                  className="flex items-center justify-between gap-2 rounded-lg bg-background px-3 py-2 text-xs"
                >
                  <span className="flex items-center gap-1.5 text-muted-strong">
                    <Icon className="size-3.5 shrink-0 text-primary" aria-hidden />
                    {o.label}
                  </span>
                  <span className="font-semibold tabular-nums text-navy">{o.value}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
        Illustrative example, one Metformin API record <IllustrativeBadge />
      </p>
    </div>
  );
}

export function ProblemSolution() {
  return (
    <>
      <Reveal className="mx-auto max-w-2xl text-center">
        <Eyebrow>Why Vaskodigama</Eyebrow>
        <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
          Pharma Trade Data Is Complex. Vaskodigama Makes It Actionable.
        </h2>
        <p className="mt-3 text-muted">
          Pharmaceutical companies often struggle to identify reliable buyers,
          suppliers, pricing benchmarks and market demand across global trade
          records. Vaskodigama organises API, FDF and KSM trade intelligence
          into searchable, structured, decision-ready insights.
        </p>
      </Reveal>

      <Reveal delay={80} className="mt-10">
        <DataTransformArtifact />
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PROBLEM_CARDS.map((c, i) => {
          const Icon = c.icon;
          return (
            <Reveal key={c.title} delay={i * 70}>
              <div className="tile-glow flex h-full flex-col rounded-xl border border-border bg-background p-5">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-semibold text-navy">{c.title}</h3>
                <p className="mt-1.5 flex-1 text-sm text-muted">{c.body}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </>
  );
}

/* ── Product categories ──────────────────────────────────────────────────── */

interface ProductCategory {
  icon: LucideIcon;
  tag: string;
  title: string;
  body: string;
  tint: string;
}

const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    icon: FlaskConical,
    tag: "APIs",
    title: "Active Pharmaceutical Ingredients (APIs)",
    body: "Search API trade records, identify active buyers and suppliers, and analyse import-export volume, pricing and destination markets.",
    tint: "bg-primary-soft text-primary",
  },
  {
    icon: Pill,
    tag: "FDFs",
    title: "Finished Dosage Formulations (FDFs)",
    body: "Explore formulation-level trade intelligence — product demand, buyer activity, supplier consistency and global distribution patterns.",
    tint: "bg-[color-mix(in_srgb,var(--chart-2)_16%,white)] text-[var(--chart-2)]",
  },
  {
    icon: Beaker,
    tag: "KSMs",
    title: "Key Starting Materials (KSMs)",
    body: "Track KSM and intermediate trade flows, supplier networks, origin countries and sourcing opportunities across the supply chain.",
    tint: "bg-success-soft text-success",
  },
];

export function ProductCategories() {
  return (
    <>
      <Reveal className="mx-auto max-w-2xl text-center">
        <Eyebrow>Product intelligence</Eyebrow>
        <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
          One platform for APIs, FDFs and KSMs
        </h2>
        <p className="mt-3 text-muted">
          Search across three connected layers of the pharmaceutical supply
          chain, each with its own trade view.
        </p>
      </Reveal>
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {PRODUCT_CATEGORIES.map((c, i) => {
          const Icon = c.icon;
          return (
            <Reveal key={c.tag} delay={i * 90}>
              <Card className="tile-glow h-full">
                <CardContent className="flex h-full flex-col pt-6">
                  <div className="flex items-center justify-between">
                    <span className={cn("flex size-11 items-center justify-center rounded-xl", c.tint)}>
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="rounded-full border border-border-strong px-2.5 py-0.5 text-xs font-semibold text-muted-strong">
                      {c.tag}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-navy">{c.title}</h3>
                  <p className="mt-1.5 flex-1 text-sm text-muted">{c.body}</p>
                  <Link
                    href="/solutions/pharmaceuticals"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    Learn more <ArrowRight className="size-3.5" aria-hidden />
                  </Link>
                </CardContent>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </>
  );
}

/* ── Key platform features ───────────────────────────────────────────────── */

type MicroVisual = { kind: "bars"; values: number[] } | { kind: "route" } | { kind: "table" };

const KEY_FEATURES: { icon: LucideIcon; title: string; body: string; visual: MicroVisual }[] = [
  {
    icon: ShoppingCart,
    title: "Buyer Intelligence",
    body: "Find active importers, buyer portfolios, purchase frequency and product-wise buyer activity.",
    visual: { kind: "bars", values: [40, 65, 55, 80, 70] },
  },
  {
    icon: Factory,
    title: "Supplier Intelligence",
    body: "Identify exporters, shipment history, supply countries and company-level performance.",
    visual: { kind: "bars", values: [60, 45, 75, 50, 85] },
  },
  {
    icon: LineChart,
    title: "Price Intelligence",
    body: "Analyse average pricing, import/export rates, value trends and product-wise price movement.",
    visual: { kind: "bars", values: [30, 42, 38, 58, 74] },
  },
  {
    icon: Ship,
    title: "Shipment Records",
    body: "Access structured trade records with product, quantity, value, country, buyer and supplier detail.",
    visual: { kind: "table" },
  },
  {
    icon: MapIcon,
    title: "Market Analysis",
    body: "Understand which countries are importing or exporting a given API, FDF or KSM, and where demand is rising.",
    visual: { kind: "route" },
  },
  {
    icon: Radar,
    title: "Competitor Tracking",
    body: "Monitor comparable companies — their trade activity, product focus and shipment volume.",
    visual: { kind: "bars", values: [55, 55, 68, 40, 62] },
  },
];

/** Tiny inline accent under each feature card — real signal, not decoration. */
function FeatureMicroVisual({ visual }: { visual: MicroVisual }) {
  if (visual.kind === "bars") {
    return (
      <div className="mt-4 flex h-8 items-end gap-1" aria-hidden>
        {visual.values.map((v, i) => (
          <span
            key={i}
            className="w-full rounded-sm bg-primary/25"
            style={{ height: `${v}%` }}
          />
        ))}
      </div>
    );
  }
  if (visual.kind === "route") {
    return (
      <svg viewBox="0 0 120 32" className="mt-4 h-8 w-full" aria-hidden>
        <path
          d="M4 26 C 30 6, 60 6, 84 18 S 112 8, 116 6"
          fill="none"
          stroke="var(--primary)"
          strokeOpacity="0.35"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="1 5"
        />
        <circle cx="4" cy="26" r="2.5" fill="var(--chart-2)" />
        <circle cx="116" cy="6" r="2.5" fill="var(--primary)" />
      </svg>
    );
  }
  return (
    <div className="mt-4 space-y-1" aria-hidden>
      {[100, 85, 70].map((w, i) => (
        <div key={i} className="flex gap-1">
          <span className="h-1.5 rounded-full bg-primary/25" style={{ width: `${w * 0.3}%` }} />
          <span className="h-1.5 rounded-full bg-border" style={{ width: `${w * 0.55}%` }} />
        </div>
      ))}
    </div>
  );
}

export function KeyFeatures() {
  return (
    <>
      <Reveal className="mx-auto max-w-2xl text-center">
        <Eyebrow>Platform features</Eyebrow>
        <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
          Everything you need to decode pharma trade opportunities
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {KEY_FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <Reveal key={f.title} delay={i * 60}>
              <div className="tile-glow flex h-full flex-col rounded-xl border border-border bg-background p-5">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-semibold text-navy">{f.title}</h3>
                <p className="mt-1.5 flex-1 text-sm text-muted">{f.body}</p>
                <FeatureMicroVisual visual={f.visual} />
              </div>
            </Reveal>
          );
        })}
      </div>
    </>
  );
}

/* ── Use cases ────────────────────────────────────────────────────────────── */

const USE_CASES: { icon: LucideIcon; title: string; body: string; signal: string }[] = [
  {
    icon: Briefcase,
    title: "Business Development Teams",
    body: "Find new buyers, target high-demand markets and identify product expansion opportunities.",
    signal: "Buyer data",
  },
  {
    icon: ClipboardList,
    title: "Procurement Teams",
    body: "Discover reliable suppliers, compare sourcing markets and evaluate pricing benchmarks.",
    signal: "Supplier data",
  },
  {
    icon: SearchIcon,
    title: "Market Research Teams",
    body: "Analyse trade trends, competitor movement and product demand across geographies.",
    signal: "Market data",
  },
  {
    icon: Truck,
    title: "Export-Import Teams",
    body: "Track shipment records, buyer-supplier movements and country-level trade flows.",
    signal: "Shipment data",
  },
  {
    icon: Building2,
    title: "Pharmaceutical Manufacturers",
    body: "Understand global demand, supply gaps, active buyers and export opportunities for APIs, FDFs and KSMs.",
    signal: "Trade data",
  },
];

export function UseCases() {
  return (
    <>
      <Reveal className="mx-auto max-w-2xl text-center">
        <Eyebrow>Who it&apos;s for</Eyebrow>
        <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
          Built for teams that depend on pharma trade intelligence
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {USE_CASES.map((u, i) => {
          const Icon = u.icon;
          return (
            <Reveal key={u.title} delay={i * 70}>
              <div className="flex h-full flex-col rounded-xl border border-border bg-background p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[11px] font-semibold text-muted-strong">
                    {u.signal}
                  </span>
                </div>
                <h3 className="mt-3.5 font-semibold text-navy">{u.title}</h3>
                <p className="mt-1.5 flex-1 text-sm text-muted">{u.body}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </>
  );
}

/* ── Why Vaskodigama ─────────────────────────────────────────────────────── */

const WHY_POINTS = [
  "Pharma-specific trade intelligence, not a generic commodity tool",
  "API, FDF and KSM focused search from one field",
  "Buyer and supplier discovery backed by shipment evidence",
  "Pricing and shipment-level analysis",
  "Country-wise import-export insight",
  "Structured, decision-ready data instead of raw records",
  "Faster business decisions for sourcing and sales",
  "Useful across sourcing, sales, procurement and competitive intelligence",
];

export function WhyVaskodigama() {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
      <Reveal>
        <Eyebrow>Why choose us</Eyebrow>
        <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
          Why Choose Vaskodigama?
        </h2>
        <p className="mt-3 text-muted">
          Purpose-built for the way pharmaceutical trade actually moves — not
          adapted from a generic logistics or commodity platform.
        </p>
        <ButtonLink href="/solutions/pharmaceuticals" variant="outline" className="mt-6 rounded-full">
          See the pharma solution <ArrowRight className="size-4" aria-hidden />
        </ButtonLink>
      </Reveal>
      <Reveal delay={100}>
        <ul className="grid gap-3 sm:grid-cols-2">
          {WHY_POINTS.map((p) => (
            <li
              key={p}
              className="flex items-start gap-2.5 rounded-lg border border-border bg-background p-3.5 text-sm text-navy"
            >
              <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
              {p}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}

/* ── Global coverage ─────────────────────────────────────────────────────── */

interface CoverageChip {
  label: string;
  value: string;
}

/**
 * Illustrative route pairs — abstract arc layout (percent-space), not a
 * geographic projection. Node positions are looked up by code so the two
 * lists (routes, nodes) can't drift out of sync.
 */
const ROUTE_NODES = [
  { code: "IN", x: 8.8, y: 52.9 },
  { code: "GB", x: 50, y: 23.5 },
  { code: "DE", x: 67.6, y: 41.2 },
  { code: "PL", x: 82.4, y: 26.5 },
  { code: "MX", x: 17.6, y: 76.5 },
  { code: "US", x: 32.4, y: 32.4 },
  { code: "CN", x: 91.2, y: 58.8 },
  { code: "SA", x: 55.9, y: 76.5 },
] as const;

const TRADE_ROUTES: [string, string][] = [
  ["IN", "GB"],
  ["IN", "DE"],
  ["DE", "PL"],
  ["MX", "US"],
  ["CN", "SA"],
];

/**
 * Abstract trade-route arc diagram — navy/cyan only, no literal world map.
 * Arcs are drawn in a percent-space SVG background; flag nodes are plain
 * HTML overlaid on top (not SVG foreignObject, which renders unreliably
 * for nested flag SVGs across browsers).
 */
function TradeRouteMap() {
  const nodeByCode = Object.fromEntries(ROUTE_NODES.map((n) => [n.code, n]));
  return (
    <div className="relative mx-auto mt-10 h-[220px] w-full max-w-3xl sm:h-[260px]">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Illustrative pharmaceutical trade routes between demonstration markets"
      >
        <g fill="none" strokeLinecap="round">
          {TRADE_ROUTES.map(([from, to], i) => {
            const a = nodeByCode[from];
            const b = nodeByCode[to];
            const midX = (a.x + b.x) / 2;
            const midY = Math.min(a.y, b.y) - 16;
            return (
              <path
                key={`${from}-${to}`}
                className="animate-route"
                style={{ animationDelay: `${i * 0.25}s` }}
                d={`M${a.x} ${a.y} Q ${midX} ${midY}, ${b.x} ${b.y}`}
                stroke="var(--chart-2)"
                strokeOpacity="0.55"
                strokeWidth="0.4"
                strokeDasharray="0.6 1.6"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </g>
      </svg>
      {ROUTE_NODES.map((n) => (
        <div
          key={n.code}
          className="absolute flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border-strong bg-background shadow-xs"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
          <Flag code={n.code} className="h-[13px] w-[18px]" />
        </div>
      ))}
    </div>
  );
}

export function GlobalCoverage({ chips }: { chips: CoverageChip[] }) {
  return (
    <div id="global-coverage" className="surface-hero-light relative overflow-hidden rounded-[28px] border border-border px-6 py-14 sm:px-12">
      <div className="bg-route-grid-light absolute inset-0 opacity-70" aria-hidden />
      <div className="relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Global coverage</Eyebrow>
          <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
            Explore Pharma Trade Across Global Markets
          </h2>
          <p className="mt-3 text-muted">
            Vaskodigama helps teams understand how pharmaceutical products move
            across countries — who is buying, who is supplying, which markets
            are active, and where opportunity is emerging.
          </p>
        </Reveal>
        <Reveal delay={80}>
          <TradeRouteMap />
        </Reveal>
        <Reveal delay={100} className="mt-9 flex flex-wrap justify-center gap-3">
          {chips.map((c) => (
            <span
              key={c.label}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm shadow-xs"
            >
              <span className="font-bold tabular-nums text-navy">{c.value}</span>
              <span className="text-muted">{c.label}</span>
            </span>
          ))}
        </Reveal>
        <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-muted">
          Illustrative demonstration coverage.
          <IllustrativeBadge />
        </p>
      </div>
    </div>
  );
}

/* ── Final CTA ────────────────────────────────────────────────────────────── */

const CTA_SUMMARY = [
  "Search APIs, FDFs and KSMs",
  "Find buyers and suppliers",
  "Compare pricing",
  "Discover markets",
  "Make faster trade decisions",
];

export function LandingFinalCta() {
  return (
    <div className="surface-aurora relative overflow-hidden rounded-[28px] px-6 py-14 sm:px-12">
      <div className="bg-route-grid absolute inset-0 opacity-60" aria-hidden />
      <div className="relative grid items-center gap-10 text-center lg:grid-cols-[1.2fr_0.8fr] lg:text-left">
        <div>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Start discovering pharma trade{" "}
            <span className="text-gradient-light">opportunities</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/75 lg:mx-0">
            Search APIs, FDFs and KSMs, identify active buyers and suppliers,
            compare pricing, track shipment records, and discover
            high-potential markets from one structured intelligence platform.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
            <ButtonLink href="/contact?industry=pharma" className="btn-gradient h-12 rounded-full px-7 text-base">
              Request a Demo <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
            <Link
              href="/explore?industry=pharmaceuticals"
              className="inline-flex h-12 items-center rounded-full border border-white/30 px-7 text-base font-semibold text-white hover:bg-white/10"
            >
              Explore Demo
            </Link>
          </div>
        </div>
        <ul className="mx-auto w-full max-w-xs space-y-2.5 rounded-2xl border border-white/15 bg-white/5 p-5 text-left backdrop-blur-sm">
          {CTA_SUMMARY.map((s) => (
            <li key={s} className="flex items-start gap-2.5 text-sm text-white/90">
              <Check className="mt-0.5 size-4 shrink-0 text-[var(--chart-2)]" aria-hidden />
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── Search-to-insight journey ───────────────────────────────────────────── */

const JOURNEY_STEPS: { icon: LucideIcon; label: string; body: string }[] = [
  { icon: SearchIcon, label: "Search product", body: "Enter an API, FDF or KSM" },
  { icon: ClipboardList, label: "View trade records", body: "Structured shipment history" },
  { icon: Users, label: "Identify buyers/suppliers", body: "See who's active, right now" },
  { icon: DollarSign, label: "Compare pricing", body: "Benchmark shipment-level value" },
  { icon: Globe2, label: "Discover markets", body: "Rank countries by trade activity" },
  { icon: Target, label: "Take action", body: "Reach out with evidence in hand" },
];

export function SearchJourney() {
  return (
    <Reveal className="mx-auto max-w-5xl">
      <ol className="grid gap-6 sm:grid-cols-3 lg:grid-cols-6">
        {JOURNEY_STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <li key={s.label} className="relative flex flex-col items-center text-center">
              {i < JOURNEY_STEPS.length - 1 ? (
                <span
                  className="absolute left-1/2 top-6 hidden h-px w-full bg-border sm:block"
                  aria-hidden
                />
              ) : null}
              <span className="relative flex size-12 items-center justify-center rounded-full border border-border bg-background text-primary shadow-xs">
                <Icon className="size-5" aria-hidden />
              </span>
              <p className="mt-3 text-sm font-semibold text-navy">{s.label}</p>
              <p className="mt-1 text-xs text-muted">{s.body}</p>
            </li>
          );
        })}
      </ol>
    </Reveal>
  );
}

/* ── Buyer–supplier network artifact ─────────────────────────────────────── */

// 7 nodes, evenly spaced at 360/7 ≈ 51.43° apart — must not reduce to a
// multiple of 360 apart from another entry, or two nodes render on top of
// each other (e.g. -90 and 270 are the same position).
const NETWORK_NODES: { icon: LucideIcon; label: string; angle: number }[] = [
  { icon: ShoppingCart, label: "Importers", angle: -90 },
  { icon: Ship, label: "Exporters", angle: -38.57 },
  { icon: Factory, label: "Suppliers", angle: 12.86 },
  { icon: MapIcon, label: "Origin countries", angle: 64.29 },
  { icon: Globe2, label: "Destination markets", angle: 115.71 },
  { icon: Truck, label: "Shipment records", angle: 167.14 },
  { icon: LineChart, label: "Price benchmarks", angle: 218.57 },
];

/**
 * Product-at-the-centre relationship diagram — pure CSS/trig layout, no
 * charting library. Node positions are computed from fixed angles so the
 * connecting lines and icons stay perfectly aligned at any size.
 */
export function BuyerSupplierNetwork() {
  const radius = 42; // percent of container
  return (
    <Reveal className="relative mx-auto aspect-square w-full max-w-md">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        {NETWORK_NODES.map((n) => {
          const rad = (n.angle * Math.PI) / 180;
          const x = 50 + radius * Math.cos(rad);
          const y = 50 + radius * Math.sin(rad);
          return (
            <line
              key={n.label}
              x1="50"
              y1="50"
              x2={x}
              y2={y}
              stroke="var(--chart-2)"
              strokeOpacity="0.4"
              strokeWidth="0.6"
              strokeDasharray="1.2 1.6"
            />
          );
        })}
      </svg>

      {/* Centre node */}
      <div className="absolute left-1/2 top-1/2 flex w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-2xl border border-border bg-background p-3 text-center shadow-md">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <FlaskConical className="size-4.5" aria-hidden />
        </span>
        <p className="mt-1.5 text-xs font-semibold text-navy">Metformin API</p>
      </div>

      {/* Connected nodes */}
      {NETWORK_NODES.map((n) => {
        const rad = (n.angle * Math.PI) / 180;
        const x = 50 + radius * Math.cos(rad);
        const y = 50 + radius * Math.sin(rad);
        const Icon = n.icon;
        return (
          <div
            key={n.label}
            className="absolute flex w-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 text-center"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <span className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-primary shadow-xs">
              <Icon className="size-4" aria-hidden />
            </span>
            <p className="text-[11px] font-medium leading-tight text-muted-strong">{n.label}</p>
          </div>
        );
      })}
    </Reveal>
  );
}

/* Re-exported for the icon used in the trust strip on the page itself. */
export const trustIcons = { ShieldCheck, TrendingUp, Award };
