import {
  Boxes,
  PackagePlus,
  TrendingUp,
  UserMinus,
  Globe2,
  Layers,
  Activity,
} from "lucide-react";
import type { TradeEvent } from "@/types";
import { formatDate } from "@/lib/utils";

const eventIcon: Record<TradeEvent["type"], typeof Boxes> = {
  "product-first-seen": Boxes,
  "supplier-added": PackagePlus,
  "volume-increase": TrendingUp,
  "supplier-discontinued": UserMinus,
  "new-sourcing-country": Globe2,
  "product-diversification": Layers,
  "recent-activity": Activity,
};

/** Vertical timeline used for the Company X-Ray. */
export function CompanyTimeline({ events }: { events: TradeEvent[] }) {
  const sorted = [...events].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <ol className="relative space-y-4 border-l border-border pl-6">
      {sorted.map((ev) => {
        const Icon = eventIcon[ev.type];
        return (
          <li key={ev.id} className="relative">
            <span className="absolute -left-[31px] flex size-6 items-center justify-center rounded-full border border-border bg-background text-primary">
              <Icon className="size-3.5" aria-hidden />
            </span>
            <p className="text-xs text-muted">{formatDate(ev.date)}</p>
            <p className="text-sm font-semibold text-navy">{ev.label}</p>
            <p className="text-sm text-muted">{ev.detail}</p>
          </li>
        );
      })}
    </ol>
  );
}
