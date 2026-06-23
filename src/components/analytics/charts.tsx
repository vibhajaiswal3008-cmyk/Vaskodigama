import * as React from "react";
import { AC, SERIES, fUSD, fNum } from "@/lib/analytics/format";

/**
 * Hand-built SVG charts converted to React components. Each:
 *  - resizes with its container (viewBox + width:100%)
 *  - uses deterministic gradient IDs (useId) — no random IDs, no hydration drift
 *  - exposes an accessible summary via role="img" + aria-label
 *  - renders a readable empty state when there is no data
 *  - guards against divide-by-zero / NaN
 *
 * Geometry that needs local mutation (accumulators, layout) lives in plain
 * module-level builder functions — never inside a component render — so it stays
 * clean under the React Compiler. Text is JSX so React escapes entity names.
 */

type Fmt = (n: number) => string;

function Svg({ w, h, label, children }: { w: number; h: number; label: string; children: React.ReactNode }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label={label} style={{ width: "100%", height: "auto", display: "block" }}>
      {children}
    </svg>
  );
}

function Empty({ h, label }: { h: number; label: string }) {
  return (
    <div role="img" aria-label={`${label}: no data`} style={{ height: h, display: "flex", alignItems: "center", justifyContent: "center", color: AC.faint, fontSize: 12 }}>
      No data to display
    </div>
  );
}

/* ----------------------------- Line / area ----------------------------- */
export interface LinePoint { label: string; value: number; prev?: number }

