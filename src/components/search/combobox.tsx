"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ComboOption {
  value: string;
  label: string;
  hint?: string;
  group?: string;
}

/**
 * Accessible combobox (WAI-ARIA pattern). Free text in the input filters the
 * options; arrow keys move the active option; Enter selects; Escape closes.
 * Suggestions are provided by the parent (already filtered or full list).
 */
export function Combobox({
  id,
  value,
  onValueChange,
  onSelect,
  options,
  placeholder,
  emptyHint,
  ariaLabel,
  describedBy,
  invalid,
}: {
  id: string;
  value: string;
  onValueChange: (v: string) => void;
  onSelect: (option: ComboOption) => void;
  options: ComboOption[];
  placeholder?: string;
  emptyHint?: string;
  ariaLabel: string;
  describedBy?: string;
  invalid?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const listId = `${id}-listbox`;
  const wrapRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function choose(opt: ComboOption) {
    onSelect(opt);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      if (open && options[active]) {
        e.preventDefault();
        choose(options[active]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <input
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-label={ariaLabel}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onValueChange(e.target.value);
          setOpen(true);
          setActive(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className={cn(
          "h-11 w-full rounded-md border border-border-strong bg-background px-3 text-sm text-navy placeholder:text-muted",
          "focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring",
          invalid && "border-danger",
        )}
      />
      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          className="absolute z-30 mt-1 max-h-72 w-full overflow-auto rounded-md border border-border bg-background p-1 shadow-md"
        >
          {options.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted">
              {emptyHint ?? "No matches. Try a different term."}
            </li>
          ) : (
            options.map((opt, i) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(opt);
                }}
                className={cn(
                  "flex cursor-pointer items-start justify-between gap-3 rounded px-3 py-2 text-sm",
                  i === active ? "bg-primary-soft" : "hover:bg-surface",
                )}
              >
                <span className="font-medium text-navy">{opt.label}</span>
                {opt.hint ? (
                  <span className="shrink-0 text-xs text-muted">{opt.hint}</span>
                ) : null}
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
