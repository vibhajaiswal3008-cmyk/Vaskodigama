import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { RegisterForm } from "@/components/forms/register-form";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Get Early Access | Create a Demo Account",
  description:
    "Create a demonstration Vaskodigama account to explore the trade-intelligence workspace. No real account is created and no email is sent.",
};

export default function SignupPage() {
  return (
    <Card>
      <CardContent className="pt-6">
        <Badge tone="warning" className="mb-3">
          Demo account
        </Badge>
        <h1 className="text-2xl font-bold text-navy">Get early access</h1>
        <p className="mt-1 text-sm text-muted">
          Create a demonstration account to explore the workspace. No real
          account is created, no password is stored, and no email is sent — you
          go straight into the demo.
        </p>
        <div className="mt-5">
          <RegisterForm />
        </div>

        <div className="mt-4 rounded-md border border-border bg-surface p-3 text-center">
          <p className="text-sm text-muted">Prefer a guided walkthrough?</p>
          <ButtonLink href="/contact" variant="outline" size="sm" className="mt-2">
            Request a Demo Instead
          </ButtonLink>
        </div>

        <p className="mt-4 text-center text-sm text-muted">
          Already exploring?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
