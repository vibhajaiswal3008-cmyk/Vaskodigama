"use client";

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import { formatCompact } from "@/lib/utils";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
];

const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid var(--border)",
  fontSize: 12,
  boxShadow: "var(--shadow-sm)",
} as const;

/** Mount-gated, accessible chart frame (caller supplies the text summary). */
function Frame({
  height,
  label,
  children,
}: {
  height: number;
  label: string;
  children: React.ReactElement;
}) {
  const mounted = useMounted();
  return (
    <div role="img" aria-label={label} style={{ width: "100%", height }}>
      {mounted ? (
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      ) : null}
    </div>
  );
}

/** Horizontal ranked bars — good for "top countries / partners". */
export function HorizontalBars({
  data,
  label,
  height = 240,
  valueFormatter = formatCompact,
}: {
  data: { name: string; value: number }[];
  label: string;
  height?: number;
  valueFormatter?: (n: number) => string;
}) {
  const reduced = useReducedMotion();
  return (
    <Frame height={height} label={label}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 4, right: 44, left: 8, bottom: 4 }}
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={128}
          tickLine={false}
          axisLine={false}
          stroke="var(--muted)"
          fontSize={12}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          cursor={{ fill: "var(--surface-2)" }}
          formatter={(v) => [valueFormatter(Number(v)), "Value"]}
        />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} isAnimationActive={!reduced}>
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
          <LabelList
            dataKey="value"
            position="right"
            formatter={(v) => valueFormatter(Number(v))}
            fontSize={11}
            fill="var(--muted-strong)"
          />
        </Bar>
      </BarChart>
    </Frame>
  );
}

/** Donut chart — good for split / distribution shares. */
export function DonutChart({
  data,
  label,
  height = 240,
  valueFormatter = formatCompact,
}: {
  data: { name: string; value: number }[];
  label: string;
  height?: number;
  valueFormatter?: (n: number) => string;
}) {
  const reduced = useReducedMotion();
  return (
    <Frame height={height} label={label}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="58%"
          outerRadius="86%"
          paddingAngle={2}
          stroke="var(--background)"
          strokeWidth={2}
          isAnimationActive={!reduced}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v, n) => [valueFormatter(Number(v)), n]}
        />
      </PieChart>
    </Frame>
  );
}
