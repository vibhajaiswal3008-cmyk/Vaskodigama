import type { Metadata } from "next";
import { Compass, Eye, HeartHandshake, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/ui/misc";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why we built Vaskodigama: trade intelligence that leads with decisions and evidence, not record counts.",
};

const values = [
  { icon: Compass, title: "Decisions first", body: "We lead with what to do next, not with how many rows we hold." },
  { icon: Eye, title: "Evidence in the open", body: "Every recommendation shows its reasoning, confidence and data date." },
  { icon: ShieldCheck, title: "Honest about limits", body: "We never claim 100% accuracy or describe illustrative data as live." },
  { icon: HeartHandshake, title: "Human when it counts", body: "Technology for speed; people for the harder, judgement-heavy questions." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Trade intelligence that tells you what to do next"
        subtitle="Most platforms hand you records. We focus on turning those records into clear, defensible decisions."
      />
      <Section>
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-navy">Why we exist</h2>
          <p className="mt-3 text-muted">
            Global trade data is rich but overwhelming. Teams spend more time
            wrangling rows than making choices. Vaskodigama is built to invert
            that — to surface prioritised opportunities, explain the reasoning,
            and recommend a next step you can actually take.
          </p>
          <p className="mt-3 text-muted">
            This site is a demonstration build. The data shown is illustrative
            and not connected to a live customs feed. We’re honest about that on
            every screen.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <Card key={v.title}>
                <CardContent className="pt-5">
                  <Icon className="size-6 text-primary" aria-hidden />
                  <h3 className="mt-3 font-semibold text-navy">{v.title}</h3>
                  <p className="mt-1 text-sm text-muted">{v.body}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="mt-8">
          <ButtonLink href="/contact">Get in touch</ButtonLink>
        </div>
      </Section>
    </>
  );
}
