"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * True once mounted on the client. Used to defer rendering of components that
 * can't measure during SSR (e.g. Recharts ResponsiveContainer). Lint-clean via
 * useSyncExternalStore (no set-state-in-effect).
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
