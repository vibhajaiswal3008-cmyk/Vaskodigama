"use client";

import * as React from "react";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Lightweight, accessible info tooltip. Opens on hover and focus, closes on
 * Escape/blur. Used for explaining technical concepts (HS codes, etc.) in
 * plain language. The trigger is a real button for keyboard users.
 */
export function InfoTooltip({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const id = React.useId();

  return (
    <span className={cn("relative inline-flex", className)}>
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        className="inline-flex items-center text-muted hover:text-primary focus-visible:text-primary"
      >
        <HelpCircle className="size-4" aria-hidden />
      </button>
      {open ? (
        <span
          role="tooltip"
          id={id}
          className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-md border border-border bg-background p-3 text-xs leading-relaxed text-muted-strong shadow-md"
        >
          {children}
        </span>
      ) : null}
    </span>
  );
}
