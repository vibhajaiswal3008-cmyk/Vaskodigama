import type { Alert, Insight, SavedItem } from "@/types";

/** Illustrative saved items shown in the dashboard. */
export const savedItems: SavedItem[] = [
  { id: "sv1", kind: "search", label: "Natural honey → UAE", detail: "Imports of natural honey into UAE from India", href: "/dashboard/search?product=natural-honey&dest=AE&origin=IN", savedAt: "2025-11-19" },
  { id: "sv2", kind: "company", label: "Meridian Imports FZE", detail: "Buyer · United Arab Emirates", href: "/dashboard/companies/meridian-imports", savedAt: "2025-11-18" },
  { id: "sv3", kind: "supplier", label: "Sunhive Exports Pvt. Ltd.", detail: "Supplier · Gujarat, India", href: "/dashboard/companies/sunhive-exports", savedAt: "2025-11-15" },
  { id: "sv4", kind: "market", label: "Saudi Arabia · Honey imports", detail: "Rising demand, low competition", href: "/dashboard/markets?country=SA", savedAt: "2025-11-10" },
  { id: "sv5", kind: "product", label: "Coffee", detail: "Food & agriculture · HS 0901", href: "/dashboard/search?product=coffee", savedAt: "2025-11-02" },
] as unknown as SavedItem[];

/** Illustrative alerts. */
export const alerts: Alert[] = [
  { id: "al1", name: "New honey buyers in UAE", query: "Natural honey imports into UAE", frequency: "weekly", channels: ["email", "in-app"], createdAt: "2025-11-01", active: true, watch: ["buyers", "markets"] },
  { id: "al2", name: "Price moves — honey", query: "Natural honey average price (India → UAE)", frequency: "monthly", channels: ["in-app"], createdAt: "2025-10-12", active: true, watch: ["prices"] },
  { id: "al3", name: "Competitor activity — Sunhive", query: "Sunhive Exports new destination markets", frequency: "weekly", channels: ["email"], createdAt: "2025-09-20", active: false, watch: ["competitors", "suppliers"] },
];

/** Illustrative "What Changed" feed entries. */
export const changeFeed: (Insight & { category: Alert["watch"][number] })[] = [
  { id: "ch1", category: "buyers", title: "New buyer observed in UAE", body: "An additional UAE-based buyer appeared in honey import records this month.", evidence: ["First illustrative shipment recorded Nov 2025", "Sourced from Gujarat, India"], confidence: "medium", dataDate: "2025-12-01" },
  { id: "ch2", category: "prices", title: "Average price edged up", body: "The illustrative average unit price rose versus the prior month.", evidence: ["Avg moved from 3.22 to 3.30 USD/kg", "Range widened slightly"], confidence: "medium", dataDate: "2025-12-01" },
  { id: "ch3", category: "suppliers", title: "Supplier added a destination", body: "Sunhive Exports began shipping to a new European market.", evidence: ["New destination: Germany", "Consistent monthly cadence"], confidence: "high", dataDate: "2025-12-01" },
  { id: "ch4", category: "competitors", title: "Competitor volume increased", body: "A competing exporter's monthly volume rose over recent months.", evidence: ["Volume up across Q4 2025"], confidence: "low", dataDate: "2025-12-01" },
  { id: "ch5", category: "markets", title: "Saudi demand accelerating", body: "Illustrative import demand in Saudi Arabia continues to rise.", evidence: ["+22.7% illustrative YoY", "Competition remains low"], confidence: "medium", dataDate: "2025-12-01" },
];
