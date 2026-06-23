import * as React from "react";
import type { AnalyticsMode } from "@/types/analytics";
import { analyticsData as DATA } from "@/data/mock/analytics";
import { AC, SERIES, fUSD, fNum } from "@/lib/analytics/format";
import {
  Panel, Kpi, StatBox, RankList, RankRow, EntityTable, InsightCards, Legend, BlockNote, Delta, type Insight,
} from "@/components/analytics/primitives";
import {
  LineAreaChart, BarsChart, DonutChart, TreemapChart, ScatterChart,
  SankeyChart, ChordChart, MatrixChart, FlowMap,
} from "@/components/analytics/charts";

/* ---------- context helpers ---------- */
function ctxFactor(mode: AnalyticsMode) {
  return mode === "global" ? 1 : mode === "export" ? 0.34 : 0.28;
}
export function ctxLabel(mode: AnalyticsMode, country: string) {
  if (mode === "global") return "Global · all countries";
  return mode === "export" ? `${country} · Exports` : `${country} · Imports`;
}

const corridorValue = (oName: string, dName: string) => {
  const rt = DATA.routes.find((r) => r.from === oName && r.to === dName);
  const o = DATA.origins.find((x) => x.name === oName);
  const d = DATA.destinations.find((x) => x.name === dName);
  return rt ? rt.value : ((o?.value ?? 0) * (d?.value ?? 0)) / (420e6 * 1.4);
};

/* Subtle demo-data badge used where the source showed a "Live" badge. */
function DemoBadge() {
  return (
    <span style={{ color: AC.amber, fontSize: 11.5, fontWeight: 600 }}>● Demo data</span>
  );
}

