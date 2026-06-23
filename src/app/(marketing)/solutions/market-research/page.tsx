import type { Metadata } from "next";
import { SolutionPage, solutions } from "@/components/marketing/solution-page";

export const metadata: Metadata = {
  title: solutions["market-research"].title,
  description: solutions["market-research"].subtitle,
};

export default function Page() {
  return <SolutionPage slug="market-research" />;
}
