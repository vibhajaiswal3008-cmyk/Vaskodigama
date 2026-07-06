export type IconName =
  | "box" | "cash" | "users" | "factory" | "globe" | "ship" | "chart"
  | "pin" | "flag" | "clock" | "target" | "trend";

const PATHS: Record<IconName, React.ReactNode> = {
  box: <><path d="M21 8 12 3 3 8v8l9 5 9-5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="m3 8 9 5 9-5M12 13v8" stroke="currentColor" strokeWidth="1.8" /></>,
  cash: <><rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" /></>,
  users: <><circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" /><path d="M3 20a6 6 0 0 1 12 0M16 6a3 3 0 0 1 0 6m5 8a5 5 0 0 0-4-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></>,
  factory: <path d="M3 21V9l6 4V9l6 4V5l6 3v13z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />,
  globe: <><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" stroke="currentColor" strokeWidth="1.8" /></>,
  ship: <path d="M3 14 12 4l9 10M5 14v6h14v-6M9 14V8h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />,
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />,
  pin: <><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" /></>,
  flag: <path d="M5 21V4m0 0 9 2 5-1v9l-5 1-9-2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />,
  clock: <><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></>,
  target: <><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.8" /></>,
  trend: <path d="M3 17l6-6 4 4 8-8M21 7v5m0-5h-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      {PATHS[name]}
    </svg>
  );
}

// Inline glyphs used in buttons / chrome (kept as small components).
export const LockGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none"><path d="M7 11V7a5 5 0 0 1 10 0v4M5 11h14v9H5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
);
export const SearchGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" /><path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
);
export const DownloadGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
export const ArrowGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
export const WarnGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
);
