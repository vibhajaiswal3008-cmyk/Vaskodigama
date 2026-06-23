import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Required label that marks any data surface as illustrative. Per the data-
 * truthfulness rules, every dashboard / result view must show this.
 */
export function IllustrativeBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning-soft px-2.5 py-1 text-xs font-medium text-warning",
        className,
      )}
    >
      <Info className="size-3.5" aria-hidden />
      Illustrative demo data
    </span>
  );
}
