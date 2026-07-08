"use client";

import * as React from "react";
import { Search, FlaskConical, Hash, Building2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "product", label: "Product", icon: FlaskConical },
  { id: "hs-code", label: "HS Code", icon: Hash },
  { id: "company", label: "Company", icon: Building2 },
] as const;

type Category = (typeof CATEGORIES)[number]["id"];

const SUGGESTIONS: Record<Category, string[]> = {
  product: [
    "Paracetamol API",
    "Metformin tablets",
    "Amoxicillin trihydrate",
    "Pharmaceutical excipients",
    "Empty hard gelatin capsules",
  ],
  "hs-code": ["3004", "2941", "2922", "3002", "3003"],
  company: [],
};

export function PharmaSearch() {
  const router = useRouter();
  const [category, setCategory] = React.useState<Category>("product");
  const [query, setQuery] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const suggestions = SUGGESTIONS[category].filter((s) =>
    query.length === 0 || s.toLowerCase().includes(query.toLowerCase()),
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim() || SUGGESTIONS[category][0] || "";
    if (!q) return;
    router.push(`/explore?q=${encodeURIComponent(q)}&type=${category}&industry=pharmaceuticals`);
  }

  function applySuggestion(s: string) {
    setQuery(s);
    setFocused(false);
    inputRef.current?.blur();
    router.push(`/explore?q=${encodeURIComponent(s)}&type=${category}&industry=pharmaceuticals`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" role="search" aria-label="Search pharmaceutical trade data">
      {/* Category tabs */}
      <div
        role="tablist"
        aria-label="Search category"
        className="mb-2 flex gap-1 rounded-lg bg-surface/60 p-1 w-fit border border-border"
      >
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          const active = category === c.id;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setCategory(c.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                active
                  ? "bg-background text-navy shadow-xs"
                  : "text-muted hover:text-navy",
              )}
            >
              <Icon className="size-3.5" aria-hidden />
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Search input */}
      <div className="relative">
        <div className="flex items-center overflow-hidden rounded-xl border border-border bg-background shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
          <Search className="ml-4 size-5 shrink-0 text-muted" aria-hidden />
          <label htmlFor="pharma-search-input" className="sr-only">
            {category === "product"
              ? "Search an API, formulation or excipient"
              : category === "hs-code"
              ? "Enter an HS Code"
              : "Search a pharmaceutical company"}
          </label>
          <input
            id="pharma-search-input"
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder={
              category === "product"
                ? "Search an API, formulation, excipient…"
                : category === "hs-code"
                ? "Enter an HS Code, e.g. 3004"
                : "Search a pharmaceutical company"
            }
            className="flex-1 bg-transparent py-4 pl-3 pr-2 text-sm text-navy placeholder:text-muted focus:outline-none"
            autoComplete="off"
          />
          <button
            type="submit"
            className="btn-gradient m-1.5 flex h-10 items-center gap-2 rounded-lg px-5 text-sm font-semibold"
          >
            Search
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>

        {/* Suggestions dropdown */}
        {focused && suggestions.length > 0 && (
          <div
            role="listbox"
            aria-label="Search suggestions"
            className="absolute left-0 right-0 top-full z-30 mt-1.5 overflow-hidden rounded-xl border border-border bg-background shadow-lg"
          >
            <p className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
              Suggested searches
            </p>
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                role="option"
                aria-selected={false}
                onMouseDown={() => applySuggestion(s)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-navy hover:bg-surface"
              >
                <FlaskConical className="size-3.5 shrink-0 text-muted" aria-hidden />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
