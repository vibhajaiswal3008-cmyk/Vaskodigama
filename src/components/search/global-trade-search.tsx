"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bell,
  Bookmark,
  Box,
  Building2,
  Globe,
  Hash,
  Loader2,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type {
  Country,
  HsCode,
  Product,
  SearchQuery,
  SearchType,
} from "@/types";
import { Button } from "@/components/ui/button";
import { Select, Label } from "@/components/ui/input";
import { Combobox, type ComboOption } from "@/components/search/combobox";
import { InfoTooltip } from "@/components/ui/tooltip";
import { useToast } from "@/components/shared/toast";
import { buildQuerySummary, dateRangeLabels } from "@/lib/search/summary";
import { queryToParams } from "@/lib/search/params";
import { cn } from "@/lib/utils";

export interface GlobalTradeSearchProps {
  countries: Country[];
  products: Product[];
  hsCodes: HsCode[];
  variant?: "hero" | "full" | "compact";
  resultPath?: string;
  initialQuery?: SearchQuery;
  /** If provided, called instead of navigating (for in-page demos). */
  onSearch?: (q: SearchQuery) => void;
}

const searchTypes: { id: SearchType; label: string; icon: typeof Box }[] = [
  { id: "product", label: "Product", icon: Box },
  { id: "hs-code", label: "HS Code", icon: Hash },
  { id: "company", label: "Company", icon: Building2 },
  { id: "country", label: "Country", icon: Globe },
];