export function LineAreaChart({
  points, color, height = 230, fmt = fUSD, fill = true, forceZero = true, label,
}: {
  points: LinePoint[];
  color: string;
  height?: number;
  fmt?: Fmt;
  fill?: boolean;
  forceZero?: boolean;
  label: string;
}) {
  const gid = React.useId().replace(/:/g, "");
  if (!points.length) return <Empty h={height} label={label} />;
  const hasPrev = points.some((d) => d.prev !== undefined);
  const W = 560, pl = 52, pr = 12, pt = 12, pb = 24, iw = W - pl - pr, ih = height - pt - pb;
  const allVals = hasPrev ? points.flatMap((d) => [d.value, d.prev ?? 0]) : points.map((d) => d.value);
  let max = Math.max(...allVals);
  let min = Math.min(...allVals);
  if (forceZero && min > 0) min = 0;
  if (max === min) max = min + 1;
  const x = (i: number) => pl + (iw * i) / Math.max(1, points.length - 1);
  const y = (v: number) => pt + ih - ((v - min) / (max - min)) * ih;
  const line = points.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(d.value).toFixed(1)}`).join(" ");
  const gridVals = [0, 1, 2, 3, 4].map((k) => min + ((max - min) * k) / 4);

  return (
    <Svg w={W} h={height} label={label}>
      {fill && (
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
      )}
      {gridVals.map((gv, k) => {
        const gy = y(gv);
        return (
          <g key={k}>
            <line x1={pl} y1={gy.toFixed(1)} x2={W - pr} y2={gy.toFixed(1)} stroke={AC.border} />
            <text x={pl - 6} y={(gy + 3).toFixed(1)} textAnchor="end" fill={AC.faint} fontSize={10}>{fmt(gv)}</text>
          </g>
        );
      })}
      {points.map((d, i) => (
        <text key={i} x={x(i).toFixed(1)} y={height - 8} textAnchor="middle" fill={AC.faint} fontSize={10}>{d.label}</text>
      ))}
      {fill && <path d={`${line} L${x(points.length - 1).toFixed(1)} ${y(min).toFixed(1)} L${x(0).toFixed(1)} ${y(min).toFixed(1)} Z`} fill={`url(#${gid})`} />}
      {hasPrev && <path d={points.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(d.prev ?? 0).toFixed(1)}`).join(" ")} fill="none" stroke={AC.faint} strokeWidth={1.4} strokeDasharray="4 3" />}
      <path d={line} fill="none" stroke={color} strokeWidth={2.4} />
    </Svg>
  );
}

/* ----------------------------- Bars ----------------------------- */
export function BarsChart({
  points, height = 210, fmt = (v) => v + "%", color, label,
}: {
  points: { label: string; value: number }[];
  height?: number;
  fmt?: Fmt;
  color?: string;
  label: string;
}) {
  if (!points.length) return <Empty h={height} label={label} />;
  const W = 560, pl = 40, pr = 10, pt = 12, pb = 22, iw = W - pl - pr, ih = height - pt - pb;
  const vals = points.map((d) => d.value);
  const min = Math.min(...vals, 0);
  let max = Math.max(...vals, 0);
  if (max === min) max = min + 1;
  const y = (v: number) => pt + ih - ((v - min) / (max - min)) * ih;
  const zero = y(0), bw = (iw / points.length) * 0.58;
  const gridVals = [0, 1, 2, 3, 4].map((k) => min + ((max - min) * k) / 4);

  return (
    <Svg w={W} h={height} label={label}>
      {gridVals.map((gv, k) => {
        const gy = y(gv);
        return (
          <g key={k}>
            <line x1={pl} y1={gy.toFixed(1)} x2={W - pr} y2={gy.toFixed(1)} stroke={AC.border} />
            <text x={pl - 6} y={(gy + 3).toFixed(1)} textAnchor="end" fill={AC.faint} fontSize={10}>{gv.toFixed(0)}</text>
          </g>
        );
      })}
      {points.map((d, i) => {
        const cx = pl + (iw * (i + 0.5)) / points.length, v = d.value, yy = y(v);
        const top = Math.min(yy, zero), hgt = Math.max(Math.abs(yy - zero), 0.5);
        const col = color || (v >= 0 ? AC.teal : AC.rose);
        return (
          <g key={i}>
            <rect x={(cx - bw / 2).toFixed(1)} y={top.toFixed(1)} width={bw.toFixed(1)} height={hgt.toFixed(1)} rx={3} fill={col}>
              <title>{`${d.label}: ${fmt(v)}`}</title>
            </rect>
            <text x={cx.toFixed(1)} y={height - 7} textAnchor="middle" fill={AC.faint} fontSize={9.5}>{d.label.slice(0, 5)}</text>
          </g>
        );
      })}
      <line x1={pl} y1={zero.toFixed(1)} x2={W - pr} y2={zero.toFixed(1)} stroke={AC.borderHi} />
    </Svg>
  );
}

/* ----------------------------- Donut ----------------------------- */
function buildDonut(data: { name: string; value: number }[], unit?: "pct") {
  const cx = 105, cy = 105, ro = 82, ri = 52;
  const tot = data.reduce((a, d) => a + d.value, 0) || 1;
  let cum = 0;
  return data.map((d, i) => {
    const a0 = -Math.PI / 2 + (cum / tot) * Math.PI * 2;
    cum += d.value;
    const a1 = -Math.PI / 2 + (cum / tot) * Math.PI * 2;
    const ang = a1 - a0;
    const p = (rr: number, a: number): [number, number] => [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
    const lg = ang > Math.PI ? 1 : 0;
    const [x0, y0] = p(ro, a0), [x1, y1] = p(ro, a1), [x2, y2] = p(ri, a1), [x3, y3] = p(ri, a0);
    const d2 = `M${x0.toFixed(1)} ${y0.toFixed(1)} A${ro} ${ro} 0 ${lg} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)} A${ri} ${ri} 0 ${lg} 0 ${x3.toFixed(1)} ${y3.toFixed(1)} Z`;
    return (
      <path key={i} d={d2} fill={SERIES[i % SERIES.length]} stroke={AC.panel} strokeWidth={1.5}>
        <title>{`${d.name}: ${unit === "pct" ? d.value + "%" : fUSD(d.value)}`}</title>
      </path>
    );
  });
}
export function DonutChart({ data, unit, label }: { data: { name: string; value: number }[]; unit?: "pct"; label: string }) {
  if (!data.length) return <Empty h={210} label={label} />;
  return <Svg w={210} h={210} label={label}>{buildDonut(data, unit)}</Svg>;
}

/* ----------------------------- Treemap ----------------------------- */
function buildTreemap(items: { name: string; value: number; fill?: string }[]) {
  const W = 560, H = 270;
  type Rect = { x: number; y: number; w: number; h: number; name: string; value: number; fill?: string };
  const out: Rect[] = [];
  (function lay(its: typeof items, x: number, y: number, w: number, h: number) {
    if (!its.length) return;
    if (its.length === 1) { out.push({ x, y, w, h, ...its[0] }); return; }
    const total = its.reduce((a, b) => a + b.value, 0) || 1;
    let acc = 0, idx = 0, best = Infinity;
    for (let k = 0; k < its.length - 1; k++) {
      acc += its[k].value;
      const diff = Math.abs(acc - total / 2);
      if (diff < best) { best = diff; idx = k; }
    }
    const a = its.slice(0, idx + 1), b = its.slice(idx + 1);
    const frac = a.reduce((s, z) => s + z.value, 0) / total;
    if (w >= h) { const wa = w * frac; lay(a, x, y, wa, h); lay(b, x + wa, y, w - wa, h); }
    else { const ha = h * frac; lay(a, x, y, w, ha); lay(b, x, y + ha, w, h - ha); }
  })(items.slice(), 0, 0, W, H);

  return out.map((rc, i) => {
    const nm = rc.name.length > 16 ? rc.name.slice(0, 15) + "…" : rc.name;
    return (
      <g key={i}>
        <rect x={rc.x.toFixed(1)} y={rc.y.toFixed(1)} width={rc.w.toFixed(1)} height={rc.h.toFixed(1)} rx={4} fill={rc.fill || SERIES[i % SERIES.length]} stroke={AC.bg} strokeWidth={2}>
          <title>{`${rc.name}: ${fUSD(rc.value)}`}</title>
        </rect>
        {rc.w > 72 && rc.h > 34 && (
          <>
            <text x={(rc.x + 9).toFixed(1)} y={(rc.y + 21).toFixed(1)} fill="#0A0E17" fontSize={12} fontWeight={700}>{nm}</text>
            <text x={(rc.x + 9).toFixed(1)} y={(rc.y + 37).toFixed(1)} fill="#0A0E17" fontSize={10} opacity={0.8}>{fUSD(rc.value)}</text>
          </>
        )}
      </g>
    );
  });
}
export function TreemapChart({ items, label }: { items: { name: string; value: number; fill?: string }[]; label: string }) {
  if (!items.length) return <Empty h={270} label={label} />;
  return <Svg w={560} h={270} label={label}>{buildTreemap(items)}</Svg>;
}

/* ----------------------------- Scatter ----------------------------- */
function buildScatter(items: { name: string; value: number; growth: number; qty: number }[]) {
  const W = 560, H = 300, pl = 50, pr = 16, pt = 16, ih = H - pt - 40, iw = W - pl - pr;
  const gmin = -25, gmax = 55, vmax = Math.max(...items.map((d) => d.value)) || 1;
  const x = (v: number) => pl + ((v - gmin) / (gmax - gmin)) * iw;
  const y = (v: number) => pt + ih - (v / vmax) * ih;
  const gl: number[] = [];
  for (let gv = -20; gv <= 50; gv += 10) gl.push(gv);
  const yTicks = [0, 1, 2, 3, 4].map((k) => (vmax * k) / 4);

  return (
    <>
      {gl.map((gv) => (
        <g key={"x" + gv}>
          <line x1={x(gv)} y1={pt} x2={x(gv)} y2={pt + ih} stroke={AC.border} />
          <text x={x(gv)} y={H - 24} textAnchor="middle" fill={AC.faint} fontSize={9.5}>{gv}%</text>
        </g>
      ))}
      {yTicks.map((vv, k) => (
        <g key={"y" + k}>
          <line x1={pl} y1={y(vv)} x2={pl + iw} y2={y(vv)} stroke={AC.border} />
          <text x={pl - 6} y={y(vv) + 3} textAnchor="end" fill={AC.faint} fontSize={9.5}>{fUSD(vv)}</text>
        </g>
      ))}
      <line x1={x(0)} y1={pt} x2={x(0)} y2={pt + ih} stroke={AC.borderHi} strokeDasharray="4 3" />
      <text x={pl + iw - 4} y={pt + 12} textAnchor="end" fill={AC.faint} fontSize={9.5} opacity={0.8}>★ Stars (high value, growing)</text>
      <text x={pl + 4} y={pt + 12} fill={AC.faint} fontSize={9.5} opacity={0.8}>Cash cows</text>
      {items.map((d, i) => {
        const cx = x(d.growth), cy = y(d.value), rr = 8 + Math.sqrt(Math.max(0, d.qty)) / 14;
        const col = d.growth >= 0 ? AC.teal : AC.rose;
        const nm = d.name.length > 12 ? d.name.slice(0, 11) + "…" : d.name;
        return (
          <g key={i}>
            <circle cx={cx.toFixed(1)} cy={cy.toFixed(1)} r={rr.toFixed(1)} fill={col} fillOpacity={0.22} stroke={col} strokeWidth={1.5}>
              <title>{`${d.name} · ${fUSD(d.value)} · ${d.growth}%`}</title>
            </circle>
            <text x={cx.toFixed(1)} y={(cy - rr - 3).toFixed(1)} textAnchor="middle" fill={AC.text} fontSize={9.5} fontWeight={600}>{nm}</text>
          </g>
        );
      })}
      <text x={pl + iw / 2} y={H - 6} textAnchor="middle" fill={AC.sub} fontSize={10.5}>YoY Growth % →  (bubble = quantity)</text>
    </>
  );
}
export function ScatterChart({ items, label }: { items: { name: string; value: number; growth: number; qty: number }[]; label: string }) {
  if (!items.length) return <Empty h={300} label={label} />;
  return <Svg w={560} h={300} label={label}>{buildScatter(items)}</Svg>;
}

/* ----------------------------- Sankey ----------------------------- */
function buildSankey(rel: { ex: string; im: string; value: number }[]) {
  const W = 560, H = 320, pad = 14, colW = 130, nodeW = 14;
  const exNames = [...new Set(rel.map((r) => r.ex))], imNames = [...new Set(rel.map((r) => r.im))];
  const sum = (k: "ex" | "im", v: string) => rel.filter((r) => r[k] === v).reduce((a, r) => a + r.value, 0);
  const exVal = exNames.map((n) => ({ n, v: sum("ex", n) })), imVal = imNames.map((n) => ({ n, v: sum("im", n) }));
  const totalE = exVal.reduce((a, d) => a + d.v, 0) || 1, totalI = imVal.reduce((a, d) => a + d.v, 0) || 1;
  const avail = H - pad * 2, gap = 8;
  const scaleE = (avail - gap * (exVal.length - 1)) / totalE, scaleI = (avail - gap * (imVal.length - 1)) / totalI;
  const posE: Record<string, { y: number; h: number }> = {};
  let yE = pad;
  for (const d of exVal) { const h = d.v * scaleE; posE[d.n] = { y: yE, h }; yE += h + gap; }
  const posI: Record<string, { y: number; h: number }> = {};
  let yI = pad;
  for (const d of imVal) { const h = d.v * scaleI; posI[d.n] = { y: yI, h }; yI += h + gap; }
  const xL = pad + colW, xR = W - pad - colW - nodeW;
  const offE: Record<string, number> = {}, offI: Record<string, number> = {};
  const links = rel.map((rl, i) => {
    const pe = posE[rl.ex], pi = posI[rl.im];
    const we = rl.value * scaleE, wi = rl.value * scaleI;
    const y0 = pe.y + (offE[rl.ex] || 0), y1 = pi.y + (offI[rl.im] || 0);
    offE[rl.ex] = (offE[rl.ex] || 0) + we; offI[rl.im] = (offI[rl.im] || 0) + wi;
    const x0 = xL + nodeW, x1 = xR, mx = (x0 + x1) / 2;
    return { i, d: `M${x0} ${(y0 + we / 2).toFixed(1)} C${mx} ${(y0 + we / 2).toFixed(1)} ${mx} ${(y1 + wi / 2).toFixed(1)} ${x1} ${(y1 + wi / 2).toFixed(1)}`, w: Math.max(we, wi), ex: rl.ex, im: rl.im, value: rl.value };
  });

  return (
    <>
      {links.map((l) => (
        <path key={l.i} d={l.d} fill="none" stroke={SERIES[l.i % SERIES.length]} strokeOpacity={0.32} strokeWidth={l.w.toFixed(1)}>
          <title>{`${l.ex} → ${l.im}: ${fUSD(l.value)}`}</title>
        </path>
      ))}
      {exVal.map((d, i) => {
        const p = posE[d.n], nm = d.n.length > 16 ? d.n.slice(0, 15) + "…" : d.n;
        return (
          <g key={"e" + i}>
            <rect x={xL} y={p.y.toFixed(1)} width={nodeW} height={p.h.toFixed(1)} rx={2} fill={SERIES[i % SERIES.length]} />
            <text x={xL - 6} y={(p.y + p.h / 2 + 3).toFixed(1)} textAnchor="end" fill={AC.text} fontSize={10.5}>{nm}</text>
          </g>
        );
      })}
      {imVal.map((d, i) => {
        const p = posI[d.n], nm = d.n.length > 16 ? d.n.slice(0, 15) + "…" : d.n;
        return (
          <g key={"i" + i}>
            <rect x={xR} y={p.y.toFixed(1)} width={nodeW} height={p.h.toFixed(1)} rx={2} fill={SERIES[(i + 3) % SERIES.length]} />
            <text x={xR + nodeW + 6} y={(p.y + p.h / 2 + 3).toFixed(1)} fill={AC.text} fontSize={10.5}>{nm}</text>
          </g>
        );
      })}
    </>
  );
}
export function SankeyChart({ rel, label }: { rel: { ex: string; im: string; value: number }[]; label: string }) {
  if (!rel.length) return <Empty h={320} label={label} />;
  return <Svg w={560} h={320} label={label}>{buildSankey(rel)}</Svg>;
}

/* ----------------------------- Chord ----------------------------- */
function buildChord(rel: { ex: string; im: string; value: number }[]) {
  const W = 520, H = 360, cx = W / 2, cy = H / 2, R = 128;
  const nodes = [...new Set(rel.flatMap((r) => [r.ex, r.im]))];
  const ang = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / nodes.length;
  const pos: Record<string, [number, number]> = {};
  nodes.forEach((n, i) => { pos[n] = [cx + R * Math.cos(ang(i)), cy + R * Math.sin(ang(i))]; });
  const mx = Math.max(...rel.map((r) => r.value)) || 1;
  return (
    <>
      {rel.map((rl, i) => {
        const [x0, y0] = pos[rl.ex], [x1, y1] = pos[rl.im];
        return (
          <path key={i} d={`M${x0.toFixed(1)} ${y0.toFixed(1)} Q${cx} ${cy} ${x1.toFixed(1)} ${y1.toFixed(1)}`} fill="none" stroke={SERIES[i % SERIES.length]} strokeOpacity={0.4} strokeWidth={(1 + (rl.value / mx) * 4).toFixed(1)}>
            <title>{`${rl.ex} ↔ ${rl.im}: ${fUSD(rl.value)}`}</title>
          </path>
        );
      })}
      {nodes.map((n, i) => {
        const [x, y] = pos[n], a = ang(i);
        const lx = cx + (R + 16) * Math.cos(a), ly = cy + (R + 16) * Math.sin(a);
        const an = Math.cos(a) > 0.15 ? "start" : Math.cos(a) < -0.15 ? "end" : "middle";
        const nm = n.length > 14 ? n.slice(0, 13) + "…" : n;
        return (
          <g key={i}>
            <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r={6} fill={SERIES[i % SERIES.length]} />
            <text x={lx.toFixed(1)} y={(ly + 3).toFixed(1)} textAnchor={an} fill={AC.sub} fontSize={9.5}>{nm}</text>
          </g>
        );
      })}
    </>
  );
}
export function ChordChart({ rel, label }: { rel: { ex: string; im: string; value: number }[]; label: string }) {
  if (!rel.length) return <Empty h={360} label={label} />;
  return <Svg w={520} h={360} label={label}>{buildChord(rel)}</Svg>;
}

/* ----------------------------- Matrix ----------------------------- */
function buildMatrix(rows: { name: string }[], cols: { name: string }[], valFn: (r: { name: string }, c: { name: string }) => number) {
  const W = 560, H = 300, pl = 92, pt = 64, cw = (W - pl - 10) / cols.length, ch = (H - pt - 10) / rows.length;
  let maxV = 0;
  for (const r of rows) for (const c of cols) maxV = Math.max(maxV, valFn(r, c));
  maxV = maxV || 1;
  return (
    <>
      {cols.map((c, j) => (
        <text key={"c" + j} transform={`translate(${(pl + cw * (j + 0.5)).toFixed(1)},${pt - 8}) rotate(-35)`} textAnchor="start" fill={AC.faint} fontSize={9.5}>{c.name}</text>
      ))}
      {rows.map((r, i) => (
        <g key={"r" + i}>
          <text x={pl - 6} y={(pt + ch * (i + 0.5) + 3).toFixed(1)} textAnchor="end" fill={AC.faint} fontSize={9.5}>{r.name}</text>
          {cols.map((c, j) => {
            const v = valFn(r, c), t = v / maxV;
            return (
              <g key={j}>
                <rect x={(pl + cw * j + 1).toFixed(1)} y={(pt + ch * i + 1).toFixed(1)} width={(cw - 2).toFixed(1)} height={(ch - 2).toFixed(1)} rx={3} fill={AC.accent} fillOpacity={(0.08 + t * 0.85).toFixed(2)}>
                  <title>{`${r.name} → ${c.name}: ${fUSD(v)}`}</title>
                </rect>
                {t > 0.18 && (
                  <text x={(pl + cw * (j + 0.5)).toFixed(1)} y={(pt + ch * (i + 0.5) + 3).toFixed(1)} textAnchor="middle" fill={t > 0.5 ? "#0A0E17" : AC.sub} fontSize={9}>{fUSD(v).replace("$", "")}</text>
                )}
              </g>
            );
          })}
        </g>
      ))}
    </>
  );
}
export function MatrixChart({
  rows, cols, valFn, label,
}: {
  rows: { name: string }[];
  cols: { name: string }[];
  valFn: (r: { name: string }, c: { name: string }) => number;
  label: string;
}) {
  const rs = rows.slice(0, 6), cs = cols.slice(0, 6);
  if (!rs.length || !cs.length) return <Empty h={300} label={label} />;
  return <Svg w={560} h={300} label={label}>{buildMatrix(rs, cs, valFn)}</Svg>;
}

/* ----------------------------- Flow map ----------------------------- */
function buildFlowMap(routes: { from: string; to: string; value: number }[], geo: Record<string, [number, number]>) {
  const W = 560, H = 300, pad = 14;
  const proj = (lat: number, lon: number): [number, number] => [pad + ((lon + 180) / 360) * (W - 2 * pad), pad + ((90 - lat) / 180) * (H - 2 * pad)];
  const mx = Math.max(...routes.map((r) => r.value)) || 1;
  const lons: number[] = [], lats: number[] = [];
  for (let lon = -150; lon <= 150; lon += 30) lons.push(lon);
  for (let lat = -60; lat <= 60; lat += 30) lats.push(lat);
  const pts: Record<string, [number, number]> = {};
  for (const rt of routes) for (const n of [rt.from, rt.to]) if (geo[n]) pts[n] = proj(geo[n][0], geo[n][1]);

  return (
    <>
      <rect x={0} y={0} width={W} height={H} fill={AC.panelHi} rx={10} />
      {lons.map((lon) => { const [x] = proj(0, lon); return <line key={"lo" + lon} x1={x.toFixed(1)} y1={pad} x2={x.toFixed(1)} y2={H - pad} stroke={AC.border} strokeOpacity={0.5} />; })}
      {lats.map((lat) => { const [, y] = proj(lat, 0); return <line key={"la" + lat} x1={pad} y1={y.toFixed(1)} x2={W - pad} y2={y.toFixed(1)} stroke={AC.border} strokeOpacity={0.5} />; })}
      {routes.map((rt, i) => {
        const a = geo[rt.from], b = geo[rt.to];
        if (!a || !b) return null;
        const [x0, y0] = proj(a[0], a[1]), [x1, y1] = proj(b[0], b[1]);
        const mxp = (x0 + x1) / 2, myp = (y0 + y1) / 2 - 40;
        return (
          <path key={i} d={`M${x0.toFixed(1)} ${y0.toFixed(1)} Q${mxp.toFixed(1)} ${myp.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`} fill="none" stroke={AC.accent} strokeOpacity={0.5} strokeWidth={(1 + (rt.value / mx) * 3.5).toFixed(1)}>
            <title>{`${rt.from} → ${rt.to}: ${fUSD(rt.value)}`}</title>
          </path>
        );
      })}
      {Object.keys(pts).map((n) => {
        const [x, y] = pts[n];
        return (
          <g key={n}>
            <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r={4} fill={AC.cyan} />
            <text x={(x + 6).toFixed(1)} y={(y + 3).toFixed(1)} fill={AC.sub} fontSize={9}>{n}</text>
          </g>
        );
      })}
    </>
  );
}
export function FlowMap({ routes, geo, label }: { routes: { from: string; to: string; value: number }[]; geo: Record<string, [number, number]>; label: string }) {
  if (!routes.length) return <Empty h={300} label={label} />;
  return <Svg w={560} h={300} label={label}>{buildFlowMap(routes, geo)}</Svg>;
}

/* ----------------------------- Sparkline ----------------------------- */
export function Sparkline({ values, color }: { values: number[]; color: string }) {
  const gid = React.useId().replace(/:/g, "");
  if (!values.length) return null;
  const W = 170, H = 24, max = Math.max(...values), min = Math.min(...values), rg = max - min || 1;
  const x = (i: number) => (i * W) / Math.max(1, values.length - 1);
  const y = (v: number) => H - ((v - min) / rg) * H;
  const line = values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  return (
    <Svg w={W} h={H} label="trend sparkline">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.5} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={`${line} L${W} ${H} L0 ${H} Z`} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth={1.6} />
    </Svg>
  );
}

export { fUSD, fNum };
