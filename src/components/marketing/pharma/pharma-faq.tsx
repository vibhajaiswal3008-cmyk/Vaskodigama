"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  q: string;
  a: string;
}

/**
 * Accessible single-open accordion for the pharma landing FAQ.
 *
 * Uses real button/region semantics (aria-expanded / aria-controls) and a
 * grid-rows height transition that the global prefers-reduced-motion rule
 * neutralises automatically.
 */
export function PharmaFaq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = React.useState<number | null>(0);
  const baseId = React.useId();

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-background/70 backdrop-blur">
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${baseId}-q-${i}`;
        const panelId = `${baseId}-a-${i}`;
        return (
          <li key={item.q}>
            <h3>
              <button
                type="button"
                id={btnId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-surface"
              >
                <span className="font-semibold text-navy">{item.q}</span>
                <ChevronDown
                  className={cn(
                    "size-5 shrink-0 text-primary transition-transform duration-[var(--duration)]",
                    isOpen && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className={cn(
                "grid transition-[grid-template-rows] duration-[var(--duration-slow)] ease-[var(--ease)]",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted">
                  {item.a}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