export function GlobalTradeSearch({
  countries,
  products,
  hsCodes,
  variant = "full",
  resultPath = "/dashboard/search",
  initialQuery,
  onSearch,
}: GlobalTradeSearchProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = React.useState(false);
  const [advancedOpen, setAdvancedOpen] = React.useState(variant === "full");
  const [confirmedHs, setConfirmedHs] = React.useState<string | undefined>(
    initialQuery?.hsCode,
  );

  const [query, setQuery] = React.useState<SearchQuery>(
    initialQuery ?? {
      type: "product",
      term: "",
      direction: "import",
      dateRange: "12m",
    },
  );

  const set = React.useCallback(
    (patch: Partial<SearchQuery>) => setQuery((q) => ({ ...q, ...patch })),
    [],
  );

  // --- Suggestions ---------------------------------------------------------
  const productOptions: ComboOption[] = React.useMemo(() => {
    const t = query.term.trim().toLowerCase();
    const list = t
      ? products.filter(
          (p) =>
            p.name.toLowerCase().includes(t) ||
            p.aliases.some((a) => a.toLowerCase().includes(t)) ||
            p.category.toLowerCase().includes(t),
        )
      : products;
    return list.slice(0, 8).map((p) => ({
      value: p.id,
      label: p.name,
      hint: p.category,
    }));
  }, [products, query.term]);

  const hsOptions: ComboOption[] = React.useMemo(() => {
    const raw = query.term.trim();
    const digits = raw.replace(/\D/g, "");
    const list = digits
      ? hsCodes.filter((h) => h.code.startsWith(digits))
      : raw
        ? hsCodes.filter(
            (h) =>
              h.description.toLowerCase().includes(raw.toLowerCase()) ||
              h.relatedTerms.some((x) =>
                x.toLowerCase().includes(raw.toLowerCase()),
              ),
          )
        : hsCodes;
    return list.slice(0, 8).map((h) => ({
      value: h.code,
      label: `${h.code} · ${h.description}`,
      hint: `${h.level}-digit`,
    }));
  }, [hsCodes, query.term]);

  const selectedProduct = React.useMemo(
    () => products.find((p) => p.name === query.term || p.id === query.term),
    [products, query.term],
  );

  const suggestedHs = React.useMemo(() => {
    if (query.type !== "product" || !selectedProduct) return [];
    return selectedProduct.suggestedHsCodes
      .map((code) => hsCodes.find((h) => h.code === code))
      .filter((h): h is HsCode => Boolean(h));
  }, [hsCodes, query.type, selectedProduct]);

  const originCountry = countries.find((c) => c.code === query.originCountry);

  const summary = buildQuerySummary({ ...query, hsCode: confirmedHs });

  // --- Active filter chips -------------------------------------------------
  const chips: { key: string; label: string; clear: () => void }[] = [];
  if (confirmedHs)
    chips.push({ key: "hs", label: `HS ${confirmedHs}`, clear: () => setConfirmedHs(undefined) });
  if (query.originCountry)
    chips.push({
      key: "origin",
      label: `From ${originCountry?.name ?? query.originCountry}`,
      clear: () => set({ originCountry: undefined }),
    });
  if (query.destinationCountry)
    chips.push({
      key: "dest",
      label: `Into ${countries.find((c) => c.code === query.destinationCountry)?.name}`,
      clear: () => set({ destinationCountry: undefined }),
    });

  const canSearch =
    (query.type === "country" && !!query.originCountry) || query.term.trim().length > 0;

  function clearAll() {
    setQuery({ type: query.type, term: "", direction: "import", dateRange: "12m" });
    setConfirmedHs(undefined);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSearch) {
      toast({
        title: "Add a product, HS code or country",
        description: "Tell us what to look for before searching.",
        tone: "warning",
      });
      return;
    }
    const finalQuery: SearchQuery = { ...query, hsCode: confirmedHs };
    setSubmitting(true);
    if (onSearch) {
      onSearch(finalQuery);
      setSubmitting(false);
      return;
    }
    const params = queryToParams(finalQuery);
    router.push(`${resultPath}?${params.toString()}`);
  }

  const compact = variant === "compact";

  return (
    <form
      onSubmit={submit}
      aria-label="Global Trade Search"
      className={cn(
        "rounded-xl border border-border bg-background p-4 shadow-sm sm:p-5",
        compact && "p-3 shadow-none",
      )}
    >
      {/* Search type tabs */}
      <div
        role="tablist"
        aria-label="Search by"
        className="mb-4 flex flex-wrap gap-1.5"
      >
        {searchTypes.map((t) => {
          const active = query.type === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                set({ type: t.id, term: "" });
                setConfirmedHs(undefined);
              }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border-strong bg-background text-muted-strong hover:bg-surface",
                (t.id === "product" || t.id === "hs-code") && !active && "border-primary/40",
              )}
            >
              <Icon className="size-4" aria-hidden />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Primary input */}
      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <div>
          <Label htmlFor="gts-term" className="sr-only">
            {labelForType(query.type)}
          </Label>
          {query.type === "country" ? (
            <Select
              id="gts-term"
              aria-label="Country or market"
              value={query.originCountry ?? ""}
              onChange={(e) => set({ originCountry: e.target.value, term: countries.find((c) => c.code === e.target.value)?.name ?? "" })}
            >
              <option value="">Select a country or market…</option>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </Select>
          ) : (
            <Combobox
              id="gts-term"
              ariaLabel={labelForType(query.type)}
              value={query.term}
              onValueChange={(v) => set({ term: v })}
              onSelect={(opt) => {
                if (query.type === "hs-code") {
                  set({ term: opt.label.split(" · ")[0] });
                  setConfirmedHs(opt.value);
                } else {
                  set({ term: opt.label });
                }
              }}
              options={query.type === "hs-code" ? hsOptions : productOptions}
              placeholder={placeholderForType(query.type)}
              emptyHint="No matches yet. Check the spelling or try a broader term."
            />
          )}
        </div>
        <Button type="submit" size="lg" disabled={submitting} className="md:w-auto">
          {submitting ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : null}
          {submitting ? "Searching…" : "Search"}
        </Button>
      </div>

      {/* HS code suggestions for product search (require confirmation) */}
      {query.type === "product" && suggestedHs.length > 0 ? (
        <div className="mt-3 rounded-lg border border-border bg-surface p-3">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-strong">
            Suggested HS codes — confirm one to refine results
            <InfoTooltip label="What is an HS code?">
              An HS (Harmonized System) code is an international product
              classification used in customs records. The same product can map
              to more than one code, so we suggest options for you to confirm.
            </InfoTooltip>
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {suggestedHs.map((h) => (
              <button
                key={h.code}
                type="button"
                onClick={() => setConfirmedHs(h.code === confirmedHs ? undefined : h.code)}
                aria-pressed={confirmedHs === h.code}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs font-medium",
                  confirmedHs === h.code
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border-strong bg-background text-muted-strong hover:bg-surface",
                )}
                title={h.description}
              >
                {h.code} · {h.description}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Quick country fields (always visible) */}
      {query.type !== "country" ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <CountryField
            id="gts-origin"
            label="Exporting from"
            hint="The country goods are shipped from."
            value={query.originCountry ?? ""}
            countries={countries}
            onChange={(code) => set({ originCountry: code })}
          />
          <CountryField
            id="gts-dest"
            label="Importing into"
            hint="The destination market goods arrive in."
            value={query.destinationCountry ?? ""}
            countries={countries}
            onChange={(code) => set({ destinationCountry: code })}
          />
        </div>
      ) : null}

      {/* Advanced filters toggle */}
      {!compact ? (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setAdvancedOpen((o) => !o)}
            aria-expanded={advancedOpen}
            aria-controls="gts-advanced"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <SlidersHorizontal className="size-4" aria-hidden />
            {advancedOpen ? "Hide advanced filters" : "Advanced filters"}
          </button>
        </div>
      ) : null}

      {advancedOpen && !compact ? (
        <div
          id="gts-advanced"
          className="mt-3 grid gap-3 rounded-lg border border-border bg-surface p-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div>
            <Label htmlFor="gts-dir">Trade direction</Label>
            <Select
              id="gts-dir"
              className="mt-1"
              value={query.direction}
              onChange={(e) => set({ direction: e.target.value as SearchQuery["direction"] })}
            >
              <option value="import">Imports</option>
              <option value="export">Exports</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="gts-range">Date range</Label>
            <Select
              id="gts-range"
              className="mt-1"
              value={String(query.dateRange)}
              onChange={(e) => set({ dateRange: e.target.value as SearchQuery["dateRange"] })}
            >
              {Object.entries(dateRangeLabels).map(([k, v]) => (
                <option key={k} value={k}>
                  {capitalize(v)}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-end">
            <p className="text-xs text-muted">
              Selections are kept as you refine your search.
            </p>
          </div>
        </div>
      ) : null}

      {/* Active filter chips */}
      {chips.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-muted">Active filters:</span>
          {chips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary-soft-foreground"
            >
              {chip.label}
              <button
                type="button"
                onClick={chip.clear}
                aria-label={`Remove ${chip.label}`}
                className="rounded-full hover:bg-primary/10"
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="ml-1 text-xs font-medium text-muted hover:text-danger"
          >
            Clear all
          </button>
        </div>
      ) : null}

      {/* Query summary */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-surface-2 px-3 py-2.5">
        <p className="text-sm text-navy">
          <span className="font-semibold">Summary: </span>
          {summary}
        </p>
        {!compact ? (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                toast({ title: "Search saved", description: "Find it under Saved in the dashboard.", tone: "success" })
              }
            >
              <Bookmark className="size-4" aria-hidden /> Save search
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                toast({ title: "Alert created", description: "We'll note changes for this search (demo).", tone: "success" })
              }
            >
              <Bell className="size-4" aria-hidden /> Create alert
            </Button>
          </div>
        ) : null}
      </div>

      {variant === "hero" ? (
        <p className="mt-3 inline-flex items-center gap-1 text-xs text-muted">
          Results use illustrative demo data.
          <ArrowRight className="size-3" aria-hidden />
          <span className="font-medium text-primary">Try “natural honey”.</span>
        </p>
      ) : null}
    </form>
  );
}

