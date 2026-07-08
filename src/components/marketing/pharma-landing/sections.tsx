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
} from "lucide-react";
import { Eyebrow } from "@/components/ui/misc";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { IllustrativeBadge } from "@/components/shared/illustrative";
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

const KEY_FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: ShoppingCart,
    title: "Buyer Intelligence",
    body: "Find active importers, buyer portfolios, purchase frequency and product-wise buyer activity.",
  },
  {
    icon: Factory,
    title: "Supplier Intelligence",
    body: "Identify exporters, shipment history, supply countries and company-level performance.",
  },
  {
    icon: LineChart,
    title: "Price Intelligence",
    body: "Analyse average pricing, import/export rates, value trends and product-wise price movement.",
  },
  {
    icon: Ship,
    title: "Shipment Records",
    body: "Access structured trade records with product, quantity, value, country, buyer and supplier detail.",
  },
  {
    icon: MapIcon,
    title: "Market Analysis",
    body: "Understand which countries are importing or exporting a given API, FDF or KSM, and where demand is rising.",
  },
  {
    icon: Radar,
    title: "Competitor Tracking",
    body: "Monitor comparable companies — their trade activity, product focus and shipment volume.",
  },
];

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
              </div>
            </Reveal>
          );
        })}
      </div>
    </>
  );
}

/* ── Use cases ────────────────────────────────────────────────────────────── */

const USE_CASES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Briefcase,
    title: "Business Development Teams",
    body: "Find new buyers, target high-demand markets and identify product expansion opportunities.",
  },
  {
    icon: ClipboardList,
    title: "Procurement Teams",
    body: "Discover reliable suppliers, compare sourcing markets and evaluate pricing benchmarks.",
  },
  {
    icon: SearchIcon,
    title: "Market Research Teams",
    body: "Analyse trade trends, competitor movement and product demand across geographies.",
  },
  {
    icon: Truck,
    title: "Export-Import Teams",
    body: "Track shipment records, buyer-supplier movements and country-level trade flows.",
  },
  {
    icon: Building2,
    title: "Pharmaceutical Manufacturers",
    body: "Understand global demand, supply gaps, active buyers and export opportunities for APIs, FDFs and KSMs.",
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
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
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

export function GlobalCoverage({ chips }: { chips: CoverageChip[] }) {
  return (
    <div className="surface-hero-light relative overflow-hidden rounded-[28px] border border-border px-6 py-14 sm:px-12">
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

export function LandingFinalCta() {
  return (
    <div className="surface-aurora relative overflow-hidden rounded-[28px] px-6 py-14 text-center sm:px-12">
      <div className="bg-route-grid absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-2xl">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Ready to discover your next{" "}
          <span className="text-gradient-light">pharma trade opportunity</span>?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/75">
          Search pharmaceutical trade data, identify buyers and suppliers,
          analyse pricing, and unlock market intelligence with Vaskodigama.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/contact?industry=pharma" className="btn-gradient h-12 rounded-full px-7 text-base">
            Request a Demo <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
          <Link
            href="/explore?industry=pharmaceuticals"
            className="inline-flex h-12 items-center rounded-full border border-white/30 px-7 text-base font-semibold text-white hover:bg-white/10"
          >
            Start Searching
          </Link>
        </div>
      </div>
    </div>
  );
}

/* Re-exported for the icon used in the trust strip on the page itself. */
export const trustIcons = { ShieldCheck, TrendingUp, Award };
