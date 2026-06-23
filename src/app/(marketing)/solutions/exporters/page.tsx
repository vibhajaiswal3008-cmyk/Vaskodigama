import type { Metadata } from "next";
import { SolutionPage, solutions } from "@/components/marketing/solution-page";

export const metadata: Metadata = {
  title: solutions.exporters.title,
  description: solutions.exporters.subtitle,
};

export default function Page() {
  return <SolutionPage slug="exporters" />;
}