/* =========================== OVERVIEW =========================== */
export function OverviewTab({ mode, country }: { mode: AnalyticsMode; country: string }) {
  const f = ctxFactor(mode);
  const T = DATA.totals;
  const tg = +(((T.value - T.prev) / T.prev) * 100).toFixed(1);
  const scaled = (n: number) => n * f;

  const kpis = (
    <div className="scrollx" style={{ display: "flex", gap: 12, paddingBottom: 4 }}>
      <div style={{ minWidth: 172 }}><Kpi label="Total Trade Value" value={fUSD(scaled(T.value))} delta={tg} accent={AC.accent} spark={DATA.trend.map((t) => t.value)} /></div>
      <div style={{ minWidth: 172 }}><Kpi label="Total Shipments" value={fNum(scaled(T.ship))} delta={11.2} accent={AC.teal} spark={DATA.trend.map((t) => t.shipments)} /></div>
      <div style={{ minWidth: 172 }}><Kpi label="Total Quantity" value={`${fNum(scaled(T.qty))} kg`} delta={8.7} accent={AC.violet} /></div>
      <div style={{ minWidth: 172 }}><Kpi label="Avg Unit Rate" value="$3.84/kg" delta={5.1} accent={AC.amber} spark={DATA.trend.map((t) => t.rate)} /></div>
      <div style={{ minWidth: 172 }}><Kpi label={mode === "global" ? "Active Countries" : "Trade Partners"} value={mode === "global" ? "94" : "38"} delta={6.4} accent={AC.cyan} /></div>
      <div style={{ minWidth: 172 }}><Kpi label="Market Share" value={mode === "global" ? "100%" : mode === "export" ? "18.7%" : "12.4%"} delta={3.3} accent={AC.rose} /></div>
    </div>
  );

  const sec: [string, React.ReactNode][] = [
    ["Active Exporters", fNum(scaled(1284))],
    ["Active Importers", fNum(scaled(2016))],
    ["Active Products", "1,640"],
    ["Active HSN", "212"],
    ["Avg Shipment", fUSD(scaled(T.value) / scaled(T.ship))],
    ["Growth %", <Delta key="g" v={tg} />],
  ];

  const insights: Insight[] = [
    { tone: "up", icon: "↑", t: "Fastest growing market", d: `${mode === "import" ? "UAE supply" : "UAE corridor"} up 27.4% — fastest among active markets.` },
    { tone: "up", icon: "★", t: "Fastest growing product", d: "Azithromycin +31.5% this period, demand outpacing supply." },
    { tone: "new", icon: "✦", t: mode === "import" ? "Emerging supplier" : "Emerging exporter", d: "Divis Laboratories entered top-5 with record value." },
    { tone: "up", icon: "◎", t: "Emerging importer", d: "Viatris ramped purchases +27.4% across 3 new HS codes." },
    { tone: "warn", icon: "⚠", t: "Price increase", d: "Avg unit rate for antibiotics up 14% — supply tightening." },
    { tone: "new", icon: "➔", t: "New trade route", d: "Singapore → France corridor detected (98M, new entrant)." },
  ];

  const countriesPanel =
    mode === "import"
      ? <Panel title="Top Origin Countries" sub={`Where ${country} buys from`}><RankList items={DATA.origins} /></Panel>
      : <Panel title={mode === "export" ? "Top Destination Countries" : "Top Trading Countries"} sub={mode === "export" ? `Where ${country} ships to` : "Largest markets by value"}><RankList items={mode === "export" ? DATA.destinations : DATA.origins} /></Panel>;

  return (
    <>
      {kpis}
      <div className="grid g-stats" style={{ marginTop: 16 }}>
        {sec.map((s, i) => <StatBox key={s[0]} label={s[0]} value={s[1]} accent={SERIES[i % SERIES.length]} />)}
      </div>
      <div className="grid g-2" style={{ marginTop: 16 }}>
        <Panel title="Trade Value Trend" sub={`${ctxLabel(mode, country)} · current vs previous`} right={<Delta v={tg} />}>
          <LineAreaChart points={DATA.trend.map((t) => ({ label: t.m, value: t.value, prev: t.prevValue }))} color={AC.accent} label={`Trade value trend, ${ctxLabel(mode, country)}. Overall growth ${tg}%.`} />
        </Panel>
        <Panel title="Shipment Trend" sub="Monthly shipment count">
          <LineAreaChart points={DATA.trend.map((t) => ({ label: t.m, value: t.shipments }))} color={AC.teal} fmt={fNum} label="Monthly shipment count trend." />
        </Panel>
      </div>
      <div className="grid g-2" style={{ marginTop: 16 }}>
        <Panel title="Quantity Trend" sub="Monthly volume (kg)">
          <LineAreaChart points={DATA.trend.map((t) => ({ label: t.m, value: t.qty }))} color={AC.violet} fmt={fNum} label="Monthly volume trend in kilograms." />
        </Panel>
        <Panel title="Monthly Growth" sub="MoM % change">
          <BarsChart points={DATA.trend.map((t) => ({ label: t.m, value: t.growth }))} label="Month-over-month growth percentage." />
        </Panel>
      </div>
      <div className="grid g-3" style={{ marginTop: 16 }}>
        <Panel title="Market Share Distribution" sub="Top origins by share">
          <DonutChart data={DATA.origins.slice(0, 7)} label="Market share by origin country." />
          <Legend items={DATA.origins} />
        </Panel>
        {countriesPanel}
        <Panel title="Top Products" sub="By trade value"><RankList items={DATA.products} /></Panel>
      </div>
      <div className="grid g-2" style={{ marginTop: 16 }}>
        <EntityTable title={mode === "import" ? "Top Suppliers (Exporters)" : "Top Exporters"} sub="Value · shipments · YoY" rows={DATA.exporters.slice(0, 8)} accent={AC.accent} />
        <EntityTable title={mode === "export" ? "Top Buyers (Importers)" : "Top Importers"} sub="Value · shipments · YoY" rows={DATA.importers.slice(0, 8)} accent={AC.teal} />
      </div>
      <div style={{ marginTop: 16 }}>
        <Panel title="Smart Insights" sub={`Auto-detected signals · ${ctxLabel(mode, country)}`} right={<DemoBadge />}>
          <InsightCards list={insights} />
        </Panel>
      </div>
    </>
  );
}

