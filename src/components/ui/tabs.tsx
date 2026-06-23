"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  count?: number;
}

/**
 * Accessible tablist. Roving focus with arrow keys; panels owned by parent.
 * Controlled via `value`/`onChange` so it works with URL state if desired.
 */
export function Tabs({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: Tab[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  const refs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  function onKeyDown(e: React.KeyboardEvent) {
    const idx = tabs.findIndex((t) => t.id === value);
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const dir = e.key === "ArrowRight" ? 1 : -1;
      const next = tabs[(idx + dir + tabs.length) % tabs.length];
      onChange(next.id);
      refs.current[next.id]?.focus();
    }
  }

  return (
    <div
      role="tablist"
      aria-label="Result sections"
      onKeyDown={onKeyDown}
      className={cn(
        "scroll-x flex gap-1 border-b border-border",
        className,
      )}
    >
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[t.id] = el;
            }}
            role="tab"
            type="button"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(t.id)}
            className={cn(
              "relative whitespace-nowrap border-b-2 px-3.5 py-2.5 text-sm font-medium transition-colors",
              active
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-navy",
            )}
          >
            {t.label}
            {typeof t.count === "number" ? (
              <span className="ml-1.5 text-xs text-muted">{t.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
