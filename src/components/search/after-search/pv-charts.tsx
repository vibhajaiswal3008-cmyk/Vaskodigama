"use client";

import { useEffect, useState } from "react";

/* Shared enter-animation flag (0 → target after mount, replayed when `dep` changes). */
function useEnter(dep: unknown) {
  const [prevDep, setPrevDep] = useState(dep);
  const [on, setOn] = useState(false);
  if (prevDep !== dep) {
    setPrevDep(dep);
    setOn(false);
  }
  useEffect(() => {
    if (on) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setOn(true)));
    return () => cancelAnimationFrame(id);
  }, [on]);
  return on;
}

export const PV_COLORS = ["#2563eb", "#0ea5e9", "#7c3aed", "#059669", "#d97706", "#db2777", "#0891b2", "#4f46e5"];

/* -------------------------------- Donut -------------------------------- */
export function Donut({ data, size = 168, thickness = 26, centerLabel, centerValue }: {
  data: { label: string; value: number }[]; size?: number; thickness?: number; centerLabel?: string; centerValue?: string;
}) {
  const on = useEnter(data);
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const R = (size - thickness) / 2, C = 2 * Math.PI * R, cx = size / 2;
  const offsets: number[] = [];
  {
    let running = 0;
    for (const d of data) {
      offsets.push(running);
      running += (on ? d.value / total : 0) * C;
    }
  }
  return (
    <div className="pv-donut">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${cx} ${cx})`}>
          {data.map((d, i) => {
            const frac = d.value / total;
            const dash = on ? frac * C : 0;
            return (
              <circle key={i} cx={cx} cy={cx} r={R} fill="none" stroke={PV_COLORS[i % PV_COLORS.length]}
                strokeWidth={thickness} strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={-offsets[i]}
                style={{ transition: "stroke-dasharray .9s cubic-bezier(.16,.84,.44,1)" }} />
            );
          })}
        </g>
        {(centerValue || centerLabel) && (
          <text textAnchor="middle" x={cx} y={cx}>
            <tspan x={cx} dy="-2" style={{ fontSize: 22, fontWeight: 850, fill: "var(--navy-900)" }}>{centerValue}</tspan>
            <tspan x={cx} dy="18" style={{ fontSize: 11, fontWeight: 700, fill: "var(--muted)" }}>{centerLabel}</tspan>
          </text>
        )}
      </svg>
      <div className="pv-legend">
        {data.map((d, i) => (
          <div className="pv-legend-row" key={i}>
            <span className="pv-dot" style={{ background: PV_COLORS[i % PV_COLORS.length] }} />
            <span className="pv-legend-label">{d.label}</span>
            <b>{Math.round((d.value / total) * 100)}%</b>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------- Horizontal bars --------------------------- */
export function HBars({ rows, max, alt, fmt }: {
  rows: { label: string; value: number; flag?: string }[]; max?: number; alt?: boolean; fmt?: (v: number) => string;
}) {
  const on = useEnter(rows);
  const m = max ?? Math.max(...rows.map((r) => r.value), 1);
  return (
    <div className="barlist">
      {rows.map((r, i) => (
        <div className="barrow" key={i}>
          <div className="lab">{r.flag && <span className="flag">{r.flag}</span>}{r.label}</div>
          <div className="track"><div className={`fill ${alt ? "alt" : ""}`} style={{ width: on ? `${(r.value / m) * 100}%` : 0 }} /></div>
          <div className="val">{fmt ? fmt(r.value) : r.value}</div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------ Columns ------------------------------- */
export function Columns({ rows, fmt, color = "#2563eb" }: {
  rows: { label: string; value: number }[]; fmt?: (v: number) => string; color?: string;
}) {
  const on = useEnter(rows);
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <div className="pv-columns">
      {rows.map((r, i) => (
        <div className="pv-col" key={i} title={`${r.label}: ${fmt ? fmt(r.value) : r.value}`}>
          <div className="pv-col-bar" style={{ height: on ? `${(r.value / max) * 100}%` : 0, background: color }} />
          <span className="pv-col-cap">{r.label}</span>
        </div>
      ))}
    </div>
  );
}

/* --------------------------- Line / area ------------------------------ */
export function LineArea({ series, height = 150, color = "#2563eb", area = true }: {
  series: number[]; height?: number; color?: string; area?: boolean;
}) {
  const W = 560, H = height, P = 10;
  const mn = Math.min(...series), mx = Math.max(...series);
  const pts = series.map((v, i) => [P + (i * (W - 2 * P)) / (series.length - 1), H - P - ((v - mn) / ((mx - mn) || 1)) * (H - 2 * P)] as [number, number]);
  const path = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const gid = `pv-a-${Math.round(series[0] * 100)}-${series.length}`;
  const last = pts[pts.length - 1];
  return (
    <svg className="pv-spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs><linearGradient id={gid} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".28" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      {area && <path d={`${path} L${W - P} ${H} L${P} ${H} Z`} fill={`url(#${gid})`} />}
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r="4" fill="#fff" stroke={color} strokeWidth="2.5" />
    </svg>
  );
}

