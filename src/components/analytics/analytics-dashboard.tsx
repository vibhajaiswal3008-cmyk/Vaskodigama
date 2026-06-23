"use client";

import * as React from "react";
import type { AnalyticsMode, AnalyticsTab } from "@/types/analytics";
import { analyticsData, analyticsCountries } from "@/data/mock/analytics";
import { searchAnalytics } from "@/lib/analytics/search";
import { AC } from "@/lib/analytics/format";
import {
  OverviewTab, GeographicalTab, ProductsTab, EntityTab, OriginDestTab, SupplyChainTab, ctxLabel,
} from "@/components/analytics/tabs";
import { DataExplorer } from "@/components/analytics/data-explorer";

const TABDEF: [AnalyticsTab, string][] = [
  ["overview", "Overview"], ["geographical", "Geographical"], ["products", "Products"],
  ["exporters", "Exporters"], ["importers", "Importers"], ["origin", "Origin"],
  ["destination", "Destination"], ["supplychain", "Supply Chain"], ["explorer", "Data Explorer"],
];
const MODES: [AnalyticsMode, string][] = [
  ["global", "Global"], ["export", "Country Export"], ["import", "Country Import"],
];

export function AnalyticsDashboard() {
  const [tab, setTab] = React.useState<AnalyticsTab>("overview");
  const [mode, setMode] = React.useState<AnalyticsMode>("global");
  const [country, setCountry] = React.useState("India");

  // global search
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const tablistRef = React.useRef<HTMLDivElement>(null);

  const results = React.useMemo(() => searchAnalytics(analyticsData, query), [query]);

  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function pickResult(i: number) {
    const hit = results[i];
    if (!hit) return;
    setTab(hit.tab);
    setOpen(false);
    setQuery("");
  }

  function onSearchKey(e: React.KeyboardEvent) {
    if (!open || !results.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); pickResult(active); }
    else if (e.key === "Escape") { setOpen(false); }
  }

  function onTabKey(e: React.KeyboardEvent) {
    const idx = TABDEF.findIndex((t) => t[0] === tab);
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const dir = e.key === "ArrowRight" ? 1 : -1;
      const next = TABDEF[(idx + dir + TABDEF.length) % TABDEF.length][0];
      setTab(next);
      const btn = tablistRef.current?.querySelector<HTMLButtonElement>(`[data-tab="${next}"]`);
      btn?.focus();
    }
  }

  return (
    <div className="vdg-an">
      {/* internal toolbar — sits below the app's top bar */}
      <div className="an-toolbar">
        <div style={{ padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: AC.text }}>Trade Analytics</span>
            <span style={{ fontSize: 11, color: AC.amber, fontWeight: 600, background: AC.panelHi, border: `1px solid ${AC.border}`, borderRadius: 20, padding: "3px 10px" }}>
              Demo data
            </span>
          </div>

          <div ref={searchRef} className="an-search-wrap">
            <label htmlFor="anSearch" className="sr-only">Search product, HSN, exporter or importer</label>
            <input
              id="anSearch"
              role="combobox"
              aria-expanded={open && results.length > 0}
              aria-controls="anSearchResults"
              aria-autocomplete="list"
              autoComplete="off"
              value={query}
              placeholder="🔍 Search product, HSN, exporter, importer…"
              onChange={(e) => { setQuery(e.target.value); setOpen(true); setActive(0); }}
              onFocus={() => setOpen(true)}
              onKeyDown={onSearchKey}
              style={{ width: "100%" }}
            />
            {open && query && (
              <ul id="anSearchResults" role="listbox" aria-label="Search results" className="an-results">
                {results.length === 0 ? (
                  <li className="an-result" style={{ color: AC.faint, cursor: "default" }}>No matches found.</li>
                ) : (
                  results.map((r, i) => (
                    <li
                      key={r.type + r.label}
                      role="option"
                      aria-selected={i === active}
                      onMouseEnter={() => setActive(i)}
                      onMouseDown={(e) => { e.preventDefault(); pickResult(i); }}
                      className="an-result"
                    >
                      <span style={{ color: AC.text }}>{r.label}</span>
                      <span className="rtype">{r.type} · {r.detail}</span>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {MODES.map((m) => (
              <button key={m[0]} type="button" className={`pbtn ${mode === m[0] ? "active" : ""}`} aria-pressed={mode === m[0]} onClick={() => setMode(m[0])}>{m[1]}</button>
            ))}
            {mode !== "global" && (
              <>
                <label htmlFor="anCountry" className="sr-only">Select country</label>
                <select id="anCountry" value={country} onChange={(e) => setCountry(e.target.value)}>
                  {analyticsCountries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </>
            )}
          </div>
        </div>

        <div style={{ padding: "0 18px 10px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: AC.faint, paddingLeft: 2 }}>CONTEXT:</span>
          <span style={{ fontSize: 11.5, color: AC.accent, fontWeight: 600, background: AC.panelHi, border: `1px solid ${AC.border}`, borderRadius: 20, padding: "4px 12px" }}>
            {ctxLabel(mode, country)}
          </span>
        </div>

        <div ref={tablistRef} role="tablist" aria-label="Analytics sections" onKeyDown={onTabKey} className="scrollx" style={{ display: "flex", gap: 4, padding: "0 14px 8px" }}>
          {TABDEF.map((t) => {
            const selected = tab === t[0];
            return (
              <button
                key={t[0]}
                role="tab"
                type="button"
                data-tab={t[0]}
                id={`antab-${t[0]}`}
                aria-selected={selected}
                aria-controls="anpanel"
                tabIndex={selected ? 0 : -1}
                className={`tab ${selected ? "active" : ""}`}
                onClick={() => setTab(t[0])}
              >
                {t[1]}
              </button>
            );
          })}
        </div>
      </div>

      {/* active section */}
      <div id="anpanel" role="tabpanel" aria-labelledby={`antab-${tab}`} style={{ padding: "18px 18px 40px" }}>
        {tab === "overview" && <OverviewTab mode={mode} country={country} />}
        {tab === "geographical" && <GeographicalTab />}
        {tab === "products" && <ProductsTab />}
        {tab === "exporters" && <EntityTab kind="exporters" />}
        {tab === "importers" && <EntityTab kind="importers" />}
        {tab === "origin" && <OriginDestTab kind="origin" />}
        {tab === "destination" && <OriginDestTab kind="destination" />}
        {tab === "supplychain" && <SupplyChainTab />}
        {tab === "explorer" && <DataExplorer />}
      </div>
    </div>
  );
}
