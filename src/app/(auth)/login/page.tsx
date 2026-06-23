import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { LoginForm } from "@/components/forms/login-form";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to the Vaskodigama demonstration application.",
};

export default function LoginPage() {
  return (
    <Card>
      <CardContent className="pt-6">
        <Badge tone="warning" className="mb-3">
          Demonstration sign-in
        </Badge>
        <h1 className="text-2xl font-bold text-navy">Welcome back</h1>
        <p className="mt-1 text-sm text-muted">
          This is a demo. Any valid-looking details will take you into the
          application — no real account is used.
        </p>
        <div className="mt-5">
          <LoginForm />
        </div>
        <p className="mt-4 text-center text-sm text-muted">
          New here?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Create a demo account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
