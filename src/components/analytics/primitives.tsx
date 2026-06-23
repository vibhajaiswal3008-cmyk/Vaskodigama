import * as React from "react";
import { AC, SERIES, fUSD, deltaParts } from "@/lib/analytics/format";
import { Sparkline } from "@/components/analytics/charts";

export function Delta({ v, sm }: { v: number; sm?: boolean }) {
  const { up, text } = deltaParts(v);
  return <span className={`delta ${sm ? "sm" : ""} ${up ? "up" : "down"}`}>{text}</span>;
}

export function Panel({
  title, sub, right, children, nopad,
}: {
  title: string;
  sub?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  nopad?: boolean;
}) {
  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <div className="panel-title">{title}</div>
          {sub ? <div className="panel-sub">{sub}</div> : null}
        </div>
        {right ?? null}
      </div>
      <div className={`panel-body ${nopad ? "nopad" : ""}`}>{children}</div>
    </div>
  );
}

export function Kpi({
  label, value, delta, accent, spark,
}: {
  label: string;
  value: React.ReactNode;
  delta?: number;
  accent: string;
  spark?: number[];
}) {
  return (
    <div className="kpi">
      <span className="bar" style={{ background: accent }} />
      <div className="lbl">{label}</div>
      <div className="val">{value}</div>
      {delta !== undefined ? <div style={{ marginTop: 5 }}><Delta v={delta} /></div> : null}
      {spark ? <div style={{ marginTop: 6 }}><Sparkline values={spark} color={accent} /></div> : null}
    </div>
  );
}

export function StatBox({ label, value, accent }: { label: string; value: React.ReactNode; accent?: string }) {
  return (
    <div className="stat">
      <div className="lbl">{label}</div>
      <div className="val" style={{ color: accent || AC.text }}>{value}</div>
    </div>
  );
}

export function RankRow({
  i, name, sec, pct, color, growth,
}: {
  i: number;
  name: string;
  sec: React.ReactNode;
  pct: number;
  color: string;
  growth?: number;
}) {
  return (
    <div className="rrow">
      <span className="idx">{i}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, gap: 8 }}>
          <span className="name">{name}</span>
          <span className="sec">{sec}</span>
        </div>
        <div className="track">
          <div className="fill" style={{ width: `${Math.min(100, Math.max(0, pct)).toFixed(1)}%`, background: color }} />
        </div>
      </div>
      {growth !== undefined ? <div style={{ width: 50, textAlign: "right" }}><Delta v={growth} sm /></div> : null}
    </div>
  );
}

interface RankItem { name: string; value: number; growth?: number; color?: string }
export function RankList<T extends RankItem>({
  items, n = 8, sec, showGrowth = true,
}: {
  items: T[];
  n?: number;
  sec?: (d: T) => React.ReactNode;
  showGrowth?: boolean;
}) {
  const max = Math.max(...items.map((d) => d.value), 1);
  return (
    <>
      {items.slice(0, n).map((d, i) => (
        <RankRow
          key={d.name + i}
          i={i + 1}
          name={d.name}
          sec={sec ? sec(d) : fUSD(d.value)}
          pct={(d.value / max) * 100}
          color={d.color || SERIES[i % SERIES.length]}
          growth={showGrowth && d.growth !== undefined ? d.growth : undefined}
        />
      ))}
    </>
  );
}

interface EntityLike { name: string; value: number; growth: number; shipments?: number; country?: string }
export function EntityTable({
  title, sub, rows, accent, secondaryLabel = "Ships", secondary,
}: {
  title: string;
  sub?: string;
  rows: EntityLike[];
  accent: string;
  secondaryLabel?: string;
  secondary?: (r: EntityLike) => React.ReactNode;
}) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  const cols = "26px 1fr 90px 70px 54px";
  return (
    <Panel title={title} sub={sub} nopad>
      <div className="tbl-head" style={{ gridTemplateColumns: cols }}>
        <span>#</span>
        <span>Name</span>
        <span style={{ textAlign: "right" }}>Value</span>
        <span style={{ textAlign: "right" }}>{secondaryLabel}</span>
        <span style={{ textAlign: "right" }}>YoY</span>
      </div>
      {rows.map((r, i) => (
        <div className="tbl-row" key={r.name + i} style={{ gridTemplateColumns: cols }}>
          <span style={{ color: AC.faint, fontSize: 12, fontWeight: 600 }}>{i + 1}</span>
          <div style={{ minWidth: 0 }}>
            <div className="name">{r.name}</div>
            <div className="track" style={{ height: 3, marginTop: 5 }}>
              <div className="fill" style={{ width: `${((r.value / max) * 100).toFixed(1)}%`, background: accent }} />
            </div>
          </div>
          <span style={{ textAlign: "right", fontSize: 12.5, fontWeight: 600 }}>{fUSD(r.value)}</span>
          <span style={{ textAlign: "right", color: AC.sub, fontSize: 12 }}>
            {secondary ? secondary(r) : (r.shipments ?? 0).toLocaleString("en-US")}
          </span>
          <span style={{ textAlign: "right" }}><Delta v={r.growth} sm /></span>
        </div>
      ))}
    </Panel>
  );
}

export interface Insight { tone: "up" | "down" | "new" | "warn"; icon: string; t: string; d: string }
export function InsightCards({ list }: { list: Insight[] }) {
  const col: Record<Insight["tone"], string> = { up: AC.teal, down: AC.rose, new: AC.violet, warn: AC.amber };
  return (
    <div className="grid g-ins">
      {list.map((x, i) => (
        <div key={i} className="ins" style={{ borderLeft: `3px solid ${col[x.tone]}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ color: col[x.tone], fontSize: 14 }} aria-hidden>{x.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{x.t}</span>
          </div>
          <div style={{ color: AC.sub, fontSize: 12, lineHeight: 1.5 }}>{x.d}</div>
        </div>
      ))}
    </div>
  );
}

/**
 * Legend with correct per-dataset share. Fix vs source: the original always
 * divided by the origins total; here the denominator is the sum of THIS list
 * (or uses an explicit percentage when unit="pct").
 */
export function Legend({
  items, unit, n = 5,
}: {
  items: { name: string; value: number }[];
  unit?: "pct";
  n?: number;
}) {
  const total = items.reduce((a, x) => a + x.value, 0) || 1;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
      {items.slice(0, n).map((h, i) => (
        <div key={h.name + i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11.5 }}>
          <span style={{ width: 9, height: 9, borderRadius: 2, background: SERIES[i % SERIES.length] }} />
          <span style={{ color: AC.sub, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.name}</span>
          <span style={{ fontWeight: 600 }}>{unit === "pct" ? `${h.value}%` : `${((h.value / total) * 100).toFixed(1)}%`}</span>
        </div>
      ))}
    </div>
  );
}

export function BlockNote({ children }: { children: React.ReactNode }) {
  return <div className="an-note">ⓘ {children}</div>;
}