/* =========================== GEOGRAPHICAL =========================== */
export function GeographicalTab() {
  return (
    <>
      <div className="grid g-stats" style={{ gridTemplateColumns: "repeat(2,1fr)" }}>
        <Kpi label="Top Export Country" value={DATA.origins[0].name} delta={DATA.origins[0].growth} accent={AC.accent} />
        <Kpi label="Top Import Country" value={DATA.destinations[0].name} delta={DATA.destinations[0].growth} accent={AC.teal} />
        <Kpi label="Active Corridors" value="312" delta={9.1} accent={AC.violet} />
        <Kpi label="Top Route" value={`${DATA.routes[0].from} → ${DATA.routes[0].to}`} delta={12.4} accent={AC.amber} />
      </div>
      <div className="grid g-2" style={{ marginTop: 16 }}>
        <Panel title="Trade Flow Map" sub="Schematic corridors (equirectangular)">
          <FlowMap routes={DATA.routes} geo={DATA.geo} label="Schematic trade-flow map of top corridors plotted on latitude/longitude." />
        </Panel>
        <Panel title="Origin × Destination Heatmap" sub="Corridor intensity by value">
          <MatrixChart rows={DATA.origins} cols={DATA.destinations} valFn={(o, d) => corridorValue(o.name, d.name)} label="Origin to destination corridor intensity heatmap." />
        </Panel>
      </div>
      <div className="grid g-2" style={{ marginTop: 16 }}>
        <Panel title="Top Export Countries" sub="By export value"><RankList items={DATA.origins} /></Panel>
        <Panel title="Top Import Countries" sub="By import value"><RankList items={DATA.destinations} /></Panel>
      </div>
      <div className="grid g-2" style={{ marginTop: 16 }}>
        <Panel title="Trade Corridors" sub="Origin → destination by value">
          {DATA.routes.map((r, i) => (
            <RankRow key={i} i={i + 1} name={`${r.from} → ${r.to}`} sec={fUSD(r.value)} pct={(r.value / DATA.routes[0].value) * 100} color={SERIES[i % SERIES.length]} />
          ))}
        </Panel>
        <Panel title="Fastest Growing Countries" sub="YoY growth leaders">
          <RankList items={[...DATA.origins].sort((a, b) => b.growth - a.growth)} sec={(d) => <Delta v={d.growth ?? 0} sm />} showGrowth={false} />
        </Panel>
      </div>
      <BlockNote>
        The map is schematic: corridors are drawn from latitude/longitude points, not a geographic polygon dataset, so it approximates routes rather than rendering a true choropleth.
      </BlockNote>
    </>
  );
}

/* =========================== PRODUCTS =========================== */
export function ProductsTab() {
  const p0 = DATA.products[0];
  const grow = [...DATA.products].sort((a, b) => b.growth - a.growth);
  return (
    <>
      <div className="grid g-stats">
        <Kpi label="Product Value" value={fUSD(DATA.products.reduce((a, p) => a + p.value, 0))} delta={14.2} accent={AC.accent} />
        <Kpi label="Total Quantity" value={`${fNum(DATA.products.reduce((a, p) => a + p.qty, 0))} kg`} delta={8.7} accent={AC.teal} />
        <Kpi label="Avg Unit Rate" value="$41.6/kg" delta={6.1} accent={AC.amber} />
        <Kpi label="Top Product" value={p0.name} delta={p0.growth} accent={AC.violet} />
        <Kpi label="Active HSN" value="212" delta={4.2} accent={AC.cyan} />
        <Kpi label="Product Growth" value={<Delta v={11.8} />} delta={11.8} accent={AC.rose} />
      </div>
      <div className="grid g-2" style={{ marginTop: 16 }}>
        <Panel title="Product Trend" sub="Top product value over time"><LineAreaChart points={DATA.trend.map((t) => ({ label: t.m, value: t.value }))} color={AC.accent} label="Top product value over time." /></Panel>
        <Panel title="Product Lifecycle" sub="Value vs growth (BCG-style)"><ScatterChart items={DATA.products} label="Product lifecycle scatter: value versus year-on-year growth, bubble size is quantity." /></Panel>
      </div>
      <div className="grid g-3" style={{ marginTop: 16 }}>
        <Panel title="Product Share" sub="Treemap by value"><TreemapChart items={DATA.products.slice(0, 8).map((p, i) => ({ name: p.name, value: p.value, fill: SERIES[i % SERIES.length] }))} label="Product share treemap by trade value." /></Panel>
        <Panel title="HSN Distribution" sub="Share by chapter">
          <DonutChart data={DATA.hsn} unit="pct" label="HSN chapter distribution by share." />
          <Legend items={DATA.hsn} unit="pct" />
        </Panel>
        <Panel title="Top Products" sub="By trade value"><RankList items={DATA.products} /></Panel>
      </div>
      <div className="grid g-2" style={{ marginTop: 16 }}>
        <Panel title="Fastest Growing Products" sub="YoY leaders"><RankList items={grow} sec={(d) => <Delta v={d.growth ?? 0} sm />} showGrowth={false} /></Panel>
        <Panel title="Premium Products" sub="Highest unit rate ($/kg)">
          <RankList items={[...DATA.products].sort((a, b) => b.unitRate - a.unitRate)} sec={(d) => `$${d.unitRate}/kg`} showGrowth={false} />
        </Panel>
      </div>
      <BlockNote>
        Rankings cover top products by value, fastest-growing products and premium (highest unit-rate) products, grouped by HSN chapter.
      </BlockNote>
    </>
  );
}