function CountryField({
  id,
  label,
  hint,
  value,
  countries,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  value: string;
  countries: Country[];
  onChange: (code: string) => void;
}) {
  const popular = countries.filter((c) => c.popular);
  const rest = countries.filter((c) => !c.popular);
  return (
    <div>
      <Label htmlFor={id} className="flex items-center gap-1">
        {label}
        <InfoTooltip label={`${label} explained`}>{hint}</InfoTooltip>
      </Label>
      <Select
        id={id}
        className="mt-1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Any country</option>
        {popular.length > 0 ? (
          <optgroup label="Popular markets">
            {popular.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </optgroup>
        ) : null}
        <optgroup label="All countries">
          {rest.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.name}
            </option>
          ))}
        </optgroup>
      </Select>
    </div>
  );
}

function labelForType(t: SearchType): string {
  switch (t) {
    case "product":
      return "Product name";
    case "hs-code":
      return "HS code";
    case "company":
      return "Company name";
    case "country":
      return "Country or market";
  }
}

function placeholderForType(t: SearchType): string {
  switch (t) {
    case "product":
      return "e.g. natural honey, coffee, cotton fabric…";
    case "hs-code":
      return "e.g. 0409 or “honey”";
    case "company":
      return "Search a company name…";
    default:
      return "Search…";
  }
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
