import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/ui/misc";
import { LegalBody } from "@/components/marketing/legal-body";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How this demonstration build handles information.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="Privacy notice"
        subtitle="A plain-language summary for this demonstration build."
      />
      <Section>
        <LegalBody>
          <p>
            <strong>This is a demonstration site.</strong> It is not connected to
            a production backend, payment provider, or live customs data source.
            Forms on this site do not send email or create accounts.
          </p>
          <h2>Information we would collect (in production)</h2>
          <p>
            A live version would collect the details you submit in forms (such as
            your name, work email and company) to respond to demo requests and
            provide the service. We would not sell personal data.
          </p>
          <h2>Cookies</h2>
          <p>
            This build uses your browser’s local storage to remember small
            preferences (such as a dismissed banner and cookie choices). You can
            manage these via “Cookie preferences” in the footer. No third-party
            analytics tracker is loaded in this demonstration.
          </p>
          <h2>Your choices</h2>
          <p>
            In a production deployment you would be able to request access to, or
            deletion of, your personal data. For this demo, no personal data is
            stored on a server.
          </p>
          <h2>Contact</h2>
          <p>
            Questions about this notice can be directed through the contact page.
          </p>
          <p className="text-sm text-muted">
            This notice is illustrative and is not legal advice.
          </p>
        </LegalBody>
      </Section>
    </>
  );
}
