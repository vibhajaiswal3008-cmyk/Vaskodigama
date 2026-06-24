import Link from "next/link";
import {
  ArrowRight,
  Package,
  Hash,
  Building2,
  ShoppingCart,
  Factory,
  Ship,
  PlaneTakeoff,
  TrendingUp,
  Boxes,
  GitCompareArrows,
  Radar,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Eyebrow } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";

/* ── Search modes ─────────────────────────────────────────────────────────── */

interface ModeTile {
  icon: LucideIcon;
  title: string;
  body: string;
  href: string;
  tint: string;
}

const MODE_TILES: ModeTile[] = [
  { icon: Package, title: "Product search", body: "Find where a product is traded and which markets are active.", href: "/explore?mode=product", tint: "text-chart-1 bg-primary-soft" },
  { icon: Hash, title: "HS / HSN Code", body: "Search by classification and connect codes to companies and routes.", href: "/explore?mode=hs-code", tint: "text-[var(--chart-2)] bg-[color-mix(in_srgb,var(--chart-2)_16%,white)]" },
  { icon: Building2, title: "Company search", body: "Study an organisation through its visible trade activity.", href: "/explore?mode=company", tint: "text-navy bg-surface-2" },
  { icon: ShoppingCart, title: "Buyer discovery", body: "Identify active importers showing demand for your product.", href: "/explore?mode=buyer", tint: "text-success bg-success-soft" },
  { icon: Factory, title: "Supplier discovery", body: "Review exporters and compare sourcing alternatives.", href: "/explore?mode=supplier", tint: "text-warning bg-warning-soft" },
  { icon: Ship, title: "Importer & exporter", body: "Pivot between trade participants and the records behind them.", href: "/explore?mode=importer", tint: "text-chart-1 bg-primary-soft" },
];

export function SearchModes() {
  return (
    <div>
      <div className="text-center">
        <Eyebrow>Start with what you know</Eyebrow>
        <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
          Search global trade <span className="text-gradient">your way</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Begin from a product, classification, company, location or trade
          participant — then refine with filters without losing context.
        </p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODE_TILES.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.title}
              href={t.href}
              className="tile-glow group flex flex-col rounded-xl border border-border bg-background p-5"
            >
              <span className={`flex size-11 items-center justify-center rounded-xl ${t.tint}`}>
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-4 font-semibold text-navy">{t.title}</h3>
              <p className="mt-1 flex-1 text-sm text-muted">{t.body}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Search
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ── Value propositions ───────────────────────────────────────────────────── */

interface ValueCard {
  icon: LucideIcon;
  title: string;
  body: string;
  accent: string;
}

const VALUE_CARDS: ValueCard[] = [
  { icon: TrendingUp, title: "Find active demand", body: "Understand where products are imported and which markets show consistent activity.", accent: "from-primary to-[var(--chart-2)]" },
  { icon: Boxes, title: "Discover supply options", body: "Study exporters, origin countries, shipment patterns and sourcing alternatives.", accent: "from-[var(--chart-2)] to-success" },
  { icon: GitCompareArrows, title: "Compare market movement", body: "Review changes in trade value, volume, routes and participant activity over time.", accent: "from-[#2d8cff] to-primary" },
  { icon: Radar, title: "Study competitive activity", body: "See where companies trade, which products they handle and how presence shifts.", accent: "from-warning to-[#2d8cff]" },
];

export function ValueProps() {
  return (
    <div>
      <div className="max-w-2xl">
        <Eyebrow>Why it matters</Eyebrow>
        <h2 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
          Trade data is valuable only when it leads to a decision
        </h2>
        <p className="mt-3 text-muted">
          Vaskodigama organises complex international trade records into a
          practical research experience — from a broad market question to
          specific companies, products, routes and trends.
        </p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {VALUE_CARDS.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.title} className="tile-glow overflow-hidden rounded-xl border border-border bg-background">
              <div className={`bg-gradient-to-r ${c.accent} p-5`}>
                <Icon className="size-7 text-white" aria-hidden />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-navy">{c.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{c.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Final CTA (bold) ─────────────────────────────────────────────────────── */

export function BoldFinalCta() {
  return (
    <div className="surface-aurora relative overflow-hidden rounded-[28px] px-6 py-14 text-center sm:px-12">
      <div className="bg-route-grid absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-2xl">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Your next market decision can start with a{" "}
          <span className="text-gradient-light">better search</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/75">
          Explore the Vaskodigama demonstration, review the dashboard, or speak
          with the team about your trade-data requirements.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/explore" className="btn-gradient h-12 rounded-full px-7 text-base">
            Explore Trade Data <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
          <Link
            href="/contact"
            className="inline-flex h-12 items-center rounded-full border border-white/30 px-7 text-base font-semibold text-white hover:bg-white/10"
          >
            Request a Demo
          </Link>
        </div>
        <Link href="/pricing" className="mt-5 inline-block text-sm font-medium text-white/70 underline-offset-4 hover:text-white hover:underline">
          Or request a custom plan →
        </Link>
      </div>
    </div>
  );
}

/* ── Planned capabilities (roadmap) ───────────────────────────────────────── */

export function PlannedCapabilities() {
  const planned = [
    "Saved searches & watchlists",
    "Automated trade alerts",
    "AI-assisted market summaries",
    "Production API access",
    "CRM integrations",
    "Team workspaces",
    "Scheduled reports",
    "Supplier-risk indicators",
  ];
  return (
    <div className="rounded-2xl border border-border bg-background p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Planned capabilities</Eyebrow>
          <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">
            Designed to grow with your trade-intelligence needs
          </h2>
          <p className="mt-2 max-w-xl text-muted">
            These are on the roadmap — not available in the demonstration yet.
            Register interest and we&apos;ll keep you posted.
          </p>
        </div>
        <ButtonLink href="/signup" variant="outline">
          Get Early Access <ArrowRight className="size-4" aria-hidden />
        </ButtonLink>
      </div>
      <ul className="mt-6 flex flex-wrap gap-2">
        {planned.map((p) => (
          <li
            key={p}
            className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border-strong bg-surface px-3 py-1.5 text-sm text-muted-strong"
          >
            <span className="size-1.5 rounded-full bg-warning" aria-hidden />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}
