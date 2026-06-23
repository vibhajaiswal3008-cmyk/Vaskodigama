import type { Metadata } from "next";
import { SolutionPage, solutions } from "@/components/marketing/solution-page";

export const metadata: Metadata = {
  title: solutions.procurement.title,
  description: solutions.procurement.subtitle,
};

export default function Page() {
  return <SolutionPage slug="procurement" />;
}
