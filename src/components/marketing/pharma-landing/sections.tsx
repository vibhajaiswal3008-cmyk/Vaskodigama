import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Users,
  Factory,
  LineChart,
  Globe2,
  Pill,
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
  Layers,
  ArrowDownToLine,
  ArrowUpFromLine,
  Package,
  Wheat,
  Droplets,
  Shirt,
  Gem,
  Settings2,
  ShoppingBag,
  Boxes,
} from "lucide-react";
import { Eyebrow } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { IllustrativeBadge } from "@/components/shared/illustrative";
import { Flag } from "@/components/shared/flag";
import { cn } from "@/lib/utils";

/* ── Data coverage ────────────────────────────────────────────────────────── */

interface CoverageCard {
  icon: LucideIcon;
  value?: string;
  title: string;
  body: string;
}

const DATA_COVERAGE_CARDS: CoverageCard[] = [
  {
    icon: Globe2,
    value: "40+",
    title: "Countries covered",
    body: "Import and export activity spanning major global trade markets.",
  },
  {
    icon: Layers,
    value: "All",
    title: "HSN chapters",
    body: "Full harmonised-system coverage, from raw materials to finished goods.",
  },
  {
    icon: ArrowDownToLine,
    title: "Import data",
    body: "See what markets are bringing in, from whom, and at what price.",
  },
  {
    icon: ArrowUpFromLine,
    title: "Export data",
    body: "Track what's moving out, to which destinations, and in what volume.",
  },
  {
    icon: Ship,
    title: "Shipment records",
    body: "Product, quantity, value and route detail behind every trade.",
  },
  {
    icon: Users,
    title: "Buyer & supplier mapping",
    body: "Identify the companies actually active on both sides of a trade.",
  },
  {
    icon: MapIcon,
    title: "Country-wise insights",
    body: "Compare demand and supply activity across origin and destination markets.",
  },
  {
    icon: Package,
    title: "Product-wise trade movement",
    body: "Follow how a specific product or category moves through global trade.",
  },
];

