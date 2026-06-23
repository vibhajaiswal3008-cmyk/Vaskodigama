import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/ui/misc";
import { LegalBody } from "@/components/marketing/legal-body";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms for using this demonstration build.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Terms"
        title="Terms of use"
        subtitle="A plain-language summary for this demonstration build."
      />
      <Section>
        <LegalBody>
          <p>
            <strong>Demonstration only.</strong> Vaskodigama, as presented here,
            is a demonstration. All trade data, companies, buyers, suppliers,
            shipments, prices and scores are illustrative and fictional.
          </p>
          <h2>No reliance</h2>
          <p>
            Nothing on this site should be relied upon for commercial,
            regulatory or financial decisions. The Opportunity Score is an
            illustrative guide, not a validated metric.
          </p>
          <h2>No accounts or payments</h2>
          <p>
            Sign-in, registration and subscription flows are demonstrations.
            They do not create real accounts, charge any money, or grant access
            to a real dataset.
          </p>
          <h2>Acceptable use</h2>
          <p>
            Use the demonstration to evaluate the product experience. Do not
            attempt to misuse the site or present its illustrative data as real.
          </p>
          <h2>Changes</h2>
          <p>
            These terms may change as the product develops toward a production
            release.
          </p>
          <p className="text-sm text-muted">
            These terms are illustrative and are not legal advice.
          </p>
        </LegalBody>
      </Section>
    </>
  );
}
