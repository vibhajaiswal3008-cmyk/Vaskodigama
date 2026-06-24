"use client";

import { StatCountUp } from "@/components/marketing/home/stat-countup";

interface Stat {
  value: React.ReactNode;
  label: string;
  sub: string;
}

/** Vibrant credibility band. Numeric stats count up once when in view. */
export function StatBand() {
  const stats: Stat[] = [
    { value: <>260<span className="text-2xl align-top">+</span> Cr</>, label: "Trade-data records", sub: "Intelligence built on 260+ crore records" },
    { value: <><StatCountUp value={40} /></>, label: "Covered markets", sub: "Country-level import & export views" },
    { value: <><StatCountUp value={7} /></>, label: "Search paths", sub: "Product, HS Code, company, buyer & more" },
    { value: <>1</>, label: "Unified workspace", sub: "Search, compare and analyse in one place" },
  ];
  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-background p-6 text-center sm:text-left">
          <p className="text-3xl font-extrabold tabular-nums text-gradient sm:text-4xl">
            {s.value}
          </p>
          <p className="mt-1 font-semibold text-navy">{s.label}</p>
          <p className="mt-1 text-sm text-muted">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}
