import type { Metadata } from "next";
import { Mail, Clock, MessageSquare } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/ui/misc";
import { DemoRequestForm } from "@/components/forms/demo-request-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact & demo request",
  description:
    "Request a guided demo of Vaskodigama or ask a trade analyst a question.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Request a guided demo"
        subtitle="Tell us what you’re trying to achieve and we’ll tailor the walkthrough."
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
          <aside className="space-y-4">
            <Item icon={MessageSquare} title="Guided demo" body="A walkthrough tailored to your product, market and goal." />
            <Item icon={Mail} title="Email" body={siteConfig.contactEmail} />
            <Item icon={Clock} title="Response" body="We aim to reply within a couple of business days." />
            <p className="rounded-lg bg-surface p-3 text-xs text-muted">
              This is a demonstration form. Submitting it does not send an email
              or create a record.
            </p>
          </aside>
          <div>
            <DemoRequestForm />
          </div>
        </div>
      </Section>
    </>
  );
}

function Item({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Mail;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-4">
      <Icon className="mt-0.5 size-5 text-primary" aria-hidden />
      <div>
        <p className="font-semibold text-navy">{title}</p>
        <p className="text-sm text-muted">{body}</p>
      </div>
    </div>
  );
}