/* =========================== EXPORTERS / IMPORTERS =========================== */
export function EntityTab({ kind }: { kind: "exporters" | "importers" }) {
  const rows = kind === "exporters" ? DATA.exporters : DATA.importers;
  const acc = kind === "exporters" ? AC.accent : AC.teal;
  const label = kind === "exporters" ? "Exporter" : "Importer";
  const grow = [...rows].sort((a, b) => b.growth - a.growth);
  const ins: Insight[] = kind === "exporters"
    ? [
        { tone: "up", icon: "↑", t: "Rising exporters", d: "Divis Labs +31.5%, Cipla +22.7% gaining share." },
        { tone: "new", icon: "✦", t: "New entrants", d: "118 new exporters this period across 9 HS codes." },
        { tone: "down", icon: "↓", t: "Lost exporters", d: "Glenmark -7.1%, slipping in heterocyclics." },
      ]
    : [
        { tone: "up", icon: "↑", t: "Rising importers", d: "Viatris +27.4%, Sandoz +19.8% scaling buys." },
        { tone: "new", icon: "✦", t: "New buyers", d: "204 new importers entered, mostly USA & EU." },
        { tone: "down", icon: "↓", t: "Lost importers", d: "Cardinal Health -2.3% reducing purchases." },
      ];

  return (
    <>
      <div className="grid g-stats" style={{ gridTemplateColumns: "repeat(2,1fr)" }}>
        <Kpi label={`Total ${label}s`} value={kind === "exporters" ? "1,284" : "2,016"} delta={6.4} accent={acc} />
        <Kpi label={`Active ${label}s`} value={kind === "exporters" ? "912" : "1,488"} delta={4.1} accent={AC.violet} />
        <Kpi label={`New ${label}s`} value={kind === "exporters" ? "+118" : "+204"} delta={22.3} accent={AC.teal} />
        <Kpi label={`${kind === "exporters" ? "Export" : "Import"} Value`} value={fUSD(rows.reduce((a, r) => a + r.value, 0))} delta={12.1} accent={AC.amber} />
        <Kpi label="Avg Shipment Value" value={fUSD(rows[0].value / rows[0].shipments)} delta={3.3} accent={AC.cyan} />
      </div>
      <div className="grid g-2" style={{ marginTop: 16 }}>
        <EntityTable title={`${label} Ranking`} sub="By value · shipments · YoY" rows={rows.slice(0, 10)} accent={acc} />
        <Panel title={`${label} Market Share`} sub={`Top ${kind} share`}>
          <DonutChart data={rows.slice(0, 7)} label={`${label} market share.`} />
          <Legend items={rows} />
        </Panel>
      </div>
      <div className="grid g-2" style={{ marginTop: 16 }}>
        <Panel title={`${label} Growth`} sub="YoY growth leaders"><RankList items={grow} sec={(d) => <Delta v={d.growth ?? 0} sm />} showGrowth={false} /></Panel>
        <Panel title={`${label} Distribution`} sub="Value distribution">
          <BarsChart points={rows.slice(0, 8).map((r) => ({ label: r.name.split(" ")[0], value: r.value / 1e6 }))} color={acc} fmt={(v) => `$${v.toFixed(0)}M`} label={`${label} value distribution.`} />
        </Panel>
      </div>
      <div style={{ marginTop: 16 }}><Panel title="Insights" right={<DemoBadge />}><InsightCards list={ins} /></Panel></div>
      <BlockNote>
        Rankings break down {kind} by value, growth and value distribution, with rising / new / declining signals.
      </BlockNote>
    </>
  );
}

