/** Analytics-dashboard color palette (dark workspace). */
export const AC = {
  bg: "#070A12", panel: "#0E1422", panelHi: "#141C2E",
  border: "#1C2740", borderHi: "#2A3A57",
  text: "#E8EDF6", sub: "#8A98B5", faint: "#566381",
  accent: "#4F8CFF", teal: "#22D3A7", violet: "#A78BFA",
  amber: "#F5B544", cyan: "#36D6E7", rose: "#FB6F92",
} as const;

export const SERIES = [
  AC.accent, AC.teal, AC.violet, AC.amber, AC.cyan,
  AC.rose, "#6EE7B7", "#93C5FD", "#C4B5FD", "#5EEAD4",
];

const num = (n: unknown): number =>
  typeof n === "number" && Number.isFinite(n) ? n : 0;

/** Compact USD, safe against null/undefined/NaN. */
export function fUSD(n: unknown): string {
  const v = num(n);
  const a = Math.abs(v);
  if (a >= 1e9) return "$" + (v / 1e9).toFixed(2) + "B";
  if (a >= 1e6) return "$" + (v / 1e6).toFixed(1) + "M";
  if (a >= 1e3) return "$" + (v / 1e3).toFixed(1) + "K";
  return "$" + Math.round(v);
}

/** Compact number, safe. */
export function fNum(n: unknown): string {
  const v = num(n);
  const a = Math.abs(v);
  if (a >= 1e6) return (v / 1e6).toFixed(2) + "M";
  if (a >= 1e3) return (v / 1e3).toFixed(1) + "K";
  return Math.round(v).toLocaleString("en-US");
}

/** Plain integer with separators, safe. */
export function fInt(n: unknown): string {
  return Math.round(num(n)).toLocaleString("en-US");
}

export interface DeltaParts {
  up: boolean;
  text: string;
}

/** Returns sign + formatted magnitude for a growth %, safe. */
export function deltaParts(v: unknown): DeltaParts {
  const x = num(v);
  return { up: x >= 0, text: `${x >= 0 ? "▲" : "▼"} ${Math.abs(x).toFixed(1)}%` };
}
