"use client";

import * as React from "react";
import {
  Users,
  Factory,
  Globe2,
  Crosshair,
  Scale,
  Activity,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const goals = [
  {
    id: "buyers",
    label: "Find buyers for my product",
    icon: Users,
    scenario: "Show active buyers of natural honey, ranked by recent activity.",
    href: "/demo?type=product&term=Natural%20honey&dir=export&origin=IN",
  },
  {
    id: "suppliers",
    label: "Discover reliable suppliers",
    icon: Factory,
    scenario: "Compare suppliers by shipment consistency and price position.",
    href: "/demo?type=product&term=Natural%20honey&dir=import&dest=AE",
  },
  {
    id: "market",
    label: "Enter a new market",
    icon: Globe2,
    scenario: "Rank markets by demand, competition and Opportunity Score.",
    href: "/demo?type=product&term=Natural%20honey&dir=export&origin=IN&dest=SA",
  },
  {
    id: "competitor",
    label: "Analyse a competitor",
    icon: Crosshair,
    scenario: "Trace a competitor's products, suppliers and new markets.",
    href: "/demo?type=company&term=Sunhive",
  },
  {
    id: "prices",
    label: "Compare trade prices",
    icon: Scale,
    scenario: "See price ranges and how they move across markets.",
    href: "/demo?type=product&term=Natural%20honey",
  },
  {
    id: "changes",
    label: "Track market changes",
    icon: Activity,
    scenario: "Monitor new buyers, price moves and competitor activity.",
    href: "/demo?type=product&term=Natural%20honey&dest=AE",
  },
] as const;

export function GoalSelector() {
  const [active, setActive] = React.useState<(typeof goals)[number]["id"]>("buyers");
  const selected = goals.find((g) => g.id === active)!;

  return (
    <div>
      <h2 className="text-center text-2xl font-bold text-navy sm:text-3xl">
        What are you trying to achieve?
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-center text-muted">
        Pick a goal and we’ll tailor the search and the example you see.
      </p>

      <div className="mx-auto mt-6 grid max-w-4xl gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {goals.map((g) => {
          const Icon = g.icon;
          const isActive = g.id === active;
          return (
            <button
              key={g.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive(g.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-3.5 text-left transition-colors",
                isActive
                  ? "border-primary bg-primary-soft"
                  : "border-border bg-background hover:bg-surface",
              )}
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-md",
                  isActive ? "bg-primary text-primary-foreground" : "bg-surface-2 text-primary",
                )}
              >
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="text-sm font-semibold text-navy">{g.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mx-auto mt-5 flex max-w-2xl flex-col items-center gap-3 rounded-lg bg-surface-2 p-4 text-center sm:flex-row sm:text-left">
        <p className="flex-1 text-sm text-navy">
          <span className="font-semibold">Example: </span>
          {selected.scenario}
        </p>
        <Link
          href={selected.href}
          className="inline-flex shrink-0 items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          See it in the demo
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
