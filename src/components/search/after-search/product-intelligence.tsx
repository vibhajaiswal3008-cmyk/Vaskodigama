"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import "./after-search.css";
import {
  generateShipments, computeInsights, fmtUSD, fmtQty, fmtInt,
  COUNTRY, FLAG, MONTHS, type Shipment, type Insights,
} from "@/lib/after-search/engine";
import { Icon, LockGlyph, SearchGlyph, DownloadGlyph, ArrowGlyph, WarnGlyph } from "./icons";
import { Donut, HBars, Columns, LineArea, Scatter, Pareto, Heatmap, Treemap, SankeyLite } from "./pv-charts";

const TABS: [string, string][] = [
  ["overview", "Overview"], ["trend", "Trend Intelligence"], ["hs", "HS Code Insights"],
  ["country", "Country Analysis"], ["buyers", "Buyer Intelligence"], ["suppliers", "Supplier Intelligence"],
  ["price", "Price Intelligence"], ["opportunity", "Opportunity Insights"], ["risk", "Risk Analysis"],
  ["records", "Shipment Records"],
];
const STRATEGY_FILTERS = [
  "High-value buyers", "Frequent buyers", "New buyers", "Recent active buyers", "Top suppliers",
  "Low-cost suppliers", "High-volume suppliers", "Premium suppliers", "High-growth markets",
  "Low-competition markets", "Related HS codes", "Bulk shipments", "Price outliers",
  "Recent shipments", "Strong buyer-supplier relationships",
];

/**
 * Post-search product intelligence dashboard. Renders below the site's own
 * Global Trade Search bar; `initialProduct` is the term the user searched
 * for. Ported from the after-search-preview prototype — the outer nav,
 * ribbon and footer chrome were dropped because the marketing layout
 * already supplies those (avoids duplicate navigation).
 */
