import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { IllustrativeBadge } from "@/components/shared/illustrative";
import { DataQualityPanel } from "@/components/shared/data-quality";
import { OpportunityScoreCard } from "@/components/opportunity/opportunity-score";
import { CompanyTimeline } from "@/components/company/company-timeline";
import { baseDataQuality } from "@/data/mock/quality";
import { getCompany } from "@/data/mock/companies";

describe("intelligence components", () => {
  it("renders the illustrative-data label", () => {
    render(<IllustrativeBadge />);
    expect(screen.getByText(/Illustrative demo data/)).toBeInTheDocument();
  });

  it("renders the data-quality panel with honest caveats", () => {
    render(<DataQualityPanel q={baseDataQuality} />);
    expect(screen.getByText(/What stands behind this/)).toBeInTheDocument();
    expect(screen.getByText(/Data limitations/)).toBeInTheDocument();
    // Never claims completeness as a guarantee.
    expect(screen.getByText(/estimated/)).toBeInTheDocument();
  });

  it("renders an Opportunity Score with its factors", () => {
    const company = getCompany("meridian-imports")!;
    render(<OpportunityScoreCard score={company.opportunity} />);
    expect(
      screen.getByRole("img", { name: /Opportunity Score 87 out of 100/ }),
    ).toBeInTheDocument();
    expect(screen.getByText("Recent trade activity")).toBeInTheDocument();
  });

  it("renders the company timeline events", () => {
    const company = getCompany("meridian-imports")!;
    render(<CompanyTimeline events={company.timeline ?? []} />);
    expect(screen.getByText(/Natural honey first observed/)).toBeInTheDocument();
  });
});