export function DataCoverage() {
  return (
    <>
      <Reveal className="mx-auto max-w-2xl text-center">
        <Eyebrow>Data coverage</Eyebrow>
        <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
          Trade Data Coverage Built for Global Market Decisions
        </h2>
        <p className="mt-3 text-muted">
          Vaskodigama is not limited to one industry — it&apos;s a structured
          view of how products move across global import-export markets.
        </p>
      </Reveal>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DATA_COVERAGE_CARDS.map((c, i) => {
          const Icon = c.icon;
          return (
            <Reveal key={c.title} delay={i * 50}>
              <div className="tile-glow flex h-full flex-col rounded-xl border border-border bg-background p-5">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                {c.value ? (
                  <p className="mt-4 text-2xl font-extrabold tabular-nums text-navy">{c.value}</p>
                ) : null}
                <h3 className={cn("font-semibold text-navy", c.value ? "mt-1" : "mt-4")}>{c.title}</h3>
                <p className="mt-1.5 flex-1 text-sm text-muted">{c.body}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </>
  );
}

/* ── Raw data → decision-ready artifact ──────────────────────────────────── */

/* Raw shipment record — one illustrative example, used consistently across
   this page's sample artifacts. */
const RAW_RECORD_FIELDS = [
  { label: "Product", value: "Solar Panels" },
  { label: "HS code", value: "8541.40" },
  { label: "Buyer", value: "Arclight Energy Supplies" },
  { label: "Supplier", value: "Northstar Industrial Components" },
  { label: "Quantity", value: "6.4K units" },
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
  { icon: Users, label: "Active buyers", value: "Identified" },
  { icon: Factory, label: "Reliable suppliers", value: "Verified" },
  { icon: DollarSign, label: "Average price", value: "Benchmarked" },
  { icon: MapIcon, label: "Top markets", value: "Ranked" },
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
 * processing layer → structured decision output. Built from cards, chips
 * and connectors only (no charting library) — the point is legibility, not
 * decoration. The centre stage is deliberately the visual anchor (larger,
 * glowing badge, no text label) so it reads as the "engine" between the two
 * flanking cards rather than a plain labelled box.
 */
function DataTransformArtifact() {
  return (
    <div className="rounded-[28px] border border-border bg-surface p-5 sm:p-8">
      <div className="flex flex-col items-stretch lg:flex-row lg:items-stretch">
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

        {/* Stage 2 — processing layer (visual anchor, no text label) */}
        <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-2xl bg-navy px-5 py-8 shadow-md lg:flex-[1.3]">
          <div className="bg-route-grid absolute inset-0 opacity-40" aria-hidden />
          <div className="animate-float absolute size-36 rounded-full bg-[var(--chart-2)]/20 blur-3xl" aria-hidden />
          <span className="relative flex size-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-[var(--chart-2)] shadow-lg">
            <Cpu className="size-7" aria-hidden />
          </span>
          <div className="relative mt-6 grid w-full grid-cols-2 gap-2">
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
                  <span className="font-semibold text-navy">{o.value}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
        Illustrative example, one sample trade record <IllustrativeBadge />
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
          Vaskodigama Makes It Decision-Ready.
        </h2>
        <p className="mt-3 text-muted">
          Import-export data is often scattered, unstructured and difficult to
          interpret. Vaskodigama organises trade records into clear business
          insights so teams can understand who is buying, who is supplying,
          what prices are moving, which countries are active, and where new
          opportunities exist.
        </p>
      </Reveal>

      <Reveal delay={80} className="mt-10">
        <DataTransformArtifact />
      </Reveal>
    </>
  );
}

/* ── HS chapter coverage ──────────────────────────────────────────────────── */

interface HsCategory {
  icon: LucideIcon;
  title: string;
  tint: string;
}

const HS_CATEGORIES: HsCategory[] = [
  { icon: Wheat, title: "Agriculture & Food Products", tint: "bg-success-soft text-success" },
  { icon: Boxes, title: "Chemicals & Allied Products", tint: "bg-primary-soft text-primary" },
  { icon: Droplets, title: "Plastics & Rubber", tint: "bg-[color-mix(in_srgb,var(--chart-2)_16%,white)] text-[var(--chart-2)]" },
  { icon: Shirt, title: "Textiles & Apparel", tint: "bg-primary-soft text-primary" },
  { icon: Gem, title: "Metals & Minerals", tint: "bg-warning-soft text-warning" },
  { icon: Settings2, title: "Machinery & Equipment", tint: "bg-success-soft text-success" },
  { icon: Cpu, title: "Electronics & Electricals", tint: "bg-[color-mix(in_srgb,var(--chart-2)_16%,white)] text-[var(--chart-2)]" },
  { icon: Pill, title: "Pharma & Healthcare", tint: "bg-primary-soft text-primary" },
  { icon: ShoppingBag, title: "Consumer Goods", tint: "bg-warning-soft text-warning" },
  { icon: Package, title: "Industrial Materials", tint: "bg-success-soft text-success" },
];

export function HsChapterCoverage() {
  return (
    <>
      <Reveal className="mx-auto max-w-2xl text-center">
        <Eyebrow>HSN chapter coverage</Eyebrow>
        <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
          Coverage Across All HSN Chapters
        </h2>
        <p className="mt-3 text-muted">
          From agriculture, chemicals, plastics, textiles and metals to
          machinery, electronics, pharma, consumer goods and industrial
          materials — Vaskodigama supports import-export intelligence across
          all HSN chapters.
        </p>
      </Reveal>
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {HS_CATEGORIES.map((c, i) => {
          const Icon = c.icon;
          return (
            <Reveal key={c.title} delay={i * 40}>
              <div className="tile-glow flex h-full flex-col items-center gap-2.5 rounded-xl border border-border bg-background p-4 text-center">
                <span className={cn("flex size-10 items-center justify-center rounded-xl", c.tint)}>
                  <Icon className="size-5" aria-hidden />
                </span>
                <p className="text-xs font-semibold leading-tight text-navy">{c.title}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </>
  );
}

/* ── Core intelligence features ──────────────────────────────────────────── */

type MicroVisual = { kind: "bars"; values: number[] } | { kind: "route" } | { kind: "table" };

const KEY_FEATURES: { icon: LucideIcon; title: string; body: string; visual: MicroVisual }[] = [
  {
    icon: ShoppingCart,
    title: "Buyer Intelligence",
    body: "Find active importers, buyer portfolios, purchase frequency, product-wise buyer activity and country-wise demand.",
    visual: { kind: "bars", values: [40, 65, 55, 80, 70] },
  },
  {
    icon: Factory,
    title: "Supplier & Exporter Intelligence",
    body: "Identify exporters, suppliers, origin countries, shipment history, supplier consistency and company-level trade activity.",
    visual: { kind: "bars", values: [60, 45, 75, 50, 85] },
  },
  {
    icon: LineChart,
    title: "Price Intelligence",
    body: "Analyse average import/export prices, shipment values, quantity trends, price movement and route-level pricing benchmarks.",
    visual: { kind: "bars", values: [30, 42, 38, 58, 74] },
  },
  {
    icon: Ship,
    title: "Shipment Records",
    body: "Access structured trade records with product description, HS code, buyer, supplier, origin, destination, quantity, value and route.",
    visual: { kind: "table" },
  },
  {
    icon: MapIcon,
    title: "Market Analysis",
    body: "Understand which countries are importing or exporting a product, where demand is rising, and which product-country combinations are worth exploring.",
    visual: { kind: "route" },
  },
  {
    icon: Radar,
    title: "Competitor Tracking",
    body: "Track what similar companies are importing or exporting, which markets they serve, and their shipment activity and trading partners.",
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
        <Eyebrow>Core intelligence features</Eyebrow>
        <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
          Everything you need to decode global trade opportunities
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
    body: "Find active buyers, target high-demand countries, and build export sales pipelines.",
    signal: "Buyer data",
  },
  {
    icon: ClipboardList,
    title: "Procurement Teams",
    body: "Discover reliable suppliers, compare sourcing markets and evaluate pricing benchmarks.",
    signal: "Supplier data",
  },
  {
    icon: ArrowDownToLine,
    title: "Importers",
    body: "Track suppliers, compare origin countries, understand price trends and identify better sourcing opportunities.",
    signal: "Import data",
  },
  {
    icon: ArrowUpFromLine,
    title: "Exporters",
    body: "Find active buyers, evaluate destination markets and identify product demand across countries.",
    signal: "Export data",
  },
  {
    icon: Building2,
    title: "Manufacturers",
    body: "Understand where products are moving, which countries are buying, and where expansion opportunities exist.",
    signal: "Trade data",
  },
  {
    icon: SearchIcon,
    title: "Market Research Teams",
    body: "Analyse trade trends, competitor movement, product demand and country-wise activity.",
    signal: "Market data",
  },
  {
    icon: Truck,
    title: "Supply Chain Teams",
    body: "Understand trade routes, origin-destination movement, supplier networks and shipment patterns.",
    signal: "Shipment data",
  },
  {
    icon: LineChart,
    title: "Consulting & Analytics Teams",
    body: "Use structured trade data to support market studies, opportunity assessment and competitive intelligence projects.",
    signal: "Structured data",
  },
];

export function UseCases() {
  return (
    <>
      <Reveal className="mx-auto max-w-2xl text-center">
        <Eyebrow>Who it&apos;s for</Eyebrow>
        <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
          Built for Teams That Depend on Trade Intelligence
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {USE_CASES.map((u, i) => {
          const Icon = u.icon;
          return (
            <Reveal key={u.title} delay={i * 60}>
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

/* ── Why Vaskodigama (merged differentiation section) ────────────────────── */

type WhyVisual =
  | { kind: "stat" }
  | { kind: "network" }
  | { kind: "bars" }
  | { kind: "roles" }
  | { kind: "checklist" };

function WhyModuleVisual({ visual }: { visual: WhyVisual }) {
  if (visual.kind === "stat") {
    return (
      <div className="mt-4 flex gap-2" aria-hidden>
        <span className="flex-1 rounded-lg bg-surface-2 px-2 py-1.5 text-center text-xs font-bold text-navy">40+</span>
        <span className="flex-1 rounded-lg bg-surface-2 px-2 py-1.5 text-center text-xs font-bold text-navy">All HSN</span>
      </div>
    );
  }
  if (visual.kind === "network") {
    return (
      <svg viewBox="0 0 120 40" className="mt-4 h-10 w-full" aria-hidden>
        <g stroke="var(--chart-2)" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="2 3">
          <line x1="60" y1="20" x2="16" y2="8" />
          <line x1="60" y1="20" x2="16" y2="32" />
          <line x1="60" y1="20" x2="104" y2="8" />
          <line x1="60" y1="20" x2="104" y2="32" />
        </g>
        <circle cx="60" cy="20" r="6" fill="var(--primary)" />
        <circle cx="16" cy="8" r="3.5" fill="var(--chart-2)" />
        <circle cx="16" cy="32" r="3.5" fill="var(--chart-2)" />
        <circle cx="104" cy="8" r="3.5" fill="var(--chart-2)" />
        <circle cx="104" cy="32" r="3.5" fill="var(--chart-2)" />
      </svg>
    );
  }
  if (visual.kind === "bars") {
    return (
      <div className="mt-4 flex h-8 items-end gap-1" aria-hidden>
        {[35, 55, 45, 70, 60, 80].map((v, i) => (
          <span key={i} className="w-full rounded-sm bg-primary/25" style={{ height: `${v}%` }} />
        ))}
      </div>
    );
  }
  if (visual.kind === "roles") {
    const icons = [Briefcase, ClipboardList, SearchIcon];
    return (
      <div className="mt-4 flex gap-2" aria-hidden>
        {icons.map((Icon, i) => (
          <span key={i} className="flex size-8 items-center justify-center rounded-full bg-surface-2 text-primary">
            <Icon className="size-4" aria-hidden />
          </span>
        ))}
      </div>
    );
  }
  return (
    <ul className="mt-4 space-y-1.5" aria-hidden>
      {["Target market", "Approach buyer", "Evaluate supplier"].map((t) => (
        <li key={t} className="flex items-center gap-1.5 text-[11px] font-medium text-muted-strong">
          <Check className="size-3.5 shrink-0 text-success" aria-hidden />
          {t}
        </li>
      ))}
    </ul>
  );
}

const WHY_MODULES: { icon: LucideIcon; title: string; body: string; visual: WhyVisual }[] = [
  {
    icon: Globe2,
    title: "Coverage at a Glance",
    body: "Supports trade analysis across all HSN chapters and 40+ countries — useful across industries, product categories and global markets.",
    visual: { kind: "stat" },
  },
  {
    icon: Users,
    title: "Buyer & Supplier Discovery",
    body: "Identifies active buyers, importers, exporters and suppliers — backed by shipment evidence, not unverified lists or assumptions.",
    visual: { kind: "network" },
  },
  {
    icon: LineChart,
    title: "Pricing & Shipment Intelligence",
    body: "Analyses product-wise demand, shipment volume, trade value and pricing movement at the route level.",
    visual: { kind: "bars" },
  },
  {
    icon: Briefcase,
    title: "Built for Business Teams",
    body: "Supports procurement sourcing comparisons, business development pipelines, and market research and strategy tracking.",
    visual: { kind: "roles" },
  },
  {
    icon: Target,
    title: "Decision-Ready Output",
    body: "Turns raw trade data into clear actions — which market to target, which buyer to approach, and which opportunity to prioritise.",
    visual: { kind: "checklist" },
  },
];

export function WhyVaskodigama() {
  return (
    <>
      <Reveal className="mx-auto max-w-2xl text-center">
        <Eyebrow>Why choose us</Eyebrow>
        <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
          Why Vaskodigama?
        </h2>
        <p className="mt-3 text-muted">
          Converts scattered import-export records into structured,
          decision-ready trade intelligence — purpose-built for the way
          global trade actually moves, not a generic logistics tool.
        </p>
      </Reveal>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {WHY_MODULES.map((m, i) => {
          const Icon = m.icon;
          return (
            <Reveal key={m.title} delay={i * 60}>
              <div className="tile-glow flex h-full flex-col rounded-xl border border-border bg-background p-5">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-semibold text-navy">{m.title}</h3>
                <p className="mt-1.5 flex-1 text-sm text-muted">{m.body}</p>
                <WhyModuleVisual visual={m.visual} />
              </div>
            </Reveal>
          );
        })}
      </div>
      <Reveal delay={300} className="mt-8 text-center">
        <ButtonLink href="/platform" variant="outline" className="rounded-full">
          See the platform <ArrowRight className="size-4" aria-hidden />
        </ButtonLink>
      </Reveal>
    </>
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
    <div className="relative h-[220px] w-full sm:h-[260px]">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Illustrative import-export trade routes between example markets"
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

interface CoverageFeature {
  icon: LucideIcon;
  title: string;
  body: string;
}

const COVERAGE_FEATURES: CoverageFeature[] = [
  {
    icon: ArrowDownToLine,
    title: "Import Market Coverage",
    body: "Identify countries actively importing specific products and HSN categories.",
  },
  {
    icon: ArrowUpFromLine,
    title: "Export Market Coverage",
    body: "Understand origin countries, exporting markets and supplier-side movement.",
  },
  {
    icon: Users,
    title: "Buyer & Importer Mapping",
    body: "Discover active buyers, importers and company-level trade connections.",
  },
  {
    icon: Factory,
    title: "Supplier & Exporter Mapping",
    body: "Track suppliers, exporters and origin-side trading companies.",
  },
  {
    icon: Truck,
    title: "Origin-Destination Trade Routes",
    body: "Visualise how products move between countries through trade lanes.",
  },
];

/* Illustrative shipment rows — broad trade examples, not tied to one industry. */
const SHIPMENT_ROWS = [
  { product: "Basmati Rice", hs: "1006.30", origin: "IN", destination: "GB", qty: "4.2K kg", value: "$18,600" },
  { product: "Solar Panels", hs: "8541.40", origin: "CN", destination: "DE", qty: "1.8K units", value: "$52,300" },
  { product: "Copper Wire", hs: "7408.11", origin: "CN", destination: "US", qty: "6.5K kg", value: "$31,900" },
];

export function GlobalCoverage({ chips }: { chips: CoverageChip[] }) {
  return (
    <div id="global-coverage" className="surface-hero-light relative overflow-hidden rounded-[28px] border border-border px-6 py-14 sm:px-12">
      <div className="bg-route-grid-light absolute inset-0 opacity-70" aria-hidden />
      <div className="relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Global coverage · All HSN chapters</Eyebrow>
          <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
            Explore Import-Export Activity Across 40+ Countries
          </h2>
          <p className="mt-3 text-muted">
            Compare country-wise trade activity, identify active import and
            export markets, study trade routes, evaluate buyer-supplier
            networks, and understand where demand is emerging across global
            markets.
          </p>
        </Reveal>

        {/* Stat stack + route map */}
        <Reveal delay={80} className="mt-9 grid gap-4 lg:grid-cols-[180px_1fr]">
          <div className="flex flex-row gap-4 lg:flex-col">
            <div className="flex-1 rounded-xl border border-border bg-background p-4">
              <Globe2 className="size-5 text-primary" aria-hidden />
              <p className="mt-2 text-2xl font-extrabold text-navy">40+</p>
              <p className="text-xs text-muted">Countries</p>
            </div>
            <div className="flex-1 rounded-xl border border-border bg-background p-4">
              <Layers className="size-5 text-primary" aria-hidden />
              <p className="mt-2 text-2xl font-extrabold text-navy">All</p>
              <p className="text-xs text-muted">HSN chapters</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-background p-3">
            <TradeRouteMap />
          </div>
        </Reveal>

        {/* Coverage feature cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COVERAGE_FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={i * 50}>
                <div className="flex h-full flex-col rounded-xl border border-border bg-background p-4">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <Icon className="size-4.5" aria-hidden />
                  </span>
                  <h3 className="mt-3 text-sm font-semibold text-navy">{f.title}</h3>
                  <p className="mt-1 flex-1 text-xs text-muted">{f.body}</p>
                </div>
              </Reveal>
            );
          })}

          {/* Shipment-level intelligence — spans full width, includes mini table */}
          <Reveal delay={COVERAGE_FEATURES.length * 50} className="sm:col-span-2 lg:col-span-3">
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Ship className="size-4.5" aria-hidden />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-navy">Shipment-Level Intelligence</h3>
                  <p className="text-xs text-muted">Quantity, value, price, product and company detail behind every trade.</p>
                </div>
              </div>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted">
                      <th className="py-1.5 pr-3 font-medium">Product</th>
                      <th className="py-1.5 pr-3 font-medium">HSN code</th>
                      <th className="py-1.5 pr-3 font-medium">Route</th>
                      <th className="py-1.5 pr-3 font-medium">Qty</th>
                      <th className="py-1.5 text-right font-medium">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {SHIPMENT_ROWS.map((r) => (
                      <tr key={r.product} className="text-navy">
                        <td className="py-1.5 pr-3 text-xs font-medium">{r.product}</td>
                        <td className="py-1.5 pr-3 text-xs text-muted">{r.hs}</td>
                        <td className="py-1.5 pr-3">
                          <span className="flex items-center gap-1 whitespace-nowrap text-xs">
                            <Flag code={r.origin} className="h-[10px] w-[14px]" /> {r.origin}
                            <ArrowRight className="size-2.5 text-muted" aria-hidden />
                            <Flag code={r.destination} className="h-[10px] w-[14px]" /> {r.destination}
                          </span>
                        </td>
                        <td className="py-1.5 pr-3 text-xs text-muted">{r.qty}</td>
                        <td className="py-1.5 text-right text-xs font-semibold">{r.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted">
                  Illustrative example rows <IllustrativeBadge />
                </p>
              </div>
            </div>
          </Reveal>
        </div>

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
          Illustrative example coverage.
          <IllustrativeBadge />
        </p>
      </div>
    </div>
  );
}

/* ── Final CTA ────────────────────────────────────────────────────────────── */

const CTA_SUMMARY = [
  "Search products, HS codes and companies",
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
            Start Exploring Global{" "}
            <span className="text-gradient-light">Trade Opportunities</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/75 lg:mx-0">
            Use Vaskodigama to discover buyers, suppliers, shipment records,
            pricing trends, country demand and market opportunities across
            40+ countries and all HSN chapters.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
            <ButtonLink href="/contact" className="btn-gradient h-12 rounded-full px-7 text-base">
              Request a Demo <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
            <Link
              href="#global-coverage"
              className="inline-flex h-12 items-center rounded-full border border-white/30 px-7 text-base font-semibold text-white hover:bg-white/10"
            >
              Explore Data Coverage
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
  { icon: SearchIcon, label: "Search product", body: "Enter a product, HS code or company" },
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
 * connecting lines and icons stay perfectly aligned at any size. The centre
 * label is deliberately generic ("Products") — this diagram represents how
 * ANY product search connects to the wider trade ecosystem, not one example.
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
          <Package className="size-4.5" aria-hidden />
        </span>
        <p className="mt-1.5 text-xs font-semibold text-navy">Products</p>
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
