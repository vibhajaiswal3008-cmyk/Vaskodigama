"use client";

import * as React from "react";
import type { ShipmentColumn } from "@/types/analytics";
import { analyticsData as DATA } from "@/data/mock/analytics";
import { AC } from "@/lib/analytics/format";
import { Panel } from "@/components/analytics/primitives";
import { SHIPMENT_COLUMNS, columnLabel, buildCsv, downloadCsv } from "@/lib/analytics/csv";

const origins = [...new Set(DATA.ships.map((s) => s.origin))];
const dests = [...new Set(DATA.ships.map((s) => s.destination))];

export function DataExplorer() {
  const [text, setText] = React.useState("");
  const [origin, setOrigin] = React.useState("");
  const [dest, setDest] = React.useState("");
  const [minVal, setMinVal] = React.useState("");
  const [cols, setCols] = React.useState<ShipmentColumn[]>([...SHIPMENT_COLUMNS]);

  const rows = React.useMemo(() => {
    const tl = text.trim().toLowerCase();
    const mv = Number(minVal) || 0;
    return DATA.ships.filter(
      (s) =>
        (!origin || s.origin === origin) &&
        (!dest || s.destination === dest) &&
        s.value >= mv &&
        (!tl ||
          s.product.toLowerCase().includes(tl) ||
          s.exporter.toLowerCase().includes(tl) ||
          s.importer.toLowerCase().includes(tl)),
    );
  }, [text, origin, dest, minVal]);

  // Preserve original column order; keep at least one column visible.
  const visibleCols = SHIPMENT_COLUMNS.filter((c) => cols.includes(c));
  const toggleCol = (c: ShipmentColumn) => {
    setCols((prev) =>
      prev.includes(c)
        ? prev.length > 1 ? prev.filter((x) => x !== c) : prev
        : [...prev, c],
    );
  };

  const filtersActive = !!(text || origin || dest || minVal);
  const clearFilters = () => { setText(""); setOrigin(""); setDest(""); setMinVal(""); };
  const resetCols = () => setCols([...SHIPMENT_COLUMNS]);

  const exportCsv = () => {
    const csv = buildCsv(rows, visibleCols);
    downloadCsv(csv, "vaskodigama-trade-shipments.csv");
  };

  return (
    <Panel
      title="Data Explorer"
      sub="Full shipment-level table · filters · column toggle · CSV export"
      right={<span style={{ color: AC.faint, fontSize: 11.5 }}>{rows.length} of {DATA.ships.length} rows</span>}
      nopad
    >
      {/* column chips */}
      <div style={{ padding: "0 18px 10px", display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
        {SHIPMENT_COLUMNS.map((c) => {
          const on = cols.includes(c);
          return (
            <button
              key={c}
              type="button"
              className={`colchip ${on ? "on" : ""}`}
              aria-pressed={on}
              onClick={() => toggleCol(c)}
            >
              {on ? "✓ " : ""}{columnLabel(c)}
            </button>
          );
        })}
        <button type="button" className="pbtn" onClick={resetCols} style={{ marginLeft: "auto" }}>Reset columns</button>
      </div>

      {/* filter bar */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", padding: "0 18px 12px" }}>
        <label htmlFor="dxText" className="sr-only">Search product or company</label>
        <input id="dxText" value={text} onChange={(e) => setText(e.target.value)} placeholder="Search product / company…" style={{ flex: 1, minWidth: 180 }} />
        <label htmlFor="dxOrigin" className="sr-only">Filter by origin</label>
        <select id="dxOrigin" value={origin} onChange={(e) => setOrigin(e.target.value)}>
          <option value="">All Origins</option>
          {origins.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <label htmlFor="dxDest" className="sr-only">Filter by destination</label>
        <select id="dxDest" value={dest} onChange={(e) => setDest(e.target.value)}>
          <option value="">All Destinations</option>
          {dests.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <label htmlFor="dxMinVal" className="sr-only">Minimum value in dollars</label>
        <input id="dxMinVal" type="number" value={minVal} onChange={(e) => setMinVal(e.target.value)} placeholder="Min value $" style={{ width: 120 }} />
        {filtersActive && <button type="button" className="pbtn" onClick={clearFilters}>Clear filters</button>}
        <button type="button" className="pbtn active" onClick={exportCsv}>⬇ Export CSV</button>
      </div>

      {/* table */}
      <div style={{ maxHeight: 520, overflow: "auto", borderTop: `1px solid ${AC.border}` }} className="scrollx">
        {rows.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: AC.faint, fontSize: 12 }}>
            No rows match these filters. Try clearing a filter or lowering the minimum value.
          </div>
        ) : (
          <table className="dx">
            <caption className="sr-only">Shipment-level trade records (illustrative)</caption>
            <thead>
              <tr>{visibleCols.map((c) => <th key={c} scope="col">{columnLabel(c)}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((s, ri) => (
                <tr key={`${s.date}-${s.exporter}-${s.importer}-${ri}`}>
                  {visibleCols.map((c) => {
                    let v: React.ReactNode = s[c];
                    if (c === "value" || c === "rate") v = "$" + Number(s[c]).toLocaleString("en-US");
                    else if (c === "qty") v = Number(s[c]).toLocaleString("en-US");
                    return <td key={c}>{v}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Panel>
  );
}