export default function ProductIntelligenceDashboard({ initialProduct }: { initialProduct: string }) {
  const [prevInitialProduct, setPrevInitialProduct] = useState(initialProduct);
  const [input, setInput] = useState(initialProduct);
  const [product, setProduct] = useState(initialProduct);
  const [tab, setTab] = useState("overview");
  const [activeFilters, setActiveFilters] = useState<Set<number>>(new Set());

  // Reset to the new search term when the URL query changes (adjust state
  // during render rather than in an effect — avoids a cascading re-render).
  if (prevInitialProduct !== initialProduct) {
    setPrevInitialProduct(initialProduct);
    setInput(initialProduct);
    setProduct(initialProduct);
    setTab("overview");
  }

  const { shipments, ins } = useMemo(() => {
    const s = generateShipments(product);
    return { shipments: s, ins: computeInsights(product, s) };
  }, [product]);

  const search = useCallback((q: string) => {
    const t = q.trim(); if (!t) return;
    setProduct(t.replace(/\b\w/g, (c) => c.toUpperCase()));
    setTab("overview");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="after-search-page pv-page">
      <div className="pv-ribbon">
        <span className="pv-ribbon-dot" /> Illustrative demo data — figures shown are for interface preview, not live shipment records.
      </div>

      <div className="container">
        <SearchBar input={input} setInput={setInput} onSearch={search} />
        <SummaryHeader ins={ins} />
        <KpiCards ins={ins} />

        {/* strategy filters */}
        <div className="pv-section-label">Smart strategy filters <span>· visual demo — refines records where applicable</span></div>
        <div className="filterbar">
          {STRATEGY_FILTERS.map((f, i) => {
            const on = activeFilters.has(i);
            return (
              <button key={f} className={`fchip ${on ? "active" : ""}`}
                onClick={() => setActiveFilters((p) => { const n = new Set(p); if (n.has(i)) n.delete(i); else n.add(i); return n; })}>
                <svg viewBox="0 0 24 24" fill="none"><path d="M3 5h18M6 12h12M10 19h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>{f}
              </button>
            );
          })}
        </div>

        {/* tabs */}
        <div className="pv-tabs-wrap">
          <div className="tabs" role="tablist">
            {TABS.map(([id, label]) => (
              <button key={id} role="tab" className={`tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>{label}</button>
            ))}
          </div>
        </div>

        <div className="pv-panels">
          {tab === "overview" && <OverviewPanel ins={ins} onTab={setTab} />}
          {tab === "trend" && <TrendPanel ins={ins} />}
          {tab === "hs" && <HsPanel ins={ins} />}
          {tab === "country" && <CountryPanel ins={ins} />}
          {tab === "buyers" && <BuyersPanel ins={ins} />}
          {tab === "suppliers" && <SuppliersPanel ins={ins} />}
          {tab === "price" && <PricePanel ins={ins} />}
          {tab === "opportunity" && <OpportunityPanel ins={ins} />}
          {tab === "risk" && <RiskPanel ins={ins} />}
          {tab === "records" && <RecordsPanel shipments={shipments} product={ins.product} />}
        </div>

        <FinalCta ins={ins} />
      </div>
    </div>
  );
}

/* ------------------------------- chrome ------------------------------- */
function SearchBar({ input, setInput, onSearch }: { input: string; setInput: (s: string) => void; onSearch: (q: string) => void }) {
  const popular = ["Metformin", "Paracetamol", "Amoxicillin", "Ibuprofen", "Azithromycin"];
  return (
    <div className="pv-search">
      <form className="searchbar" role="search" onSubmit={(e) => { e.preventDefault(); onSearch(input); }}>
        <span className="si"><SearchGlyph /></span>
        <select aria-label="Trade flow" defaultValue="Import"><option>Import</option><option>Export</option></select>
        <span className="divider" />
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Search a product, e.g. Metformin, Paracetamol, Amoxicillin…" />
        <button className="btn btn-primary btn-sm" type="submit"><SearchGlyph />Analyze</button>
      </form>
      <div className="search-hints"><span>Try:</span>{popular.map((p) => <button key={p} className="chip-mini" onClick={() => onSearch(p)}>{p}</button>)}</div>
    </div>
  );
}

function SummaryHeader({ ins }: { ins: Insights }) {
  const s = ins.summary;
  const cells: [string, string][] = [
    ["Product searched", s.product], ["Trade flow", s.tradeFlow], ["Top market", s.country],
    ["Main HS code", s.mainHs], ["Date range", s.dateRange], ["Matched records", fmtInt(s.totalRecords)],
  ];
  return (
    <section className="pv-hero">
      <div className="pv-hero-main">
        <div className="breadcrumb" style={{ color: "#a9c2e6" }}>Search Results <span>›</span> <b style={{ color: "#fff" }}>{s.product}</b></div>
        <h1><span className="accent">{s.product}</span> Trade Intelligence</h1>
        <p className="pv-hero-sub">Import-export activity, active buyers &amp; suppliers, HS-code accuracy, country movement, pricing and shipment records for {s.product} — computed from {fmtInt(s.totalRecords)} sample shipment records.</p>
        <div className="pv-hero-cta">
          <button className="btn btn-primary">View Records</button>
          <button className="btn pv-btn-ghost"><DownloadGlyph />Download Sample Report</button>
          <button className="btn pv-btn-ghost">Request Demo</button>
        </div>
      </div>
      <aside className="pv-hero-card">
        <h4>Search Summary</h4>
        <div className="summary-grid">
          {cells.map(([k, v]) => <div className="summary-cell" key={k}><div className="k">{k}</div><div className={`v ${v.length > 12 ? "small" : ""}`}>{v}</div></div>)}
        </div>
        <div className="pv-data-status"><span className="pv-ribbon-dot" /> Data status: <b>Illustrative demo data</b></div>
      </aside>
    </section>
  );
}

function useCountUp(target: number, dep: unknown) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0; const start = performance.now(), dur = 750;
    const tick = (now: number) => { const p = Math.min(1, (now - start) / dur); setV(target * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [target, dep]);
  return v;
}

function KpiCards({ ins }: { ins: Insights }) {
  const k = ins.kpis;
  const val = useCountUp(k.totalValue, ins.product);
  const ship = useCountUp(k.totalShipments, ins.product);
  const cards: { t: string; v: string; d: string; ic: Parameters<typeof Icon>[0]["name"] }[] = [
    { t: "Total Trade Value", v: fmtUSD(val), d: "Total value of matched shipments for this product.", ic: "cash" },
    { t: "Total Shipments", v: fmtInt(Math.round(ship)), d: "Number of shipment records matched.", ic: "box" },
    { t: "Total Quantity", v: fmtQty(k.totalQtyKg), d: "Combined weight after unit normalisation to KG.", ic: "chart" },
    { t: "Avg Unit Rate", v: `$${k.weightedAvgRate.toFixed(2)}/kg`, d: "Weighted average price (value ÷ quantity).", ic: "cash" },
    { t: "Active Exporters", v: fmtInt(k.uniqueExporters), d: "Unique suppliers found in the data.", ic: "factory" },
    { t: "Active Importers", v: fmtInt(k.uniqueImporters), d: "Unique buyers found in the data.", ic: "users" },
    { t: "Origin Countries", v: fmtInt(k.uniqueOrigins), d: "Distinct supplying countries.", ic: "globe" },
    { t: "Destination Countries", v: fmtInt(k.uniqueDestinations), d: "Distinct buying markets.", ic: "flag" },
    { t: "Top Exporter", v: k.topExporter?.name ?? "—", d: `Highest supply value · ${fmtUSD(k.topExporter?.value ?? 0)}.`, ic: "factory" },
    { t: "Top Importer", v: k.topImporter?.name ?? "—", d: `Highest purchase value · ${fmtUSD(k.topImporter?.value ?? 0)}.`, ic: "users" },
    { t: "Top Origin Country", v: k.topOrigin?.name ?? "—", d: `Leads supply · ${fmtUSD(k.topOrigin?.value ?? 0)}.`, ic: "pin" },
  ];
  return (
    <>
      <div className="pv-section-label">Market snapshot</div>
      <div className="kpi-grid pv-kpi-grid">
        {cards.map((c) => (
          <div className="kpi" key={c.t}>
            <div className="kpi-top"><div className="kpi-ic"><Icon name={c.ic} /></div></div>
            <div className="title">{c.t}</div>
            <div className="value pv-kpi-val">{c.v}</div>
            <div className="desc">{c.d}</div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ------------------------------- panels ------------------------------- */
const Card = ({ title, meta, children, className }: { title?: string; meta?: string; children: React.ReactNode; className?: string }) => (
  <div className={`card ${className ?? ""}`}>
    {title && <div className="card-h"><h3>{title}</h3>{meta && <span className="meta">{meta}</span>}</div>}
    <div className="card-pad">{children}</div>
  </div>
);
const Insight = ({ children }: { children: React.ReactNode }) => (
  <div className="pv-insight"><svg viewBox="0 0 24 24" fill="none"><path d="M9 21h6M10 17h4M12 3a6 6 0 0 1 4 10.5c-.6.6-1 1.3-1 2.5H9c0-1.2-.4-1.9-1-2.5A6 6 0 0 1 12 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg><span>{children}</span></div>
);
const PanelHead = ({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) => (
  <div className="section-head" style={{ marginBottom: 16 }}><div><div className="eyebrow">{eyebrow}</div><h2 style={{ fontSize: 21 }}>{title}</h2>{sub && <p>{sub}</p>}</div></div>
);

function OverviewPanel({ ins, onTab }: { ins: Insights; onTab: (t: string) => void }) {
  const peak = [...ins.monthly].sort((a, b) => b.shipments - a.shipments)[0];
  return (
    <section className="panel active">
      <div className="grid-2" style={{ marginBottom: 18 }}>
        <Card title="Shipment activity" meta="last 12 months">
          <LineArea series={ins.monthly.map((m) => m.shipments)} />
          <Insight>Activity peaked in <b>{peak.label}</b> with <b>{peak.shipments}</b> shipments, indicating stronger market movement.</Insight>
        </Card>
        <Card title="Market snapshot">
          <div className="snap">
            <div><div className="k">Market size</div><div className="v" style={{ fontSize: 18 }}>{fmtUSD(ins.kpis.totalValue)}</div></div>
            <div><div className="k">Total quantity</div><div className="v" style={{ fontSize: 18 }}>{fmtQty(ins.kpis.totalQtyKg)}</div></div>
            <div><div className="k">Avg unit rate</div><div className="v" style={{ fontSize: 18 }}>${ins.kpis.weightedAvgRate.toFixed(2)}</div></div>
            <div><div className="k">HS codes</div><div className="v" style={{ fontSize: 18 }}>{ins.hs.length}</div></div>
          </div>
          <Insight>Top origin <b>{ins.origins[0]?.name}</b> holds <b>{Math.round(ins.origins[0]?.share)}%</b> of value; buyer demand is led by <b>{ins.destinations[0]?.name}</b>.</Insight>
        </Card>
      </div>
      <div className="grid-2">
        <Card title="Top importing markets" meta="by trade value"><HBars fmt={fmtUSD} rows={ins.destinations.slice(0, 5).map((d) => ({ label: d.name, value: d.value, flag: FLAG[d.code] }))} /></Card>
        <Card title="Top exporting countries" meta="by trade value"><HBars alt fmt={fmtUSD} rows={ins.origins.slice(0, 5).map((o) => ({ label: o.name, value: o.value, flag: FLAG[o.code] }))} /></Card>
      </div>
      <div className="grid-2" style={{ marginTop: 18 }}>
        <Card title="Top HS codes" meta="share of records"><Donut centerLabel="records" centerValue={fmtInt(ins.kpis.totalShipments)} data={ins.hs.slice(0, 5).map((h) => ({ label: h.code, value: h.shipments }))} /></Card>
        <Card title="Quick links">
          <div className="pv-quicklinks">
            {[["buyers", "Who is buying?", "users"], ["suppliers", "Who is supplying?", "factory"], ["price", "What's the price trend?", "cash"], ["opportunity", "Where's the opportunity?", "target"]].map(([id, label, ic]) => (
              <button key={id} className="pv-ql" onClick={() => onTab(id as string)}><Icon name={ic as Parameters<typeof Icon>[0]["name"]} /><span>{label}</span><ArrowGlyph /></button>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

function TrendPanel({ ins }: { ins: Insights }) {
  const m = ins.monthly, last = m[m.length - 1], prev = m[m.length - 2];
  const valUp = last.value >= prev.value, qtyFlat = Math.abs(last.qtyKg - prev.qtyKg) / (prev.qtyKg || 1) < 0.15;
  return (
    <section className="panel active">
      <PanelHead eyebrow="Trend Intelligence" title="Market movement over time" sub="Date, Total, Quantity and Unit Rate aggregated by month." />
      <div className="grid-2">
        <Card title="Monthly shipment trend" meta="count"><Columns rows={m.map((x) => ({ label: x.label.split(" ")[0], value: x.shipments }))} /></Card>
        <Card title="Monthly trade value" meta="USD"><LineArea series={m.map((x) => x.value)} color="#059669" /></Card>
      </div>
      <div className="grid-2" style={{ marginTop: 18 }}>
        <Card title="Monthly quantity" meta="KG-equivalent"><Columns color="#7c3aed" rows={m.map((x) => ({ label: x.label.split(" ")[0], value: Math.round(x.qtyKg) }))} /></Card>
        <Card title="Unit rate trend" meta="$/KG"><LineArea series={m.map((x) => x.avgRate)} color="#d97706" area={false} /></Card>
      </div>
      <div className="pv-insight-grid">
        <Insight>Trade value {valUp ? "increased" : "eased"} in <b>{last.label}</b>{qtyFlat ? " while quantity stayed roughly flat, suggesting a pricing/grade-mix shift." : ", tracking shipment volume."}</Insight>
        <Insight>Unit rate has held near <b>${ins.kpis.weightedAvgRate.toFixed(2)}/kg</b> across the period, with {ins.price.outliers} outlier shipments flagged.</Insight>
      </div>
    </section>
  );
}

function HsPanel({ ins }: { ins: Insights }) {
  const top = ins.hs[0];
  return (
    <section className="panel active">
      <PanelHead eyebrow="HS Code Insights" title="Which classification is most relevant?" sub="HS codes ranked by matched records, value and description overlap." />
      <div className="grid-2">
        <Card title="HS code share" meta="by records"><Donut centerLabel="primary" centerValue={top.code} data={ins.hs.slice(0, 5).map((h) => ({ label: h.code, value: h.shipments }))} /></Card>
        <Card title="HS code by trade value" meta="USD"><HBars fmt={fmtUSD} rows={ins.hs.slice(0, 5).map((h) => ({ label: h.code, value: h.value }))} /></Card>
      </div>
      <Card title="HS code confidence & product mapping" className="pv-mt">
        <div className="tscroll">
          <table className="dt pv-dt">
            <thead><tr><th>HS Code</th><th>Records</th><th>Trade Value</th><th>Quantity</th><th>Confidence</th><th>Common product descriptions</th></tr></thead>
            <tbody>
              {ins.hs.slice(0, 6).map((h) => (
                <tr key={h.code}>
                  <td><span className="code-tag">{h.code}</span></td>
                  <td className="strong">{h.shipments}</td>
                  <td className="strong">{fmtUSD(h.value)}</td>
                  <td>{fmtQty(h.qtyKg)}</td>
                  <td><span className="pv-conf"><span className="pv-conf-bar"><i style={{ width: `${h.confidence}%` }} /></span>{h.confidence >= 60 ? "High" : h.confidence >= 30 ? "Medium" : "Low"}</span></td>
                  <td style={{ whiteSpace: "normal", color: "var(--muted)" }}>{h.descriptions.join(" · ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Insight>Most matched records for <b>{ins.product}</b> fall under HS Code <b>{top.code}</b> ({top.confidence}% confidence), making it the most relevant classification. Related codes ({ins.hs.slice(1, 4).map((h) => h.code).join(", ")}) also appear — include them for wider search coverage.</Insight>
      <VariantSection ins={ins} />
    </section>
  );
}

function VariantSection({ ins }: { ins: Insights }) {
  return (
    <div className="pv-mt">
      <PanelHead eyebrow="Product Variant Analysis" title="Grade & variant movement" sub="Parsed from the product description (USP, BP, IP, EP, DMF, technical, etc.)." />
      <Card title="Product variant share" meta="by records"><Treemap items={ins.grades.map((g) => ({ label: g.grade, value: g.shipments }))} /></Card>
      <div className="grid-2 pv-mt">
        <Card title="Grade-wise trade value" meta="USD"><HBars fmt={fmtUSD} rows={ins.grades.slice(0, 6).map((g) => ({ label: g.grade, value: g.value }))} /></Card>
        <Card title="Grade-wise average price" meta="$/KG"><HBars alt fmt={(v) => `$${v.toFixed(2)}`} rows={[...ins.grades].filter((g) => g.avgRate > 0).sort((a, b) => b.avgRate - a.avgRate).slice(0, 6).map((g) => ({ label: g.grade, value: g.avgRate }))} /></Card>
      </div>
      <Insight><b>{ins.grades[0]?.grade}</b> and <b>{ins.grades[1]?.grade}</b> grades show the strongest shipment activity, while regulated grades (DMF/EP) appear in selected higher-value shipments — indicating demand for pharmaceutical-grade material.</Insight>
    </div>
  );
}

function CountryPanel({ ins }: { ins: Insights }) {
  const lanes = ins.pairs; // reuse relationship for lane sense via origin/destination below
  return (
    <section className="panel active">
      <PanelHead eyebrow="Country Analysis" title="Where is trade moving?" sub="Origin (supply) vs destination (demand), value, quantity and price by country." />
      <div className="grid-2">
        <Card title="Origin country share" meta="by value"><Donut centerLabel="origins" centerValue={fmtInt(ins.kpis.uniqueOrigins)} data={ins.origins.slice(0, 5).map((o) => ({ label: o.name, value: o.value }))} /></Card>
        <Card title="Top destination markets" meta="by value"><HBars alt fmt={fmtUSD} rows={ins.destinations.slice(0, 6).map((d) => ({ label: d.name, value: d.value, flag: FLAG[d.code] }))} /></Card>
      </div>
      <Card title="Country intelligence" className="pv-mt">
        <div className="tscroll">
          <table className="dt pv-dt">
            <thead><tr><th>Country</th><th>Role</th><th>Shipments</th><th>Trade Value</th><th>Quantity</th><th>Avg $/KG</th><th>Growth</th></tr></thead>
            <tbody>
              {ins.origins.slice(0, 5).map((o) => (
                <tr key={"o" + o.code}><td><span className="flag" style={{ width: 18 }}>{FLAG[o.code]}</span> {o.name}</td><td><span className="pill export">Origin</span></td>
                  <td className="strong">{o.shipments}</td><td className="strong">{fmtUSD(o.value)}</td><td>{fmtQty(o.qtyKg)}</td><td>${o.avgRate.toFixed(2)}</td>
                  <td><span className={`trend ${o.growth >= 0 ? "up" : "down"}`}>{o.growth >= 0 ? "▲" : "▼"} {Math.abs(o.growth)}%</span></td></tr>
              ))}
              {ins.destinations.slice(0, 5).map((d) => (
                <tr key={"d" + d.code}><td><span className="flag" style={{ width: 18 }}>{FLAG[d.code]}</span> {d.name}</td><td><span className="pill import">Destination</span></td>
                  <td className="strong">{d.shipments}</td><td className="strong">{fmtUSD(d.value)}</td><td>{fmtQty(d.qtyKg)}</td><td>${d.avgRate.toFixed(2)}</td>
                  <td><span className={`trend ${d.growth >= 0 ? "up" : "down"}`}>{d.growth >= 0 ? "▲" : "▼"} {Math.abs(d.growth)}%</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="grid-2 pv-mt">
        <Card title="Country-wise average price" meta="$/KG"><HBars fmt={(v) => `$${v.toFixed(2)}`} rows={ins.price.byOriginRate.slice(0, 6).map((o) => ({ label: o.name, value: o.rate, flag: FLAG[o.code] }))} /></Card>
        <Card title="Origin → destination flow" meta="top trade relationships"><SankeyLite pairs={lanes} /></Card>
      </div>
      <Insight><b>{ins.origins[0]?.name}</b> leads supply ({Math.round(ins.origins[0]?.share)}% of value), while <b>{ins.price.byOriginRate[0]?.name}</b> commands the highest average price — a useful alternative-sourcing signal.</Insight>
    </section>
  );
}

function EntityTable({ rows, kind }: { rows: Array<Insights["importers"][number] | Insights["exporters"][number]>; kind: "buyer" | "supplier" }) {
  const isBuyer = kind === "buyer";
  return (
    <div className="tscroll">
      <table className="dt pv-dt">
        <thead><tr>
          <th>{isBuyer ? "Importer" : "Exporter"}</th><th>{isBuyer ? "Destination" : "Origin"}</th><th>Shipments</th>
          <th>Trade Value</th><th>Quantity</th><th>Avg $/KG</th><th>{isBuyer ? "Suppliers" : "Buyers"}</th><th>Last Shipment</th>
        </tr></thead>
        <tbody>
          {rows.slice(0, 8).map((e) => {
            const importer = e as Insights["importers"][number];
            const exporter = e as Insights["exporters"][number];
            return (
              <tr key={e.name}>
                <td className="strong">{e.name} {isBuyer && importer.isNew && <span className="pv-tag new">New</span>}{isBuyer && importer.isFrequent && <span className="pv-tag freq">Frequent</span>}</td>
                <td><span className="flag" style={{ width: 18 }}>{FLAG[e.country]}</span> {COUNTRY[e.country]}</td>
                <td className="strong">{e.shipments}</td><td className="strong">{fmtUSD(e.value)}</td><td>{fmtQty(e.qtyKg)}</td>
                <td>${e.avgRate.toFixed(2)}</td><td>{isBuyer ? importer.supplierCount : exporter.buyerCount}</td><td>{e.last}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function BuyersPanel({ ins }: { ins: Insights }) {
  const heat = ins.importers.slice(0, 7).map((b) => ({ label: b.name.split(" ")[0], cells: b.monthlyCounts }));
  return (
    <section className="panel active">
      <PanelHead eyebrow="Buyer Intelligence" title={`Top buyers for ${ins.product}`} sub="For exporters & sales teams identifying business-development leads." />
      <div className="grid-2">
        <Card title="Top importers" meta="by trade value"><HBars fmt={fmtUSD} rows={ins.importers.slice(0, 6).map((b) => ({ label: b.name, value: b.value }))} /></Card>
        <Card title="Buyer activity heatmap" meta="shipments / month"><Heatmap cols={MONTHS.map((m) => m.label.split(" ")[0][0])} rows={heat} /></Card>
      </div>
      <Card title="Buyer table" meta={`${ins.importers.length} importers`} className="pv-mt"><EntityTable rows={ins.importers} kind="buyer" /></Card>
      <div className="pv-cta-row">
        <Insight>These importers show repeated, recent buying activity and can be treated as high-priority business-development leads.</Insight>
        <button className="btn btn-primary btn-sm"><LockGlyph />Unlock verified buyer contacts</button>
      </div>
    </section>
  );
}

function SuppliersPanel({ ins }: { ins: Insights }) {
  return (
    <section className="panel active">
      <PanelHead eyebrow="Supplier Intelligence" title={`Top suppliers for ${ins.product}`} sub="For buyers & procurement teams discovering and benchmarking sources." />
      <div className="grid-2">
        <Card title="Top exporters" meta="by trade value"><HBars alt fmt={fmtUSD} rows={ins.exporters.slice(0, 6).map((s) => ({ label: s.name, value: s.value }))} /></Card>
        <Card title="Supplier price benchmark" meta="$/KG"><HBars fmt={(v) => `$${v.toFixed(2)}`} rows={ins.price.byExporterRate.slice(0, 6).map((s) => ({ label: s.name, value: s.rate }))} /></Card>
      </div>
      <Card title="Supplier table" meta={`${ins.exporters.length} exporters`} className="pv-mt"><EntityTable rows={ins.exporters} kind="supplier" /></Card>

      <div className="pv-mt"><PanelHead eyebrow="Relationship Mapping" title="Who supplies whom?" sub="Exporter → importer relationships, dependencies and open-sourcing behaviour." /></div>
      <Card title="Exporter → importer flow" meta="top pairs by value"><SankeyLite pairs={ins.pairs} /></Card>
      <div className="grid-2 pv-mt">
        <Card title="Top buyer-supplier pairs">
          <div className="tscroll"><table className="dt pv-dt"><thead><tr><th>Exporter</th><th>Importer</th><th>Shipments</th><th>Value</th></tr></thead>
            <tbody>{ins.pairs.slice(0, 6).map((p, i) => <tr key={i}><td className="strong">{p.exporter}</td><td>{p.importer}</td><td>{p.shipments}</td><td className="strong">{fmtUSD(p.value)}</td></tr>)}</tbody></table></div>
        </Card>
        <Card title="Sourcing behaviour">
          <div className="pv-badge-list">
            <div><span className="k">Multi-buyer suppliers</span><span className="v">{ins.multiBuyerSuppliers.slice(0, 3).join(", ") || "—"}</span></div>
            <div><span className="k">Single-supplier buyers</span><span className="v">{ins.singleSupplierBuyers.slice(0, 3).join(", ") || "—"}</span></div>
          </div>
          <Insight>Some exporters repeatedly supply the same importer (established relationships), while others buy from multiple exporters (open sourcing).</Insight>
        </Card>
      </div>
      <div className="pv-cta-row"><span /><button className="btn btn-primary btn-sm"><Icon name="factory" />Find verified suppliers</button></div>
    </section>
  );
}

function PricePanel({ ins }: { ins: Insights }) {
  const p = ins.price;
  const tiles: [string, string, string][] = [
    ["Average unit rate", `$${p.avgRate.toFixed(2)}`, "simple mean of shipment rates"],
    ["Weighted avg rate", `$${p.weightedAvgRate.toFixed(2)}`, "value ÷ quantity (more accurate)"],
    ["Lowest rate", `$${p.min.toFixed(2)}`, "cheapest shipment found"],
    ["Highest rate", `$${p.max.toFixed(2)}`, "premium shipment found"],
  ];
  return (
    <section className="panel active">
      <PanelHead eyebrow="Price Intelligence" title="What should this cost?" sub="Benchmarks, country/supplier comparison, distribution and outliers ($/KG)." />
      <div className="price-tiles" style={{ marginBottom: 18 }}>
        {tiles.map(([k, v, s]) => <div className="ptile" key={k}><div className="k">{k}</div><div className="v">{v}<span style={{ fontSize: 13, color: "var(--muted)" }}>/kg</span></div><div className="sub">{s}</div></div>)}
      </div>
      <div className="grid-2">
        <Card title="Price by origin country" meta="$/KG"><HBars fmt={(v) => `$${v.toFixed(2)}`} rows={p.byOriginRate.slice(0, 6).map((o) => ({ label: o.name, value: o.rate, flag: FLAG[o.code] }))} /></Card>
        <Card title="Price by exporter" meta="$/KG"><HBars alt fmt={(v) => `$${v.toFixed(2)}`} rows={p.byExporterRate.slice(0, 6).map((e) => ({ label: e.name, value: e.rate }))} /></Card>
      </div>
      <div className="grid-2 pv-mt">
        <Card title="Quantity vs unit rate" meta="each dot = a shipment"><Scatter xLabel="Quantity (KG) →" yLabel="$/KG" points={p.scatter.map((s) => ({ x: s.qtyKg, y: s.rate }))} /></Card>
        <Card title="Unit rate trend" meta="$/KG over time"><LineArea series={p.trend} color="#d97706" /></Card>
      </div>
      <Insight>Larger shipments trend toward <b>lower</b> unit rates (bulk advantage), while smaller lots from premium origins price higher. {p.outliers} shipments fall outside the normal price band and are flagged as outliers.</Insight>
      <div className="note-box pv-mt"><WarnGlyph /><span>Pricing insights are based on available shipment values and may vary by quantity, grade, packaging, supplier, and destination market.</span></div>
    </section>
  );
}

function OpportunityPanel({ ins }: { ins: Insights }) {
  const bestBuyers = ins.importers.slice(0, 2).map((b) => b.name).join(" & ");
  const bestSuppliers = ins.exporters.slice(0, 2).map((s) => s.name).join(" & ");
  const lowCost = [...ins.price.byOriginRate].sort((a, b) => a.rate - b.rate)[0];
  const growth = [...ins.destinations].sort((a, b) => b.growth - a.growth)[0];
  const premium = ins.price.byOriginRate[0];
  const cards: { l: string; v: string; d: string; ic: Parameters<typeof Icon>[0]["name"] }[] = [
    { l: "Best buyers to target", v: bestBuyers, d: "High value, frequent and recent shipment activity.", ic: "users" },
    { l: "Best suppliers to explore", v: bestSuppliers, d: "Consistent shipments at reasonable unit rates.", ic: "factory" },
    { l: "Low-cost sourcing country", v: lowCost?.name ?? "—", d: `Lowest average rate at $${lowCost?.rate.toFixed(2)}/kg.`, ic: "globe" },
    { l: "High-growth market", v: `${growth?.name} +${growth?.growth}%`, d: "Fastest-rising destination by trade value.", ic: "trend" },
    { l: "Recent active buyers", v: `${ins.importers.filter((b) => b.monthsActive >= 4).length} buyers`, d: "Active across the latest periods.", ic: "clock" },
    { l: "Premium pricing market", v: premium?.name ?? "—", d: `Highest average price at $${premium?.rate.toFixed(2)}/kg.`, ic: "cash" },
  ];
  return (
    <section className="panel active">
      <PanelHead eyebrow="Opportunity Insights" title="Where is the business?" sub="Data turned into concrete, customer-facing recommendations." />
      <div className="grid-3 pv-opp">
        {cards.map((c) => <div className="rec" key={c.l}><div className="rl"><Icon name={c.ic} />{c.l}</div><div className="rv">{c.v}</div><div className="rd">{c.d}</div></div>)}
      </div>
      <Insight>Based on shipment value, frequency and recent activity, <b>{bestBuyers}</b> appear to be strong prospects for business development, with <b>{lowCost?.name}</b> as the most cost-effective sourcing origin.</Insight>
      <div className="pv-cta-row pv-mt"><span /><button className="btn btn-primary"><Icon name="target" />Request Product Opportunity Report</button></div>
    </section>
  );
}

function RiskPanel({ ins }: { ins: Insights }) {
  const r = ins.risk;
  const alerts: { t: string; d: string; level: "high" | "med" | "low" }[] = [
    { t: "Country dependency", d: `${Math.round(r.originTopShare)}% of supply value comes from ${r.originTopName}.`, level: r.originTopShare > 55 ? "high" : r.originTopShare > 35 ? "med" : "low" },
    { t: "Supplier concentration", d: `Top 3 exporters hold ${Math.round(r.exporterTop3Share)}% of supply.`, level: r.exporterTop3Share > 60 ? "high" : "med" },
    { t: "Buyer concentration", d: `Top 3 importers drive ${Math.round(r.importerTop3Share)}% of demand.`, level: r.importerTop3Share > 60 ? "high" : "med" },
    { t: "Price volatility", d: `Monthly unit-rate variation is about ${r.priceVolatilityPct}%.`, level: r.priceVolatilityPct > 20 ? "high" : r.priceVolatilityPct > 10 ? "med" : "low" },
    { t: "HS code confusion", d: `Product appears under ${r.hsCount} HS codes — align classification before sourcing.`, level: r.hsCount > 4 ? "med" : "low" },
    { t: "Single-supplier buyers", d: `${r.singleSupplierBuyers} importers rely on just one exporter.`, level: r.singleSupplierBuyers > 3 ? "med" : "low" },
  ];
  return (
    <section className="panel active">
      <PanelHead eyebrow="Risk & Dependency" title="What could go wrong?" sub="Concentration, dependency and volatility signals for sourcing decisions." />
      <div className="grid-3 pv-opp">
        {alerts.map((a) => <div className={`pv-risk ${a.level}`} key={a.t}><div className="pv-risk-top"><span className={`pv-risk-dot ${a.level}`} />{a.t}<span className="pv-risk-level">{a.level}</span></div><div className="pv-risk-d">{a.d}</div></div>)}
      </div>
      <div className="grid-2 pv-mt">
        <Card title="Supplier concentration" meta="Pareto — value & cumulative %"><Pareto fmt={fmtUSD} items={r.paretoExporters} /></Card>
        <Card title="Buyer concentration" meta="Pareto — value & cumulative %"><Pareto fmt={fmtUSD} items={r.paretoImporters} /></Card>
      </div>
      <div className="grid-2 pv-mt">
        <Card title="Origin dependency" meta="share of value"><Donut centerLabel="top origin" centerValue={`${Math.round(r.originTopShare)}%`} data={ins.origins.slice(0, 5).map((o) => ({ label: o.name, value: o.value }))} /></Card>
        <Card title="Price volatility" meta="unit rate over time"><LineArea series={ins.price.trend} color="#dc2626" area={false} /></Card>
      </div>
      <Insight>{Math.round(r.originTopShare)}% of supply comes from <b>{r.originTopName}</b>{r.originTopShare > 55 ? ", creating sourcing dependency — customers should explore alternative active origins." : " — supply is reasonably diversified across origins."}</Insight>
    </section>
  );
}

/* --------------------------- records + modal --------------------------- */
type SortKey = "date" | "total" | "quantity" | "unitRate";
function RecordsPanel({ shipments, product }: { shipments: Shipment[]; product: string }) {
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [dir, setDir] = useState<"asc" | "desc">("desc");
  const [modal, setModal] = useState<Shipment | null>(null);

  const rows = useMemo(() => {
    const t = q.toLowerCase();
    let out = shipments.filter((s) => !t || [s.exporter, s.importer, s.hsCode, s.product, COUNTRY[s.origin], COUNTRY[s.destination], s.date].join(" ").toLowerCase().includes(t));
    out = [...out].sort((a, b) => {
      const av = sortKey === "date" ? a.date : a[sortKey], bv = sortKey === "date" ? b.date : b[sortKey];
      return (av < bv ? -1 : av > bv ? 1 : 0) * (dir === "asc" ? 1 : -1);
    });
    return out.slice(0, 60);
  }, [shipments, q, sortKey, dir]);

  const setSort = (k: SortKey) => { if (k === sortKey) setDir((d) => (d === "asc" ? "desc" : "asc")); else { setSortKey(k); setDir("desc"); } };
  const arrow = (k: SortKey) => (k === sortKey ? (dir === "asc" ? " ▲" : " ▼") : "");

  const exportCsv = () => {
    const cols = ["Date", "HS Code", "Product", "Quantity", "Unit", "Unit Rate", "Currency", "Total", "Origin", "Destination", "Exporter", "Importer"];
    const lines = [cols.join(",")].concat(rows.map((s) => [s.date, s.hsCode, `"${s.product}"`, s.quantity, s.unit, s.unitRate, s.currency, s.total, COUNTRY[s.origin], COUNTRY[s.destination], `"${s.exporter}"`, `"${s.importer}"`].join(",")));
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = `vaskodigama-${product.toLowerCase().replace(/\s+/g, "-")}-shipments.csv`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <section className="panel active">
      <PanelHead eyebrow="Shipment Records" title="Verifiable shipment-level data" sub={`${shipments.length} records · showing ${rows.length}. Every row links to its original source wording.`} />
      <div className="card">
        <div className="table-toolbar">
          <div className="mini-search"><SearchGlyph /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search within records — exporter, importer, HS, country…" /></div>
          <button className="btn btn-soft btn-sm" onClick={exportCsv}><DownloadGlyph />Export CSV</button>
        </div>
        <div className="tscroll" style={{ maxHeight: 560, overflowY: "auto" }}>
          <table className="dt pv-dt">
            <thead><tr>
              <th className="pv-sortable" onClick={() => setSort("date")}>Date{arrow("date")}</th>
              <th>HS Code</th><th>Product</th>
              <th className="pv-sortable" onClick={() => setSort("quantity")}>Qty{arrow("quantity")}</th>
              <th>Unit</th>
              <th className="pv-sortable" onClick={() => setSort("unitRate")}>Unit Rate{arrow("unitRate")}</th>
              <th>Cur.</th>
              <th className="pv-sortable" onClick={() => setSort("total")}>Total{arrow("total")}</th>
              <th>Origin</th><th>Destination</th><th>Exporter</th><th>Importer</th><th>Original</th>
            </tr></thead>
            <tbody>
              {rows.map((s, i) => (
                <tr key={i}>
                  <td>{s.date}</td><td><span className="code-tag">{s.hsCode}</span></td>
                  <td style={{ whiteSpace: "normal", minWidth: 200 }}>{s.product}</td>
                  <td className="strong">{fmtInt(s.quantity)}</td><td>{s.unit}</td>
                  <td className="strong">${s.unitRate.toFixed(2)}</td><td>{s.currency}</td><td className="strong">{fmtUSD(s.total)}</td>
                  <td><span className="flag" style={{ width: 18 }}>{FLAG[s.origin]}</span> {COUNTRY[s.origin]}</td>
                  <td><span className="flag" style={{ width: 18 }}>{FLAG[s.destination]}</span> {COUNTRY[s.destination]}</td>
                  <td>{s.exporter}</td><td>{s.importer}</td>
                  <td><button className="btn btn-soft btn-sm" onClick={() => setModal(s)}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="pv-modal-overlay" onClick={() => setModal(null)}>
          <div className="pv-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pv-modal-head">
              <div><div className="eyebrow">Original Data · verification layer</div><h3>Raw shipment record</h3></div>
              <button className="pv-modal-x" onClick={() => setModal(null)} aria-label="Close">✕</button>
            </div>
            <div className="pv-modal-raw">{modal.originalData}</div>
            <div className="pv-modal-grid">
              {([
                ["Date", modal.date], ["Original HS code", modal.hsCode], ["Original product text", modal.product],
                ["Exporter", modal.exporter], ["Importer", modal.importer],
                ["Origin", COUNTRY[modal.origin]], ["Destination", COUNTRY[modal.destination]],
                ["Quantity", `${fmtInt(modal.quantity)} ${modal.unit}`], ["Unit rate", `$${modal.unitRate.toFixed(2)} / KG`],
                ["Value", `${modal.currency} ${fmtInt(modal.total)}`],
              ] as [string, string][]).map(([k, v]) => <div key={k} className="pv-modal-field"><div className="k">{k}</div><div className="v">{v}</div></div>)}
            </div>
            <div className="pv-modal-note"><WarnGlyph /><span>Sample source wording shown for this demo. In production this mirrors the original bill/manifest text so customers can verify the cleaned record.</span></div>
          </div>
        </div>
      )}
    </section>
  );
}

function FinalCta({ ins }: { ins: Insights }) {
  return (
    <section className="cta pv-cta">
      <div className="inner">
        <h2>Turn {ins.product} shipment records into trade intelligence</h2>
        <p>Verified buyers &amp; suppliers, HS-code accuracy, country movement, price benchmarks, buyer-supplier relationships, opportunities and risk alerts — from raw shipment data.</p>
        <div className="acts">
          <button className="btn btn-white btn-lg">Request Demo</button>
          <button className="btn btn-glass btn-lg">Unlock Full Data</button>
          <button className="btn btn-glass btn-lg">Download Sample Report</button>
        </div>
      </div>
    </section>
  );
}
