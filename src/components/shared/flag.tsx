import * as React from "react";
import * as Flags from "country-flag-icons/react/3x2";
import { cn } from "@/lib/utils";

type FlagComponent = React.ComponentType<{ title?: string; className?: string }>;

/**
 * Renders a real SVG country flag by ISO 3166-1 alpha-2 code.
 *
 * We use SVGs (not emoji flags) because Windows has no flag-emoji font — emoji
 * flags fall back to two-letter boxes there. Bundled, MIT-licensed, no runtime
 * network calls. Falls back to the code text if a flag is missing.
 */
export function Flag({
  code,
  title,
  className,
}: {
  code?: string;
  title?: string;
  className?: string;
}) {
  const key = (code ?? "").toUpperCase();
  const C = (Flags as Record<string, FlagComponent>)[key];
  if (!C) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-[2px] bg-surface-2 text-[0.6rem] font-semibold text-muted",
          className,
        )}
        aria-hidden
      >
        {key || "—"}
      </span>
    );
  }
  return (
    <C
      title={title ?? key}
      className={cn("inline-block rounded-[2px] object-cover align-middle shadow-xs", className)}
    />
  );
}