/* ------------------------------ Scatter ------------------------------- */
export function Scatter({ points, xLabel, yLabel }: {
  points: { x: number; y: number }[]; xLabel: string; yLabel: string;
}) {
  const on = useEnter(points);
  const W = 560, H = 220, P = 34;
  const xmax = Math.max(...points.map((p) => p.x), 1);
  const ymin = Math.min(...points.map((p) => p.y)), ymax = Math.max(...points.map((p) => p.y));
  const sx = (x: number) => P + (x / xmax) * (W - P - 12);
  const sy = (y: number) => H - P - ((y - ymin) / ((ymax - ymin) || 1)) * (H - P - 12);
  return (
    <svg className="pv-scatter" viewBox={`0 0 ${W} ${H}`}>
      <line x1={P} y1={H - P} x2={W - 6} y2={H - P} stroke="var(--line)" />
      <line x1={P} y1={12} x2={P} y2={H - P} stroke="var(--line)" />
      {[0.25, 0.5, 0.75].map((f) => <line key={f} x1={P} y1={12 + f * (H - P - 12)} x2={W - 6} y2={12 + f * (H - P - 12)} stroke="var(--line-2)" strokeDasharray="3 4" />)}
      {points.map((p, i) => (
        <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={on ? 4 : 0} fill="#2563eb" opacity="0.5"
          style={{ transition: `r .5s ${i * 3}ms` }} />
      ))}
      <text x={(W) / 2} y={H - 6} textAnchor="middle" className="pv-axis">{xLabel}</text>
      <text x={12} y={14} className="pv-axis">{yLabel}</text>
    </svg>
  );
}

