import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Slim top-of-page announcement strip, above the header. Static link, no
 * dismiss state — kept intentionally simple for this route.
 */
export function AnnouncementStrip() {
  return (
    <div className="bg-navy-deep px-4 py-2 text-center text-xs font-medium text-white/80">
      Explore import-export intelligence across 40+ countries{" "}
      <Link href="#global-coverage" className="inline-flex items-center gap-1 font-semibold text-white hover:underline">
        View country coverage <ArrowRight className="size-3" aria-hidden />
      </Link>
    </div>
  );
}

const CHIPS = [
  { label: "Solar Panels", className: "left-2 top-2" },
  { label: "HS Code 8541", className: "right-2 top-10" },
  { label: "Active Suppliers", className: "left-6 bottom-10" },
  { label: "Shipment Records", className: "right-6 bottom-0" },
] as const;

/**
 * Decorative floating search-suggestion chips around the hero search card.
 * Illustrative, product-agnostic labels — shown to signal search breadth,
 * not to imply the platform is limited to one category. Rendered in a wide
 * (68rem) box centred on the same point as the (much narrower, max-w-2xl)
 * search card, so chips sit clear in the margin either side of it instead
 * of overlapping it. Only shown at `2xl`+, where that margin actually
 * exists on typical viewports.
 */
export function HeroFloatingChips() {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 hidden h-56 w-[68rem] max-w-none -translate-x-1/2 -translate-y-1/2 2xl:block"
      aria-hidden
    >
      {CHIPS.map((c) => (
        <span
          key={c.label}
          className={`animate-float absolute ${c.className} inline-flex items-center whitespace-nowrap rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm`}
        >
          {c.label}
        </span>
      ))}
    </div>
  );
}
