import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { RegisterForm } from "@/components/forms/register-form";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Create a demo account",
  description: "Create a demonstration account for the Vaskodigama application.",
};

export default function RegisterPage() {
  return (
    <Card>
      <CardContent className="pt-6">
        <Badge tone="warning" className="mb-3">
          Demonstration registration
        </Badge>
        <h1 className="text-2xl font-bold text-navy">Create your demo account</h1>
        <p className="mt-1 text-sm text-muted">
          No real account is created and no email is sent. You’ll go straight
          into the demonstration application.
        </p>
        <div className="mt-5">
          <RegisterForm />
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
