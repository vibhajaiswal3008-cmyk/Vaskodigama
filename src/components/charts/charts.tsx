"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useMounted } from "@/hooks/use-mounted";
import { formatMonth } from "@/lib/utils";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
];

const axisProps = {
  stroke: "var(--muted)",
  fontSize: 12,
  tickLine: false,
  axisLine: false,
} as const;

const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid var(--border)",
  fontSize: 12,
  boxShadow: "var(--shadow-sm)",
} as const;

/**
 * Every chart is paired with a text summary by its caller for accessibility.
 * The SVG itself is marked aria-hidden via role="img" + an aria-label.
 */
function ChartFrame({
  height = 240,
  label,
  children,
}: {
  height?: number;
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

export function DemandChart({
  data,
  label,
  height,
}: {
  data: { period: string; value: number }[];
  label: string;
  height?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <ChartFrame height={height} label={label}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="demandFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.25} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="period" tickFormatter={formatMonth} {...axisProps} />
        <YAxis {...axisProps} width={48} />
        <Tooltip contentStyle={tooltipStyle} labelFormatter={(v) => formatMonth(String(v))} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#demandFill)"
          isAnimationActive={!reduced}
        />
      </AreaChart>
    </ChartFrame>
  );
}

export function PriceChart({
  data,
  label,
  height,
}: {
  data: { period: string; avgUnitPrice: number; min: number; max: number }[];
  label: string;
  height?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <ChartFrame height={height} label={label}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="period" tickFormatter={formatMonth} {...axisProps} />
        <YAxis {...axisProps} width={48} domain={["auto", "auto"]} />
        <Tooltip contentStyle={tooltipStyle} labelFormatter={(v) => formatMonth(String(v))} />
        <Line type="monotone" dataKey="min" stroke="var(--chart-4)" strokeWidth={1} dot={false} strokeDasharray="4 3" isAnimationActive={!reduced} />
        <Line type="monotone" dataKey="avgUnitPrice" stroke="var(--chart-1)" strokeWidth={2} dot={false} isAnimationActive={!reduced} />
        <Line type="monotone" dataKey="max" stroke="var(--chart-3)" strokeWidth={1} dot={false} strokeDasharray="4 3" isAnimationActive={!reduced} />
      </LineChart>
    </ChartFrame>
  );
}

export function ComparisonBar({
  data,
  label,
  height,
}: {
  data: { name: string; value: number }[];
  label: string;
  height?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <ChartFrame height={height} label={label}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="name" {...axisProps} />
        <YAxis {...axisProps} width={40} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--surface-2)" }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive={!reduced}>
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ChartFrame>
  );
}