/* =========================== ORIGIN / DESTINATION =========================== */
export function OriginDestTab({ kind }: { kind: "origin" | "destination" }) {
  const rows = kind === "origin" ? DATA.origins : DATA.destinations;
  const acc = kind === "origin" ? AC.accent : AC.cyan;
  const label = kind === "origin" ? "Origin" : "Destination";
  return (
    <>
      <div className="grid g-stats" style={{ gridTemplateColumns: "repeat(2,1fr)" }}>
        <Kpi label={`Top ${label}`} value={rows[0].name} delta={rows[0].growth} accent={acc} />
        <Kpi label={`Active ${label}s`} value={kind === "origin" ? "64" : "71"} delta={5.2} accent={AC.violet} />
        <Kpi label={`${kind === "origin" ? "Export" : "Import"} Value`} value={fUSD(rows.reduce((a, r) => a + r.value, 0))} delta={11.4} accent={AC.amber} />
        <Kpi label="Top-5 Concentration" value="58%" delta={-2.1} accent={AC.rose} />
      </div>
      <div className="grid g-2" style={{ marginTop: 16 }}>
        <Panel title={`${label} Ranking`} sub="By value"><RankList items={rows} n={10} /></Panel>
        <Panel title={`${label} Market Share`} sub="Share of total">
          <DonutChart data={rows.slice(0, 7)} label={`${label} market share.`} />
          <Legend items={rows} />
        </Panel>
      </div>
      <div className="grid g-2" style={{ marginTop: 16 }}>
        <Panel title={`${label} Growth`} sub="YoY leaders"><RankList items={[...rows].sort((a, b) => b.growth - a.growth)} sec={(d) => <Delta v={d.growth ?? 0} sm />} showGrowth={false} /></Panel>
        <Panel title={kind === "origin" ? "Origin Product Mix" : "Demand Trends"} sub={kind === "origin" ? `Top product split for ${rows[0].name}` : "Import demand over time"}>
          {kind === "origin"
            ? <TreemapChart items={DATA.products.slice(0, 6).map((p, i) => ({ name: p.name, value: p.value, fill: SERIES[i % SERIES.length] }))} label="Origin product mix treemap." />
            : <LineAreaChart points={DATA.trend.map((t) => ({ label: t.m, value: t.value }))} color={AC.cyan} label="Import demand over time." />}
        </Panel>
      </div>
      <div style={{ marginTop: 16 }}>
        <Panel title={kind === "origin" ? "Origin Network" : "Destination Network"} sub="Relationship chords">
          <ChordChart rel={DATA.relationships} label={`${label} relationship chord diagram.`} />
        </Panel>
      </div>
      <BlockNote>
        {label} views rank markets by value and growth, with share, product mix / demand trend and a partnership network.
      </BlockNote>
    </>
  );
}

/* =========================== SUPPLY CHAIN =========================== */
export function SupplyChainTab() {
  const rel = DATA.relationships;
  const maxRel = rel[0].value;
  const ins: Insight[] = [
    { tone: "warn", icon: "⚠", t: "Concentration risk", d: "Top buyer = 31% of Aurobindo's exports — single-customer exposure." },
    { tone: "new", icon: "✦", t: "New supplier discovery", d: "Pfizer added 2 new Indian API suppliers this quarter." },
    { tone: "down", icon: "↻", t: "Buyer switching", d: "Teva shifted ~18% volume from Sun Pharma to Dr. Reddy's." },
    { tone: "warn", icon: "◆", t: "Supply chain risk", d: "3 corridors depend on a single origin — diversification advised." },
  ];
  return (
    <>
      <div className="grid g-stats" style={{ gridTemplateColumns: "repeat(2,1fr)" }}>
        <Kpi label="Total Relationships" value="1,842" delta={8.4} accent={AC.accent} />
        <Kpi label="New Relationships" value="+126" delta={18.2} accent={AC.teal} />
        <Kpi label="Lost Relationships" value="-41" delta={-4.1} accent={AC.rose} />
        <Kpi label="Strongest Partnership" value={fUSD(maxRel)} delta={12.4} accent={AC.amber} />
      </div>
      <div className="grid g-2" style={{ marginTop: 16 }}>
        <Panel title="Exporter → Importer Sankey" sub="Flow volume between partners"><SankeyChart rel={rel} label="Sankey flow of value between exporters and importers." /></Panel>
        <Panel title="Relationship Network" sub="Chord graph of partnerships"><ChordChart rel={rel} label="Chord graph of exporter-importer partnerships." /></Panel>
      </div>
      <div className="grid g-2" style={{ marginTop: 16 }}>
        <Panel title="Origin → Destination Matrix" sub="Corridor strength"><MatrixChart rows={DATA.origins} cols={DATA.destinations} valFn={(o, d) => corridorValue(o.name, d.name)} label="Origin to destination corridor strength matrix." /></Panel>
        <Panel title="Strongest Partnerships" sub="Exporter → Importer by value">
          {rel.map((r, i) => <RankRow key={i} i={i + 1} name={`${r.ex} → ${r.im}`} sec={fUSD(r.value)} pct={(r.value / maxRel) * 100} color={SERIES[i % SERIES.length]} />)}
        </Panel>
      </div>
      <div style={{ marginTop: 16 }}><Panel title="Supply Chain Intelligence" sub="Risk & discovery signals" right={<DemoBadge />}><InsightCards list={ins} /></Panel></div>
    </>
  );
}
