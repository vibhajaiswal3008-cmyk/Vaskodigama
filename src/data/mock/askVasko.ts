import type { Confidence } from "@/types";

/**
 * Pre-built, local responses for the "Ask Vasko" demonstration assistant.
 * No external AI API is called. Every answer carries supporting evidence,
 * a confidence indicator and a data date — recommendations are never shown
 * without the reasoning behind them.
 */
export interface AskVaskoResponse {
  id: string;
  /** Keywords used to match a free-text question to this canned answer. */
  match: string[];
  question: string;
  answer: string;
  markets: { country: string; reason: string; growth: number }[];
  priceRange: string;
  buyers: string[];
  chart: { label: string; value: number }[];
  evidence: string[];
  confidence: Confidence;
  dataDate: string;
}

export const askVaskoResponses: AskVaskoResponse[] = [
  {
    id: "honey-markets",
    match: ["honey", "market", "demand", "export", "india"],
    question:
      "I export natural honey from India. Which markets show increasing demand, manageable competition and suitable pricing?",
    answer:
      "Based on the illustrative dataset, the United Arab Emirates and Saudi Arabia stand out: both show rising import demand with low-to-moderate competition, and average prices sit close to the wider market range. The United States is larger but more crowded, which lowers its entry score.",
    markets: [
      { country: "Saudi Arabia", reason: "Fast-rising demand, low competition", growth: 22.7 },
      { country: "United Arab Emirates", reason: "Rising demand, moderate competition", growth: 18.4 },
      { country: "United States", reason: "Large but highly competitive", growth: 6.1 },
    ],
    priceRange: "≈ 2.7 – 3.8 USD/kg (illustrative)",
    buyers: ["Meridian Imports FZE", "Gulf Pantry Trading LLC", "Northwind Foods Inc."],
    chart: [
      { label: "Saudi Arabia", value: 82 },
      { label: "UAE", value: 86 },
      { label: "United States", value: 71 },
      { label: "Germany", value: 64 },
    ],
    evidence: [
      "UAE import demand rose steadily across 2025 (illustrative).",
      "Saudi competition is currently low with concentrated supply.",
      "Average unit prices observed between 2.7 and 3.8 USD/kg.",
    ],
    confidence: "medium",
    dataDate: "2025-12-01",
  },
  {
    id: "buyers-uae",
    match: ["buyer", "uae", "who", "purchasing", "active"],
    question: "Which buyers are actively purchasing honey in the UAE?",
    answer:
      "In the illustrative dataset, Meridian Imports FZE shows the most consistent recent activity, followed by Gulf Pantry Trading LLC. Meridian appears to rely on a small supplier base, which can make it more receptive to a new, dependable exporter.",
    markets: [{ country: "United Arab Emirates", reason: "Active buyers with recent shipments", growth: 18.4 }],
    priceRange: "≈ 2.7 – 3.5 USD/kg (illustrative)",
    buyers: ["Meridian Imports FZE", "Gulf Pantry Trading LLC"],
    chart: [
      { label: "Meridian", value: 87 },
      { label: "Gulf Pantry", value: 79 },
    ],
    evidence: [
      "Meridian's most recent shipment was recorded Nov 2025.",
      "Meridian appears to use a limited supplier base (≈3 suppliers).",
    ],
    confidence: "medium",
    dataDate: "2025-12-01",
  },
];

/** Find the best canned response by keyword overlap; falls back to the first. */
export function matchAskVasko(question: string): AskVaskoResponse {
  const q = question.toLowerCase();
  let best = askVaskoResponses[0];
  let bestScore = -1;
  for (const r of askVaskoResponses) {
    const s = r.match.reduce((acc, k) => acc + (q.includes(k) ? 1 : 0), 0);
    if (s > bestScore) {
      bestScore = s;
      best = r;
    }
  }
  return best;
}

export const askVaskoSuggestions = [
  "I export natural honey from India. Which markets show increasing demand?",
  "Which buyers are actively purchasing honey in the UAE?",
];