/* ------------------------------- Pareto ------------------------------- */
export function Pareto({ items, fmt }: { items: { label: string; value: number; cumPct: number }[]; fmt?: (v: number) => string }) {
  const on = useEnter(items);
  const W = 560, H = 220, P = 30;
  const max = Math.max(...items.map((i) => i.value), 1);
  const bw = (W - 2 * P) / items.length;
  const linePts = items.map((it, i) => [P + bw * (i + 0.5), 12 + (1 - it.cumPct / 100) * (H - P - 12)] as [number, number]);
  const linePath = linePts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  return (
    <div>
      <svg className="pv-pareto" viewBox={`0 0 ${W} ${H}`}>
        {items.map((it, i) => {
          const h = (it.value / max) * (H - P - 16);
          return <rect key={i} x={P + bw * i + bw * 0.15} y={on ? H - P - h : H - P} width={bw * 0.7} height={on ? h : 0}
            rx="3" fill="#2563eb" opacity="0.85" style={{ transition: `all .7s ${i * 40}ms` }}><title>{it.label}: {fmt ? fmt(it.value) : it.value}</title></rect>;
        })}
        <path d={linePath} fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinejoin="round" style={{ opacity: on ? 1 : 0, transition: "opacity .8s .3s" }} />
        {linePts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#d97706" style={{ opacity: on ? 1 : 0, transition: `opacity .5s ${300 + i * 40}ms` }} />)}
      </svg>
      <div className="pv-pareto-labels">{items.map((it, i) => <span key={i} title={it.label}>{it.label.split(" ")[0]}</span>)}</div>
    </div>
  );
}

/* ------------------------------ Heatmap ------------------------------- */
export function Heatmap({ rows, cols }: { rows: { label: string; cells: number[] }[]; cols: string[] }) {
  const max = Math.max(1, ...rows.flatMap((r) => r.cells));
  return (
    <div className="pv-heatmap">
      <div className="pv-hm-head"><span /> {cols.map((c, i) => <span key={i} className="pv-hm-col">{c}</span>)}</div>
      {rows.map((r) => (
        <div className="pv-hm-row" key={r.label}>
          <span className="pv-hm-label" title={r.label}>{r.label}</span>
          {r.cells.map((v, i) => (
            <span key={i} className="pv-hm-cell" title={`${r.label} · ${cols[i]}: ${v} shipments`}
              style={{ background: v === 0 ? "var(--line-2)" : `rgba(37,99,235,${0.15 + (v / max) * 0.75})` }} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------ Treemap ------------------------------- */
// Lightweight slice-and-dice treemap (rows of proportional blocks).
export function Treemap({ items }: { items: { label: string; value: number; sub?: string }[] }) {
  const on = useEnter(items);
  const total = items.reduce((s, i) => s + i.value, 0) || 1;
  return (
    <div className="pv-treemap">
      {items.map((it, i) => (
        <div key={i} className="pv-tm" style={{ flexGrow: it.value, flexBasis: 0, background: PV_COLORS[i % PV_COLORS.length], opacity: on ? 1 : 0, transition: `opacity .5s ${i * 50}ms` }}
          title={`${it.label}: ${Math.round((it.value / total) * 100)}%`}>
          <span className="pv-tm-label">{it.label}</span>
          <span className="pv-tm-val">{Math.round((it.value / total) * 100)}%{it.sub ? ` · ${it.sub}` : ""}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------- Sankey (lite) --------------------------- */
export function SankeyLite({ pairs }: { pairs: { exporter: string; importer: string; value: number }[] }) {
  const on = useEnter(pairs);
  const top = pairs.slice(0, 8);
  const exporters = Array.from(new Set(top.map((p) => p.exporter)));
  const importers = Array.from(new Set(top.map((p) => p.importer)));
  const W = 560, H = Math.max(exporters.length, importers.length) * 46 + 20, P = 14;
  const nodeH = 30, gap = 16;
  const leftY = (i: number) => P + i * (nodeH + gap);
  const rightY = (i: number) => P + i * (nodeH + gap);
  const maxV = Math.max(...top.map((p) => p.value), 1);
  return (
    <svg className="pv-sankey" viewBox={`0 0 ${W} ${H}`}>
      {top.map((p, i) => {
        const li = exporters.indexOf(p.exporter), ri = importers.indexOf(p.importer);
        const y1 = leftY(li) + nodeH / 2, y2 = rightY(ri) + nodeH / 2;
        const x1 = 150, x2 = W - 150;
        const w = 1 + (p.value / maxV) * 9;
        return <path key={i} d={`M${x1} ${y1} C${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`}
          fill="none" stroke={PV_COLORS[li % PV_COLORS.length]} strokeWidth={w} opacity={on ? 0.35 : 0}
          style={{ transition: `opacity .6s ${i * 40}ms` }} />;
      })}
      {exporters.map((e, i) => (
        <g key={e}><rect x={8} y={leftY(i)} width={142} height={nodeH} rx="6" fill="#eef2f7" />
          <text x={16} y={leftY(i) + nodeH / 2 + 4} className="pv-sk-txt">{e.length > 20 ? e.slice(0, 19) + "…" : e}</text></g>
      ))}
      {importers.map((im, i) => (
        <g key={im}><rect x={W - 150} y={rightY(i)} width={142} height={nodeH} rx="6" fill="#e0f2fe" />
          <text x={W - 142} y={rightY(i) + nodeH / 2 + 4} className="pv-sk-txt">{im.length > 20 ? im.slice(0, 19) + "…" : im}</text></g>
      ))}
    </svg>
  );
}
