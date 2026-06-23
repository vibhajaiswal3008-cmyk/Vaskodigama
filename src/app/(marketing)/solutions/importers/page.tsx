import type { Metadata } from "next";
import { SolutionPage, solutions } from "@/components/marketing/solution-page";

export const metadata: Metadata = {
  title: solutions.importers.title,
  description: solutions.importers.subtitle,
};

export default function Page() {
  return <SolutionPage slug="importers" />;
}
